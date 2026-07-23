import React, { useState } from 'react';
import { X, Lock, ShieldCheck, Key, LogOut } from 'lucide-react';
import { Language } from '../types';

interface AdminLoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  lang: Language;
  isAdmin: boolean;
  setIsAdmin: (status: boolean) => void;
}

export default function AdminLoginModal({
  isOpen,
  onClose,
  lang,
  isAdmin,
  setIsAdmin,
}: AdminLoginModalProps) {
  const [password, setPassword] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  if (!isOpen) return null;

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    const cleanPassword = password.trim();
    if (cleanPassword === 'admin2026' || cleanPassword === 'chaurasiya2026' || cleanPassword === 'chaurasiya') {
      setIsAdmin(true);
      try {
        localStorage.setItem('chaurasiya_is_admin', 'true');
        localStorage.setItem('chaurasiya_admin_password', cleanPassword);
        sessionStorage.setItem('chaurasiya_admin_authenticated', 'true');
      } catch (err) {
        console.error('Failed to save admin state:', err);
      }
      setPassword('');
      setErrorMsg('');
      onClose();
    } else {
      setErrorMsg(
        lang === 'en'
          ? 'Invalid Admin Password! Please enter the correct admin password (admin2026).'
          : 'गलत प्रशासक पासवर्ड! कृपया सही प्रशासक पासवर्ड (admin2026) प्रविष्ट गर्नुहोस्।'
      );
    }
  };

  const handleLogout = () => {
    setIsAdmin(false);
    try {
      localStorage.removeItem('chaurasiya_is_admin');
      localStorage.removeItem('chaurasiya_admin_password');
    } catch (err) {
      console.error('Failed to clear admin state:', err);
    }
    onClose();
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative max-w-md w-full bg-white rounded-3xl overflow-hidden border border-teal-100 shadow-2xl p-6 sm:p-8 space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-teal-50 pb-4">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-xl bg-teal-900 text-teal-300 flex items-center justify-center shadow-inner">
              <ShieldCheck className="w-5 h-5 text-emerald-400" />
            </div>
            <div>
              <h3 className="text-lg font-black text-teal-950">
                {lang === 'en' ? 'Administrator Login' : 'प्रशासक लगइन'}
              </h3>
              <p className="text-[11px] font-bold text-teal-600 uppercase tracking-wider">
                Chaurasiya Samaj Nepal Portal
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 text-gray-400 hover:text-teal-950 rounded-full hover:bg-teal-50 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {isAdmin ? (
          /* Already Logged In State */
          <div className="space-y-6 text-center">
            <div className="w-16 h-16 bg-emerald-100 text-emerald-700 rounded-full flex items-center justify-center mx-auto border-2 border-emerald-300 shadow-sm">
              <ShieldCheck className="w-8 h-8" />
            </div>

            <div className="space-y-1">
              <h4 className="text-xl font-extrabold text-teal-950">
                {lang === 'en' ? 'Admin Access Granted' : 'प्रशासक पहुँच सक्रिय'}
              </h4>
              <p className="text-xs text-gray-600 font-medium">
                {lang === 'en'
                  ? 'You are currently logged in as Administrator. You have full privileges to upload Journey Posts and publish Community Notices.'
                  : 'तपाईं हाल प्रशासकको रूपमा लगइन हुनुहुन्छ। तपाईंलाई मिडिया पोस्ट र समुदाय सूचनाहरू प्रकाशित गर्ने पूर्ण अधिकार छ।'}
              </p>
            </div>

            <button
              onClick={handleLogout}
              className="w-full py-3.5 bg-red-600 hover:bg-red-700 text-white font-extrabold text-xs uppercase tracking-wider rounded-xl shadow-md transition-all flex items-center justify-center gap-2"
            >
              <LogOut className="w-4 h-4" />
              <span>{lang === 'en' ? 'Log Out Admin' : 'प्रशासक लगआउट गर्नुहोस्'}</span>
            </button>
          </div>
        ) : (
          /* Login Form State */
          <form onSubmit={handleLogin} className="space-y-5">
            <p className="text-xs text-gray-600 leading-relaxed font-medium bg-teal-50/60 p-3.5 rounded-2xl border border-teal-100">
              💡 {lang === 'en'
                ? 'Log in as Administrator to post Glimpses of Our Journey updates and publish Community Notices with Google Drive file links.'
                : 'यात्राका झलकहरू र गुगल ड्राइभ लिङ्क सहितका सामुदायिक सूचनाहरू पोस्ट गर्न प्रशासकको रूपमा लगइन गर्नुहोस्।'}
            </p>

            <div className="space-y-2">
              <label className="block text-xs font-bold text-teal-950 flex items-center gap-1.5">
                <Key className="w-3.5 h-3.5 text-teal-600" />
                <span>{lang === 'en' ? 'Admin Password' : 'प्रशासक पासवर्ड'}</span>
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    setErrorMsg('');
                  }}
                  placeholder="Enter admin password (e.g. admin2026)"
                  className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-900 focus:outline-none focus:border-teal-600 focus:bg-white shadow-sm"
                />
              </div>
              {errorMsg && (
                <p className="text-[11px] font-bold text-red-600 animate-in fade-in">
                  ⚠️ {errorMsg}
                </p>
              )}
            </div>

            <div className="flex items-center gap-3">
              <button
                type="submit"
                className="flex-grow py-3.5 bg-emerald-600 hover:bg-emerald-500 text-white font-extrabold text-xs uppercase tracking-wider rounded-xl shadow-md transition-all"
              >
                {lang === 'en' ? 'Sign In as Admin' : 'प्रशासकको रूपमा प्रवेश गर्नुहोस्'}
              </button>
            </div>

            <div className="text-center pt-2 border-t border-teal-50">
              <span className="text-[11px] text-gray-400 font-medium">
                Default Passcode: <code className="bg-gray-100 px-1.5 py-0.5 rounded text-gray-700 font-bold">admin2026</code>
              </span>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
