import Home from "../page";

/**
 * The rose preset's entry point.
 *
 * Not a copy of the home page — the home page itself, under a path that
 * `lib/theme.ts` answers with `data-theme="rose"` on <html>. The whole
 * difference between the two versions of the site is that attribute and
 * the block of variables it selects, which is what guarantees they cannot
 * drift: one set of components, one piece of copy, one set of
 * measurements, painted twice.
 */
/*
 * Kept out of search results. These paths serve the same copy as the pages
 * they mirror, and a preview palette should not compete with the studio's
 * own site for the words it is trying to rank for. The baseline pages stay
 * indexable exactly as they were.
 */
export const metadata = {
  title: "ViART — пудровая версия",
  robots: { index: false, follow: false },
};

export default function RoseHome() {
  return <Home />;
}
