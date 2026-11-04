/* Void Bounce site: game loader + moderate Adsterra placements. */
(function () {
  "use strict";
  var HOST = "https://bauval.org";
  var KEYS = {
    "728": { key: "ab0f5e4aa8cdf478153cdf993a0c2768", w: 728, h: 90 },
    "320": { key: "bb2e288441172c78df1544fdb9f632ff", w: 320, h: 50 },
    "300": { key: "e1efd4d55667446390113692bd707f27", w: 300, h: 250 },
    "160": { key: "58c21fc47087792c004f70ee050bd808", w: 160, h: 600 },
  };
  var NATIVE = "ed5ff5072c93eb946d623a3599932db5";
  var SOCIAL_BAR = HOST + "/14/63cb9aca01d1b1748ee379d3f8f08bb5";
  var POPUNDER = "https://abscloud.org/1/b4a6a7e4dc74418bfb1d575152aa7c8e";
  var POP_EVERY_MS = 24 * 60 * 60 * 1000; /* at most one popunder per visitor per day */

  function store(k, v) {
    try { if (v === undefined) return localStorage.getItem(k); localStorage.setItem(k, v); } catch (e) { return null; }
  }

  function bannerFrame(spec) {
    var f = document.createElement("iframe");
    f.title = "Advertisement";
    f.width = spec.w; f.height = spec.h;
    f.style.width = spec.w + "px"; f.style.height = spec.h + "px";
    f.setAttribute("scrolling", "no");
    f.setAttribute("loading", "lazy");
    f.srcdoc = "<!doctype html><html><head><meta charset='utf-8'><style>html,body{margin:0;background:#1F0B45;overflow:hidden}</style></head><body>" +
      "<script>atOptions={'key':'" + spec.key + "','format':'iframe','height':" + spec.h + ",'width':" + spec.w + ",'params':{}};<\/script>" +
      "<script src='" + HOST + "/22/" + spec.key + "'><\/script></body></html>";
    return f;
  }

  function fill(slot) {
    if (slot.dataset.filled) return;
    var kind = slot.dataset.ad;
    if (!slot.offsetParent && kind !== "native") return; /* hidden at this width */
    slot.dataset.filled = "1";
    var label = document.createElement("small");
    label.textContent = "Advertisement";
    if (kind === "native") {
      var s = document.createElement("script");
      s.async = true; s.setAttribute("data-cfasync", "false");
      s.src = HOST + "/21/" + NATIVE;
      var c = document.createElement("div");
      c.id = "container-" + NATIVE;
      slot.appendChild(label); slot.appendChild(c); slot.appendChild(s);
      return;
    }
    if (kind === "leader") kind = window.innerWidth >= 780 ? "728" : "320";
    var spec = KEYS[kind];
    if (!spec) return;
    slot.appendChild(label);
    slot.appendChild(bannerFrame(spec));
  }

  function loadAds() {
    var slots = Array.prototype.slice.call(document.querySelectorAll("[data-ad]"));
    var natives = slots.filter(function (s) { return s.dataset.ad === "native"; });
    natives.slice(1).forEach(function (s) { s.remove(); }); /* one native unit per page */
    slots = Array.prototype.slice.call(document.querySelectorAll("[data-ad]"));
    if ("IntersectionObserver" in window) {
      var io = new IntersectionObserver(function (entries) {
        entries.forEach(function (e) { if (e.isIntersecting) { fill(e.target); io.unobserve(e.target); } });
      }, { rootMargin: "200px" });
      slots.forEach(function (s) { io.observe(s); });
    } else {
      slots.forEach(fill);
    }

    /* Social Bar: one small notification-style unit, a few seconds after load. */
    setTimeout(function () {
      var sb = document.createElement("script");
      sb.setAttribute("data-cfasync", "false");
      sb.src = SOCIAL_BAR;
      document.body.appendChild(sb);
    }, 6000);

    /* Popunder: at most once a day per visitor, never on the first page view. */
    var views = parseInt(store("vb_views") || "0", 10) + 1;
    store("vb_views", String(views));
    var last = parseInt(store("vb_pop") || "0", 10);
    if (views > 1 && Date.now() - last > POP_EVERY_MS) {
      store("vb_pop", String(Date.now()));
      var pu = document.createElement("script");
      pu.setAttribute("data-cfasync", "false");
      pu.src = POPUNDER;
      document.head.appendChild(pu);
    }
  }

  /* Click-to-play: the 70 MB game only loads when the visitor asks for it. */
  function setupGame() {
    var screen = document.querySelector("[data-game]");
    if (!screen) return;
    var btn = screen.querySelector(".play");
    var full = document.querySelector("[data-fullscreen]");
    function start() {
      if (screen.querySelector("iframe")) return;
      var f = document.createElement("iframe");
      f.src = screen.dataset.game;
      f.title = "Void Bounce game";
      f.allow = "autoplay; fullscreen; gamepad";
      f.setAttribute("allowfullscreen", "");
      screen.innerHTML = "";
      screen.appendChild(f);
      setTimeout(function () { try { f.focus(); } catch (e) {} }, 800);
      if (full) full.hidden = false;
    }
    if (btn) btn.addEventListener("click", start);
    if (location.hash === "#play") start();
    if (full) full.addEventListener("click", function () {
      var f = screen.querySelector("iframe") || screen;
      (f.requestFullscreen || f.webkitRequestFullscreen || function () {}).call(f);
    });
  }

  document.addEventListener("DOMContentLoaded", function () {
    setupGame();
    if (document.body.dataset.noAds !== "1") loadAds();
  });
})();
