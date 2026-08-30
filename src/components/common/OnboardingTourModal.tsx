import React, { useState } from 'react';
import { usePark } from '../../context/ParkContext';
import { sound, encodeQRPayload, generateNonce } from '../../utils/crypto';
import { 
  Sparkles, 
  CheckCircle2, 
  Smartphone, 
  Coins, 
  Ticket as TicketIcon, 
  ShieldCheck, 
  WifiOff, 
  ArrowLeft, 
  ArrowRight, 
  X, 
  Play, 
  HelpCircle,
  Users,
  Compass,
  QrCode,
  ShieldAlert,
  Flame,
  Zap,
  Lock
} from 'lucide-react';

export const OnboardingTourModal: React.FC = () => {
  const { 
    isOnboardingOpen, 
    closeOnboarding, 
    openCastleMap,
    visitor, 
    buyUnits,
    buyTicketsWithUnits,
    showQRModal,
    validateGateEntry,
    tickets
  } = usePark();

  const [currentStep, setCurrentStep] = useState<number>(1);
  const [interactiveFeedback, setInteractiveFeedback] = useState<string | null>(null);

  if (!isOnboardingOpen) return null;

  const totalSteps = 6;

  const handleNext = () => {
    sound.playStepSound();
    if (currentStep < totalSteps) {
      setCurrentStep(prev => prev + 1);
      setInteractiveFeedback(null);
    } else {
      handleCompleteAndOpenMap();
    }
  };

  const handlePrev = () => {
    sound.playStepSound();
    if (currentStep > 1) {
      setCurrentStep(prev => prev - 1);
      setInteractiveFeedback(null);
    }
  };

  const handleCompleteAndOpenMap = () => {
    closeOnboarding();
    openCastleMap();
  };

  const handleTryBuyUnitsBonus = () => {
    buyUnits(20, 'عرض البداية الترحيبي');
    setInteractiveFeedback('🎉 رائع! تم شحن 100 وحدة حديقة تجريبية في حسابك.');
    sound.playSuccess();
  };

  const handleTryShowPurchaseQR = () => {
    const payload = encodeQRPayload({
      qrType: 'PURCHASE_QR',
      visitorId: visitor.id,
      ticketsCount: 6,
      unitsAmount: 150,
      timestamp: Date.now(),
      nonce: generateNonce()
    });

    showQRModal({
      title: 'رمز الشراء من الكاشير (Purchase QR)',
      subtitle: 'يمسحه الكاشير لخصم الوحدات وطباعة تذاكر ورقية مربوطة بالحساب رقمياً',
      qrData: payload,
      qrType: 'PURCHASE_QR'
    });
  };

  const handleTryGateScan = () => {
    const res = validateGateEntry(tickets[0]?.id || 'T-000180', 'بوابة الحصن الرئيسية A', 'EMP-004');
    setInteractiveFeedback(res.message);
  };

  const stepsData = [
    {
      step: 1,
      badge: 'الفلسفة والمبدأ 📱',
      title: 'الهاتف أولاً (Phone First) — لا أجهزة إضافية',
      icon: <Smartphone className="w-8 h-8 text-emerald-400" />,
      tagline: 'نظام رقمي ذكي يدير الحديقة بالكامل عبر هواتف الزوار والموظفين فقط',
      content: (
        <div className="space-y-3 text-xs text-slate-300">
          <p className="leading-relaxed">
            مرحباً بك في <strong className="text-white">نظام Sirafi tickets</strong>، نظام متكامل لإدارة التذاكر والوحدات والدخول والألعاب والسلامة العائلية.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-2">
            <div className="p-3 bg-slate-950/80 rounded-2xl border border-slate-800">
              <div className="font-bold text-white mb-1 flex items-center gap-1.5">
                <span className="text-emerald-400">📱 هاتف الزائر والموظف:</span>
              </div>
              <p className="text-[11px] text-slate-400">
                شراء، فحص تذاكر، دخول الألعاب، ومتابعة العائلة باستخدام أي هاتف ذكي بكاميرا عادية.
              </p>
            </div>

            <div className="p-3 bg-slate-950/80 rounded-2xl border border-slate-800">
              <div className="font-bold text-rose-400 mb-1 flex items-center gap-1.5">
                <span>🚫 لا أجهزة إضافية:</span>
              </div>
              <p className="text-[11px] text-slate-400">
                لا قارئات خاصة، لا أساور RFID، لا بوابات إلكترونية معقدة ومكلفة، ولا بطاقات بلاستيكية.
              </p>
            </div>
          </div>
        </div>
      )
    },
    {
      step: 2,
      badge: 'العملة الداخلية 🪙',
      title: 'هوية الزائر ونظام وحدات الحديقة',
      icon: <Coins className="w-8 h-8 text-amber-400" />,
      tagline: 'الوحدات رصيد استخدام داخلي لشراء التذاكر وخوض مغامرات الألعاب',
      content: (
        <div className="space-y-3 text-xs text-slate-300">
          <p className="leading-relaxed">
            يحصل كل زائر مسجل على معرف دائم <strong className="text-amber-300 font-mono">Visitor ID ({visitor.id})</strong>. الوحدات ليست محفظة عامة بل رصيد داخلي (1 ريال = 5 وحدات).
          </p>
          <div className="p-3.5 bg-amber-950/40 border border-amber-500/30 rounded-2xl flex items-center justify-between">
            <div>
              <div className="text-[11px] text-amber-300">رصيدك الحالي من الوحدات:</div>
              <div className="text-xl font-black text-amber-400 font-mono">{visitor.unitsBalance} وحدة</div>
            </div>
            <button
              onClick={handleTryBuyUnitsBonus}
              className="px-3 py-2 bg-amber-500 hover:bg-amber-400 text-slate-950 rounded-xl font-bold text-xs transition-all shadow-md shadow-amber-900/30"
            >
              + شحن 100 وحدة تجريبية
            </button>
          </div>
        </div>
      )
    },
    {
      step: 3,
      badge: 'التذاكر الهجينة 🎟️',
      title: 'شراء التذاكر الرقمية والورقية المربوطة',
      icon: <TicketIcon className="w-8 h-8 text-blue-400" />,
      tagline: 'الورق مدعوم ومربوط بالحساب رقمياً دون كسر معايير النظام (Hybrid)',
      content: (
        <div className="space-y-3 text-xs text-slate-300">
          <p className="leading-relaxed">
            يمكنك تحويل وحداتك إلى تذاكر فورية (25 وحدة للتذكرة). والتذكرة الورقية المطبوعة ليست مجهولة بل تحمل رقماً مربوطاً بهوية حسابك (T-000182 ➔ V-123765).
          </p>
          <div className="flex items-center gap-2 pt-1">
            <button
              onClick={handleTryShowPurchaseQR}
              className="flex-1 py-2.5 px-3 bg-slate-800 hover:bg-slate-700 text-amber-300 border border-amber-500/30 rounded-xl font-bold flex items-center justify-center gap-1.5 transition-all"
            >
              <QrCode className="w-4 h-4" />
              <span>تجربة توليد Purchase QR للكاشير</span>
            </button>
          </div>
        </div>
      )
    },
    {
      step: 4,
      badge: 'الحماية الصارمة 🔐',
      title: 'بوابات العبور ومكافحة تكرار الرمز (Anti-Replay)',
      icon: <Lock className="w-8 h-8 text-purple-400" />,
      tagline: 'منع تصوير الشاشة واستخدام نفس رمز الاستجابة مرتين',
      content: (
        <div className="space-y-3 text-xs text-slate-300">
          <p className="leading-relaxed">
            يستخدم كل رمز QR تشفيراً فريداً يحتوي على <strong className="text-white font-mono">Nonce + Timestamp + Signature</strong>. أي محاولة لإعادة استخدام رمز ممسوح أو مصور تُحجب فورياً.
          </p>
          <div className="flex items-center gap-2 pt-1">
            <button
              onClick={handleTryGateScan}
              className="flex-1 py-2.5 px-3 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl font-bold flex items-center justify-center gap-1.5 transition-all shadow-md shadow-emerald-950"
            >
              <ShieldCheck className="w-4 h-4" />
              <span>تجربة فحص تذكرة الدخول للبوابة</span>
            </button>
          </div>
        </div>
      )
    },
    {
      step: 5,
      badge: 'السلامة العائلية 🛡️',
      title: 'سجل تحركات الأطفال واستنفار الأمن SOS',
      icon: <Users className="w-8 h-8 text-rose-400" />,
      tagline: 'تتبع آخر نشاط مسجل في الألعاب دون تتبع GPS تجسسي لراحة بال الوالدين',
      content: (
        <div className="space-y-3 text-xs text-slate-300">
          <p className="leading-relaxed">
            يسجل النظام آخر لعبة استخدمها كل طفل (مثال: أحمد ➔ 21:03 عجلة بانوراما). وفي حالة الفقدان، يرسل ولي الأمر بلاغاً فورياً لغرفة الأمن في ثوانٍ.
          </p>
          <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 text-[11px] space-y-1">
            <div className="text-emerald-400 font-bold">آخر مسار مسجل للطفل أحمد:</div>
            <div className="text-slate-300">20:12 عالم الصغار (#4) ➔ 20:41 سيارات التصادم (#3) ➔ 21:03 عجلة بانوراما (#2)</div>
          </div>
        </div>
      )
    },
    {
      step: 6,
      badge: 'الاستمرارية دون اتصال ⚡',
      title: 'الوضع غير المتصل التلقائي (Offline First)',
      icon: <WifiOff className="w-8 h-8 text-amber-400" />,
      tagline: 'النظام يستمر بكامل طاقته عند انقطاع الإنترنت مع مزامنة متسقة',
      content: (
        <div className="space-y-3 text-xs text-slate-300">
          <p className="leading-relaxed">
            إذا انقطع الإنترنت في الحديقة، ينتقل النظام تلقائياً للتحقق المحلي عبر التواقيع المشفرة والمخزون المخصص لموظف البيع، ثم يزامن العمليات تلقائياً فور عودة الاتصال!
          </p>
          <div className="p-3.5 bg-gradient-to-r from-amber-500/20 via-emerald-500/20 to-teal-500/20 rounded-2xl border border-amber-500/40 text-center font-bold text-white text-xs">
            أنت الآن جاهز لخوض غمار خريطة الحصن التفاعلية! 🏯
          </div>
        </div>
      )
    }
  ];

  const currentStepObj = stepsData[currentStep - 1];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/90 backdrop-blur-md animate-fadeIn">
      <div className="bg-slate-900 border border-slate-700/80 rounded-3xl p-5 sm:p-7 shadow-2xl text-slate-100 max-w-xl w-full flex flex-col justify-between relative overflow-hidden">
        
        {/* Background Aura */}
        <div className="absolute top-0 right-0 w-48 h-48 bg-amber-500/5 rounded-full blur-3xl pointer-events-none" />

        {/* Top Header */}
        <div>
          <div className="flex items-center justify-between pb-3 border-b border-slate-800 mb-4">
            <div className="flex items-center gap-2">
              <span className="text-lg">🏯</span>
              <div>
                <h3 className="font-black text-sm text-white">جولة الحصن التعليمية التفاعلية</h3>
                <span className="text-[10px] text-slate-400">دليل التشغيل الشامل خطوة بخطوة</span>
              </div>
            </div>

            <button
              onClick={closeOnboarding}
              className="p-1.5 rounded-xl bg-slate-800 text-slate-400 hover:text-white transition-colors"
              title="تخطي الجولة"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Stepper Milestone Icons */}
          <div className="flex items-center justify-between mb-5 px-1">
            {stepsData.map((s) => {
              const isPassed = s.step < currentStep;
              const isCurrent = s.step === currentStep;
              return (
                <div key={s.step} className="flex items-center flex-1 last:flex-none">
                  <button
                    onClick={() => {
                      setCurrentStep(s.step);
                      sound.playStepSound();
                    }}
                    className={`w-7 h-7 sm:w-8 sm:h-8 rounded-xl font-bold text-xs flex items-center justify-center transition-all ${
                      isCurrent
                        ? 'bg-amber-500 text-slate-950 scale-110 ring-2 ring-amber-400 shadow-lg'
                        : isPassed
                        ? 'bg-emerald-950 text-emerald-300 border border-emerald-500/40'
                        : 'bg-slate-950 text-slate-500 border border-slate-800'
                    }`}
                  >
                    {isPassed ? <CheckCircle2 className="w-4 h-4 text-emerald-400" /> : s.step}
                  </button>
                  {s.step < totalSteps && (
                    <div className={`flex-1 h-0.5 mx-1.5 transition-colors ${isPassed ? 'bg-emerald-500/50' : 'bg-slate-800'}`} />
                  )}
                </div>
              );
            })}
          </div>

          {/* Step Hero Section */}
          <div className="mb-4">
            <div className="flex items-center gap-3 mb-2">
              <div className="p-3 bg-slate-950 rounded-2xl border border-slate-800 shrink-0">
                {currentStepObj.icon}
              </div>
              <div>
                <span className="text-[10px] font-bold text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded-full border border-amber-500/20">
                  {currentStepObj.badge} (الخطوة {currentStep} من {totalSteps})
                </span>
                <h4 className="text-base font-black text-white mt-1">{currentStepObj.title}</h4>
              </div>
            </div>
            <p className="text-xs text-slate-400 italic">{currentStepObj.tagline}</p>
          </div>

          {/* Step Dynamic Content */}
          <div className="bg-slate-950/60 rounded-2xl p-4 border border-slate-800/80 mb-4">
            {currentStepObj.content}
          </div>

          {/* Interactive Feedback Message if triggered */}
          {interactiveFeedback && (
            <div className="p-3 rounded-xl bg-emerald-950/80 border border-emerald-500/40 text-emerald-200 text-xs font-bold flex items-center gap-2 mb-4 animate-fadeIn">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>{interactiveFeedback}</span>
            </div>
          )}
        </div>

        {/* Footer Navigation Buttons */}
        <div className="flex items-center justify-between gap-3 pt-3 border-t border-slate-800">
          <button
            onClick={handlePrev}
            disabled={currentStep === 1}
            className="py-2.5 px-4 rounded-xl bg-slate-800 hover:bg-slate-700 disabled:opacity-40 text-slate-300 text-xs font-bold flex items-center gap-1.5 transition-all"
          >
            <ArrowRight className="w-4 h-4" />
            <span>السابق</span>
          </button>

          <div className="flex items-center gap-2">
            <button
              onClick={handleCompleteAndOpenMap}
              className="py-2.5 px-3 bg-slate-800 hover:bg-slate-750 text-slate-400 hover:text-white rounded-xl text-xs font-semibold transition-all"
            >
              تخطي وفتح الخريطة 🏯
            </button>

            <button
              onClick={handleNext}
              className="py-2.5 px-5 bg-gradient-to-r from-amber-500 to-emerald-500 hover:from-amber-400 hover:to-emerald-400 text-slate-950 rounded-xl text-xs font-black flex items-center gap-1.5 shadow-lg shadow-amber-950 transition-all"
            >
              <span>{currentStep === totalSteps ? 'استكشاف خريطة الحصن 🏯' : 'التالي'}</span>
              <ArrowLeft className="w-4 h-4" />
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
