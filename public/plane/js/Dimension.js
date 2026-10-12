/*
 * Linear Dimension Annotation Tool
 * 人工尺寸标注：线长与标签相互独立，不测距、不按数值改几何长度。
 */

MD.Dimension = function (privateMethods) {
  var MODE = "dimension";
  var TICK_SIZE = 10;
  var LABEL_OFFSET = 14;
  var MIN_LENGTH = 2;
  var svgns = "http://www.w3.org/2000/svg";

  var getNextId = privateMethods.getNextId;
  var addCommandToHistory = privateMethods.addCommandToHistory;
  var InsertElementCommand = privateMethods.InsertElementCommand;
  var ChangeElementCommand = privateMethods.ChangeElementCommand;
  var BatchCommand = privateMethods.BatchCommand;
  var call = privateMethods.call;

  // idle | drawing | editing-label
  var phase = "idle";
  var startPoint = null;
  var endPoint = null;
  var previewGroup = null;
  var isNewAnnotation = false;
  var labelBeforeEdit = "";
  var committing = false;

  function getZoom() {
    return svgCanvas.getZoom() || 1;
  }

  function ensureInput() {
    if ($("#dimension_label_input").length) return;
    $("body").append(
      '<input id="dimension_label_input" type="text" autocomplete="off" spellcheck="false" />'
    );
    var $input = $("#dimension_label_input");
    $input.on("keydown", function (e) {
      if (e.key === "Enter") {
        e.preventDefault();
        e.stopPropagation();
        commitLabel({ save: true });
      } else if (e.key === "Escape") {
        e.preventDefault();
        e.stopPropagation();
        cancelLabelEdit();
      }
    });
    // 失去焦点时与文本工具一致：自动保存到画布
    $input.on("blur", function () {
      if (committing) return;
      if (phase !== "editing-label") return;
      commitLabel({ save: true });
    });
    $input.on("mousedown click", function (e) {
      e.stopPropagation();
    });
  }

  function hideInput() {
    var $input = $("#dimension_label_input");
    if ($input.length) {
      // 先摘掉焦点回调，避免 hide/blur 递归触发 commit
      committing = true;
      $input.hide().val("").blur();
      committing = false;
    }
  }

  function createLine(x1, y1, x2, y2) {
    var line = document.createElementNS(svgns, "line");
    line.setAttribute("x1", x1);
    line.setAttribute("y1", y1);
    line.setAttribute("x2", x2);
    line.setAttribute("y2", y2);
    line.setAttribute("stroke", "#555555");
    line.setAttribute("stroke-width", "1");
    line.setAttribute("fill", "none");
    line.setAttribute("stroke-linecap", "butt");
    return line;
  }

  // 透明加粗线，方便点中和拖动整组标注，不改变看到的线宽
  function createHitLine(x1, y1, x2, y2) {
    var line = createLine(x1, y1, x2, y2);
    line.setAttribute("stroke", "#000000");
    line.setAttribute("stroke-width", "20");
    line.setAttribute("stroke-opacity", "0");
    line.setAttribute("stroke-linecap", "round");
    line.setAttribute("pointer-events", "stroke");
    line.setAttribute("data-dimension-hit", "1");
    return line;
  }

  var DEFAULT_FONT_SIZE = 13;
  var MIN_FONT_SIZE = 1;
  var MAX_FONT_SIZE = 400;

  // 与尺寸线平行，并翻转到可读方向（仍与线条平行）
  function lineAngle(x1, y1, x2, y2) {
    var deg = (Math.atan2(y2 - y1, x2 - x1) * 180) / Math.PI;
    if (deg > 90) deg -= 180;
    else if (deg <= -90) deg += 180;
    return Math.round(deg * 100) / 100;
  }

  function normalizeUserAngle(deg) {
    if (!isFinite(deg)) return 0;
    deg = deg % 360;
    if (deg > 180) deg -= 360;
    if (deg <= -180) deg += 360;
    return Math.round(deg * 100) / 100;
  }

  function clampFontSize(size) {
    size = parseFloat(size);
    if (!(size > 0)) size = DEFAULT_FONT_SIZE;
    size = Math.max(MIN_FONT_SIZE, Math.min(MAX_FONT_SIZE, size));
    return Math.round(size * 10) / 10;
  }

  function applyTextRotation(text, angle) {
    if (!text) return;
    var x = parseFloat(text.getAttribute("x")) || 0;
    var y = parseFloat(text.getAttribute("y")) || 0;
    if (!angle) {
      text.removeAttribute("transform");
      return;
    }
    text.setAttribute(
      "transform",
      "rotate(" + angle + " " + x + " " + y + ")"
    );
  }

  function createText(x, y, label, angle, fontSize) {
    var text = document.createElementNS(svgns, "text");
    text.setAttribute("x", x);
    text.setAttribute("y", y);
    text.setAttribute("fill", "#333333");
    text.setAttribute("font-size", fontSize || DEFAULT_FONT_SIZE);
    text.setAttribute("font-family", "sans-serif");
    text.setAttribute("font-weight", "500");
    text.setAttribute("text-anchor", "middle");
    text.setAttribute("dominant-baseline", "middle");
    text.setAttribute("data-dimension-label", "1");
    text.setAttribute("pointer-events", "bounding-box");
    text.textContent = label || "";
    applyTextRotation(text, angle);
    return text;
  }

  function getPerp(x1, y1, x2, y2) {
    var dx = x2 - x1;
    var dy = y2 - y1;
    var len = Math.sqrt(dx * dx + dy * dy);
    if (len < 1e-6) {
      return { nx: 0, ny: 1, len: 0 };
    }
    return { nx: -dy / len, ny: dx / len, len: len };
  }

  function updateGeometry(group, x1, y1, x2, y2, label) {
    if (!group) return;
    var perp = getPerp(x1, y1, x2, y2);
    var nx = perp.nx;
    var ny = perp.ny;
    var tick = TICK_SIZE;

    while (group.firstChild) {
      group.removeChild(group.firstChild);
    }

    group.appendChild(createLine(x1, y1, x2, y2));
    group.appendChild(
      createLine(x1 + nx * tick, y1 + ny * tick, x1 - nx * tick, y1 - ny * tick)
    );
    group.appendChild(
      createLine(x2 + nx * tick, y2 + ny * tick, x2 - nx * tick, y2 - ny * tick)
    );

    var mx = (x1 + x2) / 2 + nx * LABEL_OFFSET;
    var my = (y1 + y2) / 2 + ny * LABEL_OFFSET;
    if (group.hasAttribute("data-label-x") && group.hasAttribute("data-label-y")) {
      var savedX = parseFloat(group.getAttribute("data-label-x"));
      var savedY = parseFloat(group.getAttribute("data-label-y"));
      if (isFinite(savedX) && isFinite(savedY)) {
        mx = savedX;
        my = savedY;
      }
    }
    var displayLabel =
      label == null ? group.getAttribute("data-label") || "" : label;

    // 只显示文字标签，不显示矩形边框。
    // 默认与尺寸线平行；已单独旋转/缩放过的文字沿用保存的角度和字号。
    if (displayLabel) {
      var angle = group.hasAttribute("data-label-angle")
        ? parseFloat(group.getAttribute("data-label-angle")) || 0
        : lineAngle(x1, y1, x2, y2);
      var fontSize = clampFontSize(group.getAttribute("data-label-size"));
      if (!group.hasAttribute("data-label-size")) fontSize = DEFAULT_FONT_SIZE;
      group.appendChild(createText(mx, my, displayLabel, angle, fontSize));
      group.setAttribute("data-label-angle", angle);
      group.setAttribute("data-label-size", fontSize);
      group.setAttribute("data-label-x", mx);
      group.setAttribute("data-label-y", my);
    }

    group.appendChild(createHitLine(x1, y1, x2, y2));
    group.appendChild(
      createHitLine(x1 + nx * tick, y1 + ny * tick, x1 - nx * tick, y1 - ny * tick)
    );
    group.appendChild(
      createHitLine(x2 + nx * tick, y2 + ny * tick, x2 - nx * tick, y2 - ny * tick)
    );

    group.setAttribute("data-x1", x1);
    group.setAttribute("data-y1", y1);
    group.setAttribute("data-x2", x2);
    group.setAttribute("data-y2", y2);
  }

  function createPreviewGroup(x1, y1, x2, y2) {
    var layer = svgCanvas.getCurrentDrawing().getCurrentLayer();
    var g = document.createElementNS(svgns, "g");
    g.setAttribute("id", getNextId());
    g.setAttribute("data-dimension", "1");
    g.setAttribute("data-type", "dimension-annotation");
    g.setAttribute("data-label", "");
    g.setAttribute("opacity", "0.85");
    layer.appendChild(g);
    updateGeometry(g, x1, y1, x2, y2, "");
    return g;
  }

  function cancelDraft() {
    hideInput();
    if (previewGroup && isNewAnnotation && previewGroup.parentNode) {
      previewGroup.parentNode.removeChild(previewGroup);
    } else if (previewGroup && !isNewAnnotation) {
      var x1 = parseFloat(previewGroup.getAttribute("data-x1"));
      var y1 = parseFloat(previewGroup.getAttribute("data-y1"));
      var x2 = parseFloat(previewGroup.getAttribute("data-x2"));
      var y2 = parseFloat(previewGroup.getAttribute("data-y2"));
      updateGeometry(previewGroup, x1, y1, x2, y2, labelBeforeEdit);
      previewGroup.setAttribute("data-label", labelBeforeEdit);
    }
    phase = "idle";
    startPoint = null;
    endPoint = null;
    previewGroup = null;
    isNewAnnotation = false;
    labelBeforeEdit = "";
  }

  function readEndpoints(group) {
    var line = group.querySelector("line:not([data-dimension-hit='1'])");
    if (line) {
      return {
        x1: parseFloat(line.getAttribute("x1")),
        y1: parseFloat(line.getAttribute("y1")),
        x2: parseFloat(line.getAttribute("x2")),
        y2: parseFloat(line.getAttribute("y2")),
      };
    }
    return {
      x1: parseFloat(group.getAttribute("data-x1")),
      y1: parseFloat(group.getAttribute("data-y1")),
      x2: parseFloat(group.getAttribute("data-x2")),
      y2: parseFloat(group.getAttribute("data-y2")),
    };
  }

  function positionInputNearGroup(group) {
    ensureInput();
    var $input = $("#dimension_label_input");
    var pts = readEndpoints(group);
    var x1 = pts.x1;
    var y1 = pts.y1;
    var x2 = pts.x2;
    var y2 = pts.y2;
    var perp = getPerp(x1, y1, x2, y2);
    var mx = (x1 + x2) / 2 + perp.nx * LABEL_OFFSET;
    var my = (y1 + y2) / 2 + perp.ny * LABEL_OFFSET;

    var contentG = document.getElementById("svgcontent").querySelector("g");
    var ctm = contentG.getScreenCTM();
    if (!ctm) {
      $input.css({
        left: "50%",
        top: "50%",
        display: "block",
      });
      return $input;
    }
    var sx = ctm.a * mx + ctm.c * my + ctm.e;
    var sy = ctm.b * mx + ctm.d * my + ctm.f;
    $input.css({
      left: sx - 40 + "px",
      top: sy - 12 + "px",
      display: "block",
    });
    return $input;
  }

  function showLabelInput(group, editingExisting) {
    previewGroup = group;
    isNewAnnotation = !editingExisting;
    labelBeforeEdit = group.getAttribute("data-label") || "";
    phase = "editing-label";
    var $input = positionInputNearGroup(group);
    $input.val(labelBeforeEdit);
    setTimeout(function () {
      $input.trigger("focus").select();
    }, 0);
  }

  function commitLabel(options) {
    options = options || {};
    if (phase !== "editing-label" || !previewGroup) return;
    if (committing) return;
    committing = true;

    var $input = $("#dimension_label_input");
    var label = ($input.val() || "").trim();
    // 新建时未填内容：仍保存尺寸线，标签可为空；编辑时若清空则恢复原标签
    if (!label && !isNewAnnotation) {
      label = labelBeforeEdit;
    }

    var pts = readEndpoints(previewGroup);
    var x1 = pts.x1;
    var y1 = pts.y1;
    var x2 = pts.x2;
    var y2 = pts.y2;
    var oldLabel = previewGroup.getAttribute("data-label") || "";
    var finished = previewGroup;
    var wasNew = isNewAnnotation;

    previewGroup.setAttribute("data-label", label);
    previewGroup.setAttribute("opacity", "1");
    updateGeometry(previewGroup, x1, y1, x2, y2, label);

    if (wasNew) {
      addCommandToHistory(new InsertElementCommand(previewGroup));
      call("changed", [previewGroup]);
    } else if (oldLabel !== label) {
      try {
        var batch = new BatchCommand("Edit Dimension Label");
        var cmd = new ChangeElementCommand(previewGroup, {
          "data-label": oldLabel,
        });
        batch.addSubCommand(cmd);
        addCommandToHistory(batch);
      } catch (err) {
        /* ignore history failures */
      }
      call("changed", [previewGroup]);
    }

    $input.hide().val("");
    phase = "idle";
    startPoint = null;
    endPoint = null;
    previewGroup = null;
    isNewAnnotation = false;
    labelBeforeEdit = "";
    committing = false;

    state.set("canvasMode", "select");
    try {
      var labelEl = finished.querySelector("[data-dimension-label='1']");
      svgCanvas.selectOnly([labelEl || finished], true);
    } catch (err) {
      /* ignore */
    }

    if (options.save !== false && typeof editor !== "undefined" && editor.saveCanvas) {
      editor.saveCanvas();
    }
  }

  function cancelLabelEdit() {
    cancelDraft();
    if (svgCanvas.getMode() === MODE) {
      state.set("canvasMode", "select");
    }
  }

  function findDimensionGroup(target) {
    if (!target || !target.closest) return null;
    return target.closest("[data-dimension='1']");
  }

  // Esc：取消当前未完成操作
  document.addEventListener(
    "keydown",
    function (e) {
      if (e.key !== "Escape") return;
      if (phase === "drawing" || phase === "editing-label") {
        e.preventDefault();
        e.stopPropagation();
        cancelDraft();
        state.set("canvasMode", "select");
      }
    },
    true
  );

  // 双击标签编辑文字（不改变几何）
  document.addEventListener(
    "dblclick",
    function (e) {
      var group = findDimensionGroup(e.target);
      if (!group) return;
      if (phase === "drawing" || phase === "editing-label") return;
      e.preventDefault();
      e.stopPropagation();
      showLabelInput(group, true);
    },
    true
  );

  // 离开尺寸工具：绘制中取消；编辑标签中则自动保存
  var originalSetMode = editor.toolbar.setMode.bind(editor.toolbar);
  editor.toolbar.setMode = function (mode) {
    if (mode !== MODE) {
      if (phase === "editing-label") {
        commitLabel({ save: true });
      } else if (phase === "drawing") {
        cancelDraft();
      }
    }
    return originalSetMode(mode);
  };

  var scaleState = null;
  var rotateState = null;
  var angleDrag = null;
  var sizeDrag = null;
  var selectorManager = privateMethods.selectorManager;

  function labelOf(el) {
    if (!el || !el.getAttribute) return null;
    if (el.getAttribute("data-dimension-label") === "1") return el;
    if (el.getAttribute("data-dimension") === "1") {
      return el.querySelector("[data-dimension-label='1']");
    }
    return null;
  }

  function groupOf(el) {
    if (!el || !el.getAttribute) return null;
    if (el.getAttribute("data-dimension") === "1") return el;
    if (el.getAttribute("data-dimension-label") === "1" && el.closest) {
      return el.closest("[data-dimension='1']");
    }
    return null;
  }

  function syncAngleWidgets(angle) {
    var shown = Math.round(angle);
    var input = document.getElementById("angle");
    if (input && document.activeElement !== input) input.value = shown;
    $("#tool_angle_indicator").css("transform", "rotate(" + angle + "deg)");
  }

  function syncSizeWidget(size) {
    var input = document.getElementById("font_size");
    if (input && document.activeElement !== input) input.value = size;
  }

  function refreshSelector(group) {
    try {
      var selected = svgCanvas.getSelectedElems()[0];
      if (!selected || (selected !== group && selected !== labelOf(group))) return;
      var sel = selectorManager.requestSelector(selected);
      if (sel) sel.resize();
    } catch (err) {
      /* ignore */
    }
  }

  function pushLabelHistory(text, group, oldGroupAttrs, label, oldLabelAttrs) {
    var batch = new BatchCommand(text);
    if (group && oldGroupAttrs) {
      batch.addSubCommand(new ChangeElementCommand(group, oldGroupAttrs));
    }
    if (label && oldLabelAttrs) {
      batch.addSubCommand(new ChangeElementCommand(label, oldLabelAttrs));
    }
    if (!batch.isEmpty()) addCommandToHistory(batch);
  }

  function setAngle(group, angle, preventUndo) {
    if (!group) return;
    angle = normalizeUserAngle(angle);
    var label = labelOf(group);
    var oldAngle = group.getAttribute("data-label-angle");
    var oldTransform = label ? label.getAttribute("transform") : null;
    group.setAttribute("data-label-angle", angle);
    if (label) applyTextRotation(label, angle);
    syncAngleWidgets(angle);
    refreshSelector(group);
    if (!preventUndo && String(oldAngle) !== String(angle)) {
      pushLabelHistory(
        "Rotate Dimension Label",
        group,
        { "data-label-angle": oldAngle },
        label,
        label ? { transform: oldTransform } : null
      );
    }
  }

  function setSize(group, size, preventUndo) {
    if (!group) return;
    size = clampFontSize(size);
    var label = labelOf(group);
    var oldSize = group.getAttribute("data-label-size");
    var oldFont = label ? label.getAttribute("font-size") : null;
    group.setAttribute("data-label-size", size);
    if (label) {
      label.setAttribute("font-size", size);
      var angle = parseFloat(group.getAttribute("data-label-angle")) || 0;
      applyTextRotation(label, angle);
    }
    syncSizeWidget(size);
    refreshSelector(group);
    if (!preventUndo && String(oldFont) !== String(size)) {
      pushLabelHistory(
        "Scale Dimension Label",
        group,
        { "data-label-size": oldSize },
        label,
        label ? { "font-size": oldFont } : null
      );
    }
  }

  function ensureHitLines(root) {
    var scope = root && root.querySelectorAll ? root : document;
    var groups = scope.querySelectorAll("[data-dimension='1']");
    for (var i = 0; i < groups.length; i++) {
      var group = groups[i];
      if (group.querySelector("[data-dimension-hit='1']")) continue;
      var pts = readEndpoints(group);
      if (!isFinite(pts.x1) || !isFinite(pts.x2)) continue;
      var perp = getPerp(pts.x1, pts.y1, pts.x2, pts.y2);
      var nx = perp.nx;
      var ny = perp.ny;
      var tick = TICK_SIZE;
      group.appendChild(createHitLine(pts.x1, pts.y1, pts.x2, pts.y2));
      group.appendChild(
        createHitLine(pts.x1 + nx * tick, pts.y1 + ny * tick, pts.x1 - nx * tick, pts.y1 - ny * tick)
      );
      group.appendChild(
        createHitLine(pts.x2 + nx * tick, pts.y2 + ny * tick, pts.x2 - nx * tick, pts.y2 - ny * tick)
      );
    }
  }

  function ensureDefaultPose(root) {
    var scope = root && root.querySelectorAll ? root : document;
    var groups = scope.querySelectorAll("[data-dimension='1']:not([data-label-angle])");
    for (var i = 0; i < groups.length; i++) {
      var group = groups[i];
      var label = labelOf(group);
      if (!label || label.getAttribute("transform")) continue;
      var pts = readEndpoints(group);
      if (!isFinite(pts.x1) || !isFinite(pts.x2)) continue;
      var angle = lineAngle(pts.x1, pts.y1, pts.x2, pts.y2);
      var size = clampFontSize(label.getAttribute("font-size"));
      group.setAttribute("data-label-angle", angle);
      group.setAttribute("data-label-size", size);
      label.setAttribute("font-size", size);
      applyTextRotation(label, angle);
    }
  }

  setTimeout(function () {
    ensureDefaultPose(document.getElementById("svgcontent"));
    ensureHitLines(document.getElementById("svgcontent"));
  }, 0);

  MD.dimensionLabel = {
    isGroup: function (el) {
      return !!(el && el.getAttribute && el.getAttribute("data-dimension") === "1");
    },
    labelOf: labelOf,
    groupOf: groupOf,
    beginRotate: function (target, x, y) {
      var group = groupOf(target);
      var label = labelOf(group);
      if (!group || !label) {
        rotateState = null;
        return false;
      }
      var cx = parseFloat(label.getAttribute("x")) || 0;
      var cy = parseFloat(label.getAttribute("y")) || 0;
      var pointer = (Math.atan2(y - cy, x - cx) * 180) / Math.PI;
      var current = parseFloat(group.getAttribute("data-label-angle"));
      if (isNaN(current)) current = svgedit.utilities.getRotationAngle(label) || 0;
      rotateState = {
        group: group,
        label: label,
        cx: cx,
        cy: cy,
        pointer: pointer,
        angle: current,
      };
      return true;
    },
    isRotating: function () {
      return !!rotateState;
    },
    moveRotate: function (x, y, snap) {
      if (!rotateState) return;
      var pointer =
        (Math.atan2(y - rotateState.cy, x - rotateState.cx) * 180) / Math.PI;
      var angle = rotateState.angle + (pointer - rotateState.pointer);
      if (snap) angle = Math.round(angle / 45) * 45;
      setAngle(rotateState.group, angle, true);
    },
    beginScale: function (target) {
      var group = groupOf(target);
      var label = labelOf(group);
      if (!group || !label) {
        scaleState = null;
        return false;
      }
      var box = label.getBBox();
      scaleState = {
        group: group,
        label: label,
        base: parseFloat(label.getAttribute("font-size")) || DEFAULT_FONT_SIZE,
        w: Math.max((box && box.width) || 0, 8),
        h: Math.max((box && box.height) || 0, 8),
        oldSize: group.getAttribute("data-label-size"),
        oldFont: label.getAttribute("font-size"),
      };
      return true;
    },
    isScaling: function () {
      return !!scaleState;
    },
    moveScale: function (dx, dy, mode) {
      if (!scaleState || !mode) return;
      var w = scaleState.w;
      var h = scaleState.h;
      var signed = 0;
      var parts = 0;
      if (mode.indexOf("e") >= 0) {
        signed += dx / w;
        parts++;
      }
      if (mode.indexOf("w") >= 0) {
        signed += -dx / w;
        parts++;
      }
      if (mode.indexOf("s") >= 0) {
        signed += dy / h;
        parts++;
      }
      if (mode.indexOf("n") >= 0) {
        signed += -dy / h;
        parts++;
      }
      var factor = 1 + (parts ? signed / parts : 0);
      if (factor < 0.15) factor = 0.15;
      setSize(scaleState.group, scaleState.base * factor, true);
    },
    endGesture: function () {
      if (scaleState) {
        var group = scaleState.group;
        var label = scaleState.label;
        var newFont = label.getAttribute("font-size");
        if (String(newFont) !== String(scaleState.oldFont)) {
          pushLabelHistory(
            "Scale Dimension Label",
            group,
            { "data-label-size": scaleState.oldSize },
            label,
            { "font-size": scaleState.oldFont }
          );
        }
        scaleState = null;
      }
      rotateState = null;
    },
  };

  var originalSetRotationAngle = svgCanvas.setRotationAngle.bind(svgCanvas);
  svgCanvas.setRotationAngle = function (val, preventUndo) {
    var selected = svgCanvas.getSelectedElems()[0];
    // 选中整组时旋转整组（线 + 文字）；只选中文字时才单独转文字
    originalSetRotationAngle(val, preventUndo);
    if (
      selected &&
      selected.getAttribute &&
      selected.getAttribute("data-dimension-label") === "1"
    ) {
      var group = groupOf(selected);
      if (group) {
        var ang = svgedit.utilities.getRotationAngle(selected) || 0;
        group.setAttribute("data-label-angle", normalizeUserAngle(ang));
      }
    }
  };

  var originalSetFontSize = svgCanvas.setFontSize.bind(svgCanvas);
  svgCanvas.setFontSize = function (val) {
    var selected = svgCanvas.getSelectedElems()[0];
    var group = groupOf(selected);
    if (
      group &&
      labelOf(group) &&
      (MD.dimensionLabel.isGroup(selected) ||
        selected.getAttribute("data-dimension-label") === "1")
    ) {
      // 拖动过程不逐帧写入历史，松手时由 sizeDrag 统一记录
      setSize(group, val, true);
      return;
    }
    originalSetFontSize(val);
  };

  $("#angle, #tool_angle").on("mousedown.dimensionLabel", function () {
    var group = groupOf(svgCanvas.getSelectedElems()[0]);
    var label = labelOf(group);
    if (!group || !label) {
      angleDrag = null;
      return;
    }
    angleDrag = {
      group: group,
      label: label,
      oldAngle: group.getAttribute("data-label-angle"),
      oldTransform: label.getAttribute("transform"),
    };
  });

  $("#font_size, #tool_font_size").on("mousedown.dimensionLabel", function () {
    var group = groupOf(svgCanvas.getSelectedElems()[0]);
    var label = labelOf(group);
    if (!group || !label) {
      sizeDrag = null;
      return;
    }
    sizeDrag = {
      group: group,
      label: label,
      oldSize: group.getAttribute("data-label-size"),
      oldFont: label.getAttribute("font-size"),
    };
  });

  $(window).on("mouseup.dimensionLabel", function () {
    var pendingAngle = angleDrag;
    var pendingSize = sizeDrag;
    if (!pendingAngle && !pendingSize) return;
    angleDrag = null;
    sizeDrag = null;
    // 等数值控件的 mouseup 把最终值写完，再记一笔撤销
    setTimeout(function () {
      if (
        pendingAngle &&
        pendingAngle.label &&
        String(pendingAngle.group.getAttribute("data-label-angle")) !==
          String(pendingAngle.oldAngle)
      ) {
        pushLabelHistory(
          "Rotate Dimension Label",
          pendingAngle.group,
          { "data-label-angle": pendingAngle.oldAngle },
          pendingAngle.label,
          { transform: pendingAngle.oldTransform }
        );
      }
      if (
        pendingSize &&
        pendingSize.label &&
        String(pendingSize.label.getAttribute("font-size")) !==
          String(pendingSize.oldFont)
      ) {
        pushLabelHistory(
          "Scale Dimension Label",
          pendingSize.group,
          { "data-label-size": pendingSize.oldSize },
          pendingSize.label,
          { "font-size": pendingSize.oldFont }
        );
      }
    }, 0);
  });

  return {
    name: "dimension",
    mouseDown: function (opts) {
      if (svgCanvas.getMode() !== MODE) return;
      if (phase === "editing-label") {
        // 点击画布其他位置：先保存当前标签
        commitLabel({ save: true });
        return { started: false };
      }

      var x = opts.start_x;
      var y = opts.start_y;

      if (phase === "idle") {
        try {
          svgCanvas.clearSelection();
        } catch (err) {
          /* ignore */
        }
        startPoint = { x: x, y: y };
        endPoint = { x: x, y: y };
        previewGroup = createPreviewGroup(x, y, x, y);
        isNewAnnotation = true;
        phase = "drawing";
        return { started: true };
      }

      if (phase === "drawing") {
        endPoint = { x: x, y: y };
        var dx = endPoint.x - startPoint.x;
        var dy = endPoint.y - startPoint.y;
        if (Math.sqrt(dx * dx + dy * dy) < MIN_LENGTH) {
          return { started: true };
        }
        updateGeometry(
          previewGroup,
          startPoint.x,
          startPoint.y,
          endPoint.x,
          endPoint.y,
          ""
        );
        showLabelInput(previewGroup, false);
        return { started: true };
      }
    },
    mouseMove: function (opts) {
      if (svgCanvas.getMode() !== MODE) return;
      if (phase !== "drawing" || !previewGroup || !startPoint) return;
      var zoom = getZoom();
      var x = opts.mouse_x / zoom;
      var y = opts.mouse_y / zoom;
      endPoint = { x: x, y: y };
      updateGeometry(
        previewGroup,
        startPoint.x,
        startPoint.y,
        endPoint.x,
        endPoint.y,
        ""
      );
    },
    mouseUp: function (opts) {
      if (MD.dimensionLabel) MD.dimensionLabel.endGesture();
      if (svgCanvas.getMode() !== MODE) return;
      if (phase === "drawing") {
        return { started: true, keep: true, element: null };
      }
      if (phase === "editing-label") {
        return { started: false, keep: true, element: null };
      }
    },
    elementChanged: function (vars) {
      ensureDefaultPose(document.getElementById("svgcontent"));
    ensureHitLines(document.getElementById("svgcontent"));
      var elems = (vars && vars.elems) || [];
      for (var i = 0; i < elems.length; i++) {
        var el = elems[i];
        if (!el || !el.getAttribute) continue;
        var labelEl = el.getAttribute("data-dimension-label") === "1" ? el : labelOf(el);
        var group = el.getAttribute("data-dimension") === "1" ? el : groupOf(el);
        if (!labelEl || !group) continue;
        var ang = normalizeUserAngle(svgedit.utilities.getRotationAngle(labelEl) || 0);
        group.setAttribute("data-label-angle", ang);
        group.setAttribute("data-label-x", labelEl.getAttribute("x"));
        group.setAttribute("data-label-y", labelEl.getAttribute("y"));
        var fs = parseFloat(labelEl.getAttribute("font-size"));
        if (fs > 0) group.setAttribute("data-label-size", clampFontSize(fs));
      }
    },
    onNewDocument: function () {
      cancelDraft();
    },
  };
};
