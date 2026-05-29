import React, { useState } from 'react';
import { Search, Volume2, BookOpen, VolumeX, Heart, Compass, PlusCircle, CheckCircle, Trash2, HelpCircle } from 'lucide-react';
import { Language, DuaItem } from '../types';
import { translations } from '../translations';
import { defaultDuas } from '../defaultData';

interface DuaScreenProps {
  currentLanguage: Language;
}

export default function DuaScreen(props: DuaScreenProps) {
  const t = translations[props.currentLanguage];
  const [searchQuery, setSearchQuery] = useState('');
  const [playingDuaId, setPlayingDuaId] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'all' | 'mosque' | 'daily' | 'ramadan' | 'custom'>('all');
  const [favorites, setFavorites] = useState<string[]>([]);

  // Persistent user-defined custom duas state
  const [customDuas, setCustomDuas] = useState<DuaItem[]>(() => {
    try {
      const saved = localStorage.getItem('digital_masjid_custom_duas');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  // Expandable form toggle
  const [showAddForm, setShowAddForm] = useState(false);
  const [formErr, setFormErr] = useState('');
  const [formSuccess, setFormSuccess] = useState('');

  // Form input states
  const [newTitleEn, setNewTitleEn] = useState('');
  const [newTitleHi, setNewTitleHi] = useState('');
  const [newTitleUr, setNewTitleUr] = useState('');
  const [newArabic, setNewArabic] = useState('');
  const [newTransEn, setNewTransEn] = useState('');
  const [newTransHi, setNewTransHi] = useState('');
  const [newTransUr, setNewTransUr] = useState('');

  // HTML5 audio player simulation
  const [audio] = useState<HTMLAudioElement | null>(() => {
    try {
      return new Audio();
    } catch {
      return null;
    }
  });

  const handlePlayAudio = (dua: DuaItem) => {
    if (!audio) return;
    
    if (playingDuaId === dua.id) {
      audio.pause();
      setPlayingDuaId(null);
    } else {
      audio.src = dua.audioUrl || "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3";
      audio.play().catch((e) => console.log("Audio play deferred matching security bounds", e));
      setPlayingDuaId(dua.id);
      
      // Auto reset at end
      audio.onended = () => {
        setPlayingDuaId(null);
      };
    }
  };

  const toggleFavorite = (id: string) => {
    setFavorites((prev) => 
      prev.includes(id) ? prev.filter(f => f !== id) : [...prev, id]
    );
  };

  // Classify categories
  const getCategoryTheme = (id: string) => {
    if (id.startsWith('custom_')) return 'custom';
    if (id.includes('d1') || id.includes('d2') || id.includes('d5') || id.includes('d6')) return 'daily';
    if (id.includes('d3') || id.includes('d4')) return 'mosque';
    if (id.includes('d13') || id.includes('d14')) return 'ramadan';
    return 'daily';
  };

  // Add custom user dua
  const handleSubmitDua = (e: React.FormEvent) => {
    e.preventDefault();
    setFormErr('');
    setFormSuccess('');

    if (!newTitleEn.trim() || !newArabic.trim() || !newTransEn.trim()) {
      setFormErr('English Title, Arabic Text & English Translation are required.');
      return;
    }

    const newDua: DuaItem = {
      id: 'custom_' + Date.now(),
      title: {
        en: newTitleEn.trim(),
        hi: newTitleHi.trim() || newTitleEn.trim() + ' (दुआ)',
        ur: newTitleUr.trim() || newTitleEn.trim() + ' (دعا)'
      },
      arabic: newArabic.trim(),
      translation: {
        en: newTransEn.trim(),
        hi: newTransHi.trim() || newTransEn.trim(),
        ur: newTransUr.trim() || newTransEn.trim()
      },
      audioUrl: "https://www.google.com/speech-api/v1/synthesize?text=" + encodeURIComponent(newArabic) // dynamic TTS test mock
    };

    const updated = [...customDuas, newDua];
    setCustomDuas(updated);
    localStorage.setItem('digital_masjid_custom_duas', JSON.stringify(updated));

    // Clear inputs
    setNewTitleEn('');
    setNewTitleHi('');
    setNewTitleUr('');
    setNewArabic('');
    setNewTransEn('');
    setNewTransHi('');
    setNewTransUr('');
    setFormSuccess('असीमित दुआ सूची में नई दुआ जोड़ी गई! (Dua added successfully!)');
    
    setTimeout(() => {
      setFormSuccess('');
      setShowAddForm(false);
    }, 2000);
  };

  const handleDeleteDua = (id: string) => {
    const updated = customDuas.filter(cf => cf.id !== id);
    setCustomDuas(updated);
    localStorage.setItem('digital_masjid_custom_duas', JSON.stringify(updated));
  };

  // Merge default + custom
  const combinedDuas = [...defaultDuas, ...customDuas];

  const filteredDuas = combinedDuas.filter((dua) => {
    const heading = dua.title[props.currentLanguage] || '';
    const translationText = dua.translation[props.currentLanguage] || '';
    const query = searchQuery.toLowerCase();
    
    const matchesSearch = heading.toLowerCase().includes(query) || 
                          translationText.toLowerCase().includes(query) ||
                          dua.arabic.includes(query);

    const cat = getCategoryTheme(dua.id);
    const matchesCategory = activeTab === 'all' || cat === activeTab;

    return matchesSearch && matchesCategory;
  });

  return (
    <div className="w-full max-w-md mx-auto p-4 pb-20">
      
      {/* Title block */}
      <div className="flex items-center gap-3 mb-6 bg-white rounded-3xl p-5 border border-gray-100 card-shadow text-left">
        <div className="w-12 h-12 rounded-2xl bg-emerald-800 text-amber-300 flex items-center justify-center card-shadow font-sans">
          <BookOpen className="w-6 h-6" />
        </div>
        <div className="flex-1">
          <h2 className="text-xl font-bold text-emerald-950">{t.duaHadithTitle}</h2>
          <p className="text-[10px] text-slate-500 leading-normal">
            Read daily authentic masnoon prayers. Add <strong>unlimited personal duas</strong> which persist offline! (असीमित दुआएं)
          </p>
        </div>
      </div>

      {/* Trigger button for adding a new Custom Dua */}
      <button
        id="btn-trigger-add-dua-form"
        onClick={() => setShowAddForm(!showAddForm)}
        className="w-full mb-5 bg-gradient-to-r from-emerald-800 to-emerald-900 hover:from-emerald-950 hover:to-emerald-900 h-14 rounded-2xl text-white text-xs font-black uppercase tracking-wider shadow-lg flex items-center justify-center gap-2 group transition-all"
      >
        <PlusCircle className="w-5 h-5 text-amber-300 group-hover:scale-110 transition-transform" />
        <span>➕ नई दुआ जोड़ें (Add Custom Dua)</span>
      </button>

      {/* Expandable Add custom Dua Form */}
      {showAddForm && (
        <form onSubmit={handleSubmitDua} className="bg-white rounded-3xl border border-emerald-100 p-5 mb-5 card-shadow flex flex-col gap-4 text-left animate-slide-up">
          <div className="border-b border-gray-100 pb-2">
            <h3 className="text-xs font-black text-emerald-950 uppercase tracking-wider">नया दुआ प्रविष्टि (New Dua Form - Unlimited)</h3>
            <p className="text-[9px] text-slate-400 mt-0.5">Enter details to save to your local offline library.</p>
          </div>

          {formErr && <p className="text-[10px] text-red-600 font-bold bg-red-50 p-2 rounded-lg">{formErr}</p>}
          {formSuccess && <p className="text-[10px] text-emerald-850 font-bold bg-emerald-50 p-2.5 rounded-lg">{formSuccess}</p>}

          {/* Title Inputs */}
          <div className="flex flex-col gap-1">
            <label className="text-[11px] font-bold text-slate-700">English Title (शीर्षक) *</label>
            <input
              id="dua-form-title-en"
              type="text"
              placeholder="e.g. For good health"
              value={newTitleEn}
              onChange={(e) => setNewTitleEn(e.target.value)}
              className="bg-slate-50 border border-slate-200 rounded-lg p-2 text-xs focus:ring-2 focus:ring-emerald-700"
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-2">
            <div className="flex flex-col gap-1">
              <label className="text-[10px] font-bold text-slate-500">Hindi Title (हिंदी शीर्षक)</label>
              <input
                id="dua-form-title-hi"
                type="text"
                placeholder="उदा. अच्छी सेहत के लिए"
                value={newTitleHi}
                onChange={(e) => setNewTitleHi(e.target.value)}
                className="bg-slate-50 border border-slate-200 rounded-lg p-2 text-xs focus:ring-2 focus:ring-emerald-700"
              />
            </div>
            <div className="flex flex-col gap-1">
              <label className="text-[10px] font-bold text-slate-500">Urdu Title (اردو عنوان)</label>
              <input
                id="dua-form-title-ur"
                type="text"
                placeholder="مثلاَ صحت کے لیے"
                value={newTitleUr}
                onChange={(e) => setNewTitleUr(e.target.value)}
                className="bg-slate-50 border border-slate-200 rounded-lg p-2 text-xs focus:ring-2 focus:ring-emerald-700"
              />
            </div>
          </div>

          {/* Arabic Text Area */}
          <div className="flex flex-col gap-1">
            <label className="text-[11px] font-bold text-slate-700">Arabic Ayat/Dua Text (अरबी दुआ) *</label>
            <textarea
              id="dua-form-arabic"
              placeholder="اَللّٰهُمَّ اِنِّىْ اَسْئَلُكَ..."
              value={newArabic}
              onChange={(e) => setNewArabic(e.target.value)}
              className="bg-slate-50 border border-slate-200 rounded-lg p-2.5 text-sm font-arabic tracking-wide text-center h-20 focus:ring-2 focus:ring-emerald-700 focus:outline-none"
              dir="rtl"
              required
            />
          </div>

          {/* Translation Inputs */}
          <div className="flex flex-col gap-1">
            <label className="text-[11px] font-bold text-slate-700">English Translation *</label>
            <input
              id="dua-form-trans-en"
              type="text"
              placeholder="O Allah, I ask You for..."
              value={newTransEn}
              onChange={(e) => setNewTransEn(e.target.value)}
              className="bg-slate-50 border border-slate-200 rounded-lg p-2 text-xs focus:ring-2 focus:ring-emerald-700"
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-2">
            <div className="flex flex-col gap-1">
              <label className="text-[10px] font-bold text-slate-500">Hindi Translation (हिंदी अनुवाद)</label>
              <input
                id="dua-form-trans-hi"
                type="text"
                placeholder="ऐ अल्लाह, मैं तुझसे माँगता हूँ..."
                value={newTransHi}
                onChange={(e) => setNewTransHi(e.target.value)}
                className="bg-slate-50 border border-slate-200 rounded-lg p-2 text-xs focus:ring-2 focus:ring-emerald-700"
              />
            </div>
            <div className="flex flex-col gap-1">
              <label className="text-[10px] font-bold text-slate-500">Urdu Translation (اردو ترجمہ)</label>
              <input
                id="dua-form-trans-ur"
                type="text"
                placeholder="اے اللہ، میں تجھ سے مانگتا ہوں..."
                value={newTransUr}
                onChange={(e) => setNewTransUr(e.target.value)}
                className="bg-slate-50 border border-slate-200 rounded-lg p-2 text-xs focus:ring-2 focus:ring-emerald-700"
              />
            </div>
          </div>

          <button
            id="dua-form-submit-btn"
            type="submit"
            className="w-full py-3 bg-emerald-800 text-white text-xs font-black uppercase rounded-xl hover:bg-emerald-950 transition-colors mt-2"
          >
            सुरक्षित करें (Save Dua to offline database)
          </button>
        </form>
      )}

      {/* Search Input */}
      <div className="relative mb-5">
        <Search className="absolute left-3.5 top-3.5 w-4 h-4 text-emerald-700" />
        <input
          id="inp-search-dua"
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search Duas by keyword (सोने, Mosque, रोज़ा)..."
          className="w-full bg-white border border-gray-100 rounded-2xl py-3 pl-10 pr-4 text-xs focus:ring-2 focus:ring-emerald-700 font-semibold text-slate-700 card-shadow"
        />
      </div>

      {/* Filter Tabs */}
      <div className="flex bg-white rounded-2xl p-1 mb-6 border border-gray-100 card-shadow">
        {[
          { key: 'all', label: 'All' },
          { key: 'daily', label: 'Life' },
          { key: 'mosque', label: 'Mosque' },
          { key: 'ramadan', label: 'Ramadan' },
          { key: 'custom', label: 'Custom' }
        ].map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key as any)}
            className={`flex-1 py-2 text-center text-[10px] font-extrabold rounded-lg uppercase tracking-wider transition-all duration-300 ${
              activeTab === tab.key
                ? 'bg-emerald-800 text-white shadow-sm'
                : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* DUA CARDS GRID LIST */}
      <div className="flex flex-col gap-4">
        {filteredDuas.length > 0 ? (
          filteredDuas.map((dua) => {
            const isFav = favorites.includes(dua.id);
            const isPlaying = playingDuaId === dua.id;
            const isCustom = getCategoryTheme(dua.id) === 'custom';
            
            return (
              <div
                key={dua.id}
                id={`dua-item-card-${dua.id}`}
                className="bg-white rounded-3xl border border-gray-100 card-shadow p-6 relative flex flex-col gap-3 group hover:border-emerald-300/60 transition-all duration-300 transform text-left"
              >
                {/* Header title */}
                <div className="flex justify-between items-start gap-4">
                  <div className="text-left">
                    <span className={`text-[9px] font-bold px-2.5 py-1 rounded-full uppercase tracking-wider font-mono ${
                      isCustom ? 'bg-amber-100 text-amber-900 border border-amber-500/10' : 'bg-emerald-50 text-emerald-800'
                    }`}>
                      {getCategoryTheme(dua.id)} category
                    </span>
                    <h3 className="text-[15px] font-bold text-slate-800 mt-2 hover:text-emerald-950 transition-colors">
                      {dua.title[props.currentLanguage]}
                    </h3>
                  </div>
                  
                  <div className="flex items-center gap-1.5 shrink-0">
                    {/* Delete button for custom ones */}
                    {isCustom && (
                      <button
                        onClick={() => handleDeleteDua(dua.id)}
                        className="p-1.5 rounded-full text-red-300 hover:text-red-600 hover:bg-red-50 transition-colors"
                        title="Delete custom dua"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    )}

                    {/* Favorite marker */}
                    <button
                      onClick={() => toggleFavorite(dua.id)}
                      className={`p-1.5 rounded-full transition-colors ${isFav ? 'text-amber-500 bg-amber-50' : 'text-slate-300 hover:text-slate-500 hover:bg-slate-50'}`}
                      title={isFav ? "Favorited" : "Mark favorite"}
                    >
                      <Heart className={`w-4 h-4 ${isFav ? 'fill-current' : ''}`} />
                    </button>

                    {/* Audio Voice Player */}
                    <button
                      onClick={() => handlePlayAudio(dua)}
                      className={`p-2 rounded-full transition-all duration-300 shadow-sm ${
                        isPlaying 
                          ? 'bg-amber-400 text-slate-950 scale-105 animate-pulse' 
                          : 'bg-emerald-50 text-emerald-800 hover:bg-emerald-800 hover:text-white'
                      }`}
                      title="Listen Recitation"
                    >
                      {isPlaying ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                {/* ARABIC TEXT (Centered alignment for sacred font style) */}
                <div className="bg-emerald-50/40 rounded-2xl py-4 px-3 text-center my-1.5 hover:bg-emerald-50 transition-colors">
                  <div className="text-xl text-emerald-950 leading-loose font-bold font-arabic tracking-wide" dir="rtl">
                    {dua.arabic}
                  </div>
                </div>

                {/* Translation and transliteration */}
                <div className="text-left border-t border-slate-100 pt-3 flex flex-col gap-1">
                  <span className="text-[10px] text-slate-400 uppercase font-mono tracking-wider font-bold">
                    Translation / अनुवाद / ترجمہ :
                  </span>
                  <p className="text-xs text-slate-600 font-medium leading-relaxed">
                    {dua.translation[props.currentLanguage]}
                  </p>
                </div>

                {/* Visualizer audio spectrum when simulated audio plays */}
                {isPlaying && (
                  <div className="flex items-center justify-center gap-1 mt-2.5 h-4">
                    <div className="w-1 bg-amber-400 h-2.5 rounded-full animate-bounce [animation-delay:0.1s]"></div>
                    <div className="w-1 bg-amber-400 h-4 rounded-full animate-bounce [animation-delay:0.3s]"></div>
                    <div className="w-1 bg-amber-400 h-1.5 rounded-full animate-bounce [animation-delay:0.5s]"></div>
                    <div className="w-1 bg-amber-400 h-3 rounded-full animate-bounce [animation-delay:0.2s]"></div>
                    <span className="text-[9px] text-slate-400 font-bold ml-1.5 font-mono">Learning Pronunciation Playback</span>
                  </div>
                )}
              </div>
            );
          })
        ) : (
          <div className="bg-slate-100 rounded-3xl py-12 p-6 text-center text-slate-400 text-xs font-semibold">
            <Compass className="w-10 h-10 text-slate-300 mx-auto mb-2 animate-spin" />
            No matching duas found. Try searching with other terms or click the button above to add some custom ones!
          </div>
        )}
      </div>
    </div>
  );
}
