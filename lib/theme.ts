/**
 * Colour presets, and how one is chosen.
 *
 * The site ships two palettes and one set of components: every colour
 * resolves to a channel triplet in `app/globals.css`, so a preset is that
 * block of variables and nothing else (see the header of that file). What
 * was missing was any way to actually look at the second one — the
 * variables were there, the attribute that selects them was never written.
 *
 *   · default          — chocolate, bronze and warm champagne. The
 *                        baseline deploy, and the default in the strong
 *                        sense: it is what anyone who does not ask for the
 *                        alternative gets, and it is unchanged by any of
 *                        this.
 *   · `data-theme="rose"` — powdered rose and cream, off the logo.
 *
 * ---- How it is selected ----------------------------------------------
 *
 * By URL, and only by URL. `/rose` is the alternative home, `/rose/masters`
 * and `/rose/faq` its inner pages — the same page components re-exported
 * (see `app/rose`), so there is one copy of the site painted twice rather
 * than two copies to keep in step. `?theme=rose` does the same on any URL,
 * which is the shorter thing to send someone.
 *
 * Nothing is remembered between visits, deliberately. A palette that
 * follows you home from a preview link is a palette you cannot get rid of,
 * and the baseline has to stay the baseline.
 */

export const THEMES = ["base", "rose"] as const;
export type Theme = (typeof THEMES)[number];

/** URL prefix carrying the alternative preset. */
export const ROSE_PREFIX = "/rose";

/**
 * Bootstrap, inlined into <head> so it runs before first paint.
 *
 * It has to be here rather than in a component: React writes to the DOM
 * after the document has been laid out, and a palette applied at that
 * point is a page that flashes chocolate before turning rose. Reading
 * `location` in <head> costs nothing and lands before the first pixel.
 *
 * Deliberately small and total — any failure leaves the attribute unset,
 * which is the baseline preset.
 */
export const THEME_BOOTSTRAP = `
(function(){
  try {
    var p = location.pathname;
    var q = new URLSearchParams(location.search).get('theme');
    var t = q || (p === '/rose' || p.indexOf('/rose/') === 0 ? 'rose' : 'base');
    if (t === 'rose') document.documentElement.setAttribute('data-theme','rose');
  } catch (e) {}
})();
`.trim();
