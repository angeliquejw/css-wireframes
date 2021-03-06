function Ghost() {
  function e(e) {
    return void 0 == e ? !1 : "number" != typeof e ? e.indexOf("rem") > -1 ? parseFloat(e) * parseFloat(window.getComputedStyle(document.documentElement).fontSize) : e.indexOf("em") > -1 ? parseFloat(e) * parseFloat(window.getComputedStyle(t.containingElement).fontSize) : parseFloat(e) : void console.log('Ghost Grid says: baseLineHeight must be set to a string with the unit type declared (example: "24px")')
  }
  var t = this;
  t.align = "center", t.opacity = .75, t.breaks = [{
    containerWidth: !1,
    point: "(min-width: 800px)",
    columns: 12,
    gutters: .25,
    baseLineHeight: "1.5em"
  }], t.oldBreaks = [], t.grid = document.createElement("div"), t.gridContainer = document.createElement("div"), t.gridLineContainer = document.createElement("div"), t.gridSwitch = document.createElement("div"), t.grid.setAttribute("class", "gg-grid"), t.gridContainer.setAttribute("class", "gg-grid-container"), t.gridLineContainer.setAttribute("class", "gg-grid-line-container"), t.grid.appendChild(t.gridLineContainer), t.grid.appendChild(t.gridContainer), t.gridSwitch.setAttribute("class", "gg-grid-switch"), t.gridSwitch.innerHTML = "<i></i><i></i><i></i><i></i>", t.render = function (e) {
    t.containingElement = t.containingElement ? t.containingElement : document.body, t.containingElement.style.position = "relative", t.containingElement.appendChild(t.grid), t.containingElement.appendChild(t.gridSwitch), t.toggle = function () {
      t.containingElement.classList.toggle("gg-grid-hidden")
    }, t.gridSwitch.addEventListener("click", function () {
      t.toggle()
    }), t.renderOpacity(), t.renderContainerPosition(), t.renderContainerWidth(e), t.renderColumns(e), t.renderBaseline(e)
  }, t.renderOpacity = function () {
    t.grid.style.opacity = t.opacity
  }, t.renderContainerPosition = function () {
    switch (t.align) {
      case "left":
        t.gridContainer.style.marginLeft = "0", t.gridContainer.style.marginRight = "0";
        break;
      case "center":
        t.gridContainer.style.marginLeft = "auto", t.gridContainer.style.marginRight = "auto";
        break;
      case "right":
        t.gridContainer.style.marginLeft = "auto", t.gridContainer.style.marginRight = "0"
    }
  }, t.renderContainerWidth = function (e) {
    var i = "undefined" == typeof e ? t.breaks[0] : e,
      n = i.containerWidth > 0 ? i.containerWidth + "px" : "100%";
    t.gridContainer.style.maxWidth = n
  }, t.renderColumns = function (e) {
    var n = "undefined" == typeof e ? t.breaks[0] : e,
      r = n.gutters / (n.columns + n.columns * n.gutters) * 100,
      a = 100 / n.columns;
    for (t.gridContainer.innerHTML = "", i = 0; i < n.columns + 1; i++) {
      var o = document.createElement("div");
      o.style.paddingLeft = r / 2 + "%", o.style.paddingRight = r / 2 + "%", o.style.left = i * a - r / 2 + "%", t.gridContainer.appendChild(o)
    }
  }, t.renderBaseline = function (n) {
    var r = "undefined" == typeof n ? t.breaks[0] : n,
      a = e(r.baseLineHeight),
      o = t.containingElement,
      d = document.documentElement,
      s = Math.max(o.scrollHeight, o.offsetHeight, d.clientHeight, d.scrollHeight, d.offsetHeight),
      g = Math.round(s / a) + 40;
    for (t.gridLineContainer.innerHTML = "", i = 0; i < g; i++) {
      var c = document.createElement("div");
      c.setAttribute("class", "ghost-line"), c.style.height = r.baseLineHeight, t.gridLineContainer.appendChild(c)
    }
  };
  var n = function (e) {
    for (i = 0; i < t.breaks.length; i++)
      if (e == t.breaks[i].point) {
        var n = t.activeBreakPointIndex >= i ? i - 1 : i;
        return n = n >= t.breaks.length ? n - 1 : n, t.activeBreakPointIndex = n, t.breaks[n]
      }
  };
  return t.breakChange = function (e) {
    t.activeBreakPoint = n(e.media), t.render(t.activeBreakPoint)
  }, t.summon = function () {
    for (i = 0; i < t.oldBreaks.length; i++) t.oldBreaks[i].removeListener(t.breakChange);
    if (t.oldBreaks = [], t.activeBreakPoint = !1, window.matchMedia) {
      for (i = 0; i < t.breaks.length; i++) {
        var e = window.matchMedia(t.breaks[i].point);
        e.addListener(t.breakChange), t.oldBreaks.push(e), e.matches && (t.activeBreakPointIndex = i - 1, t.activeBreakPoint = n(e.media))
      }
      t.activeBreakPoint = t.activeBreakPoint ? t.activeBreakPoint : t.breaks[t.breaks[0]], t.render(t.activeBreakPoint)
    } else alert("Your browser does not support the MediaQueryList object. Ghosts hate old browsers. Get a new one.")
  }, t
}