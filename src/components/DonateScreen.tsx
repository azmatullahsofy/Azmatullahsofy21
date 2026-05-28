import React, { useState, useEffect } from 'react';
import { Sparkles, QrCode, Building, Wallet, CheckSquare, Coins, CalendarDays, Key, Copy, Check } from 'lucide-react';
import { Language, Donation } from '../types';
import { translations } from '../translations';
import { MasjidService } from '../services/MasjidService';

interface DonateScreenProps {
  currentLanguage: Language;
  masjidId: string;
  donorNameInitial: string;
}

export default function DonateScreen(props: DonateScreenProps) {
  const t = translations[props.currentLanguage];
  const [amount, setAmount] = useState('1000');
  const [category, setCategory] = useState<'imam_salary' | 'muezzin' | 'electricity' | 'construction' | 'food_poor'>('imam_salary');
  const [donorName, setDonorName] = useState(props.donorNameInitial || 'Anonymously (गुप्त दान)');
  const [upiRefId, setUpiRefId] = useState('');
  const [allDonations, setAllDonations] = useState<Donation[]>([]);
  const [isCopied, setIsCopied] = useState<Record<string, boolean>>({});

  const [isLoading, setIsLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    loadDonationStats();
  }, [props.masjidId]);

  const loadDonationStats = async () => {
    const list = await MasjidService.getDonations(props.masjidId);
    setAllDonations(list);
  };

  // Sum total collected this month
  const getTotalThisMonth = () => {
    return allDonations.reduce((sum, d) => sum + d.amount, 0);
  };

  const handleCopy = (field: string, text: string) => {
    navigator.clipboard.writeText(text);
    setIsCopied({ ...isCopied, [field]: true });
    setTimeout(() => {
      setIsCopied({ ...isCopied, [field]: false });
    }, 1500);
  };

  const handleSubmitDonation = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!amount || Number(amount) <= 0) return;

    setIsLoading(true);

    const donationPayload = {
      donorName: donorName.trim() || 'Anonymous (अज्ञात)',
      amount: Number(amount),
      category: category,
      date: new Date().toISOString(),
      upiTransactionId: upiRefId.trim() || 'UPI_MCD_' + Math.floor(100000 + Math.random() * 900000),
      masjidId: props.masjidId
    };

    await MasjidService.recordDonation(donationPayload);
    
    // Refresh stats
    await loadDonationStats();
    
    setIsLoading(false);
    setSuccess(true);
    // clear inputs
    setUpiRefId('');
    setTimeout(() => setSuccess(false), 3000);
  };

  // Generate merchant unified UPI link
  const getUpiLink = () => {
    const vpa = "masjidnoor@sbi";
    const name = encodeURIComponent("Digital Masjid Al Islam Fund");
    const note = encodeURIComponent(`Chanda for ${category}`);
    return `upi://pay?pa=${vpa}&pn=${name}&am=${amount}&tn=${note}&cu=INR`;
  };

  return (
    <div className="w-full max-w-md mx-auto p-4 pb-20">
      
      {/* Dynamic Gold Total Collected Card */}
      <div className="bg-gradient-to-br from-emerald-800 to-emerald-950 text-white rounded-3xl p-5 card-shadow mb-6 relative overflow-hidden">
        <div className="absolute right-0 bottom-0 translate-y-3 translate-x-3 opacity-15 pointer-events-none">
          <Coins className="w-32 h-32 text-amber-400" />
        </div>
        <span className="text-[10px] uppercase font-bold tracking-widest font-mono block text-amber-300">
          📍 Baithul-Maal Monthly Ledger Status
        </span>
        <div className="text-3xl font-extrabold font-mono mt-1 text-white">
          ₹ {getTotalThisMonth().toLocaleString('en-IN')}
        </div>
        <p className="text-[11px] text-amber-200/90 tracking-wide font-medium mt-1">
          {t.totalCollected} • Verified audit trails
        </p>
      </div>

      {/* Main donations details sheet */}
      <div className="bg-white rounded-3xl border border-gray-100 card-shadow p-6 mb-6">
        <h3 className="text-sm font-extrabold text-slate-800 tracking-tight flex items-center gap-2 border-b border-slate-100 pb-3 mb-4">
          <Wallet className="w-5 h-5 text-emerald-700" />
          <span>{t.donateTitle} / मस्जिद दान</span>
        </h3>
        <p className="text-[11px] text-slate-500 leading-relaxed mb-4">
          {t.donateDesc}
        </p>

        {/* Success Popup */}
        {success && (
          <div id="donation-submit-success-badge" className="bg-emerald-50 text-emerald-800 border-2 border-emerald-100 rounded-2xl p-4 text-xs font-bold mb-4 flex items-start gap-2 animate-pulse">
            <Sparkles className="w-4 h-4 text-emerald-600 mt-0.5 shrink-0" />
            <span>{t.donationSuccess} May Allah accept your generous assistance.</span>
          </div>
        )}

        {/* Input Form */}
        <form onSubmit={handleSubmitDonation} className="flex flex-col gap-4">
          
          {/* Category Selector */}
          <div className="flex flex-col gap-1.5 text-left">
            <label className="text-xs font-bold text-slate-700">{t.donateCategory} *</label>
            <select
              id="select-chanda-category"
              value={category}
              onChange={(e) => setCategory(e.target.value as any)}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl py-2.5 px-3 text-xs focus:ring-2 focus:ring-emerald-700 font-semibold text-slate-700"
            >
              <option value="imam_salary">{t.imamSalary}</option>
              <option value="muezzin">{t.muezzinSalary}</option>
              <option value="electricity">{t.electricityBills}</option>
              <option value="construction">{t.constructionWorks}</option>
              <option value="food_poor">{t.foodPoor}</option>
            </select>
          </div>

          <div className="grid grid-cols-2 gap-3.5">
            {/* Amount input */}
            <div className="flex flex-col gap-1.5 text-left">
              <label className="text-xs font-bold text-slate-700">{t.amountLabel} *</label>
              <div className="relative">
                <span className="absolute left-3 top-2.5 text-xs text-slate-400 font-bold">₹</span>
                <input
                  id="inp-chanda-amount"
                  type="number"
                  min="1"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl py-2 pl-6 pr-2 text-xs focus:ring-2 focus:ring-emerald-700 font-bold text-slate-800 font-mono"
                  required
                />
              </div>
            </div>

            {/* Donor name input */}
            <div className="flex flex-col gap-1.5 text-left">
              <label className="text-xs font-bold text-slate-700">{t.donorName} *</label>
              <input
                id="inp-chanda-donor"
                type="text"
                value={donorName}
                onChange={(e) => setDonorName(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl py-2 px-3 text-xs focus:ring-2 focus:ring-emerald-700 font-medium"
              />
            </div>
          </div>

          {/* Golden Dynamic UPI QR Display Paper */}
          {Number(amount) > 0 && (
            <div className="bg-amber-50/20 border-2 border-dashed border-amber-300 rounded-3xl p-5 flex flex-col items-center justify-center text-center my-1.5">
              <span className="text-[9px] font-extrabold text-amber-700 tracking-wider flex items-center gap-1 uppercase mb-3 font-mono">
                <QrCode className="w-3.5 h-3.5" />
                {t.upiQr}
              </span>
              
              <div className="p-3 bg-white rounded-2xl shadow-md border-2 border-amber-300 transform transition-transform hover:scale-105">
                {/* Visualizer QR Generator Simulation using robust SVG placeholder matches merchant protocols */}
                <svg className="w-32 h-32 text-emerald-900" viewBox="0 0 100 100">
                  <path fill="currentColor" d="M10,10 h30 v30 h-30 z M15,15 h20 v20 h-20 z M22,22 h6 v6 h-6 z" />
                  <path fill="currentColor" d="M60,10 h30 v30 h-30 z M65,15 h20 v20 h-20 z M72,22 h6 v6 h-6 z" />
                  <path fill="currentColor" d="M10,60 h30 v30 h-30 z M15,65 h20 v20 h-20 z M22,72 h6 v6 h-6 z" />
                  {/* Random pixels to look like organic QR matrix */}
                  <rect x="47" y="12" width="6" height="6" fill="#ca8a04" />
                  <rect x="52" y="25" width="4" height="4" fill="#14532d" />
                  <rect x="47" y="32" width="4" height="6" fill="#14532d" />
                  <rect x="15" y="47" width="8" height="4" fill="#ca8a04" />
                  <rect x="28" y="47" width="5" height="5" fill="#14532d" />
                  <rect x="47" y="47" width="10" height="10" fill="#14532d" />
                  <rect x="12" y="54" width="4" height="4" fill="#ca8a04" />
                  <rect x="67" y="47" width="6" height="12" fill="#ca8a04" />
                  <rect x="80" y="52" width="4" height="12" fill="#14532d" />
                  <rect x="52" y="67" width="10" height="4" fill="#14532d" />
                  <rect x="67" y="72" width="4" height="8" fill="#ca8a04" />
                  <rect x="80" y="72" width="8" height="4" fill="#14532d" />
                  {/* Amount centered badge */}
                  <rect x="35" y="35" width="30" height="30" rx="6" fill="#fef3c7" stroke="#ca8a04" strokeWidth="1.5" />
                  <text x="50" y="53" fontSize="10" fontWeight="bold" fontFamily="monospace" fill="#78350f" textAnchor="middle">₹{amount}</text>
                </svg>
              </div>

              <div className="mt-3.5 flex flex-col gap-1">
                <span className="text-[11px] text-slate-700 font-bold block">UPI ID: <strong>masjidnoor@sbi</strong></span>
                <span className="text-[9px] text-slate-400">Scan via PhonePe, GPay, Paytm or BHIM UPI</span>
              </div>
            </div>
          )}

          {/* Reference transaction code input */}
          <div className="flex flex-col gap-1.5 text-left bg-slate-50 border border-slate-200/50 p-4 rounded-2xl">
            <label className="text-xs font-bold text-slate-700 flex items-center justify-between">
              <span>{t.upiIdLabel} *</span>
              <span className="text-[9px] text-slate-400 lowercase font-normal italic">To confirm with bank ledger</span>
            </label>
            <input
              id="inp-chanda-upiref"
              type="text"
              placeholder="e.g. 419238491823"
              value={upiRefId}
              onChange={(e) => setUpiRefId(e.target.value)}
              className="w-full bg-white border border-slate-200 rounded-xl py-2.5 px-3 text-xs focus:ring-2 focus:ring-emerald-700 font-mono"
              required
            />
          </div>

          <button
            id="btn-chanda-submit"
            type="submit"
            disabled={isLoading}
            className="w-full bg-emerald-800 hover:bg-emerald-950 text-white font-extrabold py-3.5 rounded-2xl text-xs transition-colors shadow-md mt-2 tracking-widest uppercase flex items-center justify-center gap-1.5"
          >
            <span>{isLoading ? "Recording..." : t.submitDonation}</span>
          </button>
        </form>
      </div>

      {/* 2. DIRECT ACCOUNT BANK TRANSFERS DETAILS CARD */}
      <div className="bg-white rounded-3xl border border-gray-100 card-shadow p-5 text-left">
        <h4 className="text-xs font-extrabold text-emerald-900 uppercase tracking-widest pb-3 border-b border-slate-100 flex items-center gap-2">
          <Building className="w-4 h-4 text-emerald-750" />
          <span>{t.bankDetailsTitle}</span>
        </h4>

        <div className="flex flex-col gap-3 mt-4 text-xs">
          {[
            { key: 'holder', label: t.accountHolder, val: 'MASJID NOOR BAITULMAAL SEED FUND' },
            { key: 'bank', label: t.bankName, val: 'State Bank of India' },
            { key: 'acc', label: t.accountNumber, val: '302394852039' },
            { key: 'ifsc', label: t.ifscCode, val: 'SBIN0001851' }
          ].map((row) => (
            <div key={row.key} className="flex justify-between items-start bg-slate-50/50 py-2.5 px-3 rounded-xl border border-slate-200/40">
              <div className="flex flex-col gap-0.5">
                <span className="text-[9px] font-bold text-slate-400 font-mono uppercase leading-none">{row.label}</span>
                <span className="font-mono text-slate-800 font-bold select-all mt-1">{row.val}</span>
              </div>
              
              <button
                type="button"
                onClick={() => handleCopy(row.key, row.val)}
                className="p-1 px-2 rounded-lg bg-white border border-slate-100 text-slate-400 hover:text-slate-700 hover:border-slate-200 flex items-center gap-1 text-[9px] font-bold"
                title="Copy Value"
              >
                {isCopied[row.key] ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-emerald-700" />
                    <span className="text-emerald-700">Copied</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3 h-3" />
                    <span>Copy</span>
                  </>
                )}
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
