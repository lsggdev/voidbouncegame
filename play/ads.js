/* Void Bounce — ad bridge for the game page.
 *
 * The game (Godot) calls the standard H5 Games Ads function `adBreak()`.
 * This file provides it and routes each request:
 *   - type "reward"  -> Google AdSense H5 Games Ads (only if configured;
 *                       otherwise reports "no ad" and the game hides the
 *                       "watch an ad" buttons via window.vbRecompensa).
 *   - anything else  -> a short Adsterra interstitial between levels,
 *                       frequency-capped so it stays moderate.
 */
(function () {
  "use strict";
  var cfg = window.VB_CONFIG || {};
  var hasAdsense = typeof cfg.adsenseClient === "string" && /^ca-pub-\d+$/.test(cfg.adsenseClient);

  /* Tells the game whether rewarded ads exist on this page. */
  window.vbRecompensa = hasAdsense;

  var adsensePush = null;
  if (hasAdsense) {
    var s = document.createElement("script");
    s.async = true;
    s.src = "https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=" + cfg.adsenseClient;
    s.setAttribute("data-ad-client", cfg.adsenseClient);
    s.setAttribute("data-ad-frequency-hint", "30s");
    if (cfg.adsenseTest) s.setAttribute("data-adbreak-test", "on");
    s.crossOrigin = "anonymous";
    document.head.appendChild(s);
    window.adsbygoogle = window.adsbygoogle || [];
    adsensePush = function (o) { window.adsbygoogle.push(o); };
    adsensePush({ preloadAdBreaks: "on", sound: "on" });
  }

  var started = Date.now();
  var lastInterstitial = 0;

  function done(o, status) {
    if (o && typeof o.adBreakDone === "function") {
      setTimeout(function () { o.adBreakDone({ breakStatus: status }); }, 0);
    }
  }

  function showInterstitial(o) {
    var now = Date.now();
    var every = (cfg.interstitialEverySeconds || 240) * 1000;
    var grace = (cfg.interstitialGraceSeconds || 120) * 1000;
    if (!cfg.adsterraBanner300 || now - started < grace || now - lastInterstitial < every) {
      done(o, "frequencyCapped");
      return;
    }
    lastInterstitial = now;
    if (typeof o.beforeAd === "function") o.beforeAd();

    var host = cfg.adsterraHost || "https://bauval.org";
    var key = cfg.adsterraBanner300;
    var wrap = document.createElement("div");
    wrap.setAttribute("role", "dialog");
    wrap.setAttribute("aria-label", "Advertisement");
    wrap.style.cssText = "position:fixed;inset:0;z-index:2147483000;display:flex;align-items:center;justify-content:center;" +
      "background:rgba(18,6,40,.82);font:600 15px/1.3 Rubik,system-ui,sans-serif;color:#EDE6FF";
    var panel = document.createElement("div");
    panel.style.cssText = "display:flex;flex-direction:column;align-items:center;gap:12px;padding:16px 16px 14px;" +
      "background:#26104F;border:2px solid #7A3FE0;border-radius:18px;box-shadow:0 0 40px rgba(214,58,249,.35)";
    var label = document.createElement("div");
    label.textContent = "Advertisement";
    label.style.cssText = "font-size:12px;opacity:.7";
    var frame = document.createElement("iframe");
    frame.title = "Advertisement";
    frame.width = "300"; frame.height = "250";
    frame.setAttribute("scrolling", "no");
    frame.style.cssText = "border:0;width:300px;height:250px;background:#1B0B3A;border-radius:6px";
    frame.srcdoc = "<!doctype html><html><head><meta charset='utf-8'><style>html,body{margin:0;background:#1B0B3A}</style></head><body>" +
      "<script>atOptions={'key':'" + key + "','format':'iframe','height':250,'width':300,'params':{}};<\/script>" +
      "<script src='" + host + "/22/" + key + "'><\/script></body></html>";
    var btn = document.createElement("button");
    btn.type = "button";
    btn.disabled = true;
    btn.style.cssText = "min-width:200px;padding:11px 18px;border:0;border-radius:999px;font:700 15px Rubik,system-ui,sans-serif;" +
      "color:#2A1200;background:#FFD45C;cursor:pointer;opacity:.55";
    var left = 5;
    btn.textContent = "Continue in " + left;
    var t = setInterval(function () {
      left -= 1;
      if (left > 0) { btn.textContent = "Continue in " + left; return; }
      clearInterval(t);
      btn.disabled = false; btn.style.opacity = "1"; btn.textContent = "Continue";
      btn.focus();
    }, 1000);
    btn.addEventListener("click", function () {
      if (btn.disabled) return;
      wrap.remove();
      if (typeof o.afterAd === "function") o.afterAd();
      done(o, "viewed");
      var c = document.getElementById("canvas");
      if (c) c.focus();
    });
    panel.appendChild(label); panel.appendChild(frame); panel.appendChild(btn);
    wrap.appendChild(panel);
    document.body.appendChild(wrap);
  }

  window.adBreak = function (o) {
    o = o || {};
    if (o.type === "reward") {
      if (adsensePush) { adsensePush(o); return; }
      done(o, "noAdPreloaded");
      return;
    }
    if (o.type === "next" || o.type === "start" || o.type === "pause" || o.type === "browse") {
      showInterstitial(o);
      return;
    }
    done(o, "invalid");
  };
  window.adConfig = function (o) { if (adsensePush) adsensePush(o); };
})();
