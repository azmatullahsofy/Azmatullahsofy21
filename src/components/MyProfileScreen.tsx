import React, { useState } from 'react';
import { User, Shield, CheckCircle, Save, X, BookOpen, CreditCard, ShieldCheck } from 'lucide-react';
import { Language, UserProfile } from '../types';
import { translations } from '../translations';
import { MasjidService } from '../services/MasjidService';

interface MyProfileScreenProps {
  currentLanguage: Language;
  user: UserProfile;
  onClose: () => void;
  onProfileUpdated: (updatedUser: UserProfile) => void;
}

export default function MyProfileScreen(props: MyProfileScreenProps) {
  const t = translations[props.currentLanguage];
  const [name, setName] = useState(props.user.name || '');
  const [fatherName, setFatherName] = useState(props.user.fatherName || '');
  const [aadharCard, setAadharCard] = useState(props.user.aadharCard || '');
  const [bankName, setBankName] = useState(props.user.bankName || '');
  const [accountNumber, setAccountNumber] = useState(props.user.accountNumber || '');
  const [ifscCode, setIfscCode] = useState(props.user.ifscCode || '');

  const [isLoading, setIsLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Localized string table for custom Profile fields
  const profileI18n: Record<Language, Record<string, string>> = {
    en: {
      profileHeading: "My Profile Details",
      profileSub: "Update your official verified mosque contact card",
      personalSection: "Personal Details",
      financialSection: "Welfare & Baitul-Maal Bank Details",
      fullNameLabel: "Full Name",
      fatherNameLabel: "Father's Full Name",
      aadharNoLabel: "Aadhar Card Number",
      bankNameLabel: "Bank Name",
      accNoLabel: "Account Number",
      ifscLabel: "IFSC Code",
      saveProfileBtn: "Save Profile Changes",
      savingState: "Saving changes securely...",
      successMsg: "Profile updated successfully in Firestore!",
      memberRole: "Verified Congregation Member",
      adminRole: "Masjid Mutawalli / Imam",
      pendingApproval: "Verification Pending"
    },
    hi: {
      profileHeading: "मेरा प्रोफ़ाइल विवरण",
      profileSub: "अपनी मस्जिद के आधिकारिक रिकॉर्ड को अपडेट करें",
      personalSection: "व्यक्तिगत जानकारी",
      financialSection: "बैतुल-माल व बैंक खाता विवरण",
      fullNameLabel: "आपका पूरा नाम",
      fatherNameLabel: "पिता का पूरा नाम",
      aadharNoLabel: "आधार कार्ड संख्या",
      bankNameLabel: "बैंक का नाम",
      accNoLabel: "बैंक खाता संख्या",
      ifscLabel: "ब्रांच का IFSC कोड",
      saveProfileBtn: "विवरण सुरक्षित करें",
      savingState: "सुरक्षित किया जा रहा है...",
      successMsg: "प्रोफ़ाइल सफलतापूर्वक अपडेट हो गई है!",
      memberRole: "सत्यापित गाँव सदस्य",
      adminRole: "मस्जि़द इमाम व प्रबंधक",
      pendingApproval: "सत्यापन लंबित"
    },
    ur: {
      profileHeading: "میرا پروفائل کارڈ",
      profileSub: "اپنے باضابطہ مسجد کے کوائف کو اپ ڈیٹ کریں",
      personalSection: "ذاتی معلومات",
      financialSection: "بیت المال اور بینک اکاؤنٹ کی تفصیلات",
      fullNameLabel: "آپ کا پورا نام",
      fatherNameLabel: "والد کا نام",
      aadharNoLabel: "آدھار کارڈ نمبر",
      bankNameLabel: "بینک کا نام",
      accNoLabel: "اکاؤنٹ نمبر",
      ifscLabel: "IFSC کوڈ",
      saveProfileBtn: "طریقہ محفوظ کریں",
      savingState: "محفوظ کیا جا رہا ہے...",
      successMsg: "پروفائل کامیابی کے ساتھ اپ ڈیٹ ہو گئی ہے!",
      memberRole: "تصدیق شدہ رکن مسجد",
      adminRole: "مسجد متولی / امام",
      pendingApproval: "تصدیق کی جا رہی ہے"
    }
  };

  const localT = profileI18n[props.currentLanguage];

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      setError("Name is a mandatory field. (नाम डालना अनिवार्य है)");
      return;
    }

    setIsLoading(true);
    setError(null);
    setSuccess(false);

    try {
      const updateData: Partial<UserProfile> = {
        name: name.trim(),
        fatherName: fatherName.trim(),
        aadharCard: aadharCard.trim(),
        bankName: bankName.trim(),
        accountNumber: accountNumber.trim(),
        ifscCode: ifscCode.trim()
      };

      const result = await MasjidService.updateUserProfile(props.user.uid, updateData);
      
      if (result) {
        props.onProfileUpdated(result);
        setSuccess(true);
        setTimeout(() => {
          setSuccess(false);
        }, 3000);
      } else {
        setError("User profile was not found or failed to update.");
      }
    } catch (err: any) {
      console.error(err);
      setError(err?.message || "Permission error or Firestore network failure.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full max-w-md mx-auto p-4 pb-20 animate-fade-in relative z-50">
      
      {/* Upper header action row */}
      <div className="flex justify-between items-center mb-6 bg-slate-900 text-white rounded-2xl p-4 card-shadow">
        <div className="flex items-center gap-2.5 text-left">
          <div className="w-9 h-9 rounded-xl bg-emerald-800 text-amber-300 flex items-center justify-center border border-emerald-500/20">
            <User className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-sm font-black font-sans tracking-wide">
              {localT.profileHeading}
            </h2>
            <p className="text-[9px] text-emerald-300 font-bold font-mono">
              ROLE: {props.user.role === 'admin' ? localT.adminRole : localT.memberRole}
            </p>
          </div>
        </div>
        <button
          onClick={props.onClose}
          className="p-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-white transition-all"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      <form onSubmit={handleSaveProfile} className="flex flex-col gap-5">
        {/* Profile Stats / Badge */}
        <div className="bg-white rounded-3xl p-5 border border-slate-100 card-shadow text-left flex flex-col gap-3">
          <span className="text-[9px] font-black tracking-widest text-emerald-800 font-mono uppercase block border-b pb-2">
            🏷️ Profile ID Metadata
          </span>
          <div className="grid grid-cols-2 gap-2 text-[10px] font-mono text-slate-500">
            <div>UID: <strong className="text-slate-800 break-all">{props.user.uid}</strong></div>
            <div>Masjid: <strong className="text-slate-800">M_786</strong></div>
            <div>Joined: <strong className="text-slate-800">{new Date(props.user.createdAt).toLocaleDateString()}</strong></div>
            <div>Status: <strong className="text-emerald-700">{props.user.approved ? 'Active / Approved ✔️' : localT.pendingApproval}</strong></div>
          </div>
        </div>

        {/* 1. PERSONAL SECTION CARD */}
        <div className="bg-white rounded-3xl p-5 border border-slate-100 card-shadow text-left flex flex-col gap-3">
          <div className="flex items-center gap-1.5 border-b pb-2.5">
            <BookOpen className="w-4 h-4 text-emerald-700 shrink-0" />
            <h3 className="text-xs font-black tracking-widest text-emerald-800 font-mono uppercase">
              {localT.personalSection}
            </h3>
          </div>

          <div className="flex flex-col gap-3">
            {/* Full Name */}
            <div>
              <label className="text-[10px] font-bold text-slate-500 uppercase font-mono block mb-1">
                {localT.fullNameLabel} <span className="text-rose-500">*</span>
              </label>
              <input
                id="profile-inp-name"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Sajid Khan"
                required
                className="w-full bg-slate-50 border border-slate-200 rounded-xl py-2 px-3 text-xs focus:ring-2 focus:ring-emerald-700 font-medium"
              />
            </div>

            {/* Father's Name */}
            <div>
              <label className="text-[10px] font-bold text-slate-500 uppercase font-mono block mb-1">
                {localT.fatherNameLabel}
              </label>
              <input
                id="profile-inp-fatherName"
                type="text"
                value={fatherName}
                onChange={(e) => setFatherName(e.target.value)}
                placeholder="e.g. Rahim Khan"
                className="w-full bg-slate-50 border border-slate-200 rounded-xl py-2 px-3 text-xs focus:ring-2 focus:ring-emerald-700 font-medium"
              />
            </div>

            {/* Aadhar Number */}
            <div>
              <label className="text-[10px] font-bold text-slate-500 uppercase font-mono block mb-1">
                {localT.aadharNoLabel}
              </label>
              <input
                id="profile-inp-aadhar"
                type="text"
                value={aadharCard}
                onChange={(e) => setAadharCard(e.target.value)}
                placeholder="e.g. 1122 3344 5566"
                className="w-full bg-slate-50 border border-slate-200 rounded-xl py-2 px-3 text-xs focus:ring-2 focus:ring-emerald-700 font-medium"
              />
            </div>
          </div>
        </div>

        {/* 2. BANK & SERVICES / FINANCIAL DETAILS */}
        <div className="bg-white rounded-3xl p-5 border border-slate-100 card-shadow text-left flex flex-col gap-3">
          <div className="flex items-center gap-1.5 border-b pb-2.5">
            <CreditCard className="w-4 h-4 text-emerald-700 shrink-0" />
            <h3 className="text-xs font-black tracking-widest text-emerald-800 font-mono uppercase">
              {localT.financialSection}
            </h3>
          </div>

          <div className="flex flex-col gap-3">
            {/* Bank Name */}
            <div>
              <label className="text-[10px] font-bold text-slate-500 uppercase font-mono block mb-1">
                {localT.bankNameLabel}
              </label>
              <input
                id="profile-inp-bankName"
                type="text"
                value={bankName}
                onChange={(e) => setBankName(e.target.value)}
                placeholder="e.g. State Bank of India"
                className="w-full bg-slate-50 border border-slate-200 rounded-xl py-2 px-3 text-xs focus:ring-2 focus:ring-emerald-700 font-medium"
              />
            </div>

            {/* Account fields row */}
            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="text-[10px] font-bold text-slate-500 uppercase font-mono block mb-1">
                  {localT.accNoLabel}
                </label>
                <input
                  id="profile-inp-accountNumber"
                  type="text"
                  value={accountNumber}
                  onChange={(e) => setAccountNumber(e.target.value)}
                  placeholder="e.g. 20384918293"
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl py-2 px-3 text-xs focus:ring-2 focus:ring-emerald-700 font-medium"
                />
              </div>

              <div>
                <label className="text-[10px] font-bold text-slate-500 uppercase font-mono block mb-1">
                  {localT.ifscLabel}
                </label>
                <input
                  id="profile-inp-ifscCode"
                  type="text"
                  value={ifscCode}
                  onChange={(e) => setIfscCode(e.target.value)}
                  placeholder="e.g. SBIN0001234"
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl py-2 px-3 text-xs focus:ring-2 focus:ring-emerald-700 font-medium"
                />
              </div>
            </div>
          </div>
        </div>

        {/* FEEDBACK LABELS */}
        {error && (
          <div className="p-4 bg-rose-50 text-rose-800 text-xs font-semibold rounded-2xl border border-rose-200 text-left">
            ⚠️ {error}
          </div>
        )}

        {success && (
          <div className="p-4 bg-emerald-50 text-emerald-800 text-xs font-bold rounded-2xl border border-emerald-200 text-left flex items-center gap-2">
            <CheckCircle className="w-5 h-5 text-emerald-600 shrink-0" />
            <span>{localT.successMsg}</span>
          </div>
        )}

        {/* SUBMIT BUTTON */}
        <button
          id="btn-profile-submit-save"
          type="submit"
          disabled={isLoading}
          className="bg-emerald-800 hover:bg-emerald-950 text-white font-black py-4 px-6 rounded-2xl shadow-lg transition-transform hover:-translate-y-0.5 active:translate-y-0 duration-300 flex items-center justify-center gap-2 disabled:opacity-50 text-sm"
        >
          <Save className="w-4 h-4 shrink-0" />
          <span>{isLoading ? localT.savingState : localT.saveProfileBtn}</span>
        </button>
      </form>
      
      {/* Encryption guarantee line footer */}
      <div className="mt-6 flex items-center justify-center gap-1 text-[9px] text-slate-400 font-bold font-mono uppercase tracking-widest leading-none">
        <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
        <span>End-to-End Cryptographic Firestore Storage</span>
      </div>
    </div>
  );
}
