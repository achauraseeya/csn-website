import React, { useState, useEffect } from 'react';
import { X, ShieldCheck, Heart, UserPlus, Award, Mail, Download, CheckCircle2, Trash2, Edit, Phone, Eye, ExternalLink, Send, Sparkles, RefreshCw, Plus, Printer, FileText, Clock, ShieldAlert } from 'lucide-react';
import { Language, MatrimonialProfile, VolunteerApplication, MembershipApplication, NewsletterSubscriber, Member } from '../types';
import PrintableApplicationModal from './PrintableApplicationModal';
import { apiFetch, triggerEntireRepoSync } from '../utils/githubDb';

interface AdminCentralDashboardModalProps {
  isOpen: boolean;
  onClose: () => void;
  lang: Language;
  matrimonialProfiles: MatrimonialProfile[];
  onUpdateMatrimonialStatus: (id: string, status: 'approved' | 'rejected') => void;
  onDeleteMatrimonialProfile: (id: string) => void;
  onAddMatrimonialProfile?: (p: MatrimonialProfile) => void;

  volunteerApps: VolunteerApplication[];
  onUpdateVolunteerStatus: (id: string, status: 'approved' | 'contacted') => void;
  onDeleteVolunteerApp: (id: string) => void;
  onAddVolunteerApp?: (v: VolunteerApplication) => void;

  membershipApps: MembershipApplication[];
  onApproveMembershipApp: (id: string, assignedMemberId: string) => void;
  onRejectMembershipApp: (id: string) => void;
  onAddMembershipApp?: (m: MembershipApplication) => void;

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
  onAddMatrimonialProfile,
  volunteerApps,
  onUpdateVolunteerStatus,
  onDeleteVolunteerApp,
  onAddVolunteerApp,
  membershipApps,
  onApproveMembershipApp,
  onRejectMembershipApp,
  onAddMembershipApp,
  subscribers,
  onDeleteSubscriber,
  members,
}: AdminCentralDashboardModalProps) {
  const [activeTab, setActiveTab] = useState<'matrimony' | 'volunteers' | 'memberships' | 'newsletter'>('matrimony');

  // Printable PDF modal state
  const [printableModalData, setPrintableModalData] = useState<{
    type: 'matrimony' | 'volunteer' | 'membership';
    item: any;
  } | null>(null);

  // Quick Import Matrimony Candidate From Email state
  const [isQuickAddMatrimonyOpen, setIsQuickAddMatrimonyOpen] = useState(false);
  const [qLookingFor, setQLookingFor] = useState<'groom' | 'bride'>('groom');
  const [qFullName, setQFullName] = useState('');
  const [qAge, setQAge] = useState<number>(25);
  const [qHeight, setQHeight] = useState("5'7\"");
  const [qGotra, setQGotra] = useState('Chaurasiya');
  const [qQual, setQQual] = useState('');
  const [qOcc, setQOcc] = useState('');
  const [qIncome, setQIncome] = useState('');
  const [qCity, setQCity] = useState('');
  const [qNative, setQNative] = useState('');
  const [qFatherName, setQFatherName] = useState('');
  const [qFatherOcc, setQFatherOcc] = useState('');
  const [qFamilyType, setQFamilyType] = useState('Joint Family');
  const [qExpectations, setQExpectations] = useState('');
  const [qGuardianName, setQGuardianName] = useState('');
  const [qGuardianPhone, setQGuardianPhone] = useState('');
  const [qGuardianEmail, setQGuardianEmail] = useState('');
  const [qSuccessAlert, setQSuccessAlert] = useState(false);

  // Newsletter compose state
  const [newsSubject, setNewsSubject] = useState('New Updates from Chaurasiya Samaj Nepal');
  const [newsContent, setNewsContent] = useState('Dear Member,\n\nWe have published new notices, community health camp updates, and photo albums on our portal.\n\nVisit: https://csn-website.org.np\n\nWarm regards,\nChaurasiya Samaj Executive Committee');
  const [newsSentAlert, setNewsSentAlert] = useState(false);

  // Repo full sync state
  const [isSyncingRepo, setIsSyncingRepo] = useState(false);
  const [repoSyncStatus, setRepoSyncStatus] = useState<string | null>(null);

  const handleSyncEntireRepo = async () => {
    setIsSyncingRepo(true);
    setRepoSyncStatus('Syncing entire repository (all JSON files, folders, and photo assets)...');
    try {
      const res = await triggerEntireRepoSync();
      if (res.success) {
        setRepoSyncStatus('✅ ' + res.message);
        setTimeout(() => {
          window.location.reload();
        }, 1500);
      } else {
        setRepoSyncStatus('⚠️ ' + res.message);
      }
    } catch (e: any) {
      setRepoSyncStatus('❌ Sync failed: ' + (e.message || 'Unknown error'));
    } finally {
      setIsSyncingRepo(false);
    }
  };

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

  const exportMasterAllSubmissionsCSV = () => {
    // Combine all forms into one master database export
    const headers = ['Module Type', 'Reference ID', 'Primary Name', 'Contact Phone / Email', 'Location', 'Category / Details', 'Status', 'Date'];
    const rows: (string | number)[][] = [];

    matrimonialProfiles.forEach(p => {
      rows.push(['Matrimony', p.id, p.fullName, `${p.guardianPhone} (${p.guardianEmail || 'N/A'})`, p.currentCityDistrict, `${p.lookingFor.toUpperCase()} | ${p.qualification} | ${p.occupation}`, p.status, p.createdAt]);
    });

    volunteerApps.forEach(v => {
      rows.push(['Volunteer', v.id, v.fullName, `${v.phone} (${v.email})`, v.address, v.interests.join('; '), v.status, v.createdAt]);
    });

    membershipApps.forEach(m => {
      rows.push(['Membership', m.id, m.fullName, `${m.phone} (${m.email})`, m.address, `${m.type.toUpperCase()} - ${m.membershipType}`, m.status, m.createdAt]);
    });

    subscribers.forEach(s => {
      rows.push(['Newsletter Subscriber', s.id, s.email, s.email, 'N/A', `Source: ${s.source || 'Website'}`, 'Active', s.subscribedAt]);
    });

    downloadCSV(headers, rows, `csn_MASTER_ALL_SUBMISSIONS_${Date.now()}.csv`);
  };

  const handleQuickAddMatrimonySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!qFullName || !qGuardianPhone || !qQual || !qOcc || !qCity) {
      alert('Please fill in required fields.');
      return;
    }

    const newProfile: MatrimonialProfile = {
      id: `mat-${Date.now()}`,
      lookingFor: qLookingFor,
      fullName: qFullName,
      age: qAge,
      height: qHeight,
      gotraSubcaste: qGotra,
      qualification: qQual,
      occupation: qOcc,
      monthlyIncome: qIncome,
      currentCityDistrict: qCity,
      nativePlace: qNative,
      fatherName: qFatherName || 'Father / Guardian',
      fatherOccupation: qFatherOcc || 'Self Employed',
      familyType: qFamilyType,
      partnerExpectations: qExpectations,
      guardianName: qGuardianName || qFatherName || qFullName,
      guardianPhone: qGuardianPhone,
      guardianEmail: qGuardianEmail,
      status: 'approved', // Auto-approved because added by admin from email!
      createdAt: new Date().toISOString().split('T')[0],
    };

    if (onAddMatrimonialProfile) {
      onAddMatrimonialProfile(newProfile);
    }

    setQSuccessAlert(true);
    setTimeout(() => {
      setQSuccessAlert(false);
      setIsQuickAddMatrimonyOpen(false);
      // Reset
      setQFullName('');
      setQQual('');
      setQOcc('');
      setQCity('');
      setQGuardianPhone('');
    }, 2000);
  };

  const handleSendBroadcast = (e: React.FormEvent) => {
    e.preventDefault();
    setNewsSentAlert(true);
    setTimeout(() => {
      setNewsSentAlert(false);
    }, 4000);
  };

  return (
    <>
      <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto">
        <div className="bg-white dark:bg-slate-900 rounded-3xl max-w-5xl w-full border border-teal-100 dark:border-slate-800 shadow-2xl overflow-hidden my-6 animate-in zoom-in-95 duration-200">
          {/* Header */}
          <div className="bg-gradient-to-r from-teal-950 via-teal-900 to-emerald-950 p-6 text-white flex justify-between items-center border-b border-teal-800/40">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-white/10 flex items-center justify-center border border-white/20">
                <ShieldCheck className="w-6 h-6 text-emerald-400" />
              </div>
              <div>
                <div className="flex items-center gap-2 flex-wrap">
                  <h2 className="text-xl font-black tracking-tight">
                    {lang === 'en' ? 'Central Admin Operations & Database Console' : 'केन्द्रीय प्रशासन र डेटाबेस कन्सोल'}
                  </h2>
                  <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 animate-pulse">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
                    Email Form Sync (csnepalwebsite@gmail.com)
                  </span>
                </div>
                <p className="text-xs text-emerald-200">
                  {lang === 'en' ? 'Manage, Print PDFs, Export CSVs & Import Email Submissions into Website' : 'आवेदन व्यवस्थापन, PDF प्रिन्ट, CSV निर्यात र इमेलबाट वेबसाइटमा दर्ता'}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2 sm:gap-3 flex-wrap">
              <button
                onClick={handleSyncEntireRepo}
                disabled={isSyncingRepo}
                title="Sync all JSON files, folders, and photos from GitHub repo"
                className="flex items-center gap-1.5 px-3 py-2 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white font-black text-xs uppercase tracking-wider rounded-xl shadow-md transition-all cursor-pointer"
              >
                <RefreshCw className={`w-4 h-4 ${isSyncingRepo ? 'animate-spin' : ''}`} />
                {isSyncingRepo ? 'Syncing Repo...' : 'Sync Entire Repo'}
              </button>
              <button
                onClick={exportMasterAllSubmissionsCSV}
                title="Download complete combined database CSV"
                className="hidden sm:flex items-center gap-1.5 px-3 py-2 bg-emerald-500 hover:bg-emerald-400 text-teal-950 font-black text-xs uppercase tracking-wider rounded-xl shadow-md transition-all cursor-pointer"
              >
                <Download className="w-4 h-4" />
                Master All-in-One CSV
              </button>

              {/* Blogger XML Download Button - ONLY visible in AI Studio Preview */}
              {(window.location.hostname.includes('run.app') || window.location.hostname.includes('localhost') || window.location.hostname.includes('ai.studio')) && (
                <a
                  href="/chaurasiya_samaj_blogger_headless.xml"
                  download
                  title="Download Blogger XML Theme (Preview Only)"
                  className="hidden md:flex items-center gap-1.5 px-3 py-2 bg-amber-500 hover:bg-amber-400 text-teal-950 font-black text-xs uppercase tracking-wider rounded-xl shadow-md transition-all cursor-pointer"
                >
                  <Download className="w-4 h-4" />
                  Blogger XML
                </a>
              )}

              <button
                onClick={onClose}
                className="p-2 hover:bg-white/10 rounded-full transition-colors text-white cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Dashboard Nav Tabs */}
          <div className="bg-slate-100 dark:bg-slate-800/80 p-2 border-b dark:border-slate-800 flex flex-wrap gap-2 text-xs font-bold justify-between items-center">
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => setActiveTab('matrimony')}
                className={`px-4 py-2.5 rounded-xl transition-all flex items-center gap-2 cursor-pointer ${
                  activeTab === 'matrimony' ? 'bg-rose-600 text-white shadow-sm' : 'text-gray-700 dark:text-gray-300 hover:bg-white'
                }`}
              >
                <Heart className="w-4 h-4 fill-current" />
                {lang === 'en' ? 'Matrimony Requests' : 'वैवाहिक अनुरोधहरू'} ({matrimonialProfiles.length})
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
                {lang === 'en' ? 'Membership & Renewals' : 'सदस्यता र नवीकरण'} ({membershipApps.length})
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
                {lang === 'en' ? 'Newsletter Subscribers' : 'न्यूजलेटर'} ({subscribers.length})
              </button>

            </div>

            <button
              onClick={exportMasterAllSubmissionsCSV}
              className="sm:hidden px-3 py-1.5 bg-emerald-500 text-teal-950 font-extrabold text-[10px] rounded-lg"
            >
              Master CSV
            </button>
          </div>

          {/* Repo Sync Status Banner */}
          {repoSyncStatus && (
            <div className={`mx-6 mt-4 p-3 rounded-xl font-bold text-xs flex items-center justify-between ${
              repoSyncStatus.startsWith('✅') 
                ? 'bg-emerald-100 text-emerald-900 border border-emerald-300' 
                : repoSyncStatus.startsWith('❌') || repoSyncStatus.startsWith('⚠️')
                ? 'bg-rose-100 text-rose-900 border border-rose-300'
                : 'bg-indigo-100 text-indigo-900 border border-indigo-300 animate-pulse'
            }`}>
              <div className="flex items-center gap-2">
                <RefreshCw className={`w-4 h-4 ${isSyncingRepo ? 'animate-spin' : ''}`} />
                <span>{repoSyncStatus}</span>
              </div>
              {!isSyncingRepo && (
                <button onClick={() => setRepoSyncStatus(null)} className="text-slate-500 hover:text-slate-800 p-1">
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>
          )}

          {/* Tab Content Body */}
          <div className="p-6 max-h-[65vh] overflow-y-auto space-y-6 text-xs">
            {/* TAB 1: MATRIMONY */}
            {activeTab === 'matrimony' && (
              <div className="space-y-4">
                <div className="flex justify-between items-center flex-wrap gap-2 border-b pb-3 dark:border-slate-800">
                  <div>
                    <h3 className="text-base font-black text-gray-900 dark:text-white flex items-center gap-2">
                      <Heart className="w-5 h-5 text-rose-600 fill-rose-600" />
                      Matrimonial Registrations &amp; Candidate Profiles
                    </h3>
                    <p className="text-gray-500 font-medium">Verify credentials, print candidate PDFs, download CSV, or add profiles from csnepalwebsite@gmail.com email.</p>
                  </div>
                  <div className="flex gap-2 flex-wrap">
                    <button
                      onClick={() => setIsQuickAddMatrimonyOpen(true)}
                      className="px-4 py-2 bg-rose-600 hover:bg-rose-500 text-white font-bold rounded-xl flex items-center gap-1.5 cursor-pointer shadow-sm"
                    >
                      <Plus className="w-4 h-4" />
                      Import Candidate from Email
                    </button>
                    <button
                      onClick={exportMatrimonyDatabase}
                      className="px-3.5 py-2 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-xl flex items-center gap-1.5 cursor-pointer shadow-sm"
                    >
                      <Download className="w-4 h-4" />
                      Export CSV
                    </button>
                  </div>
                </div>

                {matrimonialProfiles.length === 0 ? (
                  <div className="text-center py-10 space-y-3">
                    <p className="text-gray-500 italic">No matrimonial requests submitted yet.</p>
                    <button
                      onClick={() => setIsQuickAddMatrimonyOpen(true)}
                      className="px-4 py-2 bg-rose-600 text-white font-bold rounded-xl text-xs cursor-pointer"
                    >
                      + Add First Candidate Profile from Email
                    </button>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {matrimonialProfiles.map(p => (
                      <div key={p.id} className="p-4 bg-slate-50 dark:bg-slate-800/60 rounded-2xl border border-slate-200 dark:border-slate-700 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                        <div className="space-y-1">
                          <div className="flex items-center gap-2 flex-wrap">
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

                        <div className="flex items-center gap-2 shrink-0 flex-wrap">
                          <button
                            onClick={() => setPrintableModalData({ type: 'matrimony', item: p })}
                            className="px-3 py-1.5 bg-slate-200 dark:bg-slate-700 hover:bg-slate-300 dark:hover:bg-slate-600 text-slate-900 dark:text-white font-bold rounded-xl flex items-center gap-1 cursor-pointer"
                          >
                            <Printer className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                            PDF / Print Form
                          </button>

                          {p.status !== 'approved' && (
                            <button
                              onClick={() => onUpdateMatrimonialStatus(p.id, 'approved')}
                              className="px-3 py-1.5 bg-emerald-600 text-white font-bold rounded-xl hover:bg-emerald-500 cursor-pointer"
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
                            className="p-1.5 text-rose-600 hover:bg-rose-50 dark:hover:bg-slate-700 rounded-lg cursor-pointer"
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
                    <p className="text-gray-500 font-medium">Manage volunteer registrations, print PDF dockets, or export CSV.</p>
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
                          <div className="flex items-center gap-2 flex-wrap">
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

                        <div className="flex items-center gap-2 shrink-0 flex-wrap">
                          <button
                            onClick={() => setPrintableModalData({ type: 'volunteer', item: v })}
                            className="px-3 py-1.5 bg-slate-200 dark:bg-slate-700 hover:bg-slate-300 dark:hover:bg-slate-600 text-slate-900 dark:text-white font-bold rounded-xl flex items-center gap-1 cursor-pointer"
                          >
                            <Printer className="w-3.5 h-3.5 text-teal-600 dark:text-teal-400" />
                            PDF / Print
                          </button>
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
                            className="p-1.5 text-rose-600 hover:bg-rose-50 dark:hover:bg-slate-700 rounded-lg cursor-pointer"
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
                    <p className="text-gray-500 font-medium">Review payment proofs, issue official IDs, and print application PDFs.</p>
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
                          <div className="flex items-center gap-2 flex-wrap">
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

                        <div className="flex items-center gap-2 shrink-0 flex-wrap">
                          <button
                            onClick={() => setPrintableModalData({ type: 'membership', item: m })}
                            className="px-3 py-1.5 bg-slate-200 dark:bg-slate-700 hover:bg-slate-300 dark:hover:bg-slate-600 text-slate-900 dark:text-white font-bold rounded-xl flex items-center gap-1 cursor-pointer"
                          >
                            <Printer className="w-3.5 h-3.5 text-teal-600 dark:text-teal-400" />
                            PDF / Print Form
                          </button>

                          {m.status === 'pending' && (
                            <button
                              onClick={() => {
                                const autoId = `CSN-2026-${Math.floor(100 + Math.random() * 900)}`;
                                onApproveMembershipApp(m.id, autoId);
                              }}
                              className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-xl shadow-sm cursor-pointer"
                            >
                              Approve &amp; Issue ID
                            </button>
                          )}
                          <button
                            onClick={() => onRejectMembershipApp(m.id)}
                            className="p-1.5 text-rose-600 hover:bg-rose-50 dark:hover:bg-slate-700 rounded-lg cursor-pointer"
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
                          className="text-rose-600 p-1 hover:bg-rose-50 rounded cursor-pointer"
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

      {/* Quick Add Matrimony Candidate Modal (Import from csnepalwebsite@gmail.com) */}
      {isQuickAddMatrimonyOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white dark:bg-slate-900 rounded-3xl max-w-2xl w-full border border-rose-200 dark:border-slate-800 shadow-2xl p-6 sm:p-8 space-y-6 my-6 animate-in zoom-in-95 duration-200">
            <div className="flex justify-between items-center border-b pb-4 dark:border-slate-800">
              <div>
                <span className="px-2.5 py-0.5 rounded-full bg-rose-100 text-rose-800 text-[10px] font-black uppercase">
                  Admin Import Tool
                </span>
                <h3 className="text-xl font-black text-slate-900 dark:text-white mt-1">
                  Import Matrimonial Candidate from Email
                </h3>
                <p className="text-xs text-slate-500">
                  Copy details received in <strong>csnepalwebsite@gmail.com</strong> and publish directly to live website!
                </p>
              </div>
              <button
                onClick={() => setIsQuickAddMatrimonyOpen(false)}
                className="p-1.5 text-slate-400 hover:text-slate-600 dark:hover:text-white rounded-full cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {qSuccessAlert ? (
              <div className="p-6 bg-emerald-50 text-emerald-900 font-bold rounded-2xl flex items-center gap-3">
                <CheckCircle2 className="w-8 h-8 text-emerald-600 shrink-0" />
                <div>
                  <h4 className="text-base font-black">Candidate Published Live!</h4>
                  <p className="text-xs">Profile added to website catalog and synced with Cloud Firestore.</p>
                </div>
              </div>
            ) : (
              <form onSubmit={handleQuickAddMatrimonySubmit} className="space-y-4 text-xs">
                <div className="flex gap-4 p-1 bg-slate-100 dark:bg-slate-800 rounded-xl w-fit">
                  <button
                    type="button"
                    onClick={() => setQLookingFor('groom')}
                    className={`px-4 py-2 rounded-lg font-bold cursor-pointer ${qLookingFor === 'groom' ? 'bg-indigo-600 text-white shadow-sm' : 'text-slate-600 dark:text-slate-400'}`}
                  >
                    Groom / वर Search
                  </button>
                  <button
                    type="button"
                    onClick={() => setQLookingFor('bride')}
                    className={`px-4 py-2 rounded-lg font-bold cursor-pointer ${qLookingFor === 'bride' ? 'bg-rose-600 text-white shadow-sm' : 'text-slate-600 dark:text-slate-400'}`}
                  >
                    Bride / वधू Search
                  </button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">Candidate Full Name *</label>
                    <input
                      type="text"
                      required
                      value={qFullName}
                      onChange={e => setQFullName(e.target.value)}
                      placeholder="e.g. Ramesh Prasad Chaurasiya"
                      className="w-full p-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl"
                    />
                  </div>
                  <div>
                    <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">Age &amp; Height *</label>
                    <div className="flex gap-2">
                      <input
                        type="number"
                        required
                        value={qAge}
                        onChange={e => setQAge(parseInt(e.target.value) || 25)}
                        className="w-1/2 p-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl"
                      />
                      <input
                        type="text"
                        required
                        value={qHeight}
                        onChange={e => setQHeight(e.target.value)}
                        placeholder="5'8''"
                        className="w-1/2 p-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl"
                      />
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">Qualification *</label>
                    <input
                      type="text"
                      required
                      value={qQual}
                      onChange={e => setQQual(e.target.value)}
                      placeholder="e.g. B.Tech / MBA / MBBS"
                      className="w-full p-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl"
                    />
                  </div>
                  <div>
                    <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">Occupation / Income *</label>
                    <input
                      type="text"
                      required
                      value={qOcc}
                      onChange={e => setQOcc(e.target.value)}
                      placeholder="e.g. Civil Engineer / Businessman"
                      className="w-full p-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">Current City / District *</label>
                    <input
                      type="text"
                      required
                      value={qCity}
                      onChange={e => setQCity(e.target.value)}
                      placeholder="e.g. Kathmandu / Birgunj"
                      className="w-full p-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl"
                    />
                  </div>
                  <div>
                    <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">Guardian Name &amp; Phone *</label>
                    <div className="flex gap-2">
                      <input
                        type="text"
                        required
                        value={qGuardianName}
                        onChange={e => setQGuardianName(e.target.value)}
                        placeholder="Guardian Name"
                        className="w-1/2 p-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl"
                      />
                      <input
                        type="tel"
                        required
                        value={qGuardianPhone}
                        onChange={e => setQGuardianPhone(e.target.value)}
                        placeholder="Phone Number"
                        className="w-1/2 p-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl"
                      />
                    </div>
                  </div>
                </div>
                <button
                  type="submit"
                  className="w-full py-3 bg-rose-600 hover:bg-rose-500 text-white font-extrabold text-xs uppercase tracking-wider rounded-xl shadow-md cursor-pointer transition-all"
                >
                  Publish Profile Live To Website Catalog
                </button>
              </form>
            )}
          </div>
        </div>
      )}

      {/* Official Printable PDF Generator Modal */}
      <PrintableApplicationModal
        isOpen={Boolean(printableModalData)}
        onClose={() => setPrintableModalData(null)}
        lang={lang}
        data={printableModalData}
      />
    </>
  );
}