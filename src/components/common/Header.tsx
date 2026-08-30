import React from 'react';
import { usePark, THEME_OPTIONS } from '../../context/ParkContext';
import { UserRole } from '../../types';
import { 
  Wifi, 
  WifiOff, 
  ShieldAlert, 
  Users, 
  Ticket as TicketIcon, 
  DoorOpen, 
  Gamepad2, 
  ShieldCheck, 
  BarChart3, 
  RefreshCw, 
  Sparkles,
  Coins,
  Palette,
  Sun,
  Moon,
  Zap,
  Palmtree,
  Compass,
  HelpCircle
} from 'lucide-react';

export const Header: React.FC = () => {
  const { 
    theme,
    openThemeModal,
    openCastleMap,
    openOnboarding,
    isOnline, 
    toggleNetworkMode, 
    currentRole, 
    setCurrentRole, 
    visitor, 
    offlineSyncQueue,
    missingAlerts,
    resetToInitialDemoState
  } = usePark();

  const activeAlerts = (missingAlerts || []).filter(a => a.status === 'ACTIVE_SEARCH');
  const currentThemeObj = THEME_OPTIONS.find(t => t.id === theme) || THEME_OPTIONS[0];

  const getThemeIcon = (iconName: string) => {
    switch (iconName) {
      case 'Sun': return <Sun className="w-3.5 h-3.5 text-amber-400" />;
      case 'Sparkles': return <Sparkles className="w-3.5 h-3.5 text-pink-400" />;
      case 'Palmtree': return <Palmtree className="w-3.5 h-3.5 text-emerald-400" />;
      case 'Zap': return <Zap className="w-3.5 h-3.5 text-cyan-400" />;
      case 'Moon':
      default:
        return <Moon className="w-3.5 h-3.5 text-emerald-400" />;
    }
  };

  const roleConfigs: { role: UserRole; titleAr: string; icon: React.ReactNode; badgeColor: string }[] = [
    { role: 'visitor', titleAr: 'بوابة الزائر والعائلة', icon: <Users className="w-4 h-4" />, badgeColor: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30' },
    { role: 'cashier', titleAr: 'كاشير ومبيعات التذاكر', icon: <TicketIcon className="w-4 h-4" />, badgeColor: 'bg-amber-500/10 text-amber-400 border-amber-500/30' },
    { role: 'gate_staff', titleAr: 'بوابة الدخول الرئيسية', icon: <DoorOpen className="w-4 h-4" />, badgeColor: 'bg-blue-500/10 text-blue-400 border-blue-500/30' },
    { role: 'attraction_staff', titleAr: 'مشغل الألعاب', icon: <Gamepad2 className="w-4 h-4" />, badgeColor: 'bg-purple-500/10 text-purple-400 border-purple-500/30' },
    { role: 'security', titleAr: 'الأمن والسلامة', icon: <ShieldCheck className="w-4 h-4" />, badgeColor: 'bg-rose-500/10 text-rose-400 border-rose-500/30' },
    { role: 'admin', titleAr: 'الإدارة والتحليلات', icon: <BarChart3 className="w-4 h-4" />, badgeColor: 'bg-indigo-500/10 text-indigo-400 border-indigo-500/30' },
  ];

  return (
    <header className="sticky top-0 z-40 bg-white/95 dark:bg-slate-900/90 backdrop-blur-md border-b-2 border-amber-200 dark:border-slate-800 shadow-md">
      {/* Top Emergency Alert Banner if any child is missing */}
      {activeAlerts.length > 0 && (
        <div className="bg-rose-500 border-b border-rose-600 px-4 py-2.5 text-white flex items-center justify-between text-sm animate-pulse shadow-md">
          <div className="flex items-center gap-2 font-black">
            <ShieldAlert className="w-6 h-6 stroke-[2.5]" />
            <span>🚨 تنبيه أمني عاجل: بلاغ فقدان نشط للطفل ({activeAlerts[0].childName}) - تم إشعار فرق الأمن الميدانية</span>
          </div>
          <button
            onClick={() => setCurrentRole('security')}
            className="btn-game-white px-3 py-1 text-xs font-black shadow-sm"
          >
            فتح غرفة الأمن ↤
          </button>
        </div>
      )}

      {/* Main Header Bar */}
      <div className="max-w-7xl mx-auto px-3 sm:px-6 py-3 flex flex-wrap items-center justify-between gap-4">
        {/* Brand & Subtitle */}
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-amber-400 via-rose-400 to-amber-500 flex items-center justify-center text-slate-950 shadow-md font-black text-2xl border-2 border-amber-300">
            🎡
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-lg sm:text-xl font-black tracking-tight text-slate-900 dark:text-white flex items-center gap-1.5 font-changa">
                Sirafi Tickets
                <span className="text-xs px-2.5 py-0.5 rounded-full bg-amber-100 text-amber-900 dark:bg-amber-500/20 dark:text-amber-300 font-black border border-amber-300">
                  نظام الحدائق والملاهي
                </span>
              </h1>
            </div>
            <p className="text-xs text-slate-600 dark:text-slate-400 font-bold">
              إدارة التذاكر والوحدات والدخول والألعاب والسلامة العائلية 🛡️
            </p>
          </div>
        </div>

        {/* Live System Controls (Network Mode & Wallet Peek) */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Interactive Castle Map Button */}
          <button
            id="open-castle-map-header-btn"
            onClick={() => openCastleMap()}
            title="فتح خريطة قلعة الحصن التفاعلية ومتابعة مسار العائلة"
            className="btn-game-amber flex items-center gap-1.5 px-3.5 py-2 rounded-2xl text-xs font-black shadow-md"
          >
            <Compass className="w-4 h-4" />
            <span>خريطة الحصن 🏯</span>
          </button>

          {/* Educational Walkthrough Button */}
          <button
            id="open-onboarding-header-btn"
            onClick={openOnboarding}
            title="فتح الجولة التعليمية التفاعلية"
            className="hidden md:flex btn-game-white items-center gap-1.5 px-3 py-2 rounded-2xl text-xs font-bold shadow-xs"
          >
            <HelpCircle className="w-4 h-4 text-emerald-600" />
            <span>دليل الاستخدام 🧭</span>
          </button>

          {/* Quick Units Rate badge */}
          <div className="hidden lg:flex items-center gap-1.5 px-3 py-1.5 rounded-2xl bg-amber-50 dark:bg-slate-800 border-2 border-amber-200 dark:border-slate-700 text-xs text-slate-800 dark:text-amber-300 font-bold shadow-xs">
            <Coins className="w-4 h-4 text-amber-500" />
            <span>1 ريال = 5 وحدات</span>
            <span className="text-slate-400">|</span>
            <span className="text-amber-700 dark:text-amber-300 font-black">الرصيد: {visitor.unitsBalance} 🪙</span>
          </div>

          {/* Theme Selector Button */}
          <button
            id="open-theme-selector-header-btn"
            onClick={openThemeModal}
            title="تغيير ثيم ومظهر التطبيق (ألوان مرحة وفاتحة)"
            className="flex items-center gap-2 px-3.5 py-2 rounded-2xl text-xs font-black transition-all border-2 bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-200 border-amber-300 dark:border-slate-700 hover:border-amber-500 shadow-sm"
          >
            <Palette className="w-4 h-4 text-amber-500" />
            <span className="hidden sm:inline">الثيم:</span>
            <span className="text-amber-700 dark:text-amber-400 font-black">{currentThemeObj.nameAr}</span>
            <div className="flex items-center gap-0.5 ml-1">
              {currentThemeObj.previewColors.slice(0, 2).map((c, i) => (
                <span key={i} className="w-2.5 h-2.5 rounded-full border border-black/10" style={{ backgroundColor: c }} />
              ))}
            </div>
          </button>

          {/* Online / Offline Simulator Switch */}
          <button
            onClick={toggleNetworkMode}
            title="انقر للتبديل بين وضع الاتصال بالسيرفر والوضع غير المتصل (Offline Mode)"
            className={`flex items-center gap-2 px-3 py-2 rounded-2xl text-xs font-black transition-all border-2 shadow-sm ${
              isOnline
                ? 'bg-emerald-50 text-emerald-800 border-emerald-300 hover:bg-emerald-100 dark:bg-emerald-950/60 dark:text-emerald-300 dark:border-emerald-500/40'
                : 'bg-amber-100 text-amber-900 border-amber-400 hover:bg-amber-200 ring-2 ring-amber-400/40 animate-pulse dark:bg-amber-950/80 dark:text-amber-300'
            }`}
          >
            {isOnline ? (
              <>
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
                <Wifi className="w-4 h-4 text-emerald-600" />
                <span>متصل 🟢</span>
              </>
            ) : (
              <>
                <WifiOff className="w-4 h-4 text-amber-600" />
                <span>أوفلاين 🟠</span>
                {offlineSyncQueue.length > 0 && (
                  <span className="px-1.5 py-0.2 rounded-full bg-amber-500 text-slate-950 font-black text-[10px]">
                    {offlineSyncQueue.length}
                  </span>
                )}
              </>
            )}
          </button>

          {/* Demo Reset Button */}
          <button
            onClick={resetToInitialDemoState}
            title="إعادة ضبط بيانات النظام للتجربة الافتراضية"
            className="p-2 text-slate-600 dark:text-slate-400 hover:text-slate-950 bg-white dark:bg-slate-800 hover:bg-slate-100 rounded-2xl border-2 border-slate-200 dark:border-slate-700 transition-colors shadow-xs"
          >
            <RefreshCw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Role Navigation Bar (Section 0, 1, 26, 27) */}
      <div className="bg-amber-50/70 dark:bg-slate-950/80 border-t border-amber-100 dark:border-slate-800/80 px-2 sm:px-6 py-2 overflow-x-auto scrollbar-none">
        <div className="max-w-7xl mx-auto flex items-center justify-start sm:justify-center gap-2 min-w-max">
          <span className="text-xs font-black text-slate-700 dark:text-slate-400 px-2 flex items-center gap-1">
            <Sparkles className="w-3.5 h-3.5 text-amber-500" />
            واجهات النظام:
          </span>
          {roleConfigs.map(item => {
            const isActive = currentRole === item.role;
            return (
              <button
                key={item.role}
                onClick={() => setCurrentRole(item.role)}
                className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-2xl text-xs font-black transition-all ${
                  isActive
                    ? 'bg-amber-400 text-slate-950 shadow-md border-2 border-amber-500 ring-2 ring-amber-300/60 scale-102'
                    : 'text-slate-700 dark:text-slate-300 hover:text-slate-950 hover:bg-white/80 dark:hover:bg-slate-900 border-2 border-transparent'
                }`}
              >
                <span className={isActive ? 'text-slate-950' : 'text-slate-500'}>{item.icon}</span>
                <span>{item.titleAr}</span>
                {item.role === 'security' && activeAlerts.length > 0 && (
                  <span className="w-2.5 h-2.5 rounded-full bg-rose-500 animate-ping" />
                )}
              </button>
            );
          })}
        </div>
      </div>
    </header>
  );
};
