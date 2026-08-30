import React, { useState } from 'react';
import { usePark } from '../../../context/ParkContext';
import { 
  Ticket as TicketIcon, 
  Plus, 
  Minus, 
  Smartphone, 
  QrCode, 
  Printer, 
  Share2, 
  CheckCircle2, 
  Sparkles, 
  ArrowRight,
  ShieldCheck,
  Zap,
  Tag
} from 'lucide-react';
import { encodeQRPayload, generateNonce, sound } from '../../../utils/crypto';

export const Stage2TicketShop: React.FC = () => {
  const { 
    visitor, 
    tickets, 
    buyTicketsWithUnits, 
    showQRModal, 
    showThermalTickets,
    nextVisitorGameStage 
  } = usePark();

  const [ticketBuyCount, setTicketBuyCount] = useState<number>(6);
  const [actionSuccessMsg, setActionSuccessMsg] = useState<string | null>(null);

  const visitorTickets = (tickets || []).filter(t => t.visitorId === visitor?.id);
  const availableTickets = visitorTickets.filter(t => t.status === 'AVAILABLE' || t.status === 'VALIDATED');
  const requiredUnits = ticketBuyCount * 25;
  const hasEnoughUnits = (visitor?.unitsBalance ?? 0) >= requiredUnits;

  // Direct In-App Ticket Purchase
  const handleDirectBuyTickets = (isPaperPrint: boolean = false) => {
    sound.playCoinSound();
    try {
      const newTickets = buyTicketsWithUnits(ticketBuyCount, isPaperPrint);
      if (isPaperPrint) {
        showThermalTickets({
          tickets: newTickets,
          buyerName: visitor.name,
          buyerId: visitor.id,
          totalUnits: ticketBuyCount * 25
        });
      }
      setActionSuccessMsg(`🎉 تم إصدار ${ticketBuyCount} تذكرة بنجاح وربطها بهوية حسابك (${visitor.id})`);
      setTimeout(() => setActionSuccessMsg(null), 4000);
    } catch (err: any) {
      alert(err.message);
    }
  };

  // Cashier Purchase QR (Section 7)
  const handleShowPurchaseQRAtCashier = () => {
    sound.playPop();
    const payload = encodeQRPayload({
      qrType: 'PURCHASE_QR',
      visitorId: visitor.id,
      ticketsCount: ticketBuyCount,
      unitsAmount: ticketBuyCount * 25,
      timestamp: Date.now(),
      nonce: generateNonce()
    });

    showQRModal({
      title: `شراء ${ticketBuyCount} تذكرة بالوحدات`,
      subtitle: `اعرض هذا الرمز لموظف الكاشير لإصدار التذاكر وطباعتها فورياً (خصم ${ticketBuyCount * 25} وحدة)`,
      qrData: payload,
      qrType: 'PURCHASE_QR'
    });
  };

  // Generate Entry QR for Park Gate (Section 10)
  const handleShowEntryQR = (ticketId: string, memberId?: string) => {
    sound.playPop();
    const payload = encodeQRPayload({
      qrType: 'ENTRY_QR',
      visitorId: visitor.id,
      ticketId,
      familyMemberId: memberId,
      timestamp: Date.now(),
      nonce: generateNonce()
    });

    const member = visitor.familyMembers.find(m => m.id === memberId);
    showQRModal({
      title: `رمز دخول الحديقة - ${member?.name || visitor.name} 🚪`,
      subtitle: `التذكرة: ${ticketId} • امسح الرمز عند بوابة الدخول`,
      qrData: payload,
      qrType: 'ENTRY_QR'
    });
  };

  // Generate Usage QR for Rides (Section 10, 15)
  const handleShowUsageQR = (ticketId: string, memberId?: string) => {
    sound.playPop();
    const payload = encodeQRPayload({
      qrType: 'USAGE_QR',
      visitorId: visitor.id,
      ticketId,
      familyMemberId: memberId,
      timestamp: Date.now(),
      nonce: generateNonce()
    });

    const member = visitor.familyMembers.find(m => m.id === memberId);
    showQRModal({
      title: `رمز تشغيل اللعبة ${member ? `لـ (${member.name})` : ''} 🎡`,
      subtitle: `التذكرة: ${ticketId} • يمسحها مشغل اللعبة للتحقق واستهلاك التذكرة`,
      qrData: payload,
      qrType: 'USAGE_QR'
    });
  };

  // Offline Transfer QR (Section 14)
  const handleShowTransferQR = (ticketId: string) => {
    sound.playPop();
    const payload = encodeQRPayload({
      qrType: 'TRANSFER_QR',
      visitorId: visitor.id,
      ticketId,
      timestamp: Date.now(),
      nonce: generateNonce(),
      offlineSigned: true
    });

    showQRModal({
      title: `رمز نقل التذكرة (${ticketId}) أوفلاين 📲`,
      subtitle: `يمكن لهاتف زائر آخر أو موظف مسح هذا الرمز لنقل ملكية التذكرة إليه بدون إنترنت`,
      qrData: payload,
      qrType: 'TRANSFER_QR'
    });
  };

  return (
    <div className="space-y-6">
      {/* Toast Alert */}
      {actionSuccessMsg && (
        <div className="p-4 rounded-3xl bg-emerald-400 border-3 border-emerald-500 text-slate-950 flex items-center justify-between font-black shadow-lg animate-bounce-subtle">
          <div className="flex items-center gap-3">
            <CheckCircle2 className="w-6 h-6 stroke-[3]" />
            <span className="text-sm">{actionSuccessMsg}</span>
          </div>
        </div>
      )}

      {/* Ticket Counter & Purchase Hub */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 border-4 border-sky-300 dark:border-slate-800 shadow-2xl relative overflow-hidden">
        <div className="flex flex-col lg:flex-row items-center justify-between gap-6 pb-6 border-b-2 border-sky-100 dark:border-slate-800">
          <div className="space-y-2 text-center lg:text-right">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-sky-100 dark:bg-sky-950 text-sky-800 dark:text-sky-300 font-black text-xs border border-sky-300">
              <TicketIcon className="w-4 h-4 text-sky-500" />
              <span>إصدار تذاكر الدخول بالوحدات (Section 5) 🎟️</span>
            </div>
            <h3 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white">
              اختر عدد التذاكر المطلوبة:
            </h3>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 font-medium">
              سعر التذكرة الموحد: <strong className="text-sky-600 font-black">25 وحدة</strong> • التذاكر ترتبط بحسابك العائلي ({visitor.id})
            </p>
          </div>

          {/* Big Tactile Number Stepper */}
          <div className="flex items-center gap-4 bg-sky-50 dark:bg-slate-800 p-2.5 rounded-3xl border-3 border-sky-200 dark:border-slate-700 shadow-inner">
            <button
              onClick={() => {
                sound.playPop();
                setTicketBuyCount(Math.max(1, ticketBuyCount - 1));
              }}
              className="btn-game-white w-12 h-12 text-xl font-black flex items-center justify-center"
              title="تقليل التذاكر"
            >
              <Minus className="w-5 h-5 stroke-[3]" />
            </button>

            <div className="text-center px-4">
              <div className="text-4xl font-black font-changa text-sky-600 dark:text-sky-400 leading-none">
                {ticketBuyCount}
              </div>
              <div className="text-[11px] font-black text-slate-500 mt-1">تذاكر</div>
            </div>

            <button
              onClick={() => {
                sound.playPop();
                setTicketBuyCount(ticketBuyCount + 1);
              }}
              className="btn-game-sky w-12 h-12 text-xl font-black flex items-center justify-center"
              title="زيادة التذاكر"
            >
              <Plus className="w-5 h-5 stroke-[3]" />
            </button>
          </div>
        </div>

        {/* Cost Summary & Balance Comparison */}
        <div className="py-4 flex flex-wrap items-center justify-between gap-4 text-xs">
          <div className="flex items-center gap-2">
            <span className="font-bold text-slate-600 dark:text-slate-400">التكلفة الإجمالية:</span>
            <span className="text-2xl font-black text-amber-500 font-changa">
              {requiredUnits} وحدة 🪙
            </span>
          </div>

          <div className="flex items-center gap-2">
            <span className="font-bold text-slate-600 dark:text-slate-400">رصيدك المتاح:</span>
            <span className={`text-base font-black font-changa ${hasEnoughUnits ? 'text-emerald-500' : 'text-rose-500'}`}>
              {visitor.unitsBalance} وحدة 🪙
            </span>
            {!hasEnoughUnits && (
              <span className="px-2 py-0.5 rounded-full bg-rose-100 text-rose-800 font-black text-[10px]">
                الرصيد لا يكفي! اشحن من المرحلة 1
              </span>
            )}
          </div>
        </div>

        {/* 3 Purchase Channels (Sections 5, 7, 33) */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-2">
          {/* Mode 1: Instant In-App */}
          <div className="bg-sky-50 dark:bg-slate-800/80 rounded-2xl p-4 border-2 border-sky-200 dark:border-slate-700 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-black text-sky-900 dark:text-sky-300">1. تذاكر رقمية فورية 📱</span>
                <Smartphone className="w-5 h-5 text-sky-500" />
              </div>
              <p className="text-xs text-slate-600 dark:text-slate-400 font-medium mb-3">
                خصم الوحدات فورياً وتوليد التذاكر بمحفظتك على الهاتف مباشرة.
              </p>
            </div>
            <button
              onClick={() => handleDirectBuyTickets(false)}
              disabled={!hasEnoughUnits}
              className="btn-game-sky w-full py-2.5 text-xs font-black flex items-center justify-center gap-1.5 disabled:opacity-40"
            >
              <span>إصدار {ticketBuyCount} تذكرة رقمية</span>
            </button>
          </div>

          {/* Mode 2: Cashier QR Scan */}
          <div className="bg-amber-50 dark:bg-slate-800/80 rounded-2xl p-4 border-2 border-amber-200 dark:border-slate-700 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-black text-amber-900 dark:text-amber-300">2. رمز الشراء للكاشير 🎟️</span>
                <QrCode className="w-5 h-5 text-amber-500" />
              </div>
              <p className="text-xs text-slate-600 dark:text-slate-400 font-medium mb-3">
                عرض Purchase QR لكاشير الحديقة لمسحه والخصم وطباعة التذاكر.
              </p>
            </div>
            <button
              onClick={handleShowPurchaseQRAtCashier}
              disabled={!hasEnoughUnits}
              className="btn-game-amber w-full py-2.5 text-xs font-black flex items-center justify-center gap-1.5 disabled:opacity-40"
            >
              <span>توليد Purchase QR</span>
            </button>
          </div>

          {/* Mode 3: Thermal Hybrid Paper */}
          <div className="bg-blue-50 dark:bg-slate-800/80 rounded-2xl p-4 border-2 border-blue-200 dark:border-slate-700 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-black text-blue-900 dark:text-blue-300">3. طباعة تذاكر ورقية 🖨️</span>
                <Printer className="w-5 h-5 text-blue-500" />
              </div>
              <p className="text-xs text-slate-600 dark:text-slate-400 font-medium mb-3">
                إصدار تذاكر ورقية باركود مطبوعة مرتبطة بالحساب (Digital First - Paper Supported).
              </p>
            </div>
            <button
              onClick={() => handleDirectBuyTickets(true)}
              disabled={!hasEnoughUnits}
              className="btn-game-white w-full py-2.5 text-xs font-black flex items-center justify-center gap-1.5 disabled:opacity-40"
            >
              <span>شراء ومعاينة الطباعة</span>
            </button>
          </div>
        </div>
      </div>

      {/* Tickets Deck (Wallet Carousel) */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-2xl bg-sky-400 text-slate-950 font-black">
              <TicketIcon className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-lg font-black text-slate-900 dark:text-white">محفظة وبطاقات التذاكر ({visitorTickets.length} تذكرة) 🎟️</h4>
              <p className="text-xs text-slate-600 dark:text-slate-400 font-medium">انقر على أي تذكرة لعرض رمز الدخول أو تشغيل اللعبة</p>
            </div>
          </div>

          <span className="px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 font-black text-xs border border-emerald-300">
            {availableTickets.length} صالحة للاستخدام ✓
          </span>
        </div>

        {visitorTickets.length === 0 ? (
          <div className="bg-white dark:bg-slate-900 rounded-3xl p-8 border-3 border-dashed border-sky-300 dark:border-slate-800 text-center space-y-3">
            <TicketIcon className="w-12 h-12 text-sky-400 mx-auto animate-bounce-subtle" />
            <h5 className="text-base font-black text-slate-900 dark:text-white">محفظة التذاكر فارغة حالياً</h5>
            <p className="text-xs text-slate-500 max-w-sm mx-auto">
              اختر عدد التذاكر في الأعلى واضغط على "إصدار تذاكر رقمية" لملء محفظتك والاستمتاع بألعاب الحديقة!
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {visitorTickets.map((t) => {
              const member = visitor.familyMembers.find(m => m.id === t.familyMemberId);
              const isConsumed = t.status === 'CONSUMED';
              const isValidated = t.status === 'VALIDATED';

              return (
                <div
                  key={t.id}
                  className={`rounded-3xl p-4 border-3 transition-all duration-200 flex flex-col justify-between ${
                    isConsumed
                      ? 'bg-slate-100 dark:bg-slate-900/50 border-slate-300 dark:border-slate-800 opacity-60'
                      : isValidated
                      ? 'bg-blue-50 dark:bg-slate-800 border-blue-400 shadow-md ring-2 ring-blue-300'
                      : 'bg-white dark:bg-slate-800 border-sky-300 shadow-md hover:border-sky-500'
                  }`}
                >
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-1.5">
                        <Tag className="w-4 h-4 text-sky-500" />
                        <span className="font-mono font-black text-sm text-slate-900 dark:text-white">{t.id}</span>
                      </div>
                      <span className={`text-[10px] px-2.5 py-0.5 rounded-full font-black ${
                        isConsumed
                          ? 'bg-rose-100 text-rose-800 border border-rose-300'
                          : isValidated
                          ? 'bg-blue-100 text-blue-800 border border-blue-300'
                          : 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                      }`}>
                        {isConsumed ? 'مستهلكة ❌' : isValidated ? 'تم التحقق بالبوابة 🚪' : 'متاحة وجاهزة 🟢'}
                      </span>
                    </div>

                    <div className="bg-sky-50/70 dark:bg-slate-900/60 rounded-2xl p-2.5 text-xs text-slate-600 dark:text-slate-300 space-y-1 mb-3">
                      <div>المخصص له: <strong className="text-slate-900 dark:text-white font-black">{member?.name || 'حامل الهاتف'}</strong></div>
                      <div>النوع: <span className="font-bold">{t.isPhysicalPaper ? 'ورقية مربوطة رقمياً 🖨️' : 'رقمية على الهاتف 📱'}</span></div>
                      {t.consumedAtLocationName && (
                        <div className="text-rose-600 font-bold">تم الاستخدام في: {t.consumedAtLocationName}</div>
                      )}
                    </div>
                  </div>

                  {!isConsumed && (
                    <div className="pt-2 border-t border-sky-100 dark:border-slate-700 flex items-center gap-2">
                      <button
                        onClick={() => handleShowEntryQR(t.id, t.familyMemberId)}
                        className="btn-game-sky flex-1 py-2 text-xs font-black flex items-center justify-center gap-1"
                        title="عرض رمز الدخول عند بوابة الحديقة"
                      >
                        <QrCode className="w-3.5 h-3.5" />
                        <span>دخول الحديقة 🚪</span>
                      </button>

                      <button
                        onClick={() => handleShowUsageQR(t.id, t.familyMemberId)}
                        className="btn-game-amber flex-1 py-2 text-xs font-black flex items-center justify-center gap-1"
                        title="عرض رمز تشغيل اللعبة"
                      >
                        <Zap className="w-3.5 h-3.5" />
                        <span>لعب 🎡</span>
                      </button>

                      <button
                        onClick={() => handleShowTransferQR(t.id)}
                        className="btn-game-white p-2 text-xs font-bold"
                        title="نقل التذكرة إلى هاتف آخر أوفلاين"
                      >
                        <Share2 className="w-3.5 h-3.5 text-slate-700" />
                      </button>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Next Stage Navigation CTA */}
      <div className="bg-sky-50 dark:bg-slate-900 rounded-3xl p-5 border-3 border-sky-200 dark:border-slate-800 shadow-md flex items-center justify-between">
        <div>
          <h5 className="text-base font-black text-slate-900 dark:text-white">المرحلة التالية: رادار العائلة والسلامة 👨‍👩‍👧‍👦</h5>
          <p className="text-xs text-slate-600 dark:text-slate-400 font-medium">
            توزيع التذاكر على أفراد العائلة ومتابعة آخر الأنشطة المسجلة بأمان
          </p>
        </div>
        <button
          onClick={() => {
            sound.playLevelUp();
            nextVisitorGameStage();
          }}
          className="btn-game-sky px-6 py-2.5 text-xs font-black shrink-0"
        >
          الانتقال للمرحلة 3 (العائلة) ➔
        </button>
      </div>
    </div>
  );
};
