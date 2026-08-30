import React from 'react';
import { ParkProvider, usePark, THEME_OPTIONS } from './context/ParkContext';
import { Header } from './components/common/Header';
import { VisitorPortal } from './components/visitor/VisitorPortal';
import { CashierPortal } from './components/cashier/CashierPortal';
import { GatePortal } from './components/gate/GatePortal';
import { AttractionOperatorPortal } from './components/attractions/AttractionOperatorPortal';
import { SecurityPortal } from './components/security/SecurityPortal';
import { AdminDashboard } from './components/admin/AdminDashboard';
import { QRDisplayModal } from './components/common/QRDisplayModal';
import { QRScannerModal } from './components/common/QRScannerModal';
import { ThermalTicketModal } from './components/common/ThermalTicketModal';
import { ThemeSelectionModal } from './components/common/ThemeSelectionModal';
import { TakeshiCastleMapModal } from './components/map/TakeshiCastleMapModal';
import { OnboardingTourModal } from './components/common/OnboardingTourModal';
import { SmartNotificationsToast } from './components/common/SmartNotificationsToast';
import { PublicMissingPersonBanner } from './components/common/PublicMissingPersonBanner';
import { AchievementBadgePopup, AchievementsGalleryModal } from './components/common/AchievementBadge';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Sparkles, 
  Smartphone, 
  WifiOff, 
  ShieldAlert, 
  RefreshCw, 
  PlayCircle,
  HelpCircle,
  Palette,
  Compass,
  Map,
  Trophy,
  Bell
} from 'lucide-react';

const MainAppContent: React.FC = () => {
  const { 
    theme,
    openThemeModal,
    openCastleMap,
    openOnboarding,
    currentRole, 
    setCurrentRole, 
    isOnline, 
    toggleNetworkMode, 
    testReplayAttack, 
    offlineSyncQueue, 
    syncOfflineQueueManually,
    notifications,
    dismissNotification,
    achievements,
    activeAchievementPopup,
    setActiveAchievementPopup,
    isAchievementsModalOpen,
    openAchievementsModal,
    closeAchievementsModal
  } = usePark();

  const currentThemeObj = THEME_OPTIONS.find(t => t.id === theme) || THEME_OPTIONS[0];

  const getThemeContainerClass = () => {
    switch (theme) {
      case 'candy_carnival':
        return 'bg-gradient-to-b from-[#fff1f2] via-[#ffe4e6] to-[#fce7f3]/50 text-slate-900 selection:bg-rose-400 selection:text-white';
      case 'sunny_adventure':
        return 'bg-gradient-to-b from-[#fffbeb] via-[#fef3c7] to-[#fed7aa]/40 text-slate-900 selection:bg-orange-400 selection:text-slate-950';
      case 'magic_fantasy':
        return 'bg-gradient-to-b from-[#faf5ff] via-[#f3e8ff] to-[#e0e7ff]/40 text-slate-900 selection:bg-purple-400 selection:text-white';
      case 'emerald_park':
        return 'bg-gradient-to-b from-[#f0fdf4] via-[#dcfce7] to-[#ecfdf5] text-slate-900 selection:bg-emerald-400 selection:text-slate-950';
      case 'night_carnival':
        return 'bg-slate-950 text-slate-100 selection:bg-rose-500 selection:text-white';
      case 'joyful_wonderland':
      default:
        return 'bg-gradient-to-b from-[#fffdf5] via-[#fff9eb] to-[#fef3c7]/30 text-slate-900 selection:bg-amber-400 selection:text-slate-950';
    }
  };

  return (
    <div className={`min-h-screen ${getThemeContainerClass()} flex flex-col font-sans transition-colors duration-300`} dir="rtl">
      {/* Top Interactive Simulation Bar */}
      <div className="bg-slate-900/90 border-b border-slate-800/80 px-4 py-2 text-xs">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <span className="flex h-2 w-2 relative">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
            </span>
            <span className="font-bold text-slate-200">مشروع Sirafi tickets:</span>
            <span className="text-slate-400 hidden sm:inline">نظام التذاكر وإدارة الألعاب والسلامة العائلية 🎢</span>
          </div>

          <div className="flex items-center gap-2 overflow-x-auto">
            {/* Takeshi Castle Interactive Map Button */}
            <button
              id="topbar-castle-map-btn"
              onClick={() => openCastleMap()}
              className="px-2.5 py-1 bg-gradient-to-r from-amber-500 to-rose-500 hover:from-amber-400 hover:to-rose-400 text-slate-950 rounded-xl text-[11px] font-black transition-all flex items-center gap-1.5 shrink-0 shadow-md shadow-amber-950/40"
              title="فتح خريطة قلعة الحصن التفاعلية ومتابعة مسار العائلة"
            >
              <span>🏯 خريطة الحصن</span>
              <span className="bg-slate-950/20 text-slate-950 px-1 rounded text-[9px]">تفاعلية</span>
            </button>

            {/* Achievements Button */}
            <button
              id="topbar-achievements-btn"
              onClick={openAchievementsModal}
              className="px-2.5 py-1 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white rounded-xl text-[11px] font-black transition-all flex items-center gap-1.5 shrink-0 shadow-sm"
              title="عرض أوسمة وإنجازات الحصن"
            >
              <Trophy className="w-3.5 h-3.5 text-amber-300" />
              <span>الأوسمة ({achievements.filter(a => a.unlocked).length}/{achievements.length})</span>
            </button>

            {/* Educational Walkthrough Guide Button */}
            <button
              id="topbar-onboarding-guide-btn"
              onClick={openOnboarding}
              className="px-2.5 py-1 bg-slate-800 hover:bg-slate-700 text-emerald-300 border border-emerald-500/30 rounded-xl text-[11px] font-bold transition-all flex items-center gap-1 shrink-0"
              title="دليل وجولة الحصن التعليمية التفاعلية خطوة بخطوة"
            >
              <HelpCircle className="w-3.5 h-3.5" />
              <span>🧭 جولة النظام</span>
            </button>

            {/* Direct Theme Switcher Button in Top Bar */}
            <button
              id="topbar-theme-select-btn"
              onClick={openThemeModal}
              className="px-2.5 py-1 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white rounded-xl text-[11px] font-bold transition-all flex items-center gap-1.5 shrink-0 shadow-sm"
              title="تغيير ثيم ومظهر التطبيق"
            >
              <Palette className="w-3.5 h-3.5" />
              <span>🎨 {currentThemeObj.nameAr}</span>
            </button>

            <span className="text-slate-700 hidden sm:inline">|</span>
            <span className="text-[11px] text-slate-400 font-bold hidden md:inline">بوابات النظام:</span>
            
            <button
              onClick={() => setCurrentRole('visitor')}
              className={`px-2.5 py-1 rounded-xl text-[11px] font-bold transition-all flex items-center gap-1 shrink-0 ${
                currentRole === 'visitor' ? 'bg-emerald-600 text-white shadow-md' : 'bg-slate-800 hover:bg-slate-700 text-emerald-300'
              }`}
            >
              1. هاتف الزائر 📱
            </button>

            <button
              onClick={() => setCurrentRole('cashier')}
              className={`px-2.5 py-1 rounded-xl text-[11px] font-bold transition-all flex items-center gap-1 shrink-0 ${
                currentRole === 'cashier' ? 'bg-amber-600 text-white shadow-md' : 'bg-slate-800 hover:bg-slate-700 text-amber-300'
              }`}
            >
              2. نقطة الكاشير 🎟️
            </button>

            <button
              onClick={() => setCurrentRole('gate_staff')}
              className={`px-2.5 py-1 rounded-xl text-[11px] font-bold transition-all flex items-center gap-1 shrink-0 ${
                currentRole === 'gate_staff' ? 'bg-blue-600 text-white shadow-md' : 'bg-slate-800 hover:bg-slate-700 text-blue-300'
              }`}
            >
              3. بوابة الدخول 🚪
            </button>

            <button
              onClick={() => setCurrentRole('attraction_staff')}
              className={`px-2.5 py-1 rounded-xl text-[11px] font-bold transition-all flex items-center gap-1 shrink-0 ${
                currentRole === 'attraction_staff' ? 'bg-purple-600 text-white shadow-md' : 'bg-slate-800 hover:bg-slate-700 text-purple-300'
              }`}
            >
              4. مشغل اللعبة 🎡
            </button>

            <button
              onClick={() => setCurrentRole('security')}
              className={`px-2.5 py-1 rounded-xl text-[11px] font-bold transition-all flex items-center gap-1 shrink-0 ${
                currentRole === 'security' ? 'bg-rose-600 text-white shadow-md' : 'bg-slate-800 hover:bg-slate-700 text-rose-300'
              }`}
            >
              5. غرفة الأمن 🚨
            </button>

            <button
              onClick={() => setCurrentRole('admin')}
              className={`px-2.5 py-1 rounded-xl text-[11px] font-bold transition-all flex items-center gap-1 shrink-0 ${
                currentRole === 'admin' ? 'bg-teal-600 text-white shadow-md' : 'bg-slate-800 hover:bg-slate-700 text-teal-300'
              }`}
            >
              6. الإدارة 🖥️
            </button>

            <button
              onClick={testReplayAttack}
              className="px-2.5 py-1 bg-rose-950/60 hover:bg-rose-900/80 text-rose-300 border border-rose-800/60 rounded-xl text-[11px] font-bold transition-all flex items-center gap-1 shrink-0"
              title="اختبار حماية منع تصوير واستخدام QR مرتين (Section 17)"
            >
              <ShieldAlert className="w-3 h-3 text-rose-400" />
              Replay Attack 🚫
            </button>
          </div>
        </div>
      </div>

      {/* Public Missing Child Emergency Surface Announcement Banner */}
      <PublicMissingPersonBanner />

      {/* Main App Navigation Header */}
      <Header />

      {/* Main View Area with Game-Stage Framer Motion Transitions */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 py-6 overflow-hidden">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentRole}
            initial={{ opacity: 0, y: 20, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.98 }}
            transition={{ type: "spring", stiffness: 320, damping: 26, duration: 0.3 }}
            className="w-full"
          >
            {currentRole === 'visitor' && <VisitorPortal />}
            {currentRole === 'cashier' && <CashierPortal />}
            {currentRole === 'gate_staff' && <GatePortal />}
            {currentRole === 'attraction_staff' && <AttractionOperatorPortal />}
            {currentRole === 'security' && <SecurityPortal />}
            {currentRole === 'admin' && <AdminDashboard />}
          </motion.div>
        </AnimatePresence>
      </main>

      {/* Global Hardware & Operational Standard Footer */}
      <footer className="bg-slate-900/90 border-t border-slate-800 mt-auto py-5 text-xs text-slate-400">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-emerald-500/10 rounded-2xl border border-emerald-500/20 text-emerald-400">
              <Smartphone className="w-5 h-5" />
            </div>
            <div>
              <div className="font-bold text-white">نظام Sirafi tickets — هاتف أولاً (Phone First)</div>
              <div className="text-[11px] text-slate-500">
                🚫 لا أجهزة إضافية • لا قارئات بوابات • لا أساور RFID • هاتف الزائر وهاتف الموظف فقط
              </div>
            </div>
          </div>

          <div className="flex items-center gap-4 text-[11px]">
            <div className="flex items-center gap-1.5 font-mono">
              <span className={`w-2 h-2 rounded-full ${isOnline ? 'bg-emerald-400' : 'bg-amber-400'}`} />
              <span>{isOnline ? 'وضع متصل Online 🟢' : 'وضع غير متصل Offline 🟠'}</span>
            </div>
            {offlineSyncQueue.length > 0 && (
              <button
                onClick={syncOfflineQueueManually}
                className="px-2 py-1 bg-purple-900/40 border border-purple-700/50 text-purple-300 rounded-xl hover:bg-purple-800/50 transition-all flex items-center gap-1 font-bold"
              >
                <RefreshCw className="w-3 h-3" />
                مزامنة {offlineSyncQueue.length} عمليات معلقة
              </button>
            )}
            <span className="text-slate-600">|</span>
            <span>الإصدار 1.0.0 التشغيلي</span>
          </div>
        </div>
      </footer>

      {/* Smart Real-time Notifications Toast */}
      <SmartNotificationsToast
        notifications={notifications}
        onDismiss={dismissNotification}
        onOpenRide={(attrId) => {
          setCurrentRole('visitor');
          openCastleMap(attrId);
        }}
      />

      {/* Interactive Achievement Popups & Gallery */}
      {activeAchievementPopup && (
        <AchievementBadgePopup
          achievement={activeAchievementPopup}
          onClose={() => setActiveAchievementPopup(null)}
        />
      )}
      <AchievementsGalleryModal
        isOpen={isAchievementsModalOpen}
        onClose={closeAchievementsModal}
        achievements={achievements}
      />

      {/* Global Interactive Modals */}
      <QRDisplayModal />
      <QRScannerModal />
      <ThermalTicketModal />
      <ThemeSelectionModal />
      <TakeshiCastleMapModal />
      <OnboardingTourModal />
    </div>
  );
};

export default function App() {
  return (
    <ParkProvider>
      <MainAppContent />
    </ParkProvider>
  );
}
