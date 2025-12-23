function State() {
  const _self = this;
  const tenThousandThings = dao.map((thing) => thing.name);
  const saveableKeys = dao
    .filter((thing) => thing.save)
    .map((thing) => thing.name);
  const ID = window.location.pathname;

  this.data = _loadData();

  this.set = (key, val) => {
    key = key.split("-")[0] || key;
    if (tenThousandThings.indexOf(key) === -1)
      return console.warn(key + " not implemented");
    const archetype = dao.find((thing) => thing.name === key);
    val = _self.data[_getKey(key)] = archetype.clean(val);
    if (~saveableKeys.indexOf(key)) _save(_getKey(key), val);
    _self[key](val);
  };

  this.get = (key) => {
    return _self.data[_getKey(key)];
  };

  this.refresh = () => {
    dao.forEach((thing) => this[thing.name](this.get(thing.name)));
  };

  // canvas data
  this.canvasId = (id) => {
    /* noop */
  };
  this.canvasMode = (mode) => {
    editor.toolbar.setMode(mode);
  };
  this.canvasTitle = (str) => {
    editor.canvas.rename(str);
  };
  this.canvasSize = (size) => {
    editor.canvas.resize(...size);
  };
  this.canvasContent = (svgString) => {
    /* noop */
  };
  this.canvasRulers = (bool) => {
    /* noop */
  };
  this.canvasFill = (paint) => {
    /* noop */
  };
  this.canvasStroke = (paint) => {
    /* noop */
  };
  this.canvasBackground = (paint) => {
    /* noop */
  };
  this.darkmode = (isDark) => {
    editor.darkmode.set(isDark);
  };

  this.clean = (warn = true) => {
    if (warn) {
      const confirmed = confirm(
        "这将清除所有编辑器配置和画布内容，确定要继续吗？"
      );
      if (!confirmed) return;
    }

    Object.keys(localStorage).forEach((key) => localStorage.removeItem(key));
    window.location.reload();
  };

  // INNER UTILS

  function _save(key, val) {
    // basic checks
    if (val === undefined || val === null)
      throw "wont save nuthin, " + key + " " + val;
    // 处理带前缀的key，提取原始name
    const originalName = key.replace(/^(plane-|facade-)/, "");
    const archetype = dao.find((thing) => thing.name === originalName);
    if (!archetype) throw "Unknown archetype for key: " + key;
    const isObject = archetype.type === "object";
    localStorage.setItem(
      "md" + "-" + key,
      isObject ? JSON.stringify(val) : val.toString()
    );
  }

  function _getKey(name) {
    // 根据路径判断是平面图还是立面图，canvas相关数据使用不同的key前缀
    const isCanvasData = name.indexOf("canvas") !== -1;
    if (isCanvasData) {
      // 立面图使用 "facade-" 前缀，如果已经有前缀就不重复添加
      if (name.indexOf("plane-") === 0 || name.indexOf("facade-") === 0) {
        return name;
      }
      return "facade-" + name;
    }
    // 非canvas数据使用原始key（如darkmode等共享配置）
    return name;
  }

  function _loadData() {
    const data = dao.map((thing) => {
      return {
        [_getKey(thing.name)]: _getValue(
          _getKey(thing.name),
          utils.findGetParameter(thing.name) || thing.default
        ),
      };
    });
    return Object.assign({}, ...data);
  }

  function _getValue(key, def) {
    const item = localStorage.getItem("md-" + key) || def;
    // 处理带前缀的key，提取原始name
    const originalName = key.replace(/^(plane-|facade-)/, "");
    const archetype = dao.find((thing) => thing.name === originalName);
    if (archetype) return archetype.clean(item);
    else throw "Unkown archetype";
  }
}
