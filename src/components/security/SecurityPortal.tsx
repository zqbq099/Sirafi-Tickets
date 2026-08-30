import React, { useState } from 'react';
import { usePark } from '../../context/ParkContext';
import { 
  ShieldAlert, 
  ShieldCheck, 
  Search, 
  Clock, 
  MapPin, 
  Phone, 
  CheckCircle2, 
  AlertOctagon, 
  UserCheck, 
  History, 
  Sparkles,
  Radio,
  Megaphone,
  Compass,
  Snowflake,
  Flame,
  Users
} from 'lucide-react';
import { SafetyTreasureMap } from './SafetyTreasureMap';
import { EmergencyBroadcastModal } from './EmergencyBroadcastModal';

export const SecurityPortal: React.FC = () => {
  const { 
    missingAlerts, 
    resolveMissingAlert, 
    visitor, 
    events, 
    employees, 
    reportMissingChild,
    restorePublicMissingBanner,
    isPublicMissingBannerDismissed
  } = usePark();

  const securityOfficer = employees.find(e => e.role === 'security') || employees[3];

  const [searchTicketOrPhone, setSearchTicketOrPhone] = useState<string>('');
  const [resolutionNotes, setResolutionNotes] = useState<string>('تم العثور على الطفل بالقرب من محطة الألعاب وتسليمه لوالده سالماً.');
  const [isBroadcastModalOpen, setIsBroadcastModalOpen] = useState<boolean>(false);
  const [selectedBroadcastAttractionId, setSelectedBroadcastAttractionId] = useState<string | undefined>(undefined);

  const activeAlerts = (missingAlerts || []).filter(a => a.status === 'ACTIVE_SEARCH');
  const resolvedAlerts = (missingAlerts || []).filter(a => a.status === 'FOUND_RESOLVED');

  const handleResolveAlert = (alertId: string) => {
    resolveMissingAlert(alertId, securityOfficer?.name || 'الأمن', resolutionNotes);
  };

  const handleSimulateAbuSalemAhmedSOS = () => {
    reportMissingChild('mem-3', 'قميص أزرق جينز وبنطال رمادي وحذاء أبيض', 'تم الإبلاغ في ممر الألعاب الرئيسي');
  };

  const handleOpenBroadcastModal = (attractionId?: string) => {
    setSelectedBroadcastAttractionId(attractionId);
    setIsBroadcastModalOpen(true);
  };

  const safetyEvents = (events || []).filter(e => 
    e.eventType === 'MISSING_CHILD_ALERT' || 
    e.eventType === 'MISSING_CHILD_FOUND' || 
    e.eventType === 'DOUBLE_SPEND_BLOCKED'
  );

  return (
    <div className="space-y-6 animate-fadeIn pb-12">
      {/* Emergency Broadcast Modal */}
      <EmergencyBroadcastModal
        isOpen={isBroadcastModalOpen}
        onClose={() => setIsBroadcastModalOpen(false)}
        defaultAttractionId={selectedBroadcastAttractionId}
      />

      {/* Security Operations Header Banner */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-slate-900/90 rounded-2xl p-5 border border-slate-800 shadow-lg flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold text-rose-400 flex items-center gap-1.5">
                <Radio className="w-4 h-4 text-rose-400 animate-pulse" />
                غرفة الأمن والسلامة المركزية 👮
              </span>
              <span className="text-xs font-mono text-slate-400">{securityOfficer.id}</span>
            </div>
            <h3 className="text-lg font-black text-white">{securityOfficer.name}</h3>
            <p className="text-xs text-slate-400">{securityOfficer.assignedStation}</p>
          </div>

          <div className="mt-4 pt-3 border-t border-slate-800 text-xs flex justify-between text-slate-400">
            <span>حالة الرصد الميداني:</span>
            <span className="text-emerald-400 font-bold">جاهزية أمنية 24/7 🛡️</span>
          </div>
        </div>

        {/* Active Emergency Status KPI */}
        <div className={`rounded-2xl p-5 border shadow-lg flex flex-col justify-between transition-all ${
          activeAlerts.length > 0
            ? 'bg-rose-950/60 border-rose-500/80 shadow-rose-950/50 animate-pulse'
            : 'bg-slate-900/90 border-slate-800'
        }`}>
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold text-rose-400 flex items-center gap-1.5">
                <ShieldAlert className="w-4 h-4 text-rose-400" />
                بلاغات الفقدان النشطة (Active SOS)
              </span>
              <span className="text-xs font-mono text-slate-400">الطوارئ</span>
            </div>
            <div className="flex items-baseline gap-2 mt-1">
              <span className={`text-3xl font-black font-mono ${activeAlerts.length > 0 ? 'text-rose-400' : 'text-slate-200'}`}>
                {activeAlerts.length}
              </span>
              <span className="text-xs text-slate-400">بلاغ استنفار نشط</span>
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-slate-800 text-xs flex justify-between text-slate-400">
            <span>الإعلان العام:</span>
            {activeAlerts.length > 0 ? (
              <button
                onClick={restorePublicMissingBanner}
                className="text-rose-300 font-bold underline text-[11px]"
              >
                شريط الطوارئ معروض للجميع 📢
              </button>
            ) : (
              <span className="text-emerald-400 font-mono font-bold">لا يوجد نداء مفقودين ✅</span>
            )}
          </div>
        </div>

        {/* Quick Broadcast & Test Triggers */}
        <div className="bg-slate-900/90 rounded-2xl p-5 border border-slate-800 shadow-lg flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold text-amber-400 flex items-center gap-1.5">
                <Megaphone className="w-4 h-4 text-amber-400" />
                التعميم العاجل والاختبار الميداني
              </span>
            </div>
            <p className="text-xs text-slate-300 leading-relaxed">
              إرسال تحذيرات عاجلة لجميع الزوار أو تجربة سيناريو فقدان أحمد (Section 35).
            </p>
          </div>

          <div className="mt-4 pt-3 border-t border-slate-800 grid grid-cols-2 gap-2">
            <button
              onClick={() => handleOpenBroadcastModal()}
              className="py-2 px-2.5 bg-rose-600 hover:bg-rose-500 text-white rounded-xl text-xs font-black transition-all flex items-center justify-center gap-1 shadow-md shadow-rose-950/40"
            >
              <Megaphone className="w-3.5 h-3.5" />
              <span>إرسال تعميم 📢</span>
            </button>
            <button
              onClick={handleSimulateAbuSalemAhmedSOS}
              className="py-2 px-2.5 bg-slate-800 hover:bg-rose-900/40 text-rose-300 border border-rose-800/40 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1"
            >
              <ShieldAlert className="w-3.5 h-3.5 text-rose-400" />
              <span>فقدان تجريبي 🚨</span>
            </button>
          </div>
        </div>
      </div>

      {/* 🗺️ TREASURE MAP FOR SAFETY & CROWD TELEMETRY (خريطة الكنز وعمود درجات البطارية للضغط) */}
      <SafetyTreasureMap onOpenBroadcastModal={handleOpenBroadcastModal} />

      {/* Active Missing Person Emergency Board (Section 22 & 23) */}
      <div className="bg-slate-900/90 rounded-2xl p-5 border border-slate-800 shadow-xl">
        <div className="flex items-center justify-between pb-4 border-b border-slate-800 mb-4">
          <div className="flex items-center gap-2">
            <ShieldAlert className="w-5 h-5 text-rose-500 animate-pulse" />
            <h3 className="text-base font-black text-white">
              لوحة استنفار الأمن لبلاغات المفقودين (Missing Person Command Center)
            </h3>
          </div>
          <span className="text-xs px-2.5 py-0.5 rounded-full bg-rose-500/20 text-rose-300 font-bold border border-rose-500/30">
            صلاحيات أمنية مقيدة (Privacy Protected)
          </span>
        </div>

        {activeAlerts.length === 0 ? (
          <div className="py-8 text-center bg-slate-950/60 rounded-xl border border-slate-800/60 text-slate-400 text-xs flex flex-col items-center gap-2">
            <ShieldCheck className="w-8 h-8 text-emerald-400" />
            <span className="font-bold text-white">لا توجد أي بلاغات فقدان نشطة حالياً</span>
            <span className="text-slate-500">جميع الأطفال والزوار في أمان تام داخل الحديقة</span>
          </div>
        ) : (
          <div className="space-y-4">
            {activeAlerts.map(alert => (
              <div
                key={alert.id}
                className="p-5 rounded-2xl bg-rose-950/30 border-2 border-rose-600/70 text-slate-100 shadow-2xl relative overflow-hidden"
              >
                <div className="flex flex-col lg:flex-row justify-between gap-4">
                  {/* Child Info & Description */}
                  <div className="space-y-2 flex-1">
                    <div className="flex items-center gap-3">
                      <span className="text-3xl p-2 bg-slate-900 rounded-2xl border border-slate-800">👦</span>
                      <div>
                        <div className="flex items-center gap-2">
                          <h4 className="text-xl font-black text-white">{alert.childName}</h4>
                          <span className="px-2 py-0.5 rounded bg-rose-600 text-white text-xs font-black">
                            العمر: {alert.age} سنوات
                          </span>
                        </div>
                        <span className="text-xs text-rose-300 font-mono">معرف البلاغ: {alert.id}</span>
                      </div>
                    </div>

                    <div className="p-3 bg-slate-950/80 rounded-xl border border-slate-800 text-xs space-y-1 mt-2">
                      <div className="text-slate-400 font-bold">أوصاف الملابس والمظهر:</div>
                      <div className="text-white font-medium">{alert.clothingDescription}</div>
                      {alert.notes && <div className="text-slate-400 text-[11px] mt-1">{alert.notes}</div>}
                    </div>

                    {/* Family Contacts */}
                    <div className="flex items-center gap-4 text-xs text-slate-300 pt-1">
                      <div className="flex items-center gap-1.5">
                        <UserCheck className="w-4 h-4 text-emerald-400" />
                        <span>ولي الأمر: <strong className="text-white">{alert.familyHeadName}</strong></span>
                      </div>
                      <div className="flex items-center gap-1.5 font-mono">
                        <Phone className="w-4 h-4 text-emerald-400" />
                        <span>{alert.familyHeadPhone}</span>
                      </div>
                    </div>
                  </div>

                  {/* Last Recorded Activity (Section 20 & 23 - The Key Requirement) */}
                  <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 lg:w-96 flex flex-col justify-between space-y-3">
                    <div>
                      <div className="flex items-center gap-2 text-emerald-400 text-xs font-bold mb-2">
                        <MapPin className="w-4 h-4" />
                        <span>آخر نشاط مسجل في النظام (Last Recorded Activity):</span>
                      </div>

                      <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 space-y-1">
                        <div className="text-white font-black text-sm">
                          {alert.lastRecordedActivity.locationName}
                        </div>
                        <div className="flex items-center justify-between text-xs text-slate-400 font-mono">
                          <span>وقت النشاط: <strong className="text-amber-300">{alert.lastRecordedActivity.time}</strong></span>
                          <span>التذكرة: {alert.lastRecordedActivity.ticketId || 'T-000182'}</span>
                        </div>
                      </div>

                      {alert.previousActivity && (
                        <div className="mt-2 text-[11px] text-slate-400 flex items-center justify-between px-2">
                          <span>النشاط السابق: {alert.previousActivity.locationName}</span>
                          <span className="font-mono text-slate-500">{alert.previousActivity.time}</span>
                        </div>
                      )}
                    </div>

                    {/* Companion info (Section 24) */}
                    <div className="text-[11px] text-slate-400 bg-slate-900/50 p-2 rounded-lg border border-slate-800/60">
                      👥 <strong>المرافقون المسجلون بنفس التوقيت:</strong> الأب (محمد السالم) والأم (نورة) دخلا عبر البوابة A.
                    </div>

                    {/* Resolve Button */}
                    <div className="pt-2 border-t border-slate-800 flex items-center gap-2">
                      <button
                        onClick={() => handleResolveAlert(alert.id)}
                        className="flex-1 py-2.5 px-4 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-black flex items-center justify-center gap-2 shadow-lg shadow-emerald-900/40 transition-all"
                      >
                        <CheckCircle2 className="w-4 h-4" />
                        تم العثور على الطفل وإغلاق البلاغ ✅
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Safety & Missing Event Ledger */}
      <div className="bg-slate-900/90 rounded-2xl p-5 border border-slate-800 shadow-xl">
        <div className="flex items-center gap-2 pb-3 border-b border-slate-800 mb-3 text-slate-300 text-xs font-bold">
          <History className="w-4 h-4 text-emerald-400" />
          <span>سجل أحداث السلامة والطوارئ (Safety Audit Trail):</span>
        </div>

        <div className="space-y-2">
          {safetyEvents.length === 0 ? (
            <div className="text-xs text-slate-500 text-center py-4">لم تسجل أي حوادث سلامة سابقة.</div>
          ) : (
            safetyEvents.map(evt => (
              <div
                key={evt.id}
                className="p-3 bg-slate-950 rounded-xl border border-slate-800/80 flex items-center justify-between text-xs"
              >
                <div>
                  <div className="font-bold text-white">{evt.notes}</div>
                  <div className="text-[10px] text-slate-500 font-mono mt-0.5">
                    {evt.timestamp} • {evt.id} • مسؤول الأمن: {evt.employeeName || 'غرفة التحكم'}
                  </div>
                </div>
                <span
                  className={`px-2 py-0.5 rounded font-bold font-mono text-[10px] ${
                    evt.status === 'FLAGGED' ? 'bg-rose-950 text-rose-400' : 'bg-emerald-950 text-emerald-400'
                  }`}
                >
                  {evt.status}
                </span>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};
