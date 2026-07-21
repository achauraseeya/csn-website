import React, { useState } from 'react';
import { CreditCard, Landmark, CheckCircle2, Heart, Award, Sparkles, Send } from 'lucide-react';
import { Language } from '../types';

interface MembershipDonationProps {
  lang: Language;
  onAddMember: () => void;
  onAddDonation: (amount: number) => void;
  onTrackAction: (actionName: string) => void;
}

export default function MembershipDonation({
  lang,
  onAddMember,
  onAddDonation,
  onTrackAction,
}: MembershipDonationProps) {
  // Membership Form state
  const [membName, setMembName] = useState('');
  const [membEmail, setMembEmail] = useState('');
  const [membPhone, setMembPhone] = useState('');
  const [membAddr, setMembAddr] = useState('');
  const [membType, setMembType] = useState('new_general');
  const [membTerm, setMembTerm] = useState('1'); // years
  const [membSuccess, setMembSuccess] = useState(false);

  // Donation state
  const [donatePreset, setDonatePreset] = useState<number>(1000);
  const [donateCustom, setDonateCustom] = useState<string>('');
  const [donationMethod, setDonationMethod] = useState<'bank' | 'esewa' | 'khalti'>('bank');
  const [donateSuccess, setDonateSuccess] = useState(false);
  const [donatedAmt, setDonatedAmt] = useState(0);

  const t = {
    title: { en: 'Membership Registration & Renewals', ne: 'सदस्यता दर्ता तथा नवीकरण' },
    subTitle: {
      en: 'Become a certified life member or student member of Chaurasiya Samaj Nepal. Get digital credential access.',
      ne: 'चौरसिया समाज नेपालको प्रमाणित आजीवन सदस्य वा विद्यार्थी सदस्य बन्नुहोस्। डिजिटल प्रमाणपत्र पहुँच प्राप्त गर्नुहोस्।',
    },
    donateTitle: { en: '💝 Support Our Benevolent Welfare Initiatives', ne: 'परोपकारी कल्याणकारी पहलहरूमा सहयोग गर्नुहोस्' },
    donateSub: {
      en: 'Your financial support funds free rural healthcare checkup camps, student stationery kits, and seed support programs.',
      ne: 'तपाईंको आर्थिक सहयोगले ग्रामीण स्वास्थ्य जाँच शिविर, विद्यार्थी शैक्षिक सामग्री र बीउ सहयोग कार्यक्रमहरूमा रकम प्रदान गर्दछ।',
    },
    formName: { en: 'Full Name *', ne: 'पूरा नाम *' },
    formEmail: { en: 'Email Address *', ne: 'इमेल ठेगाना *' },
    formPhone: { en: 'Phone / WhatsApp *', ne: 'फोन / ह्वाट्सएप *' },
    formAddr: { en: 'Location Address *', ne: 'ठेगाना ठेगाना *' },
    formType: { en: 'Membership Category *', ne: 'सदस्यता विधा *' },
    btnSubmitMemb: { en: 'Register & Lodge Credentials', ne: 'दर्ता र प्रमाण पत्र पेस गर्नुहोस्' },
    membSuccessMsg: {
      en: 'Membership registry submitted successfully! Welcome to the Chaurasiya Samaj family.',
      ne: 'सदस्यता दर्ता सफलतापूर्वक बुझाइयो! चौरसिया समाज परिवारमा स्वागत छ।',
    },
    donateAmtLabel: { en: 'Select Donation Amount (NPR)', ne: 'सहयोग रकम चयन गर्नुहोस् (NPR)' },
    customAmt: { en: 'Or Enter Custom Amount (NPR)', ne: 'वा अन्य रकम प्रविष्ट गर्नुहोस् (NPR)' },
    payMethod: { en: 'Choose Support Method', ne: 'भुक्तानी विधि छनौट गर्नुहोस्' },
    btnDonate: { en: 'Complete Secure Transaction', ne: 'सुरक्षित भुक्तानी सम्पन्न गर्नुहोस्' },
    donateSuccessMsg: {
      en: 'A heartfelt thank you! Your donation of NPR {amt} has been recorded. Reference receipt sent.',
      ne: 'हार्दिक धन्यवाद! तपाईंको NPR {amt} को सहयोग रेकर्ड गरिएको छ। सन्दर्भ रसिद पठाइयो।',
    },
    bankDetails: { en: 'Direct Bank Wire Info', ne: 'सिधा बैंक स्थानान्तरण विवरण' },
  };

  const handleMembSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!membName || !membPhone) return;

    onAddMember();
    setMembSuccess(true);
    onTrackAction(`Register Membership: ${membName} (${membType})`);

    setTimeout(() => {
      setMembSuccess(false);
      setMembName('');
      setMembEmail('');
      setMembPhone('');
      setMembAddr('');
      setMembType('new_general');
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

  return (
    <div className="space-y-12 animate-in fade-in duration-300">
      {/* Grid: Left Column (Membership Form), Right Column (Donation Panel) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left: Membership Portal */}
        <div className="lg:col-span-6 bg-white p-6 sm:p-8 rounded-2xl border border-teal-100 shadow-sm space-y-6">
          <div>
            <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-teal-50 text-teal-800 text-xs font-black rounded-full border border-teal-200 uppercase tracking-wide">
              Enrollment &amp; Renewals
            </span>
            <h2 className="text-2xl font-extrabold text-teal-950 mt-2">
              {t.title[lang]}
            </h2>
            <p className="text-xs text-gray-500 mt-1 leading-relaxed">
              {t.subTitle[lang]}
            </p>
          </div>

          {membSuccess ? (
            <div className="p-5 bg-teal-50 border border-teal-300 rounded-xl flex items-start gap-3 text-teal-900 font-semibold text-sm animate-in zoom-in duration-200">
              <CheckCircle2 className="w-5 h-5 text-teal-600 shrink-0 mt-0.5" />
              <div>{t.membSuccessMsg[lang]}</div>
            </div>
          ) : (
            <form onSubmit={handleMembSubmit} className="space-y-4">
              <div className="space-y-1">
                <label className="text-xs font-bold text-gray-700">{t.formName[lang]}</label>
                <input
                  type="text"
                  required
                  value={membName}
                  onChange={(e) => setMembName(e.target.value)}
                  placeholder="e.g., Rajesh Kumar Chaurasiya"
                  className="w-full p-2.5 bg-teal-50/20 border border-teal-150 rounded-xl text-sm focus:outline-none focus:border-teal-500 focus:bg-white text-teal-900"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-gray-700">{t.formPhone[lang]}</label>
                  <input
                    type="tel"
                    required
                    value={membPhone}
                    onChange={(e) => setMembPhone(e.target.value)}
                    placeholder="e.g., +977-98XXXXXXXX"
                    className="w-full p-2.5 bg-teal-50/20 border border-teal-150 rounded-xl text-sm focus:outline-none focus:border-teal-500 focus:bg-white text-teal-900"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-gray-700">{t.formEmail[lang]}</label>
                  <input
                    type="email"
                    required
                    value={membEmail}
                    onChange={(e) => setMembEmail(e.target.value)}
                    placeholder="rajesh@gmail.com"
                    className="w-full p-2.5 bg-teal-50/20 border border-teal-150 rounded-xl text-sm focus:outline-none focus:border-teal-500 focus:bg-white text-teal-900"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-gray-700">{t.formType[lang]}</label>
                  <select
                    value={membType}
                    onChange={(e) => setMembType(e.target.value)}
                    className="w-full p-2.5 bg-white border border-teal-150 rounded-xl text-sm text-teal-900 focus:outline-none focus:border-teal-500"
                  >
                    <option value="new_student">New Student Member (Free / निःशुल्क)</option>
                    <option value="new_general">New General Member (NPR 1,000 / Yr)</option>
                    <option value="renew_general">Membership Renewal (NPR 1,000 / Yr)</option>
                    <option value="life_member">Life Member (NPR 15,000 / One-time)</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-gray-700">Location Address *</label>
                  <input
                    type="text"
                    required
                    value={membAddr}
                    onChange={(e) => setMembAddr(e.target.value)}
                    placeholder="e.g., Birgunj, Parsa"
                    className="w-full p-2.5 bg-teal-50/20 border border-teal-150 rounded-xl text-sm focus:outline-none focus:border-teal-500 focus:bg-white text-teal-900"
                  />
                </div>
              </div>

              <div className="p-4 bg-teal-50/50 rounded-xl border border-teal-100 flex gap-3 text-xs text-teal-900 font-medium leading-relaxed">
                <Sparkles className="w-5 h-5 text-teal-600 shrink-0 mt-0.5" />
                <div>
                  <strong>Membership perks:</strong> Includes digital certificate signed by Chief President, access to exclusive youth startup workshops run by CTO Abhishek Chaurasiya, and family medical assistance schemes.
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-3.5 bg-teal-800 hover:bg-teal-700 text-white text-xs font-extrabold uppercase tracking-wider rounded-xl shadow-md transition-all flex items-center justify-center gap-2"
              >
                <Award className="w-4 h-4 text-teal-300" />
                {t.btnSubmitMemb[lang]}
              </button>
            </form>
          )}
        </div>

        {/* Right: Donation Page */}
        <div className="lg:col-span-6 bg-teal-950 text-white p-6 sm:p-8 rounded-2xl border-b-8 border-emerald-500 shadow-lg space-y-6 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-36 h-36 bg-emerald-500/10 rounded-full blur-3xl" />

          <div>
            <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-emerald-500/10 border border-emerald-400/30 text-emerald-300 text-xs font-bold uppercase tracking-wider rounded-full">
              Welfare Support
            </span>
            <h2 className="text-2xl font-extrabold text-white mt-2">
              {t.donateTitle[lang]}
            </h2>
            <p className="text-xs text-teal-200 mt-1.5 leading-relaxed">
              {t.donateSub[lang]}
            </p>
          </div>

          {donateSuccess ? (
            <div className="p-5 bg-teal-900/90 border border-emerald-500/40 text-emerald-300 rounded-xl flex items-start gap-3 text-sm leading-relaxed font-bold animate-in zoom-in duration-200">
              <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
              <div>{t.donateSuccessMsg[lang].replace('{amt}', donatedAmt.toLocaleString())}</div>
            </div>
          ) : (
            <form onSubmit={handleDonateSubmit} className="space-y-4">
              {/* Presets */}
              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-teal-300 uppercase tracking-wider">
                  {t.donateAmtLabel[lang]}
                </label>
                <div className="grid grid-cols-4 gap-2">
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
                        className={`py-2 text-xs font-black rounded-lg border transition-all ${
                          isSelected
                            ? 'bg-emerald-500 text-teal-950 border-emerald-400 shadow-md'
                            : 'bg-teal-900/40 text-white border-teal-800 hover:bg-teal-900 hover:border-teal-700'
                        }`}
                      >
                        {amt.toLocaleString()}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Custom amount */}
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-teal-300 uppercase tracking-wider">
                  {t.customAmt[lang]}
                </label>
                <input
                  type="number"
                  placeholder="e.g., 10000"
                  value={donateCustom}
                  onChange={(e) => {
                    setDonateCustom(e.target.value);
                    onTrackAction(`Type custom donation amount: ${e.target.value}`);
                  }}
                  className="w-full p-2.5 bg-teal-900/60 border border-teal-800 text-sm text-white rounded-lg focus:outline-none focus:border-emerald-400"
                />
              </div>

              {/* Method toggles */}
              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-teal-300 uppercase tracking-wider">
                  {t.payMethod[lang]}
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {([
                    { id: 'bank', label: 'Bank Transfer' },
                    { id: 'esewa', label: 'eSewa Pay' },
                    { id: 'khalti', label: 'Khalti Pay' },
                  ] as const).map((method) => {
                    const isSelected = donationMethod === method.id;
                    return (
                      <button
                        key={method.id}
                        type="button"
                        onClick={() => {
                          setDonationMethod(method.id);
                          onTrackAction(`Select pay method: ${method.id}`);
                        }}
                        className={`py-2 text-[10px] font-bold rounded-lg border transition-all flex flex-col items-center justify-center gap-1 ${
                          isSelected
                            ? 'bg-emerald-500 text-teal-950 border-emerald-400 shadow-sm'
                            : 'bg-teal-900/40 text-white border-teal-800 hover:bg-teal-900'
                        }`}
                      >
                        {method.id === 'bank' ? (
                          <Landmark className="w-4 h-4" />
                        ) : (
                          <CreditCard className="w-4 h-4" />
                        )}
                        <span>{method.label}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Action */}
              <button
                type="submit"
                className="w-full py-3.5 bg-emerald-500 hover:bg-emerald-400 text-teal-950 font-black text-xs uppercase tracking-wider rounded-xl shadow-md transition-all flex items-center justify-center gap-2"
              >
                <Heart className="w-4 h-4 text-teal-950 fill-teal-950" />
                {t.btnDonate[lang]}
              </button>
            </form>
          )}

          {/* Secure wire details */}
          <div className="p-4 bg-teal-900/50 rounded-xl border border-teal-800 space-y-2">
            <h4 className="text-xs font-bold text-emerald-400 uppercase tracking-wide flex items-center gap-1.5">
              <Landmark className="w-3.5 h-3.5" />
              {t.bankDetails[lang]}
            </h4>
            <div className="text-[10px] space-y-1 text-teal-200/90 leading-relaxed">
              <div><strong className="text-white">Bank:</strong> Global IME Bank Ltd., Birgunj Branch</div>
              <div><strong className="text-white">Account Name:</strong> Chaurasiya Samaj Nepal</div>
              <div><strong className="text-white">Account Number:</strong> 010101005234902 (Welfare Fund)</div>
              <div><strong className="text-white">SWIFT Code:</strong> GIBLNPKA</div>
              <div className="text-[9px] text-teal-400 italic pt-1">
                * Please send a copy of your transaction receipt to <strong>achauraseeya@gmail.com</strong> for audited tax receipts.
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
