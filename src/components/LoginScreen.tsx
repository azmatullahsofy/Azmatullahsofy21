import React, { useState, useEffect } from 'react';
import { 
  Shield, 
  KeyRound, 
  User, 
  Lock, 
  ArrowLeft, 
  ArrowRight, 
  ShieldAlert, 
  Sparkles, 
  Building2, 
  Phone, 
  MessageSquareCode,
  CheckCircle,
  HelpCircle,
  MapPin,
  ClipboardList
} from 'lucide-react';
import { Language, UserProfile, Masjid } from '../types';
import { translations } from '../translations';
import { MasjidService, generateRandomCode } from '../services/MasjidService';

interface LoginScreenProps {
  currentLanguage: Language;
  targetRole: 'admin' | 'member';
  onBack: () => void;
  onLoginSuccess: (userProfile: UserProfile) => void;
}

export default function LoginScreen(props: LoginScreenProps) {
  const t = translations[props.currentLanguage];
  const [activeTab, setActiveTab] = useState<'member' | 'admin'>(props.targetRole);

  // --- MUTAwalli (MEMBER) STATE MACHINE ---
  // Sub-steps: 'phone' | 'otp' | 'register'
  const [memberStep, setMemberStep] = useState<'phone' | 'otp' | 'register'>('phone');
  const [phoneVal, setPhoneVal] = useState('');
  const [sentOtp, setSentOtp] = useState('');
  const [otpVal, setOtpVal] = useState('');
  const [otpTimer, setOtpTimer] = useState(0);

  // Mutawalli Signup fields
  const [memberName, setMemberName] = useState('');
  const [fatherName, setFatherName] = useState('');
  const [aadhar, setAadhar] = useState('');
  const [bankName, setBankName] = useState('');
  const [accNumber, setAccNumber] = useState('');
  const [ifsc, setIfsc] = useState('');
  const [masjidCode, setMasjidCode] = useState('');

  // --- IMAM SAHAB (ADMIN) STATE MACHINE ---
  // Sub-steps: 'login' | 'register'
  const [adminStep, setAdminStep] = useState<'login' | 'register'>('login');
  const [adminUsername, setAdminUsername] = useState('imam');
  const [adminPassword, setAdminPassword] = useState('123456');

  // Imam Sahab Signup fields
  const [regImamName, setRegImamName] = useState('');
  const [regImamUsername, setRegImamUsername] = useState('');
  const [regImamPassword, setRegImamPassword] = useState('');
  const [regImamPhone, setRegImamPhone] = useState('');
  const [masjidMode, setMasjidMode] = useState<'existing' | 'new'>('existing');
  const [existingMasjidCode, setExistingMasjidCode] = useState('');
  const [newMasjidName, setNewMasjidName] = useState('');
  const [newMasjidCity, setNewMasjidCity] = useState('');
  const [newMasjidAddress, setNewMasjidAddress] = useState('');

  // Notifications/Errors
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const [infoOtpBanner, setInfoOtpBanner] = useState<string | null>(null);

  // Countdown timer for OTP
  useEffect(() => {
    if (otpTimer > 0) {
      const interval = setInterval(() => {
        setOtpTimer((prev) => prev - 1);
      }, 1000);
      return () => clearInterval(interval);
    }
  }, [otpTimer]);

  // Reset tab errors
  const handleTabChange = (tab: 'member' | 'admin') => {
    setActiveTab(tab);
    setErrorMsg('');
    setSuccessMsg('');
    setInfoOtpBanner(null);
  };

  // --- Mutawalli OTP Triggers ---
  const handleSendOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    setSuccessMsg('');

    if (phoneVal.trim().length < 10) {
      setErrorMsg('कृपया एक वैध 10-अंकीय मोबाइल नंबर दर्ज करें। (Enter valid 10-digit mobile number)');
      return;
    }

    // Generate simulated premium OTP
    const generated = Math.floor(1000 + Math.random() * 9000).toString();
    setSentOtp(generated);
    setOtpTimer(60);
    setMemberStep('otp');
    setSuccessMsg('सुरक्षित ओ.टी.पी भेज दिया गया है! (Simulated SMS OTP sent)');
    
    // Display the simulated OTP elegantly for direct verification testing
    setInfoOtpBanner(`📲 [MOCK SMS GATEWAY] Your OTP verification code is: ${generated}`);
  };

  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    setSuccessMsg('');

    if (otpVal.trim() !== sentOtp) {
      setErrorMsg('गलत ओ.टी.पी! कृपया फिर से जांचें। (Invalid OTP code. Please enter the code shown in the blue box above.)');
      return;
    }

    setSuccessMsg('ओ.टी.पी सत्यापित हुआ! (Mobile verified successfully)');
    setInfoOtpBanner(null);

    // Look up user by phone number
    const existingProfile = await MasjidService.getMutawalliByPhone(phoneVal);
    if (existingProfile) {
      setSuccessMsg(`Welcome Back, ${existingProfile.name}!`);
      setTimeout(() => {
        // Automatically save their location matching the masjid
        localStorage.setItem('digital_masjid_current_user', JSON.stringify(existingProfile));
        localStorage.setItem('digital_masjid_selected_masjid_id', existingProfile.masjidId);
        props.onLoginSuccess(existingProfile);
      }, 800);
    } else {
      // Direct them to populate signup fields
      setSuccessMsg('नया मुतवल्ली खाता बनाएं (Phone verified! Please complete your details to register as a Masjid Mutawalli.)');
      setMemberStep('register');
    }
  };

  const submitMutawalliRegistration = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    setSuccessMsg('');

    if (!memberName.trim() || !fatherName.trim() || !aadhar.trim() || !bankName.trim() || !accNumber.trim() || !ifsc.trim() || !masjidCode.trim()) {
      setErrorMsg('कृपया सभी आवश्यक क्षेत्रों (*) को भरें। (Please fill out all required fields)');
      return;
    }

    if (masjidCode.trim().length !== 6) {
      setErrorMsg('मस्जिद कोड 6-अंकीय होना चाहिए। (Masjid code must be 6 digits)');
      return;
    }

    const matchedMasjid = await MasjidService.getMasjidByCode(masjidCode.trim());
    if (!matchedMasjid) {
      setErrorMsg('गलत मस्जिद कोड! कृपया अपने इमाम से संपर्क करें। (Invalid Masjid Code. Try using code: 786110)');
      return;
    }

    const newProfile = await MasjidService.joinMasjidWithCode(masjidCode.trim(), {
      uid: 'mutawalli_uid_' + Math.random().toString(36).substring(2, 6),
      name: memberName.trim(),
      fatherName: fatherName.trim(),
      aadharCard: aadhar.trim(),
      bankName: bankName.trim(),
      accountNumber: accNumber.trim(),
      ifscCode: ifsc.trim().toUpperCase(),
      phone: phoneVal.trim()
    });

    if (newProfile) {
      setSuccessMsg('मुतवल्ली पंजीकरण और लॉगिन सफल! (Mutawalli profile registered & logged in successfully!)');
      setTimeout(() => {
        localStorage.setItem('digital_masjid_current_user', JSON.stringify(newProfile));
        localStorage.setItem('digital_masjid_selected_masjid_id', newProfile.masjidId);
        props.onLoginSuccess(newProfile);
      }, 800);
    } else {
      setErrorMsg('पंजीकरण विफल। कृपया बाद में प्रयास करें। (Registration failed)');
    }
  };

  // --- IMAM SAHAB (ADMIN) CREDENTIAL LOGINS ---
  const handleImamLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    setSuccessMsg('');

    if (!adminUsername.trim() || !adminPassword.trim()) {
      setErrorMsg('कृपया अपना यूजरनेम और पासवर्ड डालें। (Please fill both fields)');
      return;
    }

    // Attempt to read from DB/Local replica
    const matchedProfile = await MasjidService.getImamByUsername(adminUsername);
    
    // Support default imam out of the box
    if (adminUsername.trim().toLowerCase() === 'imam' && adminPassword === '123456') {
      const defaultImam: UserProfile = {
        uid: 'admin1',
        name: 'Imam Maulana Zubair Ahmad',
        role: 'admin',
        masjidId: 'm1',
        approved: true,
        createdAt: new Date().toISOString(),
        username: 'imam',
        phone: '9876543210'
      };
      setSuccessMsg('अस्सलामु अलैकुम इमाम साहब! लॉगिन सफल। (Imam Sahab Sign In Success!)');
      setTimeout(() => {
        localStorage.setItem('digital_masjid_current_user', JSON.stringify(defaultImam));
        localStorage.setItem('digital_masjid_selected_masjid_id', 'm1');
        props.onLoginSuccess(defaultImam);
      }, 800);
      return;
    }

    // Customized user check
    if (matchedProfile) {
      // In sandbox we log in successfully
      setSuccessMsg(`लॉगिन सफल! खुशामदीद इमाम ${matchedProfile.name}`);
      setTimeout(() => {
        localStorage.setItem('digital_masjid_current_user', JSON.stringify(matchedProfile));
        localStorage.setItem('digital_masjid_selected_masjid_id', matchedProfile.masjidId);
        props.onLoginSuccess(matchedProfile);
      }, 800);
    } else {
      setErrorMsg('गलत यूजरनेम या पासवर्ड! नया अकाउंट बनाने के लिए "अकाउंट बनाएं" पर क्लिक करें। (User not registered. Toggle to SignUp below to register a new Imam Sahab account)');
    }
  };

  const handleImamRegistration = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    setSuccessMsg('');

    if (!regImamName.trim() || !regImamUsername.trim() || !regImamPassword.trim() || !regImamPhone.trim()) {
      setErrorMsg('कृपया सभी फ़ील्ड भरें। (Please fill in all general information fields)');
      return;
    }

    let activeMasjidId = '';
    if (masjidMode === 'existing') {
      if (!existingMasjidCode.trim()) {
        setErrorMsg('कृपया मस्जिद का कोड दर्ज करें। (Please enter your Masjid\'s 6-digit Code)');
        return;
      }
      const matchedM = await MasjidService.getMasjidByCode(existingMasjidCode.trim());
      if (!matchedM) {
        setErrorMsg('गलत मस्जिद कोड! कृपया सही 6-अंकीय कोड दर्ज करें। (Invalid Masjid code)');
        return;
      }
      activeMasjidId = matchedM.id;
    } else {
      // Create new Masjid document dynamically
      if (!newMasjidName.trim() || !newMasjidCity.trim() || !newMasjidAddress.trim()) {
        setErrorMsg('कृपया नई मस्जिद के पूरे विवरण भरें। (Please complete new mosque location details)');
        return;
      }
      const createdMasjid = await MasjidService.createMasjid(
        newMasjidName.trim(),
        newMasjidCity.trim(),
        newMasjidAddress.trim()
      );
      activeMasjidId = createdMasjid.id;
      setSuccessMsg(`मस्जिद बनाई गई! आमंत्रण कोड: ${createdMasjid.code}`);
    }

    // Register user profile
    const registeredImam = await MasjidService.createImamProfile({
      uid: 'imam_' + Math.random().toString(36).substring(2, 7),
      name: regImamName.trim(),
      username: regImamUsername.trim().toLowerCase(),
      phone: regImamPhone.trim(),
      masjidId: activeMasjidId
    });

    setSuccessMsg('इमाम साहब का नया अकाउंट सफलतापूर्वक पंजीकृत हुआ! (Imam Sahab account registered successfully!)');
    setTimeout(() => {
      localStorage.setItem('digital_masjid_current_user', JSON.stringify(registeredImam));
      localStorage.setItem('digital_masjid_selected_masjid_id', activeMasjidId);
      props.onLoginSuccess(registeredImam);
    }, 1200);
  };

  // Demo autofill convenience
  const autofillMutawalliCode = (phoneVal: string, codeVal: string) => {
    setPhoneVal(phoneVal);
    setMemberName('Mohammad Azmatullah');
    setFatherName('MD Shafiullah');
    setAadhar('1234-5678-9012');
    setBankName('State Bank Of India');
    setAccNumber('321234567890');
    setIfsc('SBIN0001234');
    setMasjidCode(codeVal);
  };

  return (
    <div className="w-full max-w-md mx-auto p-4 min-h-[85vh] flex flex-col justify-center animate-fade-in">
      {/* Back Button */}
      <button
        onClick={props.onBack}
        className="flex items-center gap-1.5 text-slate-500 hover:text-emerald-800 text-xs font-semibold mb-6 transition-colors self-start bg-slate-100 py-1.5 px-3.5 rounded-xl border border-slate-200"
      >
        <ArrowLeft className="w-4 h-4" />
        Back / वापिस
      </button>

      {/* Modern Greeting & Portal Title */}
      <div className="mb-6 text-center">
        <div className="w-14 h-14 bg-emerald-50 text-emerald-800 border border-emerald-100 rounded-2xl mx-auto flex items-center justify-center mb-3 shadow-sm">
          <KeyRound className="w-7 h-7" />
        </div>
        <h2 className="text-xl font-bold text-slate-900 tracking-tight">
          {t.loginTitle}
        </h2>
        <p className="text-[11px] text-slate-500 mt-1 max-w-xs mx-auto">
          Sign up or log in to direct azan live feeds, coordinate emergency madad, and supervise Baitul-Maal.
        </p>
      </div>

      {/* Premium Gateways Tabs */}
      <div className="flex bg-slate-100 rounded-2xl p-1 mb-6 border border-slate-200/60 shadow-inner">
        <button
          onClick={() => handleTabChange('member')}
          className={`flex-1 py-3 text-center text-xs font-bold rounded-xl transition-all duration-300 flex flex-col items-center justify-center gap-0.5 ${
            activeTab === 'member'
              ? 'bg-white text-emerald-950 shadow-sm border border-slate-200/50'
              : 'text-slate-500 hover:text-slate-800'
          }`}
        >
          <span className="flex items-center gap-1">
            <Phone className="w-3.5 h-3.5" />
            मुतवल्ली / कमेटी सदस्य
          </span>
          <span className="text-[9px] font-normal opacity-75">(Mutawalli Gateway - Phone + OTP)</span>
        </button>
        <button
          onClick={() => handleTabChange('admin')}
          className={`flex-1 py-3 text-center text-xs font-bold rounded-xl transition-all duration-300 flex flex-col items-center justify-center gap-0.5 ${
            activeTab === 'admin'
              ? 'bg-white text-emerald-950 shadow-sm border border-slate-200/50'
              : 'text-slate-500 hover:text-slate-800'
          }`}
        >
          <span className="flex items-center gap-1">
            <Shield className="w-3.5 h-3.5" />
            इमाम साहब / एडमिन
          </span>
          <span className="text-[9px] font-normal opacity-75">(Imam Sahab - Username + Pass)</span>
        </button>
      </div>

      {/* Simulated OTP Notification Display */}
      {infoOtpBanner && (
        <div id="otp-sms-simulator-bubble" className="bg-blue-50 text-blue-800 border border-blue-200 rounded-2xl p-4 text-xs font-semibold mb-5 flex items-start gap-2.5 animate-pulse shadow-sm">
          <MessageSquareCode className="w-5 h-5 shrink-0 text-blue-600 mt-0.5" />
          <div className="text-left">
            <p className="font-bold text-blue-900">SMS Gateway Simulator (ओ.टी.पी सुरक्षा संदेश)</p>
            <p className="text-[10px] text-blue-700/95 mt-0.5 leading-relaxed">{infoOtpBanner}</p>
          </div>
        </div>
      )}

      {/* Danger/Error Banner */}
      {errorMsg && (
        <div id="login-error-banner" className="bg-red-50 text-red-700 border-2 border-red-100 rounded-2xl p-4 text-xs font-medium mb-5 flex items-start gap-2.5 shadow-sm">
          <ShieldAlert className="w-4 h-4 shrink-0 text-red-500 mt-0.5" />
          <span className="text-left leading-relaxed">{errorMsg}</span>
        </div>
      )}

      {/* Success Banner */}
      {successMsg && (
        <div id="login-success-banner" className="bg-emerald-50 text-emerald-800 border border-emerald-100 rounded-2xl p-4 text-xs font-bold mb-5 flex items-start gap-2.5 shadow-sm">
          <Sparkles className="w-4 h-4 shrink-0 text-emerald-600 mt-0.5" />
          <span className="text-left leading-relaxed">{successMsg}</span>
        </div>
      )}

      {/* ==================== MUTAWALLI CORE INTERFACE (MOBILE + OTP) ==================== */}
      {activeTab === 'member' && (
        <div className="w-full">
          {/* Step 1: Input Phone Number */}
          {memberStep === 'phone' && (
            <form onSubmit={handleSendOtp} className="bg-white rounded-3xl shadow-xl border border-slate-100 p-6 flex flex-col gap-4">
              <div className="flex items-center justify-between text-[11px] text-slate-400 font-mono">
                <span className="uppercase tracking-wider font-bold">MUTAWALLI GATEWAY</span>
                <button
                  type="button"
                  onClick={() => autofillMutawalliCode('9988776655', '786110')}
                  className="text-amber-600 hover:text-amber-700 font-bold hover:underline"
                >
                  ⚡ Auto-fill Demopass
                </button>
              </div>

              <div className="flex flex-col gap-1 text-left">
                <label className="text-xs font-bold text-slate-700">मोबाइल नंबर दर्ज करें (Enter Mobile Number) *</label>
                <div className="relative mt-1">
                  <Phone className="absolute left-3.5 top-3.5 w-4 h-4 text-slate-400" />
                  <input
                    id="mutawalli-phone-input"
                    type="tel"
                    maxLength={10}
                    placeholder="9988xxxxxx"
                    value={phoneVal}
                    onChange={(e) => setPhoneVal(e.target.value.replace(/\D/g, ''))}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl py-3 pl-10 pr-4 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-700 text-slate-800 font-mono text-lg tracking-wider"
                    required
                  />
                </div>
                <p className="text-[10px] text-slate-400 mt-1 italic">
                  Enter <strong>9988776655</strong> to test with seeded registered committee profile.
                </p>
              </div>

              <button
                id="mutawalli-send-otp-btn"
                type="submit"
                className="w-full bg-emerald-800 hover:bg-emerald-950 text-white font-bold py-3.5 rounded-xl text-sm transition-colors shadow-md mt-2 flex items-center justify-center gap-1.5"
              >
                <span>आगे बढ़ें (Send OTP)</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </form>
          )}

          {/* Step 2: Input OTP Verification */}
          {memberStep === 'otp' && (
            <form onSubmit={handleVerifyOtp} className="bg-white rounded-3xl shadow-xl border border-slate-100 p-6 flex flex-col gap-4">
              <div className="text-center pb-2 border-b border-slate-100">
                <span className="bg-emerald-50 text-emerald-800 text-[10px] font-black px-2.5 py-1 rounded-full uppercase tracking-wider">
                  Verification Code Sent
                </span>
                <p className="text-xs text-slate-500 mt-2">
                  Please enter the 4-digit code shown in the blue simulated box above to verify ownership.
                </p>
              </div>

              <div className="flex flex-col gap-1 text-left">
                <label className="text-xs font-bold text-slate-700 text-center">4-अंकीय ओ.टी.पी दर्ज करें (Enter 4-digit OTP) *</label>
                <input
                  id="mutawalli-otp-input"
                  type="text"
                  maxLength={4}
                  placeholder="xxxx"
                  value={otpVal}
                  onChange={(e) => setOtpVal(e.target.value.replace(/\D/g, ''))}
                  className="w-36 mx-auto bg-slate-50 border border-slate-200 rounded-xl py-3 text-center text-xl font-mono text-slate-800 tracking-widest focus:outline-none focus:ring-2 focus:ring-emerald-700"
                  required
                />
              </div>

              <div className="flex items-center justify-between text-xs text-slate-400 mt-1">
                <span>{otpTimer > 0 ? `Resend SMS in ${otpTimer}s` : 'You can resend now'}</span>
                <button 
                  type="button" 
                  disabled={otpTimer > 0} 
                  onClick={handleSendOtp}
                  className={`font-semibold ${otpTimer > 0 ? 'text-slate-300 pointer-events-none' : 'text-emerald-800 hover:underline'}`}
                >
                  Resend OTP
                </button>
              </div>

              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => setMemberStep('phone')}
                  className="flex-1 bg-slate-100 hover:bg-slate-200 text-slate-600 font-bold py-3.5 rounded-xl text-xs transition-colors"
                >
                  Change Number
                </button>
                <button
                  id="mutawalli-verify-otp-submit"
                  type="submit"
                  className="flex-[2] bg-emerald-800 hover:bg-emerald-950 text-white font-bold py-3.5 rounded-xl text-sm transition-colors shadow-md flex items-center justify-center gap-1.5"
                >
                  <span>ओ.टी.पी सत्यापित करें (Verify OTP)</span>
                </button>
              </div>
            </form>
          )}

          {/* Step 3: Registration Fields for Unregistered Phone */}
          {memberStep === 'register' && (
            <form onSubmit={submitMutawalliRegistration} className="bg-white rounded-3xl shadow-xl border border-slate-100 p-6 flex flex-col gap-4 max-h-[60vh] overflow-y-auto pr-1">
              <div className="text-center pb-2 border-b border-slate-100">
                <span className="bg-amber-50 text-amber-800 text-[10px] font-black px-2.5 py-1 rounded-full uppercase tracking-wider">
                  Mobile Verified - Registration
                </span>
                <h3 className="text-sm font-bold text-slate-800 mt-1.5">पंजीकरण विवरण (New Profile Registration)</h3>
                <p className="text-[10px] text-slate-400">
                  Please link to your Masjid using its 6-digit Code. Complete bank details carefully to supervisor Baitul-Maal.
                </p>
              </div>

              <div className="flex flex-col gap-1 text-left">
                <label className="text-[11px] font-bold text-slate-600">मोबाइल नंबर (Prefilled Mobile)</label>
                <input
                  type="text"
                  value={phoneVal}
                  disabled
                  className="w-full bg-slate-100 border border-slate-200 rounded-xl p-2.5 text-xs text-slate-500 font-mono font-bold"
                />
              </div>

              {/* Name and father's name */}
              <div className="grid grid-cols-2 gap-2 text-left">
                <div className="flex flex-col gap-1">
                  <label className="text-[11px] font-bold text-slate-600">{t.nameLabel} *</label>
                  <input
                    id="mutawalli-reg-name"
                    type="text"
                    placeholder="Your Name"
                    value={memberName}
                    onChange={(e) => setMemberName(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs focus:ring-2 focus:ring-emerald-700"
                    required
                  />
                </div>
                <div className="flex flex-col gap-1">
                  <label className="text-[11px] font-bold text-slate-600">{t.fatherNameLabel} *</label>
                  <input
                    id="mutawalli-reg-father"
                    type="text"
                    placeholder="Father's Name"
                    value={fatherName}
                    onChange={(e) => setFatherName(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs focus:ring-2 focus:ring-emerald-700"
                    required
                  />
                </div>
              </div>

              {/* Aadhar */}
              <div className="flex flex-col gap-1 text-left">
                <label className="text-[11px] font-bold text-slate-600">{t.aadharLabel} *</label>
                <input
                  id="mutawalli-reg-aadhar"
                  type="text"
                  placeholder="xxxx-xxxx-xxxx"
                  value={aadhar}
                  onChange={(e) => setAadhar(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs focus:ring-2 focus:ring-emerald-700 font-mono"
                  required
                />
              </div>

              {/* Invitation Code for Mosque */}
              <div className="flex flex-col gap-1 text-left p-3.5 bg-amber-50/40 rounded-2xl border border-amber-500/10">
                <label className="text-xs font-bold text-emerald-900 flex items-center gap-1">
                  <Building2 className="w-3.5 h-3.5" />
                  मस्जिद कोड दर्ज करें (6-Digit Mosque Code) *
                </label>
                <input
                  id="mutawalli-reg-code"
                  type="text"
                  maxLength={6}
                  placeholder="e.g. 786110"
                  value={masjidCode}
                  onChange={(e) => setMasjidCode(e.target.value.replace(/\D/g, ''))}
                  className="w-full bg-white border border-slate-200 rounded-xl p-2.5 text-sm font-bold text-center tracking-widest font-mono focus:ring-2 focus:ring-emerald-700"
                  required
                />
                <p className="text-[9px] text-slate-400 mt-1 italic">
                  Link to Masjid Noor Al-Islam by entering invitation code <strong>786110</strong>.
                </p>
              </div>

              {/* Bank accounts */}
              <div className="flex flex-col gap-2 p-3 bg-slate-50 rounded-2xl border border-slate-200/50 text-left">
                <h4 className="text-[11px] font-bold text-emerald-950 border-b border-slate-200/60 pb-1 flex items-center justify-between">
                  <span>Baitul-Maal Savings Account Details</span>
                  <span className="text-[9px] text-slate-400">Emergencies Sync</span>
                </h4>
                
                <div className="flex flex-col gap-1">
                  <label className="text-[10px] font-bold text-slate-600">{t.bankNameLabel} *</label>
                  <input
                    id="mutawalli-reg-bank"
                    type="text"
                    placeholder="SBI, HDFC..."
                    value={bankName}
                    onChange={(e) => setBankName(e.target.value)}
                    className="w-full bg-white border border-slate-200 rounded-xl p-2 text-xs focus:ring-2 focus:ring-emerald-700"
                    required
                  />
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div className="flex flex-col gap-1">
                    <label className="text-[10px] font-bold text-slate-600">{t.accountNumberLabel} *</label>
                    <input
                      id="mutawalli-reg-account"
                      type="text"
                      placeholder="Account Number"
                      value={accNumber}
                      onChange={(e) => setAccNumber(e.target.value)}
                      className="w-full bg-white border border-slate-200 rounded-xl p-2 text-xs focus:ring-2 focus:ring-emerald-700 font-mono"
                      required
                    />
                  </div>
                  <div className="flex flex-col gap-1">
                    <label className="text-[10px] font-bold text-slate-600">{t.ifscCodeLabel} *</label>
                    <input
                      id="mutawalli-reg-ifsc"
                      type="text"
                      placeholder="IFSC Code"
                      value={ifsc}
                      onChange={(e) => setIfsc(e.target.value)}
                      className="w-full bg-white border border-slate-200 rounded-xl p-2 text-xs focus:ring-2 focus:ring-emerald-700 font-mono uppercase"
                      required
                    />
                  </div>
                </div>
              </div>

              <button
                id="mutawalli-reg-submit-btn"
                type="submit"
                className="w-full bg-emerald-800 hover:bg-emerald-950 text-white font-bold py-3.5 rounded-xl text-xs transition-colors shadow-md mt-2 flex items-center justify-center gap-1"
              >
                <span>पंजीकरण पूरा करें (Complete Registration)</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </form>
          )}

        </div>
      )}

      {/* ==================== IMAM SAHAB CORE INTERFACE (USERNAME + PASSWORD) ==================== */}
      {activeTab === 'admin' && (
        <div className="w-full">
          {/* Sub Tab selection between Login and Signup */}
          <div className="flex justify-center gap-3 mb-4">
            <button
              onClick={() => { setAdminStep('login'); setErrorMsg(''); setSuccessMsg(''); }}
              className={`text-xs px-3 py-1.5 rounded-lg font-bold transition-all ${
                adminStep === 'login' ? 'bg-emerald-100 text-emerald-950 border border-emerald-500/20' : 'text-slate-400 hover:text-slate-600'
              }`}
            >
              लॉग इन करें (Imam Login)
            </button>
            <button
              onClick={() => { setAdminStep('register'); setErrorMsg(''); setSuccessMsg(''); }}
              className={`text-xs px-3 py-1.5 rounded-lg font-bold transition-all ${
                adminStep === 'register' ? 'bg-emerald-100 text-emerald-950 border border-emerald-500/20' : 'text-slate-400 hover:text-slate-600'
              }`}
            >
              नया अकाउंट बनाएं (Imam Registration)
            </button>
          </div>

          {/* Sub-step 1: Imam Login */}
          {adminStep === 'login' && (
            <form onSubmit={handleImamLogin} className="bg-white rounded-3xl shadow-xl border border-slate-100 p-6 flex flex-col gap-4">
              <div className="flex items-center justify-between text-[11px] text-slate-400 font-mono">
                <span className="uppercase tracking-wider font-bold">IMAM ENTRANCE</span>
                <button
                  type="button"
                  onClick={() => { setAdminUsername('imam'); setAdminPassword('123456'); }}
                  className="text-amber-600 hover:text-amber-700 font-bold hover:underline"
                >
                  ⚡ Auto-fill
                </button>
              </div>

              {/* Username Input */}
              <div className="flex flex-col gap-1 text-left">
                <label className="text-xs font-bold text-slate-700">इमाम यूजरनेम (Imam Username) *</label>
                <div className="relative mt-1">
                  <User className="absolute left-3.5 top-3.5 w-4 h-4 text-slate-400" />
                  <input
                    id="admin-username-input"
                    type="text"
                    value={adminUsername}
                    onChange={(e) => setAdminUsername(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl py-3 pl-10 pr-4 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-700 text-slate-800 font-medium font-mono"
                    required
                  />
                </div>
              </div>

              {/* Password Input */}
              <div className="flex flex-col gap-1 text-left">
                <label className="text-xs font-bold text-slate-700">पासवर्ड (Password) *</label>
                <div className="relative mt-1">
                  <Lock className="absolute left-3.5 top-3.5 w-4 h-4 text-slate-400" />
                  <input
                    id="admin-password-input"
                    type="password"
                    value={adminPassword}
                    onChange={(e) => setAdminPassword(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl py-3 pl-10 pr-4 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-700 text-slate-800 font-mono"
                    required
                  />
                </div>
              </div>

              <button
                id="admin-login-submit"
                type="submit"
                className="w-full bg-emerald-800 hover:bg-emerald-950 text-white font-bold py-3.5 rounded-xl text-sm transition-colors shadow-md mt-2 flex items-center justify-center gap-1.5"
              >
                <span>सुरक्षित लॉग इन (Sign In as Imam)</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </form>
          )}

          {/* Sub-step 2: Imam Registration (Sign Up) */}
          {adminStep === 'register' && (
            <form onSubmit={handleImamRegistration} className="bg-white rounded-3xl shadow-xl border border-slate-100 p-6 flex flex-col gap-4 max-h-[60vh] overflow-y-auto pr-1">
              <div className="text-center pb-2 border-b border-slate-100">
                <h3 className="text-sm font-bold text-slate-800">इमाम साहब पंजीकरण (Imam Registration)</h3>
                <p className="text-[10px] text-slate-400 mt-1 italic">
                  Only authentic mosque Imams are authorized to register as Admin. Provide clean credentials.
                </p>
              </div>

              {/* Full Name */}
              <div className="flex flex-col gap-1 text-left">
                <label className="text-[11px] font-bold text-slate-600">इमाम साहब का पूरा नाम (Imam's Full Name) *</label>
                <input
                  id="reg-imam-name"
                  type="text"
                  placeholder="Maulana Zubair Ahmad..."
                  value={regImamName}
                  onChange={(e) => setRegImamName(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs focus:ring-2 focus:ring-emerald-700"
                  required
                />
              </div>

              {/* Username & Password Grid */}
              <div className="grid grid-cols-2 gap-2 text-left">
                <div className="flex flex-col gap-1">
                  <label className="text-[11px] font-bold text-slate-600">यूजरनेम (Username) *</label>
                  <input
                    id="reg-imam-username"
                    type="text"
                    placeholder="e.g. zubair_imam"
                    value={regImamUsername}
                    onChange={(e) => setRegImamUsername(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs focus:ring-2 focus:ring-emerald-700 font-mono font-bold"
                    required
                  />
                </div>
                <div className="flex flex-col gap-1">
                  <label className="text-[11px] font-bold text-slate-600">पासवर्ड (Password) *</label>
                  <input
                    id="reg-imam-pwd"
                    type="password"
                    placeholder="Min 6 chars"
                    value={regImamPassword}
                    onChange={(e) => setRegImamPassword(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs focus:ring-2 focus:ring-emerald-700 font-mono"
                    required
                  />
                </div>
              </div>

              {/* Phone number */}
              <div className="flex flex-col gap-1 text-left">
                <label className="text-[11px] font-bold text-slate-600">मोबाइल नंबर (Mobile Phone Number) *</label>
                <input
                  id="reg-imam-phone"
                  type="tel"
                  placeholder="10-digit number"
                  value={regImamPhone}
                  onChange={(e) => setRegImamPhone(e.target.value.replace(/\D/g, ''))}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs focus:ring-2 focus:ring-emerald-700 font-mono"
                  required
                />
              </div>

              {/* Masjid Registration Choices */}
              <div className="border-t border-slate-100 pt-3 flex flex-col gap-2.5 text-left">
                <label className="text-xs font-black text-emerald-950 uppercase tracking-wide">मस्जिद का चयन करें (Choose Masjid Mode) *</label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setMasjidMode('existing')}
                    className={`py-2 px-3 text-center text-xs rounded-xl border font-bold ${
                      masjidMode === 'existing' ? 'bg-emerald-50 text-emerald-950 border-emerald-500/20' : 'bg-slate-50 text-slate-500'
                    }`}
                  >
                    मौजूदा मस्जिद लिंक करें
                  </button>
                  <button
                    type="button"
                    onClick={() => setMasjidMode('new')}
                    className={`py-2 px-3 text-center text-xs rounded-xl border font-bold ${
                      masjidMode === 'new' ? 'bg-emerald-50 text-emerald-950 border-emerald-500/20' : 'bg-slate-50 text-slate-500'
                    }`}
                  >
                    ➕ नई मस्जिद पंजीकृत करें
                  </button>
                </div>

                {masjidMode === 'existing' ? (
                  <div className="flex flex-col gap-1 bg-slate-50 p-3 rounded-2xl border border-slate-200/50">
                    <label className="text-[10px] font-bold text-slate-600">मस्जिद का 6-अंकीय कोड (Enter Existing Masjid Code) *</label>
                    <input
                      id="reg-masjid-code"
                      type="text"
                      maxLength={6}
                      placeholder="e.g. 786110"
                      value={existingMasjidCode}
                      onChange={(e) => setExistingMasjidCode(e.target.value)}
                      className="w-full bg-white border border-slate-200 rounded-xl p-2 text-xs font-bold font-mono tracking-wider"
                    />
                    <p className="text-[9px] text-slate-400 mt-0.5">Enter code of registered mosque to become its imam.</p>
                  </div>
                ) : (
                  <div className="flex flex-col gap-2 bg-emerald-50/20 p-3.5 rounded-2xl border border-emerald-600/10">
                    <h4 className="text-[11px] font-black uppercase text-emerald-900">मस्जिद का विवरण (New Mosque Details)</h4>
                    
                    <div className="flex flex-col gap-1">
                      <label className="text-[10px] font-bold text-slate-500">मस्जिद का नाम (Masjid Name) *</label>
                      <input
                        type="text"
                        placeholder="e.g. Masjid Al-Ansar"
                        value={newMasjidName}
                        onChange={(e) => setNewMasjidName(e.target.value)}
                        className="w-full bg-white border border-slate-200 rounded-xl p-2 text-xs"
                      />
                    </div>

                    <div className="flex flex-col gap-1">
                      <label className="text-[10px] font-bold text-slate-500">शहर / गाँव (City/Village Location) *</label>
                      <input
                        type="text"
                        placeholder="e.g. Azamgarh, Rampur, Lucknow..."
                        value={newMasjidCity}
                        onChange={(e) => setNewMasjidCity(e.target.value)}
                        className="w-full bg-white border border-slate-200 rounded-xl p-2 text-xs"
                      />
                    </div>

                    <div className="flex flex-col gap-1">
                      <label className="text-[10px] font-bold text-slate-500">पूरा पता (Neighborhood Address) *</label>
                      <input
                        type="text"
                        placeholder="e.g. Station road, Near City Plaza"
                        value={newMasjidAddress}
                        onChange={(e) => setNewMasjidAddress(e.target.value)}
                        className="w-full bg-white border border-slate-200 rounded-xl p-2 text-xs"
                      />
                    </div>
                  </div>
                )}
              </div>

              <button
                id="imam-reg-submit-btn"
                type="submit"
                className="w-full bg-emerald-800 hover:bg-emerald-950 text-white font-black py-3.5 rounded-xl text-xs uppercase tracking-wider shadow-md mt-2 flex items-center justify-center gap-1"
              >
                <span>अकाउंट बनाएं (Complete Signup)</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </form>
          )}

        </div>
      )}

      {/* Sandbox Demo Credentials Indicator */}
      <div className="mt-8 p-4 bg-amber-50/40 rounded-2xl border border-amber-200/50 text-[11px] text-slate-600 max-w-sm mx-auto text-left">
        <span className="font-bold text-amber-700 block mb-1">💡 Sandbox Developer Guidelines:</span>
        <ul className="list-disc list-inside space-y-1 text-[10px]">
          <li><strong>Imam Login:</strong> Username <code>imam</code> & Password <code>123456</code>. Or sign up as a new Imam & register your custom city!</li>
          <li><strong>Mutawalli Login:</strong> Enter phone <code>9988776655</code> to test seeded committee member login instantly.</li>
        </ul>
      </div>
    </div>
  );
}
