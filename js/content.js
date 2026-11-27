/* =========================================================
   Dalia's Birthday Journey — ALL editable settings + text
   Edit anything here; no need to touch app.js.
   Text tips:
     *word*   → that word pops in gold (one word between the stars)
     <bdi>…</bdi> → keeps equations / Korean the right way round in Arabic
   ========================================================= */

window.CONFIG = {
  // ✏️ Signature
  senderName: { en: "Ahmed", ar: "أحمد" },

  // Locked (countdown) until this moment. Cairo = +02:00
  // ?preview=1 skips the lock · ?reset=1 starts the journey from zero
  unlockAt: "2026-11-28T00:00:00+02:00",

  // ✏️ Optional images: put files in assets/img and write the path. Empty = built-in graphics.
  images: { start: "", gift: "", cat: "" },

  // Birthday music (files in assets/audio, all from Wikimedia Commons — see credits below)
  tracks: {
    kathleen: "assets/audio/kathleen.mp3",
    milutis:  "assets/audio/milutis.mp3",
    mcmillan: "assets/audio/mcmillan.mp3",
    monk:     "assets/audio/monk.mp3",
    hbsa:     "assets/audio/hbsa.mp3",
    backyard: "assets/audio/backyard.mp3",
    mccloud:  "assets/audio/mccloud.mp3",
    hbpd:     "assets/audio/hbpd.mp3",
    trapper:  "assets/audio/trapper.mp3"
  },
  // ✏️ Which song plays in which part of the journey (change freely)
  music: {
    intro: "kathleen", art: "milutis", passport: "mcmillan", lab: "monk", facts: "hbsa",
    kdrama: "kathleen", pop: "backyard", gift: "mccloud", cake: "hbpd", letter: "trapper"
  },

  // Party mode song (YouTube, official audio)
  partySong: { youtubeId: "Q3Ug94p5JT0", title: "وليد توفيق — انزل يا جميل في الساحة" },

  credits: [
    "“Birthday Song” — Kathleen Martin · CC BY 3.0",
    "“Birthday Song” — Joe Milutis · CC BY 3.0",
    "“Birthday Song 2008” — John McMillan · CC BY 3.0",
    "“It's Your Birthday” — Monk Turner + Fascinoma · CC BY 3.0",
    "“Happy birthday” — Sselmer · CC BY-SA 3.0",
    "“(Badumm Badumm) Happy Birthday to ya” — Backyard Music · CC BY 3.0",
    "“Birthday Song” — McCloud Zicmuse · CC BY 3.0",
    "“Happy Birthday to You” — Pracchia-78 · Public domain",
    "“Birthday Song” — Chris Trapper · CC BY 3.0",
    "All via Wikimedia Commons · Fonts: Google Fonts · Confetti: canvas-confetti · Animation: GSAP"
  ]
};

window.CONTENT = {
/* ===================================================== ENGLISH */
en: {
  dir: "ltr",
  gate: {
    title: "Psst… you're early! 👀",
    line: "This journey unlocks at midnight on November 28. The balloons are still inflating.",
    labels: ["hours", "minutes", "seconds"],
    zero: "IT'S TIME! 🎉"
  },
  loading: [
    ["🎈", "Inflating 25 balloons…"],
    ["🎊", "Teaching the confetti to behave…"],
    ["🕯️", "Lighting 25 tiny candles…"],
    ["🎧", "Waking up the DJ…"],
    ["🎁", "Wrapping one very special surprise…"]
  ],
  start: {
    label: "✦ PLAYER 1: DALIA ✦",
    title: "Level 25<br>Unlocked",
    intro: "A birthday journey, built just for you. Tap anywhere to move forward — every screen has something hiding in it.",
    cta: "Press Start 🎮",
    sound: "🔊 Sound on — every step has its own birthday song.",
    resume: "Continue the journey ▶"
  },
  common: { tap: "tap", enter: "Tap to enter", level: "LEVEL", of: "of", close: "Close ✕" },
  chapters: {
    art: "Art Corner", passport: "Passport to 25", lab: "The 25 Lab", kdrama: "Episode 25",
    pop: "Pop 25", gift: "The Gift", cake: "The Cake", letter: "From Ahmed"
  },
  mapSay: [
    "First stop. Grab your brushes.",
    "Next: a trip with zero luggage.",
    "Nerd alert ahead. 🚨",
    "Lights, camera… you.",
    "Warning: balloons ahead.",
    "Something is waiting for you…",
    "Candles: lit. Cake: ready.",
    "Last stop. The important part."
  ],

  art: {
    intro: ["Welcome to the *Art* Corner 🎨", "Every new year deserves a palette.", "So here are *four* colors for your 25th."],
    colors: [
      { name: "Lavender", hex: "#B9A7F5", msg: "For calm mornings, slow coffee, and ideas that bloom when nobody is rushing them." },
      { name: "Gold", hex: "#F7CF6B", msg: "For the little wins: finished sketches, good playlists, and days that sparkle for no reason." },
      { name: "Mint", hex: "#9FE3C9", msg: "For fresh starts, new streets, and the brave first step into something unfamiliar." },
      { name: "Sky Blue", hex: "#8EC5F5", msg: "For curiosity as wide as the ocean. The more you wonder, the more you find." }
    ],
    outro: ["Here's the thing about *25*:", "it doesn't come pre-drawn.", "No outlines. No rules. A fresh page and *every* color.", "Paint it however you like. 🖌️"]
  },

  passport: {
    intro: ["*No* visas. *No* luggage. *No* airport lines.", "Just a passport with your name on it. ✈️"],
    cover: ["PASSPORT", "LEVEL 25", "Holder: DALIA", "Issued: 28.11.2026"],
    stamps: [
      { icon: "🎤", name: "Seoul", stamp: "SEOUL ✦ 28.11", msg: "A year with Seoul-level energy: neon nights, songs on repeat, a little dance in the kitchen.", extra: "<bdi>생일 축하해!</bdi> (saeng-il chu-ka-hae — happy birthday!)" },
      { icon: "📚", name: "Cozy Bookshop", stamp: "BOOKSHOP ✦ OPEN", msg: "Rainy-afternoon calm: a corner seat, a book that surprises you, a warm drink going cold because the chapter was too good." },
      { icon: "🏔️", name: "Somewhere Wide", stamp: "HORIZON ✦ ∞", msg: "Wide skies and long horizons — the view that makes worries look tiny and plans feel big." },
      { icon: "🐈", name: "Artist's Detour", stamp: "DETOUR ✦ SKETCH", msg: "Detours worth sketching: an old doorway, a cat on a sunny wall, a corner nobody else noticed." }
    ],
    outro: ["Passport *complete*! 🛂", "The best years leave room for new places — and a few happy surprises."]
  },

  lab: {
    intro: ["🚨 *Nerd* alert 🚨", "Your new number is smarter than it looks.", "Let's put *25* under the microscope. 🔬"],
    cards: [
      { icon: "🔢", name: "Math Magic", fact: "25 is <bdi>5 × 5</bdi>. It's <bdi>1 + 3 + 5 + 7 + 9</bdi>. And it's the smallest square made of two squares: <bdi>9 + 16</bdi>.", link: "A number that connects so many ideas at once? Sounds like someone I know." },
      { icon: "🧪", name: "Science + Art", fact: "Element 25 is manganese. In 2009 it accidentally created YInMn Blue — the first new blue pigment in 200+ years.", link: "Happy accidents make the best colors. Every artist already knew that." },
      { icon: "🪐", name: "Space", fact: "Messier 25 is a star cluster 2,000 light-years away — in Sagittarius, your birthday sign.", link: "The sky has its own 25, sparkling in your sign. Coincidence? I think not. ✨" },
      { icon: "🧠", name: "Brain", fact: "Around 25, the brain matures in a big way: calmer thinking, wiser choices, a deeper way of seeing things.", link: "And it keeps developing from here, with so much more learning ahead. We'll do that together 🤍" }
    ],
    factsIntro: ["Now… *25* facts about 25.", "One tap, one fact. Ready? 🃏"],
    facts: [
      "<bdi>25 = 5 × 5</bdi>. A perfect square, perfectly on time.",
      "<bdi>1 + 3 + 5 + 7 + 9 = 25</bdi>. The first five odd numbers, teaming up for you.",
      "<bdi>3² + 4² = 5²</bdi>, because <bdi>9 + 16 = 25</bdi>. The smallest square made of two squares.",
      "<bdi>7² + 24² = 25²</bdi> and <bdi>15² + 20² = 25²</bdi>. Pythagoras would RSVP.",
      "<bdi>12 + 13 = 25</bdi>, and so does <bdi>3 + 4 + 5 + 6 + 7</bdi>. Many roads lead to 25.",
      "<bdi>25² = 625</bdi>, <bdi>25³ = 15,625</bdi>. Its powers always end in 25. Only 76 does that too.",
      "25 is the smallest \"Friedman number\": build it from its own digits, <bdi>5² = 25</bdi>.",
      "In base 4, 25 is written 121 — a palindrome. In binary: 11001.",
      "25! (25 factorial) is a 26-digit number. Big birthday energy.",
      "25 years = a quarter century. Congrats on completing Quarter One. 🎉",
      "Element 25 is manganese. Over 90% of it makes steel stronger.",
      "Ancient Egyptian glassmakers used manganese to make glass clear — or soft purple.",
      "Cave artists painted Lascaux with manganese black. Element 25 has been in art since day one.",
      "In 2009, element 25 helped create YInMn Blue, the first new inorganic blue in 200+ years.",
      "Plants use four manganese atoms to split water and make the oxygen we breathe.",
      "Messier 25: a star cluster in Sagittarius, ~2,000 light-years away. Your sign, your number.",
      "We're living in Solar Cycle 25. The Sun hit its maximum in 2024 — peak sparkle.",
      "Pomodoro: focus for 25 minutes, then rest. Named after a tomato kitchen timer. 🍅",
      "TV in Egypt and Europe runs at 25 frames per second. Life, literally in 25s.",
      "A volleyball set is played to 25 points. Match point: today.",
      "25 years is the silver jubilee. Shiny, valuable, very you. Happy silver jubilee! ✨",
      "Since June 2023, Korea counts age the international way. Even in Seoul, you're exactly 25.",
      "IU's song \"Palette\" is about turning 25 and knowing what you like. 🎨",
      "At 25 the brain matures and gets seriously wise, and it keeps developing and learning long after.",
      "Fact #25: Dalia turned 25 today. Best fact on the list. 🎂"
    ],
    quizIntro: ["Pop quiz! 🧪", "Three questions. Zero pressure."],
    quiz: [
      { q: "25 is the sum of the first five odd numbers.", a: true, fb: "<bdi>1 + 3 + 5 + 7 + 9 = 25</bdi> ✔️" },
      { q: "Element 25 is gold.", a: false, fb: "It's manganese! Gold is 79." },
      { q: "At 25 the brain matures, and keeps developing and learning after that.", a: true, fb: "True! Wiser now, and so much more learning ahead 🧠" }
    ],
    yes: "True", no: "False", right: "Correct! ", wrong: "Nope! ",
    perfect: "3/3! Officially a *25* Expert 🤓",
    less: "Close enough! Curiosity counts double today. 🤓"
  },

  kdrama: {
    slate: ["SCENE 25", "TAKE 1", "DIRECTOR: AHMED"],
    ep: "EP.25",
    scenes: [
      { title: "Episode 25", sub: "The One Where Everything Starts Glowing", body: "Slow zoom on a city at night. The lights flicker on, one by one. A new season premieres tonight — and the lead is already smiling.", v: "🌃", note: "[soft piano]" },
      { title: "Plot Twists Ahead", sub: "(the good kind, I promise)", body: "Coming this season: unexpected adventures, a sketchbook that fills itself, spontaneous trips, and one rainy scene that turns out perfect.", v: "🌧️☂️", note: "[dramatic slow-motion hair flip]" },
      { title: "A Toast", sub: "to the main character of Season 25", body: "Everyone raises a cup of banana milk: \"To Dalia — may this season be funny, brave, colorful, and worth rewatching.\"", v: "🍌🥛✨", note: "[fade to stars…]" }
    ],
    end: "To be continued… ✨"
  },

  pop: {
    intro: ["25 balloons are hiding the next level. 🎈", "Pop them *all*!"],
    counter: "{n} / 25",
    win: "BALLOON CHAMPION! 🏆"
  },
  popWords: ["Pop!", "+1 joy", "Level up!", "Yay!", "Happy birthday!", "Nerd power +25", "Cake incoming", "Main character", "25/10", "Okay, legend", "Wheee!", "생일 축하해!", "كل سنة وانتي طيبة"],

  gift: {
    intro: ["You went through *everything*. 👏", "Which means…", "someone left you a gift. 🎁"],
    hint: "Tap the box!",
    shake: ["Something's in here…", "It's moving…", "OKAY HERE IT COMES"]
  },

  show: {
    name: "DALIA",
    beats: [
      { shape: "25", line: "Midnight. November 28." },
      { shape: "★", line: "A brand-new number just arrived." },
      { shape: "25", line: "At 25 you get wiser. What's next: more learning, *together*." },
      { shape: "🎨", line: "Old enough to know what you love." },
      { shape: "✈️", line: "Young enough to go *anywhere*." },
      { shape: "🎧", line: "More songs. More sketches. More stories." },
      { shape: "NAME", line: "So here's to *you*, Dalia." },
      { shape: "🎂", line: "HAPPY *25th*! 🎉", finale: true }
    ],
    next: "Blow out the candles 🎂"
  },

  cake: {
    instr: "25 candles. I counted. Tap the cake to blow them out 🕯️",
    mic: "Or blow into your mic 🎤",
    micHint: "Just to hear you blow. Nothing is recorded.",
    micOn: "Listening… blow! 🌬️",
    micNo: "No mic? No problem — tapping works too!",
    progress: ["{n} left!", "Keep going!", "Big breath!", "Last ones!"],
    done: "🎉 WISH MADE! 🎉"
  },

  letter: {
    steps: [
      "Okay. The loud part is over.",
      "Now the *real* part. 💌",
      "Happy 25th, *Dalia*. 🎉",
      "I built this whole thing because a normal \"happy birthday\" felt way too small for you.",
      "So here's my wish for this year:",
      "Let's make *sweet* memories.",
      "Long walks. Late-night talks. Drawing sessions. Random trips. Trying weird food.",
      "The kind of days we'll *laugh* about later. 😄",
      "And here's my promise:",
      "every memory after that will be even *sweeter*.",
      "Because the best episodes haven't aired yet. 🎬",
      "Thank you for being you — curious, kind, and full of color. 🎨",
      "I'm really happy I got to be one of the first to say it…"
    ],
    card: [
      "<b>Happy birthday, Dalia!</b> 🎂",
      "I hope this year treats you like your favorite playlist — no skips. More sketches, more trips, more random facts at the perfect moment, more evenings that end with a story worth telling.",
      "Here's to sweet memories this year — and even sweeter ones after. Stay curious about everything; it's one of the best things about you."
    ],
    sign: "— Ahmed",
    wish: "Make a wish ✨",
    wishDone: "A star just fell. Your wish is officially classified. 🤫"
  },

  finale: {
    title: "Happy 25th, Dalia! 🎉",
    party: "Party mode 🪩",
    partySub: "Enzel Ya Gameel — dance break",
    confetti: "More confetti 🎊",
    replay: "Replay the journey 🔁",
    credits: "Music credits 🎵",
    creditsTitle: "Music & credits",
    ytHint: "If it doesn't start, tap ▶ on the player",
    partyOff: "Stop the party ⏹"
  },

  eggs: {
    moon: "Even the moon RSVP'd. 🌙🎉",
    shake: "Shake detected. Confetti deployed. 🎊",
    cat: "A cat walked across the screen to say happy birthday. 🐈"
  }
},

/* ===================================================== ARABIC (Egyptian) — Ahmed speaking (masculine) to Dalia (feminine) */
ar: {
  dir: "rtl",
  gate: {
    title: "استني… لسه بدري! 👀",
    line: "الرحلة دي هتتفتح الساعة 12 بالليل يوم 28 نوفمبر. البلالين لسه بتتنفخ.",
    labels: ["ساعة", "دقيقة", "ثانية"],
    zero: "جه الوقت! 🎉"
  },
  loading: [
    ["🎈", "بننفخ 25 بلونة…"],
    ["🎊", "بنظبط الكونفيتي عشان ميطيرش بدري…"],
    ["🕯️", "بنولّع 25 شمعة…"],
    ["🎧", "بنصحّي الدي جي…"],
    ["🎁", "بنلف مفاجأة مهمة جدًا…"]
  ],
  start: {
    label: "✦ اللاعبة رقم 1: داليا ✦",
    title: "المستوى 25<br>اتفتح",
    intro: "رحلة عيد ميلاد معمولة مخصوص علشانك. دوسي في أي حتة عشان تكمّلي، وكل شاشة فيها حاجة مستنياكي.",
    cta: "يلا نبدأ 🎮",
    sound: "🔊 علّي الصوت، كل مرحلة ليها أغنية عيد ميلاد.",
    resume: "كمّلي من مكان ما وقفتي ◀"
  },
  common: { tap: "دوسي", enter: "دوسي عشان تدخلي", level: "المستوى", of: "من", close: "قفل ✕" },
  chapters: {
    art: "ركن الرسم", passport: "باسبور الـ25", lab: "معمل الـ25", kdrama: "الحلقة 25",
    pop: "فرقعي الـ25", gift: "الهدية", cake: "التورتة", letter: "من أحمد"
  },
  mapSay: [
    "أول محطة… جهّزي الألوان.",
    "المحطة الجاية: سفر من غير شنط.",
    "جاية حتة لحبايب المعلومات 🤓",
    "كاميرا… أكشن… والبطلة إنتي.",
    "خلي بالك، قدامك بلالين كتير.",
    "في حاجة مستنياكي هنا…",
    "الشمع والع والتورتة جاهزة.",
    "آخر محطة… وأهمهم."
  ],

  art: {
    intro: ["أهلًا بيكي في ركن *الرسم* 🎨", "كل سنة جديدة محتاجة ألوانها.", "ودول *أربع* ألوان اخترتهم لسنتك الـ25."],
    colors: [
      { name: "لافندر", hex: "#B9A7F5", msg: "لصباح هادي، وقهوة على رواقة، وأفكار بتطلع لوحدها من غير ما حد يستعجلها." },
      { name: "دهبي", hex: "#F7CF6B", msg: "للحاجات الصغيرة اللي بتفرّح: رسمة خلصت، أغنية حلوة، ويوم حلو من غير سبب." },
      { name: "نعناعي", hex: "#9FE3C9", msg: "للبدايات الجديدة، وشوارع أول مرة تمشي فيها، وخطوة جريئة لحاجة مجربتهاش قبل كده." },
      { name: "سماوي", hex: "#8EC5F5", msg: "للفضول اللي ملوش آخر زي البحر. كل ما تسألي أكتر، تكتشفي أكتر." }
    ],
    outro: ["الحلو في الـ*25*…", "إنها مش مرسومة من قبلها.", "مفيش خطوط ولا قواعد… ورقة بيضا و*كل* الألوان.", "ارسميها زي ما إنتي عايزة 🖌️"]
  },

  passport: {
    intro: ["*لا* فيزا، *ولا* شنط، *ولا* طوابير.", "بس باسبور مكتوب عليه اسمك ✈️"],
    cover: ["باسبور", "المستوى 25", "الاسم: داليا", "تاريخ الإصدار: 28.11.2026"],
    stamps: [
      { icon: "🎤", name: "سيول", stamp: "SEOUL ✦ 28.11", msg: "سنة فيها حماس سيول: أنوار بالليل، أغنية بتعيديها مية مرة، ورقصة صغيرة في المطبخ.", extra: "<bdi>생일 축하해!</bdi> (يعني عيد ميلاد سعيد بالكوري)" },
      { icon: "📚", name: "مكتبة صغيرة", stamp: "BOOKSHOP ✦ OPEN", msg: "عصرية فيها مطر، وكرسي في ركن هادي، وكتاب يشدّك لدرجة إن الشاي يبرد وإنتي مش واخدة بالك." },
      { icon: "🏔️", name: "مكان واسع", stamp: "HORIZON ✦ ∞", msg: "منظر واسع وسما مفتوحة، من اللي يخلّوا الهموم تبان صغيرة والأحلام تبان كبيرة." },
      { icon: "🐈", name: "لفّة رسّامة", stamp: "DETOUR ✦ SKETCH", msg: "شوارع جانبية تستاهل ترسميها: باب قديم، قطة نايمة في الشمس، وركن محدش خد باله منه غيرك." }
    ],
    outro: ["الباسبور *اتملى*! 🛂", "أحلى السنين بتسيب مكان لأماكن جديدة… ولمفاجآت حلوة."]
  },

  lab: {
    intro: ["🚨 تحذير: *معلومات* جاية 🚨", "رقمك الجديد طلع أذكى مما تتخيلي.", "تعالي نبص على الـ*25* من قريب 🔬"],
    cards: [
      { icon: "🔢", name: "سحر الأرقام", fact: "الـ25 هي <bdi>5 × 5</bdi>، وهي كمان <bdi>1 + 3 + 5 + 7 + 9</bdi>، وأصغر مربع بيطلع من جمع مربعين: <bdi>9 + 16</bdi>.", link: "رقم بيربط حاجات كتير ببعض؟ فكّرني بحد أعرفه." },
      { icon: "🧪", name: "علوم وفن", fact: "العنصر رقم 25 هو المنجنيز. وفي 2009، بالصدفة، طلع منه لون أزرق جديد… أول أزرق جديد من أكتر من 200 سنة.", link: "أحلى الألوان بتيجي بالصدفة… وده أي رسامة عارفاه." },
      { icon: "🪐", name: "الفضاء", fact: "في السما عنقود نجوم اسمه ميسييه 25، على بُعد حوالي 2000 سنة ضوئية… في برج القوس، برجك إنتي.", link: "يعني حتى السما فيها 25 بتلمع في برجك. صدفة؟ مظنش ✨" },
      { icon: "🧠", name: "المخ", fact: "في الـ25 المخ بينضج جدًا: التفكير بيبقى أهدى، والقرارات أعقل، والنظرة للحاجات أعمق.", link: "وبيكمل من هنا… تطور وتعليم أكتر بكتير، وده هنعمله سوا 🤍" }
    ],
    factsIntro: ["ودلوقتي… *25* معلومة عن الـ25.", "كل دوسة، معلومة. جاهزة؟ 🃏"],
    facts: [
      "<bdi>25 = 5 × 5</bdi>. مربع كامل، وجه في ميعاده بالظبط.",
      "<bdi>1 + 3 + 5 + 7 + 9 = 25</bdi>. أول خمس أرقام فردية اتجمعوا عشانك.",
      "<bdi>3² + 4² = 5²</bdi>، لأن <bdi>9 + 16 = 25</bdi>. أصغر مربع بيتكوّن من مربعين.",
      "<bdi>7² + 24² = 25²</bdi>، وكمان <bdi>15² + 20² = 25²</bdi>. فيثاغورس كان هيحب الرقم ده.",
      "<bdi>12 + 13 = 25</bdi>، و<bdi>3 + 4 + 5 + 6 + 7</bdi> برضه بيطلعوا 25. طرق كتير بتوصّل لنفس الرقم.",
      "<bdi>25² = 625</bdi> و<bdi>25³ = 15,625</bdi>. أي قوة للـ25 بتخلص بـ25، ومفيش رقم من خانتين بيعمل كده غيره هو والـ76.",
      "الـ25 أصغر \"رقم فريدمان\": يعني تقدري تكتبيه بأرقامه هو نفسها، <bdi>5² = 25</bdi>.",
      "في نظام الأساس 4 الـ25 بتتكتب 121، وبتتقري من الناحيتين زي بعض. وبالثنائي: 11001.",
      "مضروب 25 رقم طوله 26 خانة. عيد ميلاد كبير فعلًا.",
      "25 سنة يعني ربع قرن. مبروك خلّصتي أول ربع 🎉",
      "العنصر رقم 25 هو المنجنيز، وأكتر من 90% منه بيتستخدم عشان يقوّي الحديد.",
      "المصريين القدماء كانوا بيحطوا منجنيز في الزجاج عشان يبقى شفاف… أو بنفسجي فاتح.",
      "رسامين الكهوف زمان رسموا بلون أسود معمول من المنجنيز. يعني العنصر 25 في الفن من أول الحكاية.",
      "في 2009 المنجنيز ساعد في اكتشاف أزرق جديد، أول لون أزرق من نوعه من أكتر من 200 سنة.",
      "النباتات بتستخدم 4 ذرات منجنيز عشان تفصل الميه وتطلّع الأكسجين اللي بنتنفسه.",
      "ميسييه 25 عنقود نجوم في برج القوس، على بُعد حوالي 2000 سنة ضوئية. برجك ورقمك في مكان واحد.",
      "إحنا دلوقتي في الدورة الشمسية رقم 25، والشمس وصلت لأقوى نشاط ليها في 2024.",
      "طريقة البومودورو: تركّزي 25 دقيقة وبعدين تريّحي. واسمها جاي من تايمر مطبخ على شكل طماطماية 🍅",
      "التلفزيون في مصر وأوروبا بيعرض 25 صورة في الثانية. الحياة حرفيًا ماشية بالـ25.",
      "شوط الكرة الطايرة بيخلص عند 25 نقطة. والنقطة الحاسمة: النهارده.",
      "الـ25 سنة اسمها اليوبيل الفضي. لامع وغالي… شبهك. مبروك يوبيلك الفضي ✨",
      "من يونيو 2023 كوريا بقت تحسب السن زي باقي العالم. يعني حتى في سيول إنتي 25 بالظبط.",
      "المغنية الكورية آيو عندها أغنية اسمها \"باليتة\" عن إنها بقت 25 وعرفت هي بتحب إيه 🎨",
      "في الـ25 المخ بينضج ويعقل جدًا… وبيكمل تطور وتعليم بعدها كمان.",
      "المعلومة رقم 25: داليا تمّت 25 النهارده. وأحلى معلومة في الليستة 🎂"
    ],
    quizIntro: ["كويز صغير! 🧪", "تلات أسئلة بس… ومن غير توتر."],
    quiz: [
      { q: "الـ25 هي مجموع أول خمس أرقام فردية.", a: true, fb: "<bdi>1 + 3 + 5 + 7 + 9 = 25</bdi> ✔️" },
      { q: "العنصر رقم 25 هو الدهب.", a: false, fb: "ده المنجنيز! الدهب رقمه 79." },
      { q: "في الـ25 المخ بينضج، وبيفضل يتطور ويتعلم بعدها كمان.", a: true, fb: "صح! عقل أكتر دلوقتي، وتعليم أكتر بكتير جاي 🧠" }
    ],
    yes: "صح", no: "غلط", right: "برافو! ", wrong: "لأ! ",
    perfect: "3 من 3! بقيتي خبيرة الـ*25* رسمي 🤓",
    less: "قربتي! والفضول النهارده بدرجتين 🤓"
  },

  kdrama: {
    slate: ["مشهد 25", "تصوير 1", "إخراج: أحمد"],
    ep: "الحلقة 25",
    scenes: [
      { title: "الحلقة 25", sub: "الحلقة اللي كل حاجة فيها بتنوّر", body: "الكاميرا بتقرّب بالراحة على مدينة بالليل، والأنوار بتولع واحدة ورا التانية. موسم جديد بيبدأ النهارده… والبطلة بتضحك من أول مشهد.", v: "🌃", note: "[موسيقى بيانو هادية]" },
      { title: "مفاجآت جاية", sub: "(حلوة، أوعدك)", body: "الموسم ده فيه: مغامرات محدش متوقعها، كراسة رسم بتتملي، سفريات على الماشي، ومشهد مطر واحد على الأقل هيطلع تحفة.", v: "🌧️☂️", note: "[لقطة بطيئة والشعر بيطير]" },
      { title: "تحية للبطلة", sub: "بطلة الموسم 25", body: "الكل رافع علبة لبن بالموز وبيقول: \"عشان داليا… يا رب الموسم ده يبقى كله ضحك، وجرأة، وألوان، وحلقات تستاهل تتشاف تاني.\"", v: "🍌🥛✨", note: "[الصورة بتختفي في النجوم…]" }
    ],
    end: "يتبع… ✨"
  },

  pop: {
    intro: ["25 بلونة مخبيين المستوى الجاي 🎈", "فرقعيهم *كلهم*!"],
    counter: "{n} / 25",
    win: "بطلة البلالين! 🏆"
  },
  popWords: ["بوب!", "فرحة زيادة", "ليفل أب!", "هيييه!", "كل سنة وانتي طيبة!", "عبقرية!", "التورتة جاية", "يا سلام!", "25 من 10", "جامدة!", "وييي!", "생일 축하해!"],

  gift: {
    intro: ["عدّيتي على *كل* حاجة 👏", "يعني…", "في هدية مستنياكي 🎁"],
    hint: "دوسي على العلبة!",
    shake: ["في حاجة جوه…", "دي بتتحرك!", "خلاص… أهي جاية!"]
  },

  show: {
    name: "داليا",
    beats: [
      { shape: "25", line: "نص الليل. 28 نوفمبر." },
      { shape: "★", line: "ورقم جديد لسه واصل حالًا." },
      { shape: "25", line: "في الـ25 بتنضجي وتعقلي… واللي جاي تطور وتعليم *سوا*." },
      { shape: "🎨", line: "كبرتي كفاية تعرفي إنتي بتحبي إيه." },
      { shape: "✈️", line: "ولسه صغيرة كفاية تروحي *أي* مكان." },
      { shape: "🎧", line: "أغاني أكتر، ورسم أكتر، وحكايات أكتر." },
      { shape: "NAME", line: "السنة دي بتاعتك *إنتي* يا داليا." },
      { shape: "🎂", line: "كل سنة وانتي *طيبة*! 🎉", finale: true }
    ],
    next: "يلا نطفي الشمع 🎂"
  },

  cake: {
    instr: "25 شمعة، عدّيتهم واحدة واحدة. دوسي على التورتة عشان تطفيهم 🕯️",
    mic: "أو انفخي في المايك 🎤",
    micHint: "بس عشان أسمع النفخة، مفيش أي تسجيل.",
    micOn: "سامعك… انفخي! 🌬️",
    micNo: "المايك مش شغال؟ عادي، الدوس بيطفي برضه!",
    progress: ["فاضل {n}!", "كمّلي!", "خدي نفس عميق!", "آخر كام شمعة!"],
    done: "🎉 الأمنية اتعملت! 🎉"
  },

  letter: {
    steps: [
      "خلاص… الدوشة خلصت.",
      "دلوقتي الجزء *المهم* 💌",
      "كل سنة وانتي طيبة يا *داليا* 🎉",
      "عملت كل ده لأن \"كل سنة وانتي طيبة\" لوحدها كانت قليلة عليكي.",
      "وأمنيتي للسنة دي بسيطة:",
      "إننا نعمل ذكريات *حلوة*.",
      "مشاوير طويلة، وكلام لحد الفجر، وقعدات رسم، وسفريات فجأة، وأكل غريب نجربه.",
      "أيام نفضل *نضحك* عليها بعد كده 😄",
      "وأوعدك بحاجة:",
      "كل ذكرى بعدها هتكون *أحلى*.",
      "لأن أحلى الحلقات لسه جاية 🎬",
      "شكرًا إنك زي ما إنتي: فضولية، وطيبة، ومليانة ألوان 🎨",
      "وأنا مبسوط إني من أول الناس اللي بيقولولك…"
    ],
    card: [
      "<b>كل سنة وانتي طيبة يا داليا!</b> 🎂",
      "أتمنى السنة دي تبقى زي أحلى أغنية عندك… تسمعيها للآخر ومتزهقيش منها. رسم أكتر، وسفر أكتر، ومعلومات غريبة في وقتها بالظبط، وسهرات بتخلص بحكاية تستاهل تتحكي.",
      "السنة دي هنعمل ذكريات حلوة… واللي بعدها أحلى. وخليكي دايمًا فضولية كده، دي من أحلى حاجة فيكي."
    ],
    sign: "— أحمد",
    wish: "اتمني أمنية ✨",
    wishDone: "نجمة وقعت دلوقتي… وأمنيتك بقت سر 🤫"
  },

  finale: {
    title: "كل سنة وانتي طيبة يا داليا! 🎉",
    party: "وقت الرقص 🪩",
    partySub: "انزل يا جميل في الساحة",
    confetti: "كونفيتي كمان 🎊",
    replay: "نعيد الرحلة من الأول 🔁",
    credits: "أسماء الأغاني 🎵",
    creditsTitle: "المزيكا وأصحابها",
    ytHint: "لو الأغنية مشتغلتش، دوسي ▶ على المشغل",
    partyOff: "كفاية رقص ⏹"
  },

  eggs: {
    moon: "حتى القمر جه الحفلة 🌙🎉",
    shake: "هزّيتي الموبايل… فاتطلق كونفيتي 🎊",
    cat: "قطة عدّت مخصوص تقولك كل سنة وانتي طيبة 🐈"
  }
}
};
