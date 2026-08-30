import React from 'react';
import { SmartNotification, WeatherStatus } from '../../types';
import { 
  Bell, 
  X, 
  Sparkles, 
  CloudSun, 
  Wind, 
  Flame, 
  CheckCircle, 
  ExternalLink,
  ChevronRight,
  TrendingDown,
  Sun,
  CloudRain
} from 'lucide-react';
import { 
  RollerCoasterIcon, 
  BumperCarsIcon, 
  FerrisWheelIcon, 
  WaterSplashIcon,
  DropTowerIcon,
  WeatherSunIcon,
  WeatherRainIcon,
  WeatherWindIcon
} from './ParkIcons';
import { motion, AnimatePresence } from 'framer-motion';

interface ToastProps {
  notifications: SmartNotification[];
  onDismiss: (id: string) => void;
  onOpenRide?: (attractionId?: string) => void;
}

export const SmartNotificationsToast: React.FC<ToastProps> = ({
  notifications,
  onDismiss,
  onOpenRide
}) => {
  // Show up to 3 active toasts
  const activeToasts = notifications.slice(0, 3);

  const getNotificationIcon = (notif: SmartNotification) => {
    switch (notif.type) {
      case 'RIDE_VACANCY':
        if (notif.targetAttractionId === 'attr-roller-coaster') return <RollerCoasterIcon className="w-6 h-6" />;
        if (notif.targetAttractionId === 'attr-bumper-cars') return <BumperCarsIcon className="w-6 h-6" />;
        if (notif.targetAttractionId === 'attr-water-splash') return <WaterSplashIcon className="w-6 h-6" />;
        return <RollerCoasterIcon className="w-6 h-6" />;
      case 'WEATHER_ALERT':
        if (notif.iconType === 'weather') return <WeatherSunIcon className="w-6 h-6" />;
        return <WeatherWindIcon className="w-6 h-6" />;
      case 'ACHIEVEMENT_UNLOCKED':
        return <Sparkles className="w-6 h-6 text-amber-400" />;
      case 'SAFETY_UPDATE':
        return <span className="text-xl">🛡️</span>;
      default:
        return <Bell className="w-6 h-6 text-emerald-400" />;
    }
  };

  const getBadgeStyle = (type: SmartNotification['type']) => {
    switch (type) {
      case 'RIDE_VACANCY':
        return 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40';
      case 'WEATHER_ALERT':
        return 'bg-amber-500/20 text-amber-300 border-amber-500/40';
      case 'ACHIEVEMENT_UNLOCKED':
        return 'bg-purple-500/20 text-purple-300 border-purple-500/40';
      case 'SAFETY_UPDATE':
        return 'bg-blue-500/20 text-blue-300 border-blue-500/40';
      default:
        return 'bg-slate-700 text-slate-300 border-slate-600';
    }
  };

  return (
    <div 
      className="fixed bottom-6 left-6 z-40 flex flex-col gap-3 max-w-sm w-full pointer-events-none"
      dir="rtl"
    >
      <AnimatePresence>
        {activeToasts.map((toast) => (
          <motion.div
            key={toast.id}
            initial={{ opacity: 0, x: -60, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, x: 0, scale: 1, y: 0 }}
            exit={{ opacity: 0, x: -40, scale: 0.85, transition: { duration: 0.2 } }}
            transition={{ type: "spring", stiffness: 350, damping: 25 }}
            className="pointer-events-auto bg-slate-900/95 border-2 border-slate-700 rounded-3xl p-4 shadow-2xl backdrop-blur-md text-white relative overflow-hidden"
          >
            {/* Top glowing bar */}
            <div className={`absolute top-0 left-0 right-0 h-1.5 ${
              toast.type === 'RIDE_VACANCY' ? 'bg-gradient-to-r from-emerald-400 to-teal-400' :
              toast.type === 'WEATHER_ALERT' ? 'bg-gradient-to-r from-amber-400 to-orange-400' :
              toast.type === 'ACHIEVEMENT_UNLOCKED' ? 'bg-gradient-to-r from-purple-400 to-rose-400' :
              'bg-gradient-to-r from-blue-400 to-indigo-400'
            }`} />

            <div className="flex items-start gap-3 mt-1">
              {/* Icon Container */}
              <div className="p-2.5 rounded-2xl bg-slate-800 border border-slate-700 shrink-0 flex items-center justify-center">
                {getNotificationIcon(toast)}
              </div>

              {/* Text info */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between gap-1 mb-1">
                  <span className={`text-[10px] font-black uppercase px-2 py-0.5 rounded-full border ${getBadgeStyle(toast.type)}`}>
                    {toast.type === 'RIDE_VACANCY' && '⚡ شاغر فوري للألعاب'}
                    {toast.type === 'WEATHER_ALERT' && '☀️ تحديث الطقس'}
                    {toast.type === 'ACHIEVEMENT_UNLOCKED' && '🏆 وسام جديد'}
                    {toast.type === 'SAFETY_UPDATE' && '🛡️ سلامة عائلية'}
                    {toast.type === 'SYSTEM_BROADCAST' && '📢 تعميم الحصن'}
                  </span>
                  <span className="text-[10px] font-mono text-slate-400">{toast.timestamp}</span>
                </div>

                <h4 className="text-sm font-black text-white leading-tight">{toast.titleAr}</h4>
                <p className="text-xs text-slate-300 mt-1 leading-relaxed">{toast.messageAr}</p>

                {/* Optional Fast Action */}
                {toast.targetAttractionId && (
                  <button
                    onClick={() => {
                      if (onOpenRide) onOpenRide(toast.targetAttractionId);
                      onDismiss(toast.id);
                    }}
                    className="mt-2.5 px-3 py-1 bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 border border-emerald-500/40 rounded-xl text-[11px] font-bold flex items-center gap-1 transition-all"
                  >
                    <span>الانتقال للعبة ومسح التذكرة</span>
                    <ChevronRight className="w-3 h-3 rotate-180" />
                  </button>
                )}
              </div>

              {/* Dismiss Button */}
              <button
                onClick={() => onDismiss(toast.id)}
                className="p-1 rounded-full text-slate-400 hover:text-white hover:bg-slate-800 transition-all shrink-0"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
};

// Weather Status Card & Simulation Trigger
interface WeatherWidgetProps {
  weather: WeatherStatus;
  onSimulateWeatherChange: (condition: WeatherStatus['condition']) => void;
}

export const WeatherWidget: React.FC<WeatherWidgetProps> = ({
  weather,
  onSimulateWeatherChange
}) => {
  return (
    <div className="p-4 bg-gradient-to-br from-slate-900 to-slate-800 rounded-3xl border-2 border-slate-700 text-white shadow-xl">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-2xl bg-amber-500/20 border border-amber-500/40 text-amber-400">
            {weather.condition === 'sunny' || weather.condition === 'perfect' ? (
              <WeatherSunIcon className="w-6 h-6" />
            ) : weather.condition === 'rainy' ? (
              <WeatherRainIcon className="w-6 h-6" />
            ) : (
              <WeatherWindIcon className="w-6 h-6" />
            )}
          </div>
          <div>
            <div className="text-xs font-bold text-slate-400">مؤشر طقس الحديقة المباشر</div>
            <div className="text-sm font-black text-white">{weather.titleAr}</div>
          </div>
        </div>

        <div className="text-left font-mono">
          <div className="text-lg font-black text-amber-400">{weather.temperatureC}°C</div>
          <div className="text-[10px] text-slate-400 flex items-center gap-1">
            <Wind className="w-3 h-3 text-sky-400" />
            {weather.windSpeedKmH} كم/س
          </div>
        </div>
      </div>

      <div className="p-2.5 rounded-2xl bg-slate-950/60 border border-slate-800 text-xs text-slate-300 flex items-center justify-between">
        <span>{weather.descriptionAr}</span>
        <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
          weather.outdoorRidesStatus === 'ALL_OPEN' 
            ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40' 
            : 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
        }`}>
          {weather.outdoorRidesStatus === 'ALL_OPEN' ? '🟢 جميع الألعاب مفتوحة' : '🟡 فحص أمان دوري'}
        </span>
      </div>

      {/* Simulator buttons */}
      <div className="mt-3 pt-2.5 border-t border-slate-800 flex items-center justify-between gap-1 text-[11px]">
        <span className="text-slate-400 font-bold">محاكاة الطقس:</span>
        <div className="flex gap-1">
          <button
            onClick={() => onSimulateWeatherChange('perfect')}
            className={`px-2 py-1 rounded-xl font-bold transition-all ${
              weather.condition === 'perfect' ? 'bg-amber-500 text-slate-950' : 'bg-slate-800 hover:bg-slate-700 text-amber-300'
            }`}
          >
            ☀️ مشمس
          </button>
          <button
            onClick={() => onSimulateWeatherChange('windy')}
            className={`px-2 py-1 rounded-xl font-bold transition-all ${
              weather.condition === 'windy' ? 'bg-sky-500 text-slate-950' : 'bg-slate-800 hover:bg-slate-700 text-sky-300'
            }`}
          >
            💨 رياح
          </button>
          <button
            onClick={() => onSimulateWeatherChange('rainy')}
            className={`px-2 py-1 rounded-xl font-bold transition-all ${
              weather.condition === 'rainy' ? 'bg-blue-600 text-white' : 'bg-slate-800 hover:bg-slate-700 text-blue-300'
            }`}
          >
            🌧️ رذاذ
          </button>
        </div>
      </div>
    </div>
  );
};
