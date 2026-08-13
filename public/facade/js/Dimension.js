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

  function createText(x, y, label) {
    var text = document.createElementNS(svgns, "text");
    text.setAttribute("x", x);
    text.setAttribute("y", y);
    text.setAttribute("fill", "#333333");
    text.setAttribute("font-size", "13");
    text.setAttribute("font-family", "sans-serif");
    text.setAttribute("font-weight", "500");
    text.setAttribute("text-anchor", "middle");
    text.setAttribute("dominant-baseline", "middle");
    text.setAttribute("data-dimension-label", "1");
    text.textContent = label || "";
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
    var displayLabel =
      label == null ? group.getAttribute("data-label") || "" : label;

    // 只显示文字标签，不显示矩形边框
    if (displayLabel) {
      group.appendChild(createText(mx, my, displayLabel));
    }

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

  function positionInputNearGroup(group) {
    ensureInput();
    var $input = $("#dimension_label_input");
    var x1 = parseFloat(group.getAttribute("data-x1"));
    var y1 = parseFloat(group.getAttribute("data-y1"));
    var x2 = parseFloat(group.getAttribute("data-x2"));
    var y2 = parseFloat(group.getAttribute("data-y2"));
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

    var x1 = parseFloat(previewGroup.getAttribute("data-x1"));
    var y1 = parseFloat(previewGroup.getAttribute("data-y1"));
    var x2 = parseFloat(previewGroup.getAttribute("data-x2"));
    var y2 = parseFloat(previewGroup.getAttribute("data-y2"));
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
      svgCanvas.selectOnly([finished], true);
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
      if (svgCanvas.getMode() !== MODE) return;
      if (phase === "drawing") {
        return { started: true, keep: true, element: null };
      }
      if (phase === "editing-label") {
        return { started: false, keep: true, element: null };
      }
    },
    onNewDocument: function () {
      cancelDraft();
    },
  };
};
