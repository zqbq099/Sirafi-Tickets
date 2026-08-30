import React, { useState } from 'react';
import { usePark } from '../../context/ParkContext';
import { 
  DoorOpen, 
  ScanLine, 
  CheckCircle2, 
  AlertOctagon, 
  Users, 
  Clock, 
  Sparkles,
  ShieldCheck,
  Zap
} from 'lucide-react';

export const GatePortal: React.FC = () => {
  const { 
    employees, 
    isOnline, 
    validateGateEntry, 
    events, 
    visitor,
    tickets
  } = usePark();

  const gateStaff = employees.find(e => e.role === 'gate_staff') || employees[1];
  const [lastScanResult, setLastScanResult] = useState<any>(null);
  const [manualTicketInput, setManualTicketInput] = useState<string>('T-000180');

  const handleScanTicket = (rawTicket: string) => {
    const res = validateGateEntry(rawTicket, gateStaff.assignedStation, gateStaff.id);
    setLastScanResult(res);
  };

  const gateEvents = (events || []).filter(e => e.eventType === 'GATE_ENTRY' || e.eventType === 'DOUBLE_SPEND_BLOCKED').slice(0, 6);

  return (
    <div className="space-y-6 animate-fadeIn pb-12">
      {/* Gate Status & Headcount Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-slate-900/90 rounded-2xl p-5 border border-slate-800 shadow-lg flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold text-blue-400">بوابة الدخول 🚪</span>
              <span className="text-xs font-mono text-slate-400">{gateStaff.id}</span>
            </div>
            <h3 className="text-lg font-black text-white">{gateStaff.assignedStation}</h3>
            <p className="text-xs text-slate-400">المراقب: {gateStaff.name}</p>
          </div>

          <div className="mt-4 pt-3 border-t border-slate-800 text-xs flex justify-between text-slate-400">
            <span>وضع التحقق:</span>
            <span className={`font-bold ${isOnline ? 'text-emerald-400' : 'text-amber-400'}`}>
              {isOnline ? '🟢 Online Server' : '🟠 Offline Validation'}
            </span>
          </div>
        </div>

        {/* Total Admissions Today */}
        <div className="bg-slate-900/90 rounded-2xl p-5 border border-slate-800 shadow-lg flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold text-emerald-400 flex items-center gap-1.5">
                <Users className="w-4 h-4 text-emerald-400" />
                حركة الدخول اليومية (Gate Headcount)
              </span>
              <span className="text-xs text-slate-400 font-mono">سعة الحديقة</span>
            </div>
            <div className="flex items-baseline gap-2 mt-1">
              <span className="text-3xl font-black text-emerald-400 font-mono">
                {gateStaff.todayTransactionsCount + 412}
              </span>
              <span className="text-xs text-slate-400">زائر دخلوا الحديقة اليوم</span>
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-slate-800 text-xs flex justify-between text-slate-400">
            <span>معدل سرعة المسح:</span>
            <span className="text-white font-bold font-mono">0.4 ثانية / زائر ⚡</span>
          </div>
        </div>

        {/* Security / Hardware Notice */}
        <div className="bg-slate-900/90 rounded-2xl p-5 border border-slate-800 shadow-lg flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold text-purple-400 flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-purple-400" />
                معايير التحقق الأمني
              </span>
              <span className="text-[10px] bg-purple-500/10 text-purple-300 px-2 py-0.5 rounded border border-purple-500/20 font-bold">
                Anti-Replay Active
              </span>
            </div>
            <p className="text-xs text-slate-300 leading-relaxed">
              منع تصوير الشاشة وتكرار الدخول. كل تذكرة تتحول آلياً إلى حالة <code>VALIDATED</code> وتحدث مسار السلامة العائلية.
            </p>
          </div>

          <div className="mt-4 pt-3 border-t border-slate-800 text-xs text-slate-400 flex justify-between">
            <span>أجهزة البوابات:</span>
            <span className="text-slate-200 font-bold">هواتف الموظفين فقط 📱</span>
          </div>
        </div>
      </div>

      {/* Gate Turnstile Scanner Control Box */}
      <div className="bg-slate-900/90 rounded-2xl p-5 border border-slate-800 shadow-xl">
        <div className="flex items-center justify-between pb-4 border-b border-slate-800 mb-5">
          <div className="flex items-center gap-2">
            <ScanLine className="w-5 h-5 text-blue-400" />
            <h3 className="text-base font-black text-white">جهاز مسح تذاكر الدخول عند البوابة (Gate Scanner)</h3>
          </div>
          <span className="text-xs font-mono text-slate-400">
            {isOnline ? '🟢 متصل بالسيرفر' : '🟠 معالجة محلية بدون إنترنت'}
          </span>
        </div>

        {/* Scan Result Big Visual Chime Card */}
        {lastScanResult && (
          <div
            className={`p-5 rounded-2xl mb-6 border transition-all animate-fadeIn ${
              lastScanResult.success
                ? 'bg-emerald-950/90 border-emerald-500/60 text-emerald-100 shadow-lg shadow-emerald-950/40'
                : 'bg-rose-950/90 border-rose-500/60 text-rose-100 shadow-lg shadow-rose-950/40'
            }`}
          >
            <div className="flex items-center gap-4">
              <div
                className={`w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 ${
                  lastScanResult.success ? 'bg-emerald-500 text-slate-950' : 'bg-rose-500 text-white'
                }`}
              >
                {lastScanResult.success ? (
                  <CheckCircle2 className="w-7 h-7" />
                ) : (
                  <AlertOctagon className="w-7 h-7" />
                )}
              </div>
              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <h4 className="text-lg font-black">{lastScanResult.title}</h4>
                  <span className="text-xs font-mono px-2 py-0.5 rounded bg-black/30 font-bold">
                    {lastScanResult.details?.mode || (isOnline ? 'ONLINE' : 'OFFLINE')}
                  </span>
                </div>
                <p className="text-xs mt-1 opacity-90">{lastScanResult.message}</p>
                {lastScanResult.details && (
                  <div className="mt-2 text-xs flex gap-4 font-mono font-bold">
                    {lastScanResult.details.ticketId && <span>التذكرة: {lastScanResult.details.ticketId}</span>}
                    {lastScanResult.details.familyMemberName && <span>الزائر: {lastScanResult.details.familyMemberName}</span>}
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Quick 1-Click Simulation Triggers */}
        <div className="space-y-3">
          <div className="flex items-center gap-2 text-xs font-bold text-slate-400">
            <Zap className="w-4 h-4 text-amber-400" />
            <span>محاكاة مسح دخول سريعة لزوار العائلة (One-Click Gate Passes):</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <button
              onClick={() => handleScanTicket('T-000180')}
              className="p-3.5 bg-slate-800 hover:bg-slate-750 text-slate-200 border border-slate-700 hover:border-emerald-500/50 rounded-xl text-xs font-bold text-right flex flex-col gap-1 transition-all"
            >
              <div className="flex items-center justify-between text-white">
                <span>1. مسح تذكرة الأب (T-000180)</span>
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              </div>
              <span className="text-[10px] text-slate-400 font-mono">حساب محمد السالم (V-123765)</span>
            </button>

            <button
              onClick={() => handleScanTicket('T-000181')}
              className="p-3.5 bg-slate-800 hover:bg-slate-750 text-slate-200 border border-slate-700 hover:border-emerald-500/50 rounded-xl text-xs font-bold text-right flex flex-col gap-1 transition-all"
            >
              <div className="flex items-center justify-between text-white">
                <span>2. مسح تذكرة الأم (T-000181)</span>
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              </div>
              <span className="text-[10px] text-slate-400 font-mono">حساب أم سالم (نورة)</span>
            </button>

            <button
              onClick={() => handleScanTicket('T-999999_EXPIRED')}
              className="p-3.5 bg-slate-800 hover:bg-rose-950/30 text-rose-300 border border-slate-700 hover:border-rose-500/50 rounded-xl text-xs font-bold text-right flex flex-col gap-1 transition-all"
            >
              <div className="flex items-center justify-between text-rose-300">
                <span>3. اختبار تذكرة غير مسجلة</span>
                <AlertOctagon className="w-4 h-4 text-rose-400" />
              </div>
              <span className="text-[10px] text-slate-500 font-mono">رمز وهمي لاختبار الرفض</span>
            </button>
          </div>

          {/* Manual Ticket Input */}
          <div className="mt-4 pt-4 border-t border-slate-800 flex items-center gap-3">
            <input
              type="text"
              value={manualTicketInput}
              onChange={(e) => setManualTicketInput(e.target.value)}
              placeholder="أدخل رقم التذكرة (مثال: T-000182)"
              className="flex-1 p-2.5 bg-slate-950 border border-slate-700 rounded-xl text-xs text-white font-mono focus:outline-none focus:border-blue-500"
            />
            <button
              onClick={() => handleScanTicket(manualTicketInput)}
              className="py-2.5 px-5 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs font-black transition-all"
            >
              تحقق ودخول 🚪
            </button>
          </div>
        </div>
      </div>

      {/* Live Gate Admission Feed */}
      <div className="bg-slate-900/90 rounded-2xl p-5 border border-slate-800 shadow-xl">
        <div className="flex items-center gap-2 pb-3 border-b border-slate-800 mb-3 text-slate-300 text-xs font-bold">
          <Clock className="w-4 h-4 text-blue-400" />
          <span>سجل الدخول اللحظي عبر البوابة:</span>
        </div>

        <div className="space-y-2">
          {gateEvents.map(evt => (
            <div
              key={evt.id}
              className="p-3 bg-slate-950 rounded-xl border border-slate-800/80 flex items-center justify-between text-xs"
            >
              <div>
                <div className="font-bold text-white">{evt.notes}</div>
                <div className="text-[10px] text-slate-500 font-mono mt-0.5">
                  {evt.timestamp} • {evt.validationMode === 'ONLINE' ? '🟢 Online' : '🟠 Offline'} • تذكرة: {evt.ticketId || 'N/A'}
                </div>
              </div>
              <span
                className={`px-2 py-0.5 rounded font-bold font-mono text-[10px] ${
                  evt.status === 'SUCCESS' ? 'bg-emerald-950 text-emerald-400' : 'bg-rose-950 text-rose-400'
                }`}
              >
                {evt.status}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
