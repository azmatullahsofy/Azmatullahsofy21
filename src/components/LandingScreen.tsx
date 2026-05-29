import React from 'react';
import { Building2, Shield, UserCheck, Users, Globe, ChevronRight, MapPin, Navigation, Compass, AlertCircle } from 'lucide-react';
import { Language, Role, Masjid } from '../types';
import { translations } from '../translations';

interface LandingScreenProps {
  currentLanguage: Language;
  setLanguage: (lang: Language) => void;
  onSelectRole: (role: Role | 'login') => void;
  onContinueAsGuest: () => void;
  
  // Geolocation and list properties
  masjids: Masjid[];
  selectedMasjid: Masjid | null;
  geoSuggestion: { masjid: Masjid; distance: number } | null;
  isLocating: boolean;
  onRequestLocation: () => void;
  onSelectMasjid: (id: string) => void;
}

export default function LandingScreen(props: LandingScreenProps) {
  const t = translations[props.currentLanguage];

  return (
    <div className="flex flex-col items-center justify-center min-h-[90vh] p-4 text-center">
      {/* Decorative Crescent Moon and Star */}
      <div className="relative mb-6 transform hover:rotate-12 transition-transform duration-500">
        <div className="w-24 h-24 rounded-full bg-emerald-800 flex items-center justify-center relative shadow-2xl border-2 border-emerald-400">
          <Building2 className="w-12 h-12 text-amber-400" />
        </div>
        <div className="absolute -top-1 -right-1 w-6 h-6 rounded-full bg-amber-400 flex items-center justify-center text-xs animate-pulse text-emerald-950 font-bold">
          ★
        </div>
      </div>

      {/* Main Headers */}
      <h1 className="text-3xl font-bold text-emerald-900 tracking-tight leading-tight mb-2 md:text-4xl">
        {t.appName}
      </h1>
      <p className="text-sm font-medium text-amber-600 mb-4 uppercase tracking-widest max-w-xs mx-auto">
        {t.subtitle}
      </p>
      <p className="text-slate-600 text-sm max-w-sm mb-8">
        {t.tagline}
      </p>

      {/* Language Switcher Card */}
      <div className="bg-white rounded-2xl shadow-md border border-slate-100 p-4 w-full max-w-sm mb-8">
        <div className="flex items-center justify-center gap-2 mb-3 text-slate-500 text-xs font-semibold">
          <Globe className="w-4 h-4 text-emerald-600" />
          <span>{t.selectLanguage}</span>
        </div>
        <div className="grid grid-cols-3 gap-2">
          {(['en', 'hi', 'ur'] as Language[]).map((lang) => (
            <button
              key={lang}
              id={`lang-btn-${lang}`}
              onClick={() => props.setLanguage(lang)}
              className={`py-2 px-3 rounded-xl text-xs font-semibold transition-all duration-300 border ${
                props.currentLanguage === lang
                  ? 'bg-emerald-800 text-white border-emerald-800 shadow-sm font-bold'
                  : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
              }`}
            >
              {t[lang === 'en' ? 'english' : lang === 'hi' ? 'hindi' : 'urdu']}
            </button>
          ))}
        </div>
      </div>

      {/* Nearest Masjid Segment */}
      <div className="bg-white rounded-3xl shadow-md border border-slate-100 p-5 w-full max-w-sm mb-6 text-left relative overflow-hidden">
        {props.isLocating && (
          <div className="absolute top-0 left-0 right-0 h-1 bg-emerald-600 animate-pulse"></div>
        )}

        <div className="flex items-center gap-2 mb-3.5 pb-2.5 border-b border-slate-100">
          <MapPin className="w-4.5 h-4.5 text-emerald-800 shrink-0" />
          <h3 className="text-xs font-black uppercase text-emerald-950 font-mono tracking-widest flex-1">
            {t.nearestMasjidSuggested ? t.nearestMasjidSuggested.replace('GPS', 'GPS/Location') : "Suggested Nearest Masjid"}
          </h3>
          {props.isLocating && <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-ping"></span>}
        </div>

        {props.isLocating ? (
          <div className="flex flex-col items-center justify-center py-4 text-center">
            <span className="relative flex h-3 w-3 mb-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-600"></span>
            </span>
            <p className="text-xs font-bold text-slate-700 animate-pulse font-mono">
              {t.searchingLocation || "Detecting closest Mosque..."}
            </p>
          </div>
        ) : props.geoSuggestion ? (
          <div className="flex flex-col gap-3">
            <div className="bg-emerald-50/55 rounded-xl p-3 border border-emerald-500/10">
              <h4 className="text-sm font-black text-emerald-950 leading-tight">
                {props.geoSuggestion.masjid.name}
              </h4>
              <p className="text-[11px] text-slate-500 font-bold mt-1 font-mono">
                📍 {props.geoSuggestion.masjid.address}
              </p>
              <span className="inline-block bg-amber-100 text-amber-900 border border-amber-300/30 text-[9px] font-extrabold px-2 py-0.5 mt-2 rounded-lg font-mono">
                ⚡ {(t.distanceText || "distance: {dist} km").replace('{dist}', props.geoSuggestion.distance.toFixed(2))}
              </span>
            </div>

            <button
              id="btn-apply-geo-masjid"
              onClick={() => props.onSelectMasjid(props.geoSuggestion!.masjid.id)}
              className="w-full bg-emerald-800 hover:bg-emerald-950 text-white text-xs font-black py-3 px-4 rounded-xl transition-all shadow-sm flex items-center justify-center gap-1.5 uppercase tracking-wider"
            >
              <Compass className="w-4 h-4 text-amber-300 animate-spin" />
              <span>{t.useThisMasjid || "Use This Masjid & Continue"}</span>
            </button>
          </div>
        ) : (
          <div className="flex flex-col gap-2.5">
            <p className="text-[11px] text-slate-500 leading-relaxed font-semibold">
              Allow location to automatically match you with the closest mosque, or select a city manually below.
            </p>
            <button
              id="btn-request-geo"
              onClick={props.onRequestLocation}
              className="w-full bg-slate-100 hover:bg-slate-200 border border-slate-300/60 text-slate-800 text-xs font-bold py-3 px-4 rounded-xl transition-colors flex items-center justify-center gap-1.5"
            >
              <Navigation className="w-3.5 h-3.5 text-emerald-800" />
              <span>📍 Detect Closest Mosque</span>
            </button>
          </div>
        )}

        {/* Manual selection of pre-seeded mosques */}
        <div className="mt-4 pt-3 border-t border-slate-100">
          <label className="text-[9px] font-black uppercase text-slate-400 font-mono tracking-wider block mb-2">
            {t.orSelectManually || "Or select from available list"}
          </label>
          <div className="flex flex-col gap-1.5 max-h-[140px] overflow-y-auto pr-1">
            {props.masjids.map((m) => {
              const isActive = props.selectedMasjid?.id === m.id;
              return (
                <button
                  key={m.id}
                  id={`btn-manual-select-${m.id}`}
                  onClick={() => props.onSelectMasjid(m.id)}
                  className={`w-full py-2 px-3 text-left rounded-xl text-xs flex justify-between items-center border transition-all ${
                    isActive
                      ? 'bg-emerald-50 text-emerald-950 border-emerald-500/20 font-black'
                      : 'bg-slate-50 text-slate-700 border-slate-200/80 hover:bg-slate-100'
                  }`}
                >
                  <div className="flex flex-col text-left">
                    <span className="font-bold">{m.name}</span>
                    <span className="text-[9px] text-slate-400 font-mono italic">{m.city}</span>
                  </div>
                  {isActive && (
                    <span className="text-[8px] font-extrabold uppercase bg-emerald-800 text-white py-0.5 px-2 rounded-md font-mono">
                      ACTIVE
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Call To Action Role Gateways */}
      <div className="w-full max-w-sm flex flex-col gap-3">
        {/* Guest Portal Option (timetables only) */}
        <button
          id="btn-role-guest"
          onClick={props.onContinueAsGuest}
          className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-4 px-6 rounded-2xl shadow-lg transition-transform hover:-translate-y-0.5 active:translate-y-0 duration-300 flex items-center justify-between group"
        >
          <div className="flex items-center gap-3">
            <Users className="w-5 h-5 text-emerald-200" />
            <span className="text-sm tracking-wide text-left">
              {t.loginGuestBtn}
            </span>
          </div>
          <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
        </button>

        <div className="relative my-4 flex items-center justify-center">
          <div className="border-t border-slate-200 w-full"></div>
          <span className="absolute bg-slate-50 px-3 text-xs text-slate-400 font-semibold tracking-wider">
            OR / या / یا
          </span>
        </div>

        {/* Admin Login Gateway */}
        <button
          id="btn-role-admin"
          onClick={() => props.onSelectRole('admin')}
          className="w-full bg-white hover:bg-slate-50 text-emerald-900 border-2 border-emerald-100 font-semibold py-3.5 px-5 rounded-2xl shadow-sm transition-all duration-300 flex items-center gap-3.5 group"
        >
          <div className="w-9 h-9 rounded-xl bg-emerald-50 text-emerald-800 flex items-center justify-center group-hover:bg-emerald-100 transition-colors">
            <Shield className="w-4 h-4" />
          </div>
          <div className="text-left flex-1">
            <div className="text-xs text-slate-400 font-medium font-mono uppercase tracking-wider">Mutawalli / Imam</div>
            <div className="text-sm font-bold">{t.roleAdmin}</div>
          </div>
          <ChevronRight className="w-4 h-4 text-emerald-400 group-hover:translate-x-1 transition-transform" />
        </button>

        {/* Member Code Verification Gateway */}
        <button
          id="btn-role-member"
          onClick={() => props.onSelectRole('member')}
          className="w-full bg-white hover:bg-slate-50 text-emerald-900 border-2 border-emerald-100 font-semibold py-3.5 px-5 rounded-2xl shadow-sm transition-all duration-300 flex items-center gap-3.5 group"
        >
          <div className="w-9 h-9 rounded-xl bg-amber-50 text-amber-800 flex items-center justify-center group-hover:bg-amber-100 transition-colors">
            <UserCheck className="w-4 h-4" />
          </div>
          <div className="text-left flex-1">
            <div className="text-xs text-slate-400 font-medium font-mono uppercase tracking-wider">Gaon Ke Log / Village Code</div>
            <div className="text-sm font-bold">{t.roleMember}</div>
          </div>
          <ChevronRight className="w-4 h-4 text-amber-500 group-hover:translate-x-1 transition-transform" />
        </button>
      </div>

      {/* Clean Aesthetic Footer */}
      <div className="mt-12 text-slate-400 text-xs font-medium font-mono flex flex-col gap-1">
        <div>Digital Masjid System v1.50 • Secure Platform</div>
        <div>Assalamu Alaikum wa Rahmatullahi wa Barakatuhu</div>
      </div>
    </div>
  );
}
