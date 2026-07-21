import React, { useState } from 'react';
import { MapPin, Phone, Mail, Send, Facebook, Twitter, Instagram, Youtube, MessageCircle } from 'lucide-react';
import { Language } from '../types';

interface ContactSectionProps {
  lang: Language;
  onTrackAction: (actionName: string) => void;
}

export default function ContactSection({ lang, onTrackAction }: ContactSectionProps) {
  const [formData, setFormData] = useState({ name: '', email: '', subject: '', message: '' });
  const [submitted, setSubmitted] = useState(false);

  const t = {
    title: { en: 'Contact Us', ne: 'सम्पर्क गर्नुहोस्' },
    sub: { en: 'We would love to hear from you. Reach out for collaborations, donations, or any queries.', ne: 'हामी तपाईंबाट सुन्न चाहन्छौं। सहकार्य, दान, वा कुनै पनि जिज्ञासाका लागि सम्पर्क गर्नुहोस्।' },
    name: { en: 'Full Name', ne: 'पूरा नाम' },
    email: { en: 'Email Address', ne: 'इमेल ठेगाना' },
    subject: { en: 'Subject', ne: 'विषय' },
    message: { en: 'Message', ne: 'सन्देश' },
    send: { en: 'Send Message', ne: 'सन्देश पठाउनुहोस्' },
    success: { en: 'Message sent successfully! We will get back to you soon.', ne: 'सन्देश सफलतापूर्वक पठाइयो! हामी छिट्टै तपाईंलाई सम्पर्क गर्नेछौं।' },
    addressLabel: { en: 'Our Headquarters', ne: 'हाम्रो प्रधान कार्यालय' },
    address: { en: 'Ghantaghar Path, Birgunj, Parsa, Madhesh Province, Nepal', ne: 'घन्टाघर पथ, वीरगन्ज, पर्सा, मधेश प्रदेश, नेपाल' },
    phoneLabel: { en: 'Call Us', ne: 'हामीलाई कल गर्नुहोस्' },
    phone: { en: '+977-9812345678', ne: '+९७७-९८१२३४५६७८' },
    emailLabel: { en: 'Email Us', ne: 'हामीलाई इमेल गर्नुहोस्' },
    emailAdd: { en: 'achauraseeya@gmail.com', ne: 'achauraseeya@gmail.com' }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onTrackAction('Submit Contact Form');
    setSubmitted(true);
    setTimeout(() => setSubmitted(false), 5000);
    setFormData({ name: '', email: '', subject: '', message: '' });
  };

  return (
    <div className="space-y-16 animate-in fade-in duration-500 pb-20 pt-8">
      
      {/* Header */}
      <section className="text-center max-w-3xl mx-auto space-y-6">
        <h1 className="text-4xl sm:text-5xl font-black text-gray-900 tracking-tight">
          {t.title[lang]}
        </h1>
        <p className="text-lg text-gray-600 font-medium">
          {t.sub[lang]}
        </p>
      </section>

      <section className="grid grid-cols-1 lg:grid-cols-12 gap-12">
        {/* Contact Info & Map */}
        <div className="lg:col-span-5 space-y-8">
          <div className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm space-y-8">
            <h3 className="text-2xl font-bold text-gray-900">{t.title[lang]}</h3>
            
            <div className="space-y-6">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-teal-50 rounded-full flex items-center justify-center shrink-0">
                  <MapPin className="w-5 h-5 text-teal-600" />
                </div>
                <div>
                  <h4 className="font-bold text-gray-900">{t.addressLabel[lang]}</h4>
                  <p className="text-gray-600 leading-relaxed mt-1">{t.address[lang]}</p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-teal-50 rounded-full flex items-center justify-center shrink-0">
                  <Phone className="w-5 h-5 text-teal-600" />
                </div>
                <div>
                  <h4 className="font-bold text-gray-900">{t.phoneLabel[lang]}</h4>
                  <p className="text-gray-600 leading-relaxed mt-1">{t.phone[lang]}</p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-teal-50 rounded-full flex items-center justify-center shrink-0">
                  <Mail className="w-5 h-5 text-teal-600" />
                </div>
                <div>
                  <h4 className="font-bold text-gray-900">{t.emailLabel[lang]}</h4>
                  <p className="text-gray-600 leading-relaxed mt-1">{t.emailAdd[lang]}</p>
                </div>
              </div>
            </div>

            <div className="pt-8 border-t border-gray-100">
              <h4 className="font-bold text-gray-900 mb-4">Follow Us</h4>
              <div className="flex gap-4">
                <a href="#" className="w-10 h-10 bg-gray-50 hover:bg-teal-50 text-gray-600 hover:text-teal-600 rounded-full flex items-center justify-center transition-colors">
                  <Facebook className="w-5 h-5" />
                </a>
                <a href="#" className="w-10 h-10 bg-gray-50 hover:bg-teal-50 text-gray-600 hover:text-teal-600 rounded-full flex items-center justify-center transition-colors">
                  <Twitter className="w-5 h-5" />
                </a>
                <a href="#" className="w-10 h-10 bg-gray-50 hover:bg-teal-50 text-gray-600 hover:text-teal-600 rounded-full flex items-center justify-center transition-colors">
                  <Instagram className="w-5 h-5" />
                </a>
                <a href="#" className="w-10 h-10 bg-gray-50 hover:bg-teal-50 text-gray-600 hover:text-teal-600 rounded-full flex items-center justify-center transition-colors">
                  <Youtube className="w-5 h-5" />
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Contact Form */}
        <div className="lg:col-span-7">
          <div className="bg-white p-8 sm:p-10 rounded-3xl border border-gray-100 shadow-sm">
            {submitted ? (
              <div className="h-full min-h-[400px] flex flex-col items-center justify-center text-center space-y-4">
                <div className="w-20 h-20 bg-emerald-50 rounded-full flex items-center justify-center">
                  <Send className="w-10 h-10 text-emerald-500" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900">{t.success[lang]}</h3>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-gray-700">{t.name[lang]}</label>
                    <input 
                      required
                      type="text" 
                      value={formData.name}
                      onChange={(e) => setFormData({...formData, name: e.target.value})}
                      className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-teal-500 transition-all"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-gray-700">{t.email[lang]}</label>
                    <input 
                      required
                      type="email" 
                      value={formData.email}
                      onChange={(e) => setFormData({...formData, email: e.target.value})}
                      className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-teal-500 transition-all"
                    />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <label className="text-sm font-bold text-gray-700">{t.subject[lang]}</label>
                  <input 
                    required
                    type="text" 
                    value={formData.subject}
                    onChange={(e) => setFormData({...formData, subject: e.target.value})}
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-teal-500 transition-all"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-bold text-gray-700">{t.message[lang]}</label>
                  <textarea 
                    required
                    rows={6}
                    value={formData.message}
                    onChange={(e) => setFormData({...formData, message: e.target.value})}
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-teal-500 transition-all resize-none"
                  ></textarea>
                </div>

                <button 
                  type="submit"
                  className="w-full py-4 bg-teal-600 hover:bg-teal-700 text-white font-bold text-lg rounded-xl shadow-lg hover:shadow-xl transition-all flex items-center justify-center gap-2"
                >
                  <Send className="w-5 h-5" />
                  {t.send[lang]}
                </button>
              </form>
            )}
          </div>
        </div>
      </section>

      {/* Map Embed Placeholder */}
      <section className="h-96 rounded-3xl overflow-hidden border border-gray-200 relative bg-gray-100 flex items-center justify-center shadow-inner">
        {/* We use an iframe pointing to Birgunj Google Maps for real effect */}
        <iframe 
          src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d14163.63384218987!2d84.8690333!3d27.0140733!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3993543888365445%3A0x88f28df19973273!2sBirgunj%2C%20Nepal!5e0!3m2!1sen!2sus!4v1715000000000!5m2!1sen!2sus" 
          width="100%" 
          height="100%" 
          style={{ border: 0 }} 
          allowFullScreen 
          loading="lazy" 
          referrerPolicy="no-referrer-when-downgrade"
          className="absolute inset-0"
        ></iframe>
      </section>

    </div>
  );
}
