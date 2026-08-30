import React, { useState } from 'react';
import { usePark } from '../../context/ParkContext';
import { encodeQRPayload, generateNonce } from '../../utils/crypto';
import { 
  Gamepad2, 
  ScanLine, 
  CheckCircle2, 
  AlertOctagon, 
  Coins, 
  Ticket as TicketIcon, 
  Users, 
  Clock, 
  Zap, 
  Compass, 
  Car, 
  Smile, 
  Anchor, 
  Waves 
} from 'lucide-react';

export const AttractionOperatorPortal: React.FC = () => {
  const { 
    attractions, 
    visitor, 
    consumeRideAction, 
    employees, 
    isOnline, 
    openScannerModal 
  } = usePark();

  const operator = employees.find(e => e.role === 'attraction_staff') || employees[2];
  const [selectedAttractionId, setSelectedAttractionId] = useState<string>('attr-2'); // Ferris wheel default
  const [lastRideResult, setLastRideResult] = useState<any>(null);

  const currentAttraction = attractions.find(a => a.id === selectedAttractionId) || attractions[0];

  const getAttractionIcon = (iconName: string) => {
    switch (iconName) {
      case 'Zap': return <Zap className="w-5 h-5" />;
      case 'Compass': return <Compass className="w-5 h-5" />;
      case 'Car': return <Car className="w-5 h-5" />;
      case 'Smile': return <Smile className="w-5 h-5" />;
      case 'Anchor': return <Anchor className="w-5 h-5" />;
      case 'Waves': return <Waves className="w-5 h-5" />;
      default: return <Gamepad2 className="w-5 h-5" />;
    }
  };

  const handleScanUsage = () => {
    openScannerModal({
      title: `تشغيل لعبة (${currentAttraction.nameAr})`,
      targetAction: 'استهلاك تذكرة أو وحدات',
      targetAttractionId: currentAttraction.id,
      onScanSuccess: (rawCode) => {
        const res = consumeRideAction(currentAttraction.id, rawCode, operator.id);
        setLastRideResult(res);
        return res;
      }
    });
  };

  // Quick 1-Click Ride Simulator Triggers (e.g. Ahmed riding Ferris wheel or Bumper cars)
  const handleQuickAhmedRide = () => {
    const payload = encodeQRPayload({
      qrType: 'USAGE_QR',
      visitorId: visitor.id,
      ticketId: 'T-000182',
      familyMemberId: 'mem-3',
      attractionId: currentAttraction.id,
      timestamp: Date.now(),
      nonce: generateNonce()
    });
    const res = consumeRideAction(currentAttraction.id, payload, operator.id);
    setLastRideResult(res);
  };

  const handleQuickDirectUnitsRide = () => {
    const payload = encodeQRPayload({
      qrType: 'USAGE_QR',
      visitorId: visitor.id,
      attractionId: currentAttraction.id,
      unitsAmount: currentAttraction.priceUnits,
      timestamp: Date.now(),
      nonce: generateNonce()
    });
    const res = consumeRideAction(currentAttraction.id, payload, operator.id);
    setLastRideResult(res);
  };

  return (
    <div className="space-y-6 animate-fadeIn pb-12">
      {/* Attraction Selector Bar */}
      <div className="bg-slate-900/90 rounded-2xl p-4 border border-slate-800 shadow-xl">
        <div className="flex items-center justify-between pb-3 border-b border-slate-800 mb-3 text-xs text-slate-400">
          <span className="font-bold text-white flex items-center gap-1.5">
            <Gamepad2 className="w-4 h-4 text-purple-400" />
            اختر محطة اللعبة النشطة (Attraction Station):
          </span>
          <span className="font-mono text-slate-400">المشغل: {operator.name}</span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-2.5">
          {attractions.map((attr) => {
            const isSelected = attr.id === selectedAttractionId;
            return (
              <button
                key={attr.id}
                onClick={() => {
                  setSelectedAttractionId(attr.id);
                  setLastRideResult(null);
                }}
                className={`p-3 rounded-xl border text-right transition-all flex flex-col justify-between gap-2 ${
                  isSelected
                    ? 'bg-purple-950/60 border-purple-500 text-purple-200 ring-1 ring-purple-500'
                    : 'bg-slate-950 border-slate-800 text-slate-400 hover:bg-slate-800'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className={isSelected ? 'text-purple-400' : 'text-slate-500'}>
                    {getAttractionIcon(attr.icon)}
                  </span>
                  <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-slate-900 font-bold text-amber-300">
                    {attr.priceUnits} 🪙
                  </span>
                </div>
                <div>
                  <h4 className="font-bold text-xs text-white leading-tight">{attr.nameAr}</h4>
                  <span className="text-[10px] text-slate-500">{attr.zone}</span>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Selected Attraction KPI & Details Header */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-slate-900/90 rounded-2xl p-5 border border-slate-800 shadow-lg flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold text-purple-400">بيانات المحطة 🎢</span>
              {currentAttraction.isFrozenForSafety ? (
                <span className="text-xs font-mono text-rose-400 font-black px-2 py-0.5 rounded bg-rose-950/80 border border-rose-600/80 animate-pulse">
                  ❄️ مجمّدة للسلامة
                </span>
              ) : (
                <span className="text-xs font-mono text-emerald-400 font-bold">{currentAttraction.status}</span>
              )}
            </div>
            <h3 className="text-xl font-black text-white">{currentAttraction.nameAr}</h3>
            <p className="text-xs text-slate-400 mt-0.5">{currentAttraction.nameEn}</p>
          </div>

          <div className="mt-4 pt-3 border-t border-slate-800 text-xs flex justify-between text-slate-300">
            <span>سعر اللعبة:</span>
            <strong className="text-amber-400 font-mono font-black">{currentAttraction.priceUnits} وحدة حديقة 🪙</strong>
          </div>
        </div>

        {/* Throughput & Capacity */}
        <div className="bg-slate-900/90 rounded-2xl p-5 border border-slate-800 shadow-lg flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold text-blue-400 flex items-center gap-1.5">
                <Users className="w-4 h-4 text-blue-400" />
                مرات الاستخدام اليوم (Throughput)
              </span>
              <span className="text-xs text-slate-400 font-mono">طاقة الاستيعاب: {currentAttraction.capacity}</span>
            </div>
            <div className="flex items-baseline gap-2 mt-1">
              <span className="text-3xl font-black text-white font-mono">
                {currentAttraction.totalRidesToday}
              </span>
              <span className="text-xs text-slate-400">جولة نفذت اليوم</span>
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-slate-800 text-xs flex justify-between text-slate-400">
            <span>متوسط وقت الانتظار:</span>
            <span className="text-white font-bold font-mono">{currentAttraction.avgWaitTimeMins} دقيقة ⏱️</span>
          </div>
        </div>

        {/* Safety & Child Tracking Checkpoint */}
        <div className="bg-slate-900/90 rounded-2xl p-5 border border-slate-800 shadow-lg flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold text-emerald-400">تحديث مسار السلامة العائلية 🛡️</span>
              <span className="text-[10px] text-slate-400 font-mono">Event Ledger Auto</span>
            </div>
            <p className="text-xs text-slate-300 leading-relaxed">
              كل مسح ناجح يحدث فوراً <strong>آخر نشاط مسجل للطفل</strong> في لوحة ولي الأمر دون الحاجة لأي جهاز تتبع أو مساس بالخصوصية.
            </p>
          </div>

          <div className="mt-4 pt-3 border-t border-slate-800 text-xs text-slate-400 flex justify-between">
            <span>وضع التحقق:</span>
            <span className={`font-bold ${isOnline ? 'text-emerald-400' : 'text-amber-400'}`}>
              {isOnline ? '🟢 Online' : '🟠 Offline Validated'}
            </span>
          </div>
        </div>
      </div>

      {/* Operator Ride Scanner Box */}
      <div className="bg-slate-900/90 rounded-2xl p-5 border border-slate-800 shadow-xl">
        <div className="flex items-center justify-between pb-4 border-b border-slate-800 mb-5">
          <div className="flex items-center gap-2">
            <ScanLine className="w-5 h-5 text-purple-400" />
            <h3 className="text-base font-black text-white">
              ماسح التذاكر والوحدات للعبة: {currentAttraction.nameAr}
            </h3>
          </div>
          <span className="text-xs font-mono text-amber-400 font-bold">
            التكلفة: {currentAttraction.priceUnits} وحدة / تذكرة
          </span>
        </div>

        {/* Scan Result Feedback Card */}
        {lastRideResult && (
          <div
            className={`p-5 rounded-2xl mb-6 border transition-all animate-fadeIn ${
              lastRideResult.success
                ? 'bg-emerald-950/90 border-emerald-500/60 text-emerald-100 shadow-lg shadow-emerald-950/40'
                : 'bg-rose-950/90 border-rose-500/60 text-rose-100 shadow-lg shadow-rose-950/40'
            }`}
          >
            <div className="flex items-center gap-4">
              <div
                className={`w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 ${
                  lastRideResult.success ? 'bg-emerald-500 text-slate-950' : 'bg-rose-500 text-white'
                }`}
              >
                {lastRideResult.success ? (
                  <CheckCircle2 className="w-7 h-7" />
                ) : (
                  <AlertOctagon className="w-7 h-7" />
                )}
              </div>
              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <h4 className="text-lg font-black">{lastRideResult.title}</h4>
                  <span className="text-xs font-mono px-2 py-0.5 rounded bg-black/30 font-bold">
                    {lastRideResult.details?.mode || (isOnline ? 'ONLINE' : 'OFFLINE')}
                  </span>
                </div>
                <p className="text-xs mt-1 opacity-90">{lastRideResult.message}</p>
                {lastRideResult.details && (
                  <div className="mt-2 text-xs flex gap-4 font-mono font-bold">
                    {lastRideResult.details.ticketId && <span>التذكرة/العملية: {lastRideResult.details.ticketId}</span>}
                    {lastRideResult.details.familyMemberName && <span>الفرد: {lastRideResult.details.familyMemberName}</span>}
                    {lastRideResult.details.remainingUnits !== undefined && (
                      <span className="text-amber-300">الرصيد المتبقي: {lastRideResult.details.remainingUnits} 🪙</span>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Scan Actions & 1-Click Triggers */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <button
            onClick={handleScanUsage}
            className="p-4 bg-purple-600 hover:bg-purple-500 text-white rounded-xl text-xs font-bold flex flex-col items-center justify-center gap-2 shadow-lg shadow-purple-900/40 transition-all sm:col-span-1"
          >
            <ScanLine className="w-6 h-6" />
            <span>فتح الكاميرا لمسح رمز QR الزائر 📱</span>
          </button>

          <button
            onClick={handleQuickAhmedRide}
            className="p-4 bg-slate-800 hover:bg-slate-750 text-slate-200 border border-slate-700 hover:border-emerald-500/50 rounded-xl text-xs font-bold text-right flex flex-col justify-between gap-1 transition-all"
          >
            <div className="flex items-center justify-between text-white">
              <span>محاكاة مسح تذكرة أحمد (T-000182)</span>
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            </div>
            <span className="text-[10px] text-slate-400">
              يستهلك تذكرة الطفل أحمد ويحدث مسار السلامة العائلية 🛡️
            </span>
          </button>

          <button
            onClick={handleQuickDirectUnitsRide}
            className="p-4 bg-slate-800 hover:bg-slate-750 text-slate-200 border border-slate-700 hover:border-amber-500/50 rounded-xl text-xs font-bold text-right flex flex-col justify-between gap-1 transition-all"
          >
            <div className="flex items-center justify-between text-white">
              <span>محاكاة خصم وحدات مباشر (-{currentAttraction.priceUnits} 🪙)</span>
              <Coins className="w-4 h-4 text-amber-400" />
            </div>
            <span className="text-[10px] text-slate-400">
              يخصم من رصيد وحدات الزائر ويسجل العملية في سجل الأحداث
            </span>
          </button>
        </div>
      </div>
    </div>
  );
};
