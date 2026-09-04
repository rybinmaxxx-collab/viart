/**
 * All site copy lives here.
 *
 * The home page, the master page and the FAQ were rewritten wholesale from
 * ViART's own supplied copy — a premium, minimal, unexclamatory voice, and
 * the source of truth for every heading and paragraph below. Facts (prices,
 * hours, address, ratings) are the studio's own and are checked against its
 * Yandex Maps listing; reviews are quoted verbatim and are not to be
 * edited. Edit this file to change the site; components never hard-code
 * text.
 *
 * Facts checked against the listing on 2025-08-29:
 *   rating 5,0 · 119 оценок · 98 отзывов · «Хорошее место 2026»
 *   ежедневно 10:00–21:00 · Коммунарка, Бачуринская 11А к1
 */

export const site = {
  name: "ViART",
  tagline: "Студия лазерной эпиляции и аппаратного массажа",
  city: "Москва, Коммунарка",
  address: "Бачуринская улица, 11Ак1, 1 этаж",
  phone: "+7 963 355-58-88",
  phoneHref: "tel:+79633555888",
  whatsapp: "https://wa.me/79633555888",
  booking: "https://n1177049.yclients.com",
  maps: "https://yandex.ru/maps/org/viart/223859357337/",
  hours: "Ежедневно 10:00–21:00",
  domain: "viart-msk.ru",
};

/**
 * Navigation.
 *
 * Four entries, ordered by what a visitor is actually here to do. Three of
 * the four are anchors on the home page rather than pages: the price list,
 * the reviews and the contact details all live in bands of their own, and a
 * separate page for each would only put a navigation between the visitor
 * and an answer that is already written.
 */
export const nav = [
  { label: "Услуги и цены", href: "/#prices" },
  { label: "Мастер", href: "/masters" },
  { label: "Вопросы", href: "/faq" },
  { label: "Где мы", href: "/#contacts" },
];

export const announce = {
  text: "Новым клиентам — 30% на любой комплекс",
  cta: "Записаться",
  href: site.booking,
};

/**
 * The offer, in one line.
 *
 * The studio has exactly one thing to say before a price, and it is
 * repeated in three registers: the announcement pill under the header
 * (`announce`, shortest), this line wherever the offer has to travel with
 * the prices — the foot of the mobile menu and the head of the price
 * panel — and the full sentence over the price band (`pricing.title`).
 * All three are the same fact; only one of them is ever on screen twice.
 */
export const offer = "Скидка 30% на любой комплекс при первом посещении";

/**
 * The photograph the first screen is made of.
 *
 * The studio's own shot of the TURBO G8 handpiece: it is the only picture
 * in the library where the lit violet spheres — the colour the whole site
 * is built on — are the subject rather than a detail.
 *
 * It used to be the phone's fallback for a collage of six circles that
 * would not fit; now it is the first screen at every width, because it
 * turned out to be the better composition on the wide one too. See the
 * note in `components/HeroStage`.
 */
export const heroBackdrop = {
  src: "/photos/master-massage.webp",
  alt: "Мастер ViART с манипулой TURBO G8",
};

/**
 * Band 1 — hero.
 *
 * The heading is one phrase in two lines, both in the same face and the
 * same weight. `titleTail` is the second line, not a differently-styled
 * accent: the break is the only thing separating them, and it falls where
 * it does so the district lands on a line of its own.
 */
export const hero = {
  titleLead: "Лазерная эпиляция и массаж",
  titleTail: "в Коммунарке",
  subtitle:
    "Пространство на Бачуринской, где время принадлежит только вам. Мы не работаем по протоколам «для всех» — каждый импульс лазера и движение аппарата настраиваются под вашу физиологию.",
  primary: { label: "Записаться онлайн", href: site.booking },
  secondary: { label: "Смотреть цены", href: "#prices" },
  /** Trust row under the buttons — verified against the Yandex listing. */
  trust: [
    { value: "5,0", label: "на Яндекс Картах" },
    { value: "98", label: "отзывов" },
    { value: "2026", label: "«Хорошее место»" },
  ],
  /* The six media circles that stood either side of this heading are
     gone, and their `tiles` list with them: three a side, placed off a
     measured 359×521 box and scattered outwards on scroll. None of them
     was ever large enough to look at, and every one of them was competing
     with the sentence above. The same photographs are further down the
     page at a size where they can be looked at. */
};

/* ------------------------------------------------------------------ *
 * Prices                                                              *
 * ------------------------------------------------------------------ */

/**
 * The price list.
 *
 * Two audiences crossed with three kinds of thing you can buy. That grid is
 * what makes a forty-row price list answerable — a woman looking for a
 * bikini price and a man looking for a back price never see each other's
 * rows, and the course packages sit apart from the per-zone list instead
 * of being mixed into it.
 *
 * `zones`     — per-zone laser, grouped by part of the body.
 * `complexes` — the four named courses, with the first-visit price beside
 *               the standing one.
 * `massage`   — TURBO G8, the same for everyone, so it is not split.
 */
export const pricing = {
  /**
   * The band's heading is the offer, and there is nothing else above the
   * numbers. «Честные цены. Без скрытых условий.» sat here over a
   * paragraph explaining that the prices were honest — which is not
   * something a visitor arrives at a price list wanting to be told. The
   * one thing worth saying before the numbers is the thing that changes
   * them.
   */
  title:
    "Новым клиентам действует скидка 30% на любой комплекс лазерной эпиляции при первом посещении.",
  note: "Точную сумму комплекса мастер назовёт после осмотра зоны.",
  primary: { label: "Записаться онлайн", href: site.booking },
  secondary: { label: "Спросить в WhatsApp", href: site.whatsapp },
  bookLabel: "Записаться",
  /**
   * `short` is the label a phone gets.
   *
   * Three pills reading «Лазерная эпиляция · Комплексы эпиляции ·
   * Аппаратный массаж» need about 460px of pill; a 390px phone offers the
   * control roughly 300. The third tab was the one that paid for it — it
   * fell off the end of the row, so the massage prices had no visible way
   * in on a phone at all. Every word cut here is one already said by the
   * band it sits in: it is the price list, so «эпиляция» does not need
   * «лазерная» in front of it to be understood.
   */
  audiences: [
    { id: "women", label: "Для женщин", short: "Женщины" },
    { id: "men", label: "Для мужчин", short: "Мужчины" },
  ],
  views: [
    { id: "zones", label: "Лазерная эпиляция", short: "Эпиляция" },
    { id: "complexes", label: "Комплексы эпиляции", short: "Комплексы" },
    { id: "massage", label: "Аппаратный массаж", short: "Массаж" },
  ],
  zones: {
    women: [
      {
        title: "Лицо и шея",
        items: [
          ["Верхняя губа", "700 ₽"],
          ["Подбородок", "700 ₽"],
          ["Щёки", "800 ₽"],
          ["Бакенбарды", "700 ₽"],
          ["Лицо полностью", "2 500 ₽"],
        ] as [string, string][],
      },
      {
        title: "Руки и тело",
        items: [
          ["Подмышки", "1 100 ₽"],
          ["Руки до локтя", "1 300 ₽"],
          ["Руки полностью", "2 500 ₽"],
          ["Плечи", "1 500 ₽"],
          ["Живот", "1 200 ₽"],
          ["Спина — верх или низ", "1 300 ₽"],
          ["Спина полностью", "2 500 ₽"],
          ["Грудь", "600 ₽"],
        ] as [string, string][],
      },
      {
        title: "Интимные зоны",
        items: [
          ["Бикини классик", "2 500 ₽"],
          ["Глубокое бикини", "3 500 ₽"],
          ["Бразильское бикини", "4 300 ₽"],
          ["Бикини + ягодицы", "4 900 ₽"],
        ] as [string, string][],
      },
      {
        title: "Ноги",
        items: [
          ["Голень", "2 000 ₽"],
          ["Бёдра", "2 000 ₽"],
          ["Ноги до колена", "2 500 ₽"],
          ["Ноги полностью", "3 500 ₽"],
        ] as [string, string][],
      },
    ],
    men: [
      {
        title: "Голова и шея",
        items: [["Борода / шея", "2 500 ₽"]] as [string, string][],
      },
      {
        title: "Торс, руки и спина",
        items: [
          ["Спина полностью", "3 300 ₽"],
          ["Грудь + живот", "3 500 ₽"],
          ["Плечи", "1 500 ₽"],
        ] as [string, string][],
      },
    ],
  },
  complexes: {
    women: [
      {
        name: "«Начальный»",
        detail: "Тотальное бикини + подмышки",
        price: "3 300 ₽",
        firstVisitPrice: "2 310 ₽",
      },
      {
        name: "«Супер»",
        detail: "Тотальное бикини + подмышки + голени + колени",
        price: "4 800 ₽",
        firstVisitPrice: "3 360 ₽",
      },
      {
        name: "«Популярный»",
        detail: "Тотальное бикини + подмышки + ноги полностью",
        price: "5 900 ₽",
        firstVisitPrice: "4 130 ₽",
      },
      {
        name: "«Основной»",
        detail: "Тотальное бикини + подмышки + ноги полностью + руки до локтя",
        price: "6 900 ₽",
        firstVisitPrice: "4 830 ₽",
      },
    ],
    men: [
      {
        name: "«Начальный»",
        detail: "Лицо + подмышки",
        price: "4 800 ₽",
        firstVisitPrice: "3 360 ₽",
      },
      {
        name: "«Популярный»",
        detail: "Пах полностью + подмышки",
        price: "5 000 ₽",
        firstVisitPrice: "3 500 ₽",
      },
      {
        name: "«Супер»",
        detail: "Спина полностью + грудь или живот + подмышки",
        price: "6 500 ₽",
        firstVisitPrice: "4 550 ₽",
      },
      {
        name: "«Основной»",
        detail: "Спина полностью + пах полностью + подмышки",
        price: "7 300 ₽",
        firstVisitPrice: "5 110 ₽",
      },
    ],
  },
  /** TURBO G8 is the same list for everyone, so it is not split by audience. */
  massage: [
    ["Вибромассаж TURBO G8 «Коррекция фигуры»", "первое посещение 1 500 ₽, далее 2 500 ₽"],
    ["Комплекс «Упругие ягодицы»", "2 500 ₽"],
    ["Комплекс «Плоский живот»", "2 500 ₽"],
    ["Вибромассаж Turbosculpt, 2 зоны", "2 500 ₽"],
  ] as [string, string][],
};

/**
 * The reel band under the first section.
 *
 * The studio's own footage: the closing seconds of the tour reel, where
 * the EVERLAS handpiece actually works down a leg.
 *
 * It began as a full-bleed strip with nothing else in the band, which
 * meant a 720×1280 vertical clip stretched across 1440px. It is a tall
 * frame in the middle of the band now, with a customer either side of it
 * — see `reelQuotes`. The clip is the largest thing on this part of the
 * page and the two quotes are what it is evidence for.
 */
export const showreel = {
  src: "/videos/laser-close.mp4",
  poster: "/photos/poster-laser.webp",
  alt: "Диодный лазер EVERLAS в работе",
};

/**
 * Band 2 — the studio's philosophy.
 *
 * `focus` is the crop's object-position. Two of these photos have their
 * subject well off centre — the handpiece sits low in the EVERLAS shot,
 * the signage sits high in the evening shopfront — so a default centre
 * crop cut the very thing the card is about. The value travels with the
 * photo rather than being hard-coded into the band.
 *
 * ── The watermark rule ────────────────────────────────────────────────
 *
 * One rule now decides `focus` before anything else does, everywhere a
 * square or a card crops one of the studio's own photographs: if the shot
 * carries the ViART watermark, the crop keeps the whole of it.
 *
 * These are the studio's photographs and the mark is on them; a crop that
 * slices it in half reads as a stock picture with something spilled in the
 * corner. Which end of the frame that means depends on the shot — the mark
 * is bottom-left on most of them (`center 100%`) and top-centre on the
 * business-card shot (`center 0%`) — so the value is per photo, as ever.
 * Photographs with no watermark (the flowers, the gel) are still cropped
 * for their subject.
 */
export const values = {
  title: "Уважение к вашему времени и телу",
  lead: "Мы пересмотрели стандарты индустрии, чтобы убрать из нее суету и потоковость. В ViART нет случайных людей и спешки. За качественной эстетикой больше не нужно ехать в центр Москвы.",
  items: [
    {
      title: "Буферное время",
      src: "/photos/interior-flowers.webp",
      focus: "center 50%",
      body: "Следующий клиент не дышит вам в спину. Мы оставляем комфортный запас времени между записями. Вы спокойно собираетесь, мы — готовим кабинет.",
    },
    {
      title: "Осознанный подход",
      src: "/photos/apparatus-controls.webp",
      // Bottom of the frame: the watermark sits in the lower left of this
      // shot and a square crop at 72% cut it in half. See the note on
      // `values` above — a tile that carries the mark is a tile that says
      // whose room this is.
      focus: "center 100%",
      body: "Мы не экономим на результате. Мастер ориентируется исключительно на реакцию вашей кожи сегодня, а не на абстрактные нормы.",
    },
    {
      title: "Мастер с опытом",
      src: "/photos/prep-gel.webp",
      focus: "center 50%",
      body: "Анна работает в аппаратной косметологии более трех лет. Она читает реакции тела и управляет процессом так, чтобы процедура была эффективной и безопасной.",
    },
  ],
};

/**
 * Band 3 — how a session actually runs.
 *
 * Three squares, the same unit as the band above. Keep the bodies to two
 * lines: the caption block is the width of its square, and a third line
 * unbalances the row.
 */
export const process = {
  title: "Работаем с физиологией, а не с кнопкой «Старт»",
  lead: "То, что сработало на прошлом клиенте, может не подойти вам. Мы исключили конвейерные настройки.",
  steps: [
    {
      title: "Оценка зоны",
      body: "Перед каждым сеансом анализируем плотность волоса, пигмент и состояние кожи. Учитываем даже недавний загар.",
      src: "/photos/lounge-guest.webp",
      focus: "center 40%",
    },
    {
      title: "Точная калибровка",
      body: "Настраиваем мощность аппарата так, чтобы процедура давала максимум результата, но оставалась в зоне вашего комфорта.",
      // The room, not another close-up of the handpiece: this band already
      // opened with the apparatus screen two tiles ago, and calibration is
      // what happens in a prepared cabinet — the machine standing ready by
      // the couch says that better than a second photograph of the same
      // control panel.
      src: "/photos/room-couch.webp",
      focus: "center 100%",
    },
    {
      title: "Ваш контроль",
      body: "Вы управляете процессом. Если нужно снизить интенсивность — мы делаем это мгновенно. У нас нет правила «нужно просто перетерпеть боль».",
      src: "/photos/procedure.webp",
      // The watermark sits across the lower middle of this shot; a centred
      // square crop took the bottom third of it off.
      focus: "center 100%",
    },
  ],
  cta: { label: "Открыть онлайн-запись", href: site.booking },
};

/**
 * Band 4 — the equipment, in two cards.
 *
 * `body` is the studio's own paragraph about the machine and `feels` is
 * what the visitor will actually experience, which is the part anyone
 * books on. There was a `facts` list of specifications between them; it
 * has been dropped, so nothing here is a claim about certification or
 * clinical outcome — only what the visit is like.
 */
export const equipment = {
  title: "Технологии, которым мы доверяем",
  lead: "Мы выбрали аппараты, которые доказывают свою эффективность на деле, а не в рекламных буклетах.",
  items: [
    {
      name: "EVERLAS",
      role: "Диодный лазер для эпиляции",
      src: "/photos/apparatus-controls.webp",
      // 93%, not 100%, and the seven points matter.
      //
      // A 16:10 card shows a band barely 42% of this portrait shot's
      // height, so the watermark rule bites hardest here — but taking the
      // very bottom of the frame left the mark floating clear of the edge
      // with the strapline and a stretch of floor under it. 93% is the
      // value where the window's lower edge lands on the «ViArt»
      // baseline: the mark sits *on* the edge of the picture, where a
      // mark belongs, and the strapline goes with the floor.
      //
      // It is a narrow setting — 91% cuts the letters through the middle,
      // 96% opens a visible gap under them — so measure before moving it.
      // Both apparatus photographs are 853×1280 with the mark in the same
      // place, so both take the same value; see TURBO G8 below.
      focus: "center 93%",
      // The reference for the pair: this one is shot closest, so it is the
      // one that stays as it comes. See `zoom` on TURBO G8 below.
      zoom: 1,
      zoomOrigin: "left bottom",
      accent: "aqua" as const,
      body: "Интеллектуальная диодная система с мощным контактным охлаждением. Во время процедуры вы чувствуете только легкий холод, даже на самых деликатных зонах. Волос уходит равномерно, кожа остается нетронутой.",
      feels: [
        {
          title: "Комфорт вместо терпения",
          body: "Охлаждаемая насадка снимает большую часть ощущения от импульса — остаётся прохладное прикосновение и короткое тепло.",
        },
        {
          title: "Зона за один подход",
          body: "Обработка идёт ровно, без долгих пауз на перенастройку между участками.",
        },
        {
          title: "Кожа спокойнее",
          body: "Уходит то, что остаётся после бритвы и воска: раздражение, вросшие волосы, порезы.",
        },
      ],
    },
    {
      name: "TURBO G8",
      role: "Аппаратный вибромассаж тела",
      src: "/photos/massage-turbo.webp",
      // Same 16:10 band and the same 93% as EVERLAS above, for the same
      // reason: the wordmark ends within a pixel or two of where it does in
      // that shot, so the same crop puts it on the edge of this card too.
      focus: "center 93%",
      // 1.16, because the two cards were photographed from different
      // distances and `object-fit: cover` cannot fix that: both files are
      // 853×1280 and both fill the same 16:10 band, so whatever the crop,
      // EVERLAS arrived closer. The tell was the watermark — measured on
      // the 16:10 crop at native width the «ViArt» wordmark runs 330px
      // there against 285px here, and a mark that changes size between two
      // cards side by side reads as sloppy work, not as two photographs.
      //
      // 330/285 is 1.16, and that is the whole derivation. The anchor is
      // the bottom-right corner because that is where this frame's mark
      // sits: growing the picture from there leaves the mark on the edge
      // it was already on, at the size of its neighbour, and spends the
      // 16% on the left margin instead — which here is a forearm and the
      // edge of the couch. Re-measure if either photograph is replaced.
      zoom: 1.16,
      zoomOrigin: "right bottom",
      accent: "lav" as const,
      body: "Честная и глубокая проработка тела. Вибромассаж снимает мышечные спазмы, выводит лишнюю жидкость и корректирует контуры. Интенсивность подбирается так, чтобы после сеанса вы чувствовали легкость, а не усталость.",
      feels: [
        {
          title: "Легкость сразу после",
          body: "Мышечные зажимы отпускают, в ногах и спине появляется ощущение разгруженности.",
        },
        {
          title: "Тонус и контуры",
          body: "Лимфодренаж выводит лишнюю жидкость, кожа становится ровнее, объёмы — собраннее.",
        },
        {
          title: "Своя интенсивность",
          body: "Частота и сила регулируются плавно, под ваш порог, а не под средний по кабинету.",
        },
      ],
    },
  ],
  cta: { label: "Выбрать процедуру", href: site.booking },
  note: `${site.name} · Бачуринская, 11Ак1 · ежедневно 10:00–21:00`,
};

/** Kept for the links that used to live on the equipment band. */
export const booking = {
  cta: { label: "Открыть онлайн-запись", href: site.booking },
};

/** Band — three ways in, above the full price sheet. */
export const packages = {
  title: "Выберите, что нужно сейчас",
  lead: "Одна зона, несколько зон за один визит или аппаратный массаж.",
  items: [
    {
      name: "Одна зона",
      src: "/photos/card-desk.webp",
      // The one photograph in the library whose watermark is at the *top*,
      // so this is the one tile the rule pushes the other way: the crop
      // takes the top of the frame, not the bottom.
      focus: "center 0%",
      meta: "разовый визит",
      price: "от 600 ₽",
      body: "Для тех, кому нужна точечная работа, продолжение курса или разовая поддерживающая процедура.",
      cta: "Выбрать зону",
    },
    {
      name: "Комплекс",
      src: "/photos/room-couch.webp",
      focus: "center 50%",
      meta: "−30% новым клиентам",
      price: "от 2 500 ₽",
      body: "Эстетика в деталях. Для новых клиентов — минус 30% на любой комплекс лазерной эпиляции при первом визите.",
      cta: "Выбрать комплекс",
      featured: true,
    },
    {
      name: "TURBO G8",
      // The master holding the handpiece, not the handpiece on a stomach.
      // The apparatus itself is already the picture on the equipment card
      // further up the page, and this tile is the one you book from — what
      // sells a first session is the specialist who will run it. The shot
      // carries the watermark low and right, so the crop takes the bottom.
      src: "/photos/master-massage.webp",
      focus: "center 100%",
      meta: "первый сеанс",
      price: "1 500 ₽",
      body: "Сеанс аппаратного массажа для восстановления тонуса тела и снятия напряжения.",
      cta: "Записаться на массаж",
    },
  ],
  note: "Полный список услуг и стоимость каждой зоны — ниже, в разделе «Услуги и цены».",
};

export const location = {
  kicker: "Где мы",
  photo: { src: "/photos/facade-day.webp", alt: "Фасад студии ViART, Бачуринская 11Ак1" },
  photoEvening: { src: "/photos/facade-evening.webp", alt: "Вход в студию ViART вечером" },
  title: "Коммунарка, Бачуринская 11Ак1",
  body: `${site.hours}. Первый этаж, парковка у входа, Wi-Fi, оплата картой.`,
  cta: { label: "Построить маршрут", href: site.maps },
  /**
   * Live Yandex map, pinned on the studio's own listing.
   *
   * Addressed by organisation id rather than by coordinates: the pin is
   * then Yandex's own record of the studio — name, hours, reviews on tap —
   * and it cannot drift out of position if the listing is ever moved.
   */
  map: {
    src: "https://yandex.ru/map-widget/v1/?mode=search&oid=223859357337&ol=biz&z=17",
    title: "ViART на карте — Бачуринская 11Ак1, Коммунарка",
  },
  amenities: ["Парковка", "Wi-Fi", "Оплата картой", "Доступно для колясок", "Можно с собакой до 35 см"],
};

/**
 * Band with the rating and the three studio reels.
 *
 * The heading is the award and nothing else. It used to be «Нам доверяют
 * свой комфорт» over a paragraph about the rating, then a pill repeating
 * the award, then a second paragraph about what the reviews say — four
 * pieces of writing all making the same point that the three figures under
 * them make on their own. The figures and the reels are the evidence; the
 * heading only has to name it.
 *
 * Numbers are the studio's live Yandex Maps figures — update them together
 * with the reviews below.
 */
export const proof = {
  title: "«Хорошее место 2026»",
  /** `to` drives the count-up; `display` is what is finally shown. */
  stats: [
    { to: 5, display: "5,0", decimals: 1, label: "рейтинг на Яндекс Картах" },
    { to: 98, display: "98", decimals: 0, label: "отзывов" },
    { to: 119, display: "119", decimals: 0, label: "оценок" },
  ],
  /**
   * Three vertical reels under the figures — the studio's own footage, not
   * stills. All three are the same size and sit on the same line at
   * desktop; on a phone the row becomes a swipeable strip, because three
   * 9:16 frames across 390px is 117px each and nothing in them is legible.
   *
   * Each reel carries sound. See components/VideoTile.
   */
  gallery: [
    {
      label: "студия",
      caption: "ViART изнутри",
      src: "/videos/studio-tour.mp4",
      poster: "/photos/poster-studio-tour.webp",
    },
    {
      label: "турбомассаж",
      caption: "TURBO G8",
      src: "/videos/procedure.mp4",
      poster: "/photos/poster-procedure.webp",
    },
    {
      label: "процедура",
      caption: "EVERLAS",
      src: "/videos/master-work.mp4",
      poster: "/photos/poster-master-work.webp",
    },
  ],
};

/**
 * The vertical photo rail.
 *
 * Six 9:16 frames of the studio as a place — the room, the light, the
 * details of the service — running as a slow marquee on a pointer device
 * and as a swipeable snap strip on a phone. It is the one band on the page
 * with nothing to read and nothing to click: it exists to answer «what is
 * it actually like in there» before anyone asks it.
 *
 * Which is also why it carries a heading and no lead: a line explaining
 * that the photographs are of the studio, above eight photographs of the
 * studio, is a caption for people who cannot see.
 */
export const stories = {
  title: "Наш ViART",
  items: [
    { src: "/photos/room-mirror.webp", alt: "Кабинет студии ViART", focus: "center 40%" },
    { src: "/photos/interior-flowers.webp", alt: "Интерьер студии", focus: "center 45%" },
    { src: "/photos/master-massage.webp", alt: "Мастер за работой", focus: "center 35%" },
    { src: "/photos/lounge-guest.webp", alt: "Зона отдыха", focus: "center 40%" },
    { src: "/photos/mirror-guest.webp", alt: "После процедуры", focus: "center 35%" },
    { src: "/photos/room-couch.webp", alt: "Кабинет и кушетка", focus: "center 50%" },
    { src: "/photos/lounge-drinks.webp", alt: "Напитки в зоне отдыха", focus: "center 45%" },
    { src: "/photos/facade-evening.webp", alt: "Вход в студию вечером", focus: "center 22%" },
  ],
};

/**
 * The master.
 *
 * `about` is the master page's main band. Every line is ViART's own copy.
 *
 * `credentials` is deliberately empty. A diploma, a training school and a
 * number of years are exactly the facts a visitor weighs a master by, and
 * exactly the facts nobody should invent: fill the rows in and the block
 * appears, leave it empty and the page simply does without it.
 */
export const master = {
  photo: { src: "/photos/master-massage.webp", alt: "Анна, мастер студии ViART, за работой" },
  name: "Анна",
  role: "Специалист аппаратной эстетики ViART",
  intro:
    "В лазерной эпиляции и массаже важен не только класс оборудования, но и руки, которые им управляют. Опыт Анны — более трех лет в аппаратной косметологии. Но главная ее компетенция — это умение читать реакции вашего тела и создавать пространство, где вы чувствуете себя абсолютно спокойно.",
  /** The home page's shorter version of the same paragraph. */
  body: "Опыт Анны — более трех лет в аппаратной косметологии. Главная её компетенция — умение читать реакции вашего тела и создавать пространство, где вы чувствуете себя абсолютно спокойно.",
  facts: [
    ["Опыт", "3+ года"],
    ["Аппараты", "EVERLAS · TURBO G8"],
    ["Направления", "Лазерная эпиляция · аппаратный массаж"],
  ] as [string, string][],
  primary: { label: "Записаться к Анне", href: site.booking },
  secondary: { label: "О мастере", href: "/masters" },

  /** The quote band on the master page. */
  quote: {
    text: "Моя задача — сделать так, чтобы вы выдыхали, переступая порог кабинета.",
    body: "Я не работаю по бездушным протоколам. Для меня каждая процедура — это диалог с вашей физиологией. Я слежу за малейшими изменениями кожи, регулирую мощность аппарата в реальном времени и никогда не прошу «немного потерпеть», если вам некомфортно. Эффективность не должна достигаться через боль.",
  },

  aboutTitle: "Как проходит ваш сеанс",
  aboutLead: "Три вещи, которые не зависят от того, первый это визит или десятый.",
  about: [
    {
      title: "Полная приватность",
      body: "Кабинет — это закрытая зона вашего комфорта. Мы гарантируем абсолютную деликатность и отсутствие оценивающих взглядов. Вы в безопасном пространстве.",
    },
    {
      title: "Уважение к вашему настроению",
      body: "Хотите помолчать и отдохнуть после тяжелого дня? Процедура пройдет в тишине. Хотите узнать всё о том, как работает лазер? Анна подробно ответит на каждый вопрос.",
    },
    {
      title: "Честная экспертиза",
      body: "Анна не будет советовать вам дополнительные зоны или курс массажа, если не видит в этом объективной необходимости для вашего тела.",
    },
  ],

  /** The closing band on the master page. */
  trust: {
    title: "Почему клиенты возвращаются",
    body: "В 90% отзывов о нашей студии гости в первую очередь отмечают работу мастера. Отсутствие спешки, легкая рука и тактичность — это то, что превращает обязательную рутину по уходу за собой в комфортный ритуал.",
    cta: { label: "Записаться к Анне", href: site.booking },
    note: "Выберите удобное время онлайн. Если вы у нас впервые, мы заложим дополнительное время на консультацию и знакомство.",
  },

  /**
   * Fill these in and the credentials row renders. `[label, value]`, e.g.
   * ["Образование", "…"], ["Опыт", "… лет"], ["Сертификаты", "…"].
   */
  credentials: [] as [string, string][],
};

/**
 * Reviews band.
 *
 * Real reviews, quoted verbatim from the studio's Yandex Maps listing
 * (yandex.ru/maps/org/viart/223859357337/reviews). Do not edit the text —
 * these are customers' own words. To refresh, re-read the listing.
 */
export const reviews = {
  title: "Отзывы клиентов",
  source: `${site.maps}reviews/`,
  sourceLabel: "Все отзывы на Яндекс Картах",
  /**
   * Anna's own invitation, in the middle of the band.
   *
   * The source is 464×848 — the smallest asset on the site — so the frame
   * it is shown in is deliberately narrow. Blowing it up to the width of
   * the reels beside it is what made it look soft.
   */
  video: {
    src: "/videos/anna-invite.mp4",
    poster: "/photos/poster-anna.webp",
    label: "Анна приглашает на процедуру",
    caption: "Анна приглашает на процедуру",
  },
  /**
   * Order is deliberate: the first three run down the left of the video and
   * the last two down the right, and they are sorted so the two columns
   * come out close to the same height.
   */
  items: [
    {
      author: "Любовь Найденова",
      date: "10 июня 2025",
      stars: 5,
      text: "Роскошный мастер Анна! Пришла на лазерную эпиляцию, переживала, что будет чувствительно. Аня меня успокоила, подобрала комфортный режим и мы просто час проболтали нон-стоп! Берегите свои кадры, такие чудесные мастера – это навес золота! Очень рекомендую этот салон! Спасибо, что открылись в моем доме🥰",
    },
    {
      author: "Алина Б.",
      date: "25 апреля 2025",
      stars: 5,
      text: "Прекрасная студия эпиляции! Очень приветливые сотрудники, обязательно выйдете из этого места с замечательным настроением! Мастер профессионал своего дела, все подробно объяснила и рассказала по поводу процедуры! Дают советы и рекомендации, тщательно следят за своей работой и каждым клиентом, все нацелено на результат. Чувствуется компетентность!",
    },
    {
      author: "Lilia Kristyan",
      date: "25 марта 2025",
      stars: 5,
      text: "Была на лазерное процедура к мастеру Анна хочу сказать очень внимательная приятная девочка знает свою работу процедура прошла успешно безболезненно благодарю ей большое, 🥰 записалась повторно теперь только сюда всем советую ещё хочу сказать что девушка на ресепшен очень приятная да и в целом очень чисто и уютная атмосфера 🤗",
    },
    {
      author: "Аделина К.",
      date: "27 июня 2025",
      stars: 5,
      text: "Осталась в восторге от посещения этого салона! Персонал очень дружелюбный, вежливый и профессиональный — мастер подробно объяснила процедуру, дала рекомендации по уходу за кожей и сделала всё аккуратно и безболезненно. Чувствуется, что здесь работают настоящие профессионалы. Салон чистый, уютный, приятная атмосфера. Используют качественные материалы и современное оборудование. Цены адекватные, особенно учитывая уровень сервиса. После процедуры кожа гладкая, без раздражения. Однозначно рекомендую этот салон всем, кто ценит комфорт и качество! Буду возвращаться снова.",
    },
    {
      author: "Natahabaklakova",
      date: "11 марта 2025",
      stars: 5,
      text: "Не просто хорошее место, а очень хорошее место! Невероятно приветливые и профессиональные девочки, которые встречают и провожают вас с улыбкой) мастера профессионалы своего дела, которое они делают с любовью к вам, к вашему здоровью! Дают советы и рекомендации! Чувствуется компетентность и основательность в подходе к каждому клиенту! Это удивительные ощущения легкости и эйфории после сеанса♥️ Мастер Аня очень чутко проводит аппаратный массаж учитывая ваши индивидуальные особенности! Рекомендую очень эту волшебную студию, где вас окружат заботой и любовью ♥️",
    },
  ],
  /**
   * The rest of the wall. The home page shows five; the master page shows
   * everything, so these sit apart rather than lengthening the band on the
   * front page. Same source, same rule: customers' own words, not edited.
   */
  more: [
    {
      author: "Виктория Булавская",
      date: "22 февраля 2025",
      stars: 5,
      text: "Лучшая студия лазерной эпиляции. Мастер Виолетта и мастер Анна шикарные мастера. Результат есть, процедуры проходят в комфортной атмосфере, все очень доброжелательные и приятные.",
    },
    {
      author: "Лиза Алексеева",
      date: "3 декабря 2024",
      stars: 5,
      text: "Добрый день! Хочу поделиться своими приятными впечатлениями о процедуре лазерной эпиляции всего тела, которую проводила замечательный профессионал своего дела — специалист Анастасия. Очень давно хотела сделать эпиляцию, но не решалась, тк ошибочно думала, что это больно.",
    },
    {
      author: "Людмила Иванова",
      date: "8 января 2025",
      stars: 5,
      text: "Я уже проходила курсы лазерной эпиляции и сегодня впервые посетила ViART, хочу сказать что мне очень понравилось! Я рекомендую всем! Во-первых, привлекла акция 30% на первую процедуру, но даже без акций цены демократичные. Во-вторых, там очень приветливые девушки.",
    },
  ],
};

/**
 * The two customers who flank the laser reel.
 *
 * Referenced rather than repeated: they are the same verbatim Yandex
 * reviews as everywhere else, and a second copy of the text would be a
 * second thing to keep in step. Both are picked for the same two reasons —
 * they are about the laser specifically, and they are short enough to read
 * in a column beside a video.
 */
export const reelQuotes = [reviews.more[0], reviews.more[2]];

export const giftStrip = {
  text: "Хотите подарить процедуру или оформить сертификат?",
  cta: "Напишите нам",
  href: site.whatsapp,
};

export const closing = {
  title: "Выберите удобное время",
  body: "Онлайн-запись открыта круглосуточно. Если не уверены, какую услугу выбрать, напишите в WhatsApp — подскажем.",
  primary: { label: "Записаться онлайн", href: site.booking },
  secondary: { label: "Написать в WhatsApp", href: site.whatsapp },
  /**
   * Every way of reaching the studio, in the last band anyone reads.
   * `[label, value, href?]`.
   */
  contacts: [
    ["Адрес", `${site.city}, ${site.address}`, site.maps],
    ["Часы работы", site.hours],
    ["Телефон", site.phone, site.phoneHref],
    ["WhatsApp", "Написать в WhatsApp", site.whatsapp],
    ["Онлайн-запись", "Открыть расписание", site.booking],
  ] as [string, string, string?][],
};

export const footer = {
  columns: [
    {
      title: "Услуги",
      links: [
        { label: "Лазерная эпиляция", href: "/#prices" },
        { label: "Аппаратный массаж", href: "/#prices" },
        { label: "Цены", href: "/#prices" },
      ],
    },
    {
      title: "Студия",
      links: [
        { label: "Мастер", href: "/masters" },
        { label: "Отзывы", href: "/#reviews" },
        { label: "Вопросы", href: "/faq" },
      ],
    },
    {
      title: "Контакты",
      links: [
        { label: site.phone, href: site.phoneHref },
        { label: "WhatsApp", href: site.whatsapp },
        { label: "Как добраться", href: "/#contacts" },
        { label: "Онлайн-запись", href: site.booking },
      ],
    },
  ],
};

/* ------------------------------------------------------------------ */
/* Questions                                                           */
/* ------------------------------------------------------------------ */

/**
 * The three questions people hesitate over, on the home page.
 *
 * Deliberately not the whole FAQ: three is what someone will read in the
 * middle of deciding, and the link under them is for the person who wants
 * the rest. The answers are shorter than their counterparts on /faq for
 * the same reason.
 */
export const homeFaq = {
  title: "Три вопроса, которые задают чаще всего",
  items: [
    {
      q: "Это больно? Какие ощущения во время процедуры?",
      a: "Процедура проходит максимально комфортно. Благодаря встроенной системе контактного охлаждения манипулы вы чувствуете только легкое тепло и приятную прохладу. Никаких ожогов и нестерпимой боли.",
    },
    {
      q: "Сколько сеансов потребуется для стойкого эффекта?",
      a: "Заметный результат наступает уже после 1–2 визитов: волос замедляет рост, спадает отечность. Для стойкого закрепления эффекта обычно требуется курс.",
    },
    {
      q: "Как подготовиться к первому визиту?",
      a: "Для лазерной эпиляции достаточно сбрить зону бритвой за 12–24 часа до визита. Для аппаратного массажа рекомендуем пить больше чистой воды.",
    },
  ],
  link: {
    lead: "Остались вопросы о противопоказаниях или длительности курса?",
    label: "Смотреть все вопросы и ответы",
    href: "/faq",
  },
};

/** The full list, on /faq. */
export const faq = {
  title: "Отвечаем прямо",
  lead: "Собрали ответы на главные вопросы о процедурах, оборудовании и подготовке к визиту.",
  items: [
    {
      q: "Это больно?",
      a: "EVERLAS оснащен встроенной системой контактного охлаждения. Во время сеанса вы чувствуете лишь легкое покалывание и прохладу. Если вам станет некомфортно, мастер мгновенно скорректирует мощность. Боль не является показателем эффективности.",
    },
    {
      q: "Сколько процедур потребуется?",
      a: "Физиология индивидуальна. В среднем для стойкого результата необходимо от 8 до 12 сеансов. Мы ценим честность, поэтому не обещаем «удалить всё навсегда за 3 раза».",
    },
    {
      q: "Нужно ли отращивать волосы перед лазером?",
      a: "Нет. Напротив, за 12–24 часа до визита зону необходимо аккуратно побрить. Лазер воздействует на фолликул (корень волоса) под кожей, а не на его видимую часть.",
    },
    {
      q: "Можно ли прийти только на массаж?",
      a: "Да, аппаратный массаж TURBO G8 работает как полностью самостоятельная процедура. Вы можете записаться исключительно на него.",
    },
    {
      q: "Что если я у вас впервые и не знаю, какая мощность мне нужна?",
      a: "Вам не нужно об этом думать. На первом сеансе мастер проведет осмотр, оценит тип кожи и волоса, и начнет работу с минимальных безопасных значений, постепенно калибруя аппарат по вашим ощущениям.",
    },
  ],
  closing: {
    title: "Остались вопросы?",
    body: "Напишите нам, и мы подробно проконсультируем вас перед записью.",
    cta: { label: "Записаться онлайн", href: site.booking },
  },
};
