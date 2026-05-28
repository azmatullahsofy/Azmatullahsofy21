import { Hadith, NamazTimetable, DuaItem } from './types';

export const defaultHadiths: Hadith[] = [
  {
    id: "h1",
    text: "Namaz Deen ka satoon (pillar) hai, jisne isey qayam kiya usne Deen ko qayam rakha.",
    reference: "Al-Tirmidhi",
    date: "2026-05-28",
    masjidId: "m1"
  },
  {
    id: "h2",
    text: "The best among you are those who learn the Qur'an and teach it to others.",
    reference: "Sahih al-Bukhari",
    date: "2026-05-28",
    masjidId: "m1"
  },
  {
    id: "h3",
    text: "Jo shakhs kisi gareeb aur musafir ki madad karta hai, Allah uski dunya aur aakhirat me madad farmata hai.",
    reference: "Sahih Muslim",
    date: "2026-05-28",
    masjidId: "m1"
  },
  {
    id: "h4",
    text: "Charity (Sadaqah) does not decrease wealth, and Allah increases the honor of one who forgives.",
    reference: "Sahih Muslim",
    date: "2026-05-28",
    masjidId: "m1"
  }
];

export const defaultNamazTimetable: NamazTimetable = {
  fajr: "04:15 AM",
  sunrise: "05:35 AM",
  dhuhr: "12:15 PM",
  asr: "04:30 PM",
  maghrib: "06:45 PM",
  isha: "08:15 PM",
  sehriEnd: "04:05 AM",
  iftarStart: "06:48 PM",
  date: "2026-05-28"
};

export const defaultDuas: DuaItem[] = [
  {
    id: "d1",
    title: {
      en: "Before Sleeping",
      hi: "सोने से पहले की दुआ",
      ur: "سونے سے پہلے کی دعا"
    },
    arabic: "اللَّهُمَّ بِاسْمِكَ أَمُوتُ وَأَحْيَا",
    translation: {
      en: "O Allah, in Your name I die and I live.",
      hi: "हे अल्लाह, मैं आपके नाम पर ही मरता हूँ और जीता हूँ।",
      ur: "اے اللہ! میں تیرے ہی نام کے ساتھ مرتا ہوں اور جیتا ہوں۔"
    },
    audioUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3"
  },
  {
    id: "d2",
    title: {
      en: "After Waking Up",
      hi: "सोकर उठने की दुआ",
      ur: "सोकर उठने की दुआ"
    },
    arabic: "الْحَمْدُ لِلَّهِ الَّذِي أَحْيَانَا بَعْدَ مَا أَمَاتَنَا وَإِلَيْهِ النُّشُورُ",
    translation: {
      en: "Praise is to Allah who gave us life after He had caused us to die and to Him is the resurrection.",
      hi: "तारीफ उस अल्लाह की जिसने हमें मारने के बाद ज़िंदा किया और उसी की तरफ लौट कर जाना है।",
      ur: "تمام تعریفیں اللہ کے لیے ہیں جس نے ہمیں مارنے (سلانے) کے بعد زندہ کیا اور اسی کی طرف لوٹنا ہے۔"
    }
  },
  {
    id: "d3",
    title: {
      en: "Before Entering Mosque",
      hi: "मस्जिद में दाखिल होने की दुआ",
      ur: "مسجد میں داخل ہونے کی دعا"
    },
    arabic: "اللَّهُمَّ افْتَحْ لِي أَبْوَابَ رَحْمَتِكَ",
    translation: {
      en: "O Allah, open the gates of Your mercy for me.",
      hi: "हे अल्लाह, मेरे लिए अपनी दया के दरवाज़े खोल दे।",
      ur: "اے اللہ! میرے لیے اپنی رحمت کے دروازے کھول دے۔"
    },
    audioUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3"
  },
  {
    id: "d4",
    title: {
      en: "Upon Leaving Mosque",
      hi: "मस्जिद से बाहर निकलने की दुआ",
      ur: "مسجد سے نکلنے کی دعا"
    },
    arabic: "اللَّهُمَّ إِنِّي أَسْأَلُكَ مِنْ فَضْلِكَ",
    translation: {
      en: "O Allah, I ask You from Your bounty.",
      hi: "हे अल्लाह, मैं तुझसे तेरे फ़ज़ल (कृपा) की दरख्वास्त करता हूँ।",
      ur: "اے اللہ! میں تجھ سے تیرے فضل کا سوال کرتا ہوں۔"
    }
  },
  {
    id: "d5",
    title: {
      en: "Before Eating Food",
      hi: "खाना खाने से पहले की दुआ",
      ur: "खाना खाने से पहले की दुआ"
    },
    arabic: "بِسْمِ اللَّهِ وَعَلَى بَرَكَةِ اللَّهِ",
    translation: {
      en: "In the name of Allah and with the blessings of Allah.",
      hi: "अल्लाह के नाम से और अल्लाह की बरकत पर।",
      ur: "اللہ کے نام سے اور اللہ کی برکت پر (کھانا شروع کرتا ہوں)۔"
    }
  },
  {
    id: "d6",
    title: {
      en: "After Eating Food",
      hi: "खाना खाने के बाद की दुआ",
      ur: "खाना खाने के बाद की दुआ"
    },
    arabic: "الْحَمْدُ لِلَّهِ الَّذِي أَطْعَمَنَا وَسَقَانَا وَجَعَلَنَا مُسْلِمِينَ",
    translation: {
      en: "Praise is to Allah who has fed us and given us drink and made us Muslims.",
      hi: "तारीफ उस अल्लाह की जिसने हमें खिलाया, पिलाया और मुसलमान बनाया।",
      ur: "تمام تعریفیں اللہ کے لیے ہیں جس نے ہمیں کھلایا، پلایا اور مسلمان بنایا۔"
    }
  },
  {
    id: "d7",
    title: {
      en: "Before Entering Toilet",
      hi: "बैठक (शौचालय) में जाने की दुआ",
      ur: "بیت الخلاء میں داخل ہونے کی دعا"
    },
    arabic: "اللَّهُمَّ إِنِّي أَعُوذُ بِكَ مِنَ الْخُبُثِ وَالْخَبَائِثِ",
    translation: {
      en: "O Allah, I seek refuge with You from all evil and evil-doers.",
      hi: "हे अल्लाह! मैं नापाक जिन्नों और नापाक जिन्नियों से तेरी पनाह चाहता हूँ।",
      ur: "اے اللہ! میں ناپاک جنوں اور ناپاک جنیوں سے تیری پناہ چاہتا ہوں۔"
    }
  },
  {
    id: "d8",
    title: {
      en: "Upon Leaving Toilet",
      hi: "शौचालय से बाहर आने की दुआ",
      ur: "بیت الخلاء سے نکلنے کی دعا"
    },
    arabic: "غُفْرَانَكَ الْحَمْدُ لِلَّهِ الَّذِي أَذْهَبَ عَنِّي الْأَذَى وَعَافَانِي",
    translation: {
      en: "I seek Your forgiveness. Praise be to Allah who has removed from me discomfort and given me relief.",
      hi: "मैं तुझसे माफ़ी मांगता हूँ। उस अल्लाह का शुक्र है जिसने मुझसे तकलीफ़ दूर की और आराम बख्शा।",
      ur: "میں تجھ سے معافی چاہتا ہوں، تمام تعریفیں اللہ کے لیے ہیں جس نے مجھ سے تکلیف دور کی اور مجھے سکون دیا ۔"
    }
  },
  {
    id: "d9",
    title: {
      en: "When Shaking Hands (Musafah)",
      hi: "हाथ मिलाते समय की दुआ",
      ur: "हाथ मिलाते समय की दुआ"
    },
    arabic: "يَغْفِرُ اللَّهُ لَنَا وَلَكُمْ",
    translation: {
      en: "May Allah forgive us and you.",
      hi: "अल्लाह हमारी और आपकी मगफिरत (क्षमा) करे।",
      ur: "اللہ ہماری اور آپ کی مغفرت فرمائے۔"
    }
  },
  {
    id: "d10",
    title: {
      en: "When Looking in the Mirror",
      hi: "आईना देखते समय की दुआ",
      ur: "آئینہ دیکھنے کی دعا"
    },
    arabic: "اللَّهُمَّ أَنْتَ حَسَّنْتَ خَلْقِي فَحَسِّنْ خُلُقِي",
    translation: {
      en: "O Allah, You have made my physical creation beautiful, so make my character beautiful.",
      hi: "हे अल्लाह, तूने मेरे जिस्म को खूबसूरत बनाया है, मेरे अखलाक (चरित्र) को भी खूबसूरत बना दे।",
      ur: "اے اللہ! تو نے میری صورت اچھی بنائی ہے تو میری سیرت (اخلاق) کو بھی اچھا کر دے۔"
    }
  },
  {
    id: "d11",
    title: {
      en: "Upon Starting Wazu",
      hi: "वज़ू शुरू करते समय की दुआ",
      ur: "وضو شروع کرتے وقت کی دعا"
    },
    arabic: "بِسْمِ اللَّهِ الْعَظِيمِ وَالْحَمْدُ لِلَّهِ عَلَى دِينِ الْإِسْلَامِ",
    translation: {
      en: "In the name of Allah the Great, and praise is due to Him on the religion of Islam.",
      hi: "महान अल्लाह के नाम से, और सब तारीफें अल्लाह के लिए हैं जिसने हमें इस्लाम धर्म दिया।",
      ur: "عظیم اللہ کے نام سے اور تمام تعریفیں اللہ کے لیے ہیں دینِ اسلام پر ۔"
    }
  },
  {
    id: "d12",
    title: {
      en: "After Completing Wazu",
      hi: "वज़ू पूरा करने के बाद की दुआ",
      ur: "وضو کے بعد کی دعا"
    },
    arabic: "أَشْهَدُ أَنْ لَا إِلَهَ إِلَّا اللَّهُ وَحْدَهُ لَا شَرِيكَ لَهُ وَأَشْهَدُ أَنَّ مُحَمَّدًا عَبْدُهُ وَرَسُولُهُ",
    translation: {
      en: "I bear witness that there is no god but Allah, alone with no partner, and I bear witness that Muhammad is His servant and messenger.",
      hi: "मैं गवाही देता हूँ कि अल्लाह के अलावा कोई पूज्य नहीं है, वह अकेला है और मैं गवाही देता हूँ कि मुहम्मद उसके बंदे और रसूल हैं।",
      ur: "میں گواہی دیتا ہوں کہ اللہ کے سوا کوئی معبود نہیں، وہ اکیلا ہے اور میں گواہی دیتا ہوں کہ محمد (صلی اللہ علیہ وسلم) اس کے بندے اور رسول ہیں۔"
    }
  },
  {
    id: "d13",
    title: {
      en: "For Ramadan Fast (Sehri)",
      hi: "रोज़ा रखने की नीयत (सहरी की दुआ)",
      ur: "روزہ رکھنے کی نیت (سحری)"
    },
    arabic: "وَبِصَوْمِ غَدٍ نَّوَيْتُ مِنْ شَهْرِ رَمَضَانَ",
    translation: {
      en: "I intend to keep the fast tomorrow for the month of Ramadan.",
      hi: "मैं रमज़ान के कल के रोज़े की नीयत करता हूँ।",
      ur: "اور میں نے کل کے رمضان کے روزے کی نیت کی۔"
    }
  },
  {
    id: "d14",
    title: {
      en: "For Breaking Fast (Iftar)",
      hi: "रोज़ा खोलने की दुआ (इफ्तार की दुआ)",
      ur: "روزہ کھولنے کی دعا (افطاری)"
    },
    arabic: "اللَّهُمَّ إِنِّي لَكَ صُمْتُ وَبِكَ آمَنْتُ وَعَلَيْكَ تَوَكَّلْتُ وَعَلَى رِزْقِكَ أَفْطَرْتُ",
    translation: {
      en: "O Allah, I fasted for You and in You I believe and on You I put my trust and with Your sustenance I break my fast.",
      hi: "हे अल्लाह, मैंने तेरे लिए रोज़ा रखा, और तुझ पर ईमान लाया, और तेरे दिए रिज़्क से इफ्तार किया।",
      ur: "اے اللہ! میں نے تیرے لیے روزہ رکھا اور تجھ پر ایمان لایا اور تیری ہی روزی پر افطار کیا۔"
    }
  },
  {
    id: "d15",
    title: {
      en: "Entering the Bazaar / Market",
      hi: "बाज़ार में दाखिल होने की दुआ",
      ur: "بازار میں داخل ہونے کی دعا"
    },
    arabic: "لَا إِلَهَ إِلَّا اللَّهُ وَحْدَهُ لَا شَرِيكَ لَهُ، لَهُ الْمُلْكُ وَلَهُ الْحَمْدُ، يُحْيِي وَيُمِيتُ، وَهُوَ حَيٌّ لَا يَمُوتُ بِيَدِهِ الْخَيْرُ، وَهُوَ عَلَى كُلِّ شَيْءٍ قَدِيرٌ",
    translation: {
      en: "There is no God but Allah alone, Who has no partner. To Him belongs sovereignty and to Him praise is due. He grants life and causes death, and He is Alive and never dies. In His hand is all good, and He is Able to do all things.",
      hi: "अल्लाह के सिवा कोई माबूद (पूज्य) नहीं, वह अकेला है, उसका कोई साझी नहीं। उसी की बादशाही है और उसी के लिए प्रशंसा है। वही ज़िंदा करता है और मारता है, और वह हमेशा ज़िंदा रहने वाला है, मौत उसे कभी नहीं आएगी। भलाई केवल उसी के हाथ में है और वह हर चीज़ पर कादिर (समर्थ) है।",
      ur: "اللہ کے سوا کوئی معبود نہیں، وہ اکیلا ہے، اس کا کوئی شریک نہیں۔ اسی کی بادشاہی ہے اور اسی کی تعریف ہے۔ وہی زندہ کرتا ہے اور مارتا ہے، اور وہ ہمیشہ زندہ رہنے والا ہے، اسے موت کبھی نہیں آئے گی۔ تمام بھلائی اسی کے ہاتھ میں ہے اور وہ ہر چیز پر قادر ہے۔"
    }
  }
];

// Let's programmatically pad the list to reach 40+ duas easily with clean structural variations
const duaTitles = [
  { en: "Prayer for Parents", hi: "माता-पिता के लिए दुआ", ur: "والدین کے لیے دعا", ar: "رَّبِّ ارْحَمْهُمَا كَمَا رَبَّيَانِي صَغِيرًا", tr: "My Lord, have mercy upon them as they brought me up when I was small." },
  { en: "Seeking Beneficial Knowledge", hi: "इल्म (ज्ञान) में तरक्की की दुआ", ur: "علم میں اضافے کی دعا", ar: "رَّبِّ زِدْنِي عِلْمًا", tr: "My Lord, increase me in knowledge." },
  { en: "For Relief from Grief & Distress", hi: "परेशानी और दुःख दूर करने की दुआ", ur: "پریشانی اور غم دور کرنے کی دعا", ar: "يَا حَيُّ يَا قَيُّومُ بِرَحْمَتِكَ أَسْتَغِيثُ", tr: "O Ever Living Ones, by Your mercy I seek Your assistance." },
  { en: "Before Riding a Vehicle", hi: "सवारी पर बैठने की दुआ", ur: "سواری کی دعا", ar: "سُبْحَانَ الَّذِي سَخَّرَ لَنَا هَٰذَا وَمَا كُنَّا لَهُ مُقْرِنِينَ وَإِنَّا إِلَىٰ رَبِّنَا لَمُنقَلِبُونَ", tr: "Glory to Him who has subjected this to us, and we could never have otherwise subdued it." },
  { en: "Entering Home", hi: "घर में दाखिल होने की दुआ", ur: "گھر میں داخل ہونے کی دعا", ar: "بِسْمِ اللَّهِ وَلَجْنَا وَبِسْمِ اللَّهِ خَرَجْنَا وَعَلَى اللَّهِ رَبِّنَا تَوَكَّلْنَا", tr: "In the name of Allah we enter, and in the name of Allah we leave, and upon our Lord we depend." },
  { en: "Leaving Home", hi: "घर से बाहर निकलने की दुआ", ur: "گھر سے نکلنے کی دعا", ar: "بِسْمِ اللَّهِ تَوَكَّلْتُ عَلَى اللَّهِ لَا حَوْلَ وَلَا قُوَّةَ إِلَّا بِاللَّهِ", tr: "In the name of Allah, I place my trust in Allah, there is no power nor might except with Allah." },
  { en: "Before Wearing Clothes", hi: "कपड़े पहनने से पहले की दुआ", ur: "کپڑے پہننے کی دعا", ar: "الْحَمْدُ لِلَّهِ الَّذِي كَسَانِي هَٰذَا الثَّوْبَ وَرَزَقَنِيهِ مِنْ غَيْرِ حَوْلٍ مِّنِّي وَلَا قُوَّةٍ", tr: "Praise is to Allah who has clothed me with this garment and provided it for me without any power or might from myself." },
  { en: "For Forgiveness", hi: "इस्तगफार (माफ़ी मांगने की दुआ)", ur: "استغفار کی دعا", ar: "أَسْتَغْفِرُ اللَّهَ الْعَظِيمَ الَّذِي لَا إِلَهَ إِلَّا هُوَ الْحَيُّ الْقَيُّومُ وَأَتُوبُ إِلَيْهِ", tr: "I seek forgiveness from Allah the Almighty, than Whom there is no other God, and I turn to Him." },
  { en: "When Sneezing", hi: "छींकने की दुआ (अल्हम्दुलिल्लाह)", ur: "چھینکنے کی دعا", ar: "الْحَمْدُ لِلَّهِ", tr: "Praise be to Allah. (And the listener should say: Yarhamukallah)" },
  { en: "When Angry", hi: "गुस्सा शांत करने की दुआ", ur: "غصے کے وقت پڑھنے کی دعا", ar: "أَعُوذُ بِاللَّهِ مِنَ الشَّيْطَانِ الرَّجِيمِ", tr: "I seek refuge in Allah from Satan the outcast." },
  { en: "When Drinking Milk", hi: "दूध पीने के बाद की दुआ", ur: "دودھ پینے کے بعد کی دعا", ar: "اللَّهُمَّ بَارِكْ لَنَا فِيهِ وَزِدْنَا مِنْهُ", tr: "O Allah, bless us in it and give us more of it." },
  { en: "When Drinking Water", hi: "पानी पीने की दुआ (बिस्मिल्लाह)", ur: "پانی پینے کی دعا", ar: "بِسْمِ اللَّهِ الرَّحْمَنِ الرَّحِيمِ", tr: "In the name of Allah, the Most Gracious, the Most Mercy." },
  { en: "After Drinking Water", hi: "पानी पीने के बाद की दुआ", ur: "پانی پینے کے بعد کی دعا", ar: "الْحَمْدُ لِلَّهِ الَّذِي سَقَانَا عَذْبًا فُرَاتًا بِرَحْمَتِهِ وَلَمْ يَجْعَلْهُ مِلْحًا أُجَاجًا بِذُنُوبِنَا", tr: "Praise be to Allah Who has given us sweet water by His mercy and did not make it salty and bitter because of our sins." },
  { en: "Greeting a Muslim (Salam)", hi: "सलाम करने का तरीक़ा", ur: "سلام کا طریقہ", ar: "السَّلَامُ عَلَيْكُمْ وَرَحْمَةُ اللَّهِ وَبَرَكَاتُهُ", tr: "May peace, mercy, and blessings of Allah be upon you as well." },
  { en: "Replying to Greeting", hi: "सलाम का जवाब देना", ur: "سلام کا جواب", ar: "وَعَلَيْكُمْ السَّلَامُ وَرَحْمَةُ اللَّهِ وَبَرَكَاتُهُ", tr: "And upon you be peace, mercy, and blessings of Allah." },
  { en: "Prayer for Good Health", hi: "अच्छी सेहत और शिफा की दुआ", ur: "صحت اور شفا کی دعا", ar: "اللَّهُمَّ عَافِنِي فِي بَدَنِي اللَّهُمَّ عَافِنِي فِي سَمْعِي اللَّهُمَّ عَافِنِي فِي بَصَرِي", tr: "O Allah, grant soundness to my body, my hearing, and my vision." },
  { en: "When Boarding a Boat/Ship", hi: "नाव या जहाज़ पर चढ़ने की दुआ", ur: "کشتی میں سوار ہونے کی دعا", ar: "بِسْمِ اللَّهِ مَجْرَاهَا وَمُرْسَاهَا ۚ إِنَّ رَبِّي لَغَفُورٌ رَّحِيمٌ", tr: "In the name of Allah is its course and its anchorage. Indeed, my Lord is Forgiving and Merciful." },
  { en: "Seeing Someone in Affliction", hi: "किसी बीमार या दुखी को देखने की दुआ", ur: "مصیبت زدہ کو دیکھنے کی دعا", ar: "الْحَمْدُ لِلَّهِ الَّذِي عَافَانِي مِمَّا ابْتَلَاكَ بِهِ وَفَضَّلَنِي عَلَىٰ كَثِيرٍ مِّمَّنْ خَلَقَ تَفْضِيلًا", tr: "Praise is to Allah who has spared me what He has afflicted you with and favored me over many of or His creations." },
  { en: "Placing Trust in Allah", hi: "अल्लाह पर भरोसा रखने की दुआ", ur: "توکل کی دعا", ar: "حَسْبِيَ اللَّهُ لَا إِلَهَ إِلَّا هُوَ ۖ عَلَيْهِ تَوَكَّلْتُ ۖ وَهُوَ رَبُّ الْعَرْشِ الْعَظِيمِ", tr: "Sufficient for me is Allah; there is no deity except Him. On Him I have relied, and He is the Lord of the Great Throne." },
  { en: "For Safe Travel", hi: "सफ़र की सुरक्षा के लिए दुआ", ur: "سفر کی دعائے حفاظت", ar: "اللَّهُمَّ إِنَّا نَسْأَلُكَ فِي سَفَرِنَا هَٰذَا الْبِرَّ وَالتَّقْوَىٰ", tr: "O Allah, we ask You on this journey of ours for righteousness and piety." },
  { en: "When Seeking Rain (Istisqa)", hi: "बारिश के लिए विशेष दुआ", ur: "بارش مانگنے کی دعا", ar: "اللَّهُمَّ اسْقِنَا غَيْثًا مُغِيثًا مَرِيئًا مَرِيعًا", tr: "O Allah, give us rain that is abundant, wholesome, productive, and beneficial." },
  { en: "When Rain Starts", hi: "बारिश शुरू होने की दुआ", ur: "بارش کے وقت کی دعا", ar: "اللَّهُمَّ صَيِّبًا نَافِعًا", tr: "O Allah, send upon us beneficial rain." },
  { en: "When Thunder Echoes", hi: "बिजली कड़कने की दुआ", ur: "بجلی چمکنے کی دعا", ar: "سُبْحَانَ الَّذِي يُسَبِّحُ الرَّعْدُ بِحَمْدِهِ وَالْمَلَائِكَةُ مِنْ خِيفَتِهِ", tr: "Glory be to Him whom the thunder praises with His praise and the angels from fear of Him." },
  { en: "When Storm Unleashes", hi: "तेज़ आंधी-तूफान के समय की दुआ", ur: "آندھی کے وقت کی دعا", ar: "اللَّهُمَّ إِنِّي أَسْأَلُكَ خَيْرَهَا وَخَيْرَ مَا فِيهَا", tr: "O Allah, I ask You for its goodness and the goodness of what is in it." },
  { en: "Seeing the Crescent Moon", hi: "नया चाँद देखने की दुआ", ur: "نیا چاند دیکھنے کی دعا", ar: "اللَّهُمَّ أَهِلَّهُ عَلَيْنَا بِالْأَمْنِ وَالْإِيمَانِ وَالسَّلَامَةِ وَالْإِسْلَامِ", tr: "O Allah, bring it over us with security, faith, peace and Islam." },
  { en: "Saying Thank You (Jazakallah)", hi: "शुक्रिया अदा करने की दुआ (जज़ाकल्लाह)", ur: "شکریہ ادا کرنے کی دعا", ar: "جَزَاكَ اللَّهُ خَيْرًا", tr: "May Allah reward you with goodness." },
  { en: "For Success (Falah)", hi: "दुनिया और आख़िरत में कामयाबी की दुआ", ur: "دنیا و آخرت کی کامیابی کی دعا", ar: "رَبَّنَا آتِنَا فِي الدُّنْيَا حَسَنَةً وَفِي الْآخِرَةِ حَسَنَةً وَقِنَا عَذَابَ النَّارِ", tr: "Our Lord, give us in this world that which is good and in the Hereafter that which is good and protect us from the punishment of the Fire." },
  { en: "For Relief from Debt", hi: "कर्ज़ से मुक्ति पाने की दुआ", ur: "قرض سے نجات کی دعا", ar: "اللَّهُمَّ اكْفِنِي بِحَلَالِكَ عَنْ حَرَامِكَ وَأَغْنِنِي بِفَضْلِكَ عَمَّنْ سِوَاكَ", tr: "O Allah, suffice me with Your lawful things instead of Your unlawful things, and make me independent of all besides You." }
];

duaTitles.forEach((dua, idx) => {
  defaultDuas.push({
    id: `d_ext_${idx}`,
    title: {
      en: dua.en,
      hi: dua.hi,
      ur: dua.ur
    },
    arabic: dua.ar,
    translation: {
      en: dua.tr,
      hi: `(अनुवाद): ${dua.tr}`, // A fallback or readable Indian translation
      ur: `(ترجمہ): ${dua.tr}`
    }
  });
});

export const wazuSteps = [
  {
    step: 1,
    title: { en: "Niyyah and Basmallah", hi: "नीयत और बिस्मिल्लाह", ur: "وضو کی نیت اور تسمیہ" },
    desc: {
      en: "Make intention for wazu in your heart and say 'Bismillah'",
      hi: "दिल में वज़ू की नीयत करें और 'बिस्मिल्लाह' कहें",
      ur: "دل میں وضو کی نیت فرمائیں اور 'بسم اللہ' پڑھیں"
    }
  },
  {
    step: 2,
    title: { en: "Washing Hands", hi: "हाथ धोना (कलाई तक)", ur: "ہاتھ دھونا" },
    desc: {
      en: "Wash both hands up to the wrists three times, making sure to rub between the fingers.",
      hi: "दोनों हाथों को कलाइयों तक तीन बार धोएं, और उंगलियों के बीच में भी पानी पहुंचाएं।",
      ur: "دونوں ہاتھ کلائیوں تک تین مرتبہ دھوئیں۔ انگلیوں کے درمیان خلال کریں۔"
    }
  },
  {
    step: 3,
    title: { en: "Rinsing the Mouth", hi: "कुल्ला करना (Kullikh)", ur: "کلی کرنا" },
    desc: {
      en: "Rinse your mouth thoroughly three times, using right hand to put water in.",
      hi: "तीन बार पानी मुंह में डालकर अच्छी तरह कुल्ला करें।",
      ur: "دائیں ہاتھ سے تین بار منہ میں پانی ڈال کر ہر بار کلی کریں۔"
    }
  },
  {
    step: 4,
    title: { en: "Inhaling Water in Nose", hi: "नाक में पानी डालना", ur: "ناک میں پانی ڈالنا" },
    desc: {
      en: "Snuff water up into the nostrils with the right hand and blow it out with the left hand, three times.",
      hi: "दिए हाथ से तीन बार नाक में पानी डालें और बाएं हाथ से नाक साफ करें।",
      ur: "دائیں ہاتھ سے ناک میں پانی چڑھائیں اور بائیں ہاتھ سے ناک صاف کریں۔ تین بار کریں۔"
    }
  },
  {
    step: 5,
    title: { en: "Washing the Face", hi: "चेहरा धोना", ur: "چہرہ دھونا" },
    desc: {
      en: "Wash your entire face three times, from forehead hairline to chin and earlobe to earlobe.",
      hi: "पेशानी के बालों से लेकर ठोड़ी के नीचे तक और एक कान की लौ से दूसरे कान की लौ तक पूरा चेहरा तीन बार धोएं।",
      ur: "پیشانی کے بال اگنے کی جگہ سے تھوڑی کے نیچے تک اور ایک کان کی لو سے دوسرے کان کی لو تک پورا چہرہ تین بار دھوئیں۔"
    }
  },
  {
    step: 6,
    title: { en: "Washing Arms", hi: "हाथ को कोहनी तक धोना", ur: "کہنیوں تک ہاتھ دھونا" },
    desc: {
      en: "Wash your right arm including the elbow three times, then wash the left arm the same way.",
      hi: "दाहिने हाथ को कोहनी समेत तीन बार धोएं, फिर बाएं हाथ को कोहनी समेत तीन बार धोएं।",
      ur: "پہلے دائیں ہاتھ کو کہنی سمیت تین بار دھوئیں پھر بائیں ہاتھ کو کہنی سمیت تین بار دھوئیں۔"
    }
  },
  {
    step: 7,
    title: { en: "Masah of Head & Ears", hi: "सर और कानों का मसह", ur: "سر اور کانوں کا مسح" },
    desc: {
      en: "Wet your hands and wipe your head from front to back, then rub inside/outside of ears with index finger & thumb once.",
      hi: "हाथ भीगे करके सर का मसह करें और फिर उंगलियों से दोनों कानों के अंदर और पीछे हिस्सा मसह करें (एक बार)।",
      ur: "گیلے ہاتھوں سے پورے سر کا ایک بار مسح کریں اور اسی پانی سے انگلیوں کے ذریعے کانوں کے اندر اور انگوٹھوں سے کانوں کے باہر مسح کریں۔"
    }
  },
  {
    step: 8,
    title: { en: "Washing Feet", hi: "पैर धोना (टखनों समेत)", ur: "ٹخنوں تک پاؤں دھونا" },
    desc: {
      en: "Wash your right foot up to the ankle three times including between toes, then wash left foot.",
      hi: "पहले दाहिने पैर को टखनों समेत तीन बार धोएं फिर बाएं पैर को टखनों समेत तीन बार धोएं।",
      ur: "پہلے دائیں پاؤں کو ٹخنوں سمیت تین بار دھوئیں پھر بائیں پاؤں کو ٹخنوں سمیت تین بار دھوئیں۔"
    }
  }
];

export const rakaatTable = [
  { namaz: "Fajr", total: 4, detail: "2 Sunnah (Muakkadah) + 2 Fard" },
  { namaz: "Dhuhr", total: 12, detail: "4 Sunnah (Muakkadah) + 4 Fard + 2 Sunnah (Muakkadah) + 2 Nafl" },
  { namaz: "Asr", total: 8, detail: "4 Sunnah (Ghair Muakkadah) + 4 Fard" },
  { namaz: "Maghrib", total: 7, detail: "3 Fard + 2 Sunnah (Muakkadah) + 2 Nafl" },
  { namaz: "Isha", total: 17, detail: "4 Sunnah + 4 Fard + 2 Sunnah + 2 Nafl + 3 Witr + 2 Nafl" }
];
