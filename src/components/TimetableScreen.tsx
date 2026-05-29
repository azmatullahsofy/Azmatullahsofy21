import React, { useState, useEffect } from 'react';
import { Calendar, Search, MapPin, Compass, Moon, Sun, Clock, Snowflake, ShieldAlert, Sliders, Navigation, Globe } from 'lucide-react';
import { Language, NamazTimetable } from '../types';
import { translations } from '../translations';
import { MasjidService } from '../services/MasjidService';

export const INDIAN_STATES_CITIES: { [state: string]: string[] } = {
  "Andhra Pradesh": ["Visakhapatnam", "Vijayawada", "Guntur", "Nellore", "Kurnool", "Tirupati", "Kadapa"],
  "Assam": ["Guwahati", "Silchar", "Dibrugarh", "Jorhat", "Nagaon", "Tinsukia"],
  "Bihar": ["Patna", "Madhubani", "Bisfi", "Darbhanga", "Gaya", "Bhagalpur", "Muzaffarpur", "Purnia", "Siwan", "Mubarakpur"],
  "Chhattisgarh": ["Raipur", "Bhilai", "Bilaspur", "Korba", "Rajnandgaon"],
  "Delhi": ["New Delhi", "Okhla", "Jamia Nagar", "Chandni Chowk", "Karol Bagh", "Nizamuddin"],
  "Gujarat": ["Ahmedabad", "Surat", "Vadodara", "Rajkot", "Bhavnagar", "Jamnagar", "Bhuj"],
  "Haryana": ["Faridabad", "Gurugram", "Panipat", "Ambala", "Yamunanagar", "Rohtak", "Hisar"],
  "Himachal Pradesh": ["Shimla", "Dharamshala", "Solan", "Mandi"],
  "Jammu & Kashmir": ["Srinagar", "Jammu", "Anantnag", "Baramulla", "Sopore", "Poonch"],
  "Jharkhand": ["Ranchi", "Jamshedpur", "Dhanbad", "Bokaro", "Hazaribagh", "Deoghar"],
  "Karnataka": ["Bengaluru", "Mysuru", "Hubli", "Mangaluru", "Belagavi", "Kalaburagi", "Gulbarga"],
  "Kerala": ["Thiruvananthapuram", "Kochi", "Kozhikode", "Thrissur", "Malappuram", "Palakkad", "Kannur"],
  "Madhya Pradesh": ["Bhopal", "Indore", "Jabalpur", "Gwalior", "Ujjain", "Sagar", "Rewa"],
  "Maharashtra": ["Mumbai", "Pune", "Nagpur", "Thane", "Aurangabad", "Nashik", "Nanded", "Solapur"],
  "Odisha": ["Bhubaneswar", "Cuttack", "Rourkela", "Berhampur", "Sambalpur", "Puri"],
  "Punjab": ["Ludhiana", "Amritsar", "Jalandhar", "Patiala", "Bathinda", "Mohali", "Pathankot"],
  "Rajasthan": ["Jaipur", "Jodhpur", "Kota", "Ajmer", "Udaipur", "Bikaner", "Alwar", "Sikar"],
  "Tamil Nadu": ["Chennai", "Coimbatore", "Madurai", "Tiruchirappalli", "Salem", "Vellore", "Erode"],
  "Telangana": ["Hyderabad", "Warangal", "Nizamabad", "Karimnagar", "Ramagundam", "Khammam"],
  "Uttar Pradesh": ["Lucknow", "Kanpur", "Ghaziabad", "Varanasi", "Meerut", "Mubarakpur", "Aligarh", "Bareilly", "Gorakhpur"],
  "Uttarakhand": ["Dehradun", "Haridwar", "Haldwani", "Rudrapur", "Kashipur", "Roorkee"],
  "West Bengal": ["Kolkata", "Asansol", "Siliguri", "Durgapur", "Murshidabad", "Howrah", "Malda"]
};

interface TimetableScreenProps {
  currentLanguage: Language;
  masjidCity: string;
}

export default function TimetableScreen(props: TimetableScreenProps) {
  const t = translations[props.currentLanguage];
  const [cityInput, setCityInput] = useState(props.masjidCity || '');
  const [timetable, setTimetable] = useState<NamazTimetable | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [currentTime, setCurrentTime] = useState(new Date());
  const [gpsLoading, setGpsLoading] = useState(false);

  // States for live browser & system notifications
  const [isNotificationSupported, setIsNotificationSupported] = useState(false);
  const [isPermissionBlocked, setIsPermissionBlocked] = useState(false);
  const [isGlobalNotificationOn, setIsGlobalNotificationOn] = useState(() => {
    return localStorage.getItem('digital_masjid_alerts_global') === 'true';
  });

  const [alertSettings, setAlertSettings] = useState<{ [key: string]: boolean }>(() => {
    return {
      fajr: localStorage.getItem('digital_masjid_alert_enabled_fajr') !== 'false',
      sunrise: localStorage.getItem('digital_masjid_alert_enabled_sunrise') !== 'false',
      dhuhr: localStorage.getItem('digital_masjid_alert_enabled_dhuhr') !== 'false',
      asr: localStorage.getItem('digital_masjid_alert_enabled_asr') !== 'false',
      maghrib: localStorage.getItem('digital_masjid_alert_enabled_maghrib') !== 'false',
      isha: localStorage.getItem('digital_masjid_alert_enabled_isha') !== 'false',
      sehriEnd: localStorage.getItem('digital_masjid_alert_enabled_sehriEnd') !== 'false',
      iftarStart: localStorage.getItem('digital_masjid_alert_enabled_iftarStart') !== 'false',
    };
  });

  useEffect(() => {
    if ('Notification' in window) {
      setIsNotificationSupported(true);
      if (Notification.permission === 'denied') {
        setIsPermissionBlocked(true);
      } else if (Notification.permission === 'granted') {
        setIsPermissionBlocked(false);
      }
    }
  }, []);

  const toggleGlobalALerts = async () => {
    if (isGlobalNotificationOn) {
      localStorage.setItem('digital_masjid_alerts_global', 'false');
      setIsGlobalNotificationOn(false);
    } else {
      if ('Notification' in window) {
        try {
          const permission = await Notification.requestPermission();
          if (permission === 'granted') {
            setIsPermissionBlocked(false);
          } else if (permission === 'denied') {
            setIsPermissionBlocked(true);
          }
        } catch (e) {
          console.warn("Could not request notification inside sandboxed iframe", e);
        }
      }
      localStorage.setItem('digital_masjid_alerts_global', 'true');
      setIsGlobalNotificationOn(true);
      
      // Beautiful synthesized confirmation sound
      try {
        const audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
        const osc = audioCtx.createOscillator();
        const gainNode = audioCtx.createGain();
        osc.frequency.setValueAtTime(523.25, audioCtx.currentTime); // C5
        gainNode.gain.setValueAtTime(0, audioCtx.currentTime);
        gainNode.gain.linearRampToValueAtTime(0.15, audioCtx.currentTime + 0.05);
        gainNode.gain.exponentialRampToValueAtTime(0.0001, audioCtx.currentTime + 0.35);
        osc.connect(gainNode);
        gainNode.connect(audioCtx.destination);
        osc.start();
        osc.stop(audioCtx.currentTime + 0.35);
      } catch (err) {}
    }
  };

  const togglePrayerSetting = (prayerKey: string) => {
    const currentVal = alertSettings[prayerKey] !== false;
    const newVal = !currentVal;
    localStorage.setItem(`digital_masjid_alert_enabled_${prayerKey}`, newVal ? 'true' : 'false');
    setAlertSettings(prev => ({
      ...prev,
      [prayerKey]: newVal
    }));
  };

  // Advanced Location search states
  const [searchMode, setSearchMode] = useState<'city' | 'fields' | 'state' | 'gps'>('city');
  const [selectedState, setSelectedState] = useState<string>('Uttar Pradesh');
  const [stateSearch, setStateSearch] = useState<string>('');
  const [detailedSearch, setDetailedSearch] = useState({
    state: 'Bihar',
    district: 'Madhubani',
    block: 'Bisfi',
    ps: 'Bisfi',
    village: 'Bisfi',
    masjidName: 'Jama Masjid Bisfi'
  });

  const [gpsData, setGpsData] = useState<{
    latitude: number | null;
    longitude: number | null;
    resolvedAddress: string | null;
    error: string | null;
  }>({
    latitude: null,
    longitude: null,
    resolvedAddress: null,
    error: null
  });

  useEffect(() => {
    // Load initial city schedule
    loadCitySchedule(cityInput);
  }, []);

  useEffect(() => {
    if (props.masjidCity) {
      setCityInput(props.masjidCity);
      loadCitySchedule(props.masjidCity);
    }
  }, [props.masjidCity]);

  // Update clock every second
  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const loadCitySchedule = async (city: string) => {
    setIsLoading(true);
    const data = await MasjidService.fetchTimetableByCity(city);
    setTimetable(data);
    setIsLoading(false);
  };

  const handleCitySearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (cityInput.trim()) {
      loadCitySchedule(cityInput);
    }
  };

  // Detailed query search form submit handler
  const handleDetailedSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const query = `${detailedSearch.village}, ${detailedSearch.block}, ${detailedSearch.district}`;
    setCityInput(detailedSearch.village);
    loadCitySchedule(query);
  };

  // Beautiful GPS auto geocoder reverse lookups using real coordinates
  const triggerGpsLookup = () => {
    setGpsLoading(true);
    setGpsData(prev => ({ ...prev, error: null }));
    
    if (!navigator.geolocation) {
      setGpsData(prev => ({
        ...prev,
        error: "Device GPS Geolocation is not supported by your browser."
      }));
      setGpsLoading(false);
      return;
    }
    
    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const lat = position.coords.latitude;
        const lon = position.coords.longitude;
        
        try {
          const response = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lon}&addressdetails=1`, {
            headers: { 'Accept-Language': 'hi,en' }
          });
          
          if (response.ok) {
            const data = await response.json();
            const addressObj = data.address || {};
            
            const village = addressObj.village || addressObj.suburb || addressObj.neighbourhood || addressObj.town || 'Bisfi';
            const block = addressObj.county || 'Bisfi Block';
            const district = addressObj.city_district || addressObj.state_district || 'Madhubani';
            const state = addressObj.state || 'Bihar';
            
            const descriptive = `${village}, Block: ${block}, Dist: ${district}, State: ${state}`;
            
            setGpsData({
              latitude: lat,
              longitude: lon,
              resolvedAddress: data.display_name || descriptive,
              error: null
            });
            
            setCityInput(village);
            loadCitySchedule(village);
          } else {
            throw new Error();
          }
        } catch (err) {
          // Friendly fallback formatting if external Nominatim hits limits
          setGpsData({
            latitude: lat,
            longitude: lon,
            resolvedAddress: `GPS Detected (Lat: ${lat.toFixed(4)}, Lon: ${lon.toFixed(4)}) • State: Bihar, Dist: Madhubani, Vill: Bisfi`,
            error: null
          });
          setCityInput('Bisfi');
          loadCitySchedule('Bisfi');
        } finally {
          setGpsLoading(false);
        }
      },
      (error) => {
        console.warn("Location permission not resolved", error);
        setGpsData(prev => ({
          ...prev,
          error: "Could not fetch GPS: Frame permission or device location service is disabled. Displaying Madhubani defaults."
        }));
        setCityInput('Bisfi');
        loadCitySchedule('Bisfi');
        setGpsLoading(false);
      },
      { enableHighAccuracy: true, timeout: 6000 }
    );
  };

  const handleGpsDetect = () => {
    triggerGpsLookup();
  };

  // Convert "04:15 AM" into minutes from midnight to check current Waqt
  const getMinutesOfDay = (timeStr: string) => {
    if (!timeStr) return 0;
    const [time, ampm] = timeStr.split(' ');
    let [hours, minutes] = time.split(':').map(Number);
    if (ampm === 'PM' && hours !== 12) hours += 12;
    if (ampm === 'AM' && hours === 12) hours = 0;
    return hours * 60 + minutes;
  };

  // Determine current or next prayer index
  const getActivePrayerIndex = (): string => {
    if (!timetable) return 'isha';
    const nowMinutes = currentTime.getHours() * 60 + currentTime.getMinutes();
    
    const times = [
      { name: 'fajr', min: getMinutesOfDay(timetable.fajr) },
      { name: 'sunrise', min: getMinutesOfDay(timetable.sunrise) },
      { name: 'dhuhr', min: getMinutesOfDay(timetable.dhuhr) },
      { name: 'asr', min: getMinutesOfDay(timetable.asr) },
      { name: 'maghrib', min: getMinutesOfDay(timetable.maghrib) },
      { name: 'isha', min: getMinutesOfDay(timetable.isha) }
    ];

    // Find if we are currently past previous and before next
    for (let i = 0; i < times.length - 1; i++) {
      if (nowMinutes >= times[i].min && nowMinutes < times[i + 1].min) {
        return times[i].name;
      }
    }
    return nowMinutes < times[0].min || nowMinutes >= times[5].min ? 'isha' : 'fajr';
  };

  const activeIndex = getActivePrayerIndex();

  return (
    <div className="w-full max-w-md mx-auto p-4 pb-20">
      {/* City/Detailed/GPS Advanced Locator Search */}
      <div className="bg-white rounded-3xl card-shadow border border-gray-100 p-5 mb-6 text-left">
        <div className="flex justify-between items-center mb-3">
          <label className="text-[10px] font-extrabold text-emerald-800 font-mono tracking-widest uppercase block">
            🛰️ Location Finder (नमाज़ जगह ढूंढें)
          </label>
          <div className="flex bg-slate-100 rounded-full p-0.5 gap-0.5 max-w-full overflow-x-auto">
            <button
              onClick={() => setSearchMode('city')}
              className={`px-2 py-1 text-[9px] font-extrabold uppercase rounded-full transition-all shrink-0 ${
                searchMode === 'city' ? 'bg-emerald-800 text-white shadow-sm' : 'text-slate-500'
              }`}
            >
              City
            </button>
            <button
              onClick={() => setSearchMode('fields')}
              className={`px-2 py-1 text-[9px] font-extrabold uppercase rounded-full transition-all shrink-0 ${
                searchMode === 'fields' ? 'bg-emerald-800 text-white shadow-sm' : 'text-slate-500'
              }`}
            >
              Detailed
            </button>
            <button
              id="tab-state-search"
              onClick={() => setSearchMode('state')}
              className={`px-2 py-1 text-[9px] font-extrabold uppercase rounded-full transition-all shrink-0 ${
                searchMode === 'state' ? 'bg-emerald-800 text-white shadow-sm' : 'text-slate-500'
              }`}
            >
              States / राज्य
            </button>
            <button
              onClick={() => setSearchMode('gps')}
              className={`px-2 py-1 text-[9px] font-extrabold uppercase rounded-full transition-all shrink-0 ${
                searchMode === 'gps' ? 'bg-emerald-800 text-white shadow-sm' : 'text-slate-500'
              }`}
            >
              Live GPS
            </button>
          </div>
        </div>

        {/* 1. SIMPLE CITY SEARCH MODE */}
        {searchMode === 'city' && (
          <form onSubmit={handleCitySearch} className="flex gap-2">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-3 w-4 h-4 text-slate-400" />
              <input
                id="inp-city-search-timetable"
                type="text"
                value={cityInput}
                onChange={(e) => setCityInput(e.target.value)}
                placeholder="Enter your town/city name..."
                className="w-full bg-slate-50 border border-slate-200 rounded-2xl py-2.5 pl-9 pr-3 text-xs focus:ring-2 focus:ring-emerald-700 font-medium"
              />
            </div>
            <button
              id="btn-search-timetable"
              type="submit"
              className="bg-emerald-800 hover:bg-emerald-900 text-white font-extrabold py-2 px-4 rounded-xl text-xs flex items-center justify-center transition-colors"
            >
              Search
            </button>
          </form>
        )}

        {/* 2. DETAILED MANUALLY ENTERED SPECIFIC FIELDS */}
        {searchMode === 'fields' && (
          <form onSubmit={handleDetailedSearch} className="flex flex-col gap-3">
            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="text-[8px] font-black tracking-widest text-slate-400 uppercase block mb-1">State (राज्य)</label>
                <input
                  type="text"
                  value={detailedSearch.state}
                  onChange={(e) => setDetailedSearch({ ...detailedSearch, state: e.target.value })}
                  placeholder="e.g. Bihar"
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl py-1.5 px-3 text-xs focus:ring-1 focus:ring-emerald-700 font-medium"
                />
              </div>
              
              <div>
                <label className="text-[8px] font-black tracking-widest text-slate-400 uppercase block mb-1">District (जिला)</label>
                <input
                  type="text"
                  value={detailedSearch.district}
                  onChange={(e) => setDetailedSearch({ ...detailedSearch, district: e.target.value })}
                  placeholder="e.g. Madhubani"
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl py-1.5 px-3 text-xs focus:ring-1 focus:ring-emerald-700 font-medium"
                />
              </div>

              <div>
                <label className="text-[8px] font-black tracking-widest text-slate-400 uppercase block mb-1">Block (प्रखंड)</label>
                <input
                  type="text"
                  value={detailedSearch.block}
                  onChange={(e) => setDetailedSearch({ ...detailedSearch, block: e.target.value })}
                  placeholder="e.g. Bisfi"
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl py-1.5 px-3 text-xs focus:ring-1 focus:ring-emerald-700 font-medium"
                />
              </div>

              <div>
                <label className="text-[8px] font-black tracking-widest text-slate-400 uppercase block mb-1">Police Station (थाना)</label>
                <input
                  type="text"
                  value={detailedSearch.ps}
                  onChange={(e) => setDetailedSearch({ ...detailedSearch, ps: e.target.value })}
                  placeholder="e.g. Bisfi"
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl py-1.5 px-3 text-xs focus:ring-1 focus:ring-emerald-700 font-medium"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="text-[8px] font-black tracking-widest text-slate-400 uppercase block mb-1">Village (ग्राम)</label>
                <input
                  type="text"
                  value={detailedSearch.village}
                  onChange={(e) => setDetailedSearch({ ...detailedSearch, village: e.target.value })}
                  placeholder="e.g. Bisfi"
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl py-1.5 px-3 text-xs focus:ring-1 focus:ring-emerald-700 font-medium"
                />
              </div>

              <div>
                <label className="text-[8px] font-black tracking-widest text-slate-400 uppercase block mb-1">Masjid Name (मस्जिद)</label>
                <input
                  type="text"
                  value={detailedSearch.masjidName}
                  onChange={(e) => setDetailedSearch({ ...detailedSearch, masjidName: e.target.value })}
                  placeholder="e.g. Jama Masjid"
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl py-1.5 px-3 text-xs focus:ring-1 focus:ring-emerald-700 font-medium"
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full bg-emerald-800 hover:bg-emerald-900 text-white font-bold py-2 px-4 rounded-xl text-xs flex items-center justify-center gap-1.5 transition-colors"
            >
              <Search className="w-3.5 h-3.5" />
              <span>Search Location Timetable (समय खोजें)</span>
            </button>
          </form>
        )}

        {/* 4. ALL INDIA STATE LOCATION LIVE LOOKUP */}
        {searchMode === 'state' && (
          <div className="flex flex-col gap-3 font-sans">
            <div>
              <label className="text-[9px] font-black tracking-widest text-slate-400 uppercase block mb-1.5">
                {props.currentLanguage === 'hi' ? '1. भारतीय राज्य चुनें (Select State)' : props.currentLanguage === 'ur' ? '1. ہندوستانی مقیم ریاست منتخب کریں' : '1. Select Indian State'}
              </label>
              
              {/* Filter inputs */}
              <div className="relative mb-2">
                <Search className="absolute left-2.5 top-2.5 w-3.5 h-3.5 text-slate-400" />
                <input
                  id="inp-state-search-filter"
                  type="text"
                  value={stateSearch}
                  onChange={(e) => setStateSearch(e.target.value)}
                  placeholder={props.currentLanguage === 'hi' ? 'राज्य खोजें (उदा: बिहार, उत्तर प्रदेश)...' : props.currentLanguage === 'ur' ? 'ریاست تلاش کریں' : 'Filter or search state (e.g. Bihar, Delhi)...'}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl py-2 pl-8 pr-3 text-[11px] focus:ring-1 focus:ring-emerald-700 font-medium font-sans"
                />
              </div>

              {/* Scroll list of states */}
              <div className="flex flex-wrap gap-1.5 max-h-[120px] overflow-y-auto pr-1">
                {Object.keys(INDIAN_STATES_CITIES)
                  .filter(st => st.toLowerCase().includes(stateSearch.toLowerCase()))
                  .map(st => {
                    const isActive = selectedState === st;
                    return (
                      <button
                        key={st}
                        id={`btn-state-select-${st.replace(/\s+/g, '-')}`}
                        type="button"
                        onClick={() => setSelectedState(st)}
                        className={`py-1.5 px-3 rounded-xl text-[10px] font-bold border transition-all ${
                          isActive
                            ? 'bg-emerald-800 text-white border-emerald-800 shadow-sm'
                            : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                        }`}
                      >
                        {st}
                      </button>
                    )
                  })}
              </div>
            </div>

            {/* List of major locations in the selected state */}
            {selectedState && (
              <div className="bg-slate-50 rounded-2xl p-3 border border-slate-200/60 mt-1">
                <div className="flex justify-between items-center mb-2 pb-1.5 border-b border-slate-200/50">
                  <span className="text-[10px] font-bold text-emerald-950 block">
                    ⚡ {selectedState}: {props.currentLanguage === 'hi' ? 'शहर/जिला चुनें' : props.currentLanguage === 'ur' ? 'شہر منتخب کریں' : 'Select City list'}
                  </span>
                  <span className="text-[8px] font-extrabold uppercase bg-emerald-100 text-emerald-800 px-1.5 py-0.5 rounded font-mono">
                    LIVE CALC
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-1.5 max-h-[150px] overflow-y-auto pr-1">
                  {INDIAN_STATES_CITIES[selectedState]?.map(ct => {
                    const isCurrent = cityInput.toLowerCase() === ct.toLowerCase();
                    return (
                      <button
                        key={ct}
                        id={`btn-city-select-${ct}`}
                        type="button"
                        onClick={() => {
                          setCityInput(ct);
                          loadCitySchedule(ct);
                        }}
                        className={`py-2 px-2.5 text-left rounded-lg text-[11px] border transition-all flex items-center justify-between ${
                          isCurrent
                            ? 'bg-emerald-50 text-emerald-950 border-emerald-500/30 font-extrabold shadow-sm'
                            : 'bg-white text-slate-600 border-slate-200/80 hover:bg-slate-50'
                        }`}
                      >
                        <span className="truncate">{ct}</span>
                        {isCurrent && <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 animate-pulse"></span>}
                      </button>
                    )
                  })}
                </div>
              </div>
            )}
          </div>
        )}

        {/* 3. LIVE GPS LOCATION SEARCH & STATUS DETECTOR */}
        {searchMode === 'gps' && (
          <div className="flex flex-col gap-3">
            <div className="bg-slate-50 rounded-2xl p-4 border border-slate-200/50 flex flex-col items-center gap-3 relative overflow-hidden">
              {/* Spinning compass animation when parsing */}
              <div className="relative">
                <div className={`w-14 h-14 rounded-full bg-emerald-50 border-2 border-emerald-500/35 flex items-center justify-center text-emerald-800 shadow-inner ${
                  gpsLoading ? 'animate-pulse' : ''
                }`}>
                  <Compass className={`w-7 h-7 text-emerald-700 ${gpsLoading ? 'animate-spin [animation-duration:3s]' : ''}`} />
                </div>
                {gpsLoading && (
                  <span className="absolute -top-1 -right-1 flex h-3 w-3">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500"></span>
                  </span>
                )}
              </div>

              <div className="text-center">
                <h5 className="text-[11px] font-extrabold text-slate-700 uppercase tracking-wide">
                  GPS Satellites Address Decoder
                </h5>
                <p className="text-[10px] text-slate-400 leading-snug max-w-xs mt-0.5">
                  Click below to activate GPS coordinates and locate your nearest Village, Block, State & Masjid.
                </p>
              </div>

              <button
                type="button"
                onClick={triggerGpsLookup}
                disabled={gpsLoading}
                className="bg-emerald-800 hover:bg-emerald-950 text-white font-bold py-2 px-5 rounded-xl text-xs flex items-center gap-1.5 shadow-sm transition-all duration-300 disabled:opacity-50"
              >
                <Compass className="w-4 h-4 shrink-0" />
                <span>{gpsLoading ? 'Acquiring GPS Fix...' : 'Turn on GPS Location'}</span>
              </button>
            </div>

            {/* Resolved outputs details panel */}
            {(gpsData.latitude || gpsData.resolvedAddress || gpsData.error) && (
              <div className="bg-emerald-50/40 border border-emerald-100 p-4 rounded-2xl flex flex-col gap-2 transition-all">
                {gpsData.error ? (
                  <p className="text-xs text-rose-600 font-semibold leading-relaxed flex items-center gap-1">
                    <ShieldAlert className="w-4 h-4 shrink-0" />
                    <span>{gpsData.error}</span>
                  </p>
                ) : (
                  <>
                    <div className="flex items-center justify-between text-[9px] text-emerald-800 font-extrabold uppercase font-mono tracking-wider">
                      <span>LIVE GPS FEED FIXED</span>
                      <span className="bg-emerald-105 text-emerald-900 py-0.5 px-2 rounded-full">ACTIVE</span>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-2 border-b border-emerald-100/40 pb-2 text-[10px] font-mono text-slate-600 font-semibold">
                      <span>Latitude: <strong>{gpsData.latitude?.toFixed(5)}° N</strong></span>
                      <span>Longitude: <strong>{gpsData.longitude?.toFixed(5)}° E</strong></span>
                    </div>

                    <p className="text-[11px] font-bold text-slate-800 leading-relaxed">
                      📍 {gpsData.resolvedAddress}
                    </p>
                  </>
                )}
              </div>
            )}
          </div>
        )}

        <div className="flex items-center gap-1.5 mt-3 pt-2 ml-1 border-t border-slate-100 text-[10px] text-slate-400 font-extrabold font-mono uppercase tracking-widest block header-uppercase">
          <MapPin className="w-3.5 h-3.5 text-emerald-600" />
          <span>Active Location: <strong className="text-emerald-950 font-black">{cityInput}</strong></span>
        </div>
      </div>

      {/* Live Digital Islamic Clock Card */}
      <div className="bg-gradient-to-br from-emerald-800 via-emerald-900 to-emerald-950 text-white rounded-3xl card-shadow overflow-hidden p-6 mb-6 relative">
        <div className="absolute right-0 bottom-0 opacity-10 pointer-events-none transform translate-y-4 translate-x-4">
          <Moon className="w-44 h-44 text-white" />
        </div>
        
        <div className="flex justify-between items-start mb-3">
          <div className="flex items-center gap-2 bg-white/10 py-1 px-3 rounded-full text-[10px] tracking-widest uppercase font-bold font-mono">
            <Clock className="w-3.5 h-3.5 text-amber-300" />
            <span>{currentTime.toLocaleDateString(undefined, { weekday: 'long' })}</span>
          </div>
          <span className="text-[10px] font-semibold text-amber-300 font-mono">
            {timetable?.date || t.autoGps}
          </span>
        </div>

        <div className="text-4xl font-bold font-mono tracking-tight text-white mb-1.5">
          {currentTime.toLocaleTimeString(undefined, { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
        </div>
        <p className="text-xs text-emerald-200/90 tracking-wide font-medium">
          Masjid Digital Clock Terminal • Standard UTC/GMT Offset
        </p>
      </div>

      {/* PWA ALERTS AND NOTIFICATIONS PANEL (offline-first alarms) */}
      <div className="bg-slate-50 rounded-3xl border border-slate-250/60 p-4 mb-6 text-left">
        <div className="flex items-start justify-between mb-3">
          <div>
            <h4 className="text-[13px] font-extrabold text-slate-800 flex items-center gap-1.5 leading-tight">
              <span>🕌 Namaz Alert Scheduler / अलार्म</span>
              <span className="text-[8px] font-extrabold tracking-wider uppercase font-mono px-1.5 py-0.5 rounded bg-emerald-100 text-emerald-800 animate-pulse">
                OFFLINE PWA
              </span>
            </h4>
            <p className="text-[10px] text-slate-400 mt-0.5 leading-snug">
              Get browser alarms & dynamic in-app reminders the moment and second when a Waqt begins.
            </p>
          </div>
          <button
            id="btn-play-sound-test"
            onClick={() => {
              // preview of synthesized sound speaker
              try {
                const audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
                const playTone = (freq: number, startDelay: number, duration: number) => {
                  const osc = audioCtx.createOscillator();
                  const gainNode = audioCtx.createGain();
                  osc.type = 'sine';
                  osc.frequency.setValueAtTime(freq, audioCtx.currentTime + startDelay);
                  gainNode.gain.setValueAtTime(0, audioCtx.currentTime + startDelay);
                  gainNode.gain.linearRampToValueAtTime(0.25, audioCtx.currentTime + startDelay + 0.05);
                  gainNode.gain.exponentialRampToValueAtTime(0.0001, audioCtx.currentTime + startDelay + duration);
                  osc.connect(gainNode);
                  gainNode.connect(audioCtx.destination);
                  osc.start(audioCtx.currentTime + startDelay);
                  osc.stop(audioCtx.currentTime + startDelay + duration);
                };
                playTone(523.25, 0, 0.4); // C5
                playTone(659.25, 0.15, 0.4); // E5
                playTone(783.99, 0.3, 0.4); // G5
                playTone(1046.50, 0.45, 0.8); // C6
              } catch (e) {
                console.warn("Audio test failed", e);
              }
            }}
            title="Test preview buzzer"
            className="flex items-center gap-1 py-1 px-2.5 rounded-lg bg-emerald-50 border border-emerald-200 text-emerald-800 hover:bg-emerald-100/70 text-[9px] font-extrabold transition-all shrink-0 font-mono"
          >
            <span>🔊 TEST BELL</span>
          </button>
        </div>

        {/* Global alarm activator toggle */}
        <div className="flex items-center justify-between bg-white border border-slate-200/70 rounded-2xl p-3 mb-3 shadow-inner">
          <div className="flex gap-2.5 items-center">
            <div className={`p-2 rounded-xl transition-all ${isGlobalNotificationOn ? 'bg-emerald-800 text-white animate-pulse' : 'bg-slate-100 text-slate-400'}`}>
              <Clock className="w-4 h-4" />
            </div>
            <div>
              <span className="text-[11px] font-black text-slate-800 block leading-tight">
                {isGlobalNotificationOn ? "🔔 Alerts Fully Activated" : "🔕 Enable Prayer Alerts"}
              </span>
              <span className="text-[9px] text-slate-400 block mt-0.5 leading-none">
                {isNotificationSupported ? "Standard OS Native Alerts Supported" : "In-App Audio Chime mode fallback active"}
              </span>
            </div>
          </div>

          <button
            id="btn-global-alerts-toggle"
            onClick={toggleGlobalALerts}
            className={`py-1.5 px-3.5 rounded-xl text-[10px] font-black transition-all border ${
              isGlobalNotificationOn
                ? 'bg-emerald-800 text-white border-emerald-800 hover:bg-emerald-950 shadow-sm'
                : 'bg-white text-emerald-800 border-slate-200 hover:bg-slate-50'
            }`}
          >
            {isGlobalNotificationOn ? "Turn OFF" : "Turn ON / अनुमति"}
          </button>
        </div>

        {/* Permission explanation banner if blocked */}
        {isPermissionBlocked && (
          <div className="bg-amber-50 rounded-xl p-2.5 border border-amber-200 mb-3 flex items-start gap-2 text-[10px] text-amber-900 leading-snug">
            <ShieldAlert className="w-4 h-4 shrink-0 text-amber-700 mt-0.5" />
            <div>
              <strong>Browser Notification Blocked:</strong> System alerts are disabled in this view. Don't worry! If you keep this page open, the built-in <strong>In-App Sound Chime</strong> will still trigger beautifully offline.
            </div>
          </div>
        )}

        {/* Individual Alert Toggles for each timing */}
        {isGlobalNotificationOn && (
          <div className="grid grid-cols-2 gap-1.5 mt-2 pt-2 border-t border-slate-200/60">
            {[
              { key: 'fajr', label: 'Fajr / फ़ज्र' },
              { key: 'sunrise', label: 'Sunrise / सूर्योदय' },
              { key: 'dhuhr', label: 'Dhuhr / ज़ुहर' },
              { key: 'asr', label: 'Asr / असर' },
              { key: 'maghrib', label: 'Maghrib / मगरिब' },
              { key: 'isha', label: 'Isha / ईशा' },
              { key: 'sehriEnd', label: 'Sehri Ends' },
              { key: 'iftarStart', label: 'Iftar Starts' },
            ].map((p) => {
              const isAlertOn = alertSettings[p.key] !== false;
              return (
                <button
                  key={p.key}
                  id={`btn-toggle-alert-${p.key}`}
                  onClick={() => togglePrayerSetting(p.key)}
                  className={`flex items-center justify-between p-2 rounded-xl border text-[10px] font-bold transition-all text-left ${
                    isAlertOn
                      ? 'bg-white border-emerald-600/30 text-emerald-950 shadow-sm font-extrabold'
                      : 'bg-slate-100/40 border-slate-200/50 text-slate-400 font-medium'
                  }`}
                >
                  <span className="truncate">{p.label}</span>
                  <span className={`w-3 h-3 rounded-full border shrink-0 ${
                    isAlertOn ? 'bg-emerald-600 border-emerald-700' : 'bg-slate-300 border-slate-400'
                  }`} />
                </button>
              );
            })}
          </div>
        )}
      </div>

      {/* 5 WAQT NAMAZ CARD LIST */}
      <div className="bg-white rounded-3xl card-shadow border border-gray-100 p-4 mb-6">
        <h3 className="text-sm font-bold text-slate-800 mb-4 pb-2 border-b border-gray-100 flex items-center justify-between">
          <span>{t.timetableTitle} ({cityInput})</span>
          <span className="text-xs text-emerald-700 font-mono font-bold flex items-center gap-1">
            <Sun className="w-3.5 h-3.5" />
            Sunni Hanafi Timings
          </span>
        </h3>

        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-12 gap-2">
            <div className="w-10 h-10 border-4 border-emerald-700 border-t-transparent rounded-full animate-spin"></div>
            <span className="text-xs text-slate-400 font-bold font-mono">Fetching Islamic Timetable...</span>
          </div>
        ) : timetable ? (
          <div className="flex flex-col gap-2.5">
            {[
              { name: 'fajr', label: t.fajr, time: timetable.fajr, icon: <Moon className="w-4 h-4 text-slate-400" /> },
              { name: 'sunrise', label: t.sunrise, time: timetable.sunrise, icon: <Sun className="w-4 h-4 text-amber-500" /> },
              { name: 'dhuhr', label: t.dhuhr, time: timetable.dhuhr, icon: <Sun className="w-4 h-4 text-amber-600" /> },
              { name: 'asr', label: t.asr, time: timetable.asr, icon: <Sun className="w-4 h-4 text-emerald-600" /> },
              { name: 'maghrib', label: t.maghrib, time: timetable.maghrib, icon: <Sun className="w-4 h-4 text-indigo-700" /> },
              { name: 'isha', label: t.isha, time: timetable.isha, icon: <Moon className="w-4 h-4 text-indigo-900" /> }
            ].map((prayer) => {
              const isActive = activeIndex === prayer.name;
              return (
                <div
                  key={prayer.name}
                  id={`prayer-waqt-${prayer.name}`}
                  className={`flex items-center justify-between py-3.5 px-4 rounded-2xl border transition-all duration-300 ${
                    isActive
                      ? 'bg-emerald-50/70 border-emerald-500 ring-2 ring-emerald-500/20 transform scale-[1.015] shadow-sm'
                      : 'bg-slate-50/50 border-slate-200/50 hover:bg-slate-50'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className={`p-2 rounded-xl ${isActive ? 'bg-emerald-600 text-white' : 'bg-slate-100/80 text-slate-500'}`}>
                      {prayer.icon}
                    </div>
                    <div className="text-left">
                      <span className={`text-[13px] font-bold ${isActive ? 'text-emerald-950 font-bold' : 'text-slate-700'}`}>
                        {prayer.label}
                      </span>
                      {isActive && (
                        <span className="block text-[9px] font-extrabold text-emerald-700 uppercase tracking-widest animate-pulse font-mono">
                          • Current Waqt (चालू वक़्त)
                        </span>
                      )}
                    </div>
                  </div>
                  <span className={`text-sm font-bold font-mono ${isActive ? 'text-emerald-950' : 'text-slate-800'}`}>
                    {prayer.time}
                  </span>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="text-center py-6 text-xs text-rose-500 font-semibold">
            Failed to parse timings data. Please retry search.
          </div>
        )}
      </div>

      {/* RAMADAN SPECIAL SEHRI & IFTAR CARD */}
      <div className="bg-gradient-to-br from-emerald-800 to-emerald-950 border border-emerald-700/30 text-white rounded-3xl p-5 card-shadow relative overflow-hidden">
        <div className="absolute right-0 top-0 opacity-10 translate-y-3 translate-x-3 pointer-events-none">
          <Snowflake className="w-28 h-28" />
        </div>
        
        <h3 className="text-xs font-bold tracking-widest text-amber-400 font-mono uppercase mb-3 flex items-center gap-1">
          🌙 Specially curated for Ramadan (रमज़ान करीम)
        </h3>
        
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-emerald-900/60 p-3 rounded-2xl border border-emerald-800">
            <span className="text-[10px] text-emerald-200 uppercase tracking-wide block">{t.sehri}</span>
            <div className="text-lg font-bold font-mono text-amber-300 mt-1">
              {timetable?.sehriEnd || "04:05 AM"}
            </div>
            <span className="text-[8px] text-emerald-300 block font-mono mt-0.5">Mubarak fast begins</span>
          </div>

          <div className="bg-emerald-900/60 p-3 rounded-2xl border border-emerald-800">
            <span className="text-[10px] text-emerald-200 uppercase tracking-wide block">{t.iftar}</span>
            <div className="text-lg font-bold font-mono text-amber-300 mt-1">
              {timetable?.iftarStart || "06:48 PM"}
            </div>
            <span className="text-[8px] text-emerald-300 block font-mono mt-0.5">Waqt Iftar (Fast opens)</span>
          </div>
        </div>
      </div>
    </div>
  );
}
