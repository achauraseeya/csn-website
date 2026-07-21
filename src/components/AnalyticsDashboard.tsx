import { BarChart, TrendingUp, Users, Heart, Download, MousePointer, RefreshCw } from 'lucide-react';
import { Language, AnalyticsMetric } from '../types';

interface AnalyticsDashboardProps {
  lang: Language;
  metrics: AnalyticsMetric;
  onResetMetrics: () => void;
  onTrackAction: (actionName: string) => void;
}

export default function AnalyticsDashboard({
  lang,
  metrics,
  onResetMetrics,
  onTrackAction,
}: AnalyticsDashboardProps) {
  const t = {
    title: { en: 'Live Platform Engagement & Metrics', ne: 'प्रत्यक्ष प्लेटफर्म संलग्नता र तथ्याङ्क' },
    sub: {
      en: 'Real-time telemetry showing user clicks, newsletter pipelines, memberships, and Blogger XML exports.',
      ne: 'प्रयोगकर्ताको क्लिक, न्यूजलेटर बुलेटिन, सदस्यता र ब्लगर XML डाउनलोडहरू देखाउने प्रत्यक्ष तथ्याङ्क।',
    },
    views: { en: 'Page Sessions', ne: 'पेज सेसनहरू' },
    subs: { en: 'Newsletter Pool', ne: 'न्यूजलेटर सदस्य' },
    donations: { en: 'Welfare Funds (NPR)', ne: 'कल्याणकारी कोष (NPR)' },
    regs: { en: 'Registered Members', ne: 'दर्ता भएका सदस्य' },
    downloads: { en: 'Blogger XML Exports', ne: 'ब्लगर XML एक्सपोर्ट' },
    clicks: { en: 'Button Event Activity', ne: 'बटन क्लिक गतिविधि' },
    chartTitle: { en: 'Hourly Outreach Traffic Index', ne: 'घण्टावार पहुँच ट्राफिक सूचकांक' },
    resetBtn: { en: 'Simulate Hot Reload Metrics', ne: 'तथ्याङ्क पुन: लोड गर्नुहोस्' },
  };

  // Safe mock traffic flow sequence for SVG chart
  const trafficData = [
    { hour: '08:00', load: 45 },
    { hour: '10:00', load: 82 },
    { hour: '12:00', load: 124 },
    { hour: '14:00', load: 98 },
    { hour: '16:00', load: 156 },
    { hour: '18:00', load: 210 },
    { hour: '20:00', load: 185 },
  ];

  const maxLoad = Math.max(...trafficData.map((d) => d.load));

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      {/* Intro block */}
      <section className="bg-white p-6 sm:p-8 rounded-2xl border border-teal-100 shadow-sm flex flex-col sm:flex-row justify-between items-center gap-6">
        <div className="space-y-2">
          <h2 className="text-2xl font-extrabold text-teal-950 flex items-center gap-2">
            <BarChart className="w-6 h-6 text-teal-700" />
            {t.title[lang]}
          </h2>
          <p className="text-xs sm:text-sm text-gray-500 leading-relaxed">
            {t.sub[lang]}
          </p>
        </div>

        <button
          onClick={() => {
            onResetMetrics();
            onTrackAction('Reset/Simulate Metrics Refreshed');
          }}
          className="w-full sm:w-auto px-4 py-2.5 bg-teal-50 hover:bg-teal-100 text-teal-800 rounded-xl border border-teal-200 text-xs font-bold uppercase flex items-center justify-center gap-1.5 transition-all"
        >
          <RefreshCw className="w-3.5 h-3.5" />
          {t.resetBtn[lang]}
        </button>
      </section>

      {/* Bento Grid Metrics Cards */}
      <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6">
        {/* Page views */}
        <div className="bg-white p-6 rounded-2xl border border-teal-100 shadow-sm space-y-4">
          <div className="flex items-center justify-between text-teal-700">
            <TrendingUp className="w-5 h-5 text-teal-500" />
            <span className="text-[10px] font-black uppercase tracking-wider text-teal-600 bg-teal-50 px-2 py-0.5 rounded">
              Live Feed
            </span>
          </div>
          <div>
            <div className="text-3xl font-black text-teal-950 tracking-tight font-mono">
              {metrics.pageViews}
            </div>
            <p className="text-xs text-gray-500 font-bold mt-1 uppercase">
              {t.views[lang]}
            </p>
          </div>
        </div>

        {/* Newsletter Subscribers */}
        <div className="bg-white p-6 rounded-2xl border border-teal-100 shadow-sm space-y-4">
          <div className="flex items-center justify-between text-teal-700">
            <Users className="w-5 h-5 text-teal-500" />
            <span className="text-[10px] font-black uppercase tracking-wider text-teal-600 bg-teal-50 px-2 py-0.5 rounded">
              Pool Count
            </span>
          </div>
          <div>
            <div className="text-3xl font-black text-teal-950 tracking-tight font-mono">
              {metrics.newsletterSubscribers}
            </div>
            <p className="text-xs text-gray-500 font-bold mt-1 uppercase">
              {t.subs[lang]}
            </p>
          </div>
        </div>

        {/* Donations */}
        <div className="bg-white p-6 rounded-2xl border border-teal-100 shadow-sm space-y-4">
          <div className="flex items-center justify-between text-teal-700">
            <Heart className="w-5 h-5 text-teal-500 fill-teal-500/10" />
            <span className="text-[10px] font-black uppercase tracking-wider text-teal-600 bg-teal-50 px-2 py-0.5 rounded">
              Audited
            </span>
          </div>
          <div>
            <div className="text-3xl font-black text-teal-950 tracking-tight font-mono">
              NPR {metrics.donationsReceived.toLocaleString()}
            </div>
            <p className="text-xs text-gray-500 font-bold mt-1 uppercase">
              {t.donations[lang]}
            </p>
          </div>
        </div>

        {/* Registered Members */}
        <div className="bg-white p-6 rounded-2xl border border-teal-100 shadow-sm space-y-4">
          <div className="flex items-center justify-between text-teal-700">
            <Users className="w-5 h-5 text-teal-500" />
            <span className="text-[10px] font-black uppercase tracking-wider text-teal-600 bg-teal-50 px-2 py-0.5 rounded">
              Verified
            </span>
          </div>
          <div>
            <div className="text-3xl font-black text-teal-950 tracking-tight font-mono">
              {metrics.membersRegistered}
            </div>
            <p className="text-xs text-gray-500 font-bold mt-1 uppercase">
              {t.regs[lang]}
            </p>
          </div>
        </div>

        {/* Downloads */}
        <div className="bg-white p-6 rounded-2xl border border-teal-100 shadow-sm space-y-4">
          <div className="flex items-center justify-between text-teal-700">
            <Download className="w-5 h-5 text-teal-500" />
            <span className="text-[10px] font-black uppercase tracking-wider text-teal-600 bg-teal-50 px-2 py-0.5 rounded">
              Theme Files
            </span>
          </div>
          <div>
            <div className="text-3xl font-black text-teal-950 tracking-tight font-mono">
              {metrics.xmlDownloads}
            </div>
            <p className="text-xs text-gray-500 font-bold mt-1 uppercase">
              {t.downloads[lang]}
            </p>
          </div>
        </div>
      </section>

      {/* Grid: Charts & Clicks */}
      <section className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
        {/* Custom SVG Traffic Chart */}
        <div className="lg:col-span-8 bg-white p-6 sm:p-8 rounded-2xl border border-teal-100 shadow-sm space-y-6">
          <div>
            <h3 className="font-extrabold text-teal-950 text-base flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-teal-700" />
              {t.chartTitle[lang]}
            </h3>
            <p className="text-xs text-gray-500 mt-1">Real-time simulation of visitor sessions over the last 24 hours.</p>
          </div>

          {/* SVG Chart Frame */}
          <div className="relative pt-6">
            <div className="h-48 w-full flex items-end justify-between gap-2 border-b border-gray-200 pb-1">
              {trafficData.map((d, idx) => {
                const heightPercent = (d.load / maxLoad) * 100;
                return (
                  <div key={idx} className="flex-1 flex flex-col items-center gap-2 h-full justify-end group">
                    <span className="opacity-0 group-hover:opacity-100 text-[10px] font-black text-white bg-teal-800 px-1.5 py-0.5 rounded transition-opacity absolute mb-16 shadow-md">
                      {d.load} views
                    </span>
                    <div
                      style={{ height: `${heightPercent}%` }}
                      className="w-full bg-gradient-to-t from-teal-800 to-emerald-500 rounded-t-md group-hover:from-teal-700 group-hover:to-emerald-400 transition-all shadow-inner"
                    />
                    <span className="text-[10px] text-gray-500 font-bold tracking-tight mt-1">{d.hour}</span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Click events tracker log */}
        <div className="lg:col-span-4 bg-teal-950 text-white p-6 sm:p-8 rounded-2xl shadow-md border-b-4 border-emerald-500 space-y-6 flex flex-col justify-between">
          <div className="space-y-4">
            <h3 className="font-extrabold text-white text-sm uppercase tracking-wide border-b border-teal-800 pb-2 flex items-center gap-1.5">
              <MousePointer className="w-4 h-4 text-emerald-400" />
              {t.clicks[lang]}
            </h3>

            <div className="space-y-2.5 max-h-[180px] overflow-y-auto pr-1">
              {Object.keys(metrics.buttonClicks).length > 0 ? (
                Object.entries(metrics.buttonClicks).map(([btn, count]) => (
                  <div
                    key={btn}
                    className="flex justify-between items-center text-xs bg-teal-900/40 p-2.5 border border-teal-800 rounded-lg"
                  >
                    <span className="truncate max-w-[150px] font-semibold text-teal-200">
                      {btn}
                    </span>
                    <span className="px-2 py-0.5 rounded bg-emerald-500 text-teal-950 font-black font-mono">
                      {count}
                    </span>
                  </div>
                ))
              ) : (
                <div className="text-center text-xs text-teal-400 py-6">
                  Perform any actions (switch language, view tabs, submit forms) to log event clicks here!
                </div>
              )}
            </div>
          </div>

          <div className="text-[10px] text-teal-400 italic pt-4 border-t border-teal-900/60 leading-relaxed">
            * This dashboard acts as a local telemetry logger proxying standard Google Analytics metrics for community audits.
          </div>
        </div>
      </section>
    </div>
  );
}
