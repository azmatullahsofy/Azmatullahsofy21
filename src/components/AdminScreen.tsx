import React, { useState, useEffect } from 'react';
import { ShieldCheck, TrendingUp, Key, MessageSquare, BookOpen, UserCheck, CreditCard, ShieldAlert, Check, X, FileSpreadsheet, Send, User } from 'lucide-react';
import { Language, UserProfile, Donation, MadadRequest, Hadith, NotificationMsg } from '../types';
import { translations } from '../translations';
import { MasjidService, generateRandomCode } from '../services/MasjidService';

interface AdminScreenProps {
  currentLanguage: Language;
  masjidId: string;
  onPostNotificationCallback: () => void;
}

export default function AdminScreen(props: AdminScreenProps) {
  const t = translations[props.currentLanguage];
  const [activeTab, setActiveTab] = useState<'tools' | 'approvals' | 'members' | 'ledger'>('tools');

  // Dynamic user data bindings
  const [currentUser, setCurrentUser] = useState<UserProfile | null>(() => {
    try {
      const u = localStorage.getItem('digital_masjid_current_user');
      return u ? JSON.parse(u) : null;
    } catch { return null; }
  });
  const [currentMasjid, setCurrentMasjid] = useState<any>(null);

  // Shared state values
  const [memberCode, setMemberCode] = useState('786110');
  const [hadithText, setHadithText] = useState('Sadaqah (Charity) is a shield against the Hellfire.');
  const [hadithRef, setHadithRef] = useState('Al-Bukhari');
  const [announcementTitle, setAnnouncementTitle] = useState('Baitul-Maal assistance distributed');
  const [announcementBody, setAnnouncementBody] = useState('Alhamdulillah, monthly medicines has been purchased and distributed to five widowed houses today.');

  const [members, setMembers] = useState<UserProfile[]>([]);
  const [donations, setDonations] = useState<Donation[]>([]);
  const [madadRequests, setMadadRequests] = useState<MadadRequest[]>([]);

  const [actionSuccess, setActionSuccess] = useState('');

  // Loaded upon render
  useEffect(() => {
    loadAdminData();
  }, [props.masjidId]);

  const loadAdminData = async () => {
    const mems = await MasjidService.getRegisteredMembers(props.masjidId);
    const dons = await MasjidService.getDonations(props.masjidId);
    const mads = await MasjidService.getMadadRequests(props.masjidId);

    setMembers(mems);
    setDonations(dons);
    setMadadRequests(mads);

    // Get active masjid info
    const mList = await MasjidService.getMasjids();
    const found = mList.find(m => m.id === props.masjidId);
    if (found) {
      setCurrentMasjid(found);
    }
  };

  const handleGenerateNewCode = () => {
    const freshCode = generateRandomCode();
    setMemberCode(freshCode);
    // Seed new code to local storage for test driving
    const activeMasjids = JSON.parse(localStorage.getItem('digital_masjid_masjids') || '[]');
    if (activeMasjids.length > 0) {
      activeMasjids[0].code = freshCode;
      localStorage.setItem('digital_masjid_masjids', JSON.stringify(activeMasjids));
    }
    setActionSuccess('New 6-digit Member Invitation Code published successfully!');
    setTimeout(() => setActionSuccess(''), 2500);
  };

  const handlePublishHadith = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!hadithText.trim()) return;

    await MasjidService.postHadith(props.masjidId, hadithText.trim(), hadithRef.trim() || 'Hadith');
    setActionSuccess('Daily Hadith updated successfully!');
    setHadithText('');
    setHadithRef('');
    setTimeout(() => setActionSuccess(''), 2500);
  };

  const handlePublishAnnouncement = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!announcementTitle.trim() || !announcementBody.trim()) return;

    await MasjidService.postNotification(props.masjidId, announcementTitle.trim(), announcementBody.trim());
    setActionSuccess('Urgent Announcement broadcasted to all village members!');
    setAnnouncementTitle('');
    setAnnouncementBody('');
    props.onPostNotificationCallback();
    setTimeout(() => setActionSuccess(''), 2500);
  };

  const handleApproveMadad = async (id: string) => {
    await MasjidService.updateMadadRequestStatus(id, 'approved');
    await loadAdminData();
    setActionSuccess('Emergency Request Approved! Fund transfer logged.');
    setTimeout(() => setActionSuccess(''), 2500);
  };

  const handleRejectMadad = async (id: string) => {
    await MasjidService.updateMadadRequestStatus(id, 'rejected');
    await loadAdminData();
    setActionSuccess('Emergency Request Rejected.');
    setTimeout(() => setActionSuccess(''), 2500);
  };

  // Calculations for ledger
  const totalDonations = donations.reduce((sum, d) => sum + d.amount, 0);
  
  // Calculate total help distributed out (only approved madad requests)
  const totalMadadDistributed = madadRequests
    .filter(r => r.status === 'approved')
    .reduce((sum, r) => sum + r.amountNeeded, 0);

  // Return amount already logged as donation in MasjidService so we don't have to subtract twice
  const ledgerBalance = totalDonations - totalMadadDistributed;

  return (
    <div className="w-full max-w-md mx-auto p-4 pb-20 text-left">
      
      {/* Admin Greeting header */}
      <div className="flex items-center gap-2 mb-4 bg-gradient-to-br from-emerald-800 to-emerald-950 text-white rounded-3xl p-5 card-shadow relative bg-islamic-pattern-dense text-left">
        <ShieldCheck className="w-10 h-10 text-amber-400 shrink-0" />
        <div>
          <h2 className="text-lg font-bold tracking-tight">{t.adminPanelTitle}</h2>
          <span className="text-[10px] text-emerald-200 block tracking-wider font-mono">
            {currentUser?.name || "Imam Maulana Zubair Ahmad"} • {currentMasjid?.name || "Masjid Noor Al-Islam"} Admin
          </span>
        </div>
      </div>

      {actionSuccess && (
        <div id="admin-actions-success-banner" className="bg-emerald-50 text-emerald-800 border-2 border-emerald-100 rounded-2xl p-4 text-xs font-bold mb-4 flex items-center gap-2 animate-pulse">
          <Check className="w-4 h-4 text-emerald-600" />
          <span>{actionSuccess}</span>
        </div>
      )}

      {/* Grid Tabs */}
      <div className="grid grid-cols-4 gap-1 bg-white rounded-2xl p-1 mb-6 border border-gray-100 card-shadow">
        {[
          { key: 'tools', label: 'Tools' },
          { key: 'approvals', label: 'Madad' },
          { key: 'members', label: 'Members' },
          { key: 'ledger', label: 'Ledger' }
        ].map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key as any)}
            className={`py-2 text-center text-[10px] font-extrabold rounded-xl uppercase tracking-wider transition-all duration-300 ${
              activeTab === tab.key
                ? 'bg-emerald-800 text-white shadow-sm'
                : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* 1. ADMINISTRATIVE TOOLS (Codes + Hadith + Announcements) */}
      {activeTab === 'tools' && (
        <div className="flex flex-col gap-5">
          {/* Imam App Help & Assistance Ticket Desk */}
          <div className="bg-[#FFFDF6] rounded-3xl border-2 border-amber-250 p-5 shadow-sm text-left">
            <h3 className="text-xs font-black text-amber-900 uppercase tracking-widest flex items-center gap-1.5 border-b border-amber-200/50 pb-2 mb-3">
              <ShieldAlert className="w-4 h-4 text-amber-600" />
              <span>🚨 REPORT APP ISSUE / शिकायत दर्ज करें</span>
            </h3>
            <p className="text-xs text-slate-700 font-semibold leading-relaxed mb-4">
              इमाम साहब, अगर ऐप्लिकेशन इस्तेमाल करने में कोई भी दिक्कत (Problem/Error) आ रही है, तो कृपया नीचे दिए बटन पर क्लिक कर डेवलपर (Azmatullah) को <strong>स्क्रीनशॉट के साथ (with screenshot)</strong> ईमेल भेजें:
            </p>
            <a
              id="btn-imam-support-email"
              href={`mailto:azmatullahmd113@gmail.com?subject=Digital%20Masjid%20App%20Issue%20-%20Imam%20Sahab&body=Assalamu%20Alaikum%20Brother%20Azmatullah,%250D%250A%250D%250AI%2520am%2520the%2520Imam%2520of%2520${encodeURIComponent(currentMasjid?.name || 'Local')}%2520Masjid,%2520${encodeURIComponent(currentMasjid?.city || 'Selected%2520Location')}.%2520I%2520am%2520facing%2520the%2520following%2520issue%2520with%2520the%252520application:%250D%250A%250D%250A[DESCRIBE%2520YOUR%2520ISSUE%2520HERE]%250D%250A%250D%250APlease%2520find%2520attached%2520the%2520screenshot.`}
              className="w-full bg-amber-500 hover:bg-amber-600 text-slate-950 font-black py-3 rounded-2xl text-xs uppercase tracking-wider transition-all flex items-center justify-center gap-1.5 shadow-sm"
            >
              ✉️ ईमेल भेजें (azmatullahmd113@gmail.com)
            </a>
          </div>
          {/* Code creation card */}
          <div className="bg-white rounded-3xl border border-gray-100 card-shadow p-5">
            <h3 className="text-xs font-extrabold uppercase tracking-widest text-slate-400 mb-3 flex items-center gap-1.5 border-b border-gray-100 pb-2">
              <Key className="w-3.5 h-3.5 text-emerald-700" />
              <span>Invitation member generator</span>
            </h3>
            
            <div className="flex items-center justify-between p-4 bg-emerald-50/50 rounded-2xl border border-emerald-100 mb-3">
              <span className="text-xs text-slate-500 font-semibold font-mono uppercase">INVITATION PIN:</span>
              <span className="text-2xl font-black font-mono tracking-widest text-emerald-950 bg-white border px-4 py-1 rounded-xl shadow-sm">
                {memberCode}
              </span>
            </div>
            
            <button
               id="admin-btn-generate-code"
               onClick={handleGenerateNewCode}
               className="w-full bg-emerald-800 hover:bg-emerald-950 text-white font-extrabold py-3 rounded-xl text-xs uppercase tracking-wider transition-colors shadow-sm"
            >
              {t.genCodeBtn}
            </button>
          </div>

          {/* Urgent Announcements sender */}
          <div className="bg-white rounded-3xl border border-gray-100 card-shadow p-5">
            <h3 className="text-xs font-extrabold uppercase tracking-widest text-slate-400 mb-3 flex items-center gap-1.5 border-b border-slate-100 pb-2">
              <MessageSquare className="w-3.5 h-3.5 text-emerald-700" />
              <span>Broadcast Announcement</span>
            </h3>

            <form onSubmit={handlePublishAnnouncement} className="flex flex-col gap-3">
              <div className="flex flex-col gap-1">
                <label className="text-[10px] text-slate-700 font-bold">Announcement Title *</label>
                <input
                  id="admin-announcement-title"
                  type="text"
                  value={announcementTitle}
                  onChange={(e) => setAnnouncementTitle(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-150 rounded-xl p-2 text-xs focus:ring-1 focus:ring-emerald-700"
                  required
                />
              </div>

              <div className="flex flex-col gap-1">
                <label className="text-[10px] text-slate-700 font-bold">Details / Hindi + Urdu text *</label>
                <textarea
                  id="admin-announcement-body"
                  rows={2}
                  value={announcementBody}
                  onChange={(e) => setAnnouncementBody(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-150 rounded-xl p-2 text-xs focus:ring-1 focus:ring-emerald-700 text-slate-700"
                  required
                />
              </div>

              <button
                id="admin-btn-publish-announcement"
                type="submit"
                className="w-full bg-emerald-805 bg-emerald-900 border border-emerald-700 text-white font-extrabold py-2.5 rounded-xl text-xs uppercase tracking-wider flex items-center justify-center gap-1 transition-all"
              >
                <Send className="w-3.5 h-3.5" />
                <span>{t.sendNotificationBtn}</span>
              </button>
            </form>
          </div>

          {/* Hadith poster */}
          <div className="bg-white rounded-3xl border border-gray-100 card-shadow p-5">
            <h3 className="text-xs font-extrabold uppercase tracking-widest text-slate-400 mb-3 flex items-center gap-1.5 border-b border-gray-100 pb-2">
              <BookOpen className="w-3.5 h-3.5 text-emerald-700" />
              <span>Update Hadith of the day</span>
            </h3>

            <form onSubmit={handlePublishHadith} className="flex flex-col gap-3">
              <div className="flex flex-col gap-1">
                <label className="text-[10px] text-slate-700 font-bold">Hadith text *</label>
                <input
                  id="admin-hadith-text"
                  value={hadithText}
                  onChange={(e) => setHadithText(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-150 rounded-xl p-2 text-xs focus:ring-1 focus:ring-emerald-700 font-medium"
                  required
                />
              </div>

              <div className="flex flex-col gap-1">
                <label className="text-[10px] text-slate-700 font-bold">Reference (हवाला / حواله) *</label>
                <input
                  id="admin-hadith-reference"
                  value={hadithRef}
                  onChange={(e) => setHadithRef(e.target.value)}
                  placeholder="Sahih Bukhari / Muslim"
                  className="w-full bg-slate-50 border border-slate-150 rounded-xl p-2 text-xs focus:ring-1 focus:ring-emerald-700 font-mono"
                  required
                />
              </div>

              <button
                id="admin-btn-publish-hadith"
                type="submit"
                className="w-full bg-emerald-800 text-white font-extrabold py-2.5 rounded-xl text-xs uppercase tracking-wider transition-all"
              >
                {t.postHadithBtn}
              </button>
            </form>
          </div>
        </div>
      )}

      {/* 2. RELEIF COFFEE APPROVALS */}
      {activeTab === 'approvals' && (
        <div className="bg-white rounded-3xl border border-gray-100 card-shadow p-5">
          <h3 className="text-xs font-extrabold uppercase tracking-widest text-slate-400 mb-4 pb-2 border-b border-slate-100 flex items-center gap-1.5">
            <ShieldAlert className="w-4 h-4 text-emerald-700" />
            <span>Verify Welfare (Baitul-Maal) requests</span>
          </h3>

          <div className="flex flex-col gap-4">
            {madadRequests.length > 0 ? (
              madadRequests.map((req) => (
                <div 
                  key={req.id}
                  id={`admin-madad-request-card-${req.id}`}
                  className={`border-2 rounded-2xl p-4 flex flex-col gap-2.5 transition-all duration-300 ${
                    req.status === 'pending'
                      ? 'bg-amber-50/20 border-amber-300/60 shadow-sm'
                      : req.status === 'approved'
                      ? 'bg-emerald-50/20 border-emerald-250 border-emerald-300/40 text-slate-500'
                      : 'bg-slate-50/50 border-slate-200/50 text-slate-400'
                  }`}
                >
                  <div className="flex justify-between items-start border-b border-slate-100 pb-2">
                    <div>
                      <h4 className="font-extrabold text-sm text-emerald-950 font-serif leading-none">{req.name}</h4>
                      <span className="text-[10px] text-slate-400">Father: <strong>{req.fatherName}</strong></span>
                    </div>
                    <span className="text-sm font-bold font-mono text-emerald-900 bg-white border px-2.5 py-0.5 rounded-lg shadow-sm">
                      ₹{req.amountNeeded}
                    </span>
                  </div>

                  <div className="text-xs mt-0.5 bg-white p-2.5 rounded-xl border">
                    <div className="text-[9px] font-bold text-slate-450 uppercase leading-none mb-1">Reason of need / समस्या:</div>
                    <p className="text-slate-700 font-semibold italic">"{req.reason}"</p>
                  </div>

                  {/* Bank Details Display Card */}
                  <div className="bg-slate-50 p-2.5 rounded-xl text-[10px] flex justify-between font-mono">
                    <div>Bank: <strong>{req.bankAccount}</strong></div>
                    <div>IFSC: <strong>{req.ifsc}</strong></div>
                  </div>

                  {/* Status Indicator / Controls */}
                  <div className="flex justify-between items-center mt-1 border-t border-slate-100 pt-2.5">
                    <div className="flex items-center gap-1">
                      <span className="text-[10px] text-slate-400 font-bold uppercase font-mono">Status:</span>
                      <span className={`text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-full font-mono ${
                        req.status === 'pending'
                          ? 'bg-amber-100 text-amber-800'
                          : req.status === 'approved'
                          ? 'bg-emerald-100 text-emerald-800'
                          : 'bg-red-100 text-red-800'
                      }`}>
                        {req.status}
                      </span>
                    </div>

                    {req.status === 'pending' && (
                      <div className="flex items-center gap-1.5 shrink-0">
                        <button
                          id={`admin-btn-approve-madad-${req.id}`}
                          onClick={() => handleApproveMadad(req.id)}
                          className="bg-emerald-800 hover:bg-emerald-950 text-white font-bold py-1.5 px-3 rounded-lg text-[10px] flex items-center gap-1 transition-colors"
                        >
                          <Check className="w-3.5 h-3.5" />
                          <span>Approve & Grant</span>
                        </button>
                        <button
                          id={`admin-btn-reject-madad-${req.id}`}
                          onClick={() => handleRejectMadad(req.id)}
                          className="bg-rose-50 border border-rose-250 text-rose-700 hover:bg-rose-100 font-bold py-1.5 px-3 rounded-lg text-[10px] flex items-center gap-0.5"
                        >
                          <X className="w-3.5 h-3.5" />
                          <span>Reject</span>
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-6 text-slate-400 text-xs font-semibold">
                No poverty funding request logs filed today. Alhamdulillah.
              </div>
            )}
          </div>
        </div>
      )}

      {/* 3. MEMBERS DIRECTORY DIRECT LIST */}
      {activeTab === 'members' && (
        <div className="bg-white rounded-3xl border border-gray-100 card-shadow p-5">
          <h3 className="text-xs font-extrabold uppercase tracking-widest text-slate-400 mb-4 pb-2 border-b border-slate-100 flex items-center gap-1.5">
            <UserCheck className="w-4 h-4 text-emerald-700" />
            <span>{t.membersList}</span>
          </h3>

          <div className="flex flex-col gap-2.5">
            {members.length > 0 ? (
              members.map((member) => (
                <div 
                  key={member.uid}
                  className="flex items-center gap-3.5 p-3 bg-slate-50 rounded-2xl border border-slate-200/40"
                >
                  <div className="w-9 h-9 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center">
                    <User className="w-4 h-4" />
                  </div>
                  <div className="text-left flex-1 min-w-0">
                    <h4 className="text-xs font-bold text-slate-800 truncate leading-none mb-1">{member.name}</h4>
                    <span className="text-[10px] text-slate-400 truncate block font-serif">Father: {member.fatherName || 'Late'}</span>
                    <span className="text-[9px] text-slate-400 truncate block font-mono mt-0.5">UID: {member.aadharCard}</span>
                  </div>
                  <span className="text-[9px] font-bold uppercase py-0.5 px-2 bg-emerald-50 text-emerald-700 border rounded-lg font-mono tracking-widest shrink-0">
                    Verified
                  </span>
                </div>
              ))
            ) : (
              <div className="text-center py-6 text-slate-400 text-xs font-semibold">
                No village members joined matching code yet. Ask your congregation to key in the Invitation.
              </div>
            )}
          </div>
        </div>
      )}

      {/* 4. DAILY HISAAB FINANCE LEDGER */}
      {activeTab === 'ledger' && (
        <div className="bg-white rounded-3xl border border-gray-100 card-shadow p-5">
          <div className="flex justify-between items-center border-b border-slate-100 pb-3 mb-4">
            <h3 className="text-xs font-extrabold uppercase tracking-widest text-slate-400 flex items-center gap-1.5">
              <FileSpreadsheet className="w-4 h-4 text-emerald-700" />
              <span>{t.ledgerTitle}</span>
            </h3>
            <span className="text-[9px] font-mono font-bold uppercase tracking-widest text-amber-600">
              Audit Trails Active
            </span>
          </div>

          {/* Ledger balance counts summary */}
          <div className="grid grid-cols-3 gap-2 mb-6">
            <div className="bg-emerald-50 text-emerald-900 border rounded-xl p-2 text-center">
              <span className="text-[8px] text-emerald-600 block leading-tight font-extrabold uppercase font-mono">{t.ledgerReceipts}</span>
              <div className="text-sm font-black font-mono mt-0.5">₹{totalDonations}</div>
            </div>
            <div className="bg-rose-50 text-rose-900 border rounded-xl p-2 text-center">
              <span className="text-[8px] text-rose-600 block leading-tight font-extrabold uppercase font-mono">{t.ledgerExpenses}</span>
              <div className="text-sm font-black font-mono mt-0.5">₹{totalMadadDistributed}</div>
            </div>
            <div className={`border rounded-xl p-2 text-center ${ledgerBalance >= 0 ? 'bg-amber-50 text-amber-900' : 'bg-red-50 text-red-900'}`}>
              <span className="text-[8px] text-amber-700 block leading-tight font-extrabold uppercase font-mono">{t.ledgerBalance}</span>
              <div className="text-sm font-black font-mono mt-0.5">₹{ledgerBalance}</div>
            </div>
          </div>

          <h4 className="text-[10px] font-bold text-slate-400 font-mono uppercase tracking-widest block mb-2.5">
            Daily Consolidated Transactions History
          </h4>

          <div className="flex flex-col gap-2 max-h-[40vh] overflow-y-auto">
            {donations.length === 0 && madadRequests.length === 0 ? (
              <div className="text-center py-6 text-slate-400 text-xs font-semibold">
                No transactions recorded this month.
              </div>
            ) : (
              [
                ...donations.map(d => ({
                  id: d.id,
                  title: d.donorName,
                  subtitle: `Chanda: ${d.category === 'imam_salary' ? 'Imam' : d.category === 'construction' ? 'Construction' : 'General'}`,
                  amt: d.amount,
                  inc: true,
                  date: d.date
                })),
                ...madadRequests.filter(r => r.status === 'approved').map(r => ({
                  id: r.id,
                  title: r.name,
                  subtitle: `Aid Distributed: ${r.reason}`,
                  amt: r.amountNeeded,
                  inc: false,
                  date: r.timestamp
                }))
              ]
              .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
              .map((txn, index) => (
                <div 
                  key={txn.id + index}
                  className="flex justify-between items-center p-3 bg-slate-50/50 rounded-xl border border-slate-200/30 text-left"
                >
                  <div>
                    <h5 className="text-xs font-bold text-slate-800 leading-tight truncate max-w-[200px]">{txn.title}</h5>
                    <span className="text-[9px] text-slate-400 block truncate max-w-[200px]">{txn.subtitle}</span>
                    <span className="text-[8px] text-slate-400 font-mono block mt-0.5">{new Date(txn.date).toLocaleDateString()}</span>
                  </div>
                  
                  <span className={`text-xs font-bold font-mono ${txn.inc ? 'text-emerald-700' : 'text-rose-700'}`}>
                    {txn.inc ? '+' : '-'} ₹{txn.amt}
                  </span>
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
}
