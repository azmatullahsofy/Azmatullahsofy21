import React, { useState } from 'react';
import { Search, Volume2, BookOpen, VolumeX, Heart, Compass } from 'lucide-react';
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
  const [activeTab, setActiveTab] = useState<'all' | 'mosque' | 'daily' | 'ramadan'>('all');
  const [favorites, setFavorites] = useState<string[]>([]);

  // Simple HTML5 audio player simulation
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
    if (id.includes('d1') || id.includes('d2') || id.includes('d5') || id.includes('d6')) return 'daily';
    if (id.includes('d3') || id.includes('d4')) return 'mosque';
    if (id.includes('d13') || id.includes('d14')) return 'ramadan';
    return 'daily';
  };

  const filteredDuas = defaultDuas.filter((dua) => {
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
      <div className="flex items-center gap-3 mb-6 bg-white rounded-3xl p-5 border border-gray-100 card-shadow">
        <div className="w-12 h-12 rounded-2xl bg-emerald-800 text-amber-300 flex items-center justify-center card-shadow">
          <BookOpen className="w-6 h-6" />
        </div>
        <div className="text-left">
          <h2 className="text-xl font-bold text-emerald-950">{t.duaHadithTitle}</h2>
          <p className="text-[11px] text-slate-500">40+ Masnoon Duas with authentic Arabic recitations and regional translation</p>
        </div>
      </div>

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
          { key: 'all', label: 'All Duas' },
          { key: 'daily', label: 'Daily Life' },
          { key: 'mosque', label: 'Mosque' },
          { key: 'ramadan', label: 'Ramadan' }
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
            
            return (
              <div
                key={dua.id}
                id={`dua-item-card-${dua.id}`}
                className="bg-white rounded-3xl border border-gray-100 card-shadow p-6 relative flex flex-col gap-3 group hover:border-emerald-300/60 transition-all duration-300 transform"
              >
                {/* Header title */}
                <div className="flex justify-between items-start gap-4">
                  <div className="text-left">
                    <span className="text-[10px] bg-emerald-50 text-emerald-800 font-bold px-2.5 py-1 rounded-full uppercase tracking-wider font-mono">
                      {getCategoryTheme(dua.id)} Category
                    </span>
                    <h3 className="text-[15px] font-bold text-slate-800 mt-2 hover:text-emerald-950 transition-colors">
                      {dua.title[props.currentLanguage]}
                    </h3>
                  </div>
                  
                  <div className="flex items-center gap-1.5 shrink-0">
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
            No matching duas found. Try searching with other terms!
          </div>
        )}
      </div>
    </div>
  );
}
