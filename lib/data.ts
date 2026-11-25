export const WHATSAPP_NUMBER = "923244696424";
export const PHONE_DISPLAY = "+92 324 4696424";
export const EMAIL = "fitnessstudio02@gmail.com";
export const FB_URL =
  "https://www.facebook.com/profile.php?id=100009633182992";
export const IG_URL = "https://www.instagram.com/fittness_studio25";
export const ADDRESS_1 =
  "16 Main Boulevard, Commercial Complex, Bahria Orchard Phase 1, Lahore";
export const ADDRESS_2 =
  "112 A Block Commercial Market, Khayaban-e-Amin, Lahore";

export function waLink(message: string) {
  return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
}

/* ---------------------------------- pricing --------------------------------- */

export const COURSE_DURATION = "4 weeks";

export type PkrTier = {
  key: string;
  label: string;
  price: number;
  note: string;
};

export const PKR_TIERS: PkrTier[] = [
  { key: "one-to-one", label: "One-to-One", price: 15000, note: "Personal session with the trainer" },
  { key: "group", label: "Group of 5", price: 5000, note: "Per head, when a group of 5 is formed" },
  { key: "home", label: "Home-Based Trainer", price: 30000, note: "Trainer visits your home" },
];

export function formatPkr(n: number) {
  return `Rs ${n.toLocaleString("en-PK")}`;
}

/* --------------------------------- programs --------------------------------- */

export type Program = {
  slug: string;
  title: string;
  short: string;
  whoFor: string;
  learn: string[];
  image: string;
  imageNote?: string;
  photos?: { src: string; caption: string }[];
  videos?: { src: string; caption: string }[];
};

export const PROGRAMS: Program[] = [
  {
    slug: "self-defense",
    title: "Self-Defense",
    short: "Basic self-defense for girls — learn to recognise danger and escape unwanted situations.",
    whoFor: "Girls and women, basic level — no prior training needed.",
    learn: [
      "How to recognise and avoid unsafe situations",
      "Basic escape techniques if someone grabs you",
      "Using your voice and body language to deter an attacker",
      "Staying safe while travelling alone",
      "What to do if you are followed or cornered",
      "Building everyday confidence and awareness",
    ],
    image: "/training/prog-self-defense.webp",
    imageNote: "Training photo from fitnessstudiopk.com",
    photos: [
      { src: "/media/IMG-20261114-WA0056-enhanced.webp", caption: "Self-defense demonstration" },
      { src: "/media/IMG-20261114-WA0070.jpg", caption: "Women's self-defense class" },
      { src: "/media/IMG-20261114-WA0035.jpg", caption: "Self-defense training collage" },
    ],
    videos: [
      { src: "/videos/VID-20261114-WA0023.mp4", caption: "Group practice session" },
      { src: "/videos/VID-20261114-WA0024.mp4", caption: "Pad work — practicing strikes" },
      { src: "/videos/VID-20261114-WA0026.mp4", caption: "Indoor self-defense training" },
    ],
  },
  {
    slug: "prenatal-yoga",
    title: "Prenatal Yoga",
    short: "Pregnancy yoga designed to support expecting mothers and maximise the chances of a natural delivery.",
    whoFor: "Expecting mothers at any stage of pregnancy.",
    learn: [
      "Safe, gentle stretches for each trimester",
      "Breathing techniques for labour",
      "Posture and back care during pregnancy",
      "Relaxation and better sleep",
      "Preparing body and mind for a natural delivery",
    ],
    image: "/training/prog-prenatal-yoga.webp",
    imageNote: "Illustrative image (AI-generated)",
  },
  {
    slug: "senior-citizen-yoga",
    title: "Senior Citizen Yoga",
    short: "Gentle yoga for older adults — movement, balance and calm, at a comfortable pace.",
    whoFor: "Senior citizens looking for safe, gentle exercise.",
    learn: [
      "Gentle, joint-friendly movement",
      "Balance and stability",
      "Breathing and relaxation",
      "Flexibility and mobility",
      "A calm daily routine you can follow at home",
    ],
    image: "/training/prog-senior-yoga.webp",
    imageNote: "Training photo from fitnessstudiopk.com",
  },
  {
    slug: "weight-loss-management",
    title: "Weight Loss Management",
    short: "A practical 4-week plan for sustainable weight loss — food, movement and habits that last.",
    whoFor: "Women who want to lose weight in a healthy, sustainable way.",
    learn: [
      "Healthy eating habits that fit your life",
      "Simple home workouts, no gym needed",
      "Building a routine that sticks",
      "Tracking your progress week by week",
      "Staying motivated after the 4 weeks end",
    ],
    image: "/training/prog-weight-loss.webp",
    imageNote: "Illustrative image (AI-generated)",
  },
  {
    slug: "pre-marriage-quick-weight-loss",
    title: "Pre-Marriage Quick Weight Loss",
    short: "A focused 4-week plan for brides-to-be — feel your best on your big day.",
    whoFor: "Brides-to-be preparing for their wedding.",
    learn: [
      "A focused 4-week weight-loss plan",
      "Toning and energy for the wedding season",
      "Healthy eating without crash diets",
      "Confidence for your big day",
    ],
    image: "/training/prog-pre-marriage.webp",
    imageNote: "Illustrative image (AI-generated)",
  },
  {
    slug: "pcos-pcod",
    title: "PCOS / PCOD",
    short: "Yoga and lifestyle support for women living with PCOS / PCOD.",
    whoFor: "Women diagnosed with PCOS or PCOD.",
    learn: [
      "Yoga and movement that support hormonal balance",
      "Breathing and stress management",
      "Lifestyle habits that support PCOS care",
      "Building a sustainable routine",
    ],
    image: "/training/prog-pcos.webp",
    imageNote: "Illustrative image (AI-generated)",
  },
];

export function getProgram(slug: string) {
  return PROGRAMS.find((p) => p.slug === slug);
}

/* ---------------------------------- products -------------------------------- */

export type Product = {
  slug: string;
  name: string;
  price: number;
  wasPrice: number;
  image: string;
  blurb: string;
};

export const PRODUCTS: Product[] = [
  {
    slug: "nutri-shield",
    name: "Nutri Shield by Ayeesha",
    price: 1800,
    wasPrice: 2000,
    image: "/products/nutri-shield.jpg",
    blurb: "Herbal supplement by Ayeesha Muzammil.",
  },
  {
    slug: "wellness-calm-powder",
    name: "Wellness Calm Powder by Ayeesha",
    price: 1800,
    wasPrice: 2000,
    image: "/products/wellness-calm-powder.jpg",
    blurb: "Herbal wellness powder by Ayeesha Muzammil.",
  },
  {
    slug: "natural-weight-loss-herbal-tea",
    name: "Natural Weight Loss Herbal Tea",
    price: 1200,
    wasPrice: 2000,
    image: "/products/weight-loss-herbal-tea.png",
    blurb: "Herbal tea blend from Fitness Studio.",
  },
  {
    slug: "natural-weight-loss-herbal-powder",
    name: "Natural Weight Loss Herbal Powder",
    price: 1200,
    wasPrice: 2000,
    image: "/products/weight-loss-herbal-powder.png",
    blurb: "Herbal powder from Fitness Studio.",
  },
];

export function getProduct(slug: string) {
  return PRODUCTS.find((p) => p.slug === slug);
}

/* ------------------------------- testimonials ------------------------------- */
/* Quotes copied verbatim from fitnessstudiopk.com (homepage testimonials).     */
/* Each quote is the one shown directly above the person's name on the page.    */

export const TESTIMONIALS = [
  {
    quote:
      "This program has completely transformed my confidence. From self-defense techniques to grooming sessions, I feel more prepared and empowered in every aspect of my life!",
    name: "Sarah Malik",
    role: "Marketing Professional",
  },
  {
    quote:
      "The personal safety training was a game-changer for me. The practical tips and techniques I learned have made me feel safer and more in control of my surroundings.",
    name: "Zara Ali",
    role: "Entrepreneur",
  },
  {
    quote:
      "I loved the grooming sessions! They taught me how to present myself confidently, and I’ve already seen a positive impact in my professional interactions.",
    name: "Mehwish Ahmed",
    role: "Teacher",
  },
  {
    quote:
      "I never thought I could feel this strong. The blend of physical training and motivational support has been life-changing for me. Truly empowering!",
    name: "Shazia Raza",
    role: "Homemaker",
  },
  {
    quote:
      "Joining this program was the best decision I made for myself. The training sessions gave me the confidence to handle challenging situations, and the grooming tips were a bonus!",
    name: "Fatima Noor",
    role: "Lawyer",
  },
];

/* ----------------------------------- stats ---------------------------------- */
/* From the old site's Achievements page — used exactly as stated there.        */

export const STATS = [
  { value: "5,000+", label: "Women trained" },
  { value: "300+", label: "Workshops conducted" },
  { value: "12+", label: "MoU partners" },
  { value: "8", label: "Media features" },
];

/* ------------------------------ media / gallery ----------------------------- */

export const AWARD_PHOTOS: { src: string; caption: string }[] = [
  { src: "/media/IMG-20261105-WA0049.jpg", caption: "Award ceremony — Enablers" },
  { src: "/media/IMG-20261105-WA0052.jpg", caption: "Award ceremony — Enablers" },
  { src: "/media/IMG-20261114-WA0031.jpg", caption: "Youth Parliament award" },
  { src: "/media/IMG-20261114-WA0039.jpg", caption: "Award — Believe You Can" },
  { src: "/media/IMG-20261114-WA0043.jpg", caption: "Voice of Youth Conference award" },
  { src: "/media/IMG-20261114-WA0052.jpg", caption: "Rotary award" },
  { src: "/media/IMG-20261114-WA0060.jpg", caption: "Pakistan Business Club award" },
  { src: "/media/IMG-20261114-WA0065.jpg", caption: "Lahore Chamber of Commerce & Industry" },
  { src: "/media/IMG-20261114-WA0071.jpg", caption: "Award presentation" },
  { src: "/media/IMG-20261114-WA0086.jpg", caption: "Taekwondo federation certificates" },
  { src: "/media/IMG-20261114-WA0087.jpg", caption: "Taekwondo federation certificates" },
];

export const MOU_PHOTOS: { src: string; caption: string }[] = [
  { src: "/media/IMG-20261105-WA0043.jpg", caption: "MoU signing ceremony" },
  { src: "/media/IMG-20261105-WA0046.jpg", caption: "MoU signing ceremony" },
  { src: "/media/IMG-20261114-WA0088.jpg", caption: "MoU signing — Taekwondo federation" },
];

export const MOU_PARTNERS = [
  "ESA Labs",
  "Superior University",
  "Indus Hospital",
  "Bizman Education & Immigration Consultant",
  "Voice Society",
  "Hidmat ul Nisa Welfare Foundation",
  "KIPS Online School System",
  "Fountain House",
  "Pakistan Citizen Alliance",
  "Door of Awareness",
  "Hum Mishal-e-Rah",
  "Asst. Commissioner Raffia Haider",
];

export const MOU_IN_PROCESS = ["Enablers", "Minhaj University"];

export const PRESS_PHOTOS: { src: string; caption: string }[] = [
  { src: "/media/IMG-20261105-WA0044.jpg", caption: "Muslim World — newspaper clipping" },
  { src: "/media/IMG-20261105-WA0048.jpg", caption: "Awami Mission — Taekwondo belt promotion test" },
  { src: "/media/IMG-20261105-WA0051.jpg", caption: "Urdu newspaper clipping" },
  { src: "/media/IMG-20261105-WA0054.jpg", caption: "Urdu newspaper clipping" },
  { src: "/media/IMG-20261114-WA0048.jpg", caption: "Daily Jinnah, Lahore" },
  { src: "/media/IMG-20261114-WA0051.jpg", caption: "LCCI — seminar on domestic violence" },
  { src: "/media/IMG-20261114-WA0062.jpg", caption: "Urdu newspaper clipping — conference coverage" },
  { src: "/media/IMG-20261114-WA0063.jpg", caption: "Daily Azad — newspaper clipping" },
  { src: "/media/IMG-20261114-WA0075.jpg", caption: "Daily Overseas News, Lahore" },
];

export const EVENT_PHOTOS: { src: string; caption: string }[] = [
  { src: "/media/IMG-20261105-WA0039.jpg", caption: "Group photo — award ceremony" },
  { src: "/media/IMG-20261105-WA0042.jpg", caption: "Speaking at Qasim Ali Shah Foundation" },
  { src: "/media/IMG-20261105-WA0045.jpg", caption: "Independence Day panel" },
  { src: "/media/IMG-20261105-WA0047.jpg", caption: "FPCCI Lahore meeting" },
  { src: "/media/IMG-20261105-WA0050.jpg", caption: "Taekwondo event" },
  { src: "/media/IMG-20261114-WA0030.jpg", caption: "Outdoor event" },
  { src: "/media/IMG-20261114-WA0034.jpg", caption: "School event — ribbon cutting" },
  { src: "/media/IMG-20261114-WA0042.jpg", caption: "Voice of Youth — group photo" },
  { src: "/media/IMG-20261114-WA0047.jpg", caption: "Speaking on stage — NIC Faisalabad" },
  { src: "/media/IMG-20261114-WA0059.jpg", caption: "Business Expo 2023" },
  { src: "/media/IMG-20261114-WA0066.jpg", caption: "TV show appearance" },
  { src: "/media/IMG-20261114-WA0067.jpg", caption: "Workin Cave inauguration" },
  { src: "/media/IMG-20261114-WA0068.jpg", caption: "Bouquet presentation — 75th celebrations" },
  { src: "/media/IMG-20261114-WA0072.jpg", caption: "Outdoor gathering" },
  { src: "/media/IMG-20261114-WA0074.jpg", caption: "Voice of Youth Conference 2025" },
];

export const POSTERS: { src: string; caption: string; upcoming?: boolean }[] = [
  {
    src: "/media/IMG-20261105-WA0053.jpg",
    caption: "Protect, Empower and Thrive — Qasim Ali Shah Foundation, Sat 28 Nov 2026, Allama Iqbal Town, Lahore",
    upcoming: true,
  },
  { src: "/media/IMG-20261114-WA0037.jpg", caption: "Empowering Women — SheTechSpace, 8 March 2023" },
  { src: "/media/IMG-20261114-WA0038.jpg", caption: "Yoga Session at DM — Digital Mandee, 19 June 2023" },
  { src: "/media/IMG-20261114-WA0040.jpg", caption: "Grooming of House Wives — Facebook Live, 13 Jan" },
  { src: "/media/IMG-20261114-WA0041.jpg", caption: "Legislation for Older People — advocacy seminar" },
  { src: "/media/IMG-20261114-WA0046.jpg", caption: "TV show guest appearance — with Iqra Haris" },
  { src: "/media/IMG-20261114-WA0049.jpg", caption: "Hormonal Weight Gain in Women — Facebook Live" },
  { src: "/media/IMG-20261114-WA0053.jpg", caption: "Self Defense Session — LMA 72-L, Women's Day" },
  { src: "/media/IMG-20261114-WA0055.jpg", caption: "Pakistan National Youth Conference 2023 — Special Guest" },
  { src: "/media/IMG-20261114-WA0058.jpg", caption: "Catalyst of Change — Facebook Live, 6 Jan 2023" },
  { src: "/media/IMG-20261114-WA0073.jpg", caption: "How to act when physically mishandled — live discussion" },
];

export const BOOK_PHOTOS: { src: string; caption: string }[] = [
  { src: "/media/IMG-20261105-WA0041.jpg", caption: "Ayeesha with her self-defense book" },
  { src: "/media/IMG-20261114-WA0033.jpg", caption: "Ayeesha with her self-defense book" },
];

export const RECOGNITION_GRAPHICS: { src: string; caption: string }[] = [
  { src: "/media/IMG-20261114-WA0061.jpg", caption: "Certified Para-Taekwondo Black Belt — Kukkiwon" },
  { src: "/media/IMG-20261114-WA0045.jpg", caption: "Ambassador of Hope — 101 CEOs, Indus Hospital" },
  { src: "/media/IMG-20261114-WA0032.jpg", caption: "Women Pride Award 2023" },
  { src: "/media/IMG-20261114-WA0050.jpg", caption: "She Inspires Awards — Nominated 2023" },
  { src: "/media/IMG-20261114-WA0054.jpg", caption: "Nominee — 1st Emerging Women Leaders Award 2023" },
];

/* ------------------------------ video interviews ---------------------------- */
/* 13 YouTube interview links from the WhatsApp group export.                   */

export const YOUTUBE_IDS = [
  "-o0IOcYNN8Y",
  "1pOmN_u_ewg",
  "QHdoPQ-V-7s",
  "QczoIxegh70",
  "WdvWSNFDpi0",
  "YRYQENDjORQ",
  "aquJwLZIeqM",
  "cBVMF_phi_w",
  "gdGUHr5MUDQ",
  "n_VI0iyRe58",
  "nmH4Vznfzw0",
  "sPBDTR7wFYM",
  "xm2NLrQlB5M",
];

export const YOUTUBE_PLAYLIST_URL =
  "https://youtube.com/playlist?list=PLyUHFpR7LqCP8jNqgGfpP8YjFh0NfakiF";

export const TIKTOK_LINKS = [
  "https://vt.tiktok.com/ZSpYxKvxR/",
  "https://vt.tiktok.com/ZSpYxomyK/",
];

export const TV_INTERVIEW_VIDEO = {
  src: "/videos/VID-20261105-WA0056.mp4",
  caption: "TV interview — women's safety (4 min 48 sec)",
};

export const TRAINING_VIDEOS: { src: string; caption: string }[] = [
  { src: "/videos/VID-20261114-WA0023.mp4", caption: "Self-defense group practice" },
  { src: "/videos/VID-20261114-WA0024.mp4", caption: "Pad work — practicing strikes" },
  { src: "/videos/VID-20261114-WA0026.mp4", caption: "Indoor self-defense training" },
  { src: "/videos/VID-20261114-WA0020.mp4", caption: "Yoga class" },
];
