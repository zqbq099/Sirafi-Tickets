import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Palette, 
  Check, 
  X, 
  Sparkles, 
  Sun, 
  Moon, 
  Palmtree, 
  Zap, 
  Ticket as TicketIcon,
  ShieldCheck,
  Eye,
  Sliders
} from 'lucide-react';
import { usePark, THEME_OPTIONS } from '../../context/ParkContext';
import { AppTheme } from '../../types';

export const ThemeSelectionModal: React.FC = () => {
  const { theme, setTheme, isThemeModalOpen, closeThemeModal } = usePark();

  if (!isThemeModalOpen) return null;

  const currentThemeObj = THEME_OPTIONS.find(t => t.id === theme) || THEME_OPTIONS[0];

  const getThemeIcon = (iconName: string, className = 'w-5 h-5') => {
    switch (iconName) {
      case 'Sun': return <Sun className={className} />;
      case 'Sparkles': return <Sparkles className={className} />;
      case 'Palmtree': return <Palmtree className={className} />;
      case 'Zap': return <Zap className={className} />;
      case 'Moon':
      default:
        return <Moon className={className} />;
    }
  };

  // Preview card styling per theme
  const getThemeCardStyles = (themeId: AppTheme, isSelected: boolean) => {
    switch (themeId) {
      case 'joyful_wonderland':
        return {
          wrapper: isSelected 
            ? 'bg-amber-50/90 border-3 border-amber-500 shadow-xl shadow-amber-500/20 ring-2 ring-amber-400' 
            : 'bg-white hover:bg-amber-50/50 border-2 border-amber-200 hover:border-amber-400 shadow-sm',
          title: 'text-amber-950 font-black',
          desc: 'text-slate-700',
          badge: 'bg-amber-100 text-amber-900 border-amber-300 font-black',
          previewBg: 'bg-gradient-to-r from-amber-100 to-sky-100 border border-amber-300 text-slate-900',
          buttonClass: 'btn-game-amber'
        };
      case 'candy_carnival':
        return {
          wrapper: isSelected 
            ? 'bg-rose-50/90 border-3 border-rose-500 shadow-xl shadow-rose-500/20 ring-2 ring-rose-400' 
            : 'bg-white hover:bg-rose-50/50 border-2 border-rose-200 hover:border-rose-400 shadow-sm',
          title: 'text-rose-950 font-black',
          desc: 'text-slate-700',
          badge: 'bg-rose-100 text-rose-900 border-rose-300 font-black',
          previewBg: 'bg-gradient-to-r from-rose-100 to-pink-100 border border-rose-300 text-slate-900',
          buttonClass: 'btn-game-rose'
        };
      case 'sunny_adventure':
        return {
          wrapper: isSelected 
            ? 'bg-orange-50/90 border-3 border-orange-500 shadow-xl shadow-orange-500/20 ring-2 ring-orange-400' 
            : 'bg-white hover:bg-orange-50/50 border-2 border-orange-200 hover:border-orange-400 shadow-sm',
          title: 'text-orange-950 font-black',
          desc: 'text-slate-700',
          badge: 'bg-orange-100 text-orange-900 border-orange-300 font-black',
          previewBg: 'bg-gradient-to-r from-orange-100 to-amber-100 border border-orange-300 text-slate-900',
          buttonClass: 'btn-game-amber'
        };
      case 'magic_fantasy':
        return {
          wrapper: isSelected 
            ? 'bg-purple-50/90 border-3 border-purple-500 shadow-xl shadow-purple-500/20 ring-2 ring-purple-400' 
            : 'bg-white hover:bg-purple-50/50 border-2 border-purple-200 hover:border-purple-400 shadow-sm',
          title: 'text-purple-950 font-black',
          desc: 'text-slate-700',
          badge: 'bg-purple-100 text-purple-900 border-purple-300 font-black',
          previewBg: 'bg-gradient-to-r from-purple-100 to-pink-100 border border-purple-300 text-slate-900',
          buttonClass: 'btn-game-purple'
        };
      case 'emerald_park':
        return {
          wrapper: isSelected 
            ? 'bg-emerald-50/90 border-3 border-emerald-500 shadow-xl shadow-emerald-500/20 ring-2 ring-emerald-400' 
            : 'bg-white hover:bg-emerald-50/50 border-2 border-emerald-200 hover:border-emerald-400 shadow-sm',
          title: 'text-emerald-950 font-black',
          desc: 'text-slate-700',
          badge: 'bg-emerald-100 text-emerald-900 border-emerald-300 font-black',
          previewBg: 'bg-gradient-to-r from-emerald-100 to-teal-100 border border-emerald-300 text-slate-900',
          buttonClass: 'btn-game-emerald'
        };
      case 'night_carnival':
      default:
        return {
          wrapper: isSelected 
            ? 'bg-slate-900 border-3 border-sky-400 shadow-xl shadow-sky-500/20 ring-2 ring-sky-400' 
            : 'bg-slate-900/90 hover:bg-slate-900 border-2 border-slate-700 hover:border-sky-400 shadow-sm',
          title: 'text-sky-300 font-black',
          desc: 'text-slate-300',
          badge: 'bg-sky-500/20 text-sky-300 border-sky-500/40 font-black',
          previewBg: 'bg-slate-950 border border-sky-500/30 text-sky-100',
          buttonClass: 'btn-game-sky'
        };
    }
  };

  return (
    <AnimatePresence>
      <div 
        id="theme-selection-modal-backdrop" 
        className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md overflow-y-auto"
        onClick={closeThemeModal}
      >
        <motion.div
          id="theme-selection-modal-container"
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          transition={{ duration: 0.2 }}
          onClick={(e) => e.stopPropagation()}
          className={`relative w-full max-w-4xl rounded-3xl p-6 sm:p-8 shadow-2xl overflow-hidden text-right border-3 transition-colors ${
            theme === 'night_carnival'
              ? 'bg-slate-900 border-slate-700 text-slate-100'
              : 'bg-white border-amber-300 text-slate-900 shadow-amber-500/10'
          }`}
          dir="rtl"
        >
          {/* Header */}
          <div className="flex items-start justify-between border-b pb-5 mb-6 border-slate-200 dark:border-slate-800">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-amber-500/20 border-2 border-amber-400 rounded-2xl text-amber-600 shadow-sm">
                <Palette className="w-7 h-7 stroke-[2.5]" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h2 className="text-xl sm:text-2xl font-black">اختيار المظهر والثيم البصري 🎨</h2>
                  <span className="text-xs px-3 py-1 rounded-full bg-amber-400 text-slate-950 font-black border border-amber-500 shadow-xs">
                    {THEME_OPTIONS.length} ثيمات مرحة
                  </span>
                </div>
                <p className="text-sm text-slate-600 dark:text-slate-400 mt-1 font-medium">
                  اختر الطابع المبهج والألوان الفاتحة المناسبة لأجواء الحديقة وملاهي الأطفال والمغامرات
                </p>
              </div>
            </div>

            <button
              id="close-theme-modal-btn"
              onClick={closeThemeModal}
              className="p-2.5 rounded-2xl bg-slate-100 dark:bg-slate-800 text-slate-500 hover:text-slate-900 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors border border-slate-200 dark:border-slate-700"
              title="إغلاق النافذة"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Active Theme Bar */}
          <div className="bg-amber-50/80 dark:bg-slate-950/70 border-2 border-amber-200 dark:border-slate-800 rounded-2xl p-4 mb-6 flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-2xl bg-amber-400 text-slate-950 shadow-sm">
                {getThemeIcon(currentThemeObj.icon, 'w-5 h-5')}
              </div>
              <div>
                <div className="text-xs font-bold text-amber-800 dark:text-slate-400">الثيم الفعّال حالياً</div>
                <div className="text-base font-black text-slate-900 dark:text-white flex items-center gap-2">
                  {currentThemeObj.nameAr}
                  <span className="text-xs text-slate-500 font-normal">({currentThemeObj.nameEn})</span>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <div className="flex items-center gap-1.5 bg-white dark:bg-slate-900 px-3.5 py-2 rounded-xl border border-amber-200 dark:border-slate-800 shadow-xs">
                <span className="text-xs font-bold text-slate-600 dark:text-slate-400 ml-1">لوحة الألوان:</span>
                {currentThemeObj.previewColors.map((color, idx) => (
                  <span 
                    key={idx} 
                    className="w-5 h-5 rounded-full border-2 border-white shadow-sm" 
                    style={{ backgroundColor: color }}
                    title={color}
                  />
                ))}
              </div>
            </div>
          </div>
          {/* Theme Options Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
            {THEME_OPTIONS.map((opt) => {
              const isSelected = theme === opt.id;
              const styles = getThemeCardStyles(opt.id, isSelected);

              return (
                <div
                  key={opt.id}
                  id={`theme-card-${opt.id}`}
                  onClick={() => setTheme(opt.id)}
                  className={`cursor-pointer rounded-2xl p-4 transition-all duration-200 relative group flex flex-col justify-between ${styles.wrapper}`}
                >
                  {/* Top Row: Icon + Badge + Check */}
                  <div>
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-center gap-2.5">
                        <div className={`p-2 rounded-xl ${isSelected ? 'bg-emerald-500/20 text-emerald-400' : 'bg-slate-800 text-slate-300'}`}>
                          {getThemeIcon(opt.icon, 'w-5 h-5')}
                        </div>
                        <span className={`text-xs px-2 py-0.5 rounded-full border font-medium ${styles.badge}`}>
                          {opt.badge}
                        </span>
                      </div>

                      <div className={`w-6 h-6 rounded-full flex items-center justify-center border transition-all ${
                        isSelected 
                          ? 'bg-emerald-500 border-emerald-400 text-slate-950 font-bold scale-110 shadow-md shadow-emerald-500/40' 
                          : 'border-slate-700 bg-slate-800/60 text-transparent group-hover:border-slate-500'
                      }`}>
                        <Check className="w-3.5 h-3.5 stroke-[3]" />
                      </div>
                    </div>

                    {/* Title & Description */}
                    <h3 className={`font-bold text-base mb-1 ${styles.title}`}>
                      {opt.nameAr}
                    </h3>
                    <div className="text-xs font-mono text-slate-400 mb-2">
                      {opt.nameEn}
                    </div>
                    <p className={`text-xs leading-relaxed mb-4 ${styles.desc}`}>
                      {opt.descriptionAr}
                    </p>
                  </div>

                  {/* Micro Visual Preview */}
                  <div className={`rounded-xl p-3 text-xs mb-3 ${styles.previewBg}`}>
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-semibold flex items-center gap-1">
                        <TicketIcon className="w-3.5 h-3.5 text-emerald-400" />
                        تذكرة T-000182
                      </span>
                      <span className="text-[10px] px-1.5 py-0.5 rounded-sm bg-emerald-500/20 text-emerald-300 font-mono">
                        500 وحدة
                      </span>
                    </div>
                    <div className="w-full bg-black/20 rounded-full h-1.5 overflow-hidden">
                      <div className="bg-emerald-400 h-full rounded-full w-3/4"></div>
                    </div>
                  </div>

                  {/* Color Swatches & Select Action */}
                  <div className="flex items-center justify-between pt-2 border-t border-slate-800/40">
                    <div className="flex items-center gap-1">
                      {opt.previewColors.map((color, i) => (
                        <span 
                          key={i} 
                          className="w-3.5 h-3.5 rounded-full border border-black/20 shadow-xs" 
                          style={{ backgroundColor: color }}
                        />
                      ))}
                    </div>

                    <button
                      type="button"
                      className={`text-xs px-3 py-1.5 rounded-xl font-medium transition-all ${
                        isSelected 
                          ? 'bg-emerald-500 text-slate-950 font-bold' 
                          : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                      }`}
                    >
                      {isSelected ? 'المظهر المفعل ✓' : 'تفعيل الثيم'}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Footer Guide Note */}
          <div className="bg-slate-950/60 border border-slate-800/60 rounded-2xl p-4 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-400">
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>
                يتم حفظ الثيم المختار تلقائياً في المتصفح ومزامنته عبر جميع بوابات النظام (الكاشير، البوابات، الألعاب، الأمن، الإدارة، وتطبيق الزائر).
              </span>
            </div>

            <button
              id="confirm-theme-btn"
              onClick={closeThemeModal}
              className="w-full sm:w-auto px-5 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold transition-colors whitespace-nowrap shadow-lg shadow-emerald-500/20"
            >
              تم واعتماد الثيم
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
