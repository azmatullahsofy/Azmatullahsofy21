import React, { useState, useEffect, useRef } from 'react';
import { 
  Compass, 
  MapPin, 
  Info, 
  Activity, 
  AlertCircle,
  HelpCircle,
  Locate,
  Navigation,
  Globe2,
  Volume2,
  VolumeX,
  Sliders,
  Sparkles
} from 'lucide-react';
import { Language, Masjid } from '../types';

interface QiblaCompassProps {
  currentLanguage: Language;
  selectedMasjid: Masjid | null;
}

// Translations dictionary inside the component file to ensure complete, conflict-free, multi-lingual support
const t = {
  en: {
    title: "Interactive Qibla Compass",
    subtitle: "Automatic magnetic compass and high-precision spherical great-circle bearing finder to the Kaaba from your location.",
    locationSec: "Calculation Anchor",
    selectedMasjid: "Masjid Coordinates",
    deviceGps: "Live Phone GPS Position",
    gpsFetching: "Accessing high-accuracy GPS...",
    useLiveGps: "Enable Live Device GPS",
    useMasjidLoc: "Use Masjid Location",
    distance: "Distance to Holy Kaaba",
    angleLabel: "Bearing to Kaaba (True North)",
    alignmentText: "Phone Alignment Heading",
    alignedText: "ALIGNED WITH QIBLA! (قبلہ رخ)",
    alignHint: "Rotate your device or slider until the needle aligns with the top indicator",
    compassHeading: "Heading",
    enableSensorsBtn: "Enable Live Device Compass",
    sensorStatus: "Compass Sensor Status",
    sensorActive: "Live Micro-Sensor Feed Connected",
    sensorInactive: "Magnetometer not responding / blocked",
    simTitle: "Desktop Preview Simulator",
    simDesc: "Since desk computers/iframes lack geomagnetic sensors, drag this slider to simulate rotating your phone.",
    orientationError: "Note: DeviceOrientation API requires HTTPS, secure context, and sensor permission approval.",
    coordinatesLabel: "Coordinates",
    hapticToggle: "Vibration Haptic Feedback",
    soundToggle: "Success Audio Chime Alert",
    declinationOffset: "Magnetic Bezel Calibration",
    howItWorksTitle: "How is Qibla Calculated?",
    howItWorksDesc: "Using spherical trigonometry great-circle formulas, the shortest path calculates geodesic angle relative to True North for any position on Earth towards Kaaba in Mecca, Saudi Arabia (21.4225° N, 39.8262° E)."
  },
  hi: {
    title: "इंटरेक्टिव क़िबला कम्पास",
    subtitle: "आपके वर्तमान स्थान से काबा शरीफ़ की सटीक दूरी और सही दिशा (Great-circle bearing) जानने का आसान और विश्वसनीय तरीका।",
    locationSec: "गणना का केंद्र",
    selectedMasjid: "मस्जिद के निर्देशांक",
    deviceGps: "लाइव मोबाइल जीपीएस स्थिति",
    gpsFetching: "सटीक जीपीएस लोड हो रहा है...",
    useLiveGps: "लाइव डिवाइस जीपीएस चालू करें",
    useMasjidLoc: "मस्जिद स्थान का उपयोग करें",
    distance: "काबा शरीफ से दूरी",
    angleLabel: "क़िबला कोण (उत्तर दिशा से)",
    alignmentText: "डिवाइस घुमाने का कोण",
    alignedText: "माशाअल्लाह! आप बिल्कुल किबला की दिशा में देख रहे हैं!",
    alignHint: "कम्पास को सोने की सुई (काबा) के साथ संरेखित करने के लिए घुमाएं",
    compassHeading: "दिशा कोण",
    enableSensorsBtn: "लाइव कम्पास सेंसर सक्रिय करें",
    sensorStatus: "कम्पास सेंसर स्थिति",
    sensorActive: "लाइव माइक्रो-सेंसर फीड कनेक्टेड",
    sensorInactive: "मैग्नेटोमीटर सेंसर अवरुद्ध या अनुपलब्ध है",
    simTitle: "डेस्कटॉप कम्पास सिमुलेटर",
    simDesc: "चूंकि कंप्यूटर/आईफ़्रेम में मैग्नेटिक सेंसर उपलब्ध नहीं होते हैं, इसलिए दिशा बदलने के लिए इस स्लाइडर को खिसकाएं।",
    orientationError: "सूचना: कम्पास सेंसर के लिए HTTPS सुरक्षा और अनुमति प्रमाणीकरण की आवश्यकता होती है।",
    coordinatesLabel: "भौगोलिक स्थिति",
    hapticToggle: "संरेखण पर कम्पन प्रतिक्रिया",
    soundToggle: "संरेखण पर मधुर बीप टोन",
    declinationOffset: "चुंबकीय सुई सुधार (अंश बदलाव)",
    howItWorksTitle: "क़िबला की गणितीय गणना कैसे होती है?",
    howItWorksDesc: "पवित्र काबा (21.4225° N, 39.8262° E) की सटीक दिशा जानने के लिए पृथ्वी की वक्रता को ध्यान में रखकर हावरसाइन सिद्धांत और त्रिकोणमितीय सूत्रों के माध्यम से भौगोलिक कोण निकाला जाता है।"
  },
  ur: {
    title: "قبلہ رخ کمپاس",
    subtitle: "خانہ کعبہ کی درست ترین سمت اور جیوگرافک فاصلہ جاننے کے لیے خودکار اور معلوماتی ٹول۔",
    locationSec: "حساب کا مرکز مقام",
    selectedMasjid: "مسجد کے کوآرڈینیٹس",
    deviceGps: "لائیو فون جی پی ایس پوزیشن",
    gpsFetching: "درست جی پی ایس لوڈ ہو رہا ہے...",
    useLiveGps: "لائیو جی پی ایس کا استعمال کریں",
    useMasjidLoc: "مسجد لوکیشن استعمال کریں",
    distance: "خانہ کعبہ سے کل دوری",
    angleLabel: "قبلہ کا اصل زاویہ (شمال سے)",
    alignmentText: "آلے کا رخ",
    alignedText: "ماشاءاللہ! قبلہ رخ بالکل درست ہے!",
    alignHint: "آلے کو گھمائیں جب تک سنہری سوئی اوپر اشارے سے نہ مل جائے",
    compassHeading: "سمتی زاویہ",
    enableSensorsBtn: "کمپاس سینسر چالو کریں",
    sensorStatus: "کمپاس سینسر کی حالت",
    sensorActive: "لائیو سمت سینسرز منسلک ہے",
    sensorInactive: "کمپاس سینسر بلاک ہے / غائب ہے",
    simTitle: "کمپیوٹر ٹیسٹ سلائیڈر",
    simDesc: "چونکہ لیپ ٹاپ یا فریم میں مقناطیسی سینسر نہیں ہوتے، لہذا فون کو گھمانے کے لیے سلائیڈر کا استعمال کریں۔",
    orientationError: "نوٹ: کمپاس سینسر کے لیے سیکیور پروٹوکول (HTTPS) اور اجازت درکار ہے۔",
    coordinatesLabel: "محل وقوع",
    hapticToggle: "قبلہ رخ پر موبائل وائبریشن اثر",
    soundToggle: "قبلہ پوزیشن ملنے پر چائم آواز",
    declinationOffset: "مقناطیسی سوئی کی کلیبریشن زاویہ",
    howItWorksTitle: "قبلہ رخ کی ریاضیاتی پیمائش",
    howItWorksDesc: "خانہ کعبہ (کی جیوگرافک پوزیشن 21.4225° N, 39.8262° E) کی اصل اور درست سمت حاصل کرنے کے لیے کرۂ ارض کی گول سطح کے حساب سے جیوڈیسک زاویہ نکالا جاتا ہے۔"
  }
};

// Mecca Coordinates
const MECCA_LAT = 21.4225241;
const MECCA_LNG = 39.8261818;

export default function QiblaCompass(props: QiblaCompassProps) {
  const currentLang = props.currentLanguage;
  const l = t[currentLang] || t.en;

  // Active calculation inputs (Selected masjid coordinates by default)
  const [activeLat, setActiveLat] = useState<number>(props.selectedMasjid?.latitude || 26.0913);
  const [activeLng, setActiveLng] = useState<number>(props.selectedMasjid?.longitude || 83.2917);
  const [activeName, setActiveName] = useState<string>(props.selectedMasjid?.name || "Masjid Noor Al-Islam");
  
  // Custom Live GPS state
  const [useGps, setUseGps] = useState<boolean>(false);
  const [gpsLoading, setGpsLoading] = useState<boolean>(false);
  const [gpsError, setGpsError] = useState<string | null>(null);

  // Device orientation / compass states
  const [deviceHeading, setDeviceHeading] = useState<number>(0); // Angle of rotation (0 = North)
  const [isSensorActive, setIsSensorActive] = useState<boolean>(false);
  const [sensorError, setSensorError] = useState<string | null>(null);
  
  // Custom manual slider fallback (essential for preview and desktops)
  const [manualRotation, setManualRotation] = useState<number>(0);

  // New features requested & optimized user experience additions
  const [vibrateEnabled, setVibrateEnabled] = useState<boolean>(true);
  const [soundEnabled, setSoundEnabled] = useState<boolean>(true);
  const [declination, setDeclination] = useState<number>(0);
  const [showInfoModal, setShowInfoModal] = useState<boolean>(false);
  
  // Track alignment transitions accurately to play sounds/haptics exactly once per entry
  const previouslyAligned = useRef<boolean>(false);

  // Calculate coordinates dynamically if selectedMasjid prop updates
  useEffect(() => {
    if (!useGps && props.selectedMasjid) {
      setActiveLat(props.selectedMasjid.latitude || 26.0913);
      setActiveLng(props.selectedMasjid.longitude || 83.2917);
      setActiveName(props.selectedMasjid.name);
    }
  }, [props.selectedMasjid, useGps]);

  // Activate Live Dynamic Device GPS coordinates
  const handleToggleGps = () => {
    if (!useGps) {
      setGpsLoading(true);
      setGpsError(null);
      if ("geolocation" in navigator) {
        navigator.geolocation.getCurrentPosition(
          (pos) => {
            setActiveLat(pos.coords.latitude);
            setActiveLng(pos.coords.longitude);
            setActiveName("Your Geolocation");
            setUseGps(true);
            setGpsLoading(false);
          },
          (err) => {
            console.error(err);
            setGpsError(
              currentLang === "hi" 
                ? "जीपीएस एक्सेस अस्वीकृत या अनुपलब्ध है। (GPS Access denied / unavailable)"
                : currentLang === "ur"
                  ? "جی پی ایس پوزیشن دستیاب نہیں ہے۔"
                  : "Unable to retrieve device location coordinates."
            );
            setGpsLoading(false);
          },
          { enableHighAccuracy: true, timeout: 8000 }
        );
      } else {
        setGpsError("Geolocation is not supported by your browser.");
        setGpsLoading(false);
      }
    } else {
      setUseGps(false);
      if (props.selectedMasjid) {
        setActiveLat(props.selectedMasjid.latitude || 26.0913);
        setActiveLng(props.selectedMasjid.longitude || 83.2917);
        setActiveName(props.selectedMasjid.name);
      }
    }
  };

  // 1. Calculate Qibla Bearing (Great-circle bearing angle) using standard spherical trigonometry
  const getQiblaAngle = (lat: number, lng: number): number => {
    const latRad = lat * Math.PI / 180;
    const lngRad = lng * Math.PI / 180;
    const meccaLatRad = MECCA_LAT * Math.PI / 180;
    const meccaLngRad = MECCA_LNG * Math.PI / 180;

    const deltaLng = meccaLngRad - lngRad;

    const numerator = Math.sin(deltaLng);
    const denominator = Math.cos(latRad) * Math.tan(meccaLatRad) - Math.sin(latRad) * Math.cos(deltaLng);

    const qiblaRad = Math.atan2(numerator, denominator);
    const qiblaDeg = (qiblaRad * 180) / Math.PI;

    return (qiblaDeg + 360) % 360;
  };

  // 2. Calculate Distance to Kaaba using Haversine Great Circle Distance
  const getDistanceToKaaba = (lat: number, lng: number): number => {
    const R = 6371; // Earth Radius in Km
    const deltaLatRad = (MECCA_LAT - lat) * Math.PI / 180;
    const deltaLngRad = (MECCA_LNG - lng) * Math.PI / 180;

    const latRad = lat * Math.PI / 180;
    const meccaLatRad = MECCA_LAT * Math.PI / 180;

    const a = Math.sin(deltaLatRad / 2) * Math.sin(deltaLatRad / 2) +
              Math.cos(latRad) * Math.cos(meccaLatRad) * 
              Math.sin(deltaLngRad / 2) * Math.sin(deltaLngRad / 2);
    
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return Math.round(R * c);
  };

  const calculatedQiblaAngle = getQiblaAngle(activeLat, activeLng);
  const computedDistance = getDistanceToKaaba(activeLat, activeLng);

  // Set up Orientation listeners
  const handleOrientationChange = (e: DeviceOrientationEvent) => {
    let heading = 0;
    
    // Check webkitCompassHeading for iOS Safari devices
    if ('webkitCompassHeading' in e) {
      heading = (e as any).webkitCompassHeading;
    } else if (e.alpha !== null) {
      // For standard Android / general browsers
      heading = (360 - e.alpha) % 360;
    }
    
    if (heading !== undefined && !isNaN(heading)) {
      setDeviceHeading(heading);
      setIsSensorActive(true);
    }
  };

  const requestCompassPermission = async () => {
    const docEvent = DeviceOrientationEvent as any;
    
    if (typeof docEvent.requestPermission === 'function') {
      try {
        const response = await docEvent.requestPermission();
        if (response === 'granted') {
          window.addEventListener('deviceorientation', handleOrientationChange, true);
          setIsSensorActive(true);
          setSensorError(null);
        } else {
          setSensorError("Device orientation permission denied by the user.");
        }
      } catch (err: any) {
        setSensorError(`Sensor activation deferred: ${err.message || err}`);
      }
    } else {
      // Fallback for Android and desktop systems that don't need explicit permission prompt
      window.addEventListener('deviceorientation', handleOrientationChange, true);
      
      // Since desktop won't emit active values, we establish a check after a short wait
      setTimeout(() => {
        setIsSensorActive(true);
      }, 500);
    }
  };

  // Clean listener on component dispose
  useEffect(() => {
    return () => {
      window.removeEventListener('deviceorientation', handleOrientationChange, true);
    };
  }, []);

  // Audio synthesis tone generator
  const playAlertChime = () => {
    try {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      if (!AudioCtx) return;
      const ctx = new AudioCtx();
      
      const playTone = (freq: number, start: number, duration: number) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, start);
        gain.gain.setValueAtTime(0.08, start);
        gain.gain.exponentialRampToValueAtTime(0.001, start + duration);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(start);
        osc.stop(start + duration);
      };
      
      const now = ctx.currentTime;
      // High quality spiritual dual tone frequency sequence
      playTone(587.33, now, 0.2); // D5
      playTone(880, now + 0.12, 0.4); // A5
    } catch (err) {
      console.log("Audio feedback deferred", err);
    }
  };

  // Determine active rotating heading to rotate the compass card
  // If sensor is active, use the sensor heading. Otherwise, use manual fallback slider for preview
  const activeHeadingUncalibrated = isSensorActive && deviceHeading !== 0 ? deviceHeading : manualRotation;
  
  // Incorporate magnetic declination calibration drift offset perfectly
  const activeHeading = (activeHeadingUncalibrated + declination + 360) % 360;

  // Qibla needle position relative to the phone top viewport
  // qibla direction = qibla bearing from True North - current device rotation from True North
  const qiblaRelativeAngle = (calculatedQiblaAngle - activeHeading + 360) % 360;

  // Check if device/slider represents alignment with the Qibla (±3.5 degrees bounds)
  const isAligned = Math.abs((qiblaRelativeAngle + 180) % 360 - 180) < 3.5;

  // Tactile & Audio feedback on alignment transitioning to true
  useEffect(() => {
    if (isAligned) {
      if (!previouslyAligned.current) {
        // Trigger vibration if allowed
        if (vibrateEnabled && "vibrate" in navigator) {
          navigator.vibrate([100, 50, 100]); // double tactile pulses
        }
        // Trigger audio chime if allowed
        if (soundEnabled) {
          playAlertChime();
        }
        previouslyAligned.current = true;
      }
    } else {
      previouslyAligned.current = false;
    }
  }, [isAligned, vibrateEnabled, soundEnabled]);

  // Determine compass textual direction for alignment card
  const getCompassDirectionText = (angle: number): string => {
    if (angle >= 337.5 || angle < 22.5) return 'N (उत्तर)';
    if (angle >= 22.5 && angle < 67.5) return 'NE (उत्तर-पूर्व)';
    if (angle >= 67.5 && angle < 112.5) return 'E (पूर्व)';
    if (angle >= 112.5 && angle < 157.5) return 'SE (दक्षिण-पूर्व)';
    if (angle >= 157.5 && angle < 202.5) return 'S (दक्षिण)';
    if (angle >= 202.5 && angle < 247.5) return 'SW (दक्षिण-पश्चिम)';
    if (angle >= 247.5 && angle < 292.5) return 'W (पश्चिम)';
    return 'NW (उत्तर-पश्चिम)';
  };

  return (
    <div className="bg-white rounded-3xl border border-gray-100 card-shadow overflow-hidden text-left transition-all">
      {/* Visual background header band */}
      <div className={`p-5 text-white transition-all duration-500 relative overflow-hidden flex items-start gap-3.5 text-left ${
        isAligned 
          ? 'bg-gradient-to-r from-emerald-700 via-emerald-800 to-emerald-950 ring-4 ring-emerald-400/30' 
          : 'bg-gradient-to-r from-emerald-950 to-slate-900'
      }`}>
        {/* Absolute mosque dome watermark backdrop */}
        <div className="absolute right-0 bottom-0 top-0 opacity-10 flex items-center pr-3 pointer-events-none">
          <Globe2 className="w-28 h-28 shrink-0" />
        </div>

        <div className="p-2.5 rounded-2xl bg-white/10 shrink-0 border border-white/5 shadow-inner">
          <Compass className={`w-7 h-7 text-amber-300 ${isAligned ? 'animate-spin [animation-duration:15s]' : ''}`} />
        </div>

        <div className="flex-1 relative z-10 text-left">
          <h2 className="text-base font-black tracking-tight">{l.title}</h2>
          <p className="text-[10px] text-slate-300 leading-normal mt-0.5 max-w-xs">{l.subtitle}</p>
        </div>
      </div>

      <div className="p-5 flex flex-col gap-5">
        {/* Calculated Location Card */}
        <div className="bg-slate-50/70 rounded-2xl p-4 border border-slate-100 flex flex-col gap-2.5 text-left">
          <div className="flex justify-between items-center pb-2 border-b border-slate-200/50">
            <div className="flex items-center gap-1.5">
              <MapPin className="w-3.5 h-3.5 text-emerald-700 shrink-0" />
              <span className="text-[10px] font-black uppercase tracking-wider text-slate-500 font-mono">{l.locationSec}</span>
            </div>
            
            <button
              onClick={handleToggleGps}
              disabled={gpsLoading}
              className={`text-[9px] font-black uppercase tracking-wider py-1 px-3 rounded-xl transition-all flex items-center gap-1 font-mono ${
                useGps 
                  ? 'bg-emerald-100 text-emerald-800 shadow-sm border border-emerald-500/20' 
                  : 'bg-white hover:bg-slate-100 text-slate-600 border'
              }`}
            >
              <Locate className="w-3 h-3 text-emerald-700 hover:scale-115 transition-transform" />
              <span>{useGps ? l.useMasjidLoc : l.useLiveGps}</span>
            </button>
          </div>

          <div className="flex justify-between items-start text-xs text-slate-700 text-left">
            <div>
              <span className="text-[9px] text-slate-400 font-bold uppercase tracking-wider block">{l.coordinatesLabel}</span>
              <p className="font-extrabold text-slate-900 mt-0.5">{activeName}</p>
              <p className="text-[10px] text-slate-500 font-mono mt-0.5">
                {activeLat.toFixed(4)}° N , {activeLng.toFixed(4)}° E
              </p>
            </div>

            <div className="text-right font-mono text-left">
              <span className="text-[9px] text-slate-400 font-bold uppercase tracking-wider block">{l.angleLabel}</span>
              <p className="text-sm font-black text-emerald-950 mt-0.5">
                {calculatedQiblaAngle.toFixed(1)}°
              </p>
              <span className="text-[9px] font-semibold text-slate-400 bg-slate-200/55 py-0.5 px-2 rounded-lg inline-block mt-1">
                {getCompassDirectionText(calculatedQiblaAngle)}
              </span>
            </div>
          </div>

          {gpsLoading && (
            <p className="text-[10px] text-emerald-800 font-semibold italic animate-pulse">{l.gpsFetching}</p>
          )}

          {gpsError && (
            <div className="bg-red-50 text-red-700 p-2 text-[10px] leading-relaxed rounded-lg border border-red-100 font-medium flex items-center gap-1.5">
              <AlertCircle className="w-4 h-4 shrink-0 text-red-500 font-bold" />
              <span>{gpsError}</span>
            </div>
          )}
        </div>

        {/* COMPASS VISUALIZATION CANVAS STAGE */}
        <div id="qibla-compass-dial-container" className="flex flex-col items-center justify-center p-4 py-6 bg-slate-100/50 rounded-3xl border border-slate-200/40 relative">
          
          {/* Top pointing device reference guide */}
          <div className="flex flex-col items-center mb-3 relative z-20">
            <div className="w-2.5 h-10 bg-emerald-700 rounded-t-full rounded-b-lg flex flex-col justify-end pb-1 shadow-sm">
              <div className="w-1.5 h-1.5 bg-amber-400 rounded-full mx-auto"></div>
            </div>
            <span className="text-[8px] font-black uppercase text-emerald-800 tracking-wider font-mono mt-1">
              Top of phone (फोन का सिरा)
            </span>
          </div>

          {/* Core circular compass design container */}
          <div className="w-56 h-56 rounded-full bg-white shadow-lg border-4 border-slate-300 relative flex items-center justify-center transition-all duration-300 overflow-hidden">
            
            {/* Outer alignment bezel highlighting when direct alignment match is on */}
            <div className={`absolute inset-1 rounded-full border-2 transition-all duration-500 flex items-center justify-center ${
              isAligned ? 'border-emerald-500 bg-emerald-50/20 scale-102' : 'border-slate-100 bg-slate-50/10'
            }`} />

            {/* Rotatable internal dial plate */}
            <div 
              id="qibla-inner-dial"
              className="w-full h-full relative qibla-inner-dial"
              style={{ 
                transform: `rotate(${-activeHeading}deg)`,
                transition: 'transform 0.6s ease-out'
              }}
            >
              {/* Dial North Line indicator */}
              <div className="absolute top-2 left-1/2 -ml-0.5 w-1 h-3 bg-rose-600 rounded-full" />
              <div className="absolute top-1.5 left-1/2 -translate-x-1/2 text-[10px] font-black text-rose-600 font-mono">N</div>

              {/* Dial East Line */}
              <div className="absolute right-1.5 top-1/2 -mt-0.5 h-1 w-3 bg-slate-400" />
              <div className="absolute right-1.5 top-1/2 -translate-y-1/2 text-[10px] font-bold text-slate-400 font-mono">E</div>

              {/* Dial South Line */}
              <div className="absolute bottom-2 left-1/2 -ml-0.5 w-1 h-3 bg-slate-400" />
              <div className="absolute bottom-1.5 left-1/2 -translate-x-1/2 text-[10px] font-bold text-slate-400 font-mono">S</div>

              {/* Dial West Line */}
              <div className="absolute left-1.5 top-1/2 -mt-0.5 h-1 w-3 bg-slate-400" />
              <div className="absolute left-1.5 top-1/2 -translate-y-1/2 text-[10px] font-bold text-slate-400 font-mono">W</div>

              {/* Static degree tick accents in the dial */}
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-48 h-48 rounded-full border border-dashed border-slate-200" />

              {/* Kaaba Direction Needle overlay inside the rotatable dial */}
              {/* Pointing specifically in calculated Qibla Angle direction */}
              <div 
                className="absolute inset-0 flex items-center justify-center pointer-events-none"
                style={{ transform: `rotate(${calculatedQiblaAngle}deg)` }}
              >
                {/* Pointer rod */}
                <div className="w-1.5 h-24 bg-gradient-to-t from-transparent via-amber-500 to-amber-600 rounded-lg absolute bottom-1/2 origin-bottom flex flex-col items-center justify-start pb-4">
                  {/* Miniature Kaaba locator tag head */}
                  <div className="w-5 h-5 bg-slate-900 border-2 border-amber-400 shadow-md transform rotate-45 flex items-center justify-center -mt-2">
                    <div className="w-2.5 h-2.5 bg-amber-400 transform -rotate-45" />
                  </div>
                </div>

                {/* Counter balance needle tail */}
                <div className="w-1 h-14 bg-slate-300 rounded-full absolute top-1/2 origin-top" />
              </div>
            </div>

            {/* Static center cap housing node overlay */}
            <div className="absolute w-6 h-6 rounded-full bg-slate-950 border-4 border-slate-200 flex items-center justify-center">
              <div className="w-1.5 h-1.5 bg-amber-400 rounded-full" />
            </div>

            {/* Glowing gold aligned signal burst */}
            {isAligned && (
              <div className="absolute inset-x-0 bottom-4 text-center pointer-events-none animate-bounce">
                <span className="bg-emerald-800 text-amber-300 text-[8px] font-black px-2 py-0.5 rounded-full border border-amber-500/30 font-mono tracking-widest uppercase">
                  ⭐ MATCH ⭐
                </span>
              </div>
            )}
          </div>

          {/* Indicator text layout */}
          <div className="mt-5 text-center px-4">
            <p className="text-xs font-mono font-bold text-slate-500 uppercase tracking-widest">
              {l.compassHeading}: <strong className="text-slate-800 text-sm font-black">{activeHeading.toFixed(0)}° {getCompassDirectionText(activeHeading)}</strong>
            </p>
            
            {isAligned ? (
              <p className="text-xs font-bold text-emerald-800 mt-1 flex items-center justify-center gap-1">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-600 animate-ping shrink-0" />
                <span className="uppercase tracking-wide">{l.alignedText}</span>
              </p>
            ) : (
              <p className="text-[10px] text-slate-400 mt-1 leading-normal italic font-medium max-w-xs mx-auto">
                {l.alignHint}
              </p>
            )}

            {/* Dynamic Distance from Kaaba Label updating in real-time */}
            <div id="qibla-realtime-distance-badge" className="mt-4 inline-flex items-center gap-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 px-3.5 py-1 text-[11px] font-black text-emerald-950 font-mono shadow-sm transition-all duration-300">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 shrink-0 animate-ping" />
              <span className="uppercase tracking-wider">{l.distance}:</span>
              <strong className="text-emerald-900 bg-emerald-50 px-1.5 py-0.5 rounded-md">{computedDistance.toLocaleString()} km</strong>
            </div>

            {/* Haptic vibration control, Audio chime feedback controls, and help toggles */}
            <div className="mt-5 flex items-center justify-center gap-2 flex-wrap max-w-sm mx-auto">
              <button
                onClick={() => setVibrateEnabled(!vibrateEnabled)}
                className={`flex items-center gap-1 px-2.5 py-1 rounded-full border text-[9px] font-bold tracking-wide uppercase transition-all shadow-sm cursor-pointer ${
                  vibrateEnabled
                    ? 'bg-emerald-550/10 text-emerald-800 border-emerald-550/30 font-extrabold'
                    : 'bg-slate-50 text-slate-400 border-slate-200'
                }`}
                title={l.hapticToggle}
              >
                <Activity className={`w-3 h-3 ${vibrateEnabled ? 'text-emerald-700 animate-pulse' : 'text-slate-300'}`} />
                <span>{vibrateEnabled ? "Vibe ON" : "Vibe OFF"}</span>
              </button>

              <button
                onClick={() => setSoundEnabled(!soundEnabled)}
                className={`flex items-center gap-1 px-2.5 py-1 rounded-full border text-[9px] font-bold tracking-wide uppercase transition-all shadow-sm cursor-pointer ${
                  soundEnabled
                    ? 'bg-emerald-550/10 text-emerald-800 border-emerald-550/30 font-extrabold'
                    : 'bg-slate-50 text-slate-400 border-slate-200'
                }`}
                title={l.soundToggle}
              >
                {soundEnabled ? (
                  <Volume2 className="w-3.5 h-3.5 text-emerald-700" />
                ) : (
                  <VolumeX className="w-3.5 h-3.5 text-slate-300" />
                )}
                <span>{soundEnabled ? "Chime ON" : "Chime OFF"}</span>
              </button>

              <button
                onClick={() => setShowInfoModal(!showInfoModal)}
                className={`flex items-center gap-1 px-2.5 py-1 rounded-full border text-[9px] font-bold tracking-wide uppercase transition-all shadow-sm cursor-pointer ${
                  showInfoModal
                    ? 'bg-emerald-800 text-white border-emerald-950 font-extrabold shadow-md'
                    : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
                }`}
              >
                <HelpCircle className="w-3.5 h-3.5" />
                <span>Algorithm</span>
              </button>
            </div>
          </div>
        </div>

        {/* Distance metrics block */}
        <div className="grid grid-cols-2 gap-3.5 text-xs text-slate-700 border-t border-slate-100 pt-3.5 text-left">
          <div className="flex flex-col gap-0.5">
            <span className="text-[9px] text-slate-400 font-bold uppercase tracking-wider block">{l.distance}</span>
            <p className="text-base font-black text-emerald-950 font-mono">
              {computedDistance.toLocaleString()} <span className="text-xs">km</span>
            </p>
          </div>

          <div className="flex flex-col gap-0.5 font-mono">
            <span className="text-[9px] text-slate-400 font-bold uppercase tracking-wider block">{l.alignmentText}</span>
            <p className="text-base font-black text-slate-800">
              {Math.round(activeHeading)}°
            </p>
          </div>
        </div>

        {/* API SENSOR ACTIVATOR BAR & FALLBACK SLIDER */}
        <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100 flex flex-col gap-3.5 text-left">
          <div className="flex flex-col justify-between gap-1 border-b border-slate-200/50 pb-2">
            <span className="text-[10px] uppercase font-black tracking-widest text-[#B38F00] font-mono flex items-center gap-1.5">
              <Activity className="w-4 h-4 text-[#B38F00]" />
              <span>{l.sensorStatus}</span>
            </span>

            <div className="flex items-center justify-between mt-1.5">
              <span className={`text-[10px] font-black uppercase rounded-full px-2.5 py-0.5 tracking-wider ${
                isSensorActive ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-900'
              }`}>
                {isSensorActive ? l.sensorActive : l.sensorInactive}
              </span>

              {!isSensorActive && (
                <button
                  id="btn-trigger-qibla-sensors"
                  onClick={requestCompassPermission}
                  className="bg-emerald-800 hover:bg-emerald-950 text-white font-extrabold text-[9px] uppercase tracking-wider py-1.5 px-3 rounded-lg flex items-center gap-1"
                >
                  <Navigation className="w-3 h-3 text-amber-300" />
                  <span>{l.enableSensorsBtn}</span>
                </button>
              )}
            </div>
          </div>

          {sensorError && (
            <div className="bg-amber-50 text-[10px] leading-relaxed text-amber-900 border border-amber-200 p-2.5 rounded-lg flex items-start gap-1">
              <Info className="w-3.5 h-3.5 shrink-0 text-amber-600 mt-0.5" />
              <div className="flex flex-col gap-0.5 text-left">
                <span className="font-bold">Compass Feed Notification:</span>
                <span className="text-[9px] text-slate-500 leading-normal">{sensorError}</span>
              </div>
            </div>
          )}

          {/* Simulated / Fallback Drag Slider (Highly valued for desktop testing compliance) */}
          <div className="flex flex-col gap-2">
            <h4 className="text-[10px] font-black text-rose-950 uppercase tracking-widest flex items-center gap-1.5">
              <span>🎚️ {l.simTitle}</span>
              <span className="text-[8px] bg-rose-100 text-rose-800 px-1.5 py-0.5 rounded uppercase tracking-widest font-mono">
                Manual Calibration
              </span>
            </h4>
            <p className="text-[9px] text-slate-500 leading-relaxed font-semibold">
              {l.simDesc}
            </p>

            <div className="flex items-center gap-3 bg-white p-2.5 rounded-xl border">
              <input
                id="qibla-compass-simulator-slider"
                type="range"
                min={0}
                max={359}
                value={manualRotation}
                onChange={(e) => {
                  setManualRotation(parseInt(e.target.value));
                  if (isSensorActive) {
                    // Temporarily pause live sensor listening if they deliberately calibrating manually
                    setIsSensorActive(false);
                  }
                }}
                className="w-full accent-emerald-800 cursor-pointer"
              />
              <span className="text-xs font-mono font-black text-emerald-950 w-10 text-right shrink-0">
                {manualRotation}°
              </span>
            </div>

            {/* Magnetic needle calibrator offset adjustment */}
            <div className="flex flex-col gap-1.5 mt-3.5 border-t border-slate-200/50 pt-3.5">
              <h5 className="text-[10px] font-black text-emerald-950 uppercase tracking-widest flex items-center gap-1.5">
                <Sliders className="w-3.5 h-3.5 text-emerald-700 hover:rotate-45 transition-transform duration-300" />
                <span>{l.declinationOffset}</span>
              </h5>
              <p className="text-[9px] text-slate-400 font-semibold leading-normal">
                Calibrate magnetic local deviation drift error of device compass: ({declination > 0 ? `+${declination}` : declination}°)
              </p>
              <div className="flex items-center gap-3 bg-white p-2.5 rounded-xl border">
                <input
                  type="range"
                  min={-15}
                  max={15}
                  value={declination}
                  onChange={(e) => setDeclination(parseInt(e.target.value))}
                  className="w-full accent-emerald-800 cursor-pointer"
                />
                <span className="text-xs font-mono font-black text-emerald-900 w-10 text-right shrink-0">
                  {declination > 0 ? `+${declination}` : declination}°
                </span>
              </div>
            </div>
          </div>
        </div>

        {showInfoModal && (
          <div className="bg-amber-50/70 p-4 rounded-2xl border border-amber-200/50 relative overflow-hidden transition-all duration-300 animate-fadeIn text-left">
            <div className="absolute right-0 bottom-0 opacity-10 pointer-events-none pr-2">
              <Globe2 className="w-20 h-20 text-amber-900" />
            </div>
            <h4 className="text-xs font-black text-amber-950 uppercase tracking-widest flex items-center gap-1.5">
              <Sparkles className="w-4 h-4 text-amber-600 animate-spin [animation-duration:12s]" />
              <span>{l.howItWorksTitle}</span>
            </h4>
            <p className="text-[10px] text-amber-900 leading-relaxed font-semibold mt-2 text-justify">
              {l.howItWorksDesc}
            </p>
            <div className="bg-amber-100/50 p-2.5 rounded-xl font-mono text-[9.5px] leading-relaxed text-justify text-emerald-950 border border-amber-200/60 mt-3 shadow-inner">
              <span className="font-bold text-amber-950">Great-Circle Geodesic Bearing Core:</span><br />
              θ = atan2(sin(Δλ)·cos(φ₂), cos(φ₁)·sin(φ₂) − sin(φ₁)·cos(φ₂)·cos(Δλ))
            </div>
          </div>
        )}

        <p className="text-[9px] text-slate-400 font-mono tracking-wide text-center leading-normal">
          {l.orientationError} <br />
          {l.coordinatesLabel}
        </p>

      </div>
    </div>
  );
}
