import React from 'react';
import { usePark } from '../../../context/ParkContext';
import { 
  ScrollText, 
  History, 
  CheckCircle2, 
  ShieldCheck, 
  Clock, 
  MapPin, 
  Sparkles, 
  RotateCcw,
  Compass
} from 'lucide-react';
import { sound } from '../../../utils/crypto';

export const Stage5AdventureLedger: React.FC = () => {
  const { 
    visitor, 
    events = [], 
    setVisitorGameStage, 
    openCastleMap 
  } = usePark();

  const visitorEvents = (events || []).filter(e => e.visitorId === visitor?.id || !e.visitorId);

  return (
    <div className="space-y-6">
      {/* Stage 5 Hero Banner */}
      <div className="bg-gradient-to-br from-emerald-400 via-teal-400 to-emerald-500 rounded-3xl p-6 sm:p-8 border-4 border-emerald-300 shadow-2xl text-slate-950 relative overflow-hidden">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6 relative z-10">
          <div className="space-y-2 text-center md:text-right">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/90 text-slate-950 font-black text-xs shadow-sm">
              <ScrollText className="w-4 h-4 text-emerald-600" />
              <span>سجل المغامرة وسجل الأحداث (Event Ledger - Section 19) 📜</span>
            </div>

            <h3 className="text-2xl sm:text-3xl font-black">
              سجل أنشطة وإنجازات اليوم في الحديقة 🏆
            </h3>

            <p className="text-xs sm:text-sm font-bold text-emerald-950/80 max-w-xl">
              توثيق غير قابل للتعديل لجميع عمليات الشراء، الدخول، واستخدام الألعاب مع رقم المعاملة الفريد ووضع التحقق (Online / Offline).
            </p>
          </div>

          <button
            onClick={() => {
              sound.playLevelUp();
              setVisitorGameStage(1);
            }}
            className="btn-game-white py-4 px-6 text-sm font-black flex items-center justify-center gap-2.5 shadow-2xl shrink-0"
          >
            <RotateCcw className="w-5 h-5 text-emerald-600" />
            <span>العودة للمرحلة 1 (خزينة الوحدات) 🔄</span>
          </button>
        </div>
      </div>

      {/* Ledger Stream Card */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 border-3 border-emerald-200 dark:border-slate-800 shadow-xl">
        <div className="flex items-center justify-between pb-4 border-b-2 border-emerald-100 dark:border-slate-800 mb-6">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-2xl bg-emerald-400 text-slate-950 font-black">
              <History className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-lg font-black text-slate-900 dark:text-white">سجل العمليات والأحداث الموثقة ({visitorEvents.length} حدث) 📝</h4>
              <p className="text-xs text-slate-600 dark:text-slate-400 font-medium">سجل تدقيق آمن يضمن عدم التكرار (Idempotent Ledger)</p>
            </div>
          </div>

          <span className="px-3 py-1 bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 font-black text-xs rounded-full border border-emerald-300">
            موثق ومؤمن بالكامل ✓
          </span>
        </div>

        {visitorEvents.length === 0 ? (
          <div className="text-center py-10 text-slate-400">
            <ScrollText className="w-12 h-12 text-slate-300 mx-auto mb-2" />
            <p className="text-sm font-bold">لا توجد عمليات مسجلة بعد</p>
          </div>
        ) : (
          <div className="space-y-3">
            {visitorEvents.map((evt) => (
              <div
                key={evt.id}
                className="bg-emerald-50/60 dark:bg-slate-800/80 rounded-2xl p-4 border-2 border-emerald-100 dark:border-slate-700 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:border-emerald-300 transition-colors"
              >
                <div className="flex items-start gap-3">
                  <div className="p-2.5 rounded-2xl bg-emerald-400 text-slate-950 font-black shrink-0 mt-0.5">
                    <CheckCircle2 className="w-5 h-5 stroke-[2.5]" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-black text-sm text-slate-900 dark:text-white">
                        {evt.eventType === 'TICKET_PURCHASE' ? 'شراء وإصدار تذاكر 🎟️' :
                         evt.eventType === 'PARK_ENTRY' ? 'دخول بوابة الحديقة 🚪' :
                         evt.eventType === 'ATTRACTION_USAGE' ? 'تشغيل لعبة ومغامرة 🎡' :
                         evt.eventType === 'UNITS_PURCHASE' ? 'شحن رصيد وحدات 🪙' : evt.eventType}
                      </span>
                      <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-300 font-bold border border-slate-200 dark:border-slate-700">
                        {evt.id}
                      </span>
                    </div>

                    <div className="text-xs text-slate-600 dark:text-slate-400 mt-1 flex flex-wrap items-center gap-3">
                      <span className="flex items-center gap-1 font-medium">
                        <MapPin className="w-3.5 h-3.5 text-emerald-500" />
                        {evt.locationName || 'الحديقة الرئيسية'}
                      </span>
                      {evt.ticketId && (
                        <span className="font-mono text-slate-700 dark:text-slate-300 font-bold">
                          التذكرة: {evt.ticketId}
                        </span>
                      )}
                      {evt.unitsDeducted && (
                        <span className="font-bold text-amber-600">
                          -{evt.unitsDeducted} وحدة
                        </span>
                      )}
                      <span className="text-[11px] px-2 py-0.2 rounded bg-emerald-100 text-emerald-800 font-bold">
                        {evt.validationMode === 'OFFLINE' ? 'أوفلاين 🟠' : 'أونلاين 🟢'}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="text-left sm:text-left text-xs font-mono font-bold text-slate-500 dark:text-slate-400 shrink-0">
                  {new Date(evt.timestamp).toLocaleTimeString('ar-SA')}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Finished Tour Celebration Card */}
      <div className="bg-gradient-to-r from-amber-400 via-rose-400 to-purple-500 rounded-3xl p-6 text-slate-950 font-black shadow-xl flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-3 text-center sm:text-right">
          <Sparkles className="w-8 h-8 text-white animate-spin-slow shrink-0" />
          <div>
            <div className="text-lg text-white">🎉 اكتملت جولة المغامرة التفاعلية!</div>
            <div className="text-xs text-white/90 font-medium">
              يمكنك إعادة التنقل بحرية بين أي مرحلة أو فتح خريطة الحصن في أي وقت
            </div>
          </div>
        </div>

        <button
          onClick={() => openCastleMap()}
          className="btn-game-white px-6 py-3 text-xs font-black shrink-0"
        >
          فتح خريطة الحصن 🏯
        </button>
      </div>
    </div>
  );
};
