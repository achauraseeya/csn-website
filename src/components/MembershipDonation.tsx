import React, { useState } from 'react';
import { CreditCard, Landmark, CheckCircle2, Heart, Award, Sparkles, UserPlus, Users, Phone, Mail, FileText, Upload, ShieldCheck, CheckSquare, ChevronRight } from 'lucide-react';
import { Language, MembershipApplication, VolunteerApplication } from '../types';
import { formatNumber } from '../utils/mediaUrl';

interface MembershipDonationProps {
  lang: Language;
  onAddMembershipApp?: (app: MembershipApplication) => void;
  onAddVolunteerApp?: (app: VolunteerApplication) => void;
  onAddMember: () => void;
  onAddDonation: (amount: number) => void;
  onTrackAction: (actionName: string) => void;
}

export default function MembershipDonation({
  lang,
  onAddMembershipApp,
  onAddVolunteerApp,
  onAddMember,
  onAddDonation,
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
  const [membCategory, setMembCategory] = useState<'General' | 'Executive' | 'Life Member' | 'Student'>('General');
  const [membPayMethod, setMembPayMethod] = useState<'eSewa' | 'Khalti' | 'Bank Transfer' | 'Cash'>('eSewa');
  const [membPayRef, setMembPayRef] = useState('');
  const [membReceiptUrl, setMembReceiptUrl] = useState('');
  const [membSuccess, setMembSuccess] = useState(false);

  // Volunteer Form state
  const [volName, setVolName] = useState('');
  const [volEmail, setVolEmail] = useState('');
  const [volPhone, setVolPhone] = useState('');
  const [volAddr, setVolAddr] = useState('');
  const [volInterests, setVolInterests] = useState<string[]>(['Health Camps', 'Youth & IT Training']);
  const [volAvailability, setVolAvailability] = useState('Weekends');
  const [volNotes, setVolNotes] = useState('');
  const [volSuccess, setVolSuccess] = useState(false);

  // Donation state
  const [donatePreset, setDonatePreset] = useState<number>(1000);
  const [donateCustom, setDonateCustom] = useState<string>('');
  const [donationMethod, setDonationMethod] = useState<'bank' | 'esewa' | 'khalti'>('bank');
  const [donateSuccess, setDonateSuccess] = useState(false);
  const [donatedAmt, setDonatedAmt] = useState(0);

  const availableInterests = [
    'Health Camps & Medical Relief',
    'Youth & IT Skill Training',
    'Paan Cultivation Innovation',
    'Cultural Heritage & Events',
    'Disaster Relief & Welfare',
    'Matrimonial Coordination'
  ];

  const handleMembSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!membName || !membPhone) return;

    const newApp: MembershipApplication = {
      id: `memb-${Date.now()}`,
      type: membAppType,
      existingMembershipId: membAppType === 'renewal' ? existingId : undefined,
      fullName: membName,
      phone: membPhone,
      email: membEmail,
      address: membAddr,
      occupation: membOccupation || 'Business/Service',
      membershipType: membCategory,
      paymentMethod: membPayMethod,
      paymentReference: membPayRef || 'CSN-ONLINE-REF',
      receiptPhotoUrl: membReceiptUrl,
      status: 'pending',
      createdAt: new Date().toISOString().split('T')[0],
    };

    if (onAddMembershipApp) {
      onAddMembershipApp(newApp);
    }
    onAddMember();
    setMembSuccess(true);
    onTrackAction(`Submitted Membership Request: ${membName} (${membCategory})`);

    setTimeout(() => {
      setMembSuccess(false);
      setMembName('');
      setMembEmail('');
      setMembPhone('');
      setMembAddr('');
      setMembPayRef('');
    }, 5000);
  };

  const handleVolSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!volName || !volPhone) return;

    const newVol: VolunteerApplication = {
      id: `vol-${Date.now()}`,
      fullName: volName,
      email: volEmail,
      phone: volPhone,
      address: volAddr,
      interests: volInterests,
      availability: volAvailability,
      notes: volNotes,
      status: 'pending',
      createdAt: new Date().toISOString().split('T')[0],
    };

    if (onAddVolunteerApp) {
      onAddVolunteerApp(newVol);
    }
    setVolSuccess(true);
    onTrackAction(`Registered Volunteer: ${volName}`);

    setTimeout(() => {
      setVolSuccess(false);
      setVolName('');
      setVolEmail('');
      setVolPhone('');
      setVolAddr('');
      setVolNotes('');
    }, 5000);
  };

  const handleDonateSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const finalAmount = donateCustom ? parseFloat(donateCustom) : donatePreset;
    if (!finalAmount || finalAmount <= 0) return;

    onAddDonation(finalAmount);
    setDonatedAmt(finalAmount);
    setDonateSuccess(true);
    onTrackAction(`Donated amount: NPR ${finalAmount} via ${donationMethod}`);

    setTimeout(() => {
      setDonateSuccess(false);
      setDonateCustom('');
    }, 5000);
  };

  const toggleInterest = (interest: string) => {
    if (volInterests.includes(interest)) {
      setVolInterests(volInterests.filter(i => i !== interest));
    } else {
      setVolInterests([...volInterests, interest]);
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-300 pb-12">
      {/* Top Selector Navigation Bar */}
      <div className="bg-white dark:bg-slate-900 p-2 rounded-2xl border border-teal-100 dark:border-slate-800 shadow-sm flex flex-col sm:flex-row gap-2">
        <button
          onClick={() => setActiveSubTab('membership')}
          className={`flex-1 py-3 px-4 rounded-xl font-extrabold text-xs transition-all flex items-center justify-center gap-2 cursor-pointer ${
            activeSubTab === 'membership'
              ? 'bg-teal-700 text-white shadow-md'
              : 'text-teal-900 dark:text-teal-100 hover:bg-teal-50 dark:hover:bg-slate-800'
          }`}
        >
          <Award className="w-4 h-4" />
          {lang === 'en' ? 'Membership & Renewals' : 'सदस्यता दर्ता तथा नवीकरण'}
        </button>

        <button
          onClick={() => setActiveSubTab('volunteer')}
          className={`flex-1 py-3 px-4 rounded-xl font-extrabold text-xs transition-all flex items-center justify-center gap-2 cursor-pointer ${
            activeSubTab === 'volunteer'
              ? 'bg-teal-700 text-white shadow-md'
              : 'text-teal-900 dark:text-teal-100 hover:bg-teal-50 dark:hover:bg-slate-800'
          }`}
        >
          <UserPlus className="w-4 h-4" />
          {lang === 'en' ? 'Join as Volunteer (युवा स्वयंसेवक)' : 'युवा स्वयंसेवक दर्ता'}
        </button>

        <button
          onClick={() => setActiveSubTab('donation')}
          className={`flex-1 py-3 px-4 rounded-xl font-extrabold text-xs transition-all flex items-center justify-center gap-2 cursor-pointer ${
            activeSubTab === 'donation'
              ? 'bg-emerald-600 text-white shadow-md'
              : 'text-teal-900 dark:text-teal-100 hover:bg-teal-50 dark:hover:bg-slate-800'
          }`}
        >
          <Heart className="w-4 h-4 fill-white" />
          {lang === 'en' ? 'Welfare Donation' : 'कल्याणकारी सहयोग'}
        </button>
      </div>

      {/* 1. MEMBERSHIP REGISTRATION & RENEWAL TAB */}
      {activeSubTab === 'membership' && (
        <div className="bg-white dark:bg-slate-900 p-6 sm:p-8 rounded-3xl border border-teal-100 dark:border-slate-800 shadow-sm space-y-6">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b pb-4 dark:border-slate-800">
            <div>
              <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-teal-50 dark:bg-slate-800 text-teal-800 dark:text-teal-300 text-xs font-black rounded-full uppercase tracking-wide">
                Certified Enrollment & Renewal
              </span>
              <h2 className="text-2xl font-black text-teal-950 dark:text-teal-100 mt-1">
                {lang === 'en' ? 'Chaurasiya Samaj Official Membership Portal' : 'चौरसिया समाज आधिकारिक सदस्यता पोर्टल'}
              </h2>
            </div>

            {/* Toggle New vs Renewal */}
            <div className="flex items-center p-1 bg-slate-100 dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700">
              <button
                type="button"
                onClick={() => setMembAppType('new')}
                className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all ${
                  membAppType === 'new' ? 'bg-teal-700 text-white shadow-sm' : 'text-gray-600 dark:text-gray-300'
                }`}
              >
                {lang === 'en' ? 'New Membership' : 'नयाँ सदस्यता'}
              </button>
              <button
                type="button"
                onClick={() => setMembAppType('renewal')}
                className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all ${
                  membAppType === 'renewal' ? 'bg-teal-700 text-white shadow-sm' : 'text-gray-600 dark:text-gray-300'
                }`}
              >
                {lang === 'en' ? 'Membership Renewal' : 'सदस्यता नवीकरण'}
              </button>
            </div>
          </div>

          {membSuccess ? (
            <div className="p-6 bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-300 dark:border-emerald-800 text-emerald-900 dark:text-emerald-200 rounded-2xl flex items-start gap-4 animate-in zoom-in-95 duration-200">
              <CheckCircle2 className="w-8 h-8 text-emerald-600 shrink-0 mt-1" />
              <div className="space-y-1">
                <h4 className="text-lg font-black">{lang === 'en' ? 'Application Submitted Successfully!' : 'आवेदन सफलतापूर्वक पेस भयो!'}</h4>
                <p className="text-xs font-medium leading-relaxed">
                  {lang === 'en'
                    ? 'Your application details and payment proof have been received. Admin (csnepalwebsite@gmail.com) will review and issue your official Chaurasiya Samaj Nepal Membership Certificate & ID.'
                    : 'तपाईंको आवेदन र भुक्तानी प्रमाण प्राप्त भएको छ। एडमिनले समीक्षा गरी तपाईंको आधिकारिक चौरसिया समाज सदस्यता प्रमाणपत्र र परिचयपत्र जारी गर्नेछ।'}
                </p>
              </div>
            </div>
          ) : (
            <form onSubmit={handleMembSubmit} className="space-y-6">
              {membAppType === 'renewal' && (
                <div className="p-4 bg-teal-50 dark:bg-slate-800 border border-teal-200 dark:border-slate-700 rounded-2xl space-y-2 text-xs font-semibold">
                  <label className="block text-teal-950 dark:text-teal-100 font-extrabold">Existing Membership ID (e.g. CSN-2025-108) *</label>
                  <input
                    type="text"
                    required
                    value={existingId}
                    onChange={e => setExistingId(e.target.value)}
                    placeholder="CSN-2025-XXXX"
                    className="w-full p-2.5 bg-white dark:bg-slate-900 border rounded-xl font-mono text-sm text-gray-900 dark:text-white"
                  />
                </div>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs font-semibold">
                <div>
                  <label className="block text-gray-700 dark:text-gray-300 mb-1">Full Name (पूरा नाम) *</label>
                  <input
                    type="text"
                    required
                    value={membName}
                    onChange={e => setMembName(e.target.value)}
                    placeholder="Rajesh Kumar Chaurasiya"
                    className="w-full p-2.5 bg-slate-50 dark:bg-slate-800 border rounded-xl text-gray-900 dark:text-white"
                  />
                </div>

                <div>
                  <label className="block text-gray-700 dark:text-gray-300 mb-1">Phone / WhatsApp Number *</label>
                  <input
                    type="tel"
                    required
                    value={membPhone}
                    onChange={e => setMembPhone(e.target.value)}
                    placeholder="+977-9800000000"
                    className="w-full p-2.5 bg-slate-50 dark:bg-slate-800 border rounded-xl text-gray-900 dark:text-white"
                  />
                </div>

                <div>
                  <label className="block text-gray-700 dark:text-gray-300 mb-1">Email Address *</label>
                  <input
                    type="email"
                    required
                    value={membEmail}
                    onChange={e => setMembEmail(e.target.value)}
                    placeholder="rajesh@gmail.com"
                    className="w-full p-2.5 bg-slate-50 dark:bg-slate-800 border rounded-xl text-gray-900 dark:text-white"
                  />
                </div>

                <div>
                  <label className="block text-gray-700 dark:text-gray-300 mb-1">Location Address (स्थान) *</label>
                  <input
                    type="text"
                    required
                    value={membAddr}
                    onChange={e => setMembAddr(e.target.value)}
                    placeholder="Birgunj, Parsa, Nepal"
                    className="w-full p-2.5 bg-slate-50 dark:bg-slate-800 border rounded-xl text-gray-900 dark:text-white"
                  />
                </div>

                <div>
                  <label className="block text-gray-700 dark:text-gray-300 mb-1">Membership Category *</label>
                  <select
                    value={membCategory}
                    onChange={e => setMembCategory(e.target.value as any)}
                    className="w-full p-2.5 bg-slate-50 dark:bg-slate-800 border rounded-xl text-gray-900 dark:text-white"
                  >
                    <option value="General">General Member (साधारण सदस्य - NPR 1,000 / Year)</option>
                    <option value="Life Member">Life Member (आजीवन सदस्य - NPR 15,000 One-time)</option>
                    <option value="Executive">Executive Committee Member (कार्यसमिति सदस्य)</option>
                    <option value="Student">Student Member (विद्यार्थी सदस्य - Free / निःशुल्क)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-gray-700 dark:text-gray-300 mb-1">Occupation / Profession</label>
                  <input
                    type="text"
                    value={membOccupation}
                    onChange={e => setMembOccupation(e.target.value)}
                    placeholder="e.g. Teacher, Business, Civil Engineer"
                    className="w-full p-2.5 bg-slate-50 dark:bg-slate-800 border rounded-xl text-gray-900 dark:text-white"
                  />
                </div>
              </div>

              {/* Payment Proof Details */}
              <div className="p-5 bg-teal-50/50 dark:bg-slate-800/50 border border-teal-100 dark:border-slate-800 rounded-2xl space-y-3 text-xs font-semibold">
                <h4 className="text-sm font-extrabold text-teal-950 dark:text-teal-100 flex items-center gap-2">
                  <CreditCard className="w-4 h-4 text-emerald-600" />
                  {lang === 'en' ? 'Payment Reference & Verification' : 'भुक्तानी विवरण र प्रमाणीकरण'}
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-gray-700 dark:text-gray-300 mb-1">Payment Method</label>
                    <select
                      value={membPayMethod}
                      onChange={e => setMembPayMethod(e.target.value as any)}
                      className="w-full p-2 bg-white dark:bg-slate-900 border rounded-xl text-gray-900 dark:text-white"
                    >
                      <option value="eSewa">eSewa Wallet (9812345678)</option>
                      <option value="Khalti">Khalti Wallet (9812345678)</option>
                      <option value="Bank Transfer">Bank Transfer (Global IME Bank)</option>
                      <option value="Cash">In-person Cash Payment</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-gray-700 dark:text-gray-300 mb-1">Transaction ID / Voucher No.</label>
                    <input
                      type="text"
                      value={membPayRef}
                      onChange={e => setMembPayRef(e.target.value)}
                      placeholder="e.g. TXN-9842103"
                      className="w-full p-2 bg-white dark:bg-slate-900 border rounded-xl text-gray-900 dark:text-white"
                    />
                  </div>
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-4 bg-teal-700 hover:bg-teal-800 text-white font-extrabold text-xs uppercase tracking-wider rounded-2xl shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                <Award className="w-5 h-5 text-emerald-300" />
                {lang === 'en' ? 'Submit Membership Application' : 'सदस्यता आवेदन दर्ता गर्नुहोस्'}
              </button>
            </form>
          )}
        </div>
      )}

      {/* 2. JOIN AS VOLUNTEER TAB */}
      {activeSubTab === 'volunteer' && (
        <div className="bg-white dark:bg-slate-900 p-6 sm:p-8 rounded-3xl border border-teal-100 dark:border-slate-800 shadow-sm space-y-6">
          <div>
            <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-emerald-50 dark:bg-slate-800 text-emerald-800 dark:text-emerald-300 text-xs font-black rounded-full uppercase tracking-wide">
              Youth & Community Service
            </span>
            <h2 className="text-2xl font-black text-teal-950 dark:text-teal-100 mt-1">
              {lang === 'en' ? 'Join Chaurasiya Youth Volunteer Corps' : 'चौरसिया युवा स्वयंसेवक अभियानमा जोडिनुहोस्'}
            </h2>
            <p className="text-xs text-gray-500 font-medium mt-1">
              {lang === 'en'
                ? 'Empower our community through health camps, disaster relief, blood donation drives, and IT workshops.'
                : 'स्वास्थ्य शिविर, विपद् व्यवस्थापन, रक्तदान कार्यक्रम र सूचना प्रविधि कार्यशाला मार्फत समुदायलाई सशक्त बनाउनुहोस्।'}
            </p>
          </div>

          {volSuccess ? (
            <div className="p-6 bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-300 dark:border-emerald-800 text-emerald-900 dark:text-emerald-200 rounded-2xl flex items-start gap-4 animate-in zoom-in-95 duration-200">
              <CheckCircle2 className="w-8 h-8 text-emerald-600 shrink-0 mt-1" />
              <div className="space-y-1">
                <h4 className="text-lg font-black">{lang === 'en' ? 'Volunteer Registration Received!' : 'स्वयंसेवक दर्ता प्राप्त भयो!'}</h4>
                <p className="text-xs font-medium leading-relaxed">
                  {lang === 'en'
                    ? 'Thank you for joining our volunteer network! Admin will contact you regarding upcoming social programs in your district.'
                    : 'हाम्रो स्वयंसेवक सञ्जालमा सामेल हुनुभएकोमा धन्यवाद! एडमिनले तपाईंको जिल्लाका आगामी कार्यक्रमहरूका लागि सम्पर्क गर्नेछ।'}
                </p>
              </div>
            </div>
          ) : (
            <form onSubmit={handleVolSubmit} className="space-y-6 text-xs font-semibold">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-gray-700 dark:text-gray-300 mb-1">Volunteer Full Name *</label>
                  <input
                    type="text"
                    required
                    value={volName}
                    onChange={e => setVolName(e.target.value)}
                    placeholder="e.g. Abhishek Chaurasiya"
                    className="w-full p-2.5 bg-slate-50 dark:bg-slate-800 border rounded-xl text-gray-900 dark:text-white"
                  />
                </div>

                <div>
                  <label className="block text-gray-700 dark:text-gray-300 mb-1">Phone / WhatsApp *</label>
                  <input
                    type="tel"
                    required
                    value={volPhone}
                    onChange={e => setVolPhone(e.target.value)}
                    placeholder="+977-9800000000"
                    className="w-full p-2.5 bg-slate-50 dark:bg-slate-800 border rounded-xl text-gray-900 dark:text-white"
                  />
                </div>

                <div>
                  <label className="block text-gray-700 dark:text-gray-300 mb-1">Email Address *</label>
                  <input
                    type="email"
                    required
                    value={volEmail}
                    onChange={e => setVolEmail(e.target.value)}
                    placeholder="volunteer@gmail.com"
                    className="w-full p-2.5 bg-slate-50 dark:bg-slate-800 border rounded-xl text-gray-900 dark:text-white"
                  />
                </div>

                <div>
                  <label className="block text-gray-700 dark:text-gray-300 mb-1">District & Local Address *</label>
                  <input
                    type="text"
                    required
                    value={volAddr}
                    onChange={e => setVolAddr(e.target.value)}
                    placeholder="Parsa, Madhesh Pradesh"
                    className="w-full p-2.5 bg-slate-50 dark:bg-slate-800 border rounded-xl text-gray-900 dark:text-white"
                  />
                </div>
              </div>

              {/* Skill Interests selection */}
              <div className="space-y-2">
                <label className="block text-teal-950 dark:text-teal-100 font-extrabold">{lang === 'en' ? 'Select Areas of Interest & Skills:' : 'रुचि र सीपका क्षेत्रहरू छान्नुहोस्:'}</label>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2">
                  {availableInterests.map(interest => {
                    const isChecked = volInterests.includes(interest);
                    return (
                      <button
                        type="button"
                        key={interest}
                        onClick={() => toggleInterest(interest)}
                        className={`p-3 rounded-xl border text-left text-xs font-bold transition-all flex items-center justify-between gap-2 cursor-pointer ${
                          isChecked
                            ? 'bg-teal-50 dark:bg-slate-800 border-teal-500 text-teal-900 dark:text-teal-200'
                            : 'bg-slate-50 dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-gray-600 dark:text-gray-400'
                        }`}
                      >
                        <span>{interest}</span>
                        {isChecked && <CheckSquare className="w-4 h-4 text-emerald-600 shrink-0" />}
                      </button>
                    );
                  })}
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-gray-700 dark:text-gray-300 mb-1">Time Availability</label>
                  <select
                    value={volAvailability}
                    onChange={e => setVolAvailability(e.target.value)}
                    className="w-full p-2.5 bg-slate-50 dark:bg-slate-800 border rounded-xl text-gray-900 dark:text-white"
                  >
                    <option value="Weekends">Weekends Only (सप्ताहान्त)</option>
                    <option value="Events">Major Events & Camps Only (विशेष कार्यक्रम)</option>
                    <option value="Full-Time">Full-Time On-Call (पूर्णकालीन)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-gray-700 dark:text-gray-300 mb-1">Motivation / Notes (Optional)</label>
                  <input
                    type="text"
                    value={volNotes}
                    onChange={e => setVolNotes(e.target.value)}
                    placeholder="e.g. Willing to assist in medical camps..."
                    className="w-full p-2.5 bg-slate-50 dark:bg-slate-800 border rounded-xl text-gray-900 dark:text-white"
                  />
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-4 bg-teal-700 hover:bg-teal-800 text-white font-extrabold text-xs uppercase tracking-wider rounded-2xl shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                <UserPlus className="w-5 h-5 text-emerald-300" />
                {lang === 'en' ? 'Register as Official Volunteer' : 'स्वयंसेवक दर्ता गर्नुहोस्'}
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
                  Your donation of NPR {donatedAmt.toLocaleString()} has been recorded in the central audit ledger.
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

              {/* Payment Wire Box */}
              <div className="p-5 bg-teal-900/50 rounded-2xl border border-teal-800 space-y-3">
                <h4 className="text-xs font-bold text-emerald-400 uppercase tracking-wide flex items-center gap-1.5">
                  <Landmark className="w-4 h-4" />
                  Direct Bank Wire Info &amp; QR Payments
                </h4>
                <div className="text-xs space-y-1.5 text-teal-200/90 leading-relaxed font-medium">
                  <div><strong className="text-white">Bank Name:</strong> Global IME Bank Ltd., Birgunj Branch</div>
                  <div><strong className="text-white">Account Name:</strong> Chaurasiya Samaj Nepal</div>
                  <div><strong className="text-white">Account Number:</strong> 010101005234902 (Welfare Fund)</div>
                  <div><strong className="text-white">eSewa / Khalti ID:</strong> 9812345678 (CSN Official)</div>
                  <div className="text-[11px] text-teal-400 italic pt-1">
                    * Please send a copy of your transaction receipt to <strong>csnepalwebsite@gmail.com</strong> for audited tax receipts.
                  </div>
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-4 bg-emerald-500 hover:bg-emerald-400 text-teal-950 font-black text-xs uppercase tracking-wider rounded-2xl shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                <Heart className="w-5 h-5 text-teal-950 fill-teal-950" />
                Complete Secure Transaction Record
              </button>
            </form>
          )}
        </div>
      )}
    </div>
  );
}
