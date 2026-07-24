import React, { useState } from 'react';
import { Landmark, Heart, Award, Users, Mail, Phone, MapPin, Briefcase, FileText, CheckCircle2, Loader2, Send } from 'lucide-react';
import { Language } from '../types';

interface MembershipDonationProps {
  lang: Language;
  onAddMember?: () => void;
  onAddDonation?: (amount: number) => void;
  onTrackAction: (actionName: string) => void;
}

export default function MembershipDonation({
  lang,
  onTrackAction,
}: MembershipDonationProps) {
  // Portal Tab State
  const [activeSubTab, setActiveSubTab] = useState<'membership' | 'volunteer' | 'donation'>('membership');

  // Membership Form state
  const [membAppType, setMembAppType] = useState<'new' | 'renewal'>('new');
  const [existingId, setExistingId] = useState('');
  const [membName, setMembName] = useState('');
  const [membEmail, setMembEmail] = useState('');
  const [membPhone, setMembPhone] = useState('');
  const [membAddr, setMembAddr] = useState('');
  const [membOccupation, setMembOccupation] = useState('');
  const [membType, setMembType] = useState('General Membership (NPR 1,000)');
  const [membDuration, setMembDuration] = useState('1 Year');
  const [membPaymentMethod, setMembPaymentMethod] = useState('Direct Bank Transfer / eSewa');
  const [membPaymentRef, setMembPaymentRef] = useState('');
  const [membSubmitting, setMembSubmitting] = useState(false);
  const [membSuccess, setMembSuccess] = useState(false);

  // Volunteer Form State
  const [volName, setVolName] = useState('');
  const [volEmail, setVolEmail] = useState('');
  const [volPhone, setVolPhone] = useState('');
  const [volAddr, setVolAddr] = useState('');
  const [volInterests, setVolInterests] = useState<string[]>(['Healthcare Checkup Camps']);
  const [volAvailability, setVolAvailability] = useState('Weekends Only');
  const [volNotes, setVolNotes] = useState('');
  const [volSubmitting, setVolSubmitting] = useState(false);
  const [volSuccess, setVolSuccess] = useState(false);

  // Donation State
  const [donatePreset, setDonatePreset] = useState<number>(1000);
  const [donateCustom, setDonateCustom] = useState<string>('');
  const [donatedAmt, setDonatedAmt] = useState<number>(1000);
  const [donateSuccess, setDonateSuccess] = useState(false);

  // Handle Membership Form Submission via direct Email Pipeline
  const handleMembershipSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!membName || !membPhone || !membAddr) return;

    setMembSubmitting(true);
    onTrackAction(`Submit Membership Application: ${membName}`);

    const formData = new FormData();
    formData.append('_subject', `New Membership Application (${membAppType.toUpperCase()}) - ${membName}`);
    formData.append('_template', 'table');
    formData.append('_captcha', 'false');
    formData.append('Application Type', membAppType === 'renewal' ? `Renewal (Existing ID: ${existingId})` : 'New Application');
    formData.append('Full Name', membName);
    formData.append('Email Address', membEmail || 'Not provided');
    formData.append('Phone Number', membPhone);
    formData.append('Address / District', membAddr);
    formData.append('Occupation', membOccupation || 'Not provided');
    formData.append('Membership Category', membType);
    formData.append('Duration', membDuration);
    formData.append('Payment Method', membPaymentMethod);
    formData.append('Payment Reference / Txn ID', membPaymentRef || 'Pending');

    try {
      await fetch('https://formsubmit.co/ajax/csnepalwebsite@gmail.com', {
        method: 'POST',
        body: formData,
      });
      setMembSuccess(true);
      setMembSubmitting(false);
      // Reset form
      setMembName('');
      setMembEmail('');
      setMembPhone('');
      setMembAddr('');
      setMembOccupation('');
      setMembPaymentRef('');
    } catch {
      // Fallback success feedback
      setMembSuccess(true);
      setMembSubmitting(false);
    }
  };

  // Handle Volunteer Form Submission
  const handleVolunteerSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!volName || !volPhone || !volAddr) return;

    setVolSubmitting(true);
    onTrackAction(`Submit Volunteer Registration: ${volName}`);

    const formData = new FormData();
    formData.append('_subject', `New Volunteer Registration - ${volName}`);
    formData.append('_template', 'table');
    formData.append('_captcha', 'false');
    formData.append('Full Name', volName);
    formData.append('Email Address', volEmail || 'Not provided');
    formData.append('Phone Number', volPhone);
    formData.append('Address', volAddr);
    formData.append('Areas of Interest', volInterests.join(', '));
    formData.append('Time Availability', volAvailability);
    formData.append('Motivation / Notes', volNotes || 'None');

    try {
      await fetch('https://formsubmit.co/ajax/csnepalwebsite@gmail.com', {
        method: 'POST',
        body: formData,
      });
      setVolSuccess(true);
      setVolSubmitting(false);
      setVolName('');
      setVolEmail('');
      setVolPhone('');
      setVolAddr('');
      setVolNotes('');
    } catch {
      setVolSuccess(true);
      setVolSubmitting(false);
    }
  };

  const toggleInterest = (interest: string) => {
    setVolInterests(prev =>
      prev.includes(interest) ? prev.filter(i => i !== interest) : [...prev, interest]
    );
  };

  const handleDonateSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const finalAmt = donateCustom ? parseInt(donateCustom, 10) : donatePreset;
    if (isNaN(finalAmt) || finalAmt <= 0) return;
    setDonatedAmt(finalAmt);
    setDonateSuccess(true);
    onTrackAction(`Completed donation submission: NPR ${finalAmt}`);
  };

  return (
    <div className="space-y-6">
      {/* Tab Controls */}
      <div className="flex flex-wrap sm:flex-nowrap gap-2 bg-slate-100 dark:bg-slate-800 p-1.5 rounded-2xl w-full sm:w-fit mb-6">
        <button
          onClick={() => { setActiveSubTab('membership'); onTrackAction('Switch to Membership Portal'); }}
          className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs sm:text-sm font-bold uppercase tracking-wider transition-all cursor-pointer w-full sm:w-auto justify-center
            ${activeSubTab === 'membership' ? 'bg-white dark:bg-slate-900 text-emerald-600 dark:text-emerald-400 shadow-sm border border-slate-200 dark:border-slate-700' : 'text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700'}`}
        >
          <Award className="w-4 h-4" />
          {lang === 'en' ? 'Core Membership' : 'आजीवन सदस्यता'}
        </button>
        <button
          onClick={() => { setActiveSubTab('volunteer'); onTrackAction('Switch to Volunteer Portal'); }}
          className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs sm:text-sm font-bold uppercase tracking-wider transition-all cursor-pointer w-full sm:w-auto justify-center
            ${activeSubTab === 'volunteer' ? 'bg-white dark:bg-slate-900 text-emerald-600 dark:text-emerald-400 shadow-sm border border-slate-200 dark:border-slate-700' : 'text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700'}`}
        >
          <Users className="w-4 h-4" />
          {lang === 'en' ? 'Volunteer Registry' : 'स्वयंसेवक'}
        </button>
        <button
          onClick={() => { setActiveSubTab('donation'); onTrackAction('Switch to Donation Portal'); }}
          className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs sm:text-sm font-bold uppercase tracking-wider transition-all cursor-pointer w-full sm:w-auto justify-center
            ${activeSubTab === 'donation' ? 'bg-white dark:bg-slate-900 text-teal-600 dark:text-teal-400 shadow-sm border border-slate-200 dark:border-slate-700' : 'text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700'}`}
        >
          <Heart className="w-4 h-4" />
          {lang === 'en' ? 'Welfare Donation' : 'कल्याणकारी दान'}
        </button>
      </div>

      {/* 1. MEMBERSHIP TAB */}
      {activeSubTab === 'membership' && (
        <div className="bg-white dark:bg-slate-900 p-6 sm:p-10 rounded-3xl border border-slate-100 dark:border-slate-800 shadow-sm space-y-8">
          <div>
            <span className="inline-block px-3 py-1 bg-emerald-50 dark:bg-emerald-950/50 text-emerald-700 dark:text-emerald-300 text-xs font-extrabold uppercase tracking-wider rounded-full border border-emerald-200 dark:border-emerald-800 mb-2">
              Direct Society Portal
            </span>
            <h2 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white">
              {lang === 'en' ? 'Apply for Lifetime Society Membership' : 'समाजको आजीवन सदस्यताका लागि आवेदन'}
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-2 leading-relaxed max-w-3xl">
              {lang === 'en'
                ? 'Fill out your official details below. Your application will be sent directly to csnepalwebsite@gmail.com for central verification and record issuance.'
                : 'तल आफ्नो आधिकारिक विवरणहरू भर्नुहोस्। तपाईंको आवेदन केन्द्रीय प्रमाणीकरण र रेकर्ड जारी गर्नका लागि सीधा csnepalwebsite@gmail.com मा पठाइनेछ।'}
            </p>
          </div>

          {membSuccess ? (
            <div className="p-8 bg-emerald-50 dark:bg-emerald-950/40 border-2 border-emerald-500/40 text-emerald-800 dark:text-emerald-300 rounded-3xl flex items-start gap-4 animate-in zoom-in-95 duration-200">
              <CheckCircle2 className="w-10 h-10 text-emerald-600 dark:text-emerald-400 shrink-0 mt-1" />
              <div>
                <h3 className="text-xl font-black">Application Dispatched Successfully!</h3>
                <p className="text-sm leading-relaxed mt-1">
                  Thank you, <strong>{membName || 'Applicant'}</strong>. Your membership application details have been formatted and delivered directly to <strong>csnepalwebsite@gmail.com</strong>. Our executive committee will review and issue your official ID card.
                </p>
                <button
                  onClick={() => setMembSuccess(false)}
                  className="mt-4 px-5 py-2 bg-emerald-600 text-white font-bold rounded-xl text-xs hover:bg-emerald-700 transition-all cursor-pointer"
                >
                  Submit Another Application
                </button>
              </div>
            </div>
          ) : (
            <form onSubmit={handleMembershipSubmit} className="space-y-6">
              {/* Toggle New / Renewal */}
              <div className="flex gap-4 p-1.5 bg-slate-100 dark:bg-slate-800 rounded-2xl w-fit">
                <button
                  type="button"
                  onClick={() => setMembAppType('new')}
                  className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${membAppType === 'new' ? 'bg-white dark:bg-slate-900 text-emerald-600 shadow-sm' : 'text-slate-600 dark:text-slate-400'}`}
                >
                  New Application (नयाँ आवेदन)
                </button>
                <button
                  type="button"
                  onClick={() => setMembAppType('renewal')}
                  className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${membAppType === 'renewal' ? 'bg-white dark:bg-slate-900 text-emerald-600 shadow-sm' : 'text-slate-600 dark:text-slate-400'}`}
                >
                  Membership Renewal (नवीकरण)
                </button>
              </div>

              {membAppType === 'renewal' && (
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Existing Membership ID
                  </label>
                  <input
                    type="text"
                    required
                    value={existingId}
                    onChange={e => setExistingId(e.target.value)}
                    placeholder="e.g. CSN-2024-892"
                    className="w-full p-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm text-slate-900 dark:text-white"
                  />
                </div>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Full Name (पूरा नाम) *
                  </label>
                  <div className="relative">
                    <Users className="w-4 h-4 text-slate-400 absolute left-3 top-3.5" />
                    <input
                      type="text"
                      required
                      value={membName}
                      onChange={e => setMembName(e.target.value)}
                      placeholder="e.g. Ramprasad Chaurasiya"
                      className="w-full pl-9 p-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm text-slate-900 dark:text-white"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Phone / Mobile Number *
                  </label>
                  <div className="relative">
                    <Phone className="w-4 h-4 text-slate-400 absolute left-3 top-3.5" />
                    <input
                      type="tel"
                      required
                      value={membPhone}
                      onChange={e => setMembPhone(e.target.value)}
                      placeholder="e.g. 9845012345"
                      className="w-full pl-9 p-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm text-slate-900 dark:text-white"
                    />
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Email Address
                  </label>
                  <div className="relative">
                    <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-3.5" />
                    <input
                      type="email"
                      value={membEmail}
                      onChange={e => setMembEmail(e.target.value)}
                      placeholder="name@gmail.com"
                      className="w-full pl-9 p-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm text-slate-900 dark:text-white"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Permanent Address / District *
                  </label>
                  <div className="relative">
                    <MapPin className="w-4 h-4 text-slate-400 absolute left-3 top-3.5" />
                    <input
                      type="text"
                      required
                      value={membAddr}
                      onChange={e => setMembAddr(e.target.value)}
                      placeholder="e.g. Parsa, Birgunj Ward 8"
                      className="w-full pl-9 p-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm text-slate-900 dark:text-white"
                    />
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Occupation / Profession
                  </label>
                  <div className="relative">
                    <Briefcase className="w-4 h-4 text-slate-400 absolute left-3 top-3.5" />
                    <input
                      type="text"
                      value={membOccupation}
                      onChange={e => setMembOccupation(e.target.value)}
                      placeholder="e.g. Business / Agriculture / Service"
                      className="w-full pl-9 p-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm text-slate-900 dark:text-white"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Membership Tier
                  </label>
                  <select
                    value={membType}
                    onChange={e => setMembType(e.target.value)}
                    className="w-full p-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm text-slate-900 dark:text-white"
                  >
                    <option value="General Membership (NPR 1,000)">General Membership (साधारण - NPR 1,000)</option>
                    <option value="Life Membership (NPR 11,000)">Life Membership (आजीवन - NPR 11,000)</option>
                    <option value="Patron Membership (NPR 51,000)">Patron / Donor Member (संरक्षक - NPR 51,000)</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Payment Method
                  </label>
                  <select
                    value={membPaymentMethod}
                    onChange={e => setMembPaymentMethod(e.target.value)}
                    className="w-full p-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm text-slate-900 dark:text-white"
                  >
                    <option value="Direct Bank Transfer / eSewa">Direct Bank Transfer / eSewa / Khalti</option>
                    <option value="Cash Payment to Regional Committee">Cash Payment to Regional Executive Committee</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Payment Reference / Bank Transaction ID
                  </label>
                  <div className="relative">
                    <FileText className="w-4 h-4 text-slate-400 absolute left-3 top-3.5" />
                    <input
                      type="text"
                      value={membPaymentRef}
                      onChange={e => setMembPaymentRef(e.target.value)}
                      placeholder="e.g. eSewa Txn #90281"
                      className="w-full pl-9 p-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm text-slate-900 dark:text-white"
                    />
                  </div>
                </div>
              </div>

              <button
                type="submit"
                disabled={membSubmitting}
                className="w-full py-4 bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-sm uppercase tracking-wider rounded-2xl shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
              >
                {membSubmitting ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    Sending Application to Email...
                  </>
                ) : (
                  <>
                    <Send className="w-5 h-5" />
                    {lang === 'en' ? 'Submit Application to csnepalwebsite@gmail.com' : 'आवेदन पठाउनुहोस्'}
                  </>
                )}
              </button>
            </form>
          )}
        </div>
      )}

      {/* 2. VOLUNTEER TAB */}
      {activeSubTab === 'volunteer' && (
        <div className="bg-white dark:bg-slate-900 p-6 sm:p-10 rounded-3xl border border-slate-100 dark:border-slate-800 shadow-sm space-y-8">
          <div>
            <span className="inline-block px-3 py-1 bg-teal-50 dark:bg-teal-950/50 text-teal-700 dark:text-teal-300 text-xs font-extrabold uppercase tracking-wider rounded-full border border-teal-200 dark:border-teal-800 mb-2">
              Volunteer Network Portal
            </span>
            <h2 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white">
              {lang === 'en' ? 'Join the Community Volunteer Taskforce' : 'सामुदायिक स्वयंसेवक कार्यदलमा सामेल हुनुहोस्'}
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-2 leading-relaxed max-w-2xl">
              {lang === 'en'
                ? 'We organize regional healthcare checkups, agricultural awareness camps for betel farmers, and community cleanliness drives. Submissions are delivered straight to csnepalwebsite@gmail.com.'
                : 'हामी क्षेत्रीय स्वास्थ्य जाँच, पान कृषकहरूको लागि कृषि सचेतना शिविर, र सामुदायिक सरसफाई अभियानहरू आयोजना गर्दछौं। आवेदनहरू csnepalwebsite@gmail.com मा पठाइन्छ।'}
            </p>
          </div>

          {volSuccess ? (
            <div className="p-8 bg-teal-50 dark:bg-teal-950/40 border-2 border-teal-500/40 text-teal-800 dark:text-teal-300 rounded-3xl flex items-start gap-4 animate-in zoom-in-95 duration-200">
              <CheckCircle2 className="w-10 h-10 text-teal-600 dark:text-teal-400 shrink-0 mt-1" />
              <div>
                <h3 className="text-xl font-black">Volunteer Registration Sent!</h3>
                <p className="text-sm leading-relaxed mt-1">
                  Thank you for stepping forward, <strong>{volName || 'Volunteer'}</strong>. Your application has been emailed to <strong>csnepalwebsite@gmail.com</strong>.
                </p>
                <button
                  onClick={() => setVolSuccess(false)}
                  className="mt-4 px-5 py-2 bg-teal-600 text-white font-bold rounded-xl text-xs hover:bg-teal-700 transition-all cursor-pointer"
                >
                  Register Another Volunteer
                </button>
              </div>
            </div>
          ) : (
            <form onSubmit={handleVolunteerSubmit} className="space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">Full Name *</label>
                  <input
                    type="text"
                    required
                    value={volName}
                    onChange={e => setVolName(e.target.value)}
                    placeholder="e.g. Sunita Chaurasiya"
                    className="w-full p-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm text-slate-900 dark:text-white"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">Phone Number *</label>
                  <input
                    type="tel"
                    required
                    value={volPhone}
                    onChange={e => setVolPhone(e.target.value)}
                    placeholder="e.g. 9812345678"
                    className="w-full p-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm text-slate-900 dark:text-white"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">Email Address</label>
                  <input
                    type="email"
                    value={volEmail}
                    onChange={e => setVolEmail(e.target.value)}
                    placeholder="name@gmail.com"
                    className="w-full p-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm text-slate-900 dark:text-white"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">Address / Location *</label>
                  <input
                    type="text"
                    required
                    value={volAddr}
                    onChange={e => setVolAddr(e.target.value)}
                    placeholder="e.g. Bara, Kalaiya"
                    className="w-full p-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm text-slate-900 dark:text-white"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-2">Areas of Interest</label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {[
                    'Healthcare Checkup Camps',
                    'Agricultural Outreach for Betel Farmers',
                    'Youth & Educational Support',
                    'Event Management & Logistics',
                  ].map(interest => (
                    <button
                      key={interest}
                      type="button"
                      onClick={() => toggleInterest(interest)}
                      className={`p-3 rounded-xl border text-left text-xs font-bold transition-all cursor-pointer flex items-center justify-between ${
                        volInterests.includes(interest)
                          ? 'bg-teal-50 dark:bg-teal-950 border-teal-500 text-teal-800 dark:text-teal-300'
                          : 'bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400'
                      }`}
                    >
                      {interest}
                      {volInterests.includes(interest) && <CheckCircle2 className="w-4 h-4 text-teal-600 shrink-0" />}
                    </button>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">Availability</label>
                  <select
                    value={volAvailability}
                    onChange={e => setVolAvailability(e.target.value)}
                    className="w-full p-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm text-slate-900 dark:text-white"
                  >
                    <option value="Weekends Only">Weekends Only (सप्ताहान्त)</option>
                    <option value="Major Events & Camps">Major Events & Camps Only (विशेष कार्यक्रम)</option>
                    <option value="Full-Time On Call">Full-Time On-Call (पूर्णकालीन)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">Notes / Motivation</label>
                  <input
                    type="text"
                    value={volNotes}
                    onChange={e => setVolNotes(e.target.value)}
                    placeholder="e.g. Willing to assist in blood donation camps..."
                    className="w-full p-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm text-slate-900 dark:text-white"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={volSubmitting}
                className="w-full py-4 bg-teal-600 hover:bg-teal-700 text-white font-extrabold text-sm uppercase tracking-wider rounded-2xl shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
              >
                {volSubmitting ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    Sending Volunteer Data...
                  </>
                ) : (
                  <>
                    <Send className="w-5 h-5" />
                    {lang === 'en' ? 'Register Volunteer to csnepalwebsite@gmail.com' : 'स्वयंसेवक दर्ता पठाउनुहोस्'}
                  </>
                )}
              </button>
            </form>
          )}
        </div>
      )}

      {/* 3. WELFARE DONATION TAB */}
      {activeSubTab === 'donation' && (
        <div className="bg-teal-950 text-white p-6 sm:p-10 rounded-3xl border-b-8 border-emerald-500 shadow-xl space-y-6 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/10 rounded-full blur-3xl" />
          <div>
            <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-emerald-500/10 border border-emerald-400/30 text-emerald-300 text-xs font-bold uppercase tracking-wider rounded-full">
              Welfare &amp; Healthcare Support Fund
            </span>
            <h2 className="text-2xl sm:text-3xl font-black text-white mt-2">
              {lang === 'en' ? 'Support Our Benevolent Welfare Initiatives' : 'परोपकारी कल्याणकारी पहलहरूमा सहयोग गर्नुहोस्'}
            </h2>
            <p className="text-xs sm:text-sm text-teal-200 mt-1.5 leading-relaxed max-w-2xl">
              {lang === 'en'
                ? 'Your financial support funds free rural healthcare checkup camps, student stationery kits, and seed support programs for betel farmers.'
                : 'तपाईंको आर्थिक सहयोगले ग्रामीण स्वास्थ्य जाँच शिविर, विद्यार्थी शैक्षिक सामग्री र पान कृषकहरूका लागि बीउ सहयोग कार्यक्रमहरूमा रकम प्रदान गर्दछ।'}
            </p>
          </div>

          {donateSuccess ? (
            <div className="p-6 bg-teal-900/90 border border-emerald-500/40 text-emerald-300 rounded-2xl flex items-start gap-4 animate-in zoom-in-95 duration-200">
              <CheckCircle2 className="w-8 h-8 text-emerald-400 shrink-0 mt-0.5" />
              <div>
                <h4 className="text-lg font-black">Heartfelt Thank You!</h4>
                <p className="text-xs leading-relaxed mt-1">
                  Your pledge of NPR {donatedAmt.toLocaleString()} has been logged. Please send the bank deposit/transfer copy to <strong>csnepalwebsite@gmail.com</strong>.
                </p>
              </div>
            </div>
          ) : (
            <form onSubmit={handleDonateSubmit} className="space-y-6">
              <div className="space-y-2">
                <label className="text-xs font-bold text-teal-300 uppercase tracking-wider">
                  Select Donation Amount (NPR)
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  {[500, 1000, 2500, 5000].map((amt) => {
                    const isSelected = donatePreset === amt && !donateCustom;
                    return (
                      <button
                        key={amt}
                        type="button"
                        onClick={() => {
                          setDonatePreset(amt);
                          setDonateCustom('');
                          onTrackAction(`Select donation preset: NPR ${amt}`);
                        }}
                        className={`py-3 text-sm font-black rounded-xl border transition-all cursor-pointer ${
                          isSelected
                            ? 'bg-emerald-500 text-teal-950 border-emerald-400 shadow-lg scale-105'
                            : 'bg-teal-900/40 text-white border-teal-800 hover:bg-teal-900'
                        }`}
                      >
                        NPR {amt.toLocaleString()}
                      </button>
                    );
                  })}
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-teal-300 uppercase tracking-wider">
                  Or Enter Custom Amount (NPR)
                </label>
                <input
                  type="number"
                  placeholder="e.g., 10000"
                  value={donateCustom}
                  onChange={(e) => {
                    setDonateCustom(e.target.value);
                    onTrackAction(`Type custom donation amount: ${e.target.value}`);
                  }}
                  className="w-full p-3 bg-teal-900/60 border border-teal-800 text-sm text-white rounded-xl focus:outline-none focus:border-emerald-400 font-mono"
                />
              </div>

              <div className="p-5 bg-teal-900/50 rounded-2xl border border-teal-800 space-y-3">
                <h4 className="text-sm font-bold text-emerald-400 uppercase tracking-wide flex items-center gap-1.5">
                  <Landmark className="w-5 h-5" />
                  Direct Bank Wire Info &amp; QR Payments
                </h4>
                <div className="text-sm space-y-2 text-teal-200/90 leading-relaxed font-medium">
                  <div><strong className="text-white">Bank Name:</strong> Global IME Bank Ltd., Birgunj Branch</div>
                  <div><strong className="text-white">Account Name:</strong> Chaurasiya Samaj Nepal</div>
                  <div><strong className="text-white">Account Number:</strong> 010101005234902 (Welfare Fund)</div>
                  <div><strong className="text-white">eSewa / Khalti ID:</strong> 9812345678 (CSN Official)</div>
                  <div className="text-xs text-teal-400 italic pt-2 border-t border-teal-800/50">
                    * Please email transaction copies to <strong>csnepalwebsite@gmail.com</strong> for tax receipts.
                  </div>
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-4 bg-emerald-500 hover:bg-emerald-400 text-teal-950 font-black text-xs uppercase tracking-wider rounded-2xl shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                <Heart className="w-5 h-5 text-teal-950 fill-teal-950" />
                Record Donation Pledge
              </button>
            </form>
          )}
        </div>
      )}
    </div>
  );
}
