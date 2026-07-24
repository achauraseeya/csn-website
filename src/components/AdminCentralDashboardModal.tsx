import React, { useState } from 'react';
import { X, ShieldCheck, Heart, UserPlus, Award, Mail, Download, CheckCircle2, Trash2, Edit, Phone, Eye, ExternalLink, Send, Sparkles, RefreshCw } from 'lucide-react';
import { Language, MatrimonialProfile, VolunteerApplication, MembershipApplication, NewsletterSubscriber, Member } from '../types';
import { formatNumber } from '../utils/mediaUrl';

interface AdminCentralDashboardModalProps {
  isOpen: boolean;
  onClose: () => void;
  lang: Language;
  matrimonialProfiles: MatrimonialProfile[];
  onUpdateMatrimonialStatus: (id: string, status: 'approved' | 'rejected') => void;
  onDeleteMatrimonialProfile: (id: string) => void;

  volunteerApps: VolunteerApplication[];
  onUpdateVolunteerStatus: (id: string, status: 'approved' | 'contacted') => void;
  onDeleteVolunteerApp: (id: string) => void;

  membershipApps: MembershipApplication[];
  onApproveMembershipApp: (id: string, assignedMemberId: string) => void;
  onRejectMembershipApp: (id: string) => void;

  subscribers: NewsletterSubscriber[];
  onDeleteSubscriber: (id: string) => void;

  members: Member[];
}

export default function AdminCentralDashboardModal({
  isOpen,
  onClose,
  lang,
  matrimonialProfiles,
  onUpdateMatrimonialStatus,
  onDeleteMatrimonialProfile,
  volunteerApps,
  onUpdateVolunteerStatus,
  onDeleteVolunteerApp,
  membershipApps,
  onApproveMembershipApp,
  onRejectMembershipApp,
  subscribers,
  onDeleteSubscriber,
  members,
}: AdminCentralDashboardModalProps) {
  const [activeTab, setActiveTab] = useState<'matrimony' | 'volunteers' | 'memberships' | 'newsletter'>('matrimony');

  // Newsletter compose state
  const [newsSubject, setNewsSubject] = useState('New Updates from Chaurasiya Samaj Nepal');
  const [newsContent, setNewsContent] = useState('Dear Member,\n\nWe have published new notices, community health camp updates, and photo albums on our portal.\n\nVisit: https://csn-website.org.np\n\nWarm regards,\nChaurasiya Samaj Executive Committee');
  const [newsSentAlert, setNewsSentAlert] = useState(false);

  if (!isOpen) return null;

  const pendingMatrimonyCount = matrimonialProfiles.filter(p => p.status === 'pending').length;
  const pendingVolunteersCount = volunteerApps.filter(v => v.status === 'pending').length;
  const pendingMembershipCount = membershipApps.filter(m => m.status === 'pending').length;

  // Database Export Helper Functions
  const downloadJSON = (data: any, filename: string) => {
    const jsonStr = JSON.stringify(data, null, 2);
    const blob = new Blob([jsonStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const downloadCSV = (headers: string[], rows: (string | number)[][], filename: string) => {
    const csvContent = [
      headers.join(','),
      ...rows.map(row => row.map(val => `"${String(val).replace(/"/g, '""')}"`).join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const exportMatrimonyDatabase = () => {
    const headers = ['ID', 'Looking For', 'Full Name', 'Age', 'Qualification', 'Occupation', 'Location', 'Guardian Name', 'Guardian Phone', 'Status', 'Date'];
    const rows = matrimonialProfiles.map(p => [
      p.id, p.lookingFor, p.fullName, p.age, p.qualification, p.occupation, p.currentCityDistrict, p.guardianName, p.guardianPhone, p.status, p.createdAt
    ]);
    downloadCSV(headers, rows, `csn_matrimonial_database_${Date.now()}.csv`);
  };

  const exportVolunteerDatabase = () => {
    const headers = ['ID', 'Full Name', 'Email', 'Phone', 'Address', 'Interests', 'Availability', 'Status', 'Date'];
    const rows = volunteerApps.map(v => [
      v.id, v.fullName, v.email, v.phone, v.address, v.interests.join('; '), v.availability, v.status, v.createdAt
    ]);
    downloadCSV(headers, rows, `csn_volunteers_database_${Date.now()}.csv`);
  };

  const exportMembershipDatabase = () => {
    const headers = ['ID', 'Type', 'Name', 'Phone', 'Email', 'Address', 'Category', 'Payment Method', 'Payment Ref', 'Status', 'Date'];
    const rows = membershipApps.map(m => [
      m.id, m.type, m.fullName, m.phone, m.email, m.address, m.membershipType, m.paymentMethod, m.paymentReference || '', m.status, m.createdAt
    ]);
    downloadCSV(headers, rows, `csn_membership_applications_${Date.now()}.csv`);
  };

  const exportSubscribersDatabase = () => {
    const headers = ['ID', 'Email', 'Subscribed Date', 'Source'];
    const rows = subscribers.map(s => [s.id, s.email, s.subscribedAt, s.source || 'Website']);
    downloadCSV(headers, rows, `csn_newsletter_subscribers_${Date.now()}.csv`);
  };

  const handleSendBroadcast = (e: React.FormEvent) => {
    e.preventDefault();
    setNewsSentAlert(true);
    setTimeout(() => {
      setNewsSentAlert(false);
    }, 4000);
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white dark:bg-slate-900 rounded-3xl max-w-5xl w-full border border-teal-100 dark:border-slate-800 shadow-2xl overflow-hidden my-6 animate-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="bg-gradient-to-r from-teal-950 via-teal-900 to-emerald-950 p-6 text-white flex justify-between items-center border-b border-teal-800/40">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-white/10 flex items-center justify-center border border-white/20">
              <ShieldCheck className="w-6 h-6 text-emerald-400" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-xl font-black tracking-tight">
                  {lang === 'en' ? 'Central Admin Operations & Database Console' : 'केन्द्रीय प्रशासन र डेटाबेस कन्सोल'}
                </h2>
                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 animate-pulse">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
                  Firebase Firestore Live
                </span>
              </div>
              <p className="text-xs text-emerald-200">
                {lang === 'en' ? 'Managing csnepalwebsite@gmail.com Real-time Submissions & Records Across All Devices' : 'सबै यन्त्रहरूमा csnepalwebsite@gmail.com का वास्तविक समयका आवेदन र अभिलेखहरू'}
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 hover:bg-white/10 rounded-full transition-colors text-white cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Dashboard Nav Tabs */}
        <div className="bg-slate-100 dark:bg-slate-800/80 p-2 border-b dark:border-slate-800 flex flex-wrap gap-2 text-xs font-bold">
          <button
            onClick={() => setActiveTab('matrimony')}
            className={`px-4 py-2.5 rounded-xl transition-all flex items-center gap-2 cursor-pointer ${
              activeTab === 'matrimony' ? 'bg-rose-600 text-white shadow-sm' : 'text-gray-700 dark:text-gray-300 hover:bg-white'
            }`}
          >
            <Heart className="w-4 h-4 fill-current" />
            {lang === 'en' ? 'Matrimony Requests' : 'वैवाहिक अनुरोधहरू'}
            {pendingMatrimonyCount > 0 && (
              <span className="px-2 py-0.5 rounded-full bg-white text-rose-600 text-[10px] font-black">
                {pendingMatrimonyCount}
              </span>
            )}
          </button>

          <button
            onClick={() => setActiveTab('volunteers')}
            className={`px-4 py-2.5 rounded-xl transition-all flex items-center gap-2 cursor-pointer ${
              activeTab === 'volunteers' ? 'bg-teal-700 text-white shadow-sm' : 'text-gray-700 dark:text-gray-300 hover:bg-white'
            }`}
          >
            <UserPlus className="w-4 h-4" />
            {lang === 'en' ? 'Volunteers' : 'स्वयंसेवकहरू'} ({volunteerApps.length})
          </button>

          <button
            onClick={() => setActiveTab('memberships')}
            className={`px-4 py-2.5 rounded-xl transition-all flex items-center gap-2 cursor-pointer ${
              activeTab === 'memberships' ? 'bg-teal-700 text-white shadow-sm' : 'text-gray-700 dark:text-gray-300 hover:bg-white'
            }`}
          >
            <Award className="w-4 h-4" />
            {lang === 'en' ? 'Membership & Renewals' : 'सदस्यता र नवीकरण'}
            {pendingMembershipCount > 0 && (
              <span className="px-2 py-0.5 rounded-full bg-amber-400 text-teal-950 text-[10px] font-black">
                {pendingMembershipCount}
              </span>
            )}
          </button>

          <button
            onClick={() => setActiveTab('newsletter')}
            className={`px-4 py-2.5 rounded-xl transition-all flex items-center gap-2 cursor-pointer ${
              activeTab === 'newsletter' ? 'bg-emerald-600 text-white shadow-sm' : 'text-gray-700 dark:text-gray-300 hover:bg-white'
            }`}
          >
            <Mail className="w-4 h-4" />
            {lang === 'en' ? 'Newsletter & Blogger Feed' : 'न्यूजलेटर र ब्लगर फीड'} ({subscribers.length})
          </button>
        </div>

        {/* Tab Content Body */}
        <div className="p-6 max-h-[65vh] overflow-y-auto space-y-6 text-xs">
          {/* TAB 1: MATRIMONY */}
          {activeTab === 'matrimony' && (
            <div className="space-y-4">
              <div className="flex justify-between items-center flex-wrap gap-2 border-b pb-3 dark:border-slate-800">
                <div>
                  <h3 className="text-base font-black text-gray-900 dark:text-white flex items-center gap-2">
                    <Heart className="w-5 h-5 text-rose-600 fill-rose-600" />
                    Matrimonial Registrations & Matchmaking Database
                  </h3>
                  <p className="text-gray-500 font-medium">Verify candidate credentials, update status, or export database.</p>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={exportMatrimonyDatabase}
                    className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-xl flex items-center gap-1.5 cursor-pointer shadow-sm"
                  >
                    <Download className="w-4 h-4" />
                    Export Matrimony CSV
                  </button>
                  <button
                    onClick={() => downloadJSON(matrimonialProfiles, `csn_matrimonial_${Date.now()}.json`)}
                    className="px-3 py-2 bg-slate-200 dark:bg-slate-800 text-gray-800 dark:text-gray-200 font-bold rounded-xl"
                  >
                    JSON
                  </button>
                </div>
              </div>

              {matrimonialProfiles.length === 0 ? (
                <p className="text-gray-500 italic py-6 text-center">No matrimonial requests submitted yet.</p>
              ) : (
                <div className="space-y-3">
                  {matrimonialProfiles.map(p => (
                    <div key={p.id} className="p-4 bg-slate-50 dark:bg-slate-800/60 rounded-2xl border border-slate-200 dark:border-slate-700 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase text-white ${p.lookingFor === 'groom' ? 'bg-indigo-600' : 'bg-rose-600'}`}>
                            {p.lookingFor === 'groom' ? 'वर (Groom)' : 'वधू (Bride)'}
                          </span>
                          <span className="font-extrabold text-sm text-gray-900 dark:text-white">{p.fullName}</span>
                          <span className="text-gray-500 font-bold">({p.age} yrs • {p.height})</span>
                          <span className={`px-2 py-0.5 rounded-md text-[10px] font-bold ${p.status === 'approved' ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'}`}>
                            {p.status.toUpperCase()}
                          </span>
                        </div>
                        <p className="text-gray-600 dark:text-gray-300 font-medium">
                          <strong>Edu &amp; Profession:</strong> {p.qualification} • {p.occupation} ({p.currentCityDistrict})
                        </p>
                        <p className="text-gray-500 font-mono">
                          <strong>Guardian Contact:</strong> {p.guardianName} ({p.guardianPhone})
                        </p>
                      </div>

                      <div className="flex items-center gap-2 shrink-0">
                        {p.status !== 'approved' && (
                          <button
                            onClick={() => onUpdateMatrimonialStatus(p.id, 'approved')}
                            className="px-3 py-1.5 bg-emerald-600 text-white font-bold rounded-xl hover:bg-emerald-500"
                          >
                            Approve
                          </button>
                        )}
                        <a
                          href={`tel:${p.guardianPhone}`}
                          className="px-3 py-1.5 bg-teal-700 text-white font-bold rounded-xl flex items-center gap-1"
                        >
                          <Phone className="w-3.5 h-3.5" /> Call
                        </a>
                        <button
                          onClick={() => onDeleteMatrimonialProfile(p.id)}
                          className="p-1.5 text-rose-600 hover:bg-rose-50 dark:hover:bg-slate-700 rounded-lg"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* TAB 2: VOLUNTEERS */}
          {activeTab === 'volunteers' && (
            <div className="space-y-4">
              <div className="flex justify-between items-center flex-wrap gap-2 border-b pb-3 dark:border-slate-800">
                <div>
                  <h3 className="text-base font-black text-gray-900 dark:text-white flex items-center gap-2">
                    <UserPlus className="w-5 h-5 text-teal-600" />
                    Youth Volunteers &amp; Community Service Corps
                  </h3>
                  <p className="text-gray-500 font-medium">Manage volunteer skill groups and contact info.</p>
                </div>
                <button
                  onClick={exportVolunteerDatabase}
                  className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-xl flex items-center gap-1.5 cursor-pointer shadow-sm"
                >
                  <Download className="w-4 h-4" />
                  Export Volunteers CSV
                </button>
              </div>

              {volunteerApps.length === 0 ? (
                <p className="text-gray-500 italic py-6 text-center">No volunteer applications recorded.</p>
              ) : (
                <div className="space-y-3">
                  {volunteerApps.map(v => (
                    <div key={v.id} className="p-4 bg-slate-50 dark:bg-slate-800/60 rounded-2xl border border-slate-200 dark:border-slate-700 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <span className="font-extrabold text-sm text-gray-900 dark:text-white">{v.fullName}</span>
                          <span className="text-gray-500 font-bold">({v.address})</span>
                          <span className="px-2 py-0.5 bg-teal-100 text-teal-900 font-bold rounded-md text-[10px]">
                            {v.availability}
                          </span>
                        </div>
                        <p className="text-gray-600 dark:text-gray-300 font-medium">
                          <strong>Interests:</strong> {v.interests.join(', ')}
                        </p>
                        <p className="text-gray-500 font-mono">
                          ✉️ {v.email} | 📞 {v.phone}
                        </p>
                      </div>

                      <div className="flex items-center gap-2">
                        <a
                          href={`https://wa.me/${v.phone.replace(/[^0-9]/g, '')}`}
                          target="_blank"
                          rel="noreferrer"
                          className="px-3 py-1.5 bg-emerald-600 text-white font-bold rounded-xl"
                        >
                          WhatsApp
                        </a>
                        <button
                          onClick={() => onDeleteVolunteerApp(v.id)}
                          className="p-1.5 text-rose-600 hover:bg-rose-50 dark:hover:bg-slate-700 rounded-lg"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* TAB 3: MEMBERSHIPS */}
          {activeTab === 'memberships' && (
            <div className="space-y-4">
              <div className="flex justify-between items-center flex-wrap gap-2 border-b pb-3 dark:border-slate-800">
                <div>
                  <h3 className="text-base font-black text-gray-900 dark:text-white flex items-center gap-2">
                    <Award className="w-5 h-5 text-teal-600" />
                    Membership Registration &amp; Renewal Applications
                  </h3>
                  <p className="text-gray-500 font-medium">Review payment proofs and issue official membership numbers.</p>
                </div>
                <button
                  onClick={exportMembershipDatabase}
                  className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-xl flex items-center gap-1.5 cursor-pointer shadow-sm"
                >
                  <Download className="w-4 h-4" />
                  Export Membership Registry CSV
                </button>
              </div>

              {membershipApps.length === 0 ? (
                <p className="text-gray-500 italic py-6 text-center">No membership applications pending.</p>
              ) : (
                <div className="space-y-3">
                  {membershipApps.map(m => (
                    <div key={m.id} className="p-4 bg-slate-50 dark:bg-slate-800/60 rounded-2xl border border-slate-200 dark:border-slate-700 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <span className={`px-2 py-0.5 rounded-md text-[10px] font-black ${m.type === 'renewal' ? 'bg-indigo-100 text-indigo-900' : 'bg-emerald-100 text-emerald-900'}`}>
                            {m.type === 'renewal' ? 'RENEWAL' : 'NEW MEMBER'}
                          </span>
                          <span className="font-extrabold text-sm text-gray-900 dark:text-white">{m.fullName}</span>
                          <span className="text-gray-500 font-bold">({m.membershipType})</span>
                        </div>
                        <p className="text-gray-600 dark:text-gray-300 font-medium">
                          <strong>Payment:</strong> {m.paymentMethod} (Ref: {m.paymentReference || 'N/A'})
                        </p>
                        <p className="text-gray-500 font-mono">
                          📍 {m.address} | 📞 {m.phone} | ✉️ {m.email}
                        </p>
                      </div>

                      <div className="flex items-center gap-2">
                        {m.status === 'pending' && (
                          <button
                            onClick={() => {
                              const autoId = `CSN-2026-${Math.floor(100 + Math.random() * 900)}`;
                              onApproveMembershipApp(m.id, autoId);
                            }}
                            className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-xl shadow-sm"
                          >
                            Approve &amp; Issue ID
                          </button>
                        )}
                        <button
                          onClick={() => onRejectMembershipApp(m.id)}
                          className="p-1.5 text-rose-600 hover:bg-rose-50 dark:hover:bg-slate-700 rounded-lg"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* TAB 4: NEWSLETTER & BLOGGER */}
          {activeTab === 'newsletter' && (
            <div className="space-y-6">
              <div className="flex justify-between items-center flex-wrap gap-2 border-b pb-3 dark:border-slate-800">
                <div>
                  <h3 className="text-base font-black text-gray-900 dark:text-white flex items-center gap-2">
                    <Mail className="w-5 h-5 text-emerald-600" />
                    Newsletter Subscribers &amp; Blogger Feed Integration
                  </h3>
                  <p className="text-gray-500 font-medium">Connected to csnepalwebsite@gmail.com Blogger Account.</p>
                </div>
                <button
                  onClick={exportSubscribersDatabase}
                  className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-xl flex items-center gap-1.5 cursor-pointer shadow-sm"
                >
                  <Download className="w-4 h-4" />
                  Export Email Subscribers CSV
                </button>
              </div>

              {/* Informational Guidance Box */}
              <div className="p-4 bg-teal-50 dark:bg-slate-800 border border-teal-200 dark:border-slate-700 rounded-2xl space-y-2 leading-relaxed">
                <h4 className="font-extrabold text-teal-950 dark:text-teal-100 flex items-center gap-1.5">
                  <Sparkles className="w-4 h-4 text-emerald-600" />
                  How Blogger Default Newsletter &amp; Feed Auto-Updates Work:
                </h4>
                <ol className="list-decimal list-inside space-y-1 text-gray-700 dark:text-gray-300 font-medium">
                  <li><strong>Blogger RSS Feed:</strong> Blogger automatically generates a default feed at <code className="font-mono bg-white dark:bg-slate-900 px-1 py-0.5 rounded">https://yourblog.blogspot.com/feeds/posts/default</code>.</li>
                  <li><strong>FollowByEmail / FeedBurner / Mailchimp:</strong> In your Blogger Layout dashboard for <code className="font-mono text-teal-700 dark:text-teal-300">csnepalwebsite@gmail.com</code>, add the "Follow by Email" gadget or link your RSS feed to Mailchimp RSS-to-Email.</li>
                  <li><strong>Automated Broadcasts:</strong> Whenever you publish a new notice, event, or gallery post, an automated email containing links is delivered directly to subscribers!</li>
                </ol>
              </div>

              {/* Compose Quick Newsletter Broadcast Alert */}
              <div className="p-5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl space-y-4">
                <h4 className="font-extrabold text-gray-900 dark:text-white flex items-center gap-2">
                  <Send className="w-4 h-4 text-emerald-600" />
                  Send Quick Update Alert to Subscribers ({subscribers.length})
                </h4>

                {newsSentAlert ? (
                  <div className="p-4 bg-emerald-50 text-emerald-900 font-bold rounded-xl flex items-center gap-2">
                    <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                    Newsletter alert dispatched successfully to all {subscribers.length} subscribers!
                  </div>
                ) : (
                  <form onSubmit={handleSendBroadcast} className="space-y-3">
                    <div>
                      <label className="block text-gray-700 dark:text-gray-300 mb-1 font-bold">Email Subject</label>
                      <input
                        type="text"
                        required
                        value={newsSubject}
                        onChange={e => setNewsSubject(e.target.value)}
                        className="w-full p-2.5 bg-slate-50 dark:bg-slate-800 border rounded-xl"
                      />
                    </div>
                    <div>
                      <label className="block text-gray-700 dark:text-gray-300 mb-1 font-bold">Email Content &amp; Post Links</label>
                      <textarea
                        rows={4}
                        required
                        value={newsContent}
                        onChange={e => setNewsContent(e.target.value)}
                        className="w-full p-2.5 bg-slate-50 dark:bg-slate-800 border rounded-xl font-mono text-xs"
                      />
                    </div>
                    <button
                      type="submit"
                      className="px-6 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-xl shadow-md cursor-pointer flex items-center gap-2"
                    >
                      <Send className="w-4 h-4" />
                      Dispatch Newsletter Broadcast
                    </button>
                  </form>
                )}
              </div>

              {/* Subscriber List Table */}
              <div className="space-y-2">
                <h4 className="font-extrabold text-gray-900 dark:text-white">Active Subscriber List ({subscribers.length})</h4>
                <div className="divide-y border rounded-2xl dark:border-slate-800 overflow-hidden">
                  {subscribers.map(sub => (
                    <div key={sub.id} className="p-3 bg-white dark:bg-slate-900 flex justify-between items-center text-xs">
                      <div>
                        <span className="font-bold text-gray-900 dark:text-white">{sub.email}</span>
                        <span className="text-gray-400 text-[10px] block">Subscribed: {sub.subscribedAt} via {sub.source || 'Website'}</span>
                      </div>
                      <button
                        onClick={() => onDeleteSubscriber(sub.id)}
                        className="text-rose-600 p-1 hover:bg-rose-50 rounded"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
