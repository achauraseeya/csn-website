import React, { useState } from 'react';
import { Calendar, MapPin, Clock, CheckCircle2, Award, ClipboardList, Info, Plus, Trash2, X, Sparkles } from 'lucide-react';
import { Language, CommunityEvent } from '../types';
import { upcomingEvents as initialUpcomingEvents } from '../data/communityData';
import { formatNumber } from '../utils/mediaUrl';

interface EventsSectionProps {
  lang: Language;
  onRegisterVolunteer: (regData: any) => void;
  onTrackAction: (actionName: string) => void;
  isAdmin?: boolean;
  eventsList?: CommunityEvent[];
  onAddEvent?: (newEvent: CommunityEvent) => void;
  onDeleteEvent?: (id: string) => void;
}

export default function EventsSection({
  lang,
  onRegisterVolunteer,
  onTrackAction,
  isAdmin = false,
  eventsList = initialUpcomingEvents,
  onAddEvent,
  onDeleteEvent,
}: EventsSectionProps) {
  const events = eventsList.length > 0 ? eventsList : initialUpcomingEvents;
  const [selectedEventId, setSelectedEventId] = useState<string>(events[0]?.id || '');
  const [volunteerName, setVolunteerName] = useState('');
  const [volunteerPhone, setVolunteerPhone] = useState('');
  const [volunteerEmail, setVolunteerEmail] = useState('');
  const [volunteerSkills, setVolunteerSkills] = useState('');
  const [successMsg, setSuccessMsg] = useState(false);

  // Add Event Modal State
  const [showAddModal, setShowAddModal] = useState(false);
  const [eventTitleEn, setEventTitleEn] = useState('');
  const [eventTitleNe, setEventTitleNe] = useState('');
  const [eventDescEn, setEventDescEn] = useState('');
  const [eventDescNe, setEventDescNe] = useState('');
  const [eventDate, setEventDate] = useState('');
  const [eventTime, setEventTime] = useState('');
  const [eventLocEn, setEventLocEn] = useState('');
  const [eventLocNe, setEventLocNe] = useState('');

  const t = {
    title: { en: 'Community Events Schedule & Calendar', ne: 'सामुदायिक कार्यक्रम तालिका र पात्रो' },
    subtitle: {
      en: 'Track upcoming assemblies, agricultural festivals, and free medical camps. Participate directly!',
      ne: 'आगामी भेला, कृषि उत्सव र निःशुल्क स्वास्थ्य शिविरहरू ट्र्याक गर्नुहोस्। प्रत्यक्ष सहभागी बन्नुहोस्!',
    },
    volFormTitle: { en: 'Join as a Volunteer / Register', ne: 'स्वयंसेवकको रूपमा जोडिनुहोस् / दर्ता गर्नुहोस्' },
    volFormSubtitle: {
      en: 'Apply to support field logistics, healthcare camps, or crop coordination squads.',
      ne: 'क्षेत्रगत व्यवस्थापन, स्वास्थ्य शिविर वा बाली समन्वय टोलीलाई सहयोग गर्न आवेदन दिनुहोस्।',
    },
    regBtn: { en: 'Submit Volunteer Enrollment', ne: 'स्वयंसेवक दर्ता बुझाउनुहोस्' },
    successMessage: {
      en: 'Your volunteer profile has been recorded in our centralized roster! Abhishek’s desk will contact you.',
      ne: 'तपाईको स्वयंसेवक प्रोफाइल हाम्रो केन्द्रीय रोस्टरमा दर्ता गरिएको छ! अभिषेकको डेस्कले तपाईलाई सम्पर्क गर्नेछ।',
    },
    calendarTitle: { en: 'July - September 2026 Calendar Overview', ne: 'जुलाई - सेप्टेम्बर २०२६ पात्रो सिंहावलोकन' },
  };

  const selectedEvent = events.find((e) => e.id === selectedEventId) || events[0] || initialUpcomingEvents[0];

  const handleAddEventSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!eventTitleEn || !eventDate || !eventLocEn) return;

    const newEvt: CommunityEvent = {
      id: `evt_${Date.now()}`,
      title: { en: eventTitleEn, ne: eventTitleNe || eventTitleEn },
      description: { en: eventDescEn || 'Community Event', ne: eventDescNe || 'सामुदायिक कार्यक्रम' },
      date: eventDate,
      time: eventTime || '10:00 AM onwards',
      location: { en: eventLocEn, ne: eventLocNe || eventLocEn },
      status: 'upcoming',
    };

    if (onAddEvent) {
      onAddEvent(newEvt);
    }
    onTrackAction(`Admin added event: ${eventTitleEn}`);
    setShowAddModal(false);
    // Reset form
    setEventTitleEn('');
    setEventTitleNe('');
    setEventDescEn('');
    setEventDescNe('');
    setEventDate('');
    setEventTime('');
    setEventLocEn('');
    setEventLocNe('');
  };

  const handleVolunteerSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!volunteerName || !volunteerPhone) return;

    const data = {
      name: volunteerName,
      phone: volunteerPhone,
      email: volunteerEmail,
      eventId: selectedEventId,
      skills: volunteerSkills,
    };

    onRegisterVolunteer(data);
    setSuccessMsg(true);
    onTrackAction(`Register volunteer: ${volunteerName} for event ${selectedEvent.title[lang]}`);

    setTimeout(() => {
      setSuccessMsg(false);
      setVolunteerName('');
      setVolunteerPhone('');
      setVolunteerEmail('');
      setVolunteerSkills('');
    }, 5000);
  };

  // Static list of calendar dates for August 2026
  const calendarDays = [
    { day: 26, isCurrentMonth: false, label: 'Jul' },
    { day: 27, isCurrentMonth: false },
    { day: 28, isCurrentMonth: false, event: 'e1' }, // Medical Camp
    { day: 29, isCurrentMonth: false },
    { day: 30, isCurrentMonth: false },
    { day: 31, isCurrentMonth: false },
    { day: 1, isCurrentMonth: true, label: 'Aug' },
    { day: 2, isCurrentMonth: true },
    { day: 3, isCurrentMonth: true },
    { day: 4, isCurrentMonth: true },
    { day: 5, isCurrentMonth: true },
    { day: 6, isCurrentMonth: true },
    { day: 7, isCurrentMonth: true },
    { day: 8, isCurrentMonth: true },
    { day: 9, isCurrentMonth: true },
    { day: 10, isCurrentMonth: true, notice: 'assembly' }, // General Notice
    { day: 11, isCurrentMonth: true },
    { day: 12, isCurrentMonth: true },
    { day: 13, isCurrentMonth: true },
    { day: 14, isCurrentMonth: true },
    { day: 15, isCurrentMonth: true, event: 'e2' }, // Youth summit
    { day: 16, isCurrentMonth: true },
    { day: 17, isCurrentMonth: true },
    { day: 18, isCurrentMonth: true },
    { day: 19, isCurrentMonth: true },
    { day: 20, isCurrentMonth: true },
    { day: 21, isCurrentMonth: true },
    { day: 22, isCurrentMonth: true },
    { day: 23, isCurrentMonth: true },
    { day: 24, isCurrentMonth: true },
    { day: 25, isCurrentMonth: true },
    { day: 26, isCurrentMonth: true },
    { day: 27, isCurrentMonth: true },
    { day: 28, isCurrentMonth: true },
    { day: 29, isCurrentMonth: true },
    { day: 30, isCurrentMonth: true },
    { day: 31, isCurrentMonth: true },
    { day: 1, isCurrentMonth: false, label: 'Sep' },
    { day: 2, isCurrentMonth: false, event: 'e3' }, // Puja
    { day: 3, isCurrentMonth: false },
    { day: 4, isCurrentMonth: false },
    { day: 5, isCurrentMonth: false },
  ];

  return (
    <div className="space-y-12 animate-in fade-in duration-300">
      {/* Intro Header */}
      <section className="bg-gradient-to-r from-teal-900 to-emerald-900 p-8 rounded-2xl text-white shadow-md flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h2 className="text-2xl sm:text-3xl font-extrabold flex items-center gap-3">
            <Calendar className="w-8 h-8 text-emerald-400" />
            {t.title[lang]}
          </h2>
          <p className="text-teal-100 text-sm sm:text-base mt-2 max-w-2xl">
            {t.subtitle[lang]}
          </p>
        </div>

        {/* Admin Add Event Button */}
        {isAdmin && (
          <button
            onClick={() => setShowAddModal(true)}
            className="px-5 py-3 bg-emerald-500 hover:bg-emerald-400 text-teal-950 font-black text-xs uppercase tracking-wider rounded-xl shadow-lg transition-all flex items-center gap-2 shrink-0 self-start md:self-auto"
          >
            <Plus className="w-4 h-4" />
            <span>{lang === 'en' ? '+ Add Community Event' : '+ कार्यक्रम थप्नुहोस्'}</span>
          </button>
        )}
      </section>

      {/* Admin Add Event Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 sm:p-8 space-y-5 shadow-2xl relative animate-in zoom-in-95 duration-200">
            <button
              onClick={() => setShowAddModal(false)}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 p-1 rounded-full hover:bg-gray-100"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-2 border-b border-gray-100 pb-3">
              <Sparkles className="w-5 h-5 text-emerald-600" />
              <h3 className="text-lg font-bold text-teal-950">
                {lang === 'en' ? 'Add New Community Event' : 'नयाँ सामुदायिक कार्यक्रम थप्नुहोस्'}
              </h3>
            </div>

            <form onSubmit={handleAddEventSubmit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-gray-700">Event Title (English) *</label>
                  <input
                    type="text"
                    required
                    value={eventTitleEn}
                    onChange={(e) => setEventTitleEn(e.target.value)}
                    placeholder="e.g. Free Eye Checkup Camp"
                    className="w-full p-2.5 border border-teal-200 rounded-lg text-sm focus:outline-none focus:border-teal-600"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-bold text-gray-700">कार्यक्रम शीर्षक (नेपाली)</label>
                  <input
                    type="text"
                    value={eventTitleNe}
                    onChange={(e) => setEventTitleNe(e.target.value)}
                    placeholder="उदा. नि:शुल्क आँखा जाँच शिविर"
                    className="w-full p-2.5 border border-teal-200 rounded-lg text-sm focus:outline-none focus:border-teal-600"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-gray-700">Date (e.g., Aug 25, 2026) *</label>
                  <input
                    type="text"
                    required
                    value={eventDate}
                    onChange={(e) => setEventDate(e.target.value)}
                    placeholder="Aug 25, 2026"
                    className="w-full p-2.5 border border-teal-200 rounded-lg text-sm focus:outline-none focus:border-teal-600"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-bold text-gray-700">Time (e.g., 10:00 AM - 4:00 PM)</label>
                  <input
                    type="text"
                    value={eventTime}
                    onChange={(e) => setEventTime(e.target.value)}
                    placeholder="10:00 AM - 4:00 PM"
                    className="w-full p-2.5 border border-teal-200 rounded-lg text-sm focus:outline-none focus:border-teal-600"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-gray-700">Location (English) *</label>
                  <input
                    type="text"
                    required
                    value={eventLocEn}
                    onChange={(e) => setEventLocEn(e.target.value)}
                    placeholder="Community Hall, Birgunj"
                    className="w-full p-2.5 border border-teal-200 rounded-lg text-sm focus:outline-none focus:border-teal-600"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-bold text-gray-700">स्थान (नेपाली)</label>
                  <input
                    type="text"
                    value={eventLocNe}
                    onChange={(e) => setEventLocNe(e.target.value)}
                    placeholder="सामुदायिक हल, वीरगन्ज"
                    className="w-full p-2.5 border border-teal-200 rounded-lg text-sm focus:outline-none focus:border-teal-600"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-gray-700">Description (English)</label>
                <textarea
                  value={eventDescEn}
                  onChange={(e) => setEventDescEn(e.target.value)}
                  placeholder="Details about the event, medical staff, registration info..."
                  rows={2}
                  className="w-full p-2.5 border border-teal-200 rounded-lg text-sm focus:outline-none focus:border-teal-600"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-gray-700">विवरण (नेपाली)</label>
                <textarea
                  value={eventDescNe}
                  onChange={(e) => setEventDescNe(e.target.value)}
                  placeholder="कार्यक्रमको विस्तृत विवरण..."
                  rows={2}
                  className="w-full p-2.5 border border-teal-200 rounded-lg text-sm focus:outline-none focus:border-teal-600"
                />
              </div>

              <div className="flex justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 text-xs font-bold text-gray-600 hover:bg-gray-100 rounded-lg"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs uppercase tracking-wider rounded-lg shadow"
                >
                  Save Event
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Grid: Left Column (Events list & details), Right Column (Calendar & Registration Form) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: List and Details */}
        <div className="lg:col-span-7 space-y-6">
          {/* Active Event Showcase Card */}
          <div className="bg-white p-6 sm:p-8 rounded-2xl border border-teal-100 shadow-sm space-y-5">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-emerald-100 text-teal-800 text-xs font-black rounded-full border border-teal-200 uppercase tracking-wide">
              Selected Agenda
            </span>
            <h3 className="text-xl sm:text-2xl font-extrabold text-teal-950">
              {formatNumber(selectedEvent.title[lang], lang)}
            </h3>
            <p className="text-gray-600 text-sm leading-relaxed">
              {formatNumber(selectedEvent.description[lang], lang)}
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 bg-teal-50/50 p-4 rounded-xl border border-teal-100/60 text-xs font-semibold text-teal-900">
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4 text-teal-700 shrink-0" />
                <span>Date: {formatNumber(selectedEvent.date, lang)}</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-teal-700 shrink-0" />
                <span>Time: {formatNumber(selectedEvent.time, lang)}</span>
              </div>
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-teal-700 shrink-0" />
                <span>{formatNumber(selectedEvent.location[lang], lang)}</span>
              </div>
            </div>

            <div className="p-4 bg-amber-50 rounded-xl border border-amber-200 flex items-start gap-3 text-xs text-amber-900">
              <Info className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
              <div>
                <strong>Volunteer Requirements:</strong> This event requires active support for logistical desk duty, medical triage assistants, and youth transport supervisors. Register using the side portal.
              </div>
            </div>
          </div>

          {/* Upcoming Event Cards list */}
          <div className="space-y-4">
            {events.map((evt) => {
              const isSelected = evt.id === selectedEventId;
              return (
                <div
                  key={evt.id}
                  onClick={() => {
                    setSelectedEventId(evt.id);
                    onTrackAction(`Select event: ${evt.title[lang]}`);
                  }}
                  className={`p-5 rounded-xl border transition-all cursor-pointer flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 relative group ${
                    isSelected
                      ? 'bg-teal-700 text-white border-teal-800 shadow-md transform translate-x-1'
                      : 'bg-white text-teal-950 border-teal-100 hover:border-teal-300 hover:bg-teal-50/20'
                  }`}
                >
                  <div className="space-y-1.5 flex-1 pr-8 sm:pr-0">
                    <h4 className="font-extrabold text-base leading-tight">
                      {formatNumber(evt.title[lang], lang)}
                    </h4>
                    <div className={`flex items-center gap-2 text-xs ${isSelected ? 'text-teal-200' : 'text-gray-500'}`}>
                      <Calendar className="w-3.5 h-3.5" />
                      <span>{formatNumber(evt.date, lang)}</span>
                      <span>•</span>
                      <MapPin className="w-3.5 h-3.5" />
                      <span className="truncate max-w-[180px]">{formatNumber(evt.location[lang], lang)}</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <span
                      className={`text-[10px] font-extrabold px-2.5 py-1 rounded-full border shrink-0 ${
                        isSelected
                          ? 'bg-teal-800 text-emerald-300 border-teal-900'
                          : 'bg-emerald-100 text-teal-800 border-teal-200'
                      }`}
                    >
                      SELECT
                    </span>

                    {/* Admin Delete Event Button */}
                    {isAdmin && onDeleteEvent && (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          if (confirm(`Are you sure you want to delete "${evt.title[lang]}"?`)) {
                            onDeleteEvent(evt.id);
                          }
                        }}
                        className="p-1.5 text-red-400 hover:text-red-200 hover:bg-red-950/40 rounded-lg transition-colors"
                        title="Delete Event"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Column: Calendar Grid & Volunteer Sign-Up Form */}
        <div className="lg:col-span-5 space-y-6">
          {/* Calendar Widget */}
          <div className="bg-white p-6 rounded-2xl border border-teal-100 shadow-sm space-y-4">
            <div className="flex items-center justify-between border-b border-teal-50 pb-2">
              <h3 className="font-extrabold text-sm text-teal-950 flex items-center gap-1.5">
                <Calendar className="w-4 h-4 text-teal-700" />
                {t.calendarTitle[lang]}
              </h3>
              <span className="text-[10px] font-black text-teal-600 bg-teal-50 px-2 py-0.5 rounded uppercase">August 2026</span>
            </div>

            {/* Calendar grid */}
            <div className="grid grid-cols-7 gap-1 text-center text-[10px]">
              {/* Day headers */}
              {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((d) => (
                <div key={d} className="font-bold text-gray-400 py-1">{d}</div>
              ))}

              {/* Days rendering */}
              {calendarDays.map((c, idx) => {
                const isSelectedEventDay = c.event === selectedEventId;
                const hasEvent = c.event;
                return (
                  <div
                    key={idx}
                    className={`p-1.5 rounded-md flex flex-col items-center justify-between min-h-[36px] relative border transition-all ${
                      isSelectedEventDay
                        ? 'bg-teal-700 text-white border-teal-800 shadow-sm'
                        : hasEvent
                        ? 'bg-teal-50 text-teal-800 border-teal-200 hover:bg-teal-100'
                        : c.isCurrentMonth
                        ? 'bg-white text-gray-700 border-gray-50 hover:bg-teal-50/40'
                        : 'bg-gray-50/50 text-gray-300 border-transparent'
                    }`}
                  >
                    <span className="font-bold">{formatNumber(c.day, lang)}</span>
                    {c.label && (
                      <span className="text-[7px] font-bold text-teal-600 uppercase absolute top-0.5 left-0.5">{c.label}</span>
                    )}
                    {hasEvent && (
                      <span className={`w-1.5 h-1.5 rounded-full ${isSelectedEventDay ? 'bg-emerald-300' : 'bg-teal-700'}`} />
                    )}
                  </div>
                );
              })}
            </div>
            <div className="flex flex-wrap gap-3 pt-2 border-t border-teal-50 text-[10px] text-gray-500 font-bold justify-between">
              <span className="flex items-center gap-1">
                <span className="w-2.5 h-2.5 rounded-full bg-teal-700" /> Selected Event
              </span>
              <span className="flex items-center gap-1">
                <span className="w-2.5 h-2.5 rounded bg-teal-50 border border-teal-200" /> Scheduled Event
              </span>
            </div>
          </div>

          {/* Volunteer Registration Portal */}
          <div className="bg-teal-900 text-white p-6 sm:p-8 rounded-2xl shadow-md border-b-8 border-emerald-500 space-y-6">
            <div>
              <h3 className="text-lg font-bold text-teal-50 flex items-center gap-2">
                <ClipboardList className="w-5 h-5 text-emerald-400" />
                {t.volFormTitle[lang]}
              </h3>
              <p className="text-xs text-teal-300 mt-1">{t.volFormSubtitle[lang]}</p>
            </div>

            {successMsg ? (
              <div className="p-4 bg-teal-955 border border-emerald-400/40 text-emerald-300 rounded-xl flex items-start gap-3 text-xs leading-relaxed font-bold animate-in zoom-in duration-200">
                <CheckCircle2 className="w-5 h-5 shrink-0 text-emerald-400" />
                <div>{t.successMessage[lang]}</div>
              </div>
            ) : (
              <form onSubmit={handleVolunteerSubmit} className="space-y-4">
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-teal-300 uppercase tracking-wider">Full Name *</label>
                  <input
                    type="text"
                    required
                    value={volunteerName}
                    onChange={(e) => setVolunteerName(e.target.value)}
                    placeholder="e.g., Alok Kumar Chaurasiya"
                    className="w-full p-2.5 bg-teal-950/60 border border-teal-800 text-sm text-white rounded-lg focus:outline-none focus:border-emerald-400"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-teal-300 uppercase tracking-wider">Phone / WhatsApp *</label>
                    <input
                      type="tel"
                      required
                      value={volunteerPhone}
                      onChange={(e) => setVolunteerPhone(e.target.value)}
                      placeholder="98XXXXXXXX"
                      className="w-full p-2.5 bg-teal-950/60 border border-teal-800 text-sm text-white rounded-lg focus:outline-none focus:border-emerald-400"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-teal-300 uppercase tracking-wider">Email Address</label>
                    <input
                      type="email"
                      value={volunteerEmail}
                      onChange={(e) => setVolunteerEmail(e.target.value)}
                      placeholder="alok@gmail.com"
                      className="w-full p-2.5 bg-teal-950/60 border border-teal-800 text-sm text-white rounded-lg focus:outline-none focus:border-emerald-400"
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-teal-300 uppercase tracking-wider">Event to Assist</label>
                  <select
                    value={selectedEventId}
                    onChange={(e) => setSelectedEventId(e.target.value)}
                    className="w-full p-2.5 bg-teal-950/80 border border-teal-800 text-sm text-white rounded-lg focus:outline-none focus:border-emerald-400"
                  >
                    {events.map((evt) => (
                      <option key={evt.id} value={evt.id} className="text-teal-950 font-semibold">
                        {evt.title[lang]}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-teal-300 uppercase tracking-wider">Special Skills / Comments</label>
                  <textarea
                    value={volunteerSkills}
                    onChange={(e) => setVolunteerSkills(e.target.value)}
                    placeholder="e.g., Medical Student, Graphic Designer, Driving license..."
                    rows={2}
                    className="w-full p-2.5 bg-teal-950/60 border border-teal-800 text-sm text-white rounded-lg focus:outline-none focus:border-emerald-400"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-3 bg-emerald-500 hover:bg-emerald-400 text-teal-950 font-black text-xs uppercase tracking-wider rounded-lg shadow-md transition-all flex items-center justify-center gap-2"
                >
                  <Award className="w-4 h-4 text-teal-950" />
                  {t.regBtn[lang]}
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
