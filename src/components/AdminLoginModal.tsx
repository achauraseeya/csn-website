import React, { useState, useEffect } from 'react';
import { X, LogOut, LogIn, ShieldCheck, RefreshCw, CheckCircle2, AlertCircle } from 'lucide-react';
import { Language } from '../types';
import { triggerEntireRepoSync } from '../utils/githubDb';

interface AdminLoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  lang: Language;
  isAdmin: boolean;
  setIsAdmin: (status: boolean) => void;
  onOpenDashboard?: () => void;
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
  const [isAuthenticating, setIsAuthenticating] = useState(false);
  const [isSyncing, setIsSyncing] = useState(false);
  const [syncStatus, setSyncStatus] = useState('');
  const [syncError, setSyncError] = useState('');

  const handleSync = async () => {
    setIsSyncing(true);
    setSyncStatus(lang === 'en' ? 'Syncing entire repository (all JSON databases, folders, and photo assets)...' : 'सम्पूर्ण भण्डार सिंक गर्दै (सबै JSON डाटाबेसहरू, फोल्डरहरू, र फोटोहरू)...');
    setSyncError('');
    try {
      const res = await triggerEntireRepoSync();
      if (res.success) {
        setSyncStatus(lang === 'en' ? '✅ Entire repository synced successfully! Refreshing...' : '✅ सम्पूर्ण भण्डार सफलतापूर्वक सिंक भयो! रिफ्रेस गर्दै...');
        setTimeout(() => {
          window.location.reload();
        }, 1500);
      } else {
        setSyncError(res.message || (lang === 'en' ? 'Failed to sync' : 'सिंक गर्न असफल भयो'));
        setIsSyncing(false);
      }
    } catch (err: any) {
      setSyncError(err.message || (lang === 'en' ? 'Network error during sync' : 'सिंक गर्दा नेटवर्क त्रुटि भयो'));
      setIsSyncing(false);
    }
  };

  if (!isOpen) return null;

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    
    if (!password.trim()) {
      setErrorMsg(lang === 'en' ? 'Please enter password' : 'कृपया पासवर्ड प्रविष्ट गर्नुहोस्');
      return;
    }

    setIsAuthenticating(true);
    try {
      const res = await fetch('https://api.github.com/user', {
        headers: {
          'Authorization': `token ${password}`,
          'Accept': 'application/vnd.github.v3+json'
        }
      });
      
      if (res.ok) {
        localStorage.setItem('chaurasiya_admin_password', password);
        localStorage.setItem('chaurasiya_is_admin', 'true');
        
        // Ensure standard login clears any lingering super admin session to prevent bypassing queue
                
        setIsAdmin(true);
        // Clear password state
        setPassword('');
      } else {
        setErrorMsg(lang === 'en' ? 'Invalid admin password' : 'अवैध पासवर्ड वा अपर्याप्त अनुमतिहरू');
      }
    } catch (err) {
      setErrorMsg(lang === 'en' ? 'Authentication failed. Check your internet connection.' : 'प्रमाणीकरण असफल भयो। आफ्नो इन्टरनेट जडान जाँच गर्नुहोस्।');
    } finally {
      setIsAuthenticating(false);
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
      
      <div className="relative w-full max-w-sm bg-white rounded-3xl shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200 text-xs font-semibold">
        <div className="bg-gradient-to-br from-emerald-600 to-teal-700 p-6 text-white flex justify-between items-start">
          <div>
            <div className="w-12 h-12 bg-white/20 rounded-2xl flex items-center justify-center mb-4 backdrop-blur-md border border-white/30">
              <ShieldCheck className="w-6 h-6 text-white" />
            </div>
            <h2 className="text-xl font-black tracking-tight">
              {lang === 'en' ? 'Admin Portal' : 'प्रशासक पोर्टल'}
            </h2>
            <p className="text-teal-50 text-[11px] font-medium mt-1 opacity-90">
              {lang === 'en' ? 'Secure access area' : 'सुरक्षित पहुँच क्षेत्र'}
            </p>
          </div>
          <button 
            onClick={onClose}
            className="p-2 hover:bg-white/20 rounded-full transition-colors"
          >
            <X className="w-5 h-5 text-white" />
          </button>
        </div>

        <div className="p-6 space-y-4">
          {isAdmin ? (
            <div className="space-y-4">
              <div className="flex items-center gap-3 p-3 bg-emerald-50 text-emerald-800 rounded-xl border border-emerald-100">
                <ShieldCheck className="w-6 h-6 shrink-0" />
                <div>
                  <p className="text-xs font-bold">{lang === 'en' ? 'Admin Authenticated' : 'प्रशासक प्रमाणित भयो'}</p>
                  <p className="text-[10px] font-medium">{lang === 'en' ? 'Admin session active' : 'प्रशासक सत्र सक्रिय छ'}</p>
                </div>
              </div>

              {/* GitHub Sync Section */}
              {(window.location.hostname.includes('run.app') || window.location.hostname.includes('localhost') || window.location.hostname.includes('ai.studio')) && (
                <div className="p-3.5 bg-teal-50 rounded-2xl border border-teal-100 space-y-3">
                  <div className="flex items-start gap-2">
                    <RefreshCw className={`w-4 h-4 text-teal-700 mt-0.5 ${isSyncing ? 'animate-spin' : ''}`} />
                    <div>
                      <h4 className="text-xs font-bold text-teal-950">
                        {lang === 'en' ? 'GitHub Synchronization' : 'गिटहब सिंक्रोनाइजेसन'}
                      </h4>
                      <p className="text-[10px] text-teal-800 font-medium leading-normal mt-1">
                        {lang === 'en' 
                          ? 'Force a manual recursive sync of all JSON databases, custom folders, and photo assets from the GitHub master repository.' 
                          : 'गिटहब मास्टर भण्डारबाट सबै JSON डाटाबेसहरू, अनुकूलन फोल्डरहरू, र फोटोहरू म्यानुअल रूपमा सिंक गर्नुहोस्।'}
                      </p>
                    </div>
                  </div>

                  {isSyncing ? (
                    <div className="text-[11px] font-bold text-teal-800 bg-white/60 p-2.5 rounded-lg border border-teal-200/50 animate-pulse">
                      ⏳ {syncStatus}
                    </div>
                  ) : syncStatus.startsWith('✅') ? (
                    <div className="text-[11px] font-bold text-emerald-800 bg-emerald-50 p-2.5 rounded-lg border border-emerald-200/50">
                      {syncStatus}
                    </div>
                  ) : (
                    <button
                      onClick={handleSync}
                      className="w-full py-2.5 bg-teal-700 hover:bg-teal-600 text-white font-extrabold text-[11px] uppercase tracking-wider rounded-xl transition-all flex items-center justify-center gap-2 cursor-pointer shadow-sm"
                    >
                      <RefreshCw className="w-3.5 h-3.5" />
                      {lang === 'en' ? 'Sync All from GitHub' : 'गिटहबबाट सबै सिंक गर्नुहोस्'}
                    </button>
                  )}

                  {syncError && (
                    <div className="text-[11px] font-bold text-red-600 bg-red-50 p-2.5 rounded-lg border border-red-200/50">
                      ⚠️ {syncError}
                    </div>
                  )}
                </div>
              )}

              <button
                onClick={handleLogout}
                className="w-full py-3 bg-red-50 hover:bg-red-100 text-red-600 font-extrabold text-xs uppercase tracking-wider rounded-xl transition-colors flex items-center justify-center gap-2 cursor-pointer"
              >
                <LogOut className="w-4 h-4" />
                {lang === 'en' ? 'Sign Out' : 'बाहिर निस्कनुहोस्'}
              </button>
            </div>
          ) : (
            <form onSubmit={handleLogin} className="space-y-5">
              <p className="text-xs text-gray-600 leading-relaxed font-medium bg-teal-50/60 p-3.5 rounded-2xl border border-teal-100">
                🔐 {lang === 'en' 
                    ? 'Enter your administrator password to log in and manage the community portal.' 
                    : 'समुदाय पोर्टल व्यवस्थापन गर्न आफ्नो प्रशासक पासवर्ड प्रविष्ट गर्नुहोस्।'}
              </p>

              <div>
                <label className="block text-[11px] font-bold text-gray-700 mb-2 uppercase tracking-wide">
                  {lang === 'en' ? 'Password' : 'पासवर्ड'}
                </label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all font-mono text-sm"
                  placeholder={lang === 'en' ? 'Enter password...' : 'पासवर्ड प्रविष्ट गर्नुहोस्...'}
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
                disabled={isAuthenticating}
                className="w-full py-3.5 bg-emerald-600 hover:bg-emerald-500 text-white font-extrabold text-xs uppercase tracking-wider rounded-xl shadow-md transition-all flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
              >
                {isAuthenticating ? (
                  <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : (
                  <LogIn className="w-4 h-4" />
                )}
                <span>{isAuthenticating ? (lang === 'en' ? 'Authenticating...' : 'प्रमाणीकरण गर्दै...') : (lang === 'en' ? 'Authenticate' : 'प्रमाणीकरण गर्नुहोस्')}</span>
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
