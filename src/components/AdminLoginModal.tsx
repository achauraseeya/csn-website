import React, { useState, useEffect } from 'react';
import { X, LogOut, LogIn, ShieldCheck } from 'lucide-react';
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
  
  useEffect(() => {
    // Basic initialization if needed
  }, []);

  if (!isOpen) return null;

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    if (password.length > 10 && password.startsWith('github_pat_')) {
      localStorage.setItem('chaurasiya_admin_password', password);
      localStorage.setItem('chaurasiya_is_admin', 'true');
      setIsAdmin(true);
      onClose();
    } else {
      setErrorMsg(lang === 'en' ? 'Invalid Github PAT' : 'अवैध Github PAT');
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('chaurasiya_admin_password');
    localStorage.removeItem('chaurasiya_is_admin');
    setIsAdmin(false);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div 
        className="absolute inset-0 bg-teal-950/40 backdrop-blur-sm"
        onClick={onClose}
      />
      
      <div className="relative w-full max-w-sm bg-white rounded-3xl shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        <div className="bg-gradient-to-br from-emerald-600 to-teal-700 p-6 text-white flex justify-between items-start">
          <div>
            <div className="w-12 h-12 bg-white/20 rounded-2xl flex items-center justify-center mb-4 backdrop-blur-md border border-white/30">
              <ShieldCheck className="w-6 h-6 text-white" />
            </div>
            <h2 className="text-xl font-black tracking-tight">
              {lang === 'en' ? 'Admin Portal' : 'प्रशासक पोर्टल'}
            </h2>
            <p className="text-teal-50 text-xs font-medium mt-1 opacity-90">
              {lang === 'en' ? 'Secure access area' : 'सुरक्षित पहुँच क्षेत्र'}
            </p>
          </div>
          <button 
            onClick={onClose}
            className="p-2 hover:bg-white/20 rounded-full transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6">
          {isAdmin ? (
            <div className="space-y-4">
              <div className="flex items-center gap-3 p-3 bg-emerald-50 text-emerald-800 rounded-xl border border-emerald-100">
                <ShieldCheck className="w-6 h-6" />
                <div>
                  <p className="text-sm font-bold">Admin Authenticated</p>
                  <p className="text-xs">Using GitHub PAT</p>
                </div>
              </div>
              
              <button
                onClick={handleLogout}
                className="w-full py-3 bg-red-50 hover:bg-red-100 text-red-600 font-extrabold text-xs uppercase tracking-wider rounded-xl transition-colors flex items-center justify-center gap-2"
              >
                <LogOut className="w-4 h-4" />
                {lang === 'en' ? 'Sign Out' : 'बाहिर निस्कनुहोस्'}
              </button>
            </div>
          ) : (
            <form onSubmit={handleLogin} className="space-y-5">
              <p className="text-xs text-gray-600 leading-relaxed font-medium bg-teal-50/60 p-3.5 rounded-2xl border border-teal-100">
                💡 {lang === 'en' 
                    ? 'Enter your GitHub Personal Access Token (PAT) to manage the community.' 
                    : 'समुदाय व्यवस्थापन गर्न आफ्नो GitHub Personal Access Token (PAT) प्रविष्ट गर्नुहोस्।'}
              </p>

              <div>
                <label className="block text-xs font-bold text-gray-700 mb-2 uppercase tracking-wide">
                  {lang === 'en' ? 'GitHub PAT' : 'GitHub PAT'}
                </label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all font-mono text-sm"
                  placeholder="github_pat_..."
                  required
                />
              </div>

              {errorMsg && (
                <p className="text-[11px] font-bold text-red-600 animate-in fade-in">
                  ⚠️ {errorMsg}
                </p>
              )}

              <button
                type="submit"
                className="w-full py-3.5 bg-emerald-600 hover:bg-emerald-500 text-white font-extrabold text-xs uppercase tracking-wider rounded-xl shadow-md transition-all flex items-center justify-center gap-2"
              >
                <LogIn className="w-4 h-4" />
                <span>{lang === 'en' ? 'Authenticate' : 'प्रमाणीकरण गर्नुहोस्'}</span>
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
