import React from 'react';
import { usePark } from '../../context/ParkContext';
import { 
  Coins, 
  Ticket as TicketIcon, 
  Users, 
  Gamepad2, 
  ScrollText, 
  ChevronRight, 
  ChevronLeft, 
  Compass, 
  Sparkles, 
  Award,
  Layers
} from 'lucide-react';
import { sound } from '../../utils/crypto';

export interface GameStageInfo {
  stage: number;
  title: string;
  subtitle: string;
  icon: React.ReactNode;
  themeColor: string;
  starCount: number;
  badge: string;
}

export const GAME_STAGES: GameStageInfo[] = [
  {
    stage: 1,
    title: 'خزينة الوحدات والشحن',
    subtitle: 'شحن رصيد الوحدات 🪙',
    icon: <Coins className="w-5 h-5 text-amber-500" />,
    themeColor: 'from-amber-400 to-yellow-500',
    starCount: 1,
    badge: 'المرحلة 1'
  },
  {
    stage: 2,
    title: 'متجر وتذاكر العبور',
    subtitle: 'شراء وتوليد التذاكر 🎟️',
    icon: <TicketIcon className="w-5 h-5 text-sky-500" />,
    themeColor: 'from-sky-400 to-blue-500',
    starCount: 2,
    badge: 'المرحلة 2'
  },
  {
    stage: 3,
    title: 'فريق العائلة والسلامة',
    subtitle: 'رادار العائلة وبلاغات الفقدان 👨‍👩‍👧‍👦',
    icon: <Users className="w-5 h-5 text-rose-500" />,
    themeColor: 'from-rose-400 to-pink-500',
    starCount: 3,
    badge: 'المرحلة 3'
  },
  {
    stage: 4,
    title: 'حلبة الألعاب والتحديات',
    subtitle: 'تشغيل ألعاب الحصن 🎢',
    icon: <Gamepad2 className="w-5 h-5 text-purple-500" />,
    themeColor: 'from-purple-400 to-indigo-500',
    starCount: 4,
    badge: 'المرحلة 4'
  },
  {
    stage: 5,
    title: 'سجل المغامرة والإنجازات',
    subtitle: 'سجل العمليات والأحداث 📜',
    icon: <ScrollText className="w-5 h-5 text-emerald-500" />,
    themeColor: 'from-emerald-400 to-teal-500',
    starCount: 5,
    badge: 'المرحلة 5'
  }
];

export const GameStageNavigation: React.FC = () => {
  const { 
    visitorGameStage, 
    setVisitorGameStage, 
    nextVisitorGameStage, 
    prevVisitorGameStage,
    visitorNavMode,
    setVisitorNavMode,
    openCastleMap
  } = usePark();

  const currentStageInfo = GAME_STAGES.find(s => s.stage === visitorGameStage) || GAME_STAGES[0];

  const handleStageSelect = (stageNum: number) => {
    sound.playPop();
    setVisitorGameStage(stageNum);
  };

  const handleNext = () => {
    sound.playLevelUp();
    nextVisitorGameStage();
  };

  const handlePrev = () => {
    sound.playPop();
    prevVisitorGameStage();
  };

  return (
    <div className="w-full bg-white/90 dark:bg-slate-900/90 rounded-3xl p-4 sm:p-5 border-3 border-amber-300 dark:border-slate-800 shadow-xl shadow-amber-500/10 mb-6 backdrop-blur-md">
      {/* Top Header Bar: Title, Progress & Mode Switcher */}
      <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b-2 border-amber-100 dark:border-slate-800">
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-amber-400 to-rose-400 p-0.5 shadow-md flex items-center justify-center">
            <div className="w-full h-full bg-white dark:bg-slate-900 rounded-[14px] flex items-center justify-center">
              <Sparkles className="w-6 h-6 text-amber-500 animate-spin-slow" />
            </div>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full bg-amber-400 text-slate-950 font-black text-xs border border-amber-500">
                مغامرة الحديقة 🏰
              </span>
              <span className="text-xs font-bold text-slate-500 dark:text-slate-400">
                المرحلة {visitorGameStage} من {GAME_STAGES.length}
              </span>
            </div>
            <h2 className="text-lg sm:text-xl font-black text-slate-900 dark:text-white mt-0.5">
              {currentStageInfo.title}
            </h2>
          </div>
        </div>

        {/* View Mode Switcher & Quick Map */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => {
              sound.playPop();
              setVisitorNavMode(visitorNavMode === 'game_stages' ? 'classic_scroll' : 'game_stages');
            }}
            className="px-3 py-1.5 rounded-2xl text-xs font-bold transition-all flex items-center gap-1.5 border-2 border-amber-200 dark:border-slate-700 bg-amber-50 dark:bg-slate-800 text-amber-900 dark:text-amber-300 hover:bg-amber-100"
            title="التبديل بين نمط مراحل اللعبة التفاعلي والعرض الشامل"
          >
            <Layers className="w-3.5 h-3.5" />
            <span>{visitorNavMode === 'game_stages' ? 'نمط المراحل 🎮' : 'العرض الشامل 📑'}</span>
          </button>

          <button
            onClick={() => openCastleMap()}
            className="px-3 py-1.5 rounded-2xl text-xs font-black transition-all bg-gradient-to-r from-amber-400 to-rose-400 hover:from-amber-300 hover:to-rose-300 text-slate-950 shadow-md flex items-center gap-1"
          >
            <Compass className="w-4 h-4" />
            <span>خريطة الحصن 🏯</span>
          </button>
        </div>
      </div>

      {/* Interactive Level Progression Nodes Map */}
      <div className="relative pt-4 pb-2">
        {/* Progress Line */}
        <div className="absolute top-1/2 -translate-y-2 right-4 left-4 h-2.5 bg-amber-100 dark:bg-slate-800 rounded-full z-0 hidden sm:block">
          <div 
            className="h-full bg-gradient-to-r from-amber-400 via-rose-400 to-emerald-400 rounded-full transition-all duration-500 shadow-sm"
            style={{ width: `${((visitorGameStage - 1) / (GAME_STAGES.length - 1)) * 100}%` }}
          />
        </div>

        {/* Nodes Grid */}
        <div className="grid grid-cols-5 gap-2 relative z-10">
          {GAME_STAGES.map((s) => {
            const isCurrent = s.stage === visitorGameStage;
            const isPast = s.stage < visitorGameStage;

            return (
              <button
                key={s.stage}
                id={`game-stage-node-${s.stage}`}
                onClick={() => handleStageSelect(s.stage)}
                className={`flex flex-col items-center group transition-all duration-200 ${
                  isCurrent ? 'scale-105' : 'hover:scale-102 opacity-85 hover:opacity-100'
                }`}
              >
                {/* Node Circle */}
                <div 
                  className={`w-11 h-11 sm:w-13 sm:h-13 rounded-2xl flex items-center justify-center font-black text-sm sm:text-base border-3 transition-all shadow-md ${
                    isCurrent
                      ? 'bg-amber-400 border-amber-500 text-slate-950 ring-4 ring-amber-300/60 shadow-amber-400/40 animate-bounce-subtle'
                      : isPast
                      ? 'bg-emerald-400 border-emerald-500 text-slate-950 shadow-emerald-400/30'
                      : 'bg-white dark:bg-slate-800 border-amber-200 dark:border-slate-700 text-slate-500 dark:text-slate-400'
                  }`}
                >
                  {isPast ? '✓' : s.stage}
                </div>

                {/* Node Title & Stars */}
                <div className="text-center mt-1.5">
                  <div className={`text-[10px] sm:text-xs font-black truncate max-w-[70px] sm:max-w-none ${
                    isCurrent ? 'text-amber-900 dark:text-amber-300' : 'text-slate-600 dark:text-slate-400'
                  }`}>
                    {s.title.split(' ')[0]}
                  </div>
                  <div className="flex items-center justify-center text-[9px] text-amber-500">
                    {'⭐'.repeat(s.starCount)}
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Stage Controller Bar (Previous / Next Buttons) */}
      <div className="mt-4 pt-3 border-t-2 border-amber-100 dark:border-slate-800 flex items-center justify-between gap-3">
        <button
          onClick={handlePrev}
          disabled={visitorGameStage === 1}
          className={`btn-game-white px-4 py-2 text-xs font-bold flex items-center gap-1.5 ${
            visitorGameStage === 1 ? 'opacity-40 cursor-not-allowed' : ''
          }`}
        >
          <ChevronRight className="w-4 h-4" />
          <span>المرحلة السابقة</span>
        </button>

        <div className="flex items-center gap-1">
          {GAME_STAGES.map(s => (
            <span
              key={s.stage}
              className={`w-2.5 h-2.5 rounded-full transition-all ${
                s.stage === visitorGameStage 
                  ? 'bg-amber-500 scale-125 ring-2 ring-amber-300' 
                  : s.stage < visitorGameStage 
                  ? 'bg-emerald-400' 
                  : 'bg-slate-200 dark:bg-slate-700'
              }`}
            />
          ))}
        </div>

        <button
          onClick={handleNext}
          disabled={visitorGameStage === GAME_STAGES.length}
          className={`btn-game-amber px-5 py-2 text-xs font-black flex items-center gap-1.5 shadow-md ${
            visitorGameStage === GAME_STAGES.length ? 'opacity-40 cursor-not-allowed' : ''
          }`}
        >
          <span>المرحلة التالية</span>
          <ChevronLeft className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
