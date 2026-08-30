import React, { useState } from 'react';
import { usePark } from '../../context/ParkContext';
import { Attraction } from '../../types';
import { 
  ShieldAlert, 
  ShieldCheck, 
  Users, 
  Clock, 
  Snowflake, 
  Flame, 
  Radio, 
  Plus, 
  Minus, 
  Compass, 
  AlertTriangle, 
  Sparkles,
  Megaphone,
  CheckCircle,
  Eye,
  Info,
  Maximize2
} from 'lucide-react';
import { 
  RollerCoasterIcon, 
  FerrisWheelIcon, 
  CarouselIcon,
  BumperCarsIcon, 
  DropTowerIcon, 
  WaterSplashIcon,
  TakeshiCastleIcon 
} from '../common/ParkIcons';

interface SafetyTreasureMapProps {
  onOpenBroadcastModal?: (attractionId?: string) => void;
}

export const SafetyTreasureMap: React.FC<SafetyTreasureMapProps> = ({ onOpenBroadcastModal }) => {
  const { 
    attractions, 
    toggleFreezeAttraction, 
    adjustSafetyStaff,
    openCastleMap
  } = usePark();

  const [selectedAttractionId, setSelectedAttractionId] = useState<string | null>(null);
  const [filterMode, setFilterMode] = useState<'ALL' | 'CRITICAL' | 'FROZEN'>('ALL');

  const selectedAttraction = attractions.find(a => a.id === selectedAttractionId) || null;

  // Calculate congestion battery level (1 to 5 bars) based on queue and capacity
  const getCongestionBatteryInfo = (attraction: Attraction) => {
    const queue = attraction.currentQueue;
    if (queue <= 12) {
      return {
        level: 1,
        barsCount: 1,
        colorClass: 'bg-emerald-500',
        textClass: 'text-emerald-400',
        borderClass: 'border-emerald-500/40',
        labelAr: 'هادئ ومثالي',
        statusDesc: 'حركة انسيابية ممتازة'
      };
    }
    if (queue <= 20) {
      return {
        level: 2,
        barsCount: 2,
        colorClass: 'bg-teal-500',
        textClass: 'text-teal-400',
        borderClass: 'border-teal-500/40',
        labelAr: 'طبيعي ومستقر',
        statusDesc: 'تدفق تذاكر اعتيادي'
      };
    }
    if (queue <= 28) {
      return {
        level: 3,
        barsCount: 3,
        colorClass: 'bg-amber-500',
        textClass: 'text-amber-400',
        borderClass: 'border-amber-500/40',
        labelAr: 'ضغط متوسط',
        statusDesc: 'يحتاج متابعة مستمرة'
      };
    }
    if (queue <= 36) {
      return {
        level: 4,
        barsCount: 4,
        colorClass: 'bg-orange-500',
        textClass: 'text-orange-400',
        borderClass: 'border-orange-500/40',
        labelAr: 'ضغط مرتفع ⚠️',
        statusDesc: 'تكدس نسبي في صفوف الانتظار'
      };
    }
    return {
      level: 5,
      barsCount: 5,
      colorClass: 'bg-rose-500 animate-pulse',
      textClass: 'text-rose-400 font-black',
      borderClass: 'border-rose-500/80',
      labelAr: 'ازدحام حرج وتكدس 🚨',
      statusDesc: 'تدفق تذاكر استثنائي - يُوصى بالتدخل'
    };
  };

  const getAttractionIcon = (id: string) => {
    switch (id) {
      case 'attr-1': return <RollerCoasterIcon className="w-8 h-8 text-amber-900" />;
      case 'attr-2': return <FerrisWheelIcon className="w-8 h-8 text-amber-900" />;
      case 'attr-3': return <BumperCarsIcon className="w-8 h-8 text-amber-900" />;
      case 'attr-4': return <CarouselIcon className="w-8 h-8 text-amber-900" />;
      case 'attr-5': return <DropTowerIcon className="w-8 h-8 text-amber-900" />;
      case 'attr-6': return <WaterSplashIcon className="w-8 h-8 text-blue-900" />;
      default: return <TakeshiCastleIcon className="w-8 h-8 text-amber-900" />;
    }
  };

  const filteredAttractions = attractions.filter(a => {
    if (filterMode === 'FROZEN') return a.isFrozenForSafety;
    if (filterMode === 'CRITICAL') return a.currentQueue >= 28;
    return true;
  });

  const totalSafetyStaff = attractions.reduce((acc, a) => acc + (a.assignedSafetyStaff || 0), 0);
  const frozenAttractionsCount = attractions.filter(a => a.isFrozenForSafety).length;
  const criticalCrowdCount = attractions.filter(a => a.currentQueue >= 28).length;

  return (
    <div className="bg-slate-900/90 rounded-3xl p-5 border-2 border-slate-800 shadow-2xl space-y-5">
      {/* Header bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-800">
        <div>
          <div className="flex items-center gap-2">
            <div className="p-2 bg-amber-500/10 rounded-2xl border border-amber-500/30 text-amber-400">
              <Compass className="w-6 h-6 animate-spin-slow" />
            </div>
            <div>
              <h3 className="text-lg font-black text-white flex items-center gap-2">
                <span>خريطة الكنز الأمنية ورصد الحشود والضغط اللحظي 🗺️</span>
                <span className="text-[11px] px-2.5 py-0.5 rounded-full bg-amber-500/20 text-amber-300 font-mono font-bold border border-amber-500/30">
                  Live Heatmap
                </span>
              </h3>
              <p className="text-xs text-slate-400 mt-0.5">
                مؤشرات بطارية الضغط اللحظي، توزيع فريق السلامة الميداني، وتجميد التذاكر عند الازدحام
              </p>
            </div>
          </div>
        </div>

        {/* Quick Safety Stats */}
        <div className="flex flex-wrap items-center gap-2">
          <div className="px-3 py-1.5 rounded-xl bg-slate-950 border border-slate-800 flex items-center gap-2 text-xs">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span className="text-slate-400">أفراد السلامة المنتشرون:</span>
            <strong className="text-emerald-400 font-mono font-bold">{totalSafetyStaff} أفراد</strong>
          </div>

          <div className={`px-3 py-1.5 rounded-xl border flex items-center gap-2 text-xs ${
            criticalCrowdCount > 0 
              ? 'bg-rose-950/60 border-rose-600/70 text-rose-300 animate-pulse' 
              : 'bg-slate-950 border-slate-800 text-slate-300'
          }`}>
            <Flame className="w-4 h-4 text-rose-400" />
            <span>نقاط الضغط العالي:</span>
            <strong className="font-mono font-bold">{criticalCrowdCount} ألعاب</strong>
          </div>

          {frozenAttractionsCount > 0 && (
            <div className="px-3 py-1.5 rounded-xl bg-blue-950/60 border border-blue-600/70 text-blue-300 flex items-center gap-2 text-xs">
              <Snowflake className="w-4 h-4 text-blue-400 animate-spin" />
              <span>مجمّدة مؤقتاً:</span>
              <strong className="font-mono font-bold">{frozenAttractionsCount}</strong>
            </div>
          )}
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center justify-between flex-wrap gap-2">
        <div className="flex items-center gap-2">
          <span className="text-xs text-slate-400 font-bold">تصفية الخريطة:</span>
          <button
            onClick={() => setFilterMode('ALL')}
            className={`px-3 py-1 rounded-xl text-xs font-bold transition-all ${
              filterMode === 'ALL' 
                ? 'bg-amber-600 text-white shadow-md' 
                : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
            }`}
          >
            كافة الألعاب ({attractions.length})
          </button>
          <button
            onClick={() => setFilterMode('CRITICAL')}
            className={`px-3 py-1 rounded-xl text-xs font-bold transition-all flex items-center gap-1 ${
              filterMode === 'CRITICAL' 
                ? 'bg-rose-600 text-white shadow-md' 
                : 'bg-slate-800 text-rose-300 hover:bg-slate-700'
            }`}
          >
            <Flame className="w-3.5 h-3.5" />
            الضغط المرتفع ({criticalCrowdCount})
          </button>
          <button
            onClick={() => setFilterMode('FROZEN')}
            className={`px-3 py-1 rounded-xl text-xs font-bold transition-all flex items-center gap-1 ${
              filterMode === 'FROZEN' 
                ? 'bg-blue-600 text-white shadow-md' 
                : 'bg-slate-800 text-blue-300 hover:bg-slate-700'
            }`}
          >
            <Snowflake className="w-3.5 h-3.5" />
            المجمّدة للسلامة ({frozenAttractionsCount})
          </button>
        </div>

        {/* Broadcast Trigger from map */}
        {onOpenBroadcastModal && (
          <button
            onClick={() => onOpenBroadcastModal()}
            className="btn-game-rose px-3 py-1 text-xs font-black flex items-center gap-1.5 shadow-sm"
          >
            <Megaphone className="w-3.5 h-3.5" />
            <span>إرسال تعميم أمني عاجل 📢</span>
          </button>
        )}
      </div>

      {/* Main Treasure Map Canvas Board */}
      <div className="relative rounded-3xl overflow-hidden border-4 border-amber-800/60 shadow-2xl bg-gradient-to-b from-amber-100 via-amber-200 to-amber-300 p-4 sm:p-8 select-none">
        {/* Parchment Texture & Nautical Background Details */}
        <div className="absolute inset-0 opacity-15 bg-[radial-gradient(#78350f_1px,transparent_1px)] [background-size:16px_16px] pointer-events-none" />
        
        {/* Vintage Map Compass in corner */}
        <div className="absolute top-4 left-4 p-2 bg-amber-900/10 rounded-full border-2 border-dashed border-amber-900/40 pointer-events-none hidden sm:flex items-center justify-center">
          <Compass className="w-12 h-12 text-amber-950/60 animate-spin-slow" />
        </div>

        {/* Vintage Island/Castle Legend Watermark */}
        <div className="absolute bottom-3 left-4 text-[11px] font-mono text-amber-950/50 font-black pointer-events-none">
          ⚔️ SIRAFIC CASTLE TREASURE & SAFETY GRID • LIVE TELEMETRY
        </div>

        {/* Dotted Trails linking zones */}
        <svg className="absolute inset-0 w-full h-full pointer-events-none opacity-40">
          <path
            d="M 120 100 Q 300 80 480 120 T 750 140 T 650 320 T 400 300 T 150 320 Z"
            fill="none"
            stroke="#78350f"
            strokeWidth="3"
            strokeDasharray="6 8"
          />
        </svg>

        {/* Attractions Grid on the Map */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 relative z-10">
          {filteredAttractions.map(attraction => {
            const battery = getCongestionBatteryInfo(attraction);
            const isSelected = selectedAttractionId === attraction.id;
            const staffCount = attraction.assignedSafetyStaff || 0;

            return (
              <div
                key={attraction.id}
                onClick={() => setSelectedAttractionId(attraction.id)}
                className={`cursor-pointer rounded-2xl p-4 transition-all duration-200 backdrop-blur-sm relative overflow-hidden ${
                  attraction.isFrozenForSafety
                    ? 'bg-blue-900/80 text-white border-2 border-blue-400 shadow-xl shadow-blue-950/40 ring-2 ring-blue-300/60'
                    : isSelected
                    ? 'bg-amber-950/90 text-white border-2 border-amber-400 shadow-2xl scale-[1.02] ring-2 ring-amber-400/50'
                    : 'bg-amber-950/75 hover:bg-amber-950/85 text-amber-100 border-2 border-amber-900/60 shadow-lg hover:shadow-xl'
                }`}
              >
                {/* Frozen Overlay Banner */}
                {attraction.isFrozenForSafety && (
                  <div className="absolute top-0 right-0 left-0 bg-blue-600 text-white text-[10px] font-black px-3 py-1 text-center flex items-center justify-center gap-1.5 shadow-sm">
                    <Snowflake className="w-3 h-3 animate-spin" />
                    <span>مجمّدة مؤقتاً للسلامة (إيقاف إصدار واستخدام التذاكر)</span>
                  </div>
                )}

                <div className={`flex items-start justify-between gap-3 ${attraction.isFrozenForSafety ? 'mt-4' : ''}`}>
                  {/* Miniature Icon and Title */}
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-2xl bg-amber-200/90 p-2 shadow-inner border border-amber-400 flex items-center justify-center shrink-0">
                      {getAttractionIcon(attraction.id)}
                    </div>
                    <div>
                      <div className="flex items-center gap-1.5">
                        <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-amber-400/20 text-amber-300 font-bold border border-amber-400/30">
                          #{attraction.id.replace('attr-', '')}
                        </span>
                        <h4 className="text-sm font-black text-white leading-tight">
                          {attraction.nameAr}
                        </h4>
                      </div>
                      <span className="text-[11px] text-amber-300/80 font-medium">
                        {attraction.zone}
                      </span>
                    </div>
                  </div>

                  {/* BATTERY-LIKE CROWD PRESSURE GAUGE (عمود درجات البطارية) */}
                  <div className="flex flex-col items-center bg-slate-950/80 px-2 py-1.5 rounded-xl border border-slate-700/60 shrink-0 shadow-inner">
                    <span className="text-[9px] font-mono text-slate-400 font-bold mb-1">الضغط</span>
                    
                    {/* Vertical Battery Casing */}
                    <div className="w-5 h-12 rounded-sm border-2 border-slate-400 bg-slate-900 p-0.5 flex flex-col-reverse gap-0.5 relative">
                      {/* Battery Top Terminal Pip */}
                      <div className="absolute -top-1 left-1/2 -translate-x-1/2 w-2 h-1 bg-slate-400 rounded-t-xs" />
                      
                      {/* 5 Battery Bars */}
                      {[1, 2, 3, 4, 5].map(barIndex => {
                        const isFilled = barIndex <= battery.barsCount;
                        let barColor = 'bg-slate-800';
                        if (isFilled) {
                          if (barIndex <= 2) barColor = 'bg-emerald-400';
                          else if (barIndex === 3) barColor = 'bg-amber-400';
                          else if (barIndex === 4) barColor = 'bg-orange-500';
                          else barColor = 'bg-rose-500 animate-pulse';
                        }
                        return (
                          <div
                            key={barIndex}
                            className={`w-full flex-1 rounded-2xs transition-all ${barColor}`}
                          />
                        );
                      })}
                    </div>

                    <span className={`text-[10px] font-mono font-black mt-1 ${battery.textClass}`}>
                      {battery.barsCount}/5
                    </span>
                  </div>
                </div>

                {/* Queue Statistics & Status */}
                <div className="mt-3 pt-2 border-t border-amber-800/40 grid grid-cols-3 gap-2 text-center text-xs">
                  <div className="bg-slate-950/60 rounded-lg p-1.5 border border-slate-800/60">
                    <span className="text-[10px] text-slate-400 block">طابور التذاكر</span>
                    <strong className="font-mono text-white font-bold">{attraction.currentQueue} زائر</strong>
                  </div>
                  <div className="bg-slate-950/60 rounded-lg p-1.5 border border-slate-800/60">
                    <span className="text-[10px] text-slate-400 block">وقت الانتظار</span>
                    <strong className="font-mono text-amber-300 font-bold">{attraction.avgWaitTimeMins} دقيقة</strong>
                  </div>
                  <div className="bg-slate-950/60 rounded-lg p-1.5 border border-slate-800/60">
                    <span className="text-[10px] text-slate-400 block">سعة الجولة</span>
                    <strong className="font-mono text-white font-bold">{attraction.capacity} راكب</strong>
                  </div>
                </div>

                {/* Safety Team Allocation Controller (+ / - 👮‍♂️) */}
                <div className="mt-3 pt-2 border-t border-amber-800/40 flex items-center justify-between gap-2">
                  <div className="flex items-center gap-1.5 text-xs text-slate-300">
                    <span className="text-sm">👮‍♂️</span>
                    <span>فريق السلامة:</span>
                    <strong className="font-mono text-emerald-400 font-bold">{staffCount} أفراد</strong>
                  </div>

                  <div className="flex items-center gap-1">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        adjustSafetyStaff(attraction.id, -1);
                      }}
                      disabled={staffCount <= 0}
                      className="w-6 h-6 rounded-lg bg-slate-800 hover:bg-slate-700 disabled:opacity-30 text-white font-bold flex items-center justify-center transition-all border border-slate-700"
                      title="سحب فرد سلامة"
                    >
                      <Minus className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        adjustSafetyStaff(attraction.id, 1);
                      }}
                      className="w-6 h-6 rounded-lg bg-emerald-700 hover:bg-emerald-600 text-white font-bold flex items-center justify-center transition-all border border-emerald-500 shadow-sm"
                      title="توجيه ونشر فرد سلامة إضافي لهذه اللعبة"
                    >
                      <Plus className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                {/* Fast Action Buttons: Freeze Ticketing & Ride Warning */}
                <div className="mt-3 pt-2 border-t border-amber-800/40 flex items-center gap-2">
                  {/* Freeze / Unfreeze Ticket Sales Toggle */}
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleFreezeAttraction(
                        attraction.id, 
                        attraction.isFrozenForSafety ? undefined : 'تجميد احترازي لتقليل الازدحام وفحص مسارات الأمان'
                      );
                    }}
                    className={`flex-1 py-1.5 px-2 rounded-xl text-xs font-black flex items-center justify-center gap-1 transition-all shadow-sm ${
                      attraction.isFrozenForSafety
                        ? 'bg-emerald-600 hover:bg-emerald-500 text-white'
                        : 'bg-blue-900/60 hover:bg-blue-800 text-blue-200 border border-blue-700/60'
                    }`}
                  >
                    <Snowflake className="w-3.5 h-3.5" />
                    <span>{attraction.isFrozenForSafety ? 'فك التجميد ✅' : 'تجميد التذاكر ❄️'}</span>
                  </button>

                  {/* Ride-specific Warning Broadcast */}
                  {onOpenBroadcastModal && (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onOpenBroadcastModal(attraction.id);
                      }}
                      className="py-1.5 px-2 rounded-xl bg-amber-700/50 hover:bg-amber-600 text-amber-200 border border-amber-500/50 text-xs font-bold flex items-center gap-1 transition-all"
                      title="إرسال تنبيه خاص برواد هذه اللعبة"
                    >
                      <Megaphone className="w-3.5 h-3.5" />
                      <span>تنبيه</span>
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Safety Supervisor Legend & Action Guide */}
      <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-slate-400">
        <div className="flex items-center gap-4 flex-wrap">
          <span className="font-bold text-slate-300">مفتاح عمود درجات البطارية:</span>
          <div className="flex items-center gap-1">
            <span className="w-3 h-3 rounded-xs bg-emerald-500 inline-block" />
            <span>1-2 درجات (هادئ)</span>
          </div>
          <div className="flex items-center gap-1">
            <span className="w-3 h-3 rounded-xs bg-amber-500 inline-block" />
            <span>3 درجات (متوسط)</span>
          </div>
          <div className="flex items-center gap-1">
            <span className="w-3 h-3 rounded-xs bg-orange-500 inline-block" />
            <span>4 درجات (ضغط عالي)</span>
          </div>
          <div className="flex items-center gap-1">
            <span className="w-3 h-3 rounded-xs bg-rose-500 inline-block" />
            <span>5 درجات (ازدحام حرج)</span>
          </div>
        </div>

        <div className="text-[11px] text-amber-300/90 font-medium">
          💡 تجميد اللعبة يمنع فوراً استهلاك أو شراء التذاكر لها حتى يتراجع الضغط.
        </div>
      </div>
    </div>
  );
};
