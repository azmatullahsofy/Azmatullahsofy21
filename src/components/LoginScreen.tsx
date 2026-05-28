import React, { useState } from 'react';
import { Shield, KeyRound, User, Lock, ArrowLeft, ArrowRight, ShieldAlert, Sparkles, Building2 } from 'lucide-react';
import { Language, Role } from '../types';
import { translations } from '../translations';
import { MasjidService } from '../services/MasjidService';

interface LoginScreenProps {
  currentLanguage: Language;
  targetRole: 'admin' | 'member';
  onBack: () => void;
  onLoginSuccess: (userProfile: any) => void;
}

export default function LoginScreen(props: LoginScreenProps) {
  const t = translations[props.currentLanguage];
  const [activeTab, setActiveTab] = useState<'admin' | 'member'>(props.targetRole);

  // Admin form state
  const [adminEmail, setAdminEmail] = useState('imam@masjid.com');
  const [adminPassword, setAdminPassword] = useState('123456');

  // Member code entry states
  const [masjidCode, setMasjidCode] = useState('786110');
  const [memberName, setMemberName] = useState('Mohammad Azmatullah');
  const [fatherName, setFatherName] = useState('MD Shafiullah');
  const [aadhar, setAadhar] = useState('1234-5678-9012');
  const [bankName, setBankName] = useState('State Bank of India');
  const [accNumber, setAccNumber] = useState('321234567890');
  const [ifsc, setIfsc] = useState('SBIN0001234');

  const [step, setStep] = useState<1 | 2>(1); // Step 1: Code prompt. Step 2: Details prompt.
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  // Auto-fill preset for test drive ease
  const handleAutoFillAdmin = () => {
    setAdminEmail('imam@masjid.com');
    setAdminPassword('123456');
    setErrorMsg('');
  };

  const handleAutoFillMember = () => {
    setMasjidCode('786110');
    setMemberName('Mohammad Azmatullah');
    setFatherName('MD Shafiullah');
    setAadhar('1234-5678-9012');
    setBankName('State Bank of India');
    setAccNumber('321234567890');
    setIfsc('SBIN0001234');
    setErrorMsg('');
  };

  const verifyCodeAndProceed = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    if (masjidCode.trim().length !== 6) {
      setErrorMsg('Please enter a 6-digit invitation code.');
      return;
    }
    const masjid = await MasjidService.getMasjidByCode(masjidCode.trim());
    if (!masjid) {
      setErrorMsg('Invalid Mosque Code. Please ask your Imam for the active 6-digit code (e.g. 786110).');
      return;
    }
    setStep(2);
  };

  const submitAdminLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    
    if (adminEmail === 'imam@masjid.com' && adminPassword === '123456') {
      const adminProfile = {
        uid: 'admin_id_786',
        name: 'Imam Maulana Zubair Ahmad',
        role: 'admin',
        masjidId: 'm1',
        approved: true,
        createdAt: new Date().toISOString()
      };
      setSuccessMsg('Signed in as Imam Saheb!');
      setTimeout(() => props.onLoginSuccess(adminProfile), 600);
    } else {
      setErrorMsg('Invalid admin credentials. Please use the default login: imam@masjid.com / 123456');
    }
  };

  const submitMemberRegistration = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    if (!memberName.trim() || !fatherName.trim() || !aadhar.trim() || !bankName.trim() || !accNumber.trim() || !ifsc.trim()) {
      setErrorMsg('Please populate all required fields (*)');
      return;
    }

    const memberProfile = await MasjidService.joinMasjidWithCode(masjidCode.trim(), {
      uid: 'user_uid_' + Math.random().toString(36).substring(2, 6),
      name: memberName,
      fatherName: fatherName,
      aadharCard: aadhar,
      bankName: bankName,
      accountNumber: accNumber,
      ifscCode: ifsc
    });

    if (memberProfile) {
      setSuccessMsg('Registered & Logged in successfully!');
      setTimeout(() => props.onLoginSuccess(memberProfile), 600);
    } else {
      setErrorMsg('Registration failed. Please double-check mosque invitation code.');
    }
  };

  return (
    <div className="w-full max-w-md mx-auto p-4 min-h-[85vh] flex flex-col justify-center">
      {/* Back Button */}
      <button
        onClick={props.onBack}
        className="flex items-center gap-1.5 text-slate-500 hover:text-emerald-800 text-sm font-semibold mb-6 transition-colors self-start bg-slate-100 py-1.5 px-3.5 rounded-xl border border-slate-200"
      >
        <ArrowLeft className="w-4 h-4" />
        Back / वापिस
      </button>

      {/* Welcome Title */}
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-slate-900 tracking-tight flex items-center gap-2">
          <KeyRound className="w-6 h-6 text-emerald-700" />
          {t.loginTitle}
        </h2>
        <p className="text-xs text-slate-500 mt-1">
          Authenticate to listen to live Azan, request Baitul-Maal assistance, and log contributions.
        </p>
      </div>

      {/* Tabs */}
      <div className="flex bg-slate-100 rounded-2xl p-1 mb-6 border border-slate-200/60">
        <button
          onClick={() => { setActiveTab('member'); setErrorMsg(''); }}
          className={`flex-1 py-3 text-center text-xs font-bold rounded-xl transition-all duration-300 flex items-center justify-center gap-1.5 ${
            activeTab === 'member'
              ? 'bg-white text-emerald-950 shadow-sm border border-slate-200/50'
              : 'text-slate-500 hover:text-slate-800'
          }`}
        >
          <User className="w-4 h-4" />
          {t.loginMemberTab}
        </button>
        <button
          onClick={() => { setActiveTab('admin'); setErrorMsg(''); }}
          className={`flex-1 py-3 text-center text-xs font-bold rounded-xl transition-all duration-300 flex items-center justify-center gap-1.5 ${
            activeTab === 'admin'
              ? 'bg-white text-emerald-950 shadow-sm border border-slate-200/50'
              : 'text-slate-500 hover:text-slate-800'
          }`}
        >
          <Shield className="w-4 h-4" />
          {t.loginAdminTab}
        </button>
      </div>

      {/* Danger/Error Banner */}
      {errorMsg && (
        <div id="login-error-banner" className="bg-red-50 text-red-700 border-2 border-red-100 rounded-2xl p-4 text-xs font-medium mb-5 flex items-start gap-2.5 animate-bounce">
          <ShieldAlert className="w-4 h-4 shrink-0 text-red-500 mt-0.5" />
          <span>{errorMsg}</span>
        </div>
      )}

      {/* Success Banner */}
      {successMsg && (
        <div id="login-success-banner" className="bg-emerald-50 text-emerald-800 border border-emerald-200 rounded-2xl p-4 text-xs font-bold mb-5 flex items-start gap-2.5 animate-pulse">
          <Sparkles className="w-4 h-4 shrink-0 text-emerald-600 mt-0.5" />
          <span>{successMsg}</span>
        </div>
      )}

      {/* ADMIN LOGIN VIEW */}
      {activeTab === 'admin' && (
        <form onSubmit={submitAdminLogin} className="bg-white rounded-3xl shadow-xl border border-slate-100 p-6 flex flex-col gap-4">
          <div className="flex items-center justify-between text-xs text-slate-400 font-mono">
            <span>MUTAWALLI GATEWAY</span>
            <button
              type="button"
              onClick={handleAutoFillAdmin}
              className="text-amber-600 hover:text-amber-700 font-bold flex items-center gap-1"
            >
              ⚡ Click to Auto-Fill Demo
            </button>
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-xs font-bold text-slate-700">{t.emailLabel} *</label>
            <div className="relative">
              <User className="absolute left-3.5 top-3.5 w-4 h-4 text-slate-400" />
              <input
                id="admin-email-input"
                type="email"
                value={adminEmail}
                onChange={(e) => setAdminEmail(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl py-3 pl-10 pr-4 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-700 text-slate-800 font-medium font-mono"
                required
              />
            </div>
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-xs font-bold text-slate-700">{t.passwordLabel} *</label>
            <div className="relative">
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
            <span>{t.loginBtn}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>
      )}

      {/* MEMORY-MEMBER LOGIN VIEW */}
      {activeTab === 'member' && (
        <div className="bg-white rounded-3xl shadow-xl border border-slate-100 p-6 flex flex-col gap-4">
          
          {step === 1 ? (
            <form onSubmit={verifyCodeAndProceed} className="flex flex-col gap-4">
              <div className="flex items-center justify-between text-xs text-slate-400 font-mono">
                <span>VILLAGER GATEWAY</span>
                <button
                  type="button"
                  onClick={handleAutoFillMember}
                  className="text-amber-600 hover:text-amber-700 font-bold flex items-center gap-1"
                >
                  ⚡ Click to Auto-Fill
                </button>
              </div>

              <div className="flex flex-col gap-2">
                <label className="text-xs font-bold text-emerald-950 uppercase tracking-widest">{t.codeLabel} *</label>
                <p className="text-[11px] text-slate-500 italic mt-0.5">
                  Enter the 6-digit code generated by the Imam Saheb. Talk to your local Mosque committee if you do not have it yet. (Use <strong>786110</strong> for testing)
                </p>
                <div className="relative mt-2">
                  <Building2 className="absolute left-3.5 top-3.5 w-4 h-4 text-emerald-700" />
                  <input
                    id="member-code-input"
                    type="text"
                    maxLength={6}
                    value={masjidCode}
                    onChange={(e) => setMasjidCode(e.target.value)}
                    placeholder={t.codePlaceholder}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl py-3 pl-10 pr-4 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-700 text-slate-800 font-bold font-mono tracking-widest text-center text-lg"
                    required
                  />
                </div>
              </div>

              <button
                id="member-check-code-btn"
                type="submit"
                className="w-full bg-emerald-800 hover:bg-emerald-950 text-white font-bold py-3.5 rounded-xl text-sm transition-colors shadow-md mt-2 flex items-center justify-center gap-1.5"
              >
                <span>Continue</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </form>
          ) : (
            <form onSubmit={submitMemberRegistration} className="flex flex-col gap-4 max-h-[55vh] overflow-y-auto pr-1">
              <div className="text-center pb-2 border-b border-slate-100">
                <span className="bg-emerald-50 text-emerald-800 text-[10px] font-bold px-2.5 py-1 rounded-full uppercase tracking-wider">
                  Mosque Match Confirmed
                </span>
                <h3 className="text-sm font-bold text-slate-800 mt-1.5">Aapke Details / आपके विवरण</h3>
                <p className="text-[10px] text-slate-500">
                  Please verify bank details carefully to receive welfare (Baitul-Maal) money in emergency cases.
                </p>
              </div>

              {/* Name fields */}
              <div className="grid grid-cols-2 gap-2">
                <div className="flex flex-col gap-1">
                  <label className="text-xs font-bold text-slate-700">{t.nameLabel} *</label>
                  <input
                    id="member-reg-name"
                    type="text"
                    value={memberName}
                    onChange={(e) => setMemberName(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs focus:ring-2 focus:ring-emerald-700"
                    required
                  />
                </div>
                <div className="flex flex-col gap-1">
                  <label className="text-xs font-bold text-slate-700">{t.fatherNameLabel} *</label>
                  <input
                    id="member-reg-father"
                    type="text"
                    value={fatherName}
                    onChange={(e) => setFatherName(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs focus:ring-2 focus:ring-emerald-700"
                    required
                  />
                </div>
              </div>

              {/* Aadhar field */}
              <div className="flex flex-col gap-1">
                <label className="text-xs font-bold text-slate-700">{t.aadharLabel} *</label>
                <input
                  id="member-reg-aadhar"
                  type="text"
                  value={aadhar}
                  onChange={(e) => setAadhar(e.target.value)}
                  placeholder="12-digit UID"
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs focus:ring-2 focus:ring-emerald-700 font-mono"
                  required
                />
              </div>

              {/* Bank accounts */}
              <div className="flex flex-col gap-2 p-3 bg-slate-50 rounded-2xl border border-slate-200/50">
                <h4 className="text-xs font-bold text-emerald-900 border-b border-slate-200/60 pb-1 flex items-center justify-between">
                  <span>Bank details for Emergency Madad</span>
                  <span className="text-[9px] text-slate-400 capitalize hover:underline pointer-events-none">Strictly Confidential</span>
                </h4>
                
                <div className="flex flex-col gap-1">
                  <label className="text-[10px] font-bold text-slate-600">{t.bankNameLabel} *</label>
                  <input
                    id="member-reg-bank"
                    type="text"
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
                      id="member-reg-account"
                      type="text"
                      value={accNumber}
                      onChange={(e) => setAccNumber(e.target.value)}
                      className="w-full bg-white border border-slate-200 rounded-xl p-2 text-xs focus:ring-2 focus:ring-emerald-700 font-mono"
                      required
                    />
                  </div>
                  <div className="flex flex-col gap-1">
                    <label className="text-[10px] font-bold text-slate-600">{t.ifscCodeLabel} *</label>
                    <input
                      id="member-reg-ifsc"
                      type="text"
                      value={ifsc}
                      onChange={(e) => setIfsc(e.target.value)}
                      className="w-full bg-white border border-slate-200 rounded-xl p-2 text-xs focus:ring-2 focus:ring-emerald-700 font-mono uppercase"
                      required
                    />
                  </div>
                </div>
              </div>

              <div className="flex gap-2 mt-2">
                <button
                  type="button"
                  onClick={() => setStep(1)}
                  className="flex-1 bg-slate-100 hover:bg-slate-200 text-slate-600 font-bold py-3 rounded-xl text-xs transition-colors"
                >
                  Change Code
                </button>
                <button
                  id="member-submit-registration"
                  type="submit"
                  className="flex-[2] bg-emerald-800 hover:bg-emerald-950 text-white font-bold py-3 rounded-xl text-xs transition-with-shadow shadow-md flex items-center justify-center gap-1"
                >
                  <span>Register & Secure Login</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </form>
          )}

        </div>
      )}

      {/* Admin Demo Guide Notes */}
      <div className="mt-8 p-4 bg-amber-50/50 rounded-2xl border border-amber-200/50 text-[11px] text-slate-600 max-w-sm mx-auto">
        <span className="font-bold text-amber-700 block mb-1">Sandbox Demo Credentials:</span>
        <ul className="list-disc list-inside space-y-0.5">
          <li><strong>Imam Login:</strong> imam@masjid.com (PIN: 123456)</li>
          <li><strong>Villager Invitation:</strong> Pin code <strong>786110</strong></li>
        </ul>
      </div>
    </div>
  );
}
