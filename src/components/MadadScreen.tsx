import React, { useState, useEffect } from 'react';
import { HelpCircle, FileText, Landmark, RotateCcw, ShieldCheck, Sparkles, AlertCircle, RefreshCcw, X } from 'lucide-react';
import { Language, MadadRequest } from '../types';
import { translations } from '../translations';
import { MasjidService } from '../services/MasjidService';

interface MadadScreenProps {
  currentLanguage: Language;
  masjidId: string;
  memberProfile: any; // Checked if they are verified member
}

export default function MadadScreen(props: MadadScreenProps) {
  const t = translations[props.currentLanguage];
  const [activeTab, setActiveTab] = useState<'request' | 'return'>('request');
  
  // Assistance application states
  const [fullName, setFullName] = useState(props.memberProfile?.name || '');
  const [fatherName, setFatherName] = useState(props.memberProfile?.fatherName || '');
  const [aadhar, setAadhar] = useState(props.memberProfile?.aadharCard || '');
  const [bankName, setBankName] = useState(props.memberProfile?.bankName || '');
  const [accNum, setAccNum] = useState(props.memberProfile?.accountNumber || '');
  const [ifsc, setIfsc] = useState(props.memberProfile?.ifscCode || '');
  
  const [reason, setReason] = useState('');
  const [amountNeeded, setAmountNeeded] = useState('5000');
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  // Return assistance states
  const [approvedRequests, setApprovedRequests] = useState<MadadRequest[]>([]);
  const [selectedRequestId, setSelectedRequestId] = useState('');
  const [returnAmount, setReturnAmount] = useState('2000');
  const [returnLoading, setReturnLoading] = useState(false);
  const [returnSuccess, setReturnSuccess] = useState(false);

  useEffect(() => {
    loadMyPastApprovedRequests();
  }, [props.masjidId]);

  const loadMyPastApprovedRequests = async () => {
    const list = await MasjidService.getMadadRequests(props.masjidId);
    // Find requests that are approved
    const approved = list.filter(r => r.status === 'approved');
    setApprovedRequests(approved);
    if (approved.length > 0) {
      setSelectedRequestId(approved[0].id);
    }
  };

  const handleApplyHelp = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    setSuccessMsg('');

    if (!fullName.trim() || !fatherName.trim() || !aadhar.trim() || !bankName.trim() || !accNum.trim() || !ifsc.trim() || !reason.trim()) {
      setErrorMsg('All marked fields (*) are mandatory.');
      return;
    }

    if (Number(amountNeeded) <= 0) {
      setErrorMsg('Please request an authentic amount greater than 0.');
      return;
    }

    setIsSubmitting(true);

    const payload = {
      name: fullName.trim(),
      fatherName: fatherName.trim(),
      aadhar: aadhar.trim(),
      bankAccount: accNum.trim(),
      ifsc: ifsc.trim().toUpperCase(),
      reason: reason.trim(),
      amountNeeded: Number(amountNeeded),
      masjidId: props.masjidId
    };

    await MasjidService.submitMadadRequest(payload);

    setIsSubmitting(false);
    setSuccessMsg(t.madadSuccess);
    // Clear reason
    setReason('');
    
    setTimeout(() => setSuccessMsg(''), 4000);
  };

  const handleReturnHelp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedRequestId || Number(returnAmount) <= 0) return;

    setReturnLoading(true);
    const success = await MasjidService.returnMadadRequestAmount(selectedRequestId, Number(returnAmount));
    if (success) {
      setReturnSuccess(true);
      await loadMyPastApprovedRequests();
      setTimeout(() => setReturnSuccess(false), 3000);
    }
    setReturnLoading(false);
  };

  return (
    <div className="w-full max-w-md mx-auto p-4 pb-20">
      
      {/* Tab Switcher */}
      <div className="flex bg-white rounded-3xl p-1 mb-6 border border-gray-100 card-shadow">
        <button
          onClick={() => { setActiveTab('request'); setErrorMsg(''); setSuccessMsg(''); }}
          className={`flex-1 py-3 text-center text-xs font-bold rounded-2xl transition-all duration-300 flex items-center justify-center gap-1.5 ${
            activeTab === 'request'
              ? 'bg-emerald-800 text-white shadow-sm'
              : 'text-slate-500 hover:text-slate-800'
          }`}
        >
          <HelpCircle className="w-4 h-4 text-emerald-700" />
          {t.madadTitle}
        </button>
        <button
          onClick={() => { setActiveTab('return'); setErrorMsg(''); setSuccessMsg(''); }}
          className={`flex-1 py-3 text-center text-xs font-bold rounded-2xl transition-all duration-300 flex items-center justify-center gap-1.5 ${
            activeTab === 'return'
              ? 'bg-emerald-800 text-white shadow-sm'
              : 'text-slate-500 hover:text-slate-800'
          }`}
        >
          <RotateCcw className="w-4 h-4 text-emerald-700" />
          {t.returnTitle}
        </button>
      </div>

      {/* 1. APPLY HELP FORM MODULE */}
      {activeTab === 'request' && (
        <div className="bg-white rounded-3xl card-shadow border border-gray-100 p-6">
          <div className="border-b border-slate-100 pb-3 mb-4">
            <h3 className="text-sm font-bold text-slate-800 flex items-center gap-2">
              <FileText className="w-5 h-5 text-emerald-700 font-bold" />
              <span>Baitul-Maal Welfare Form</span>
            </h3>
            <p className="text-[11px] text-slate-500 mt-1 italic leading-relaxed">
              {t.madadDesc}
            </p>
          </div>

          {/* Success / Error Alerts */}
          {successMsg && (
            <div id="madad-submit-success-badge" className="bg-emerald-50 text-emerald-800 border border-emerald-200 rounded-2xl p-4 text-xs font-bold mb-4 flex items-start gap-2 animate-bounce">
              <Sparkles className="w-4 h-4 text-emerald-600 mt-0.5 shrink-0" />
              <span>{successMsg}</span>
            </div>
          )}

          {errorMsg && (
            <div id="madad-submit-error-badge" className="bg-red-50 text-red-700 border border-red-155 rounded-2xl p-4 text-xs font-semibold mb-4 flex items-start gap-2">
              <AlertCircle className="w-4 h-4 text-red-500 mt-0.5 shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          <form onSubmit={handleApplyHelp} className="flex flex-col gap-4 text-left">
            <div className="grid grid-cols-2 gap-2.5">
              {/* Applicant Name */}
              <div className="flex flex-col gap-1.5">
                <label className="text-[10px] font-bold text-slate-700">{t.nameLabel} *</label>
                <input
                  id="inp-madad-name"
                  type="text"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2 text-xs text-slate-800 font-semibold focus:ring-1 focus:ring-emerald-700"
                  required
                />
              </div>

              {/* Father Name */}
              <div className="flex flex-col gap-1.5">
                <label className="text-[10px] font-bold text-slate-700">{t.fatherNameLabel} *</label>
                <input
                  id="inp-madad-father"
                  type="text"
                  value={fatherName}
                  onChange={(e) => setFatherName(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2 text-xs text-slate-800 font-semibold focus:ring-1 focus:ring-emerald-700"
                  required
                />
              </div>
            </div>

            {/* Aadhar number */}
            <div className="flex flex-col gap-1.5">
              <label className="text-[10px] font-bold text-slate-700">{t.aadharLabel} *</label>
              <input
                id="inp-madad-aadhar"
                type="text"
                value={aadhar}
                onChange={(e) => setAadhar(e.target.value)}
                placeholder="12 digit uid card number"
                className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs text-slate-800 font-mono tracking-wider focus:ring-1 focus:ring-emerald-700"
                required
              />
            </div>

            {/* Bank Card information */}
            <div className="p-3 bg-slate-50 rounded-2xl border border-slate-200/50 flex flex-col gap-2">
              <span className="text-[10px] font-bold text-emerald-950 uppercase tracking-widest block border-b border-slate-200/60 pb-1">
                Emergency Bank details (बैंक खाता विवरण)
              </span>
              
              <div className="flex flex-col gap-1">
                <label className="text-[9px] font-bold text-slate-505">{t.bankNameLabel} *</label>
                <input
                  id="inp-madad-bank"
                  type="text"
                  value={bankName}
                  onChange={(e) => setBankName(e.target.value)}
                  className="w-full bg-white border border-slate-200 rounded-xl p-2 text-xs focus:ring-1 focus:ring-emerald-700"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div className="flex flex-col gap-1">
                  <label className="text-[9px] font-bold text-slate-505">{t.accountNumberLabel} *</label>
                  <input
                    id="inp-madad-acc"
                    type="text"
                    value={accNum}
                    onChange={(e) => setAccNum(e.target.value)}
                    className="w-full bg-white border border-slate-200 rounded-xl p-2 text-xs font-mono focus:ring-1 focus:ring-emerald-700"
                    required
                  />
                </div>
                <div className="flex flex-col gap-1">
                  <label className="text-[9px] font-bold text-slate-505">{t.ifscCodeLabel} *</label>
                  <input
                    id="inp-madad-ifsc"
                    type="text"
                    value={ifsc}
                    onChange={(e) => setIfsc(e.target.value)}
                    className="w-full bg-white border border-slate-200 rounded-xl p-2 text-xs font-mono uppercase focus:ring-1 focus:ring-emerald-700"
                    required
                  />
                </div>
              </div>
            </div>

            {/* Funding request details */}
            <div className="grid grid-cols-3 gap-2">
              <div className="col-span-2 flex flex-col gap-1.5">
                <label className="text-[10px] font-bold text-slate-700">{t.reasonLabel} *</label>
                <input
                  id="inp-madad-reason"
                  type="text"
                  value={reason}
                  onChange={(e) => setReason(e.target.value)}
                  placeholder="e.g. Daughter marriage grocery, heart medicine..."
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-xs focus:ring-1 focus:ring-emerald-700 font-semibold text-slate-700"
                  required
                />
              </div>

              <div className="col-span-1 flex flex-col gap-1.5">
                <label className="text-[10px] font-bold text-slate-700">Amount (₹) *</label>
                <input
                  id="inp-madad-amt"
                  type="number"
                  min="1"
                  value={amountNeeded}
                  onChange={(e) => setAmountNeeded(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-xs focus:ring-1 focus:ring-emerald-700 font-bold font-mono text-emerald-900"
                  required
                />
              </div>
            </div>

            <div className="flex gap-2 mt-2">
              <button
                id="btn-madad-clear"
                type="button"
                onClick={() => {
                  setReason('');
                  setAmountNeeded('');
                }}
                className="px-4 py-3.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-2xl text-xs transition-colors flex items-center justify-center gap-1 border border-slate-200"
                title="Clear inputs"
              >
                <X className="w-3.5 h-3.5 text-slate-500 font-bold" />
                <span>Clear</span>
              </button>

              <button
                id="btn-madad-submit"
                type="submit"
                disabled={isSubmitting}
                className="flex-1 bg-emerald-800 hover:bg-emerald-950 text-white font-extrabold py-3.5 rounded-2xl text-xs transition-colors shadow-md tracking-widest uppercase flex items-center justify-center gap-1"
              >
                <span>{isSubmitting ? "Submitting Request..." : t.submitMadad}</span>
              </button>
            </div>
          </form>
        </div>
      )}

      {/* 2. RETURN MONEY MODULE */}
      {activeTab === 'return' && (
        <div className="bg-white rounded-3xl card-shadow border border-gray-100 p-6 text-left">
          <div className="border-b border-slate-100 pb-3 mb-4">
            <h3 className="text-sm font-bold text-slate-800 flex items-center gap-2">
              <RefreshCcw className="w-5 h-5 text-emerald-700" />
              <span>{t.returnTitle}</span>
            </h3>
            <p className="text-[11px] text-slate-500 mt-1 italic leading-relaxed">
              {t.returnDesc}
            </p>
          </div>

          {returnSuccess && (
            <div id="madad-return-success-badge" className="bg-emerald-50 text-emerald-800 border border-emerald-200 rounded-2xl p-4 text-xs font-bold mb-4 flex items-center gap-2 animate-bounce">
              <Sparkles className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>{t.returnSuccess}</span>
            </div>
          )}

          {approvedRequests.length > 0 ? (
            <form onSubmit={handleReturnHelp} className="flex flex-col gap-4">
              <div className="flex flex-col gap-1">
                <label className="text-[10px] font-bold text-slate-400 font-mono tracking-wider uppercase block">
                  Select Active Received Fund Record
                </label>
                <select
                  id="select-return-request"
                  value={selectedRequestId}
                  onChange={(e) => setSelectedRequestId(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl py-3 px-3 text-xs focus:ring-2 focus:ring-emerald-700 font-semibold text-slate-700 mt-1.5"
                >
                  {approvedRequests.map((req) => (
                    <option key={req.id} value={req.id}>
                      {req.name} - ₹{req.amountNeeded} (Returned: ₹{req.returnedAmount || 0})
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex flex-col gap-1.5 bg-slate-50 border border-slate-200/50 p-4 rounded-2xl">
                <label className="text-xs font-bold text-slate-700 flex items-center justify-between">
                  <span>{t.returnAmount}</span>
                  <span className="text-[9px] text-slate-400 font-normal italic">Direct bank return proxy</span>
                </label>
                <div className="grid grid-cols-3 gap-2 mt-2">
                  {['1000', '2000', '5000'].map((preset) => (
                    <button
                      key={preset}
                      type="button"
                      onClick={() => setReturnAmount(preset)}
                      className={`py-2 rounded-xl text-xs font-bold ${returnAmount === preset ? 'bg-emerald-800 text-white' : 'bg-white border text-slate-600 hover:bg-slate-100'}`}
                    >
                      ₹{preset}
                    </button>
                  ))}
                </div>
                <div className="relative mt-2.5">
                  <span className="absolute left-3 top-2 text-xs font-bold font-mono text-slate-500">₹</span>
                  <input
                    id="inp-return-custom-amount"
                    type="number"
                    value={returnAmount}
                    onChange={(e) => setReturnAmount(e.target.value)}
                    className="w-full bg-white border border-slate-200 rounded-xl py-2 pl-6 pr-3 text-xs focus:ring-2 focus:ring-emerald-700 font-bold font-mono text-slate-800"
                    required
                  />
                </div>
              </div>

              <button
                id="btn-return-submit"
                type="submit"
                disabled={returnLoading}
                className="w-full bg-emerald-800 hover:bg-emerald-950 text-white font-extrabold py-3.5 rounded-2xl text-xs transition-colors shadow-md mt-2 tracking-widest uppercase flex items-center justify-center gap-1.5"
              >
                <span>{returnLoading ? "Sending to saving fund..." : "Confirm Repayment Return"}</span>
              </button>
            </form>
          ) : (
            <div className="my-3 text-center p-5 bg-slate-50 border border-slate-200/50 rounded-2xl">
              <Landmark className="w-8 h-8 text-slate-300 mx-auto mb-2" />
              <p className="text-xs text-slate-500 font-bold">No received relief fund record found for this account.</p>
              <p className="text-[10px] text-slate-400 mt-0.5 max-w-xs mx-auto">Only approved poor residents can utilize the self-return mechanism to reimburse standard reserves.</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
