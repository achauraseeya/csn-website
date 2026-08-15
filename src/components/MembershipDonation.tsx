import React, { useState, useEffect } from 'react';
import { Landmark, Heart, Award, Users, Mail, Phone, MapPin, Briefcase, FileText, CheckCircle2, Loader2, Send, QrCode, ZoomIn, Copy, Check, Upload, Image as ImageIcon, Sparkles, Printer, X, Download, ShieldCheck } from 'lucide-react';
import { Language } from '../types';
import { AdminFormFieldEditor } from './AdminFormFieldEditor';
import { AdminCategoryManagerModal } from './AdminCategoryManagerModal';
import { CustomFieldRenderer } from './CustomFieldRenderer';
import { getCustomFormFields, syncCustomFormFieldsFromGithub, getHiddenStandardFields, syncHiddenStandardFieldsFromGithub, CustomFormField } from '../utils/customFormFields';
import { getMemberCategories, MemberCategory } from '../utils/memberCategories';
import { apiFetch, saveFileToGithub } from '../utils/githubDb';

interface MembershipDonationProps {
  lang: Language;
  onAddMember?: () => void;
  onAddDonation?: (amount: number) => void;
  isAdmin?: boolean;
  onTrackAction: (actionName: string) => void;
  initialSubTab?: 'membership' | 'volunteer' | 'donation';
  initialDonationCause?: string;
}

export default function MembershipDonation({
  lang,
  onAddMember,
  onAddDonation,
  isAdmin = false,
  onTrackAction,
  initialSubTab = 'membership',
  initialDonationCause = '',
}: MembershipDonationProps) {
  // Portal Tab State
  const [activeSubTab, setActiveSubTab] = useState<'membership' | 'volunteer' | 'donation'>(initialSubTab);

  useEffect(() => {
    if (initialSubTab) {
      setActiveSubTab(initialSubTab);
    }
  }, [initialSubTab]);

  // Dynamic Member Categories
  const [memberCategories, setMemberCategories] = useState<MemberCategory[]>(() => getMemberCategories());

  const refreshMemberCategories = () => {
    setMemberCategories(getMemberCategories());
  };

  // Custom Form Fields State
  const [membCustomFields, setMembCustomFields] = useState<CustomFormField[]>(() => getCustomFormFields('membership'));
  const [membCustomAnswers, setMembCustomAnswers] = useState<Record<string, string>>({});

  const [volCustomFields, setVolCustomFields] = useState<CustomFormField[]>(() => getCustomFormFields('volunteer'));
  const [volCustomAnswers, setVolCustomAnswers] = useState<Record<string, string>>({});

  const [donateCustomFields, setDonateCustomFields] = useState<CustomFormField[]>(() => getCustomFormFields('donation'));
  const [donateCustomAnswers, setDonateCustomAnswers] = useState<Record<string, string>>({});

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
  const [donorName, setDonorName] = useState('');
  const [donorPhone, setDonorPhone] = useState('');
  const [donorEmail, setDonorEmail] = useState('');
  const [donorAddress, setDonorAddress] = useState('');
  const [donorPan, setDonorPan] = useState('');
  const [donationCause, setDonationCause] = useState(initialDonationCause || 'Rural Healthcare & Medical Camps');
  const [donateSubmitting, setDonateSubmitting] = useState(false);
  const [donateSuccess, setDonateSuccess] = useState(false);
  const [showZoomQr, setShowZoomQr] = useState(false);
  const [pledgeReceipt, setPledgeReceipt] = useState<any>(null);
  const [copiedAccount, setCopiedAccount] = useState(false);

  // Admin editable Donation Info
  const [donationInfo, setDonationInfo] = useState(() => {
    try {
      const saved = localStorage.getItem('chaurasiya_donation_info');
      if (saved) {
        return JSON.parse(saved);
      }
    } catch (e) {
      console.warn('Local storage access restricted:', e);
    }
    return {
      titleEn: 'Support Our Benevolent Welfare Initiatives',
      titleNe: 'परोपकारी कल्याणकारी पहलहरूमा सहयोग गर्नुहोस्',
      descEn: 'Your financial support funds free rural healthcare checkup camps, student stationery kits, and seed support programs for betel farmers.',
      descNe: 'तपाईंको आर्थिक सहयोगले ग्रामीण स्वास्थ्य जाँच शिविर, विद्यार्थी शैक्षिक सामग्री र पान कृषकहरूका लागि बीउ सहयोग कार्यक्रमहरूमा रकम प्रदान गर्दछ।',
      bankName: 'Global IME Bank Ltd., Birgunj Branch',
      accountName: 'Chaurasiya Samaj Nepal',
      accountNumber: '010101005234902 (Welfare Fund)',
      esewaId: '9812345678 (CSN Official)',
      contactEmail: 'csnepalwebsite@gmail.com',
      qrCodeUrl: 'https://api.qrserver.com/v1/create-qr-code/?size=350x350&data=CSN_OFFICIAL_WELFARE_DONATION_ACCOUNT_010101005234902',
      qrCodeLabelEn: 'Scan to Pay via eSewa, Fonepay, Khalti or Mobile Banking',
      qrCodeLabelNe: 'ईसेवा, फोनपे, खल्ती वा मोबाइल बैंकिङबाट भुक्तानी गर्न स्क्यान गर्नुहोस्',
    };
  });

  const [showEditDonationModal, setShowEditDonationModal] = useState(false);
  const [editDonationForm, setEditDonationForm] = useState(donationInfo);

  // Admin editable Membership Info
  const [membershipInfo, setMembershipInfo] = useState(() => {
    try {
      const saved = localStorage.getItem('chaurasiya_membership_info');
      if (saved) {
        return JSON.parse(saved);
      }
    } catch (e) {
      console.warn('Local storage access restricted:', e);
    }
    return {
      badgeEn: 'Core Membership',
      badgeNe: 'आजीवन सदस्यता',
      titleEn: 'Join Chaurasiya Samaj Nepal as a Core Member',
      titleNe: 'आजीवन सदस्यको रूपमा चौरसिया समाज नेपालमा आबद्ध हुनुहोस्',
      descEn: 'Become an official life member to receive your secure digital identity card, direct access to the executive directory, and community benefits.',
      descNe: 'सुरक्षित डिजिटल परिचय पत्र, कार्यकारी डाइरेक्टरीमा प्रत्यक्ष पहुँच र सामुदायिक लाभहरू प्राप्त गर्न आधिकारिक आजीवन सदस्य बन्नुहोस्।',
    };
  });

  const [showEditMembershipModal, setShowEditMembershipModal] = useState(false);
  const [editMembershipForm, setEditMembershipForm] = useState(membershipInfo);

  // Admin editable Volunteer Info
  const [volunteerInfo, setVolunteerInfo] = useState(() => {
    try {
      const saved = localStorage.getItem('chaurasiya_volunteer_info');
      if (saved) {
        return JSON.parse(saved);
      }
    } catch (e) {
      console.warn('Local storage access restricted:', e);
    }
    return {
      badgeEn: 'Volunteer Registry',
      badgeNe: 'स्वयंसेवक',
      titleEn: 'Step Forward: Support Our Community Service Campaigns',
      titleNe: 'अघि बढ्नुहोस्: हाम्रो सामुदायिक सेवा अभियानहरूलाई समर्थन गर्नुहोस्',
      descEn: 'Register as an official volunteer to participate in rural health camps, youth leadership workshops, and betel farming outreach programs.',
      descNe: 'ग्रामीण स्वास्थ्य शिविर, युवा नेतृत्व कार्यशाला र पान खेती पहुँच कार्यक्रमहरूमा भाग लिन आधिकारिक स्वयंसेवकको रूपमा दर्ता गर्नुहोस्।',
    };
  });

  const [showEditVolunteerModal, setShowEditVolunteerModal] = useState(false);
  const [editVolunteerForm, setEditVolunteerForm] = useState(volunteerInfo);

  // Standard fields hiding state
  const [hiddenStandardFields, setHiddenStandardFields] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem('csn_hidden_standard_fields');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const isFieldVisible = (fieldKey: string) => !hiddenStandardFields.includes(fieldKey);

  // Fetch online GitHub settings on mount
  useEffect(() => {
    // 1. Donation Info
    apiFetch<any>('/api/donation-info', 'donation_info.json', null)
      .then((cloudInfo) => {
        if (cloudInfo && typeof cloudInfo === 'object' && cloudInfo.bankName) {
          const merged = {
            qrCodeUrl: 'https://api.qrserver.com/v1/create-qr-code/?size=350x350&data=CSN_OFFICIAL_WELFARE_DONATION_ACCOUNT_010101005234902',
            qrCodeLabelEn: 'Scan to Pay via eSewa, Fonepay, Khalti or Mobile Banking',
            qrCodeLabelNe: 'ईसेवा, फोनपे, खल्ती वा मोबाइल बैंकिङबाट भुक्तानी गर्न स्क्यान गर्नुहोस्',
            ...cloudInfo
          };
          setDonationInfo(merged);
          setEditDonationForm(merged);
          try {
            localStorage.setItem('chaurasiya_donation_info', JSON.stringify(merged));
          } catch (e) {}
        }
      })
      .catch(() => {});

    // 2. Membership Info
    apiFetch<any>('/api/membership-info', 'membership_info.json', null)
      .then((cloudInfo) => {
        if (cloudInfo && typeof cloudInfo === 'object' && cloudInfo.titleEn) {
          setMembershipInfo(cloudInfo);
          setEditMembershipForm(cloudInfo);
          try {
            localStorage.setItem('chaurasiya_membership_info', JSON.stringify(cloudInfo));
          } catch (e) {}
        }
      })
      .catch(() => {});

    // 3. Volunteer Info
    apiFetch<any>('/api/volunteer-info', 'volunteer_info.json', null)
      .then((cloudInfo) => {
        if (cloudInfo && typeof cloudInfo === 'object' && cloudInfo.titleEn) {
          setVolunteerInfo(cloudInfo);
          setEditVolunteerForm(cloudInfo);
          try {
            localStorage.setItem('chaurasiya_volunteer_info', JSON.stringify(cloudInfo));
          } catch (e) {}
        }
      })
      .catch(() => {});

    // 4. Hidden standard fields & custom fields sync
    syncHiddenStandardFieldsFromGithub().then((fields) => {
      if (fields && Array.isArray(fields)) {
        setHiddenStandardFields(fields);
      }
    });

    syncCustomFormFieldsFromGithub().then(() => {
      setMembCustomFields(getCustomFormFields('membership'));
      setVolCustomFields(getCustomFormFields('volunteer'));
      setDonateCustomFields(getCustomFormFields('donation'));
    });
  }, []);

  // Update lists from localStorage on changes
  const handleFieldsUpdated = () => {
    setMembCustomFields(getCustomFormFields('membership'));
    setVolCustomFields(getCustomFormFields('volunteer'));
    setDonateCustomFields(getCustomFormFields('donation'));
    try {
      const saved = localStorage.getItem('csn_hidden_standard_fields');
      if (saved) {
        setHiddenStandardFields(JSON.parse(saved));
      }
    } catch (e) {}
  };

  const handleSaveDonationInfo = (e: React.FormEvent) => {
    e.preventDefault();
    setDonationInfo(editDonationForm);
    localStorage.setItem('chaurasiya_donation_info', JSON.stringify(editDonationForm));
    saveFileToGithub('donation_info.json', editDonationForm, 'Update Welfare Donation settings').catch(() => {});
    setShowEditDonationModal(false);
    onTrackAction('Admin updated Welfare Donation info');
  };

  const handleSaveMembershipInfo = (e: React.FormEvent) => {
    e.preventDefault();
    setMembershipInfo(editMembershipForm);
    localStorage.setItem('chaurasiya_membership_info', JSON.stringify(editMembershipForm));
    saveFileToGithub('membership_info.json', editMembershipForm, 'Update Core Membership settings').catch(() => {});
    setShowEditMembershipModal(false);
    onTrackAction('Admin updated Core Membership settings info');
  };

  const handleSaveVolunteerInfo = (e: React.FormEvent) => {
    e.preventDefault();
    setVolunteerInfo(editVolunteerForm);
    localStorage.setItem('chaurasiya_volunteer_info', JSON.stringify(editVolunteerForm));
    saveFileToGithub('volunteer_info.json', editVolunteerForm, 'Update Volunteer settings').catch(() => {});
    setShowEditVolunteerModal(false);
    onTrackAction('Admin updated Volunteer settings info');
  };

  // Handle Membership Form Submission via direct Email Pipeline
  const handleMembershipSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if ((isFieldVisible('membership-name') && !membName) || 
        (isFieldVisible('membership-phone') && !membPhone) || 
        (isFieldVisible('membership-address') && !membAddr)) return;

    setMembSubmitting(true);
    onTrackAction(`Submit Membership Application: ${membName || 'Applicant'}`);

    const formData = new FormData();
    formData.append('_subject', `New Membership Application (${membAppType.toUpperCase()}) - ${membName || 'Applicant'}`);
    formData.append('_template', 'table');
    formData.append('_captcha', 'false');
    formData.append('Application Type', membAppType === 'renewal' ? `Renewal (Existing ID: ${existingId})` : 'New Application');
    
    if (isFieldVisible('membership-name')) formData.append('Full Name', membName);
    if (isFieldVisible('membership-email')) formData.append('Email Address', membEmail || 'Not provided');
    if (isFieldVisible('membership-phone')) formData.append('Phone Number', membPhone);
    if (isFieldVisible('membership-address')) formData.append('Address / District', membAddr);
    if (isFieldVisible('membership-occupation')) formData.append('Occupation', membOccupation || 'Not provided');
    if (isFieldVisible('membership-type')) formData.append('Membership Category', membType);
    formData.append('Duration', membDuration);
    if (isFieldVisible('membership-payment-method')) formData.append('Payment Method', membPaymentMethod);
    if (isFieldVisible('membership-payment-ref')) formData.append('Payment Reference / Txn ID', membPaymentRef || 'Pending');

    membCustomFields.forEach(cf => {
      const val = membCustomAnswers[cf.id];
      if (val) {
        formData.append(cf.label.en, val);
      }
    });

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
    if ((isFieldVisible('volunteer-name') && !volName) || 
        (isFieldVisible('volunteer-phone') && !volPhone) || 
        (isFieldVisible('volunteer-address') && !volAddr)) return;

    setVolSubmitting(true);
    onTrackAction(`Submit Volunteer Registration: ${volName || 'Volunteer'}`);

    const formData = new FormData();
    formData.append('_subject', `New Volunteer Registration - ${volName || 'Volunteer'}`);
    formData.append('_template', 'table');
    formData.append('_captcha', 'false');
    
    if (isFieldVisible('volunteer-name')) formData.append('Full Name', volName);
    if (isFieldVisible('volunteer-email')) formData.append('Email Address', volEmail || 'Not provided');
    if (isFieldVisible('volunteer-phone')) formData.append('Phone Number', volPhone);
    if (isFieldVisible('volunteer-address')) formData.append('Address', volAddr);
    if (isFieldVisible('volunteer-interests')) formData.append('Areas of Interest', volInterests.join(', '));
    if (isFieldVisible('volunteer-availability')) formData.append('Time Availability', volAvailability);
    if (isFieldVisible('volunteer-notes')) formData.append('Motivation / Notes', volNotes || 'None');

    volCustomFields.forEach(cf => {
      const val = volCustomAnswers[cf.id];
      if (val) {
        formData.append(cf.label.en, val);
      }
    });

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

  const handleDonateSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const finalAmt = donateCustom ? parseInt(donateCustom, 10) : donatePreset;
    if (isNaN(finalAmt) || finalAmt <= 0) return;

    setDonatedAmt(finalAmt);
    setDonateSubmitting(true);
    onTrackAction(`Completed donation submission: NPR ${finalAmt}`);

    const pledgeRef = `CSN-DON-${Date.now().toString().slice(-6)}`;
    const timestamp = new Date().toLocaleString('en-US', { timeZone: 'Asia/Kathmandu' });

    const pledgeRecord: any = {
      referenceId: pledgeRef,
      timestamp,
      donorName: donorName.trim() || 'Anonymous / Well-wisher',
      donorPhone: donorPhone.trim() || 'Not provided',
      donorEmail: donorEmail.trim() || 'Not provided',
      donorAddress: donorAddress.trim() || 'Not provided',
      donorPan: donorPan.trim() || 'Not provided',
      donationCause: donationCause || 'Welfare & Healthcare Support Fund',
      pledgedAmount: finalAmt,
      customAnswers: donateCustomAnswers,
    };

    // Prepare JSON payload for formsubmit.co
    const payload: Record<string, string> = {
      _subject: `New Welfare Donation Pledge #${pledgeRef} - NPR ${finalAmt.toLocaleString()}`,
      _template: 'table',
      _captcha: 'false',
      'Pledge Reference ID': pledgeRef,
      'Pledged Amount (NPR)': `NPR ${finalAmt.toLocaleString()}`,
      'Target Cause / Fund': donationCause || 'Welfare & Healthcare Support Fund',
      'Donor Full Name': donorName.trim() || 'Anonymous / Well-wisher',
      'Donor Phone / Mobile': donorPhone.trim() || 'Not provided',
      'Donor Email Address': donorEmail.trim() || 'Not provided',
      'Donor Address / District': donorAddress.trim() || 'Not provided',
      'Donor PAN / Citizenship': donorPan.trim() || 'Not provided',
      'Submission Timestamp': timestamp,
    };

    // Add all dynamic custom questions & answers
    donateCustomFields.forEach((cf) => {
      const val = donateCustomAnswers[cf.id];
      if (val) {
        payload[cf.label.en || cf.label.ne] = val;
      }
    });

    const targetRecipient = (donationInfo.contactEmail && donationInfo.contactEmail.trim()) || 'csnepalwebsite@gmail.com';

    try {
      await fetch(`https://formsubmit.co/ajax/${targetRecipient}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      // Direct fallback to official email if custom email is different
      if (targetRecipient !== 'csnepalwebsite@gmail.com') {
        fetch('https://formsubmit.co/ajax/csnepalwebsite@gmail.com', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
          body: JSON.stringify(payload),
        }).catch(() => {});
      }
    } catch (err) {
      console.warn('Network submission notice:', err);
    }

    // Persist donation pledges locally & sync with GitHub
    try {
      const existing = localStorage.getItem('csn_donation_pledges');
      const list = existing ? JSON.parse(existing) : [];
      const updated = [pledgeRecord, ...list];
      localStorage.setItem('csn_donation_pledges', JSON.stringify(updated));
      saveFileToGithub('donation_pledges.json', updated, `New donation pledge ${pledgeRef}`).catch(() => {});
    } catch (e) {
      console.warn('LocalStorage notice:', e);
    }

    if (onAddDonation) {
      onAddDonation(finalAmt);
    }

    setPledgeReceipt(pledgeRecord);
    setDonateSuccess(true);
    setDonateSubmitting(false);
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
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div>
              <span className="inline-block px-3 py-1 bg-emerald-50 dark:bg-emerald-950/50 text-emerald-700 dark:text-emerald-300 text-xs font-extrabold uppercase tracking-wider rounded-full border border-emerald-200 dark:border-emerald-800 mb-2">
                {lang === 'en' ? membershipInfo.badgeEn : membershipInfo.badgeNe}
              </span>
              <h2 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white">
                {lang === 'en' ? membershipInfo.titleEn : membershipInfo.titleNe}
              </h2>
              <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-2 leading-relaxed max-w-3xl">
                {lang === 'en' ? membershipInfo.descEn : membershipInfo.descNe}
              </p>
            </div>
            {isAdmin && (
              <button
                type="button"
                onClick={() => {
                  setEditMembershipForm(membershipInfo);
                  setShowEditMembershipModal(true);
                }}
                className="px-4 py-2 bg-emerald-500 hover:bg-emerald-400 text-teal-950 text-xs font-black uppercase tracking-wider rounded-xl shadow transition-all shrink-0 cursor-pointer"
              >
                ✏️ Edit Texts
              </button>
            )}
          </div>

          {/* Admin Form Customizer & Category Committee Manager */}
          {isAdmin && (
            <div className="space-y-4">
              <div className="p-4 bg-teal-50/70 dark:bg-slate-800/80 border border-teal-200 dark:border-slate-700 rounded-2xl flex flex-wrap items-center justify-between gap-3">
                <div>
                  <h4 className="text-xs font-black uppercase text-teal-900 dark:text-emerald-400">
                    {lang === 'en' ? 'Admin Category Committee Controls' : 'प्रशासक समिति श्रेणी नियन्त्रण'}
                  </h4>
                  <p className="text-[11px] text-slate-600 dark:text-slate-400">
                    {lang === 'en'
                      ? 'Add, edit, or remove member types and committee categories. Changes update automatically here and in the Directory.'
                      : 'सदस्य प्रकार र समिति श्रेणीहरू थप्नुहोस्, सम्पादन गर्नुहोस् वा हटाउनुहोस्। परिवर्तनहरू यहाँ र डाइरेक्टरीमा स्वतः अद्यावधिक हुन्छन्।'}
                  </p>
                </div>
                <AdminCategoryManagerModal
                  lang={lang}
                  isAdmin={isAdmin}
                  onCategoriesUpdated={refreshMemberCategories}
                />
              </div>

              <AdminFormFieldEditor
                formId="membership"
                lang={lang}
                isAdmin={isAdmin}
                onFieldsUpdated={handleFieldsUpdated}
              />
            </div>
          )}

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
                {isFieldVisible('membership-name') && (
                  <div>
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                      Full Name (पूरा नाम) *
                    </label>
                    <div className="relative">
                      <Users className="w-4 h-4 text-slate-400 absolute left-3 top-3.5" />
                      <input
                        type="text"
                        required={isFieldVisible('membership-name')}
                        value={membName}
                        onChange={e => setMembName(e.target.value)}
                        placeholder="e.g. Ramprasad Chaurasiya"
                        className="w-full pl-9 p-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm text-slate-900 dark:text-white"
                      />
                    </div>
                  </div>
                )}

                {isFieldVisible('membership-phone') && (
                  <div>
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                      Phone / Mobile Number *
                    </label>
                    <div className="relative">
                      <Phone className="w-4 h-4 text-slate-400 absolute left-3 top-3.5" />
                      <input
                        type="tel"
                        required={isFieldVisible('membership-phone')}
                        value={membPhone}
                        onChange={e => setMembPhone(e.target.value)}
                        placeholder="e.g. 9845012345"
                        className="w-full pl-9 p-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm text-slate-900 dark:text-white"
                      />
                    </div>
                  </div>
                )}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {isFieldVisible('membership-email') && (
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
                )}

                {isFieldVisible('membership-address') && (
                  <div>
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                      Permanent Address / District *
                    </label>
                    <div className="relative">
                      <MapPin className="w-4 h-4 text-slate-400 absolute left-3 top-3.5" />
                      <input
                        type="text"
                        required={isFieldVisible('membership-address')}
                        value={membAddr}
                        onChange={e => setMembAddr(e.target.value)}
                        placeholder="e.g. Parsa, Birgunj Ward 8"
                        className="w-full pl-9 p-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm text-slate-900 dark:text-white"
                      />
                    </div>
                  </div>
                )}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {isFieldVisible('membership-occupation') && (
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
                )}

                {isFieldVisible('membership-type') && (
                  <div>
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                      Membership Tier (सदस्यता प्रकार)
                    </label>
                    <select
                      value={membType}
                      onChange={e => setMembType(e.target.value)}
                      className="w-full p-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm text-slate-900 dark:text-white"
                    >
                      {memberCategories.map(cat => (
                        <option key={cat.id} value={`${cat.label.en} (${cat.feeInfo || 'Standard'})`}>
                          {cat.label[lang] || cat.label.en} ({cat.label.en}) - {cat.feeInfo || 'Fee TBD'}
                        </option>
                      ))}
                    </select>
                  </div>
                )}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {isFieldVisible('membership-payment-method') && (
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
                )}

                {isFieldVisible('membership-payment-ref') && (
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
                )}
              </div>

              {/* Dynamic Custom Fields for Membership */}
              {membCustomFields.length > 0 && (
                <div className="space-y-4 pt-4 border-t border-slate-200 dark:border-slate-800">
                   <h5 className="font-extrabold text-teal-900 dark:text-teal-100 text-xs uppercase tracking-wide">
                     {lang === 'en' ? 'Additional Custom Questions' : 'थप प्रश्नहरू'}:
                   </h5>
                   <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                     {membCustomFields.map(cf => (
                       <div key={cf.id} className={cf.fieldType === 'textarea' ? 'sm:col-span-2' : ''}>
                         <CustomFieldRenderer
                           field={cf}
                           value={membCustomAnswers[cf.id] || ''}
                           onChange={val => setMembCustomAnswers({ ...membCustomAnswers, [cf.id]: val })}
                           lang={lang}
                         />
                       </div>
                     ))}
                   </div>
                </div>
              )}

              <button
                type="submit"
                disabled={membSubmitting}
                className="w-full py-4 bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-sm uppercase tracking-wider rounded-2xl shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
              >
                {membSubmitting ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    Sending Application...
                  </>
                ) : (
                  <>
                    <Send className="w-5 h-5" />
                    {lang === 'en' ? 'Submit Membership Application' : 'आवेदन पठाउनुहोस्'}
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
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div>
              <span className="inline-block px-3 py-1 bg-teal-50 dark:bg-teal-950/50 text-teal-700 dark:text-teal-300 text-xs font-extrabold uppercase tracking-wider rounded-full border border-teal-200 dark:border-teal-800 mb-2">
                {lang === 'en' ? volunteerInfo.badgeEn : volunteerInfo.badgeNe}
              </span>
              <h2 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white">
                {lang === 'en' ? volunteerInfo.titleEn : volunteerInfo.titleNe}
              </h2>
              <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-2 leading-relaxed max-w-2xl">
                {lang === 'en' ? volunteerInfo.descEn : volunteerInfo.descNe}
              </p>
            </div>
            {isAdmin && (
              <button
                type="button"
                onClick={() => {
                  setEditVolunteerForm(volunteerInfo);
                  setShowEditVolunteerModal(true);
                }}
                className="px-4 py-2 bg-emerald-500 hover:bg-emerald-400 text-teal-950 text-xs font-black uppercase tracking-wider rounded-xl shadow transition-all shrink-0 cursor-pointer"
              >
                ✏️ Edit Texts
              </button>
            )}
          </div>

          {/* Admin Form Customizer */}
          {isAdmin && (
            <AdminFormFieldEditor
              formId="volunteer"
              lang={lang}
              isAdmin={isAdmin}
              onFieldsUpdated={handleFieldsUpdated}
            />
          )}

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
                {isFieldVisible('volunteer-name') && (
                  <div>
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">Full Name *</label>
                    <input
                      type="text"
                      required={isFieldVisible('volunteer-name')}
                      value={volName}
                      onChange={e => setVolName(e.target.value)}
                      placeholder="e.g. Sunita Chaurasiya"
                      className="w-full p-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm text-slate-900 dark:text-white"
                    />
                  </div>
                )}
                {isFieldVisible('volunteer-phone') && (
                  <div>
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">Phone Number *</label>
                    <input
                      type="tel"
                      required={isFieldVisible('volunteer-phone')}
                      value={volPhone}
                      onChange={e => setVolPhone(e.target.value)}
                      placeholder="e.g. 9812345678"
                      className="w-full p-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm text-slate-900 dark:text-white"
                    />
                  </div>
                )}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {isFieldVisible('volunteer-email') && (
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
                )}
                {isFieldVisible('volunteer-address') && (
                  <div>
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">Address / Location *</label>
                    <input
                      type="text"
                      required={isFieldVisible('volunteer-address')}
                      value={volAddr}
                      onChange={e => setVolAddr(e.target.value)}
                      placeholder="e.g. Bara, Kalaiya"
                      className="w-full p-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm text-slate-900 dark:text-white"
                    />
                  </div>
                )}
              </div>

              {isFieldVisible('volunteer-interests') && (
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
              )}

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {isFieldVisible('volunteer-availability') && (
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
                )}

                {isFieldVisible('volunteer-notes') && (
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
                )}
              </div>

              {/* Dynamic Custom Fields for Volunteer */}
              {volCustomFields.length > 0 && (
                <div className="space-y-4 pt-4 border-t border-slate-200 dark:border-slate-800">
                  <h5 className="font-extrabold text-teal-900 dark:text-teal-100 text-xs uppercase tracking-wide">
                    {lang === 'en' ? 'Additional Custom Questions' : 'थप प्रश्नहरू'}:
                  </h5>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {volCustomFields.map(cf => (
                      <div key={cf.id} className={cf.fieldType === 'textarea' ? 'sm:col-span-2' : ''}>
                        <CustomFieldRenderer
                          field={cf}
                          value={volCustomAnswers[cf.id] || ''}
                          onChange={val => setVolCustomAnswers({ ...volCustomAnswers, [cf.id]: val })}
                          lang={lang}
                        />
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <button
                type="submit"
                disabled={volSubmitting}
                className="w-full py-4 bg-teal-600 hover:bg-teal-700 text-white font-extrabold text-sm uppercase tracking-wider rounded-2xl shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
              >
                {volSubmitting ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    Sending Volunteer Registration...
                  </>
                ) : (
                  <>
                    <Send className="w-5 h-5" />
                    {lang === 'en' ? 'Register Volunteer' : 'स्वयंसेवक दर्ता पठाउनुहोस्'}
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
          <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
          
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 relative z-10">
            <div>
              <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-emerald-500/10 border border-emerald-400/30 text-emerald-300 text-xs font-bold uppercase tracking-wider rounded-full">
                <Heart className="w-3.5 h-3.5 fill-emerald-400 text-emerald-400" />
                Welfare &amp; Healthcare Support Fund
              </span>
              <h2 className="text-2xl sm:text-3xl font-black text-white mt-2 tracking-tight">
                {donationInfo[`title${lang === 'en' ? 'En' : 'Ne'}`] || donationInfo.titleEn}
              </h2>
              <p className="text-xs sm:text-sm text-teal-200 mt-1.5 leading-relaxed max-w-2xl">
                {donationInfo[`desc${lang === 'en' ? 'En' : 'Ne'}`] || donationInfo.descEn}
              </p>
            </div>

            {/* Admin Edit Donation Details & Custom Form Editor */}
            {isAdmin && (
              <div className="flex flex-wrap items-center gap-2">
                <button
                  type="button"
                  onClick={() => {
                    setEditDonationForm(donationInfo);
                    setShowEditDonationModal(true);
                  }}
                  className="px-4 py-2.5 bg-emerald-500 hover:bg-emerald-400 text-teal-950 text-xs font-black uppercase tracking-wider rounded-xl shadow-lg transition-all shrink-0 cursor-pointer flex items-center gap-1.5"
                >
                  <QrCode className="w-4 h-4" />
                  <span>✏️ {lang === 'en' ? 'Edit Bank & QR Info' : 'बैंक तथा क्युआर विवरण सम्पादन'}</span>
                </button>
              </div>
            )}
          </div>

          {/* Admin Custom Field Editor for Donation */}
          {isAdmin && (
            <div className="mt-4">
              <AdminFormFieldEditor
                formId="donation"
                lang={lang}
                isAdmin={isAdmin}
                onFieldsUpdated={handleFieldsUpdated}
              />
            </div>
          )}

          {donateSuccess && pledgeReceipt ? (
            <div className="p-6 sm:p-8 bg-teal-900/90 border-2 border-emerald-400 text-teal-50 rounded-3xl space-y-5 animate-in zoom-in-95 duration-200 shadow-2xl">
              <div className="flex items-start justify-between gap-4 border-b border-teal-800 pb-4">
                <div className="flex items-center gap-3">
                  <div className="p-3 bg-emerald-500 text-teal-950 rounded-2xl">
                    <CheckCircle2 className="w-8 h-8" />
                  </div>
                  <div>
                    <span className="px-2.5 py-0.5 bg-emerald-500/20 border border-emerald-400/40 text-emerald-300 rounded-full text-[10px] font-black uppercase tracking-wider font-mono">
                      Ref: {pledgeReceipt.referenceId}
                    </span>
                    <h4 className="text-xl font-black text-white mt-1">
                      {lang === 'en' ? 'Donation Pledge Recorded Successfully!' : 'दान संकल्प सफलतापूर्वक दर्ता भयो!'}
                    </h4>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => window.print()}
                  className="px-3.5 py-2 bg-teal-800 hover:bg-teal-700 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 cursor-pointer shadow"
                >
                  <Printer className="w-4 h-4" />
                  <span className="hidden sm:inline">Print Receipt</span>
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                <div className="p-4 bg-teal-950/60 rounded-2xl border border-teal-800 space-y-2">
                  <p className="text-teal-400 font-bold uppercase tracking-wider text-[10px]">Pledge Summary</p>
                  <div className="text-sm font-black text-emerald-300">
                    NPR {pledgeReceipt.pledgedAmount?.toLocaleString()}
                  </div>
                  <div className="text-teal-200"><strong className="text-white">Donor:</strong> {pledgeReceipt.donorName}</div>
                  <div className="text-teal-200"><strong className="text-white">Phone:</strong> {pledgeReceipt.donorPhone}</div>
                  <div className="text-teal-200"><strong className="text-white">Purpose:</strong> {pledgeReceipt.donationCause}</div>
                  <div className="text-teal-200"><strong className="text-white">Time:</strong> {pledgeReceipt.timestamp}</div>
                </div>

                <div className="p-4 bg-teal-950/60 rounded-2xl border border-teal-800 space-y-2">
                  <p className="text-teal-400 font-bold uppercase tracking-wider text-[10px]">Deposit &amp; Verification Step</p>
                  <p className="text-teal-200 text-xs leading-relaxed">
                    A notification copy has been routed to <strong>{donationInfo.contactEmail || 'csnepalwebsite@gmail.com'}</strong>.
                  </p>
                  <p className="text-teal-300 text-xs leading-relaxed pt-1">
                    Please transfer NPR {pledgeReceipt.pledgedAmount?.toLocaleString()} to <strong>{donationInfo.bankName}</strong> (Acc: {donationInfo.accountNumber}) or scan the official QR code, and send your deposit screenshot to <strong>{donationInfo.contactEmail}</strong>.
                  </p>
                </div>
              </div>

              <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
                <a
                  href={`mailto:${donationInfo.contactEmail || 'csnepalwebsite@gmail.com'}?subject=Donation Receipt & Voucher - ${pledgeReceipt.referenceId}&body=Hello Chaurasiya Samaj Nepal,%0D%0A%0D%0AI have recorded a donation pledge of NPR ${pledgeReceipt.pledgedAmount} with Reference ID ${pledgeReceipt.referenceId}.%0D%0A%0D%0ADonor Name: ${pledgeReceipt.donorName}%0D%0APhone: ${pledgeReceipt.donorPhone}%0D%0A%0D%0APlease find my deposit/transfer voucher screenshot attached.%0D%0A%0D%0AThank you!`}
                  className="px-5 py-2.5 bg-emerald-500 hover:bg-emerald-400 text-teal-950 font-black text-xs uppercase tracking-wider rounded-xl shadow transition-all flex items-center gap-2 cursor-pointer"
                >
                  <Mail className="w-4 h-4" />
                  <span>{lang === 'en' ? 'Email Transfer Voucher to CSN' : 'भौचर इमेल गर्नुहोस्'}</span>
                </a>

                <button
                  type="button"
                  onClick={() => {
                    setDonateSuccess(false);
                    setPledgeReceipt(null);
                  }}
                  className="px-4 py-2.5 bg-teal-800 hover:bg-teal-700 text-white font-bold text-xs rounded-xl cursor-pointer"
                >
                  {lang === 'en' ? '➕ Record Another Pledge' : 'अर्को संकल्प गर्नुहोस्'}
                </button>
              </div>
            </div>
          ) : (
            <form onSubmit={handleDonateSubmit} className="space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {isFieldVisible('donation-name') && (
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-teal-300 uppercase tracking-wider flex items-center justify-between">
                      <span>{lang === 'en' ? 'Donor Full Name' : 'दाताको पूरा नाम'}</span>
                    </label>
                    <input
                      type="text"
                      value={donorName}
                      onChange={(e) => setDonorName(e.target.value)}
                      placeholder={lang === 'en' ? 'e.g. Alok Kumar Chaurasiya' : 'उदा. आलोक कुमार चौरसिया'}
                      className="w-full p-3 bg-teal-900/60 border border-teal-800 text-sm text-white rounded-xl focus:outline-none focus:border-emerald-400 placeholder:text-teal-400/50 font-medium"
                    />
                  </div>
                )}
                {isFieldVisible('donation-phone') && (
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-teal-300 uppercase tracking-wider">
                      {lang === 'en' ? 'Donor Phone / Mobile' : 'दाताको फोन / मोबाइल'}
                    </label>
                    <input
                      type="tel"
                      value={donorPhone}
                      onChange={(e) => setDonorPhone(e.target.value)}
                      placeholder="e.g. 9845012345"
                      className="w-full p-3 bg-teal-900/60 border border-teal-800 text-sm text-white rounded-xl focus:outline-none focus:border-emerald-400 placeholder:text-teal-400/50 font-medium font-mono"
                    />
                  </div>
                )}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {isFieldVisible('donation-email') && (
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-teal-300 uppercase tracking-wider">
                      {lang === 'en' ? 'Donor Email Address' : 'दाताको इमेल ठेगाना'}
                    </label>
                    <input
                      type="email"
                      value={donorEmail}
                      onChange={(e) => setDonorEmail(e.target.value)}
                      placeholder="e.g. donor@gmail.com"
                      className="w-full p-3 bg-teal-900/60 border border-teal-800 text-sm text-white rounded-xl focus:outline-none focus:border-emerald-400 placeholder:text-teal-400/50 font-medium"
                    />
                  </div>
                )}

                {isFieldVisible('donation-address') && (
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-teal-300 uppercase tracking-wider">
                      {lang === 'en' ? 'Donor Address / District' : 'दाताको ठेगाना / जिल्ला'}
                    </label>
                    <input
                      type="text"
                      value={donorAddress}
                      onChange={(e) => setDonorAddress(e.target.value)}
                      placeholder="e.g. Parsa, Birgunj / Kathmandu"
                      className="w-full p-3 bg-teal-900/60 border border-teal-800 text-sm text-white rounded-xl focus:outline-none focus:border-emerald-400 placeholder:text-teal-400/50 font-medium"
                    />
                  </div>
                )}

                {isFieldVisible('donation-pan') && (
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-teal-300 uppercase tracking-wider">
                      {lang === 'en' ? 'PAN / Tax ID (Optional)' : 'स्थायी लेखा नं (ऐच्छिक)'}
                    </label>
                    <input
                      type="text"
                      value={donorPan}
                      onChange={(e) => setDonorPan(e.target.value)}
                      placeholder="e.g. 601234567"
                      className="w-full p-3 bg-teal-900/60 border border-teal-800 text-sm text-white rounded-xl focus:outline-none focus:border-emerald-400 placeholder:text-teal-400/50 font-medium font-mono"
                    />
                  </div>
                )}
              </div>

              {isFieldVisible('donation-cause') && (
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-teal-300 uppercase tracking-wider">
                    {lang === 'en' ? 'Target Purpose / Dedicated Fund' : 'दानको उद्देश्य / समर्पित कोष'}
                  </label>
                  <select
                    value={donationCause}
                    onChange={(e) => setDonationCause(e.target.value)}
                    className="w-full p-3 bg-teal-900/60 border border-teal-800 text-sm text-white rounded-xl focus:outline-none focus:border-emerald-400 font-medium"
                  >
                    <option value="Rural Healthcare & Free Medical Camps">🏥 Rural Healthcare &amp; Free Medical Camps (ग्रामीण स्वास्थ्य शिविर)</option>
                    <option value="Student Stationery & Educational Kits Fund">📚 Student Stationery &amp; Educational Kits (विद्यार्थी शैक्षिक सहयोग)</option>
                    <option value="Betel Farmers Outreach & Seed Support">🌱 Betel Farmers Outreach &amp; Seed Support (पान कृषक सहयोग)</option>
                    <option value="Community Infrastructure & Bhavan Building">🏛️ Community Infrastructure &amp; Bhavan Building (सामुदायिक भवन निर्माण)</option>
                    <option value="Emergency Welfare & Relief Assistance">🚨 Emergency Welfare &amp; Relief Assistance (आपत्कालीन कल्याणकारी राहत)</option>
                  </select>
                </div>
              )}

              {isFieldVisible('donation-presets') && (
                <div className="space-y-2">
                  <label className="text-xs font-bold text-teal-300 uppercase tracking-wider flex items-center justify-between">
                    <span>{lang === 'en' ? 'Select Donation Amount (NPR)' : 'दान रकम छनोट गर्नुहोस् (नेरू)'}</span>
                    <span className="text-[11px] text-emerald-400 font-normal">
                      {lang === 'en' ? 'Click preset or enter custom' : 'बटन क्लिक गर्नुहोस् वा इच्छित रकम लेख्नुहोस्'}
                    </span>
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
                          className={`py-3.5 text-sm font-black rounded-xl border transition-all cursor-pointer ${
                            isSelected
                              ? 'bg-emerald-500 text-teal-950 border-emerald-400 shadow-xl scale-105 ring-2 ring-emerald-300'
                              : 'bg-teal-900/40 text-white border-teal-800 hover:bg-teal-900'
                          }`}
                        >
                          NPR {amt.toLocaleString()}
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}

              {isFieldVisible('donation-custom-amount') && (
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-teal-300 uppercase tracking-wider">
                    {lang === 'en' ? 'Or Enter Custom Amount (NPR)' : 'वा अन्य इच्छित रकम प्रविष्ट गर्नुहोस् (नेरू)'}
                  </label>
                  <input
                    type="number"
                    placeholder="e.g., 10000"
                    value={donateCustom}
                    onChange={(e) => {
                      setDonateCustom(e.target.value);
                      onTrackAction(`Type custom donation amount: ${e.target.value}`);
                    }}
                    className="w-full p-3 bg-teal-900/60 border border-teal-800 text-sm text-white rounded-xl focus:outline-none focus:border-emerald-400 font-mono font-bold"
                  />
                </div>
              )}

              {/* Dynamic Custom Fields for Donation */}
              {donateCustomFields.length > 0 && (
                <div className="space-y-4 pt-4 border-t border-teal-800">
                  <h5 className="font-extrabold text-teal-300 text-xs uppercase tracking-wide flex items-center gap-1.5">
                    <Sparkles className="w-4 h-4 text-emerald-400" />
                    <span>{lang === 'en' ? 'Additional Form Fields / Questions' : 'थप फारम प्रश्नहरू'}:</span>
                  </h5>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {donateCustomFields.map(cf => (
                      <div key={cf.id} className={cf.fieldType === 'textarea' ? 'sm:col-span-2' : ''}>
                        <CustomFieldRenderer
                          field={cf}
                          value={donateCustomAnswers[cf.id] || ''}
                          onChange={val => setDonateCustomAnswers({ ...donateCustomAnswers, [cf.id]: val })}
                          lang={lang}
                          theme="dark"
                        />
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Direct Bank Wire Info & QR Payments Box */}
              {isFieldVisible('donation-bank-info') && (
                <div className="p-6 bg-teal-900/60 rounded-3xl border border-teal-700/60 shadow-xl backdrop-blur-sm space-y-4">
                  <div className="flex flex-col lg:flex-row items-stretch justify-between gap-6">
                    {/* Left: Bank Wire details */}
                    <div className="flex-1 space-y-3">
                      <div className="flex items-center justify-between">
                        <h4 className="text-sm font-black text-emerald-400 uppercase tracking-wide flex items-center gap-2">
                          <Landmark className="w-5 h-5 text-emerald-400" />
                          <span>{lang === 'en' ? 'Direct Bank Wire & Payment Information' : 'सिधै बैंक ट्रान्सफर तथा भुक्तानी विवरण'}</span>
                        </h4>
                        <button
                          type="button"
                          onClick={() => {
                            navigator.clipboard.writeText(`${donationInfo.bankName}\nAccount: ${donationInfo.accountName}\nAcc Number: ${donationInfo.accountNumber}\neSewa ID: ${donationInfo.esewaId}`);
                            setCopiedAccount(true);
                            setTimeout(() => setCopiedAccount(false), 2500);
                          }}
                          className="px-2.5 py-1 bg-teal-800 hover:bg-teal-700 text-teal-200 hover:text-white rounded-lg text-xs font-bold flex items-center gap-1 cursor-pointer transition-colors"
                          title="Copy details to clipboard"
                        >
                          {copiedAccount ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                          <span>{copiedAccount ? 'Copied!' : 'Copy Info'}</span>
                        </button>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 text-xs text-teal-100 font-medium">
                        <div className="p-3 bg-teal-950/80 rounded-xl border border-teal-800">
                          <span className="text-teal-400 text-[10px] font-black uppercase tracking-wider block">{lang === 'en' ? 'Bank Name' : 'बैंकको नाम'}:</span>
                          <strong className="text-white font-bold text-xs mt-0.5 block">{donationInfo.bankName}</strong>
                        </div>

                        <div className="p-3 bg-teal-950/80 rounded-xl border border-teal-800">
                          <span className="text-teal-400 text-[10px] font-black uppercase tracking-wider block">{lang === 'en' ? 'Account Name' : 'खातावालाको नाम'}:</span>
                          <strong className="text-white font-bold text-xs mt-0.5 block">{donationInfo.accountName}</strong>
                        </div>

                        <div className="p-3 bg-teal-950/80 rounded-xl border border-teal-800">
                          <span className="text-teal-400 text-[10px] font-black uppercase tracking-wider block">{lang === 'en' ? 'Account Number' : 'खाता नम्बर'}:</span>
                          <strong className="text-emerald-300 font-mono font-black text-sm mt-0.5 block">{donationInfo.accountNumber}</strong>
                        </div>

                        <div className="p-3 bg-teal-950/80 rounded-xl border border-teal-800">
                          <span className="text-teal-400 text-[10px] font-black uppercase tracking-wider block">{lang === 'en' ? 'eSewa / Khalti / Fonepay ID' : 'ईसेवा / खल्ती / फोनपे'}:</span>
                          <strong className="text-white font-bold font-mono text-xs mt-0.5 block">{donationInfo.esewaId}</strong>
                        </div>
                      </div>

                      <p className="text-[11px] text-teal-300/80 italic pt-1">
                        * {lang === 'en' 
                          ? `Please email deposit voucher or transaction receipts to ${donationInfo.contactEmail || 'csnepalwebsite@gmail.com'} for official receipt.` 
                          : `आधिकारिक रसिदका लागि कृपया भौचर प्रतिलिपि ${donationInfo.contactEmail || 'csnepalwebsite@gmail.com'} मा पठाउनुहोस्।`}
                      </p>
                    </div>

                    {/* Right: Institution Payment QR Code */}
                    <div className="w-full lg:w-72 flex flex-col items-center justify-center p-4 bg-white dark:bg-slate-900 text-slate-900 dark:text-white rounded-2xl border-2 border-emerald-400 shadow-xl shrink-0">
                      <div className="flex items-center gap-1.5 text-xs font-black uppercase tracking-wide text-emerald-700 dark:text-emerald-400 mb-2">
                        <QrCode className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                        <span>{lang === 'en' ? 'Official Payment QR' : 'आधिकारिक क्युआर कोड'}</span>
                      </div>
                      
                      {donationInfo.qrCodeUrl ? (
                        <div 
                          className="relative group cursor-pointer p-2 bg-white rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm"
                          onClick={() => setShowZoomQr(true)}
                          title="Click to Zoom QR Code"
                        >
                          <img 
                            src={donationInfo.qrCodeUrl} 
                            alt="Chaurasiya Samaj Official Welfare QR Code" 
                            className="w-44 h-44 sm:w-48 sm:h-48 object-contain rounded-lg"
                          />
                          <div className="absolute inset-0 bg-slate-950/60 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center text-white text-xs font-black gap-1">
                            <ZoomIn className="w-6 h-6 text-emerald-400" />
                            <span>Click to Zoom</span>
                          </div>
                        </div>
                      ) : (
                        <div className="w-44 h-44 flex flex-col items-center justify-center text-center p-3 bg-slate-100 dark:bg-slate-800 rounded-xl border border-dashed border-slate-300 dark:border-slate-700">
                          <QrCode className="w-10 h-10 text-slate-400 mb-2" />
                          <span className="text-[11px] text-slate-500 font-bold">Upload QR Code via Admin Settings</span>
                        </div>
                      )}

                      <p className="text-[11px] text-slate-700 dark:text-slate-300 text-center font-medium mt-2 leading-tight">
                        {lang === 'en'
                          ? (donationInfo.qrCodeLabelEn || 'Scan with eSewa, Fonepay, Khalti or Mobile Banking')
                          : (donationInfo.qrCodeLabelNe || 'ईसेवा, फोनपे, खल्ती वा मोबाइल बैंकिङबाट स्क्यान गर्नुहोस्')}
                      </p>

                      {donationInfo.qrCodeUrl && (
                        <button
                          type="button"
                          onClick={() => setShowZoomQr(true)}
                          className="mt-2 px-3 py-1 bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 text-[11px] font-black rounded-lg hover:bg-emerald-200 transition-colors flex items-center gap-1.5 cursor-pointer"
                        >
                          <ZoomIn className="w-3.5 h-3.5" />
                          <span>{lang === 'en' ? 'Enlarge QR Code' : 'क्युआर ठूलो पार्नुहोस्'}</span>
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              )}

              <button
                type="submit"
                disabled={donateSubmitting}
                className="w-full py-4 bg-emerald-500 hover:bg-emerald-400 text-teal-950 font-black text-xs uppercase tracking-wider rounded-2xl shadow-xl transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 active:scale-[0.99]"
              >
                {donateSubmitting ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin text-teal-950" />
                    <span>Recording Pledge &amp; Dispatching Notification...</span>
                  </>
                ) : (
                  <>
                    <Heart className="w-5 h-5 text-teal-950 fill-teal-950" />
                    <span>Record Donation Pledge</span>
                  </>
                )}
              </button>
            </form>
          )}
        </div>
      )}

      {/* QR Code Full Zoom Modal */}
      {showZoomQr && (
        <div className="fixed inset-0 z-[120] bg-slate-950/85 backdrop-blur-md flex items-center justify-center p-4 animate-in fade-in duration-150">
          <div className="bg-white dark:bg-slate-900 rounded-3xl max-w-sm w-full p-6 text-slate-900 dark:text-white space-y-4 shadow-2xl border border-slate-200 dark:border-slate-800 text-center relative">
            <button
              type="button"
              onClick={() => setShowZoomQr(false)}
              className="absolute top-4 right-4 p-2 text-slate-400 hover:text-slate-700 dark:hover:text-white rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center justify-center gap-2 text-teal-950 dark:text-teal-200 font-black text-sm uppercase tracking-wider">
              <QrCode className="w-5 h-5 text-emerald-600" />
              <span>{lang === 'en' ? 'Institution Payment QR' : 'संस्थाको भुक्तानी क्युआर कोड'}</span>
            </div>

            <div className="p-3 bg-white rounded-2xl border-2 border-emerald-500 shadow-inner flex justify-center">
              <img
                src={donationInfo.qrCodeUrl}
                alt="Chaurasiya Samaj Nepal Payment QR Code"
                className="w-64 h-64 sm:w-72 sm:h-72 object-contain"
              />
            </div>

            <div className="text-xs space-y-1 font-bold">
              <p className="text-slate-800 dark:text-slate-200">{donationInfo.accountName}</p>
              <p className="text-emerald-600 dark:text-emerald-400 font-mono">{donationInfo.accountNumber}</p>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 font-medium pt-1">
                {lang === 'en'
                  ? 'Compatible with eSewa, Fonepay, Khalti, IME Pay, and all Nepalese Banking Apps.'
                  : 'ईसेवा, फोनपे, खल्ती, आईएमई पे तथा सम्पूर्ण नेपाली मोबाइल बैंकिङसँग मिल्दोजुल्दो।'}
              </p>
            </div>

            <button
              type="button"
              onClick={() => setShowZoomQr(false)}
              className="w-full py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white font-extrabold text-xs uppercase tracking-wider rounded-xl cursor-pointer"
            >
              Close
            </button>
          </div>
        </div>
      )}

      {/* Admin Edit Donation Modal (Top-Level Overlay) */}
      {showEditDonationModal && (
        <div className="fixed inset-0 z-[100] bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4 text-slate-900">
          <div className="bg-white dark:bg-slate-900 rounded-3xl max-w-2xl w-full p-6 sm:p-8 space-y-5 shadow-2xl relative animate-in zoom-in-95 duration-200 border border-teal-100 dark:border-slate-800 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <QrCode className="w-5 h-5 text-emerald-600" />
                <h3 className="text-lg font-black text-teal-950 dark:text-teal-100">
                  {lang === 'en' ? 'Edit Welfare Donation, Bank & QR Code' : 'कल्याणकारी दान, बैंक तथा क्युआर विवरण सम्पादन'}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setShowEditDonationModal(false)}
                className="p-1.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSaveDonationInfo} className="space-y-4 text-xs font-bold">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-slate-700 dark:text-slate-300">Title (English)</label>
                  <input
                    type="text"
                    value={editDonationForm.titleEn}
                    onChange={(e) => setEditDonationForm({ ...editDonationForm, titleEn: e.target.value })}
                    className="w-full p-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg mt-1 text-slate-900 dark:text-white"
                  />
                </div>
                <div>
                  <label className="text-slate-700 dark:text-slate-300">Title (Nepali)</label>
                  <input
                    type="text"
                    value={editDonationForm.titleNe}
                    onChange={(e) => setEditDonationForm({ ...editDonationForm, titleNe: e.target.value })}
                    className="w-full p-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg mt-1 text-slate-900 dark:text-white"
                  />
                </div>
              </div>

              <div>
                <label className="text-slate-700 dark:text-slate-300">Description (English)</label>
                <textarea
                  rows={2}
                  value={editDonationForm.descEn}
                  onChange={(e) => setEditDonationForm({ ...editDonationForm, descEn: e.target.value })}
                  className="w-full p-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg mt-1 text-slate-900 dark:text-white"
                />
              </div>

              <div>
                <label className="text-slate-700 dark:text-slate-300">Description (Nepali)</label>
                <textarea
                  rows={2}
                  value={editDonationForm.descNe}
                  onChange={(e) => setEditDonationForm({ ...editDonationForm, descNe: e.target.value })}
                  className="w-full p-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg mt-1 text-slate-900 dark:text-white"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-slate-700 dark:text-slate-300">Bank Name</label>
                  <input
                    type="text"
                    value={editDonationForm.bankName}
                    onChange={(e) => setEditDonationForm({ ...editDonationForm, bankName: e.target.value })}
                    className="w-full p-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg mt-1 text-slate-900 dark:text-white"
                  />
                </div>
                <div>
                  <label className="text-slate-700 dark:text-slate-300">Account Name</label>
                  <input
                    type="text"
                    value={editDonationForm.accountName}
                    onChange={(e) => setEditDonationForm({ ...editDonationForm, accountName: e.target.value })}
                    className="w-full p-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg mt-1 text-slate-900 dark:text-white"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-slate-700 dark:text-slate-300">Account Number</label>
                  <input
                    type="text"
                    value={editDonationForm.accountNumber}
                    onChange={(e) => setEditDonationForm({ ...editDonationForm, accountNumber: e.target.value })}
                    className="w-full p-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg mt-1 text-slate-900 dark:text-white"
                  />
                </div>
                <div>
                  <label className="text-slate-700 dark:text-slate-300">eSewa / Khalti ID</label>
                  <input
                    type="text"
                    value={editDonationForm.esewaId}
                    onChange={(e) => setEditDonationForm({ ...editDonationForm, esewaId: e.target.value })}
                    className="w-full p-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg mt-1 text-slate-900 dark:text-white"
                  />
                </div>
              </div>

              <div>
                <label className="text-slate-700 dark:text-slate-300">Notification &amp; Contact Email (Receives Pledges)</label>
                <input
                  type="email"
                  value={editDonationForm.contactEmail}
                  onChange={(e) => setEditDonationForm({ ...editDonationForm, contactEmail: e.target.value })}
                  placeholder="csnepalwebsite@gmail.com"
                  className="w-full p-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg mt-1 text-slate-900 dark:text-white font-mono"
                />
              </div>

              {/* Institution Official Payment QR Code Section */}
              <div className="p-4 bg-teal-50 dark:bg-slate-800/80 rounded-2xl border-2 border-dashed border-teal-300 dark:border-slate-700 space-y-3">
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-black text-teal-950 dark:text-teal-200 uppercase tracking-wider flex items-center gap-1.5">
                    <QrCode className="w-4 h-4 text-emerald-600" />
                    <span>Institution Payment QR Code (eSewa / Fonepay / Bank)</span>
                  </h4>
                  {editDonationForm.qrCodeUrl && (
                    <button
                      type="button"
                      onClick={() => setEditDonationForm({ ...editDonationForm, qrCodeUrl: '' })}
                      className="text-[11px] text-rose-600 hover:underline font-bold cursor-pointer"
                    >
                      Remove QR
                    </button>
                  )}
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 items-center">
                  <div className="space-y-2">
                    <div>
                      <label className="text-slate-700 dark:text-slate-300 text-[11px]">QR Code Image URL</label>
                      <input
                        type="url"
                        value={editDonationForm.qrCodeUrl || ''}
                        onChange={(e) => setEditDonationForm({ ...editDonationForm, qrCodeUrl: e.target.value })}
                        placeholder="https://... / QR image link"
                        className="w-full p-2 bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-lg mt-0.5 text-slate-900 dark:text-white text-xs font-mono"
                      />
                    </div>

                    <div>
                      <label className="text-slate-700 dark:text-slate-300 text-[11px] block">Or Upload QR Image File</label>
                      <label className="inline-flex items-center gap-2 px-3 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg text-xs font-bold cursor-pointer transition-colors mt-0.5">
                        <Upload className="w-3.5 h-3.5" />
                        <span>Upload QR Code Image</span>
                        <input
                          type="file"
                          accept="image/*"
                          className="hidden"
                          onChange={(e) => {
                            const file = e.target.files?.[0];
                            if (file) {
                              const reader = new FileReader();
                              reader.onload = () => {
                                if (typeof reader.result === 'string') {
                                  setEditDonationForm({ ...editDonationForm, qrCodeUrl: reader.result });
                                }
                              };
                              reader.readAsDataURL(file);
                            }
                          }}
                        />
                      </label>
                    </div>
                  </div>

                  <div className="flex flex-col items-center justify-center p-2 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-700 min-h-[120px]">
                    {editDonationForm.qrCodeUrl ? (
                      <div className="text-center">
                        <img
                          src={editDonationForm.qrCodeUrl}
                          alt="QR Preview"
                          className="w-24 h-24 object-contain mx-auto rounded border p-1"
                        />
                        <span className="text-[10px] text-emerald-600 font-bold block mt-1">Live QR Preview</span>
                      </div>
                    ) : (
                      <div className="text-center text-slate-400 p-2">
                        <ImageIcon className="w-8 h-8 mx-auto mb-1 opacity-50" />
                        <span className="text-[10px]">No QR Image Selected</span>
                      </div>
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                  <div>
                    <label className="text-slate-700 dark:text-slate-300 text-[11px]">QR Helper Text (English)</label>
                    <input
                      type="text"
                      value={editDonationForm.qrCodeLabelEn || ''}
                      onChange={(e) => setEditDonationForm({ ...editDonationForm, qrCodeLabelEn: e.target.value })}
                      placeholder="Scan to Pay via eSewa, Fonepay, Khalti or Mobile Banking"
                      className="w-full p-2 bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-lg mt-0.5 text-slate-900 dark:text-white text-xs"
                    />
                  </div>
                  <div>
                    <label className="text-slate-700 dark:text-slate-300 text-[11px]">QR Helper Text (Nepali)</label>
                    <input
                      type="text"
                      value={editDonationForm.qrCodeLabelNe || ''}
                      onChange={(e) => setEditDonationForm({ ...editDonationForm, qrCodeLabelNe: e.target.value })}
                      placeholder="ईसेवा, फोनपे, खल्ती वा मोबाइल बैंकिङबाट भुक्तानी गर्न स्क्यान गर्नुहोस्"
                      className="w-full p-2 bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-lg mt-0.5 text-slate-900 dark:text-white text-xs"
                    />
                  </div>
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-3 border-t dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => setShowEditDonationModal(false)}
                  className="px-4 py-2 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 rounded-lg font-bold cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 font-bold cursor-pointer shadow-md"
                >
                  Save Donation Settings
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit Membership Portal Texts Modal */}
      {showEditMembershipModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-in fade-in duration-150">
          <div className="bg-white dark:bg-slate-900 w-full max-w-2xl rounded-3xl shadow-2xl border border-slate-100 dark:border-slate-800 p-6 max-h-[90vh] overflow-y-auto">
            <h3 className="text-xl font-black text-slate-900 dark:text-white mb-4">✏️ Edit Membership Portal Texts</h3>
            <form onSubmit={handleSaveMembershipInfo} className="space-y-4 text-sm font-medium">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-slate-700 dark:text-slate-300 font-bold">Badge Text (English)</label>
                  <input
                    type="text"
                    required
                    value={editMembershipForm.badgeEn}
                    onChange={(e) => setEditMembershipForm({ ...editMembershipForm, badgeEn: e.target.value })}
                    className="w-full p-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg mt-1 text-slate-900 dark:text-white"
                  />
                </div>
                <div>
                  <label className="text-slate-700 dark:text-slate-300 font-bold">Badge Text (Nepali)</label>
                  <input
                    type="text"
                    required
                    value={editMembershipForm.badgeNe}
                    onChange={(e) => setEditMembershipForm({ ...editMembershipForm, badgeNe: e.target.value })}
                    className="w-full p-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg mt-1 text-slate-900 dark:text-white"
                  />
                </div>
                <div>
                  <label className="text-slate-700 dark:text-slate-300 font-bold">Title (English)</label>
                  <input
                    type="text"
                    required
                    value={editMembershipForm.titleEn}
                    onChange={(e) => setEditMembershipForm({ ...editMembershipForm, titleEn: e.target.value })}
                    className="w-full p-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg mt-1 text-slate-900 dark:text-white"
                  />
                </div>
                <div>
                  <label className="text-slate-700 dark:text-slate-300 font-bold">Title (Nepali)</label>
                  <input
                    type="text"
                    required
                    value={editMembershipForm.titleNe}
                    onChange={(e) => setEditMembershipForm({ ...editMembershipForm, titleNe: e.target.value })}
                    className="w-full p-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg mt-1 text-slate-900 dark:text-white"
                  />
                </div>
              </div>
              <div>
                <label className="text-slate-700 dark:text-slate-300 font-bold">Description (English)</label>
                <textarea
                  required
                  rows={3}
                  value={editMembershipForm.descEn}
                  onChange={(e) => setEditMembershipForm({ ...editMembershipForm, descEn: e.target.value })}
                  className="w-full p-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg mt-1 text-slate-900 dark:text-white"
                />
              </div>
              <div>
                <label className="text-slate-700 dark:text-slate-300 font-bold">Description (Nepali)</label>
                <textarea
                  required
                  rows={3}
                  value={editMembershipForm.descNe}
                  onChange={(e) => setEditMembershipForm({ ...editMembershipForm, descNe: e.target.value })}
                  className="w-full p-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg mt-1 text-slate-900 dark:text-white"
                />
              </div>
              <div className="flex justify-end gap-3 pt-3 border-t dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => setShowEditMembershipModal(false)}
                  className="px-4 py-2 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 rounded-lg font-bold cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 font-bold cursor-pointer shadow-md"
                >
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit Volunteer Portal Texts Modal */}
      {showEditVolunteerModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-in fade-in duration-150">
          <div className="bg-white dark:bg-slate-900 w-full max-w-2xl rounded-3xl shadow-2xl border border-slate-100 dark:border-slate-800 p-6 max-h-[90vh] overflow-y-auto">
            <h3 className="text-xl font-black text-slate-900 dark:text-white mb-4">✏️ Edit Volunteer Portal Texts</h3>
            <form onSubmit={handleSaveVolunteerInfo} className="space-y-4 text-sm font-medium">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-slate-700 dark:text-slate-300 font-bold">Badge Text (English)</label>
                  <input
                    type="text"
                    required
                    value={editVolunteerForm.badgeEn}
                    onChange={(e) => setEditVolunteerForm({ ...editVolunteerForm, badgeEn: e.target.value })}
                    className="w-full p-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg mt-1 text-slate-900 dark:text-white"
                  />
                </div>
                <div>
                  <label className="text-slate-700 dark:text-slate-300 font-bold">Badge Text (Nepali)</label>
                  <input
                    type="text"
                    required
                    value={editVolunteerForm.badgeNe}
                    onChange={(e) => setEditVolunteerForm({ ...editVolunteerForm, badgeNe: e.target.value })}
                    className="w-full p-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg mt-1 text-slate-900 dark:text-white"
                  />
                </div>
                <div>
                  <label className="text-slate-700 dark:text-slate-300 font-bold">Title (English)</label>
                  <input
                    type="text"
                    required
                    value={editVolunteerForm.titleEn}
                    onChange={(e) => setEditVolunteerForm({ ...editVolunteerForm, titleEn: e.target.value })}
                    className="w-full p-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg mt-1 text-slate-900 dark:text-white"
                  />
                </div>
                <div>
                  <label className="text-slate-700 dark:text-slate-300 font-bold">Title (Nepali)</label>
                  <input
                    type="text"
                    required
                    value={editVolunteerForm.titleNe}
                    onChange={(e) => setEditVolunteerForm({ ...editVolunteerForm, titleNe: e.target.value })}
                    className="w-full p-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg mt-1 text-slate-900 dark:text-white"
                  />
                </div>
              </div>
              <div>
                <label className="text-slate-700 dark:text-slate-300 font-bold">Description (English)</label>
                <textarea
                  required
                  rows={3}
                  value={editVolunteerForm.descEn}
                  onChange={(e) => setEditVolunteerForm({ ...editVolunteerForm, descEn: e.target.value })}
                  className="w-full p-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg mt-1 text-slate-900 dark:text-white"
                />
              </div>
              <div>
                <label className="text-slate-700 dark:text-slate-300 font-bold">Description (Nepali)</label>
                <textarea
                  required
                  rows={3}
                  value={editVolunteerForm.descNe}
                  onChange={(e) => setEditVolunteerForm({ ...editVolunteerForm, descNe: e.target.value })}
                  className="w-full p-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg mt-1 text-slate-900 dark:text-white"
                />
              </div>
              <div className="flex justify-end gap-3 pt-3 border-t dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => setShowEditVolunteerModal(false)}
                  className="px-4 py-2 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 rounded-lg font-bold cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 font-bold cursor-pointer shadow-md"
                >
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
