import { Band, Button, Heading, SectionHead, MediaTile, Card } from "@/components/ui";
import { MediaFrame } from "@/components/MediaFrame";
import { Reveal, CountUp, Accordion } from "@/components/motion";
import { M } from "@/components/m";
import { HeroStage } from "@/components/HeroStage";
import { PriceMenu } from "@/components/PriceMenu";
import { StoriesRail } from "@/components/StoriesRail";
import { VideoTile } from "@/components/VideoTile";
import {
  values,
  process,
  equipment,
  booking,
  packages,
  location,
  pricing,
  proof,
  stories,
  homeFaq,
  master,
  reviews,
  closing,
  showreel,
  reelQuotes,
  site,
} from "@/content/viart";

/**
 * Home.
 *
 * The page is one continuous dark room. Not a stack of stripes, and not a
 * stack of translucent panes either — a band paints nothing at all now, so
 * there is no fill to have an edge and no junction between two of them to
 * see. Everything visible behind the content is the ambient field in
 * `components/AmbientField`, one surface running the whole length of the
 * site, and depth comes from blurred pools of light with no boundary
 * rather than from different shades of panel.
 *
 * Three rules follow and hold everywhere:
 *
 *   · Every band head is centred, and is one sentence. No index numerals,
 *     no kickers, no accent phrase, no second typeface — and sized so it
 *     never strands a word alone on a second line.
 *   · Tiled content is a square picture with a caption under it, the
 *     caption no wider than the square.
 *   · Nothing travels on its own except the photo rail, which is a gallery
 *     and stops the moment it is touched. There are no ticker strips.
 *
 * Each band still moves in a way that belongs to it alone:
 *
 *   values     squares dealt in from the right, hinged on their edge
 *   showreel   the reel zooming in with a quote arriving from either side
 *   process    the same three squares, dealt in
 *   equipment  two tall cards rising, one after the other
 *   proof      figures counting up, then three reels arriving together
 *   stories    a rail that drifts, and opens a photo full size on a click
 *   packages   squares rising in order
 *   prices     the price plate settling in
 *   reviews    quotes arriving from either side of Anna's video
 *   questions  three answers curtaining down the column
 *   master     the portrait wiping open between two offset frames
 *   closing    the contact rows arriving from the left
 */
export default function Home() {
  return (
    <>
      <HeroStage />

      {/* Уважение к вашему времени и телу. Three squares, dealt in. */}
      <Band>
        <SectionHead title={values.title} lead={values.lead} />

        <Reveal
          variant="none"
          step={130}
          className="m-stage mt-14 grid gap-8 sm:grid-cols-2 lg:grid-cols-3"
        >
          {values.items.map((item, i) => (
            <M key={item.title} variant="deal" i={i} duration={950}>
              <MediaTile
                src={item.src}
                alt={item.title}
                focus={item.focus}
                title={item.title}
                body={item.body}
              />
            </M>
          ))}
        </Reveal>
      </Band>

      {/*
        The laser reel, with a customer either side of it.

        It began as a full-bleed strip — a 720×1280 vertical clip stretched
        across a 1440px band at twice its own size, and soft for it. Then a
        640px frame alone in the middle of an empty band, sharp but small
        and with nothing around it to be about.

        It is 440px wide here, which makes it the tallest thing on this
        part of the page, and the two quotes give it something to be
        evidence for: the clip shows the handpiece working, and the women
        either side of it say what that was like. Same `VideoTile` as the
        reels below, so it holds its poster frame until the pointer arrives
        and carries its own sound button.
      */}
      <Band className="isolate">
        {/* A pool of violet for the reel to stand in. */}
        <div
          aria-hidden
          className="bloom left-1/2 top-1/2 -z-10 h-[36rem] w-[40rem] -translate-x-1/2 -translate-y-1/2 bg-lav/20"
        />
        <Reveal
          variant="none"
          step={170}
          className="grid items-center gap-x-10 gap-y-10 lg:grid-cols-[minmax(0,1fr)_minmax(320px,440px)_minmax(0,1fr)]"
        >
          <M variant="fromLeft" i={0} className="order-2 lg:order-none">
            <ReviewQuote review={reelQuotes[0]} />
          </M>

          <M variant="zoom" i={1} duration={1200} className="order-1 lg:order-none">
            <div className="mx-auto w-full max-w-[440px]">
              <VideoTile
                src={showreel.src}
                poster={showreel.poster}
                label={showreel.alt}
                caption={showreel.alt}
              />
            </div>
          </M>

          <M variant="fromRight" i={2} className="order-3 lg:order-none">
            <ReviewQuote review={reelQuotes[1]} />
          </M>
        </Reveal>
      </Band>

      {/* Работаем с физиологией. The same square unit as the band above. */}
      <Band glow="lav">
        <SectionHead title={process.title} lead={process.lead} />

        <Reveal
          variant="none"
          step={150}
          className="m-stage mt-14 grid gap-8 sm:grid-cols-2 lg:grid-cols-3"
        >
          {process.steps.map((step, i) => (
            <M key={step.title} variant="deal" i={i} duration={950}>
              <MediaTile
                src={step.src}
                alt={step.title}
                focus={step.focus}
                title={step.title}
                body={step.body}
              />
            </M>
          ))}
        </Reveal>

        <Reveal variant="rise" delay={300} className="mt-14 text-center">
          <Button href={process.cta.href}>{process.cta.label}</Button>
        </Reveal>
      </Band>

      {/*
        The equipment, in two cards: a picture, a paragraph, and three
        things the visit actually feels like. No specification list — see
        the note in `EquipmentCard`.
      */}
      <Band>
        <SectionHead title={equipment.title} lead={equipment.lead} />

        <Reveal variant="none" step={220} className="mt-14 grid gap-8 lg:grid-cols-2">
          {equipment.items.map((item, i) => (
            <M key={item.name} variant="rise" i={i} duration={1000} className="h-full">
              <EquipmentCard item={item} />
            </M>
          ))}
        </Reveal>

        <Reveal variant="rise" delay={260} className="mt-12 text-center">
          <Button href={equipment.cta.href}>{equipment.cta.label}</Button>
          <p className="mt-4 text-cap text-white/58">{equipment.note}</p>
        </Reveal>
      </Band>

      {/* «Хорошее место 2026». The figures count themselves up, then three
          reels arrive as one row — same size, same line, no favourite. Each
          reel carries its own sound; see VideoTile.

          The heading is the whole of the writing in this band now. It had a
          lead paragraph about the rating, a gold pill repeating the award
          and a closing line about what the reviews say — three ways of
          saying what 5,0 and 98 отзывов say by themselves, directly under
          them. */}
      <Band glow="gold">
        <SectionHead title={proof.title} />

        <Reveal variant="none" step={160} className="mt-14 grid gap-8 sm:grid-cols-3">
          {proof.stats.map((s, i) => (
            <M key={s.label} variant="rise" i={i} className="text-center">
              <p className="text-display font-bold text-lav-soft">
                <CountUp to={s.to} decimals={s.decimals} duration={1400 + i * 200} />
              </p>
              <p className="mt-1 text-cap text-white/62">{s.label}</p>
            </M>
          ))}
        </Reveal>

        {/*
          Three 9:16 reels. Three columns across a 390px phone is 117px
          each — too small to see what is in them and too small to hit the
          sound button — so below `md` the row becomes a swipeable strip at
          62vw a frame and stays a row of three from there up.
        */}
        <Reveal
          variant="none"
          step={140}
          className="-mx-5 mt-16 flex snap-x snap-mandatory gap-4 overflow-x-auto px-5 pb-2 [scrollbar-width:none] md:mx-0 md:grid md:grid-cols-3 md:gap-6 md:overflow-visible md:px-0 md:pb-0 [&::-webkit-scrollbar]:hidden"
        >
          {proof.gallery.map((clip, i) => (
            <M
              key={clip.label}
              variant="rise"
              i={i}
              duration={950}
              className="w-[62vw] shrink-0 snap-center sm:w-[46vw] md:w-auto"
            >
              <VideoTile
                src={clip.src}
                poster={clip.poster}
                label={clip.label}
                caption={clip.caption}
              />
            </M>
          ))}
        </Reveal>
      </Band>

      {/* Наш ViART. The one band with nothing to read: a rail that drifts
          on a pointer device, swipes on a phone, and opens any photo full
          size on a click. Heading only — the lead under it described the
          photographs to someone already looking at them. */}
      <Band>
        <SectionHead title={stories.title} />
        <Reveal variant="fade" delay={160} className="mt-12">
          <StoriesRail />
        </Reveal>
      </Band>

      {/*
        «Пространство ViART» stood here — a heading, two labelled
        paragraphs and a photo of the room. It is gone. Everything it said
        is said better elsewhere: the room is the gallery directly above,
        and the address, the hours and the booking link are all in the
        closing band. Cutting it takes one heading and one hard stop out of
        the run from the gallery through the reviews to the contacts.
      */}

      {/* Three ways in: a square, then the name and price under it, then
          the action — no card, no rim, and no one card lifted out. */}
      <Band>
        <SectionHead title={packages.title} lead={packages.lead} />

        <Reveal variant="none" step={140} className="mt-12 grid gap-8 md:grid-cols-3">
          {packages.items.map((pkg, i) => (
            <M key={pkg.name} variant="rise" i={i}>
              {/* Every title here is a single line and every body is
                  clamped to two, so the three prices land on one baseline
                  and there is no gap opened under the square. */}
              <MediaTile
                src={pkg.src}
                alt={pkg.name}
                focus={pkg.focus}
                title={pkg.name}
                body={pkg.body}
                titleLines={1}
                bodyLines={2}
              >
                {/* Price on its own line, note under it. Side by side the
                    longest note wrapped and pushed one price onto two
                    lines, which put that tile's action a row below the
                    other two. */}
                <p className="mt-3 text-h2 font-bold text-white">{pkg.price}</p>
                <p className="text-cap text-white/62">{pkg.meta}</p>
                <a
                  href={booking.cta.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover-fade mt-3 inline-block text-body font-medium text-white underline decoration-lav decoration-2 underline-offset-4"
                >
                  {pkg.cta}
                </a>
              </MediaTile>
            </M>
          ))}
        </Reveal>

        <Reveal variant="fade" delay={200}>
          <p className="mt-10 text-center text-cap text-white/62">{packages.note}</p>
        </Reveal>
      </Band>

      {/* The price sheet — see components/PriceMenu for why it lives in the
          middle of the page rather than under the hero. */}
      {/*
        The head of this band is the offer and nothing else.

        It used to be «Честные цены. Без скрытых условий.» over a paragraph
        of reassurance, and then the prices. But nobody arrives at a price
        list needing to be told the prices are honest — they arrive needing
        a number. So the one thing worth saying before the numbers is the
        one thing that changes them.
      */}
      <Band glow="lav" id="prices" className="scroll-mt-24">
        <SectionHead title={pricing.title} size="h2" />
        <Reveal variant="rise" delay={160} className="mt-12">
          <PriceMenu />
        </Reveal>
      </Band>

      {/*
        Reviews, with the video as the point of the band.

        The balance here was wrong: five bordered cards of body copy either
        side of a 232px clip made the writing the subject and the person
        speaking a detail between two columns. A stranger saying it to camera
        is worth more than five paragraphs of it typed, so the clip is the
        largest thing in the band now and the quotes have been turned down
        to support it — no card, no fill, just a violet hairline, smaller
        type and less contrast. They are still there to be read; they are
        no longer competing to be looked at.
      */}
      <Band id="reviews">
        <SectionHead title={reviews.title} />

        <Reveal
          variant="none"
          step={140}
          className="mt-14 grid items-center gap-x-10 gap-y-12 lg:grid-cols-[minmax(0,1fr)_minmax(300px,380px)_minmax(0,1fr)]"
        >
          {/* Left of the video. Ordered so the two side columns come out
              close to the same height, which is what keeps the video
              reading as the centre of the band rather than a third column. */}
          <div className="order-2 flex flex-col gap-7 lg:order-none">
            {reviews.items.slice(0, 3).map((r, i) => (
              <M key={r.author} variant="fromLeft" i={i}>
                <ReviewQuote review={r} />
              </M>
            ))}
          </div>

          {/*
            Anna's invitation, at the size the band is built around.

            One caveat travels with it: the source is 464×848, the smallest
            asset on the site. At 380px it is sharp on a 1× screen and soft
            on a 2× one, and no amount of layout fixes that — it needs a
            larger export. Everything else here is 720×1280 or better.
          */}
          <M variant="zoom" i={1} duration={1200} className="order-1 lg:order-none">
            <div className="mx-auto w-full max-w-[380px]">
              <VideoTile
                src={reviews.video.src}
                poster={reviews.video.poster}
                label={reviews.video.label}
                caption={reviews.video.caption}
              />
            </div>
          </M>

          <div className="order-3 flex flex-col gap-7 lg:order-none">
            {reviews.items.slice(3).map((r, i) => (
              <M key={r.author} variant="fromRight" i={i}>
                <ReviewQuote review={r} />
              </M>
            ))}
          </div>
        </Reveal>

        <Reveal variant="fade" delay={200} className="mt-10 text-center">
          <a
            href={reviews.source}
            target="_blank"
            rel="noopener noreferrer"
            className="hover-fade text-cap text-white/72 underline underline-offset-4"
          >
            {reviews.sourceLabel}
          </a>
        </Reveal>
      </Band>

      {/* The three questions people hesitate over, and a way to the rest.
          Deliberately not the whole FAQ — three is what someone will read
          in the middle of deciding. */}
      <Band>
        <SectionHead title={homeFaq.title} />

        <div className="mx-auto mt-12 max-w-3xl">
          <Reveal variant="none" step={90}>
            <M variant="curtain" i={0}>
              <Accordion items={homeFaq.items} />
            </M>
          </Reveal>

          <Reveal variant="fade" delay={220} className="mt-8 text-center">
            <p className="text-body text-white/76">{homeFaq.link.lead}</p>
            <a
              href={homeFaq.link.href}
              className="hover-fade mt-2 inline-block text-body font-medium text-lav-soft underline decoration-lav decoration-2 underline-offset-4"
            >
              {homeFaq.link.label} →
            </a>
          </Reveal>
        </div>
      </Band>

      {/* The master. The portrait wipes open between two offset frames. */}
      <Band>
        <div className="grid gap-12 lg:grid-cols-2 lg:items-center">
          <Reveal variant="none" step={120} className="relative">
            <M
              variant="fromLeft"
              i={0}
              className="absolute -left-3 -top-3 h-full w-full rounded-2xl border border-dashed border-lav/40"
            />
            <M
              variant="fromRight"
              i={1}
              className="absolute -bottom-3 -right-3 h-full w-full rounded-2xl bg-lav/10"
            />
            <M
              variant="wipe"
              i={2}
              duration={1300}
              className="relative overflow-hidden rounded-2xl border border-white/10"
            >
              <MediaFrame
                ratio={548 / 358}
                src={master.photo.src}
                label={master.photo.alt}
                rounded={false}
              />
            </M>
          </Reveal>

          <Reveal variant="none" delay={180} step={110}>
            <SectionHead title={master.name} align="left" />
            <M variant="rise" i={6} as="p" className="mt-3 text-h3 font-medium text-lav-soft">
              {master.role}
            </M>
            <M variant="rise" i={7} as="p" className="mt-5 max-w-md text-body text-white/80">
              {master.body}
            </M>
            <dl className="mt-8 space-y-3">
              {master.facts.map(([k, v], i) => (
                <M
                  key={k}
                  variant="fromLeft"
                  i={i + 8}
                  className="flex items-baseline justify-between gap-4 border-b border-white/12 pb-3"
                >
                  <dt className="text-cap font-medium uppercase tracking-[0.12em] text-white/58">
                    {k}
                  </dt>
                  <dd className="text-body text-white/92">{v}</dd>
                </M>
              ))}
            </dl>
            <M variant="rise" i={12} className="mt-9 flex flex-wrap gap-3">
              <Button href={master.primary.href}>{master.primary.label}</Button>
              <Button href={master.secondary.href} variant="outline">
                {master.secondary.label}
              </Button>
            </M>
          </Reveal>
        </div>
      </Band>

      {/* Closing — the last band anyone reads, so every way of reaching the
          studio lives here: the map, the address, the hours, the phone,
          WhatsApp and the booking page. */}
      <Band glow="clay" id="contacts" className="scroll-mt-24">
        <div className="grid gap-12 lg:grid-cols-2 lg:items-center">
          <Reveal variant="none" step={110}>
            <M
              variant="draw"
              i={0}
              duration={900}
              className="h-1 w-14 rounded-full bg-lav shadow-[0_0_24px_rgb(var(--c-accent)/0.55)]"
            />
            <M variant="rise" i={1}>
              <Heading level={2} size="display" className="mt-6">
                {closing.title}
              </Heading>
            </M>
            <M variant="rise" i={2} as="p" className="mt-6 max-w-lg text-lead text-white/80">
              {closing.body}
            </M>

            <dl className="mt-9 max-w-lg">
              {closing.contacts.map(([k, v, href], i) => (
                <M
                  key={k}
                  variant="fromLeft"
                  i={i + 3}
                  className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1 border-b border-white/12 py-3.5"
                >
                  <dt className="text-cap uppercase tracking-[0.12em] text-white/58">{k}</dt>
                  <dd className="text-body text-white/92">
                    {href ? (
                      <a
                        href={href}
                        {...(href.startsWith("http")
                          ? { target: "_blank", rel: "noopener noreferrer" }
                          : {})}
                        className="underline decoration-lav decoration-1 underline-offset-4 transition-colors hover:text-lav-soft"
                      >
                        {v}
                      </a>
                    ) : (
                      v
                    )}
                  </dd>
                </M>
              ))}
            </dl>

            <M variant="rise" i={9} className="mt-9 flex flex-wrap gap-3">
              <Button href={closing.primary.href}>{closing.primary.label}</Button>
              <Button href={closing.secondary.href} variant="light">
                {closing.secondary.label}
              </Button>
              <Button href={site.phoneHref} variant="ghost">
                Позвонить
              </Button>
            </M>
          </Reveal>

          <Reveal variant="zoom" duration={1200}>
            {/* The real map, not a picture of one: the pin is Yandex's own
                record of the studio, so it opens into routes, hours and
                reviews on tap. The link under it is the fallback for anyone
                whose browser or network refuses third-party frames — the
                address must never end up unreachable. */}
            <div className="overflow-hidden rounded-2xl border border-white/10 bg-white/[0.04]">
              <iframe
                src={location.map.src}
                title={location.map.title}
                loading="lazy"
                allowFullScreen
                className="block h-[360px] w-full border-0 lg:h-[460px]"
              />
            </div>
            <a
              href={location.cta.href}
              target="_blank"
              rel="noopener noreferrer"
              className="hover-fade mt-3 inline-block text-cap text-white/72 underline underline-offset-4"
            >
              {location.cta.label} на Яндекс Картах
            </a>
          </Reveal>
        </div>
      </Band>
    </>
  );
}

/**
 * One apparatus.
 *
 * A picture, a paragraph in the studio's own words, and three things the
 * visit feels like. There was a fourth part — a recessed panel of bulleted
 * specifications above the last one — and it is gone: three dotted lines
 * saying «диодный лазер 808 нм» under a paragraph that had already said it
 * in sentences. A bulleted list is what you write when you have not
 * decided what matters.
 */
function EquipmentCard({ item }: { item: (typeof equipment.items)[number] }) {
  const cool = item.accent === "aqua";

  return (
    <Card className="flex h-full flex-col p-0">
      <div className="tile-zoom relative overflow-hidden">
        <MediaFrame
          ratio={16 / 10}
          src={item.src}
          label={`${item.name} — ${item.role}`}
          objectPosition={item.focus}
          zoom={item.zoom}
          zoomOrigin={item.zoomOrigin}
          rounded={false}
        />
        {/* The photo runs into the card rather than stopping at an edge:
            the type below it starts on the picture's own darkness. */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 bg-gradient-to-t from-base via-base/25 to-transparent"
        />
      </div>

      <div className="flex flex-1 flex-col p-6 md:p-8">
        <p
          className={`text-cap font-medium uppercase tracking-[0.14em] ${
            cool ? "text-aqua" : "text-lav-soft"
          }`}
        >
          {item.role}
        </p>
        <h3 className="mt-2 text-h2 font-bold tracking-[-0.035em] text-white">{item.name}</h3>
        {/* Reserved height, so the two cards' fact panels start on the same
            line: side by side, one four-line paragraph against a five-line
            one is enough to make the pair look misaligned rather than
            paired. Only from `lg`, where they actually sit side by side. */}
        <p className="mt-4 text-body text-white/80 lg:min-h-[8.6rem]">{item.body}</p>

        {/*
          The bulleted specification panel that used to sit here is gone.
          Three dotted lines of «диодный лазер 808 нм», in a recessed box,
          under a paragraph that had already said the same thing in
          sentences — a list is what you write when you have not decided
          what matters. What the visit feels like is what matters.
        */}
        <dl className="mt-7 space-y-5">
          {item.feels.map((feel) => (
            <div key={feel.title}>
              <dt className="text-h3 font-semibold text-white">{feel.title}</dt>
              <dd className="mt-1 text-body text-white/76">{feel.body}</dd>
            </div>
          ))}
        </dl>
      </div>
    </Card>
  );
}

/**
 * One review, in the customer's own words — supporting the video, not
 * competing with it.
 *
 * A hairline instead of a card. On this band the video has to be the thing
 * you look at first, and five filled, rimmed, shadowed boxes around it made
 * that impossible: the eye goes to edges. What is left is the quote itself,
 * a step smaller and a step quieter, hung off a violet rule.
 */
function ReviewQuote({ review }: { review: (typeof reviews.items)[number] }) {
  return (
    <figure className="border-l border-lav/40 pl-5">
      <p aria-label={`${review.stars} из 5`} className="text-[13px] tracking-[0.18em] text-gold/90">
        {"★".repeat(review.stars)}
      </p>
      <blockquote className="mt-2 text-[15px] leading-relaxed text-white/72">
        {review.text}
      </blockquote>
      <figcaption className="mt-3 text-[13px] text-white/48">
        {review.author} · {review.date} · Яндекс Карты
      </figcaption>
    </figure>
  );
}
