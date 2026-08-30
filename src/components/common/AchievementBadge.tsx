import React, { useEffect } from 'react';
import confetti from 'canvas-confetti';
import { Achievement } from '../../types';
import { AchievementTrophyIcon, TicketRibbonIcon, TakeshiCastleIcon, RollerCoasterIcon } from './ParkIcons';
import { Sparkles, X, Award, CheckCircle2, Flame, Gift } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

// Celebration confetti triggers
export const triggerCelebrationConfetti = () => {
  try {
    confetti({
      particleCount: 90,
      spread: 80,
      origin: { y: 0.6 },
      colors: ['#F59E0B', '#EF4444', '#10B981', '#3B82F6', '#EC4899', '#8B5CF6']
    });
  } catch (e) {
    console.error('Confetti trigger error:', e);
  }
};

export const triggerGrandCelebration = () => {
  try {
    const duration = 2.5 * 1000;
    const animationEnd = Date.now() + duration;
    const defaults = { startVelocity: 35, spread: 360, ticks: 60, zIndex: 99999 };

    function randomInRange(min: number, max: number) {
      return Math.random() * (max - min) + min;
    }

    const interval: any = setInterval(function() {
      const timeLeft = animationEnd - Date.now();
      if (timeLeft <= 0) {
        return clearInterval(interval);
      }
      const particleCount = 35 * (timeLeft / duration);
      confetti({ ...defaults, particleCount, origin: { x: randomInRange(0.1, 0.4), y: Math.random() - 0.2 } });
      confetti({ ...defaults, particleCount, origin: { x: randomInRange(0.6, 0.9), y: Math.random() - 0.2 } });
    }, 200);
  } catch (e) {
    console.error('Grand confetti error:', e);
  }
};

interface AchievementBadgeProps {
  achievement: Achievement | null;
  onClose: () => void;
}

export const AchievementBadgePopup: React.FC<AchievementBadgeProps> = ({ achievement, onClose }) => {
  useEffect(() => {
    if (achievement) {
      triggerCelebrationConfetti();
      const timer = setTimeout(() => {
        // Auto close after 6 seconds if not closed
        // onClose();
      }, 6000);
      return () => clearTimeout(timer);
    }
  }, [achievement]);

  if (!achievement) return null;

  return (
    <AnimatePresence>
      <div 
        className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-md"
        dir="rtl"
      >
        <motion.div
          initial={{ scale: 0.7, opacity: 0, y: 40, rotate: -4 }}
          animate={{ scale: 1, opacity: 1, y: 0, rotate: 0 }}
          exit={{ scale: 0.8, opacity: 0, y: 30 }}
          transition={{ type: "spring", damping: 15, stiffness: 300 }}
          className="relative max-w-md w-full bg-gradient-to-b from-amber-400 via-amber-300 to-amber-500 rounded-3xl p-1 shadow-2xl border-4 border-amber-200"
        >
          {/* Inner Card Content */}
          <div className="bg-slate-900 rounded-[22px] p-6 text-center text-white relative overflow-hidden">
            {/* Background Decorative Rings */}
            <div className="absolute -top-12 -left-12 w-32 h-32 bg-amber-500/20 rounded-full blur-xl pointer-events-none" />
            <div className="absolute -bottom-12 -right-12 w-32 h-32 bg-rose-500/20 rounded-full blur-xl pointer-events-none" />
            
            {/* Close Button */}
            <button
              onClick={onClose}
              className="absolute top-4 left-4 p-1.5 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition-all z-10"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Glowing Trophy Badge Icon */}
            <div className="relative inline-block my-2">
              <div className="w-24 h-24 mx-auto rounded-3xl bg-gradient-to-tr from-amber-500 to-yellow-300 p-0.5 shadow-xl shadow-amber-500/30 flex items-center justify-center border-2 border-yellow-200 animate-bounce-subtle">
                <div className="text-4xl">{achievement.icon}</div>
              </div>
              <span className="absolute -bottom-2 -right-2 bg-rose-600 text-white text-[11px] font-black px-2 py-0.5 rounded-full border-2 border-white shadow-md flex items-center gap-1">
                <Sparkles className="w-3 h-3 text-yellow-300" />
                إنجاز جديد!
              </span>
            </div>

            {/* Title & Description */}
            <div className="space-y-2 mt-4">
              <div className="text-amber-400 font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-1">
                <Award className="w-4 h-4" />
                <span>ميدالية الشرف في قلعة الحصن</span>
              </div>
              <h3 className="text-2xl font-black text-white">{achievement.titleAr}</h3>
              <p className="text-slate-300 text-sm leading-relaxed px-2 font-medium">
                {achievement.descriptionAr}
              </p>
            </div>

            {/* Reward Banner */}
            {achievement.rewardUnits > 0 && (
              <div className="mt-5 p-3 rounded-2xl bg-amber-950/60 border border-amber-500/40 flex items-center justify-between">
                <div className="flex items-center gap-2 text-right">
                  <div className="p-2 bg-amber-500 text-slate-950 rounded-xl font-bold">
                    <Gift className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="text-xs font-bold text-amber-300">مكافأة الفوز المباشرة</div>
                    <div className="text-[11px] text-slate-400">تضاف فوراً إلى رصيد وحداتك</div>
                  </div>
                </div>
                <div className="text-lg font-black text-amber-400 font-mono">
                  +{achievement.rewardUnits} وحدة 🪙
                </div>
              </div>
            )}

            {/* Action Buttons */}
            <div className="mt-6 flex gap-3">
              <button
                onClick={() => {
                  triggerCelebrationConfetti();
                  onClose();
                }}
                className="flex-1 py-3 btn-game-amber text-slate-950 text-base font-black flex items-center justify-center gap-2"
              >
                <span>متابعة المغامرة 🚀</span>
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

// Global Achievements Drawer/Modal
interface AchievementsModalProps {
  isOpen: boolean;
  onClose: () => void;
  achievements: Achievement[];
}

export const AchievementsGalleryModal: React.FC<AchievementsModalProps> = ({
  isOpen,
  onClose,
  achievements
}) => {
  if (!isOpen) return null;

  const unlockedCount = achievements.filter(a => a.unlocked).length;
  const totalCount = achievements.length;
  const progressPercent = Math.round((unlockedCount / totalCount) * 100);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm" dir="rtl">
      <div className="relative max-w-2xl w-full bg-slate-900 border-2 border-slate-700 rounded-3xl p-6 shadow-2xl text-white max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-400">
              <AchievementTrophyIcon className="w-7 h-7" />
            </div>
            <div>
              <h2 className="text-xl font-black text-white">سجل إنجازات وبطولات الحصن 🏆</h2>
              <p className="text-xs text-slate-400">احصل على الميداليات عبر استكشاف الألعاب وركوب المغامرات</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-2xl bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition-all"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Progress Bar */}
        <div className="my-4 p-4 rounded-2xl bg-slate-800/80 border border-slate-700/80">
          <div className="flex items-center justify-between text-xs font-bold mb-2">
            <span className="text-amber-400 flex items-center gap-1">
              <Flame className="w-4 h-4 text-amber-400" />
              مستوى التقدم الملكي: {unlockedCount} من {totalCount} ميداليات
            </span>
            <span className="font-mono text-slate-300">{progressPercent}% مكتمل</span>
          </div>
          <div className="w-full h-3.5 bg-slate-950 rounded-full overflow-hidden p-0.5 border border-slate-700">
            <div 
              className="h-full bg-gradient-to-r from-amber-500 via-rose-500 to-emerald-500 rounded-full transition-all duration-500"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
        </div>

        {/* Badges Grid */}
        <div className="flex-1 overflow-y-auto space-y-3 pr-1">
          {achievements.map((ach) => (
            <div
              key={ach.id}
              className={`p-4 rounded-2xl border-2 transition-all flex items-center gap-4 ${
                ach.unlocked
                  ? 'bg-gradient-to-r from-amber-950/30 via-slate-800/90 to-slate-800/60 border-amber-500/50 shadow-md shadow-amber-950/30'
                  : 'bg-slate-800/40 border-slate-800 opacity-60'
              }`}
            >
              <div className={`w-14 h-14 rounded-2xl flex items-center justify-center text-3xl shrink-0 border-2 ${
                ach.unlocked 
                  ? 'bg-amber-500/20 border-amber-400 shadow-inner' 
                  : 'bg-slate-800 border-slate-700 grayscale'
              }`}>
                {ach.icon}
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between gap-2">
                  <h4 className={`font-black text-base ${ach.unlocked ? 'text-amber-300' : 'text-slate-400'}`}>
                    {ach.titleAr}
                  </h4>
                  {ach.unlocked ? (
                    <span className="bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 px-2 py-0.5 rounded-full text-[11px] font-bold flex items-center gap-1 shrink-0">
                      <CheckCircle2 className="w-3 h-3" />
                      مكتمل
                    </span>
                  ) : (
                    <span className="bg-slate-800 text-slate-500 border border-slate-700 px-2 py-0.5 rounded-full text-[11px] font-bold shrink-0">
                      🔒 مقفل
                    </span>
                  )}
                </div>
                <p className="text-xs text-slate-300 mt-1">{ach.descriptionAr}</p>
                {ach.unlocked && ach.unlockedAt && (
                  <div className="text-[10px] text-slate-400 font-mono mt-1">
                    تم الإنجاز في: {ach.unlockedAt}
                  </div>
                )}
              </div>

              <div className="text-left shrink-0">
                <span className="text-xs font-black text-amber-400 font-mono">
                  +{ach.rewardUnits}🪙
                </span>
              </div>
            </div>
          ))}
        </div>

        {/* Footer */}
        <div className="mt-4 pt-3 border-t border-slate-800 flex justify-end">
          <button
            onClick={onClose}
            className="px-6 py-2.5 btn-game-white text-slate-900 font-black text-sm"
          >
            إغلاق
          </button>
        </div>
      </div>
    </div>
  );
};
