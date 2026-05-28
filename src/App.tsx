import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Building2, 
  MapPin, 
  BookOpen, 
  HeartHandshake, 
  User, 
  Key, 
  Volume2, 
  Compass, 
  CalendarDays, 
  TrendingUp, 
  ShieldCheck, 
  VolumeX, 
  Radio, 
  Clock, 
  LogOut, 
  Mic, 
  MicOff, 
  BellRing,
  Globe
} from 'lucide-react';

import { Language, UserProfile, NotificationMsg, Hadith, NamazTimetable } from './types';
import { translations } from './translations';
import { defaultHadiths, defaultNamazTimetable } from './defaultData';
import { MasjidService } from './services/MasjidService';

// Subcomponents
import LandingScreen from './components/LandingScreen';
import LoginScreen from './components/LoginScreen';
import TimetableScreen from './components/TimetableScreen';
import DuaScreen from './components/DuaScreen';
import NamazGuideScreen from './components/NamazGuideScreen';
import DonateScreen from './components/DonateScreen';
import MadadScreen from './components/MadadScreen';
import AdminScreen from './components/AdminScreen';

export default function App() {
  // Locale Languages
  const [lang, setLang] = useState<Language>('hi'); // Default to Hindi to match localized community priorities
  const t = translations[lang];

  // Sessions and logins
  const [user, setUser] = useState<UserProfile | null>(() => {
    const saved = localStorage.getItem('digital_masjid_current_user');
    return saved ? JSON.parse(saved) : null;
  });
  const [isGuest, setIsGuest] = useState<boolean>(() => {
    return localStorage.getItem('digital_masjid_is_guest') === 'true';
  });

  // Navigation tabs
  const [currentTab, setCurrentTab] = useState<'home' | 'azan' | 'donate' | 'help' | 'admin'>('home');
  const [selectedRoleForLogin, setSelectedRoleForLogin] = useState<any>(null); // 'admin' | 'member' | null for login dialog

  // Real-time Announcements and Hadiths
  const [activeHadith, setActiveHadith] = useState<Hadith | null>(null);
  const [notificationsList, setNotificationsList] = useState<NotificationMsg[]>([]);
  const [timetable, setTimetable] = useState<NamazTimetable>(defaultNamazTimetable);

  // Live Azan Stream state
  const [isLiveAzanActive, setIsLiveAzanActive] = useState(false);
  const [isListeningLiveStream, setIsListeningLiveStream] = useState(false);
  const [micActive, setMicActive] = useState(false);
  const [audioLevel, setAudioLevel] = useState<number[]>(Array(10).fill(15));

  // Audio object refs for safe background playback
  const azanAudioRef = useRef<HTMLAudioElement | null>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const micStreamRef = useRef<MediaStream | null>(null);
  const animationFrameRef = useRef<number | null>(null);

  // Load static data
  useEffect(() => {
    loadMasjidFeed();
    
    // Play sound simulation files safely
    azanAudioRef.current = new Audio("https://cdn.pixabay.com/download/audio/2022/10/31/audio_10e05e55be.mp3?filename=azan-madina-60866.mp3");
    azanAudioRef.current.loop = true;

    // Listen to live Azan status in real time
    let unsubscribe: any = null;
    const connectAzanSignal = async () => {
      unsubscribe = await MasjidService.registerLiveAzanListener("m1", (isLive) => {
        setIsLiveAzanActive(isLive);
        if (!isLive) {
          // Force stop player if live status finishes
          setIsListeningLiveStream(false);
          if (azanAudioRef.current) {
            azanAudioRef.current.pause();
            azanAudioRef.current.currentTime = 0;
          }
        }
      });
    };
    connectAzanSignal();

    return () => {
      if (unsubscribe) unsubscribe();
      if (azanAudioRef.current) {
        azanAudioRef.current.pause();
      }
      stopMicrophoneStream();
    };
  }, []);

  const loadMasjidFeed = async () => {
    const dailyHadith = await MasjidService.getHadithOfTheDay("m1");
    setActiveHadith(dailyHadith);

    const alerts = await MasjidService.getNotifications("m1");
    setNotificationsList(alerts);

    const sheet = await MasjidService.fetchTimetableByCity("Mubarakpur");
    setTimetable(sheet);
  };

  // Log in handles
  const handleLoginSuccess = (profile: UserProfile) => {
    setUser(profile);
    setSelectedRoleForLogin(null);
    setIsGuest(false);
    localStorage.setItem('digital_masjid_current_user', JSON.stringify(profile));
    localStorage.removeItem('digital_masjid_is_guest');
    // If Admin, auto navigate to Admin Tab
    if (profile.role === 'admin') {
      setCurrentTab('admin');
    } else {
      setCurrentTab('home');
    }
  };

  const handleContinueAsGuest = () => {
    setIsGuest(true);
    setUser(null);
    setSelectedRoleForLogin(null);
    localStorage.setItem('digital_masjid_is_guest', 'true');
    localStorage.removeItem('digital_masjid_current_user');
    setCurrentTab('home');
  };

  const handleLogout = () => {
    setUser(null);
    setIsGuest(false);
    setSelectedRoleForLogin(null);
    setCurrentTab('home');
    localStorage.removeItem('digital_masjid_current_user');
    localStorage.removeItem('digital_masjid_is_guest');
  };

  // --- MEMBER AZAN LISTENING TOGGLE ---
  const handleToggleListening = () => {
    if (!azanAudioRef.current) return;

    if (isListeningLiveStream) {
      azanAudioRef.current.pause();
      setIsListeningLiveStream(false);
    } else {
      azanAudioRef.current.play()
        .then(() => setIsListeningLiveStream(true))
        .catch((e) => {
          console.warn("Audio interaction bound required", e);
          setIsListeningLiveStream(true); // fall-through visually
        });
    }
  };

  // --- IMAM MICROPHONE BROADCAST TERMINAL ---
  const handleToggleMic = async () => {
    if (micActive) {
      stopMicrophoneStream();
      setMicActive(false);
      await MasjidService.setLiveAzanStatus("m1", false);
    } else {
      const started = await startMicrophoneStream();
      if (started) {
        setMicActive(true);
        await MasjidService.setLiveAzanStatus("m1", true);
      }
    }
  };

  const startMicrophoneStream = async (): Promise<boolean> => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      micStreamRef.current = stream;

      // Web Audio Analysis for beautiful real-time soundbars
      audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
      analyserRef.current = audioContextRef.current.createAnalyser();
      analyserRef.current.fftSize = 32;

      const source = audioContextRef.current.createMediaStreamSource(stream);
      source.connect(analyserRef.current);

      const bufferLength = analyserRef.current.frequencyBinCount;
      const dataArray = new Uint8Array(bufferLength);

      const updateLevels = () => {
        if (!analyserRef.current) return;
        analyserRef.current.getByteFrequencyData(dataArray);
        
        // Map data to heights [10, 100] for visualizer
        const heights = Array.from(dataArray).slice(0, 10).map(val => Math.max(12, Math.floor(val * 0.4)));
        setAudioLevel(heights);
        animationFrameRef.current = requestAnimationFrame(updateLevels);
      };
      
      updateLevels();
      return true;
    } catch (e) {
      console.warn("Microphone access denied or error", e);
      // Fallback: visual emulation without microphone blocks
      let tick = 0;
      const interval = setInterval(() => {
        setAudioLevel(Array(10).fill(0).map(() => Math.floor(10 + Math.random() * 40)));
        tick++;
        if (tick > 500) clearInterval(interval);
      }, 100);
      return true;
    }
  };

  const stopMicrophoneStream = () => {
    if (animationFrameRef.current) cancelAnimationFrame(animationFrameRef.current);
    if (micStreamRef.current) {
      micStreamRef.current.getTracks().forEach(track => track.stop());
    }
    if (audioContextRef.current) {
      audioContextRef.current.close().catch(() => {});
    }
    micStreamRef.current = null;
    analyserRef.current = null;
    setAudioLevel(Array(10).fill(12));
  };

  return (
    <div className="w-full max-w-md mx-auto min-h-screen bg-[#F3F6F3] flex flex-col justify-between relative shadow-2xl border-x border-slate-200">
      <div className="absolute inset-0 islamic-pattern pointer-events-none z-0"></div>
      
      {/* 1. UPPER HEADER DESK */}
      <header className="bg-slate-900 text-white rounded-b-3xl p-4 shadow-md sticky top-0 z-40 bg-islamic-pattern border-b-2 border-emerald-600/30">
        <div className="flex justify-between items-center gap-3">
          <div className="flex items-center gap-2.5 text-left">
            <div className="w-9 h-9 rounded-xl bg-emerald-800 text-amber-300 flex items-center justify-center border border-emerald-500/20">
              <Building2 className="w-5 h-5" />
            </div>
            <div>
              <h1 className="text-sm font-black font-sans tracking-wide">
                {user ? "Masjid Noor" : "Digital Masjid"}
              </h1>
              <div className="flex items-center gap-1 text-[9px] text-emerald-300 font-bold font-mono">
                <MapPin className="w-3 h-3" />
                <span>MUBARAKPUR • M_786</span>
              </div>
            </div>
          </div>

          {/* Quick Header toggles */}
          <div className="flex items-center gap-2">
            {/* Language Selector Indicator */}
            <div className="flex items-center gap-1 bg-white/10 p-1.5 rounded-xl border border-white/5">
              <Globe className="w-3.5 h-3.5 text-amber-300" />
              <select
                id="select-header-language"
                value={lang}
                onChange={(e) => setLang(e.target.value as Language)}
                className="bg-transparent text-white text-[10px] font-bold focus:outline-none cursor-pointer pr-1"
              >
                <option value="hi" className="bg-slate-900 text-white font-bold">हिन्दी</option>
                <option value="ur" className="bg-slate-900 text-white font-bold">اردو</option>
                <option value="en" className="bg-slate-900 text-white font-bold">EN</option>
              </select>
            </div>

            {/* Logout trigger */}
            {(user || isGuest) && (
              <button
                id="btn-header-logout"
                onClick={handleLogout}
                className="p-2 rounded-xl bg-rose-900/40 hover:bg-rose-900/60 text-rose-200 border border-rose-500/15 transition-all text-xs flex items-center justify-center gap-1 font-bold"
                title={t.logoutBtn}
              >
                <LogOut className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </div>

        {/* User context banner */}
        {user && (
          <div className="mt-3.5 pt-2.5 border-t border-white/10 flex justify-between items-center text-[10px]">
            <div className="flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
              <span className="text-slate-300">Logged as: <strong className="text-white">{user.name}</strong></span>
            </div>
            <span className="text-amber-400 tracking-wider font-extrabold uppercase bg-white/5 py-0.5 px-2.5 rounded-lg font-mono">
              ★ {user.role === 'admin' ? 'Imam / Admin' : 'Village Member'}
            </span>
          </div>
        )}
      </header>

      {/* 2. REAL-TIME FLOATING INTERACTIVE AZAN POPUP */}
      <AnimatePresence>
        {isLiveAzanActive && (
          <motion.div
            id="floating-live-azan-alert"
            initial={{ y: -60, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -60, opacity: 0 }}
            className="absolute top-16 left-4 right-4 bg-gradient-to-r from-amber-500 via-amber-600 to-amber-700 text-slate-950 rounded-2xl shadow-xl z-50 p-4 border border-amber-300 flex flex-col gap-2.5 text-left"
          >
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-2">
                <Radio className="w-4 h-4 text-emerald-950 animate-pulse" />
                <span className="text-xs font-black tracking-widest uppercase font-mono text-emerald-950">
                  {t.azanIsLiveAlert}
                </span>
              </div>
              <span className="w-2.5 h-2.5 rounded-full bg-red-600 animate-ping"></span>
            </div>
            
            <p className="text-[11px] font-bold text-slate-950/80 leading-snug">
              {t.azanEmptyAudio} (सभी लोग कान लगायें)
            </p>

            <div className="flex items-center gap-2 mt-1 whitespace-nowrap">
              <button
                id="btn-toggle-live-speaker"
                onClick={handleToggleListening}
                className={`py-2 px-4 rounded-xl text-xs font-black tracking-wide shadow-sm flex items-center justify-center gap-1.5 flex-1 transition-all duration-300 ${
                  isListeningLiveStream
                    ? 'bg-emerald-950 text-white font-bold ring-2 ring-emerald-400/30'
                    : 'bg-white hover:bg-slate-50 text-slate-900 border'
                }`}
              >
                {isListeningLiveStream ? (
                  <>
                    <VolumeX className="w-3.5 h-3.5" />
                    <span>Mute Stream</span>
                  </>
                ) : (
                  <>
                    <Volume2 className="w-3.5 h-3.5" />
                    <span>{t.liveAzanBtn} (आवाज चालू करें)</span>
                  </>
                )}
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 3. CORE VIEWS DISPATCHER CONTENT */}
      <main className="flex-1 bg-transparent min-h-[75vh] z-10 relative">
        
        {/* LOGIN GATE CHOOSE SCREEN */}
        {!user && !isGuest ? (
          selectedRoleForLogin ? (
            <LoginScreen
              currentLanguage={lang}
              targetRole={selectedRoleForLogin}
              onBack={() => setSelectedRoleForLogin(null)}
              onLoginSuccess={handleLoginSuccess}
            />
          ) : (
            <LandingScreen
              currentLanguage={lang}
              setLanguage={setLang}
              onSelectRole={(role) => setSelectedRoleForLogin(role)}
              onContinueAsGuest={handleContinueAsGuest}
            />
          )
        ) : (
          
          /* ACTIVE USER TABS COMPONENT */
          <div className="w-full">
            {/* TAB 1: HOME PAGE DASHBOARD */}
            {currentTab === 'home' && (
              <div className="p-4 flex flex-col gap-5 text-left pb-24">
                
                {/* 1. Next prayer time remaining bar template */}
                <div className="bg-white rounded-3xl border border-gray-100 card-shadow p-5 flex items-center gap-4">
                  <div className="w-11 h-11 rounded-2xl bg-emerald-50 text-emerald-800 flex items-center justify-center shadow-inner">
                    <Clock className="w-5 h-5 text-emerald-700" />
                  </div>
                  <div>
                    <span className="text-[10px] text-emerald-600 font-bold font-mono tracking-wider uppercase block">
                      {t.nextNamaz} (अगली नमाज़)
                    </span>
                    <h3 className="text-base font-extrabold text-slate-800">
                      Zohrawaqt - 12:15 PM - In Mubarakpur
                    </h3>
                  </div>
                </div>

                {/* 2. Urgent Live Announcement push template list */}
                <div className="bg-white rounded-3xl card-shadow border border-gray-100 p-5">
                  <h3 className="text-xs font-black tracking-widest text-emerald-800 font-mono uppercase pb-3.5 border-b border-gray-100 flex items-center gap-1.5 mb-3.5">
                    <BellRing className="w-4 h-4 text-emerald-700" />
                    <span>{t.notificationsTitle} (मस्जिद ऐलान)</span>
                  </h3>

                  <div className="flex flex-col gap-3">
                    {notificationsList.length > 0 ? (
                      notificationsList.slice(0, 2).map((notif) => (
                        <div 
                          key={notif.id}
                          className="bg-rose-50/50 border border-rose-200/50 p-4 rounded-2xl relative overflow-hidden"
                        >
                          <span className="absolute top-0 right-0 py-0.5 px-3 rounded-bl-xl bg-amber-400 text-slate-950 font-bold text-[8px] font-mono">
                            URGENT
                          </span>
                          <h4 className="text-xs font-extrabold text-slate-900 mb-1">{notif.title}</h4>
                          <p className="text-xs text-slate-600 font-semibold leading-relaxed">{notif.body}</p>
                          <span className="text-[8px] font-mono text-slate-400 mt-2 block">
                            {new Date(notif.timestamp).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})} • Verified Imam Saheb Address
                          </span>
                        </div>
                      ))
                    ) : (
                      <div className="text-center py-4 text-xs text-slate-400 font-medium">
                        {t.noNotification}
                      </div>
                    )}
                  </div>
                </div>

                {/* 3. Imam Broadcast Transmitter Controls (Admin ONLY) */}
                {user?.role === 'admin' && (
                  <div className="bg-gradient-to-br from-emerald-950 to-emerald-900 border-2 border-emerald-500/20 text-white rounded-3xl p-5 shadow-lg relative overflow-hidden">
                    <div className="absolute right-0 bottom-0 opacity-10 translate-y-3 translate-x-3">
                      <Radio className="w-24 h-24" />
                    </div>

                    <div className="flex items-center gap-2 mb-4">
                      <span className="p-1.5 rounded-lg bg-emerald-800 text-amber-300">
                        <Mic className="w-4 h-4" />
                      </span>
                      <h3 className="text-xs font-black tracking-widest font-mono uppercase text-emerald-200">
                        Imam Azan Broadcast Cockpit
                      </h3>
                    </div>

                    {/* Microphone Sound Wave Visualizer */}
                    {micActive && (
                      <div className="flex items-end justify-center gap-1 my-4 h-12 bg-white/5 rounded-2xl border border-white/5 py-3">
                        {audioLevel.map((h, i) => (
                          <div 
                            key={i}
                            className="w-1.5 bg-amber-400 rounded-full transition-all duration-75"
                            style={{ height: `${h}px` }}
                          />
                        ))}
                      </div>
                    )}

                    <button
                      id="admin-btn-toggle-mic"
                      onClick={handleToggleMic}
                      className={`w-full py-3.5 rounded-2xl text-xs font-black uppercase tracking-wider flex items-center justify-center gap-1.5 shadow-md transition-all duration-300 ${
                        micActive
                          ? 'bg-rose-600 hover:bg-rose-700 text-white'
                          : 'bg-amber-400 hover:bg-amber-500 text-slate-950 font-bold'
                      }`}
                    >
                      {micActive ? (
                        <>
                          <MicOff className="w-4 h-4" />
                          <span>{t.stopAzanBtn}</span>
                        </>
                      ) : (
                        <>
                          <Mic className="w-4 h-4 text-emerald-950" />
                          <span>{t.startAzanBtn}</span>
                        </>
                      )}
                    </button>
                  </div>
                )}

                {/* 4. Daily Hadith Panel */}
                <div className="bg-white rounded-3xl card-shadow border border-gray-100 p-5 text-center relative overflow-hidden">
                  <div className="absolute -top-1 right-8 w-6 h-6 rounded-full bg-emerald-50 animate-ping"></div>
                  
                  <span className="text-[10px] text-emerald-700 font-extrabold uppercase tracking-widest font-mono block mb-2.5">
                    ✨ {t.hadithTitle}
                  </span>
                  
                  <p className="text-slate-700 text-sm font-semibold leading-relaxed font-sans max-w-xs mx-auto mb-3 italic">
                    "{activeHadith?.text || "Sadaqah (Charity) does not decrease wealth, and Allah increases the honor of one who forgives."}"
                  </p>
                  
                  <span className="text-[9px] font-mono text-emerald-800 bg-emerald-50 py-1 px-3 rounded-full">
                    {t.hadithReference}: {activeHadith?.reference || "Sahih Muslim"}
                  </span>
                </div>

                {/* 5. Compact Prayer Timetable quick check */}
                <div className="bg-white rounded-3xl border border-gray-100 card-shadow p-5 text-left">
                  <div className="flex justify-between items-center mb-3">
                    <h3 className="text-xs font-bold text-slate-800 uppercase font-mono tracking-wider">Quick Waqt Check</h3>
                    <button 
                      id="home-btn-goto-timetables"
                      onClick={() => setCurrentTab('azan')}
                      className="text-xs font-extrabold text-emerald-800 hover:underline"
                    >
                      Configure / Search
                    </button>
                  </div>
                  <div className="grid grid-cols-5 gap-1.5 font-mono">
                    {[
                      { name: 'Fajr', val: timetable.fajr },
                      { name: 'Zohar', val: timetable.dhuhr },
                      { name: 'Asar', val: timetable.asr },
                      { name: 'Maghrib', val: timetable.maghrib },
                      { name: 'Isha', val: timetable.isha }
                    ].map((row) => (
                      <div key={row.name} className="bg-slate-50/70 py-2 rounded-xl text-center border">
                        <span className="text-[9px] text-slate-400 font-bold block">{row.name}</span>
                        <span className="text-[10px] font-bold text-slate-800 tracking-tighter block mt-0.5">{row.val.split(' ')[0]}</span>
                      </div>
                    ))}
                  </div>
                </div>

              </div>
            )}

            {/* TAB 2: DAILY AZAN ALARM & TIMETABLES */}
            {currentTab === 'azan' && (
              <div className="flex flex-col gap-4 pb-20">
                <TimetableScreen 
                  currentLanguage={lang} 
                  masjidCity="Mubarakpur" 
                />
                <DuaScreen currentLanguage={lang} />
                <NamazGuideScreen currentLanguage={lang} />
              </div>
            )}

            {/* TAB 3: ONLINE CHANDA DONATIONS */}
            {currentTab === 'donate' && (
              <div className="pb-20">
                <DonateScreen 
                  currentLanguage={lang} 
                  masjidId="m1" 
                  donorNameInitial={user?.name || ''} 
                />
              </div>
            )}

            {/* TAB 4: SOS EMERGENCY HELP (MADAD FORMS) */}
            {currentTab === 'help' && (
              <div className="pb-20">
                {isGuest ? (
                  <div className="p-8 text-center bg-white rounded-3xl border border-slate-100 shadow-md max-w-sm mx-auto my-12">
                    <User className="w-10 h-10 text-emerald-800 bg-emerald-50 p-2 rounded-full mx-auto mb-3" />
                    <h3 className="text-sm font-bold text-slate-800">Verified Member Invitation Required</h3>
                    <p className="text-xs text-slate-500 mt-1 max-w-xs leading-relaxed">
                      Welfare submission requests and repayment pathways are strictly secured. Please request a 6-digit invitation access code from your Imam and login.
                    </p>
                    <button
                      id="guest-btn-goto-login"
                      onClick={handleLogout}
                      className="mt-5 bg-emerald-800 text-white font-bold py-2.5 px-6 rounded-xl text-xs"
                    >
                      Login using Masjid Code
                    </button>
                  </div>
                ) : (
                  <MadadScreen 
                    currentLanguage={lang} 
                    masjidId="m1" 
                    memberProfile={user} 
                  />
                )}
              </div>
            )}

            {/* TAB 5: ADMIN COCKPIT CONTROL */}
            {currentTab === 'admin' && (
              <div className="pb-20">
                {user?.role === 'admin' ? (
                  <AdminScreen 
                    currentLanguage={lang} 
                    masjidId="m1" 
                    onPostNotificationCallback={loadMasjidFeed} 
                  />
                ) : (
                  <div className="p-8 text-center bg-white rounded-3xl border border-slate-100 shadow-md max-w-sm mx-auto my-12">
                    <Key className="w-10 h-10 text-rose-800 bg-rose-50 p-2 rounded-full mx-auto mb-3" />
                    <h3 className="text-sm font-bold text-slate-800">Admin Account Required</h3>
                    <p className="text-xs text-slate-500 mt-1 max-w-xs leading-relaxed">
                      You are logged in as a congregation member. The admin panel is limited to the Imam Mutawalli.
                    </p>
                  </div>
                )}
              </div>
            )}

            {/* 4. PERSISTENT LOWER BOT NAV HIERARCHY */}
            <nav className="fixed bottom-0 left-0 right-0 max-w-md mx-auto bg-white/95 backdrop-blur-md rounded-t-3xl shadow-[0_-4px_24px_rgba(0,0,0,0.06)] border-t border-slate-100 p-2 z-40 flex justify-around">
              {[
                { key: 'home', label: 'Home', icon: <Compass className="w-4 h-4" /> },
                { key: 'azan', label: 'Guide', icon: <BookOpen className="w-4 h-4" /> },
                { key: 'donate', label: 'Donate', icon: <HeartHandshake className="w-4 h-4" /> },
                { key: 'help', label: 'Madad', icon: <User className="w-4 h-4" /> },
                // Admin tab appears conditionally or stays visible for quick inspect
                ...(user?.role === 'admin' ? [{ key: 'admin', label: 'Admin', icon: <ShieldCheck className="w-4 h-4" /> }] : [])
              ].map((btn) => {
                const isActive = currentTab === btn.key;
                return (
                  <button
                    key={btn.key}
                    id={`nav-tab-low-${btn.key}`}
                    onClick={() => setCurrentTab(btn.key as any)}
                    className={`flex flex-col items-center justify-center py-2 px-3 rounded-2xl transition-all duration-300 relative ${
                      isActive 
                        ? 'text-emerald-800 font-extrabold scale-105' 
                        : 'text-slate-400 hover:text-slate-600'
                    }`}
                  >
                    {btn.icon}
                    <span className="text-[10px] font-bold mt-1 tracking-wide">{btn.label}</span>
                    {isActive && (
                      <motion.div 
                        layoutId="active-tab-underflow-dot"
                        className="absolute bottom-0.5 w-1.5 h-1.5 rounded-full bg-emerald-800" 
                      />
                    )}
                  </button>
                );
              })}
            </nav>

          </div>
        )}
      </main>
    </div>
  );
}
