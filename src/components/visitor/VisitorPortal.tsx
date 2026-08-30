import React from 'react';
import { usePark } from '../../context/ParkContext';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Users, 
  Coins, 
  Ticket as TicketIcon, 
  Compass, 
  Sparkles, 
  HelpCircle,
  Gamepad2,
  ShieldCheck,
  Zap,
  Layers,
  Trophy,
  CloudSun
} from 'lucide-react';
import { GameStageNavigation } from './GameStageNavigation';
import { Stage1UnitsVault } from './stages/Stage1UnitsVault';
import { Stage2TicketShop } from './stages/Stage2TicketShop';
import { Stage3FamilySquad } from './stages/Stage3FamilySquad';
import { Stage4AttractionsArena } from './stages/Stage4AttractionsArena';
import { Stage5AdventureLedger } from './stages/Stage5AdventureLedger';
import { WeatherWidget } from '../common/SmartNotificationsToast';

export const VisitorPortal: React.FC = () => {
  const { 
    visitor, 
    tickets, 
    visitorGameStage, 
    visitorNavMode,
    openCastleMap,
    openOnboarding,
    weather,
    simulateWeatherChange,
    achievements,
    openAchievementsModal
  } = usePark();

  const visitorTickets = (tickets || []).filter(t => t.visitorId === visitor?.id);
  const availableTickets = visitorTickets.filter(t => t.status === 'AVAILABLE' || t.status === 'VALIDATED');
  const unlockedAchievementsCount = achievements.filter(a => a.unlocked).length;

  return (
    <div className="space-y-6 animate-fadeIn pb-16">
      {/* Playful Top Identity & Quick Stats Pill Bar */}
      <div className="bg-white/95 dark:bg-slate-900/95 rounded-3xl p-4 sm:p-5 border-3 border-amber-300 dark:border-slate-800 shadow-xl flex flex-wrap items-center justify-between gap-4">
        {/* Visitor User Profile & Family Count */}
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-amber-400 via-rose-400 to-amber-500 p-0.5 shadow-md flex items-center justify-center shrink-0">
            <div className="w-full h-full bg-white dark:bg-slate-900 rounded-[14px] flex items-center justify-center text-2xl font-black">
              👑
            </div>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-sm font-black text-slate-900 dark:text-white">
                {visitor.name}
              </span>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 font-black border border-emerald-300">
                {visitor.id}
              </span>
            </div>
            <div className="text-xs font-bold text-slate-500 dark:text-slate-400 flex items-center gap-2 mt-0.5">
              <span>{visitor.phone}</span>
              <span>•</span>
              <span className="text-rose-600 dark:text-rose-400 font-black">
                {visitor.familyMembers.length} أفراد بالعائلة 👨‍👩‍👧‍👦
              </span>
            </div>
          </div>
        </div>

        {/* Quick Dynamic Balance Badges & Achievement/Map Triggers */}
        <div className="flex flex-wrap items-center gap-2 sm:gap-3">
          {/* Units Balance Badge */}
          <div className="flex items-center gap-2 px-3.5 py-1.5 rounded-2xl bg-amber-50 dark:bg-slate-800 border-2 border-amber-300 dark:border-slate-700 shadow-xs">
            <Coins className="w-4 h-4 text-amber-500" />
            <div className="text-xs">
              <span className="text-slate-500 font-bold ml-1">الوحدات:</span>
              <span className="text-sm font-black text-amber-600 font-changa">{visitor.unitsBalance} 🪙</span>
            </div>
          </div>

          {/* Tickets Badge */}
          <div className="flex items-center gap-2 px-3.5 py-1.5 rounded-2xl bg-sky-50 dark:bg-slate-800 border-2 border-sky-300 dark:border-slate-700 shadow-xs">
            <TicketIcon className="w-4 h-4 text-sky-500" />
            <div className="text-xs">
              <span className="text-slate-500 font-bold ml-1">التذاكر:</span>
              <span className="text-sm font-black text-sky-600 font-changa">{availableTickets.length} صالحة</span>
            </div>
          </div>

          {/* Achievements Trigger */}
          <button
            onClick={openAchievementsModal}
            className="btn-game-purple px-3 py-1.5 text-xs font-black flex items-center gap-1.5 shadow-sm"
            title="عرض إنجازات وأوسمة الحديقة"
          >
            <Trophy className="w-4 h-4 text-amber-300" />
            <span>الأوسمة ({unlockedAchievementsCount}/{achievements.length}) 🏆</span>
          </button>

          {/* Castle Map Quick Trigger */}
          <button
            onClick={() => openCastleMap()}
            className="btn-game-amber px-3.5 py-1.5 text-xs font-black flex items-center gap-1.5 shadow-sm"
          >
            <Compass className="w-4 h-4" />
            <span>خريطة الحصن 🏯</span>
          </button>
        </div>
      </div>

      {/* Weather & Live Status Bar */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="lg:col-span-2">
          {/* Game Stage Stepper & Navigation Controller */}
          <GameStageNavigation />
        </div>
        <div>
          <WeatherWidget
            weather={weather}
            onSimulateWeatherChange={simulateWeatherChange}
          />
        </div>
      </div>

      {/* Main Content: Either Stage-by-Stage Game Transitions OR Full Expanded View */}
      {visitorNavMode === 'game_stages' ? (
        <AnimatePresence mode="wait">
          <motion.div
            key={visitorGameStage}
            initial={{ opacity: 0, x: -40, scale: 0.98 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            exit={{ opacity: 0, x: 40, scale: 0.98 }}
            transition={{ duration: 0.25, ease: 'easeOut' }}
          >
            {visitorGameStage === 1 && <Stage1UnitsVault />}
            {visitorGameStage === 2 && <Stage2TicketShop />}
            {visitorGameStage === 3 && <Stage3FamilySquad />}
            {visitorGameStage === 4 && <Stage4AttractionsArena />}
            {visitorGameStage === 5 && <Stage5AdventureLedger />}
          </motion.div>
        </AnimatePresence>
      ) : (
        /* Classic Expanded Scroll Mode */
        <div className="space-y-8 animate-fadeIn">
          <div className="p-3 bg-amber-100/60 dark:bg-slate-800/80 rounded-2xl border border-amber-300 text-xs text-amber-900 dark:text-amber-300 font-bold flex items-center justify-between">
            <span>📑 أنت الآن في العرض الشامل الممتد لكافة أقسام بوابة الزائر.</span>
            <span className="font-mono text-[11px]">يمكنك التبديل لأعلى للعودة لنظام المراحل التفاعلي</span>
          </div>

          <Stage1UnitsVault />
          <Stage2TicketShop />
          <Stage3FamilySquad />
          <Stage4AttractionsArena />
          <Stage5AdventureLedger />
        </div>
      )}
    </div>
  );
};
