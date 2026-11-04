/* Void Bounce — site configuration.
 * Everything you may want to change without re-exporting the game lives here.
 */
window.VB_CONFIG = {
  /* Google AdSense for Games (H5 Games Ads) — used ONLY for rewarded ads
   * ("watch an ad, get a life"). Leave empty until AdSense approves
   * voidbouncegame.com for H5 Games Ads; while empty, the game hides every
   * "watch an ad" button. Example: "ca-pub-1234567890123456". */
  adsenseClient: "",
  /* Set to true while testing AdSense (shows test ads, no revenue). */
  adsenseTest: false,

  /* Adsterra interstitial between levels (300x250 banner in an overlay).
   * Not rewarded — Adsterra forbids incentivised impressions. */
  adsterraBanner300: "e1efd4d55667446390113692bd707f27",
  adsterraHost: "https://bauval.org",
  /* Minimum seconds between two interstitials, and grace period at start. */
  interstitialEverySeconds: 240,
  interstitialGraceSeconds: 120,
};

/* Stripe Payment Links used by the in-game shop on voidbouncegame.com.
 * Each link redirects to /play/obrigado.html after payment. */
window.vbStripeLinks = {
  moedas_200: "https://buy.stripe.com/7sY3cvch91OQdqCeRPdAk06",
  moedas_800: "https://buy.stripe.com/6oU00jdld3WY9am5hfdAk07",
  moedas_3000: "https://buy.stripe.com/aFaaEX3KDfFG2LY4dbdAk08",
  continuar: "https://buy.stripe.com/00w14ngxp0KM72e8trdAk09",
  vidas_extra: "https://buy.stripe.com/cNi14n1CvalmfyK9xvdAk0a",
  pack_lendarias: "https://buy.stripe.com/5kQ6oHdld3WY5YabFDdAk0b",
};
