import React from 'react';
import { X, Printer, ShieldCheck, Heart, Award, Users, MapPin, Phone, Mail, FileText, CheckCircle2 } from 'lucide-react';
import { MatrimonialProfile, VolunteerApplication, MembershipApplication, Language } from '../types';

interface PrintableApplicationModalProps {
  isOpen: boolean;
  onClose: () => void;
  lang: Language;
  data: {
    type: 'matrimony' | 'volunteer' | 'membership';
    item: MatrimonialProfile | VolunteerApplication | MembershipApplication;
  } | null;
}

export default function PrintableApplicationModal({
  isOpen,
  onClose,
  lang,
  data,
}: PrintableApplicationModalProps) {
  if (!isOpen || !data) return null;

  const { type, item } = data;

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto print:p-0 print:bg-white print:static">
      <div className="bg-white rounded-3xl max-w-3xl w-full border border-slate-200 shadow-2xl overflow-hidden my-6 print:shadow-none print:border-none print:w-full print:max-w-none print:my-0 print:rounded-none">
        
        {/* Top Control Bar (Hidden on Print) */}
        <div className="bg-slate-900 text-white p-4 flex justify-between items-center print:hidden">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-emerald-400" />
            <span className="font-extrabold text-sm">
              Official Document Preview &amp; Printable PDF Generator
            </span>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={handlePrint}
              className="px-4 py-2 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black text-xs uppercase tracking-wider rounded-xl shadow-md transition-all flex items-center gap-2 cursor-pointer"
            >
              <Printer className="w-4 h-4" />
              Print / Save as PDF
            </button>
            <button
              onClick={onClose}
              className="p-1.5 hover:bg-white/10 rounded-full text-gray-300 hover:text-white transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Printable Official Document Body */}
        <div className="p-8 sm:p-12 space-y-8 text-slate-900 bg-white font-sans text-sm print:p-8">
          
          {/* Header Banner */}
          <div className="border-b-4 border-teal-800 pb-6 text-center relative">
            <div className="flex justify-center items-center gap-3 mb-2">
              <div className="w-12 h-12 rounded-full bg-teal-900 text-emerald-400 font-black flex items-center justify-center text-xl border-2 border-emerald-400 shadow-sm">
                CSN
              </div>
              <div className="text-left">
                <h1 className="text-2xl font-black text-teal-950 uppercase tracking-tight">
                  Chaurasiya Samaj Nepal
                </h1>
                <p className="text-xs font-bold text-teal-700">
                  चौरसिया समाज नेपाल • केन्द्रीय सचिवालय (Kathmandu / Birgunj, Nepal)
                </p>
              </div>
            </div>
            
            <p className="text-[11px] text-slate-500 font-semibold mt-1">
              Registered NGO under Government of Nepal • Regd. Ref: CSN-ACT-2024 • Email: csnepalwebsite@gmail.com
            </p>

            <div className="absolute top-0 right-0 hidden sm:block print:block text-right">
              <span className="inline-block px-3 py-1 bg-emerald-50 border border-emerald-300 text-emerald-900 text-[10px] font-black uppercase rounded-md">
                Official Record
              </span>
              <p className="text-[10px] font-mono text-slate-400 mt-1">
                Ref ID: {item.id}
              </p>
            </div>
          </div>

          {/* Form Title & Category */}
          <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 flex justify-between items-center">
            <div>
              <span className="text-[10px] font-black text-teal-700 uppercase tracking-wider block">
                {type === 'matrimony' && 'Matrimonial Matchmaking Candidate Docket'}
                {type === 'volunteer' && 'Community Volunteer Corps Registration Docket'}
                {type === 'membership' && 'Official Society Membership Application Docket'}
              </span>
              <h2 className="text-lg font-black text-slate-900 mt-0.5">
                {type === 'matrimony' && `Candidate: ${(item as MatrimonialProfile).fullName}`}
                {type === 'volunteer' && `Volunteer: ${(item as VolunteerApplication).fullName}`}
                {type === 'membership' && `Applicant: ${(item as MembershipApplication).fullName}`}
              </h2>
            </div>
            <div className="text-right">
              <span className="px-3 py-1 bg-teal-900 text-white font-black text-xs uppercase tracking-wider rounded-lg">
                Date: {item.createdAt}
              </span>
            </div>
          </div>

          {/* Form Fields Table: Matrimony */}
          {type === 'matrimony' && (() => {
            const p = item as MatrimonialProfile;
            return (
              <div className="space-y-6">
                <div className="grid grid-cols-2 gap-4 border border-slate-200 rounded-2xl p-5 bg-white shadow-sm">
                  <div>
                    <span className="text-xs font-bold text-slate-400 uppercase">Candidate Category</span>
                    <p className="text-sm font-black text-teal-900 mt-0.5">
                      {p.lookingFor === 'groom' ? 'Groom / वर (Bridegroom Search)' : 'Bride / वधू (Bride Search)'}
                    </p>
                  </div>
                  <div>
                    <span className="text-xs font-bold text-slate-400 uppercase">Age &amp; Height</span>
                    <p className="text-sm font-black text-slate-900 mt-0.5">{p.age} Years • {p.height}</p>
                  </div>
                  <div>
                    <span className="text-xs font-bold text-slate-400 uppercase">Gotra / Subcaste</span>
                    <p className="text-sm font-bold text-slate-800 mt-0.5">{p.gotraSubcaste || 'Chaurasiya / Kashyap'}</p>
                  </div>
                  <div>
                    <span className="text-xs font-bold text-slate-400 uppercase">Current Location</span>
                    <p className="text-sm font-bold text-slate-800 mt-0.5">{p.currentCityDistrict}</p>
                  </div>
                  <div>
                    <span className="text-xs font-bold text-slate-400 uppercase">Native Place</span>
                    <p className="text-sm font-bold text-slate-800 mt-0.5">{p.nativePlace || 'Not specified'}</p>
                  </div>
                  <div>
                    <span className="text-xs font-bold text-slate-400 uppercase">Education Qualification</span>
                    <p className="text-sm font-bold text-slate-800 mt-0.5">{p.qualification}</p>
                  </div>
                  <div>
                    <span className="text-xs font-bold text-slate-400 uppercase">Occupation / Career</span>
                    <p className="text-sm font-bold text-slate-800 mt-0.5">{p.occupation}</p>
                  </div>
                  <div>
                    <span className="text-xs font-bold text-slate-400 uppercase">Monthly Income</span>
                    <p className="text-sm font-bold text-slate-800 mt-0.5">{p.monthlyIncome || 'Confidential / Disclosed on request'}</p>
                  </div>
                </div>

                <div className="border border-slate-200 rounded-2xl p-5 bg-slate-50/50 space-y-3">
                  <h3 className="text-xs font-black text-teal-900 uppercase tracking-wider border-b pb-2">
                    Family &amp; Guardian Information
                  </h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <span className="text-xs font-bold text-slate-400 uppercase">Father Name &amp; Occupation</span>
                      <p className="text-sm font-bold text-slate-900">{p.fatherName} ({p.fatherOccupation})</p>
                    </div>
                    <div>
                      <span className="text-xs font-bold text-slate-400 uppercase">Family Structure</span>
                      <p className="text-sm font-bold text-slate-900">{p.familyType}</p>
                    </div>
                    <div>
                      <span className="text-xs font-bold text-slate-400 uppercase">Primary Guardian Contact</span>
                      <p className="text-sm font-bold text-slate-900">{p.guardianName}</p>
                    </div>
                    <div>
                      <span className="text-xs font-bold text-slate-400 uppercase">Phone &amp; Email</span>
                      <p className="text-sm font-mono font-bold text-slate-900">{p.guardianPhone} | {p.guardianEmail || 'N/A'}</p>
                    </div>
                  </div>
                </div>

                <div className="border border-slate-200 rounded-2xl p-5 bg-white space-y-1">
                  <span className="text-xs font-bold text-slate-400 uppercase">Partner Expectations</span>
                  <p className="text-sm text-slate-800 leading-relaxed italic">{p.partnerExpectations || 'Standard Chaurasiya Samaj cultural values and mutual respect.'}</p>
                </div>
              </div>
            );
          })()}

          {/* Form Fields Table: Volunteer */}
          {type === 'volunteer' && (() => {
            const v = item as VolunteerApplication;
            return (
              <div className="space-y-6">
                <div className="grid grid-cols-2 gap-4 border border-slate-200 rounded-2xl p-5 bg-white shadow-sm">
                  <div>
                    <span className="text-xs font-bold text-slate-400 uppercase">Full Name</span>
                    <p className="text-sm font-black text-slate-900 mt-0.5">{v.fullName}</p>
                  </div>
                  <div>
                    <span className="text-xs font-bold text-slate-400 uppercase">Phone Number</span>
                    <p className="text-sm font-mono font-bold text-slate-900 mt-0.5">{v.phone}</p>
                  </div>
                  <div>
                    <span className="text-xs font-bold text-slate-400 uppercase">Email Address</span>
                    <p className="text-sm font-mono font-bold text-slate-900 mt-0.5">{v.email}</p>
                  </div>
                  <div>
                    <span className="text-xs font-bold text-slate-400 uppercase">Address / District</span>
                    <p className="text-sm font-bold text-slate-900 mt-0.5">{v.address}</p>
                  </div>
                </div>

                <div className="border border-slate-200 rounded-2xl p-5 bg-slate-50 space-y-3">
                  <div>
                    <span className="text-xs font-bold text-slate-400 uppercase">Selected Areas of Interest</span>
                    <div className="flex flex-wrap gap-2 mt-2">
                      {v.interests.map((interest, idx) => (
                        <span key={idx} className="px-3 py-1 bg-teal-100 text-teal-900 font-bold text-xs rounded-lg border border-teal-200">
                          ✓ {interest}
                        </span>
                      ))}
                    </div>
                  </div>
                  <div className="pt-3 border-t border-slate-200 grid grid-cols-2 gap-4">
                    <div>
                      <span className="text-xs font-bold text-slate-400 uppercase">Availability Schedule</span>
                      <p className="text-sm font-bold text-slate-900">{v.availability}</p>
                    </div>
                    <div>
                      <span className="text-xs font-bold text-slate-400 uppercase">Volunteer Status</span>
                      <p className="text-sm font-bold text-emerald-700 uppercase">{v.status}</p>
                    </div>
                  </div>
                </div>

                {v.notes && (
                  <div className="border border-slate-200 rounded-2xl p-5 bg-white">
                    <span className="text-xs font-bold text-slate-400 uppercase">Motivation Notes</span>
                    <p className="text-sm text-slate-800 leading-relaxed mt-1">{v.notes}</p>
                  </div>
                )}
              </div>
            );
          })()}

          {/* Form Fields Table: Membership */}
          {type === 'membership' && (() => {
            const m = item as MembershipApplication;
            return (
              <div className="space-y-6">
                <div className="grid grid-cols-2 gap-4 border border-slate-200 rounded-2xl p-5 bg-white shadow-sm">
                  <div>
                    <span className="text-xs font-bold text-slate-400 uppercase">Application Type</span>
                    <p className="text-sm font-black text-emerald-800 mt-0.5 uppercase">
                      {m.type === 'renewal' ? 'Membership Renewal' : 'New Lifetime Membership Application'}
                    </p>
                  </div>
                  <div>
                    <span className="text-xs font-bold text-slate-400 uppercase">Membership Tier</span>
                    <p className="text-sm font-black text-slate-900 mt-0.5">{m.membershipType}</p>
                  </div>
                  <div>
                    <span className="text-xs font-bold text-slate-400 uppercase">Applicant Name</span>
                    <p className="text-sm font-bold text-slate-900 mt-0.5">{m.fullName}</p>
                  </div>
                  <div>
                    <span className="text-xs font-bold text-slate-400 uppercase">Mobile Phone</span>
                    <p className="text-sm font-mono font-bold text-slate-900 mt-0.5">{m.phone}</p>
                  </div>
                  <div>
                    <span className="text-xs font-bold text-slate-400 uppercase">Email</span>
                    <p className="text-sm font-mono font-bold text-slate-900 mt-0.5">{m.email}</p>
                  </div>
                  <div>
                    <span className="text-xs font-bold text-slate-400 uppercase">Address / District</span>
                    <p className="text-sm font-bold text-slate-900 mt-0.5">{m.address}</p>
                  </div>
                </div>

                <div className="border border-slate-200 rounded-2xl p-5 bg-slate-50 space-y-2">
                  <span className="text-xs font-bold text-slate-400 uppercase">Payment Verification</span>
                  <div className="grid grid-cols-2 gap-4 pt-1">
                    <div>
                      <span className="text-xs font-bold text-slate-500">Method:</span>
                      <p className="text-sm font-bold text-slate-900">{m.paymentMethod}</p>
                    </div>
                    <div>
                      <span className="text-xs font-bold text-slate-500">Transaction Ref / Txn ID:</span>
                      <p className="text-sm font-mono font-bold text-slate-900">{m.paymentReference || 'N/A'}</p>
                    </div>
                  </div>
                </div>
              </div>
            );
          })()}

          {/* Official Verification Stamp & Signature Block */}
          <div className="pt-8 border-t-2 border-dashed border-slate-200 grid grid-cols-2 gap-8 text-center mt-12">
            <div className="space-y-12">
              <div className="border-b border-slate-400 pb-1 w-48 mx-auto" />
              <div>
                <p className="text-xs font-black uppercase text-slate-900">Guardian / Applicant Signature</p>
                <p className="text-[10px] text-slate-500">Self-attested electronic submission</p>
              </div>
            </div>

            <div className="space-y-12">
              <div className="border-b border-slate-400 pb-1 w-48 mx-auto flex justify-center">
                <div className="w-16 h-16 rounded-full border-2 border-emerald-600/40 bg-emerald-50 text-emerald-800 font-extrabold text-[9px] flex items-center justify-center uppercase tracking-tighter rotate-[-12deg] shadow-sm">
                  CSN VERIFIED
                </div>
              </div>
              <div>
                <p className="text-xs font-black uppercase text-teal-950">General Secretary / Admin Officer</p>
                <p className="text-[10px] text-slate-500">Chaurasiya Samaj Nepal Central Executive</p>
              </div>
            </div>
          </div>

          {/* Footer Note */}
          <div className="text-center text-[10px] text-slate-400 font-medium pt-4 border-t border-slate-100">
            This official document is generated from the Chaurasiya Samaj Nepal Central Database.
            For verifications, contact csnepalwebsite@gmail.com | +977-9812345678.
          </div>

        </div>
      </div>
    </div>
  );
}
