import React from 'react';
import { usePark } from '../../../context/ParkContext';
import { 
  Gamepad2, 
  Coins, 
  Ticket as TicketIcon, 
  Clock, 
  Flame, 
  Compass, 
  Sparkles, 
  Play, 
  MapPin,
  CheckCircle,
  ArrowRight
} from 'lucide-react';
import { encodeQRPayload, generateNonce, sound } from '../../../utils/crypto';

export const Stage4AttractionsArena: React.FC = () => {
  const { 
    visitor, 
    tickets, 
    attractions, 
    showQRModal, 
    openCastleMap,
    nextVisitorGameStage 
  } = usePark();

  const availableTickets = (tickets || []).filter(t => t.visitorId === visitor?.id && (t.status === 'AVAILABLE' || t.status === 'VALIDATED'));

  // Trigger Ride Usage QR with Ticket
  const handlePlayWithTicket = (attractionName: string) => {
    sound.playPop();
    const ticket = availableTickets[0];
    const payload = encodeQRPayload({
      qrType: 'USAGE_QR',
      visitorId: visitor.id,
      ticketId: ticket ? ticket.id : undefined,
      timestamp: Date.now(),
      nonce: generateNonce()
    });

    showQRModal({
      title: `تشغيل لعبة ${attractionName} 🎡`,
      subtitle: ticket 
        ? `التذكرة: ${ticket.id} • امسح الرمز لدى المشغل لبدء الجولة`
        : `خصم وحدات مباشر من الرصيد (${visitor.unitsBalance} وحدة)`,
      qrData: payload,
      qrType: 'USAGE_QR'
    });
  };

  // Trigger Ride Usage QR with Units
  const handlePlayWithUnits = (attractionName: string, unitsCost: number) => {
    sound.playPop();
    const payload = encodeQRPayload({
      qrType: 'USAGE_QR',
      visitorId: visitor.id,
      unitsAmount: unitsCost,
      timestamp: Date.now(),
      nonce: generateNonce()
    });

    showQRModal({
      title: `دفع ${unitsCost} وحدات لتشغيل ${attractionName} 🪙`,
      subtitle: `سيتم خصم ${unitsCost} وحدة من رصيدك (${visitor.unitsBalance} متاح)`,
      qrData: payload,
      qrType: 'USAGE_QR'
    });
  };

  return (
    <div className="space-y-6">
      {/* Attractions Hero Card with Castle Map Shortcut */}
      <div className="bg-gradient-to-br from-purple-500 via-indigo-500 to-purple-600 rounded-3xl p-6 sm:p-8 border-4 border-purple-300 shadow-2xl text-white relative overflow-hidden">
        <div className="flex flex-col lg:flex-row items-center justify-between gap-6 relative z-10">
          <div className="space-y-2 text-center lg:text-right">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/90 text-purple-950 font-black text-xs shadow-sm">
              <Gamepad2 className="w-4 h-4 text-purple-600" />
              <span>حلبة وتحديات قلعة الحصن 🏰</span>
            </div>

            <h3 className="text-2xl sm:text-3xl font-black">
              ألعاب ومحطات الحديقة التفاعلية 🎢
            </h3>

            <p className="text-xs sm:text-sm font-medium text-purple-100 max-w-xl">
              تصفح كل ألعاب ومحطات الحديقة، أوقات الانتظار الفعلية، أسعار الوحدات، وشغّل اللعبة فوراً بمسح رمز QR لدى مشغل المحطة.
            </p>
          </div>

          <button
            onClick={() => openCastleMap()}
            className="btn-game-white py-4 px-6 text-sm font-black flex items-center justify-center gap-2.5 shadow-2xl shrink-0"
          >
            <Compass className="w-6 h-6 text-purple-600 animate-spin-slow" />
            <span>عرض خريطة الحصن التفاعلية 🏯</span>
          </button>
        </div>
      </div>

      {/* Attractions Grid */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-2xl bg-purple-400 text-slate-950 font-black">
              <Flame className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-lg font-black text-slate-900 dark:text-white">قائمة الألعاب والمحطات النشطة ({attractions.length} لعبة) 🎡</h4>
              <p className="text-xs text-slate-600 dark:text-slate-400 font-medium">خصم تذكرة أو خصم وحدات مباشر (Section 18)</p>
            </div>
          </div>

          <div className="flex items-center gap-2 text-xs font-bold text-slate-600 dark:text-slate-400">
            <span>التذاكر الصالحة: <strong className="text-sky-600 font-black">{availableTickets.length}</strong></span>
            <span>•</span>
            <span>الرصيد: <strong className="text-amber-500 font-black">{visitor.unitsBalance} 🪙</strong></span>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {attractions.map((attraction) => {
            const isCrowded = attraction.waitTimeMinutes > 15;

            return (
              <div
                key={attraction.id}
                className="bg-white dark:bg-slate-800 rounded-3xl p-5 border-3 border-purple-200 dark:border-slate-700 shadow-lg flex flex-col justify-between hover:border-purple-400 transition-all group"
              >
                <div>
                  <div className="flex items-start justify-between mb-2">
                    <span className="px-3 py-1 rounded-full bg-purple-100 dark:bg-purple-950 text-purple-800 dark:text-purple-300 font-black text-xs border border-purple-300">
                      {attraction.zoneAr || 'منطقة الحصن'}
                    </span>

                    <div className="flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-amber-50 dark:bg-slate-900 border border-amber-300 text-amber-600 font-black text-xs">
                      <Coins className="w-3.5 h-3.5" />
                      <span>{attraction.unitsPrice} وحدات</span>
                    </div>
                  </div>

                  <h5 className="font-black text-lg text-slate-900 dark:text-white mt-2 mb-1 group-hover:text-purple-600 transition-colors">
                    {attraction.nameAr}
                  </h5>
                  <p className="text-xs text-slate-600 dark:text-slate-400 font-medium mb-3">
                    {attraction.descriptionAr || 'تجربة مغامرة مثيرة للأطفال والعائلة في قلب الحديقة.'}
                  </p>

                  <div className="bg-purple-50/70 dark:bg-slate-900/60 rounded-2xl p-3 border border-purple-200 dark:border-slate-700 text-xs space-y-1.5 mb-4">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-slate-500 flex items-center gap-1">
                        <Clock className="w-3.5 h-3.5 text-purple-500" />
                        وقت الانتظار التقريبي:
                      </span>
                      <span className={`font-black font-mono ${isCrowded ? 'text-rose-600' : 'text-emerald-600'}`}>
                        {attraction.waitTimeMinutes} دقيقة {isCrowded ? '🔥' : '🟢'}
                      </span>
                    </div>

                    <div className="flex items-center justify-between">
                      <span className="font-bold text-slate-500">حالة التشغيل:</span>
                      {attraction.isFrozenForSafety ? (
                        <span className="font-black text-rose-600 flex items-center gap-1">
                          ❄️ تجميد مؤقت للسلامة
                        </span>
                      ) : (
                        <span className="font-black text-emerald-600">تعمل بكفاءة ✓</span>
                      )}
                    </div>
                  </div>
                </div>

                {/* Frozen Safety Notice Banner */}
                {attraction.isFrozenForSafety && (
                  <div className="mb-3 p-2 bg-blue-50 dark:bg-blue-950/60 border border-blue-300 dark:border-blue-700 rounded-xl text-center text-[11px] font-bold text-blue-800 dark:text-blue-200">
                    ❄️ تم إيقاف استقبال التذاكر مؤقتاً لتخفيف الازدحام وفحص مسار الأمان.
                  </div>
                )}

                {/* Play CTAs */}
                <div className="pt-3 border-t border-purple-100 dark:border-slate-700 flex items-center gap-2">
                  <button
                    onClick={() => handlePlayWithTicket(attraction.nameAr)}
                    disabled={attraction.isFrozenForSafety}
                    className="btn-game-sky flex-1 py-2 text-xs font-black flex items-center justify-center gap-1 disabled:opacity-40 disabled:cursor-not-allowed"
                    title={attraction.isFrozenForSafety ? 'اللعبة مجمّدة مؤقتاً للسلامة' : 'استخدام تذكرة دخول للعبة'}
                  >
                    <TicketIcon className="w-3.5 h-3.5" />
                    <span>تذكرة 🎟️</span>
                  </button>

                  <button
                    onClick={() => handlePlayWithUnits(attraction.nameAr, attraction.unitsPrice)}
                    disabled={attraction.isFrozenForSafety}
                    className="btn-game-amber flex-1 py-2 text-xs font-black flex items-center justify-center gap-1 disabled:opacity-40 disabled:cursor-not-allowed"
                    title={attraction.isFrozenForSafety ? 'اللعبة مجمّدة مؤقتاً للسلامة' : 'خصم وحدات مباشر'}
                  >
                    <Coins className="w-3.5 h-3.5" />
                    <span>{attraction.unitsPrice} وحدات 🪙</span>
                  </button>

                  <button
                    onClick={() => openCastleMap(attraction.id)}
                    className="btn-game-white p-2 text-xs font-bold"
                    title="عرض موقع المحطة على خريطة الحصن"
                  >
                    <Compass className="w-3.5 h-3.5 text-purple-600" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Next Stage Navigation CTA */}
      <div className="bg-purple-50 dark:bg-slate-900 rounded-3xl p-5 border-3 border-purple-200 dark:border-slate-800 shadow-md flex items-center justify-between">
        <div>
          <h5 className="text-base font-black text-slate-900 dark:text-white">المرحلة التالية: سجل المغامرة والإنجازات 📜</h5>
          <p className="text-xs text-slate-600 dark:text-slate-400 font-medium">
            متابعة كل العمليات التاريخية وسجل التحقق الأمني
          </p>
        </div>
        <button
          onClick={() => {
            sound.playLevelUp();
            nextVisitorGameStage();
          }}
          className="btn-game-purple px-6 py-2.5 text-xs font-black shrink-0"
        >
          الانتقال للمرحلة 5 (السجل) ➔
        </button>
      </div>
    </div>
  );
};
