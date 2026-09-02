"use client";

import { useCallback, useEffect, useId, useRef, useState } from "react";
import { createPortal } from "react-dom";

/**
 * A studio reel with its own controls.
 *
 * The clips play silently on a loop, which is right for a page you are
 * scrolling past — but there has to be a way to hear one, scrub back to the
 * bit you missed, or see it any bigger. The native control bar is the usual
 * answer and the wrong one here: a grey slab bolted across the bottom of
 * every tile, permanently, on a band whose whole point is clean verticals.
 *
 * So: controls live in a translucent strip that fades in on hover, on
 * keyboard focus, or on any touch device (where there is no hover to fade
 * in on), and the clip itself is a button — one press and it lifts out of
 * the row into the middle of the screen. Escape or a second press puts it
 * back.
 *
 * ── Why the playback state is not React state ──────────────────────────
 *
 * The sound button did not turn the sound on. The previous version put the
 * element's playback state under React's control and gave it three ways to
 * lose:
 *
 *   · `muted` was a JSX prop, so React owned an attribute the component
 *     was also setting by hand — `react-dom` assigns `domElement.muted`
 *     directly whenever it applies that prop, and two writers of one
 *     property is one too many.
 *   · `onTimeUpdate` called `setProgress` four or five times a second, so
 *     the whole tile — the `<video>` included — was re-rendered constantly
 *     while it played.
 *   · `play()` was awaited with a bare `catch` that re-muted on *any*
 *     rejection. An `AbortError` from a play interrupted by a load, or a
 *     codec the browser does not have, both silently undid the click.
 *
 * The element is the single source of truth now. React never writes
 * `muted`, `currentTime` or the scrub position: `playback` holds them
 * across the remount that enlarging causes, an effect restores them onto
 * whichever element is currently mounted, and the only React state left is
 * the two things that genuinely change the markup — whether the clip is
 * enlarged, and which icon the sound button shows.
 */

/**
 * One clip with sound at a time.
 *
 * Every mounted tile leaves a way to silence itself here. Unmuting calls
 * every other one first, so turning the sound on in the third reel does not
 * leave the first two talking over it from further up the page.
 */
const silencers = new Set<() => void>();

/**
 * Did `play()` fail because the browser will not start audible playback,
 * as opposed to failing for any of the other reasons it can?
 *
 * The distinction matters: a refusal is answered by going quiet, and
 * everything else is not. `NotAllowedError` is the autoplay policy;
 * `AbortError` is a play interrupted by another load, which resolves
 * itself. A missing codec arrives as `NotSupportedError` and muting it
 * would achieve nothing but making the sound button look broken.
 */
function isAutoplayRefusal(err: unknown) {
  return err instanceof DOMException && err.name === "NotAllowedError";
}

export function VideoTile({
  src,
  poster,
  label,
  caption,
}: {
  src: string;
  poster?: string;
  label: string;
  caption?: string;
}) {
  const video = useRef<HTMLVideoElement>(null);
  const scrub = useRef<HTMLInputElement>(null);
  const frame = useRef<HTMLDivElement>(null);
  const [expanded, setExpanded] = useState(false);
  const [muted, setMuted] = useState(true);
  const [hovered, setHovered] = useState(false);
  const [mounted, setMounted] = useState(false);
  const titleId = useId();

  /**
   * Does this device have a pointer to hover with?
   *
   * `null` until the browser has been asked, which is a third state on
   * purpose: rendering the server's guess and correcting it would mean
   * either a clip that starts playing and stops half a second later on a
   * desktop, or one that never starts on a phone. Until it is known, the
   * poster frame sits there and nothing plays.
   */
  const [pointer, setPointer] = useState<boolean | null>(null);

  /**
   * Is the tile far enough onto the screen to be worth playing?
   *
   * On a touch device a clip loops by itself — there is no hover to start
   * it with — and that used to mean it started the moment a sliver of it
   * cleared the bottom edge. Three of them did it at once, several screens
   * before anyone could see them, and what the visitor got when they
   * finally arrived was three clips already halfway through.
   *
   * Three quarters of the tile is the bar. It is the point at which the
   * frame reads as the thing you are looking at rather than as something
   * at the edge of the page, and it is what the studio asked for: the clip
   * starts when the block has arrived, not while it is arriving.
   */
  const [inView, setInView] = useState(false);

  /**
   * What the element should be doing, kept outside React.
   *
   * Enlarging a clip unmounts one `<video>` and mounts another; this is
   * what carries the position and the sound across that gap, so the clip
   * comes back where you left it rather than at the first frame. `playing`
   * is here rather than in state for the same reason it is read inside a
   * stable callback: nothing that runs every frame should re-render.
   */
  const playback = useRef({ time: 0, muted: true, playing: false });

  // The overlay is portalled to <body>. It has to be: a transform, a
  // filter or a backdrop-filter on any ancestor becomes the containing
  // block for `position: fixed`, and this tile is wrapped in reveal blocks
  // that carry a transform while they animate — so the "full screen"
  // overlay would sometimes be laid out, and clipped, inside the row.
  useEffect(() => setMounted(true), []);

  useEffect(() => {
    setPointer(window.matchMedia("(hover: hover) and (pointer: fine)").matches);
  }, []);

  /**
   * Watch how much of the frame is actually on screen.
   *
   * Area, not height: in the phone gallery the clips are side by side on a
   * horizontal scroller, and a neighbour that is half off the right edge
   * has its full height in view while being the wrong clip entirely. Area
   * counts both directions, so only the one on the centre snap point
   * passes.
   *
   * The second term is the escape hatch for a frame taller than the window
   * — a 9:16 clip at full width on a short screen can never show three
   * quarters of itself, and without it such a tile would never play at
   * all. Its own share of the screen stands in for it.
   */
  useEffect(() => {
    const el = frame.current;
    if (!el) return;

    const io = new IntersectionObserver(
      ([entry]) => {
        const box = entry.boundingClientRect;
        const shown = entry.intersectionRect.width * entry.intersectionRect.height;
        const bar = Math.min(
          box.width * box.height * 0.75,
          window.innerWidth * window.innerHeight * 0.55,
        );
        setInView(shown > 0 && shown >= bar);
      },
      // A ladder rather than one step: the callback runs on each crossing,
      // and with a single 0.75 threshold a tile that stops just short of
      // the bar never reports again.
      { threshold: [0, 0.25, 0.5, 0.65, 0.75, 0.85, 1] },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  /**
   * Put the live element back into the state the tile is meant to be in:
   * the right sound, the right position, playing or not.
   */
  const sync = useCallback(() => {
    const el = video.current;
    if (!el) return;
    el.muted = playback.current.muted;
    if (playback.current.time > 0 && Number.isFinite(el.duration)) {
      el.currentTime = playback.current.time;
    }

    if (!playback.current.playing) {
      if (!el.paused) el.pause();
      return;
    }

    void el.play().catch((err: unknown) => {
      // Only an autoplay refusal is worth reacting to, and only by going
      // quiet and trying again. Anything else — a codec the browser does
      // not have, a network failure — is not something muting fixes, and
      // silently muting on it would throw away a choice the visitor made.
      if (!isAutoplayRefusal(err) || el.muted) return;
      el.muted = true;
      playback.current.muted = true;
      setMuted(true);
      void el.play().catch(() => {});
    });
  }, []);

  /**
   * When a clip plays, and why it is not simply always.
   *
   * On a pointer device the rail used to be three clips looping at once,
   * for as long as the band was on screen, whether or not anyone was
   * looking at them — three decoders running to animate the page. It plays
   * on hover now, the way a preview on a video site does, and holds the
   * poster frame otherwise. It keeps playing while it is enlarged, and
   * while its sound is on, because in both cases the visitor has said they
   * are watching it.
   *
   * On a touch device there is no hover to trigger a preview and a still
   * frame gives no sign there is anything to play, so a phone loops the
   * clip silently — but only once three quarters of the frame is on
   * screen, and it stops again when it leaves. See `inView`: a clip that
   * starts playing while it is still a strip at the bottom of the screen
   * is a clip whose opening seconds nobody sees.
   */
  useEffect(() => {
    playback.current.playing =
      pointer === null
        ? false
        : expanded || hovered || !muted || (pointer === false && inView);
    sync();
  }, [pointer, expanded, hovered, muted, inView, sync]);

  // Leave a way for another tile to silence this one.
  useEffect(() => {
    const silence = () => {
      const el = video.current;
      if (el) el.muted = true;
      playback.current.muted = true;
      setMuted(true);
    };
    silencers.add(silence);
    return () => {
      silencers.delete(silence);
    };
  }, []);

  // Escape closes the enlarged view, and the page underneath must not
  // scroll away behind it while it is open.
  useEffect(() => {
    if (!expanded) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setExpanded(false);
    };
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = previous;
      window.removeEventListener("keydown", onKey);
    };
  }, [expanded]);

  /**
   * Playback progress, written straight to the DOM.
   *
   * This fires four or five times a second for as long as the clip is on
   * screen. Routing it through state re-rendered the whole tile at that
   * rate — which is both wasteful and, as above, what kept resetting the
   * sound. The slider is the only thing that has to change, so it is the
   * only thing written.
   */
  const onTimeUpdate = useCallback(() => {
    const el = video.current;
    if (!el || !el.duration) return;
    playback.current.time = el.currentTime;
    const bar = scrub.current;
    if (!bar || bar.dataset.scrubbing === "1") return;
    const percent = (el.currentTime / el.duration) * 100;
    bar.value = String(percent);
    paintScrub(bar, percent);
  }, []);

  const seek = (percent: number) => {
    const el = video.current;
    if (scrub.current) paintScrub(scrub.current, percent);
    if (el?.duration) {
      el.currentTime = (percent / 100) * el.duration;
      playback.current.time = el.currentTime;
    }
  };

  const toggleMute = () => {
    const el = video.current;
    if (!el) return;

    if (!el.muted) {
      el.muted = true;
      playback.current.muted = true;
      setMuted(true);
      return;
    }

    // Turning sound on: silence every other reel first, then this one
    // speaks. The order matters — our own silencer is in that set too, so
    // it has to run before we unmute rather than after.
    for (const silence of silencers) silence();

    el.muted = false;
    playback.current.muted = false;
    setMuted(false);

    // The click is a user gesture, so this is allowed — but confirm it
    // rather than assume it. A button that says the sound is on while the
    // element is silent is worse than one that never turned it on. Only an
    // autoplay refusal is answered by going back to muted; a clip that
    // cannot be decoded at all is not made playable by silencing it, and
    // reverting the button there would just look like the sound is broken.
    void el
      .play()
      .then(() => {
        if (el.muted) setMuted(true);
      })
      .catch((err: unknown) => {
        if (!isAutoplayRefusal(err)) return;
        el.muted = true;
        playback.current.muted = true;
        setMuted(true);
      });
  };

  /**
   * Metadata has arrived, so the element finally knows its own duration —
   * which is the first moment a seek is possible at all. Syncing here as
   * well as on mount is what actually carries the position across the
   * enlarge remount: at mount time `duration` is still NaN and the seek in
   * `sync` is skipped.
   */
  const onReady = useCallback(() => {
    sync();
    onTimeUpdate();
  }, [sync, onTimeUpdate]);

  const player = (isExpanded: boolean) => (
    <Player
      ref={video}
      scrubRef={scrub}
      src={src}
      poster={poster}
      label={label}
      muted={muted}
      expanded={isExpanded}
      onTimeUpdate={onTimeUpdate}
      onReady={onReady}
      onSeek={seek}
      onToggleMute={toggleMute}
      onToggleSize={() => setExpanded(!isExpanded)}
    />
  );

  return (
    <>
      {/*
        The tile in the row. When it is lifted out, the frame stays put at
        the same aspect so the others do not slide sideways.

        Hover starts the preview and leaving stops it — pointer events
        rather than mouse ones, so a stylus behaves like a mouse and a
        finger is ignored (a phone gets the looping behaviour instead; see
        the effect above).
      */}
      <figure
        className="group relative"
        onPointerEnter={(e) => e.pointerType !== "touch" && setHovered(true)}
        onPointerLeave={(e) => e.pointerType !== "touch" && setHovered(false)}
        onFocus={() => setHovered(true)}
        onBlur={() => setHovered(false)}
      >
        <div
          // The frame itself is what is watched for playback, not the
          // figure around it: the caption under it is not the clip, and
          // counting it would move the three-quarter mark.
          ref={frame}
          className={`relative overflow-hidden rounded-2xl border border-white/12 shadow-[0_30px_70px_-40px_rgba(0,0,0,0.9)] transition-opacity duration-300 ${
            expanded ? "opacity-25" : "opacity-100"
          }`}
          style={{ aspectRatio: "9 / 16" }}
        >
          {!expanded && player(false)}
        </div>
        {caption && <figcaption className="mt-3 text-cap text-white/58">{caption}</figcaption>}
      </figure>

      {expanded &&
        mounted &&
        createPortal(
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby={titleId}
            className="fixed inset-0 z-[80] flex items-center justify-center bg-black/90 p-4 backdrop-blur-sm sm:p-5"
            onClick={() => setExpanded(false)}
          >
            <div
              // Height-led, so the clip stays a vertical rather than being
              // stretched across a desktop window. `max-w-full` is what
              // keeps it inside a phone, where 86svh of a 9:16 frame is
              // wider than the screen.
              className="relative h-[86svh] max-w-full overflow-hidden rounded-[24px] ring-1 ring-white/15"
              style={{ aspectRatio: "9 / 16" }}
              onClick={(e) => e.stopPropagation()}
            >
              <span id={titleId} className="sr-only">
                {label}
              </span>
              {player(true)}
            </div>
          </div>,
          document.body,
        )}
    </>
  );
}

/**
 * Repaint the scrub track's filled portion.
 *
 * The filled half is the theme accent read straight off the document, not
 * a literal — the track is painted by script because it has to follow
 * playback, and that is no reason for it to be the one control on the
 * site that ignores the palette.
 */
function paintScrub(bar: HTMLInputElement, percent: number) {
  bar.style.background = `linear-gradient(to right, rgb(var(--c-accent-soft)) ${percent}%, rgb(var(--c-cream) / 0.25) ${percent}%)`;
}

/**
 * The video plus its control strip.
 *
 * One component for both states so the markup — and the refs the parent
 * drives it through — are identical in the row and in the overlay.
 *
 * Note what is *not* here: `muted`. The element's own mute state is set
 * imperatively by the parent and never by a render, which is the whole
 * point. `muted` below is only what the button should look like.
 */
function Player({
  ref,
  scrubRef,
  src,
  poster,
  label,
  muted,
  expanded,
  onTimeUpdate,
  onReady,
  onSeek,
  onToggleMute,
  onToggleSize,
}: {
  ref: React.Ref<HTMLVideoElement>;
  scrubRef: React.Ref<HTMLInputElement>;
  src: string;
  poster?: string;
  label: string;
  muted: boolean;
  expanded: boolean;
  onTimeUpdate: () => void;
  onReady: () => void;
  onSeek: (percent: number) => void;
  onToggleMute: () => void;
  onToggleSize: () => void;
}) {
  return (
    <>
      <video
        ref={ref}
        src={src}
        poster={poster}
        aria-label={label}
        className="h-full w-full object-cover"
        loop
        playsInline
        preload="metadata"
        onTimeUpdate={onTimeUpdate}
        onLoadedMetadata={onReady}
      />

      {/* The whole frame is the enlarge control. */}
      <button
        type="button"
        onClick={onToggleSize}
        aria-label={expanded ? `Свернуть: ${label}` : `Развернуть: ${label}`}
        className="absolute inset-0 focus:outline-none focus-visible:ring-2 focus-visible:ring-lav-soft"
        style={{ cursor: expanded ? "zoom-out" : "zoom-in" }}
      />

      {/*
        Control strip, always on.

        It used to fade in under the pointer, which meant that on a page
        where the clips are silent by default, the one control that turns
        the sound on was invisible until you happened to hover the right
        rectangle. A control nobody can see is a control nobody uses. It
        sits on a gradient dark enough to read against any frame, and the
        sound button fills with violet the moment it is the one making
        noise, so which clip you are hearing is never a guess.
      */}
      <div
        className="pointer-events-none absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/85 via-black/45 to-transparent p-3"
      >
        <div className="pointer-events-auto flex items-center gap-2.5">
          <input
            ref={scrubRef}
            type="range"
            min={0}
            max={100}
            step={0.1}
            defaultValue={0}
            aria-label={`Перемотка: ${label}`}
            onPointerDown={(e) => {
              e.currentTarget.dataset.scrubbing = "1";
            }}
            onPointerUp={(e) => {
              e.currentTarget.dataset.scrubbing = "0";
            }}
            onChange={(e) => onSeek(Number(e.target.value))}
            className="video-scrub h-1 flex-1 cursor-pointer appearance-none rounded-full bg-white/25"
          />

          <IconButton
            onClick={onToggleMute}
            label={muted ? `Включить звук: ${label}` : `Выключить звук: ${label}`}
            pressed={!muted}
          >
            {muted ? <MutedIcon /> : <SoundIcon />}
          </IconButton>

          <IconButton
            onClick={onToggleSize}
            label={expanded ? `Свернуть: ${label}` : `Развернуть: ${label}`}
          >
            {expanded ? <CollapseIcon /> : <ExpandIcon />}
          </IconButton>
        </div>
      </div>
    </>
  );
}

function IconButton({
  onClick,
  label,
  pressed,
  children,
}: {
  onClick: () => void;
  label: string;
  pressed?: boolean;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={label}
      {...(pressed === undefined ? {} : { "aria-pressed": pressed })}
      className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full backdrop-blur-sm transition-colors duration-200 ${
        pressed ? "bg-lav text-ink" : "bg-white/15 text-white hover:bg-white/30"
      }`}
    >
      {children}
    </button>
  );
}

/* Icons — 16px, currentColor, no dependency. */

function MutedIcon() {
  return (
    <svg viewBox="0 0 16 16" width="15" height="15" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden>
      <path d="M8 3 4.5 6H2v4h2.5L8 13V3Z" strokeLinejoin="round" />
      <path d="m11 6.5 3 3M14 6.5l-3 3" strokeLinecap="round" />
    </svg>
  );
}

function SoundIcon() {
  return (
    <svg viewBox="0 0 16 16" width="15" height="15" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden>
      <path d="M8 3 4.5 6H2v4h2.5L8 13V3Z" strokeLinejoin="round" />
      <path d="M10.8 5.8a3 3 0 0 1 0 4.4M12.7 4a5.5 5.5 0 0 1 0 8" strokeLinecap="round" />
    </svg>
  );
}

function ExpandIcon() {
  return (
    <svg viewBox="0 0 16 16" width="15" height="15" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden>
      <path d="M6 2H2v4M10 14h4v-4M14 6V2h-4M2 10v4h4" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function CollapseIcon() {
  return (
    <svg viewBox="0 0 16 16" width="15" height="15" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden>
      <path d="M2 6h4V2M14 10h-4v4M10 2v4h4M6 14v-4H2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
