/**
 * Media frame.
 *
 * Every media slot on the page is a frame at the ratio measured from the
 * reference layout, ready for ViART's own asset.
 *
 * Video here is *ambient* video only: it loops silently behind the
 * composition and is never something the visitor operates. Anything with
 * sound — anything a visitor might want to hear, scrub or enlarge — is a
 * `VideoTile` instead, which owns the playback state properly and is the
 * only component on the site allowed to make noise. Keeping the two apart
 * is deliberate: a `muted` attribute managed by React is exactly how the
 * sound button on the reels stopped working.
 *
 * Ratios and per-slot video attributes: reference/aescape/GEOMETRY_SPEC.md §5.
 */

type Kind = "image" | "video";

export function MediaFrame({
  kind = "image",
  ratio = 1,
  label,
  src,
  poster,
  autoPlay = false,
  objectFit = "cover",
  objectPosition,
  zoom,
  zoomOrigin = "center",
  tone = "lav",
  rounded = true,
  className = "",
  fixedWidth,
}: {
  kind?: Kind;
  /** width / height, e.g. 1 for square, 16/9, 9/16 */
  ratio?: number;
  label?: string;
  src?: string;
  poster?: string;
  /**
   * Ambient video plays on arrival or not at all — there are no controls
   * here to start it with. Leave it false and the slot shows the poster.
   */
  autoPlay?: boolean;
  objectFit?: "cover" | "fill" | "contain";
  /**
   * Where the crop sits, e.g. `center 72%`.
   *
   * Several of the studio's photos put their subject well off centre — the
   * handpiece low, the signage high — so the default centre crop removed
   * the point of the picture. Passing the focus per slot fixes that at the
   * one place that knows the ratio it is cropping to.
   */
  objectPosition?: string;
  /**
   * A tighter crop than `cover` gives, e.g. `1.16`.
   *
   * `object-fit: cover` scales an asset to fill the frame and no further,
   * so two photographs shot at different distances stay at different
   * distances however they are cropped — and side by side that reads as
   * one card zoomed in and the other not, with the studio's own wordmark
   * plainly a different size in each. Scaling the image inside the frame
   * is the only way to match them; `zoomOrigin` says which corner holds
   * still while it grows, so a mark on an edge stays on that edge.
   */
  zoom?: number;
  zoomOrigin?: string;
  /** The empty-slot fill, for a frame whose asset has not arrived yet. */
  tone?: "lav" | "ink" | "veil";
  rounded?: boolean;
  className?: string;
  /** Some tiles hold a fixed pixel size at every breakpoint. */
  fixedWidth?: number;
}) {
  const tones = {
    lav: "bg-lav/15 text-white/68",
    ink: "bg-white/[0.06] text-white/62",
    veil: "bg-veil text-white/58",
  };

  const shell = [
    "relative w-full overflow-hidden",
    rounded ? "rounded-2xl" : "",
    tones[tone],
    className,
  ]
    .filter(Boolean)
    .join(" ");

  const media: React.CSSProperties = { objectFit, objectPosition };
  if (zoom && zoom !== 1) {
    media.transform = `scale(${zoom})`;
    media.transformOrigin = zoomOrigin;
  }

  const style: React.CSSProperties = { aspectRatio: String(ratio) };
  if (fixedWidth) {
    style.width = fixedWidth;
    style.maxWidth = "100%";
  }

  return (
    <div className={shell} style={style} data-slot={kind} data-label={label}>
      {kind === "video" ? (
        <video
          className="h-full w-full"
          style={media}
          {...(src ? { src } : {})}
          poster={poster}
          autoPlay={autoPlay}
          loop
          muted
          playsInline
          /*
           * `metadata`, never `auto`: the slot only ever needs enough of
           * the file to show a first frame, and the poster covers even
           * that until it arrives.
           *
           * `data-ambient` marks this element for `AmbientVideoGuard`,
           * which unloads it entirely on a phone — see that component.
           * A looping decoder inside a `display: none` rail costs a
           * mobile visitor bandwidth and frames for something they will
           * never see.
           */
          preload="metadata"
          data-ambient={autoPlay ? "" : undefined}
          // No controls, ever. This slot is scenery; a video with a sound
          // button belongs in `VideoTile`, which can actually deliver one.
        />
      ) : src ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={src}
          alt={label ?? ""}
          loading="lazy"
          decoding="async"
          className="h-full w-full"
          style={media}
        />
      ) : null}

      {!src && (
        <span className="absolute inset-0 flex flex-col items-center justify-center gap-1 px-3 text-center">
          <span className="text-cap uppercase tracking-[0.12em]">
            {kind === "video" ? "видео" : "фото"}
          </span>
          {label && <span className="text-cap opacity-70">{label}</span>}
          <span className="text-cap opacity-50">
            {ratio === 1 ? "1:1" : ratio > 1 ? `${ratio.toFixed(2)}:1` : `1:${(1 / ratio).toFixed(2)}`}
            {autoPlay ? " · autoplay" : ""}
          </span>
        </span>
      )}
    </div>
  );
}
