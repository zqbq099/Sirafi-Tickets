import React, { useState } from 'react';
import { usePark } from '../../../context/ParkContext';
import { 
  Coins, 
  Sparkles, 
  Plus, 
  QrCode, 
  ShieldCheck, 
  Gift, 
  ArrowRight, 
  Check,
  Zap,
  Calculator
} from 'lucide-react';
import { encodeQRPayload, generateNonce, sound } from '../../../utils/crypto';

export const Stage1UnitsVault: React.FC = () => {
  const { visitor, buyUnits, showQRModal, nextVisitorGameStage } = usePark();
  const [selectedPackSAR, setSelectedPackSAR] = useState<number>(100);
  const [customSAR, setCustomSAR] = useState<number>(50);
  const [showSuccessBanner, setShowSuccessBanner] = useState<boolean>(false);

  const packs = [
    {
      id: 'starter',
      sar: 50,
      units: 250,
      name: 'باقة الفراشة 🦋',
      description: 'مناسبة للزيارات القصيرة وتجربة 5 إلى 10 ألعاب',
      popular: false,
      badge: 'انطلاقة سريعة',
      colorClass: 'border-amber-300 bg-amber-50/70 hover:bg-amber-100/80',
      btnClass: 'btn-game-amber'
    },
    {
      id: 'adventurer',
      sar: 100,
      units: 500,
      name: 'باقة المغامر الذهبية 🌟',
      description: 'الأكثر طلباً ومثالية لشراء 20 تذكرة كاملة للعائلة',
      popular: true,
      badge: 'الأكثر توفيراً ⭐',
      colorClass: 'border-amber-400 bg-gradient-to-br from-amber-100 to-yellow-50 shadow-md ring-2 ring-amber-400',
      btnClass: 'btn-game-amber'
    },
    {
      id: 'royal',
      sar: 200,
      units: 1000,
      name: 'باقة العائلة الملكية 👑',
      description: 'شاملة كل ألعاب الحديقة والتحديات مع رصيد وافر',
      popular: false,
      badge: 'رصيد مضاعف',
      colorClass: 'border-purple-300 bg-purple-50/70 hover:bg-purple-100/80',
      btnClass: 'btn-game-purple'
    }
  ];

  const handleBuy = (sarAmount: number) => {
    sound.playCoinSound();
    buyUnits(sarAmount);
    setShowSuccessBanner(true);
    setTimeout(() => setShowSuccessBanner(false), 3500);
  };

  // Generate Units QR for direct ride checkout
  const handleShowUnitsQR = () => {
    sound.playPop();
    const payload = encodeQRPayload({
      qrType: 'USAGE_QR',
      visitorId: visitor.id,
      timestamp: Date.now(),
      nonce: generateNonce()
    });

    showQRModal({
      title: `رمز خصم الوحدات المباشر 🪙`,
      subtitle: `رصيدك الحالي: ${visitor.unitsBalance} وحدة • يخصم المشغل سعر اللعبة مباشرة`,
      qrData: payload,
      qrType: 'USAGE_QR'
    });
  };

  return (
    <div className="space-y-6">
      {/* Success Notification */}
      {showSuccessBanner && (
        <div className="p-4 rounded-3xl bg-amber-400 border-3 border-amber-500 text-slate-950 flex items-center justify-between font-black shadow-lg animate-bounce-subtle">
          <div className="flex items-center gap-3">
            <Sparkles className="w-6 h-6" />
            <span className="text-sm">🎉 رائع! تم شحن الرصيد بنجاح، يمكنك الآن الانتقال لشراء التذاكر!</span>
          </div>
          <button
            onClick={() => {
              sound.playLevelUp();
              nextVisitorGameStage();
            }}
            className="btn-game-white text-xs px-3 py-1.5 font-black"
          >
            المرحلة التالية (شراء التذاكر) ➔
          </button>
        </div>
      )}

      {/* Main 3D Coin Vault Hero Card */}
      <div className="bg-gradient-to-br from-amber-400 via-yellow-400 to-amber-500 rounded-3xl p-6 sm:p-8 border-4 border-amber-300 shadow-2xl text-slate-950 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/20 rounded-full blur-2xl pointer-events-none" />
        <div className="absolute -bottom-10 -left-10 w-48 h-48 bg-yellow-200/40 rounded-full blur-xl pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="space-y-2 text-center md:text-right">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/90 text-slate-950 font-black text-xs shadow-sm">
              <Coins className="w-4 h-4 text-amber-600" />
              <span>خزينة رصيد الوحدات الداخلية 🪙</span>
            </div>

            <h3 className="text-2xl sm:text-3xl font-black tracking-tight text-slate-950">
              رصيد الوحدات الحالي:
            </h3>

            <div className="flex items-baseline justify-center md:justify-start gap-3">
              <span className="text-5xl sm:text-6xl font-black font-changa tracking-tight text-slate-950 drop-shadow-sm">
                {visitor.unitsBalance}
              </span>
              <span className="text-xl font-black text-amber-950">وحدة حديقة 🪙</span>
            </div>

            <p className="text-xs sm:text-sm font-bold text-amber-950/80">
              يعادل <span className="underline decoration-2 font-black">{visitor.unitsBalance / 5} ريال سعودي</span> (المعادلة الثابتة: 1 ريال = 5 وحدات)
            </p>
          </div>

          {/* Quick Actions on Vault */}
          <div className="flex flex-col sm:flex-row md:flex-col gap-3 w-full md:w-auto shrink-0">
            <button
              onClick={handleShowUnitsQR}
              className="btn-game-white py-3 px-5 text-sm font-black flex items-center justify-center gap-2 shadow-lg"
              title="عرض رمز QR لخصم الوحدات مباشرة عند بوابات الألعاب"
            >
              <QrCode className="w-5 h-5 text-amber-600" />
              <span>عرض رمز الوحدات للألعاب 📱</span>
            </button>

            <button
              onClick={() => {
                sound.playLevelUp();
                nextVisitorGameStage();
              }}
              className="btn-game-amber py-3 px-5 text-sm font-black flex items-center justify-center gap-2 shadow-lg"
            >
              <span>تحويل الوحدات لتذاكر 🎟️</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* 3D Top-up Packages */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-2xl bg-amber-400 text-slate-950 font-black">
              <Gift className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-lg font-black text-slate-900 dark:text-white">باقات شحن الوحدات السريعة 🎁</h4>
              <p className="text-xs text-slate-600 dark:text-slate-400 font-medium">اختر الباقة المناسبة لك وسيتم شحن الرصيد فورياً بحسابك</p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {packs.map((pack) => (
            <div
              key={pack.id}
              className={`rounded-3xl p-5 border-3 transition-all duration-200 flex flex-col justify-between ${pack.colorClass}`}
            >
              <div>
                <div className="flex items-start justify-between mb-2">
                  <span className="px-3 py-1 rounded-full bg-white text-slate-950 font-black text-xs border border-amber-300 shadow-xs">
                    {pack.badge}
                  </span>
                  {pack.popular && (
                    <span className="w-3 h-3 rounded-full bg-amber-500 animate-ping" />
                  )}
                </div>

                <h5 className="text-lg font-black text-slate-900 mt-2 mb-1">{pack.name}</h5>
                <p className="text-xs text-slate-700 font-medium mb-4">{pack.description}</p>

                <div className="bg-white/80 rounded-2xl p-3 border border-amber-200 mb-4 flex items-baseline justify-between">
                  <div>
                    <div className="text-xs font-bold text-slate-500">القيمة المالية:</div>
                    <div className="text-xl font-black text-slate-900">{pack.sar} ريال</div>
                  </div>
                  <div className="text-left">
                    <div className="text-xs font-bold text-amber-700">تحصل على:</div>
                    <div className="text-2xl font-black text-amber-600 font-changa">+{pack.units} 🪙</div>
                  </div>
                </div>
              </div>

              <button
                onClick={() => handleBuy(pack.sar)}
                className={`${pack.btnClass} w-full py-3 text-sm font-black flex items-center justify-center gap-2`}
              >
                <Plus className="w-4 h-4 stroke-[3]" />
                <span>شحن {pack.sar} ر.س (+{pack.units} وحدة)</span>
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Currency Exchange Explainer Card */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl p-5 border-3 border-amber-200 dark:border-slate-800 shadow-md flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-amber-100 dark:bg-slate-800 text-amber-600 rounded-2xl">
            <Calculator className="w-6 h-6" />
          </div>
          <div>
            <h5 className="text-base font-black text-slate-900 dark:text-white">قاعدة نظام الوحدات (Section 4):</h5>
            <p className="text-xs text-slate-600 dark:text-slate-400 font-medium">
              الوحدات ليست محفظة مالية عامة بل رصيد داخلي آمن للحديقة لاستخدام الألعاب وشراء التذاكر.
            </p>
          </div>
        </div>

        <button
          onClick={() => {
            sound.playLevelUp();
            nextVisitorGameStage();
          }}
          className="btn-game-amber px-6 py-2.5 text-xs font-black shrink-0"
        >
          الانتقال للمرحلة 2 (التذاكر) ➔
        </button>
      </div>
    </div>
  );
};
