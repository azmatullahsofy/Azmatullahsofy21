import React, { useState } from 'react';
import { BookOpen, Table, ShoppingBag, Eye, CheckCircle2, ChevronRight, ChevronLeft, Award, Compass, Sparkles, MapPin, Info, Clock } from 'lucide-react';
import { Language } from '../types';
import { translations } from '../translations';
import { wazuSteps, rakaatTable } from '../defaultData';

interface NamazGuideScreenProps {
  currentLanguage: Language;
}

export default function NamazGuideScreen(props: NamazGuideScreenProps) {
  const t = translations[props.currentLanguage];
  const [activeTab, setActiveTab] = useState<'wazu' | 'rakaat' | 'niyyat' | 'tariqa'>('wazu');
  const [currentWazuStep, setCurrentWazuStep] = useState(0);

  const [activeNiyyarPrayer, setActiveNiyyarPrayer] = useState<'fajr' | 'dhuhr' | 'asr' | 'maghrib' | 'isha'>('fajr');
  const [selectedSpecialPrayer, setSelectedSpecialPrayer] = useState<string>('tahajjud');

  const handleNextWazu = () => {
    if (currentWazuStep < wazuSteps.length - 1) {
      setCurrentWazuStep(prev => prev + 1);
    }
  };

  const handlePrevWazu = () => {
    if (currentWazuStep > 0) {
      setCurrentWazuStep(prev => prev - 1);
    }
  };

  // Special/Daily Prayers detailed data
  const specialPrayersData: Record<string, {
    title: string;
    sub: string;
    waqt: { hi: string; en: string };
    rakaat: { hi: string; en: string };
    niyyat: { hi: string; en: string };
    steps: { hi: string; en: string }[];
    notes: { hi: string; en: string };
  }> = {
    tahajjud: {
      title: "Tahajjud (तहज्जुद नमाज़)",
      sub: "Late Night Voluntary Prayer / रात की विशेष इबादत",
      waqt: {
        hi: "इशा के बाद, रात के आख़िरी हिस्से में पढ़ना सबसे अफ़ज़ल है (आधी रात के बाद)।",
        en: "Late night, after Isha and before Fajr. The last third of the night is highly preferred."
      },
      rakaat: {
        hi: "कम से कम 2 रकात और ज़्यादा से ज़्यादा 12 रकात (2-2 रकात करके)।",
        en: "Minimum of 2 Rakaats, maximum of 12 Rakaats (performed in pairs of 2)."
      },
      niyyat: {
        hi: "नियत की मैंने दो रकात नमाज़ नफ़िल तहज्जुद की, वास्ते अल्लाह तआला के, रुख मेरा काबा शरीफ की तरफ, अल्लाहु अकबर!",
        en: "I intend to perform 2 Rakaats Nafl of Tahajjud Prayer, for the sake of Allah, facing the Mubarak Kaabah, Allahu Akbar."
      },
      steps: [
        { hi: "वज़ू करके पाक-साफ़ जगह पर खड़े हों और दुनियावी ख्यालों को दिल से दूर करें।", en: "Perform wazu, find a clean spot, stand facing Kaabah with peace of mind." },
        { hi: "दिल में नियत करें और अल्लाहु अकबर कहते हुए हाथ कानों तक उठाकर नाफ़ के नीचे बांधें।", en: "Make your intention and raise hands to ears saying 'Allahu Akbar' and folder hands below navel." },
        { hi: "सना पढ़ें, फिर सूरह फ़ातिहा के बाद कोई भी सूरह (जैसे सूरह इखलास या अन्य) लंबी क़िराअत के साथ पढ़ें।", en: "Recite Sana (Subhanaka), Surah Fatiha, followed by another Surah with long, mindful recitation." },
        { hi: "रुकू और सज्दा पूरी सुकूँ के साथ अदा करें और तस्बीह आराम से कहें।", en: "Go to Ruku and Sajdah with complete calmness and focus, reciting the tasbihs gracefully." },
        { hi: "इसी प्रकार 2 रकात पूरी करके सलाम फेरें। आप जितनी बार चाहें, 2-2 करके रकात बढ़ा सकते हैं।", en: "Perform second Rakaat similarly and complete the prayer with Salaam. Repeat in units of 2 as desired." }
      ],
      notes: {
        hi: "तहज्जुद के बाद मांगी जाने वाली दुआएं यक़ीनन क़ुबूल होती हैं। यह अल्लाह से नज़दीकी का सबसे बेहतरीन ज़रिया है।",
        en: "Dua after Tahajjud is highly accepted by Almighty Allah. It represents the peak of spiritual devotion."
      }
    },
    tasbih: {
      title: "Salat-ul-Tasbih (सलातुल तस्बीह)",
      sub: "Prayer of Great Forgiveness / गुनाहों की माफ़ी की नमाज़",
      waqt: {
        hi: "मक़रूही वक़्तों (सूरज उगने, डूबने और ठीक दोपहर) को छोड़कर दिन या रात में कभी भी पढ़ी जा सकती है।",
        en: "Anytime during day or night, except during forbidden/makruh solar positions (sunrise, zawal, sunset)."
      },
      rakaat: {
        hi: "4 रकात (एक सलाम के साथ)। इसमें कुल 300 बार विशेष तस्बीह पढ़ी जाती है।",
        en: "4 Rakaats (with a single Salaam). Features a special Tasbih repeated 300 times overall."
      },
      niyyat: {
        hi: "नियत की मैंने चार रकात नमाज़ सलातुल तस्बीह की, वास्ते अल्लाह तआला के, रुख मेरा काबा शरीफ की तरफ, अल्लाहु अकबर!",
        en: "I intend to perform 4 Rakaats of Salat-ul-Tasbih, for the pleasure of Allah, facing the Holy Kaabah, Allahu Akbar."
      },
      steps: [
        { hi: "साना पढ़ने के बाद 15 बार यह तस्बीह पढ़ें: 'सुब्हानल्लाही वल-हम्दु लिल्लाही वला इलाहा इल्लल्लाहु वल्लाहु अकबर' ।", en: "After reciting Sana, recite 15 times: 'Subhanallahi Wal Hamdulillahi Wa La ilaha illallahu Wallahu Akbar'." },
        { hi: "अल्हम्दु शरीफ़ और सूरत पढ़ने के बाद (रुकू में जाने से पहले खड़े होकर) 10 बार यही तस्बीह पढ़ें।", en: "Recite Surah Fatiha and another Surah, then before going to Ruku, recite the Tasbih 10 times while standing." },
        { hi: "रुकू में जाकर सुब्हान रब्बियल अज़ीम कहने के बाद यही तस्बीह 10 बार पढ़ें।", en: "Go to Ruku, and after saying 'Subhana Rabbiyal Azeem', recite the Tasbih 10 times." },
        { hi: "रुकू से खड़े होकर (क़ौमा में) रब्बना लकल हम्द कहने के बाद यही तस्बीह 10 बार पढ़ें।", en: "Stand up from Ruku (Qaumah), say 'Rabbana Lakal Hamd', then recite the Tasbih 10 times." },
        { hi: "पहले सज्दे में सुब्हान रब्बियल आला कहने के बाद यही तस्बीह 10 बार पढ़ें।", en: "Perform first Sajdah, and after 'Subhana Rabbiyal A'la', recite the Tasbih 10 times." },
        { hi: "पहले सज्दे से उठकर बैठने की हालत में (जल्सा में) यही तस्बीह 10 बार पढ़ें।", en: "Sit up from the first Sajdah (Jalsah), and recite the Tasbih 10 times." },
        { hi: "दूसरे सज्दे में सुब्हान रब्बियल आला कहने के बाद यही तस्बीह 10 बार पढ़ें। इस प्रकार एक रकात में कुल 75 बार तस्बीह हुई। चारों रकात मिलकर 300 बार होगी।", en: "Perform second Sajdah, and after its tasbih, recite the Tasbih 10 times. This forms 75 Tasbihs per Rakaat." }
      ],
      notes: {
        hi: "यह नमाज़ ज़िंदगी में एक बार ज़रूर पढ़नी चाहिए। इससे तमाम सगीरा व कबीरा गुनाह माफ़ हो जाते हैं।",
        en: "This prayer is highly recommended to be performed once in a lifetime, weekly, or of course whenever in need of deep forgiveness."
      }
    },
    fitr: {
      title: "Eid-ul-Fitr (ईद उल फ़ित्र नमाज़)",
      sub: "Celebration Prayer of Ramadan / रमज़ान ईद की नमाज़",
      waqt: {
        hi: "ईद के दिन सुबह सूरज निकलने के लगभग 20 मिनट बाद (शव्वाल की पहली तारीख)।",
        en: "On the morning of 1st Shawwal, approximately 15-20 minutes after sunrise."
      },
      rakaat: {
        hi: "2 रकात वाजिब (6 ज़ायद यानी अतिरिक्त तकबीरों के साथ)।",
        en: "2 Rakaats Wajib (with 6 additional/extra Takbeers)."
      },
      niyyat: {
        hi: "नियत की मैंने दो रकात नमाज़ ईद-उल-फ़ित्र वाजिब मय छह ज़ायद तकबीरों के, पीछे इस इमाम के, रुख मेरा काबा शरीफ की तरफ, अल्लाहु अकबर!",
        en: "I intend to perform 2 Rakaats Wajib of Eid-ul-Fitr with 6 extra Takbeers, behind this Imam, facing the Mubarak Kaabah, Allahu Akbar."
      },
      steps: [
        { hi: "इमाम के पीछे खड़े होकर नीयत बांधें। तकबीर-ए-तहरीमा कहकर हाथ बांधें और 'सना' पढ़ें।", en: "Stand behind the Imam, say first Takbeer 'Allahu Akbar', fold hands, and recite Sana." },
        { hi: "इमाम साहब तीन तकबीर कहेंगे। पहली दो तकबीरों में हाथ कानों तक उठाकर नीचे छोड़ देने हैं। तीसरी तकबीर के बाद हाथ बांध लेने हैं।", en: "The Imam will say 3 extra Takbeers. For first 2, raise hands to ears and drop them. For 3rd, raise and fold hands." },
        { hi: "इसके बाद सूरह फ़ातिहा और अन्य सूरह पढ़ी जाएगी। फिर रुकू और सज्दे करके दूसरी रकात के लिए खड़े होंगे।", en: "Now the Imam will recite Surah Fatiha and a Surah. We then go to Ruku and Sajdah, and stand for the 2nd Rakaat." },
        { hi: "दूसरी रकात में पहले इमाम साहब क़िराअत पूरी करेंगे (सूरह फ़ातिहा व सूरत)।", en: "In the 2nd Rakaat, first the Imam will complete his recitations (Fatiha and Surah)." },
        { hi: "रुकू में जाने से पहले इमाम साहब दोबारा 3 तकबीर कहेंगे। तीनों में हाथ उठाकर छोड़ देने हैं।", en: "Before going to Ruku, the Imam will say 3 extra Takbeers. For all three, raise hands to ears and drop them." },
        { hi: "चौथी तकबीर पर बिना हाथ उठाए सीधे रुकू में जाना है और बाकी नमाज़ आम तौर पर पूरी करनी है।", en: "At the 4th Takbeer, go straight into Ruku without raising hands, and complete the prayer with your Salaam." }
      ],
      notes: {
        hi: "नमाज़ पूरी होने के बाद इमाम साहब का ख़ुत्बा सुनना बेहद ज़रूरी (वाजिब) है। नमाज़ के बाद एक-दूसरे को ईद की मुबारकबाद दें।",
        en: "Listening to the sermon (Khutbah) after the Eid prayer is highly mandatory (Wajib). Celebrate with greetings afterward!"
      }
    },
    adha: {
      title: "Eid-ul-Adha (ईद उल अज़हा नमाज़)",
      sub: "Feast of Sacrifice Prayer / बकरा ईद की नमाज़",
      waqt: {
        hi: "10 ज़ुल-हिज्जाह की सुबह सूरज निकलने के बाद (कुर्बानी से पहले)।",
        en: "On the morning of 10th Dhul-Hijjah after sunrise, prior to any slaughtering activities."
      },
      rakaat: {
        hi: "2 रकात वाजिब (6 ज़ायद यानी अतिरिक्त तकबीरों के साथ)।",
        en: "2 Rakaats Wajib (with 6 extra Takbeers, same format as Eid-ul-Fitr)."
      },
      niyyat: {
        hi: "नियत की मैंने दो रकात नमाज़ ईद-उल-अज़हा वाजिब मय छह ज़ायद तकबीरों के, पीछे इस इमाम के, रुख मेरा काबा शरीफ की तरफ, अल्लाहु अकबर!",
        en: "I intend to perform 2 Rakaats Wajib of Eid-ul-Adha with 6 extra Takbeers, behind this Imam, facing the Mubarak Kaabah, Allahu Akbar."
      },
      steps: [
        { hi: "नमाज़ का तरीका बिल्कुल ईद-उल-फ़ित्र की तरह ही दो रकात का है।", en: "The entire ritual and 6 extra Takbeers are identical to the Eid-ul-Fitr prayer." },
        { hi: "पहली रकात में सना के बाद 3 तकबीर (दोनो में हाथ छोड़ें, तीसरे में बांधें)।", en: "First Rakaat: Sana, then 3 extra Takbeers (drop, drop, fold)." },
        { hi: "दूसरी रकात में पहले क़िराअत पूरी होगी, फिर रुकू से पहले 3 तकबीर (तीनों में हाथ छोड़ें) और चौथी पर हाथ उठाए बिना सीधे रुकू में जाएं।", en: "Second Rakaat: Recitation first, followed by 3 extra Takbeers (drop, drop, drop), and then 4th Takbeer goes directly to Ruku." }
      ],
      notes: {
        hi: "नमाज़ के बाद ईद-उल-अज़हा का ख़ास अरबी ख़ुत्बा सुनना वाजिब है। इसके बाद तकबीर-ए-तशरीक़ ऊंची आवाज़ में पढ़ना सुन्नत है।",
        en: "Post-prayer Arabic Khutbah is Wajib. Reciting Takbeer-e-Tashreeq loudly during these days is a Sunnah."
      }
    },
    witr: {
      title: "Witr (वित्र नमाज़)",
      sub: "Night Wajib Prayer / दुआ-ए-क़ुनूत वाली नमाज़",
      waqt: {
        hi: "इशा की नमाज़ के बाद इसके फ़र्ज़ और सुन्नतों के बाद पढ़ा जाता है।",
        en: "Performed after the Fard and Sunnah units of the Isha prayer."
      },
      rakaat: {
        hi: "3 रकात वाजिब (एक सलाम के साथ, तीसरी रकात में दुआ-ए-क़ुनूत पढ़ा जाता है)।",
        en: "3 Rakaats Wajib (all in one Salaam, featuring Dua-e-Qunoot in the final 3rd Rakaat)."
      },
      niyyat: {
        hi: "नियत की मैंने तीन रकात नमाज़ वाजिब वित्र की, वास्ते अल्लाह तआला के, रुख मेरा काबा शरीफ की तरफ, अल्लाहु अकबर!",
        en: "I intend to perform 3 Rakaats Wajib of Witr Prayer, for the sake of Allah, facing the Holy Kaabah, Allahu Akbar."
      },
      steps: [
        { hi: "पहली दो रकात साधारण नमाज़ की तरह अल्हम्दु शरीफ़ और सूरह मिलाकर पढ़ें।", en: "Perform first two Rakaats like normal prayers, reciting both Surah Fatiha and an accompanying Surah." },
        { hi: "दूसरे रकात के सजदों के बाद क़ादा में बैठकर सिर्फ़ अत्तहिय्यात ('तशह्हुद') पढ़ें और खड़े हो जाएं।", en: "Sit in Qadah after the 2nd Rakaat, recite Tashahhud (Attahiyyat) only, then stand up for the 3rd Rakaat." },
        { hi: "तीसरी रकात में खड़े होकर सूरह फ़ातिहा और कोई सूरह मिलाकर पढ़ें।", en: "In the 3rd Rakaat, while standing, recite Surah Fatiha and a Surah." },
        { hi: "सूरह के फ़ौरन बाद रुकू में जाने के बजाए 'अल्लाहु अकबर' कहते हुए हाथ कानों तक उठाएं और वापस नाफ़ के नीचे बांध लें।", en: "Instead of going to Ruku after the Surah, say 'Allahu Akbar' raising hands to the ears, and refold them below navel." },
        { hi: "अब खड़े-खड़े 'दुआ-ए-क़ुनूत' पढ़ें। इसके बाद अल्लाहू अकबर कहकर रुकू में जाएं और सामान्य तरीक़े से नमाज़ पूरी करें।", en: "Recite 'Dua-e-Qunoot' now. After completing the Dua, say 'Allahu Akbar' to go to Ruku and finish the slots." }
      ],
      notes: {
        hi: "यदि किसी को दुआ-ए-क़ुनूत याद न हो, तो वह आसान दुआ 'रब्बना आतिना फ़िद्दुनिया...' या 'अल्लाहुम्मग फिर्ली' पढ़ सकता है।",
        en: "If you don't remember Dua-e-Qunoot by heart, you can substitute it with 'Rabbana Atina Fiddunya...' or 'Allahummagh-firli' 3 times."
      }
    },
    janaza: {
      title: "Janaza (जनाज़ा नमाज़)",
      sub: "Funeral Intercession Prayer / मय्यत की दुआ",
      waqt: {
        hi: "मृत्यु के बाद कफ़न पहनाकर दफ़नाने से पहले (यह गुनाहों की माफ़ी की इज्तेमाई दुआ है)।",
        en: "After shroud wrapping, before burial. A collective standing petition for the deceased."
      },
      rakaat: {
        hi: "कोई रकात नहीं होती, कोई रुकू और सज्दा नहीं होता। केवल 4 तकबीरें खड़ी हालत में होती हैं।",
        en: "No Rakaats, no Ruku, and no Sajdah. Performed entirely in a standing posture with 4 Takbeers."
      },
      niyyat: {
        hi: "नियत की मैंने नमाज़-ए-जनाज़ा फर्ज़-ए-किफ़ाया की, चार तकबीरों के साथ, वास्ते अल्लाह तआला के, दुआ इस मय्यत के लिए, पीछे इस इमाम के, रुख मेरा काबा शरीफ़ की तरफ, अल्लाहु अकबर!",
        en: "I intend to perform the Funeral Prayer (Fard Kifayah) with 4 Takbeers, behind this Imam, praying for this deceased, facing the Kaabah, Allahu Akbar."
      },
      steps: [
        { hi: "इस्तेमाई सफ़ों में सीधे खड़े होकर दिल में नियत करें। पहली तकबीर के बाद हाथ बांधें और 'सना' पढ़ें ( वय जल्ला सनाउका के साथ)।", en: "Stand in rows and make Niyyah. After the 1st Takbeer, fold hands and recite Sana (adding: 'Wa Jalla Thana'uk')." },
        { hi: "दूसरी तकबीर (अल्लाहू अकबर) सुनने के बाद हाथ नहीं उठाने और न ही बांधने की जगह बदलनी है, सीधे 'दरूद-ए-इब्राहिमी' पढ़ें।", en: "On the 2nd Takbeer, without raising your hands, recite 'Durood-e-Ibrahimi' (the Abrahamic blessing)." },
        { hi: "तीसरी तकबीर के बाद मय्यत के मगफिरत की जनाज़ा दुआ (बालिग या नाबालिग दुआ) आहिस्ता से पढ़ें।", en: "On the 3rd Takbeer, without raising hands, calmly recite the appropriate Funeral Dua for the deceased." },
        { hi: "चौथी तकबीर के बाद इमाम साहब दोनों तरफ़ सलाम फेरेंगे। इसके साथ आप भी सलाम फेरें और जनाज़ा मुकम्मल हो जाएगा।", en: "On the 4th Takbeer, the Imam will turn for Salaam on both sides. Turn with him to conclude the prayer." }
      ],
      notes: {
        hi: "यह फ़र्ज़-ए-किफ़ाया है। अगर गाँव या मोहल्ले के कुछ लोग इसे पढ़ लें, तो सब ज़िम्मेदारी से बरी हो जाते हैं अन्यथ सब पर गुनाह रहता है।",
        en: "Janaza is Fard al-Kifayah (communal obligation). If some members perform it, the obligation is lifted for the whole community."
      }
    },
    sunnat: {
      title: "Sunnat (सुन्नत नमाज़)",
      sub: "Established Sunnah Devotion / सुन्नत-ए-मुअक्कदा व ग़ैर मुअक्कदा",
      waqt: {
        hi: "दैनिक फ़र्ज़ नमाज़ों के आगे या पीछे (जैसे ज़ुहर के फ़र्ज़ से पहले 4 सुन्नतें)।",
        en: "Preceding or following the daily obligatory Fard prayers."
      },
      rakaat: {
        hi: "2 या 4 रकात (पूरी रकातों में सूरह मिलाना ज़रूरी है)।",
        en: "2 or 4 Rakaats. Surah recitation is mandatory in all compiled units."
      },
      niyyat: {
        hi: "नियत की मैंने दो रकात नमाज़ सुन्नत रसूलुल्लाह की, वक़्त (फ़ज्र/ज़ुहर...) का, वास्ते अल्लाह तआला के, रुख मेरा काबा शरीफ़ की तरफ, अल्लाहु अकबर!",
        en: "I intend to perform 2 Rakaats Sunnah of Rasulullah (PBUH), for the time (...), facing the Holy Kaabah, Allahu Akbar."
      },
      steps: [
        { hi: "सुन्नत नमाज़ की सबसे महत्वपूर्ण ख़ास बात यह है कि इसकी हर एक रकात में सूरह फ़ातिहा के साथ सूरह मिलाना लाज़िमी (ज़रूरी) है।", en: "Unlike the latter units of Fard, in all Rakaats of Sunnah, reciting a Surah alongside Surah Fatiha is mandatory." },
        { hi: "रुकू, सज्दा और बैठने की प्रक्रिया (क़ादा) दैनिक फ़र्ज़ नमाज़ों की तरह सुखद ढंग से पूरी की जाती है।", en: "Follow standard movements (Ruku, Sajdah, sitting in Qadah) with proper calmness." }
      ],
      notes: {
        hi: "सुन्नत-ए-मुअक्कदा (जैसे फज्र की सुन्नत) रसूलुल्लाह की मज़बूत सुन्नत है, इसे कभी भी जानबूझकर नहीं छोड़ना चाहिए।",
        en: "Sunnah Mu'akkadah are highly emphasized Sunnah practices. Willfully neglecting them habitually is sinful."
      }
    },
    nafil: {
      title: "Nafil (नफ़िल नमाज़)",
      sub: "Voluntary High-Reward Prayer / मर्जी की इबादत",
      waqt: {
        hi: "मक़रूही वक़्तों को छोड़कर, दिन या रात के किसी भी मुकाम पर पढ़ी जा सकती है।",
        en: "Anytime during day or night, except during the forbidden makruh interval periods."
      },
      rakaat: {
        hi: "कम से कम 2 रकात (रकात का जोड़ा बनाकर पढ़ सकते हैं)।",
        en: "Minimum of 2 Rakaats (usually performed in pairs of two)."
      },
      niyyat: {
        hi: "नियत की मैंने दो रकात नमाज़ नफ़िल की, वास्ते अल्लाह तआला के, रुख मेरा काबा शरीफ़ की तरफ, अल्लाहु अकबर!",
        en: "I intend to perform 2 Rakaats of voluntary Nafl prayer, facing the Mubarak Kaabah, Allahu Akbar."
      },
      steps: [
        { hi: "नफ़िल नमाज़ बिल्कुल सुन्नत नमाज़ की तरह ही अदा की जाती है।", en: "The Nafl prayer is performed in the exact same format as the voluntary Sunnah prayer." },
        { hi: "इसकी भी तमाम रकातों में सूरह फ़ातिहा के बाद कोई अन्य सूरह मिलाना लाज़िमी होता है।", en: "A supplementary Surah must be recited alongside Surah Fatiha in every single Rakaat." }
      ],
      notes: {
        hi: "नफ़िल नमाज़ अल्लाह का विशेष स्नेह हासिल करने और फ़र्ज़ नमाज़ों में हुई मामूली कमियों की भरपाई करने में मदद करती है।",
        en: "Nafl prayers help gain closer affinity to Allah and compensate for minor shortcomings in obligatory Fard prayers."
      }
    },
    chast: {
      title: "Chast / Ishraq (चाश्त नमाज़)",
      sub: "Forenoon Blessings Prayer / सुबह की बरकत वाली नमाज़",
      waqt: {
        hi: "सूरज निकलने के लगभग 1.5 से 2 घंटे बाद (सुबह 8:30 बजे से दोपहर 11:30 बजे के बीच)।",
        en: "Mid-morning, around 1.5 to 2 hours after sunrise (generally between 8:30 AM and 11:30 AM)."
      },
      rakaat: {
        hi: "2 से 12 रकात (सबसे अफ़ज़ल 4 या 8 रकात पढ़ना है, दो-दो रकात करके)।",
        en: "2 to 12 Rakaats (typically performed as 4 or 8 units in pairs of 2)."
      },
      niyyat: {
        hi: "नियत की मैंने दो रकात नमाज़ नफ़िल चाश्त की, वास्ते अल्लाह तआला के, रुख मेरा काबा शरीफ की तरफ, अल्लाहु अकबर!",
        en: "I intend to perform 2 Rakaats Nafl of Duha/Chast Prayer, for the sake of Allah, facing the Kaabah, Allahu Akbar."
      },
      steps: [
        { hi: "साफ़-सुथरे वज़ू के साथ सुबह के समय खड़े हों।", en: "Perform fresh wazu and stand patiently in your pray area." },
        { hi: "हाथ बांधकर सना, सूरह फ़ातिहा और कोई भी छोटी या बड़ी सूरत मिलाएँ।", en: "Fold hands, recite Sana, Surah Fatiha followed by any Surah of your choice." },
        { hi: "सज्दों और रुकू को पूरे हुज़ूर-ए-क़ल्ब (मन लगाकर) के साथ अदा करें और तशह्हुद पढ़कर सलाम फेरें।", en: "Complete both Rakaats with beautiful heart and attention, offer Salaam, and repeat or close." }
      ],
      notes: {
        hi: "हदीस-ए-पाक के मुताबिक़ चाश्त की नमाज़ बन्दों के तमाम जोड़ों का सदक़ा अदा करती है और इससे रिज़क़ में असीम बरकत होती है।",
        en: "Prophetic traditions mention that the Chast (Duha) prayer serves as charity for all joints of the body and boosts daily sustenance."
      }
    }
  };

  // Niyyat texts
  const niyyatFormulas = {
    fajr: {
      en: "I intend to perform 2 Rakaats Fard of Fajr Prayer, facing the Mubarak Kaabah, for the pleasure of Allah. (Allahu Akbar)",
      hi: "नियत की मैंने दो रकात नमाज़ फर्ज फज्र की, वास्ते अल्लाह तआला के, रुख मेरा काबा शरीफ की तरफ। (अल्लाहु अकबर)",
      ur: "نیت کی میں نے دو رکعات نماز فرض فجر کی، واسطے اللہ تعالیٰ کے، رخ میرا کعبہ شریف کی طرف۔ (اللہ اکبر)"
    },
    dhuhr: {
      en: "I intend to perform 4 Rakaats Fard of Dhuhr Prayer, facing the Mubarak Kaabah, for the pleasure of Allah. (Allahu Akbar)",
      hi: "नियत की मैंने चार रकात नमाज़ फर्ज जुहर की, वास्ते अल्लाह तआला के, रुख मेरा काबा शरीफ की तरफ। (अल्लाहु अकबर)",
      ur: "نیت کی میں نے چار رکعات نماز فرض ظہر کی، واسطے اللہ تعالیٰ کے، رخ میرا کعبہ شریف کی طرف۔ (اللہ اکبر)"
    },
    asr: {
      en: "I intend to perform 4 Rakaats Fard of Asr Prayer, facing the Mubarak Kaabah, for the pleasure of Allah. (Allahu Akbar)",
      hi: "नियत की मैंने चार रकात नमाज़ फर्ज असर की, वास्ते अल्लाह तआला के, रुख मेरा काबा शरीफ की तरफ। (अल्लाहु अकबर)",
      ur: "نیت کی میں نے چار رکعات نماز فرض عصر کی، واسطے اللہ تعالیٰ کے، رخ میرا کعبہ شریف کی طرف۔ (اللہ اکبر)"
    },
    maghrib: {
      en: "I intend to perform 3 Rakaats Fard of Maghrib Prayer, facing the Mubarak Kaabah, for the pleasure of Allah. (Allahu Akbar)",
      hi: "नियत की मैंने तीन रकात नमाज़ फर्ज मगरिब की, वास्ते अल्लाह तआला के, रुख मेरा काबा शरीफ की तरफ। (अल्लाहु अकबर)",
      ur: "نیت کی میں نے تین رکعات نماز فرض مغرب کی، واسطے اللہ تعالیٰ کے، رخ میرا کعبہ شریف کی طرف۔ (اللہ اکبر)"
    },
    isha: {
      en: "I intend to perform 4 Rakaats Fard of Isha Prayer, facing the Mubarak Kaabah, for the pleasure of Allah. (Allahu Akbar)",
      hi: "नियत की मैंने चार रकात नमाज़ फर्ज इशा की, वास्ते अल्लाह तआला के, रुख मेरा काबा शरीफ की तरफ। (अल्लाहु अकबर)",
      ur: "نیت کی میں نے چار رکعات نماز فرض عشاء کی، واسطے اللہ تعالیٰ کے، رخ میرا کعبہ شریف کی طرف۔ (اللہ اکبر)"
    }
  };

  return (
    <div className="w-full max-w-md mx-auto p-4 pb-20">
      
      {/* Tab selectors for educational guide */}
      <div className="grid grid-cols-4 bg-white rounded-3xl p-1 mb-6 border border-gray-100 card-shadow gap-1 text-[11px]">
        <button
          onClick={() => setActiveTab('wazu')}
          className={`py-2.5 px-0.5 text-center text-[10px] sm:text-xs font-extrabold rounded-2xl transition-all duration-300 flex flex-col items-center justify-center gap-1 leading-none ${
            activeTab === 'wazu'
              ? 'bg-emerald-800 text-white shadow-sm'
              : 'text-slate-500 hover:text-slate-800'
          }`}
        >
          <Award className="w-4 h-4 text-amber-500 shrink-0" />
          <span>Wazu</span>
        </button>
        
        <button
          onClick={() => setActiveTab('rakaat')}
          className={`py-2.5 px-0.5 text-center text-[10px] sm:text-xs font-extrabold rounded-2xl transition-all duration-300 flex flex-col items-center justify-center gap-1 leading-none ${
            activeTab === 'rakaat'
              ? 'bg-emerald-800 text-white shadow-sm'
              : 'text-slate-500 hover:text-slate-800'
          }`}
        >
          <Table className="w-4 h-4 text-amber-500 shrink-0" />
          <span>{t.prayerMethod.replace(" Method", "")}</span>
        </button>

        <button
          onClick={() => setActiveTab('niyyat')}
          className={`py-2.5 px-0.5 text-center text-[10px] sm:text-xs font-extrabold rounded-2xl transition-all duration-300 flex flex-col items-center justify-center gap-1 leading-none ${
            activeTab === 'niyyat'
              ? 'bg-emerald-800 text-white shadow-sm'
              : 'text-slate-500 hover:text-slate-800'
          }`}
        >
          <BookOpen className="w-4 h-4 text-amber-500 shrink-0" />
          <span>Niyyat</span>
        </button>

        <button
          onClick={() => setActiveTab('tariqa')}
          className={`py-2.5 px-0.5 text-center text-[10px] sm:text-xs font-extrabold rounded-2xl transition-all duration-305 flex flex-col items-center justify-center gap-1 leading-none ${
            activeTab === 'tariqa'
              ? 'bg-emerald-800 text-white shadow-sm'
              : 'text-slate-500 hover:text-slate-800'
          }`}
        >
          <Compass className="w-4 h-4 text-amber-500 shrink-0" />
          <span>Tarika</span>
        </button>
      </div>

      {/* 1. INTERACTIVE WAZU DISCOVERS */}
      {activeTab === 'wazu' && (
        <div className="bg-white rounded-3xl border border-gray-100 card-shadow p-6 flex flex-col gap-4 text-center">
          <div className="flex justify-between items-center text-xs font-mono text-slate-400 border-b border-slate-100 pb-3">
            <span>STEP-BY-STEP ABLUTION TUTORIAL</span>
            <span className="font-bold text-emerald-800">{currentWazuStep + 1} / {wazuSteps.length}</span>
          </div>

          {/* Graphical Step Circle */}
          <div className="my-3 mx-auto w-24 h-24 rounded-full bg-emerald-50 border-4 border-emerald-500/20 flex items-center justify-center text-4xl shadow-inner relative">
            <span className="font-extrabold text-emerald-800 tracking-tighter">
              {wazuSteps[currentWazuStep].step}
            </span>
            <div className="absolute w-full h-full rounded-full border border-dashed border-emerald-500 animate-spin [animation-duration:10s]"></div>
          </div>

          <h3 className="text-lg font-bold text-emerald-950 mt-1">
            {wazuSteps[currentWazuStep].title[props.currentLanguage]}
          </h3>

          <p className="text-slate-650 text-sm leading-relaxed max-w-xs mx-auto pb-6">
            {wazuSteps[currentWazuStep].desc[props.currentLanguage]}
          </p>

          {/* Steps Control Slider Buttons */}
          <div className="flex items-center gap-3 border-t border-slate-100 pt-5">
            <button
              onClick={handlePrevWazu}
              disabled={currentWazuStep === 0}
              className={`flex-1 flex items-center justify-center gap-1.5 py-3 rounded-2xl text-xs font-bold transition-all border ${
                currentWazuStep === 0
                  ? 'bg-slate-50 text-slate-300 border-slate-100 cursor-not-allowed'
                  : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
              }`}
            >
              <ChevronLeft className="w-4 h-4" />
              Previous
            </button>
            <button
              onClick={handleNextWazu}
              disabled={currentWazuStep === wazuSteps.length - 1}
              className={`flex-1 flex items-center justify-center gap-1.5 py-3 rounded-2xl text-xs font-bold transition-all border ${
                currentWazuStep === wazuSteps.length - 1
                  ? 'bg-emerald-50/70 text-emerald-800 border-emerald-100 font-extrabold font-mono uppercase'
                  : 'bg-emerald-800 text-white border-emerald-800 hover:bg-emerald-950'
              }`}
            >
              <span>{currentWazuStep === wazuSteps.length - 1 ? "Completed" : "Next Step"}</span>
              {currentWazuStep !== wazuSteps.length - 1 && <ChevronRight className="w-4 h-4" />}
            </button>
          </div>
        </div>
      )}

      {/* 2. RAKAAT CHART TABLE */}
      {activeTab === 'rakaat' && (
        <div className="bg-white rounded-3xl border border-gray-100 card-shadow p-5">
          <div className="flex items-center gap-2 mb-4 text-emerald-900 border-b border-gray-100 pb-3">
            <Table className="w-5 h-5 text-emerald-700" />
            <h3 className="text-[14px] font-bold">5 Daily Fard & Sunnah Rakaat Table</h3>
          </div>

          <div className="flex flex-col gap-3">
            {rakaatTable.map((row) => (
              <div 
                key={row.namaz}
                className="flex flex-col gap-1.5 p-3.5 bg-slate-50 rounded-2xl border border-slate-200/40 text-left"
              >
                <div className="flex justify-between items-center">
                  <span className="text-sm font-extrabold text-slate-900 font-mono tracking-wide">
                    {row.namaz} Prayer
                  </span>
                  <span className="bg-emerald-100 text-emerald-900 text-[10px] font-mono font-bold px-3 py-1 rounded-full border border-emerald-200">
                    {row.total} Rakaat Total
                  </span>
                </div>
                <p className="text-xs text-slate-500 font-medium bg-white p-2 border border-slate-100 rounded-xl mt-1">
                  <strong>Standard Division:</strong> {row.detail}
                </p>
              </div>
            ))}
          </div>

          <div className="mt-5 p-4 bg-emerald-50/40 rounded-2xl border border-emerald-100 text-[11px] text-slate-500 italic text-left">
            * Note: Witr (3 Rakaat) in Isha prayer is strictly Wajib, and Muakkadah sunnahs are highly recommended to establish strong reward patterns.
          </div>
        </div>
      )}

      {/* 3. NIYYAT FORMULA INTENTION */}
      {activeTab === 'niyyat' && (
        <div className="bg-white rounded-3xl border border-gray-100 card-shadow p-5 flex flex-col gap-4 text-left">
          <div>
            <h3 className="text-[14px] font-bold text-slate-800 mb-1">Niyyat Formulations (नीयत का तरीक़ा)</h3>
            <p className="text-[10px] text-slate-400">Select any prayer below to review the precise bilingual intention format:</p>
          </div>

          {/* Selector pills */}
          <div className="flex gap-1 overflow-x-auto pb-1.5 scrollbar-thin">
            {(['fajr', 'dhuhr', 'asr', 'maghrib', 'isha'] as const).map((p) => (
              <button
                key={p}
                onClick={() => setActiveNiyyarPrayer(p)}
                className={`py-1.5 px-3.5 rounded-xl text-[10px] font-bold uppercase tracking-wider shrink-0 border transition-all duration-300 ${
                  activeNiyyarPrayer === p
                    ? 'bg-amber-400 text-emerald-950 border-amber-400 shadow-sm'
                    : 'bg-slate-50 text-slate-500 border-slate-200'
                }`}
              >
                {p}
              </button>
            ))}
          </div>

          {/* Intention formulas display paper */}
          <div className="bg-amber-50/40 border border-amber-200/50 p-5 rounded-2xl flex flex-col gap-3 relative">
            <div className="absolute top-3 right-3 text-[10px] font-bold font-mono text-amber-700/60 leading-none">
              NIYYAH PAPER
            </div>
            
            <div className="flex flex-col gap-1">
              <span className="text-[9px] text-amber-700 font-extrabold uppercase font-mono tracking-widest block">Urdu Nastalikh Script</span>
              <p className="text-sm font-semibold text-slate-900 leading-relaxed font-arabic" dir="rtl">
                {niyyatFormulas[activeNiyyarPrayer].ur}
              </p>
            </div>

            <div className="border-t border-slate-200/40 my-1"></div>

            <div className="flex flex-col gap-1">
              <span className="text-[9px] text-amber-700 font-extrabold uppercase font-mono tracking-widest block">Hindi Devanagari Script</span>
              <p className="text-xs font-semibold text-slate-700 leading-relaxed">
                {niyyatFormulas[activeNiyyarPrayer].hi}
              </p>
            </div>

            <div className="border-t border-slate-200/40 my-1"></div>

            <div className="flex flex-col gap-1">
              <span className="text-[9px] text-amber-700 font-extrabold uppercase font-mono tracking-widest block">English Transliteration</span>
              <p className="text-xs text-slate-600 font-mono leading-relaxed">
                {niyyatFormulas[activeNiyyarPrayer].en}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* 4. NAMAZ KA TARIQA HANDBOOK WIDGET */}
      {activeTab === 'tariqa' && (
        <div className="flex flex-col gap-5 text-left">
          {/* Quick instructions panel header */}
          <div className="bg-emerald-950 text-white rounded-3xl p-5 card-shadow relative overflow-hidden bg-islamic-pattern">
            <div className="absolute right-0 bottom-0 opacity-10 pointer-events-none transform translate-y-3 translate-x-3">
              <Sparkles className="w-24 h-24 text-amber-400" />
            </div>
            <div className="flex items-center gap-2 mb-2">
              <Sparkles className="w-5 h-5 text-amber-300" />
              <h3 className="text-xs font-black tracking-widest uppercase font-mono text-amber-300">
                Special Prayers & Sunnah Guide (नमाज़ का तरीक़ा)
              </h3>
            </div>
            <p className="text-xs text-slate-200 leading-relaxed font-medium">
              यहाँ आपको तहज्जुद, सलातुल तस्बीह, ईदैन, जनाजा, वित्र समेत समस्त सुन्नत व नफ़िल नमाज़ों की मुकम्मल जानकारी मिलेगी।
            </p>
          </div>

          {/* Selector pills list for special prayers */}
          <div className="flex gap-1.5 overflow-x-auto pb-2 scrollbar-thin">
            {[
              { id: 'tahajjud', name: 'तहज्जुद', label: 'Tahajjud' },
              { id: 'tasbih', name: 'सलात-उल-तस्बीह', label: 'Tasbih' },
              { id: 'fitr', name: 'ईद-उल-फ़ित्र', label: 'Eid Fitr' },
              { id: 'adha', name: 'ईद-उल-अज़हा', label: 'Eid Adha' },
              { id: 'witr', name: 'वित्र', label: 'Witr' },
              { id: 'janaza', name: 'जनाज़ा', label: 'Janaza' },
              { id: 'sunnat', name: 'सुन्नत', label: 'Sunnah' },
              { id: 'nafil', name: 'नफ़िल', label: 'Nafl' },
              { id: 'chast', name: 'चाश्त / इश्राक़', label: 'Duha/Chast' }
            ].map((p) => {
              const isSelected = selectedSpecialPrayer === p.id;
              return (
                <button
                  key={p.id}
                  onClick={() => setSelectedSpecialPrayer(p.id)}
                  className={`py-2 px-3.5 rounded-2xl text-xs font-bold shrink-0 border transition-all duration-300 flex flex-col items-start gap-0.5 ${
                    isSelected
                      ? 'bg-emerald-800 text-white border-emerald-800 shadow-md ring-2 ring-emerald-500/20'
                      : 'bg-white text-slate-600 border-slate-200/60 hover:bg-slate-50'
                  }`}
                >
                  <span className="text-[9px] font-extrabold uppercase tracking-wider font-mono opacity-80">{p.label}</span>
                  <span className="text-[11px] font-sans font-bold leading-none">{p.name}</span>
                </button>
              );
            })}
          </div>

          {/* Main Visual Booklet Display */}
          {selectedSpecialPrayer && specialPrayersData[selectedSpecialPrayer] && (
            <div className="bg-white rounded-3xl border border-gray-150 card-shadow p-5 flex flex-col gap-4">
              {/* Header Title */}
              <div className="border-b border-gray-100 pb-3">
                <span className="text-[9px] text-emerald-800 font-extrabold uppercase font-mono tracking-widest block mb-1">
                  PRAYER BOOKLET
                </span>
                <h4 className="text-base font-black text-slate-900 tracking-tight">
                  {specialPrayersData[selectedSpecialPrayer].title}
                </h4>
                <p className="text-xs text-slate-400 font-bold font-mono">
                  {specialPrayersData[selectedSpecialPrayer].sub}
                </p>
              </div>

              {/* Timing and Rakaat Info Matrix */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-200/40 text-left">
                  <div className="flex items-center gap-1.5 text-[10px] text-emerald-800 font-extrabold uppercase tracking-wider font-mono mb-1">
                    <Clock className="w-3.5 h-3.5 text-emerald-600" />
                    <span>TIMING (वक़्त)</span>
                  </div>
                  <p className="text-xs font-bold text-slate-800 leading-snug">
                    {specialPrayersData[selectedSpecialPrayer].waqt.hi}
                  </p>
                  <p className="text-[10px] text-slate-500 font-medium italic mt-1 font-mono">
                    {specialPrayersData[selectedSpecialPrayer].waqt.en}
                  </p>
                </div>

                <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-200/40 text-left">
                  <div className="flex items-center gap-1.5 text-[10px] text-emerald-800 font-extrabold uppercase tracking-wider font-mono mb-1">
                    <Table className="w-3.5 h-3.5 text-emerald-600" />
                    <span>RAKAAT (रकात)</span>
                  </div>
                  <p className="text-xs font-bold text-slate-800 leading-snug">
                    {specialPrayersData[selectedSpecialPrayer].rakaat.hi}
                  </p>
                  <p className="text-[10px] text-slate-500 font-medium italic mt-1 font-mono">
                    {specialPrayersData[selectedSpecialPrayer].rakaat.en}
                  </p>
                </div>
              </div>

              {/* Niyyat Intention Section */}
              <div className="bg-amber-50/40 border border-amber-200/60 p-4 rounded-2xl">
                <div className="flex items-center gap-1 text-[10px] text-amber-800 font-extrabold uppercase tracking-widest font-mono mb-1.5">
                  <BookOpen className="w-3.5 h-3.5" />
                  <span>NIYYAT (नीयत का तरीक़ा)</span>
                </div>
                <p className="text-xs font-extrabold text-slate-800 leading-relaxed">
                  "{specialPrayersData[selectedSpecialPrayer].niyyat.hi}"
                </p>
                <div className="border-t border-amber-200/40 my-2"></div>
                <p className="text-[10px] text-slate-500 font-mono italic leading-relaxed">
                  Intellectual intention: {specialPrayersData[selectedSpecialPrayer].niyyat.en}
                </p>
              </div>

              {/* Step By Step Instructions Timeline */}
              <div className="flex flex-col gap-3 mt-1">
                <h5 className="text-[10px] text-emerald-800 font-extrabold uppercase tracking-widest font-mono flex items-center gap-1 border-b border-gray-100 pb-2">
                  <Info className="w-3.5 h-3.5" />
                  <span>STEP-BY-STEP METHOD (तरीक़ा-ए-नमाज़)</span>
                </h5>

                <div className="flex flex-col gap-4">
                  {specialPrayersData[selectedSpecialPrayer].steps.map((step, idx) => (
                    <div key={idx} className="flex gap-3 text-left">
                      {/* Step Number Dot */}
                      <span className="w-6 h-6 rounded-full bg-emerald-50 border border-emerald-300 text-emerald-800 flex items-center justify-center font-extrabold font-mono text-[11px] shrink-0">
                        {idx + 1}
                      </span>
                      <div className="flex-1 flex flex-col gap-0.5">
                        <p className="text-xs font-bold text-slate-800 leading-relaxed font-sans">
                          {step.hi}
                        </p>
                        <p className="text-[10px] text-slate-500 font-mono leading-relaxed italic">
                          {step.en}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Extra Reward Notes */}
              <div className="bg-emerald-50/40 border border-emerald-100 p-4 rounded-2xl text-left">
                <span className="text-[9px] text-emerald-800 font-extrabold uppercase font-mono tracking-wider block mb-1">
                  ✨ VIRTUES & BENEFITS (विशेष बातें)
                </span>
                <p className="text-xs font-semibold text-slate-700 leading-relaxed font-sans">
                  {specialPrayersData[selectedSpecialPrayer].notes.hi}
                </p>
                <p className="text-[10px] text-slate-400 font-mono leading-relaxed mt-1 italic">
                  {specialPrayersData[selectedSpecialPrayer].notes.en}
                </p>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
