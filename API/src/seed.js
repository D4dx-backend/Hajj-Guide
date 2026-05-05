/**
 * Seed script — populates MongoDB with demo Hajj & Umrah ritual steps and duas.
 * Run: node src/seed.js
 */

require('dotenv').config();
const mongoose = require('mongoose');
const RitualStep = require('./models/RitualStep');
const Dua = require('./models/Dua');

const ritualSteps = [
  // ── UMRAH ─────────────────────────────────────────────────────────────────
  {
    ritualType: 'umrah',
    stepNumber: 1,
    title: { arabic: 'الإحرام', malayalam: 'ഇഹ്‌റാം' },
    description: {
      arabic: 'ارتداء ملابس الإحرام والنية',
      malayalam: 'ഇഹ്‌റാമിന്റെ വസ്ത്രം ധരിച്ച് ഉംറക്ക് നിയ്യത്ത് ചെയ്യുക',
    },
    instructions: [
      { arabic: 'الاغتسال والتنظف', malayalam: 'കുളിച്ച് ശുദ്ധിയാകുക' },
      { arabic: 'ارتداء ثوبين أبيضين للرجال', malayalam: 'പുരുഷന്മാർ വെള്ള ഇഹ്‌റാം ധരിക്കുക' },
      { arabic: 'النية للعمرة', malayalam: 'ഉംറക്ക് നിയ്യത്ത് ചെയ്യുക' },
    ],
    isHighlighted: true,
    isActive: true,
  },
  {
    ritualType: 'umrah',
    stepNumber: 2,
    title: { arabic: 'الطواف', malayalam: 'ത്വവാഫ്' },
    description: {
      arabic: 'الطواف حول الكعبة المشرفة سبعة أشواط',
      malayalam: 'കഅ്ബയെ ഏഴ് പ്രദക്ഷിണം ചെയ്യുക',
    },
    instructions: [
      { arabic: 'البدء من الحجر الأسود', malayalam: 'ഹജ്ജറുൽ അസ്‌വദിൽ നിന്ന് ആരംഭിക്കുക' },
      { arabic: 'الطواف عكس اتجاه عقارب الساعة', malayalam: 'ഘടികാരദിശക്ക് എതിർദിശയിൽ ചുറ്റുക' },
      { arabic: 'الدعاء في كل شوط', malayalam: 'ഓരോ ചുറ്റിലും ദുആ ചൊല്ലുക' },
    ],
    isHighlighted: true,
    isActive: true,
  },
  {
    ritualType: 'umrah',
    stepNumber: 3,
    title: { arabic: 'صلاة ركعتين', malayalam: 'രണ്ട് റക്അത്ത് നമസ്കരിക്കുക' },
    description: {
      arabic: 'الصلاة خلف مقام إبراهيم',
      malayalam: 'മഖാമു ഇബ്‌റാഹീമിന്റെ പിറകിൽ രണ്ട് റക്അത്ത് നമസ്കരിക്കുക',
    },
    instructions: [
      { arabic: 'التوجه إلى مقام إبراهيم', malayalam: 'മഖാമു ഇബ്‌റാഹീമിലേക്ക് പോകുക' },
      { arabic: 'أداء ركعتين', malayalam: 'രണ്ട് റക്അത്ത് നമസ്കരിക്കുക' },
    ],
    isHighlighted: false,
    isActive: true,
  },
  {
    ritualType: 'umrah',
    stepNumber: 4,
    title: { arabic: 'السعي', malayalam: 'സഅ്‌യ്' },
    description: {
      arabic: 'السعي بين الصفا والمروة سبعة أشواط',
      malayalam: 'സ്വഫായ്‌ക്കും മർവായ്‌ക്കും ഇടയിൽ ഏഴ് തവണ ഓടുക',
    },
    instructions: [
      { arabic: 'البدء من جبل الصفا', malayalam: 'സ്വഫാ മലയിൽ നിന്ന് ആരംഭിക്കുക' },
      { arabic: 'الانتهاء عند المروة', malayalam: 'മർവയിൽ അവസാനിക്കുക' },
      { arabic: 'الإسراع في المسافة المحددة للرجال', malayalam: 'പുരുഷന്മാർ നിശ്ചിത ഭാഗത്ത് ഓടുക' },
    ],
    isHighlighted: true,
    isActive: true,
  },
  {
    ritualType: 'umrah',
    stepNumber: 5,
    title: { arabic: 'الحلق أو التقصير', malayalam: 'ഹൽഖ് അല്ലെങ്കിൽ തഖ്‌സീർ' },
    description: {
      arabic: 'حلق الرأس أو تقصير الشعر',
      malayalam: 'തല മൊട്ടയടിക്കുക അല്ലെങ്കിൽ മുടി ചെറുതാക്കുക',
    },
    instructions: [
      { arabic: 'الرجال يحلقون رؤوسهم أو يقصرون', malayalam: 'പുരുഷന്മാർ തലമൊട്ടയടിക്കുക അല്ലെങ്കിൽ മുടി കുറക്കുക' },
      { arabic: 'النساء يقصرن قدر أنملة', malayalam: 'സ്ത്രീകൾ ഒരു വിരൽ അളവ് മുടി മുറിക്കുക' },
    ],
    isHighlighted: false,
    isActive: true,
  },

  // ── HAJJ ──────────────────────────────────────────────────────────────────
  {
    ritualType: 'hajj',
    stepNumber: 1,
    title: { arabic: 'الإحرام', malayalam: 'ഇഹ്‌റാം' },
    description: {
      arabic: 'الإحرام من المواقيت المحددة للحج',
      malayalam: 'ഹജ്ജിന്റെ മീഖാത്തിൽ നിന്ന് ഇഹ്‌റാം ധരിക്കുക',
    },
    instructions: [
      { arabic: 'الاغتسال وارتداء الإحرام', malayalam: 'കുളിച്ച് ഇഹ്‌റാം ധരിക്കുക' },
      { arabic: 'النية للحج', malayalam: 'ഹജ്ജിന് നിയ്യത്ത് ചെയ്യുക' },
      { arabic: 'ترديد التلبية', malayalam: 'തൽബിയ ഉറക്കെ ചൊല്ലുക' },
    ],
    isHighlighted: true,
    isActive: true,
  },
  {
    ritualType: 'hajj',
    stepNumber: 2,
    title: { arabic: 'يوم التروية - مني', malayalam: 'ത്വർവിയ്യ ദിവസം - മിന' },
    description: {
      arabic: 'التوجه إلى منى في اليوم الثامن من ذي الحجة',
      malayalam: 'ദുൽഹജ്ജ് 8-ന് മിനയിലേക്ക് പോകുക',
    },
    instructions: [
      { arabic: 'التوجه إلى منى صباحاً', malayalam: 'രാവിലെ മിനയിലേക്ക് പോകുക' },
      { arabic: 'أداء الصلوات الخمس في منى', malayalam: 'മിനയിൽ അഞ്ച് നേരം നമസ്കരിക്കുക' },
      { arabic: 'المبيت في منى', malayalam: 'മിനയിൽ രാത്രി കഴിയുക' },
    ],
    isHighlighted: false,
    isActive: true,
  },
  {
    ritualType: 'hajj',
    stepNumber: 3,
    title: { arabic: 'يوم عرفة', malayalam: 'അറഫ ദിവസം' },
    description: {
      arabic: 'الوقوف بعرفة هو ركن الحج الأعظم',
      malayalam: 'അറഫയിൽ നിൽക്കൽ ഹജ്ജിന്റെ ഏറ്റവും വലിയ കർമ്മം',
    },
    instructions: [
      { arabic: 'التوجه إلى عرفة بعد الفجر', malayalam: 'ഫജ്ർ ശേഷം അറഫയിലേക്ക് പോകുക' },
      { arabic: 'الوقوف والدعاء حتى الغروب', malayalam: 'സൂര്യാസ്തമനം വരെ നിൽക്കുക, ദുആ ചെയ്യുക' },
      { arabic: 'الانصراف بعد الغروب', malayalam: 'സൂര്യൻ അസ്തമിച്ചശേഷം പുറപ്പെടുക' },
    ],
    isHighlighted: true,
    isActive: true,
  },
  {
    ritualType: 'hajj',
    stepNumber: 4,
    title: { arabic: 'مزدلفة', malayalam: 'മുസ്ദലിഫ' },
    description: {
      arabic: 'المبيت في مزدلفة وجمع الحصى',
      malayalam: 'മുസ്ദലിഫയിൽ രാത്രി കഴിക്കുക, കല്ലുകൾ ശേഖരിക്കുക',
    },
    instructions: [
      { arabic: 'الصلاة في مزدلفة', malayalam: 'മുസ്ദലിഫയിൽ നമസ്കരിക്കുക' },
      { arabic: 'جمع سبعين حصاة', malayalam: 'എഴുപത് കല്ലുകൾ ശേഖരിക്കുക' },
      { arabic: 'المبيت حتى الفجر', malayalam: 'ഫജ്ർ വരെ ഉണ്ടായിരിക്കുക' },
    ],
    isHighlighted: false,
    isActive: true,
  },
  {
    ritualType: 'hajj',
    stepNumber: 5,
    title: { arabic: 'رمي الجمرات', malayalam: 'ജംറ എറിയൽ' },
    description: {
      arabic: 'رمي جمرة العقبة الكبرى بسبع حصيات',
      malayalam: 'ജംറത്തുൽ അഖബയിൽ ഏഴ് കല്ലുകൾ എറിയുക',
    },
    instructions: [
      { arabic: 'التوجه إلى منى بعد الفجر', malayalam: 'ഫജ്ർ ശേഷം മിനയിലേക്ക് പോകുക' },
      { arabic: 'رمي الجمرة الكبرى بسبع حصيات', malayalam: 'വലിയ ജംറയിൽ ഏഴ് കല്ലുകൾ എറിയുക' },
      { arabic: 'التكبير مع كل حصاة', malayalam: 'ഓരോ കല്ലെറിയുമ്പോഴും തക്ബീർ ചൊല്ലുക' },
    ],
    isHighlighted: true,
    isActive: true,
  },
  {
    ritualType: 'hajj',
    stepNumber: 6,
    title: { arabic: 'طواف الإفاضة', malayalam: 'ത്വവാഫുൽ ഇഫാദ' },
    description: {
      arabic: 'طواف الإفاضة ركن من أركان الحج',
      malayalam: 'ത്വവാഫുൽ ഇഫാദ ഹജ്ജിന്റെ ഒരു ഫർദ് കർമ്മം',
    },
    instructions: [
      { arabic: 'الطواف حول الكعبة سبعة أشواط', malayalam: 'കഅ്ബ ഏഴ് തവണ ചുറ്റുക' },
      { arabic: 'صلاة ركعتين خلف المقام', malayalam: 'മഖാമിന് പിറകിൽ രണ്ട് റക്അത്ത് നമസ്കരിക്കുക' },
    ],
    isHighlighted: true,
    isActive: true,
  },
  {
    ritualType: 'hajj',
    stepNumber: 7,
    title: { arabic: 'طواف الوداع', malayalam: 'ത്വവാഫുൽ വദാഅ്' },
    description: {
      arabic: 'طواف الوداع آخر عمل في الحج',
      malayalam: 'ത്വവാഫുൽ വദാഅ് ഹജ്ജിലെ അവസാന കർമ്മം',
    },
    instructions: [
      { arabic: 'الطواف الأخير قبل مغادرة مكة', malayalam: 'മക്ക വിടുന്നതിന് മുമ്പ് അവസാന ത്വവാഫ് ചെയ്യുക' },
      { arabic: 'الدعاء بالقبول والعودة', malayalam: 'കബൂലാക്കലിനും തിരിച്ചുവരലിനും ദുആ ചെയ്യുക' },
    ],
    isHighlighted: false,
    isActive: true,
  },
];

const duas = [
  // ── TALBIYAH ──────────────────────────────────────────────────────────────
  {
    ritualType: 'both',
    title: { arabic: 'التلبية', malayalam: 'തൽബിയ' },
    arabicText: 'لَبَّيْكَ اللَّهُمَّ لَبَّيْكَ، لَبَّيْكَ لَا شَرِيكَ لَكَ لَبَّيْكَ، إِنَّ الْحَمْدَ وَالنِّعْمَةَ لَكَ وَالْمُلْكَ، لَا شَرِيكَ لَكَ',
    transliteration: 'Labbayka Allāhumma labbayk, labbayka lā sharīka laka labbayk, inna l-ḥamda wa-n-niʿmata laka wa-l-mulk, lā sharīka lak',
    malayalamMeaning: 'ഞാൻ ഇതാ ഹാജരായി, അല്ലാഹുവേ, ഞാൻ ഹാജരായി. ഞാൻ ഹാജരായി, നിനക്ക് പങ്കാളിയില്ല, ഞാൻ ഹാജരായി. തീർച്ചയായും സ്തുതിയും അനുഗ്രഹവും രാജ്യാധിപത്യവും നിനക്ക് തന്നെ, നിനക്ക് പങ്കാളിയില്ല.',
    category: 'talbiyah',
    order: 1,
    isHighlighted: true,
    isActive: true,
  },

  // ── IHRAM ─────────────────────────────────────────────────────────────────
  {
    ritualType: 'both',
    title: { arabic: 'دعاء الإحرام', malayalam: 'ഇഹ്‌റാമിന്റെ ദുആ' },
    arabicText: 'اللَّهُمَّ إِنِّي أُرِيدُ الْعُمْرَةَ فَيَسِّرْهَا لِي وَتَقَبَّلْهَا مِنِّي',
    transliteration: 'Allāhumma innī urīdu l-ʿumrata fa-yassir-hā lī wa-taqabbal-hā minnī',
    malayalamMeaning: 'അല്ലാഹുവേ, ഞാൻ ഉംറ ചെയ്യാൻ ആഗ്രഹിക്കുന്നു, അത് എനിക്ക് എളുപ്പമാക്കി തരണേ, എന്നിൽ നിന്ന് അത് സ്വീകരിക്കണേ.',
    category: 'dua',
    order: 1,
    isHighlighted: true,
    isActive: true,
  },

  // ── TAWAF ─────────────────────────────────────────────────────────────────
  {
    ritualType: 'both',
    title: { arabic: 'دعاء بداية الطواف', malayalam: 'ത്വവാഫ് ആരംഭ ദുആ' },
    arabicText: 'بِسْمِ اللَّهِ وَاللَّهُ أَكْبَرُ، اللَّهُمَّ إِيمَانًا بِكَ وَتَصْدِيقًا بِكِتَابِكَ وَوَفَاءً بِعَهْدِكَ وَاتِّبَاعًا لِسُنَّةِ نَبِيِّكَ مُحَمَّدٍ صَلَّى اللَّهُ عَلَيْهِ وَسَلَّمَ',
    transliteration: 'Bismillāhi wa-Llāhu akbar, Allāhumma īmānan bika wa taṣdīqan bi-kitābika wa wafāʾan bi-ʿahdika wa-ttibāʿan li-sunnati nabiyyika Muḥammadin ṣallā Llāhu ʿalayhi wa-sallam',
    malayalamMeaning: 'അല്ലാഹുവിന്റെ നാമത്തിൽ, അല്ലാഹു ഏറ്റവും മഹാനാണ്. അല്ലാഹുവേ, നിന്നിലുള്ള ഈമാനോടെ, നിന്റെ ഗ്രന്ഥത്തെ സത്യമാക്കിക്കൊണ്ട്, നിന്റെ കരാർ നിറവേറ്റിക്കൊണ്ട്, നിന്റെ പ്രവാചകൻ മുഹമ്മദ്(സ)യുടെ സുന്നത്ത് പിൻപറ്റിക്കൊണ്ട്.',
    category: 'dua',
    order: 1,
    isHighlighted: true,
    isActive: true,
  },
  {
    ritualType: 'both',
    title: { arabic: 'دعاء الركن اليماني', malayalam: 'റുക്‌നുൽ യമാനിക്കും ഹജ്ജറുൽ അസ്‌വദിനും ഇടയിലെ ദുആ' },
    arabicText: 'رَبَّنَا آتِنَا فِي الدُّنْيَا حَسَنَةً وَفِي الْآخِرَةِ حَسَنَةً وَقِنَا عَذَابَ النَّارِ',
    transliteration: 'Rabbanā ātinā fi-d-dunyā ḥasanatan wa fi-l-ākhirati ḥasanatan wa qinā ʿadhāba-n-nār',
    malayalamMeaning: 'ഞങ്ങളുടെ രക്ഷിതാവേ, ഞങ്ങൾക്ക് ഇഹലോകത്ത് നന്മ നൽകേണമേ, പരലോകത്തും നന്മ നൽകേണമേ, നരകശിക്ഷയിൽ നിന്ന് ഞങ്ങളെ കാക്കേണമേ.',
    category: 'dua',
    order: 2,
    isHighlighted: true,
    isActive: true,
  },

  // ── SAI ───────────────────────────────────────────────────────────────────
  {
    ritualType: 'both',
    title: { arabic: 'دعاء الصفا', malayalam: 'സ്വഫായിലെ ദുആ' },
    arabicText: 'إِنَّ الصَّفَا وَالْمَرْوَةَ مِنْ شَعَائِرِ اللَّهِ، أَبْدَأُ بِمَا بَدَأَ اللَّهُ بِهِ، اللَّهُ أَكْبَرُ، اللَّهُ أَكْبَرُ، اللَّهُ أَكْبَرُ',
    transliteration: "Inna s-safa wa-l-marwata min sha'a'iri Llah, abdau bi-ma badaa Llahu bihi, Allahu akbar, Allahu akbar, Allahu akbar",
    malayalamMeaning: 'തീർച്ചയായും സ്വഫായും മർവയും അല്ലാഹുവിന്റെ ചിഹ്നങ്ങളിൽ പെട്ടതാണ്. അല്ലാഹു ആരംഭിച്ചതിൽ നിന്ന് ഞാൻ ആരംഭിക്കുന്നു. അല്ലാഹു ഏറ്റവും മഹാൻ, അല്ലാഹു ഏറ്റവും മഹാൻ, അല്ലാഹു ഏറ്റവും മഹാൻ.',
    category: 'dua',
    order: 1,
    isHighlighted: true,
    isActive: true,
  },

  // ── ARAFAH ────────────────────────────────────────────────────────────────
  {
    ritualType: 'hajj',
    title: { arabic: 'أفضل دعاء يوم عرفة', malayalam: 'അറഫ ദിനത്തിലെ ഏറ്റവും ശ്രേഷ്ഠമായ ദുആ' },
    arabicText: 'لَا إِلَهَ إِلَّا اللَّهُ وَحْدَهُ لَا شَرِيكَ لَهُ، لَهُ الْمُلْكُ وَلَهُ الْحَمْدُ وَهُوَ عَلَى كُلِّ شَيْءٍ قَدِيرٌ',
    transliteration: 'Lā ilāha illa Llāhu waḥdahu lā sharīka lah, lahu-l-mulku wa-lahu-l-ḥamd, wa-huwa ala kulli shayin qadir',
    malayalamMeaning: 'അല്ലാഹു അല്ലാതെ ആരാധ്യനില്ല, അവൻ ഏകനാണ്, അവന് പങ്കാളിയില്ല. ആധിപത്യം അവനുള്ളതാണ്, സ്തുതി അവനാണ്, അവൻ സർവ കാര്യങ്ങളിലും കഴിവുള്ളവനാണ്.',
    category: 'dhikr',
    order: 1,
    isHighlighted: true,
    isActive: true,
  },

  // ── ZAMZAM ────────────────────────────────────────────────────────────────
  {
    ritualType: 'both',
    title: { arabic: 'دعاء شرب ماء زمزم', malayalam: 'സംസം കുടിക്കുമ്പോഴുള്ള ദുആ' },
    arabicText: 'اللَّهُمَّ إِنِّي أَسْأَلُكَ عِلْمًا نَافِعًا وَرِزْقًا وَاسِعًا وَشِفَاءً مِنْ كُلِّ دَاءٍ',
    transliteration: 'Allāhumma innī asaluka ʿilman nāfiʿan wa-rizqan wāsiʿan wa-shifāʾan min kulli dāʾ',
    malayalamMeaning: 'അല്ലാഹുവേ, ഞാൻ നിന്നോട് ഉപകാരപ്രദമായ അറിവും, വിശാലമായ ഉപജീവനവും, എല്ലാ രോഗങ്ങളിൽ നിന്നും ശിഫാഉം ചോദിക്കുന്നു.',
    category: 'dua',
    order: 1,
    isHighlighted: true,
    isActive: true,
  },

  // ── GENERAL ───────────────────────────────────────────────────────────────
  {
    ritualType: 'both',
    title: { arabic: 'دعاء قبول الحج والعمرة', malayalam: 'ഹജ്ജ്/ഉംറ സ്വീകരിക്കപ്പെടാനുള്ള ദുആ' },
    arabicText: 'اللَّهُمَّ تَقَبَّلْ مِنَّا إِنَّكَ أَنْتَ السَّمِيعُ الْعَلِيمُ',
    transliteration: 'Allāhumma taqabbal minnā innaka anta s-samīʿu l-ʿalīm',
    malayalamMeaning: 'അല്ലാഹുവേ, ഞങ്ങളിൽ നിന്ന് (ഈ ആരാധന) സ്വീകരിക്കേണമേ, തീർച്ചയായും നീ (എല്ലാം) കേൾക്കുന്നവനും അറിയുന്നവനുമാണ്.',
    category: 'dua',
    order: 1,
    isHighlighted: true,
    isActive: true,
  },
  {
    ritualType: 'both',
    title: { arabic: 'دعاء دخول المسجد الحرام', malayalam: 'മസ്ജിദുൽ ഹറാമിൽ പ്രവേശിക്കുമ്പോഴുള്ള ദുആ' },
    arabicText: 'اللَّهُمَّ افْتَحْ لِي أَبْوَابَ رَحْمَتِكَ',
    transliteration: 'Allāhumma-ftaḥ lī abwāba raḥmatik',
    malayalamMeaning: 'അല്ലാഹുവേ, നിന്റെ കാരുണ്യത്തിന്റെ വാതിലുകൾ എനിക്ക് തുറന്ന് തരേണമേ.',
    category: 'dua',
    order: 2,
    isHighlighted: false,
    isActive: true,
  },
];

async function seed() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Connected to MongoDB');

    // Clear existing
    await RitualStep.deleteMany({});
    await Dua.deleteMany({});
    console.log('🗑️  Cleared existing data');

    // Insert ritual steps
    const insertedSteps = await RitualStep.insertMany(ritualSteps);
    console.log(`✅ Inserted ${insertedSteps.length} ritual steps`);

    // Map step titles to ObjectIds for dua linkage
    const stepMap = {};
    insertedSteps.forEach(s => {
      stepMap[`${s.ritualType}_${s.stepNumber}`] = s._id;
    });

    // Link duas to ritual steps where applicable
    const duasWithRefs = duas.map(d => {
      const linked = { ...d };
      if (d.category === 'talbiyah') {
        linked.ritualStep = stepMap['umrah_1'] || stepMap['hajj_1'];
      }
      return linked;
    });

    const insertedDuas = await Dua.insertMany(duasWithRefs);
    console.log(`✅ Inserted ${insertedDuas.length} duas`);

    console.log('\n🎉 Seed complete!');
    console.log(`   Ritual steps: ${insertedSteps.length}`);
    console.log(`   Duas: ${insertedDuas.length}`);
  } catch (err) {
    console.error('❌ Seed failed:', err.message);
    process.exit(1);
  } finally {
    await mongoose.disconnect();
  }
}

seed();
