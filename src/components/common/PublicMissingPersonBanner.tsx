import React, { useState } from 'react';
import { usePark } from '../../context/ParkContext';
import { 
  ShieldAlert, 
  MapPin, 
  Clock, 
  Phone, 
  UserCheck, 
  X, 
  Eye, 
  ChevronDown, 
  ChevronUp,
  AlertOctagon,
  Sparkles
} from 'lucide-react';

export const PublicMissingPersonBanner: React.FC = () => {
  const { 
    activePublicMissingAlert, 
    isPublicMissingBannerDismissed, 
    dismissPublicMissingBanner,
    setCurrentRole,
    currentRole
  } = usePark();

  const [isExpanded, setIsExpanded] = useState<boolean>(false);

  if (!activePublicMissingAlert || isPublicMissingBannerDismissed) {
    return null;
  }

  const alert = activePublicMissingAlert;

  return (
    <div className="sticky top-0 z-40 bg-gradient-to-r from-rose-700 via-rose-600 to-red-700 text-white shadow-2xl border-b-2 border-rose-300 animate-slideDown">
      <div className="max-w-7xl mx-auto px-4 py-2.5 sm:py-3">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          {/* Main Emergency Message & Child Avatar */}
          <div className="flex items-center gap-3 flex-1">
            <div className="w-10 h-10 rounded-2xl bg-white/20 border-2 border-white/40 flex items-center justify-center text-2xl shrink-0 shadow-inner animate-pulse">
              👦
            </div>

            <div className="space-y-0.5">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-[11px] px-2 py-0.5 rounded-full bg-white text-rose-800 font-black flex items-center gap-1 shadow-xs">
                  <ShieldAlert className="w-3.5 h-3.5 text-rose-600 animate-bounce" />
                  <span>نداء استنفار عاجل: طفل مفقود 🚨</span>
                </span>
                <span className="text-xs font-mono font-bold text-rose-100">
                  {alert.id}
                </span>
              </div>

              <div className="text-sm font-black text-white flex items-center gap-2 flex-wrap">
                <span>الاسم: <strong className="underline underline-offset-2">{alert.childName}</strong> ({alert.age} سنوات)</span>
                <span className="text-rose-200 text-xs font-normal hidden md:inline">|</span>
                <span className="text-xs text-rose-100 flex items-center gap-1 font-medium">
                  <MapPin className="w-3.5 h-3.5" />
                  <span>آخر نشاط مسجل: <strong>{alert.lastRecordedActivity.locationName}</strong> ({alert.lastRecordedActivity.time})</span>
                </span>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-2 self-end sm:self-center shrink-0">
            <button
              onClick={() => setIsExpanded(!isExpanded)}
              className="px-3 py-1.5 rounded-xl bg-white/20 hover:bg-white/30 text-white text-xs font-bold transition-all flex items-center gap-1 border border-white/30"
            >
              <Eye className="w-3.5 h-3.5" />
              <span>{isExpanded ? 'طي التفاصيل' : 'صورة وأوصاف المفقود'}</span>
              {isExpanded ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
            </button>

            {currentRole !== 'security' && (
              <button
                onClick={() => setCurrentRole('security')}
                className="px-3 py-1.5 rounded-xl bg-white text-rose-800 hover:bg-rose-50 text-xs font-black transition-all shadow-md flex items-center gap-1"
                title="الانتقال إلى لوحة الأمن للمساعدة"
              >
                <span>غرفة الأمن 👮</span>
              </button>
            )}

            <button
              onClick={dismissPublicMissingBanner}
              className="p-1.5 rounded-lg bg-black/20 hover:bg-black/30 text-white/80 hover:text-white transition-all"
              title="إخفاء الإشعار مؤقتاً"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Expanded Detailed View (Child Card, Clothing Description, Parent Details) */}
        {isExpanded && (
          <div className="mt-3 pt-3 border-t border-white/20 grid grid-cols-1 md:grid-cols-3 gap-3 text-xs bg-rose-950/40 p-3.5 rounded-2xl border border-white/10 animate-fadeIn">
            {/* Clothing Description */}
            <div className="space-y-1">
              <span className="font-bold text-rose-200 flex items-center gap-1">
                👕 أوصاف الملابس والمظهر:
              </span>
              <p className="text-white bg-black/20 p-2 rounded-xl border border-white/10 font-medium">
                {alert.clothingDescription}
              </p>
            </div>

            {/* Location & Time History */}
            <div className="space-y-1">
              <span className="font-bold text-rose-200 flex items-center gap-1">
                📍 سجل المسار وآخر نشاط:
              </span>
              <div className="text-white bg-black/20 p-2 rounded-xl border border-white/10 space-y-0.5">
                <div>آخر لعبة/موقع: <strong className="text-amber-300">{alert.lastRecordedActivity.locationName}</strong></div>
                <div className="text-rose-200 text-[11px] font-mono">توقيت التسجيل: {alert.lastRecordedActivity.time}</div>
                {alert.previousActivity && (
                  <div className="text-[10px] text-rose-300 pt-0.5">
                    النشاط السابق: {alert.previousActivity.locationName} ({alert.previousActivity.time})
                  </div>
                )}
              </div>
            </div>

            {/* Parent Contact & Security Hotline */}
            <div className="space-y-1">
              <span className="font-bold text-rose-200 flex items-center gap-1">
                📞 التواصل مع ولي الأمر وغرفة الأمن:
              </span>
              <div className="text-white bg-black/20 p-2 rounded-xl border border-white/10 space-y-1">
                <div className="flex items-center justify-between">
                  <span>ولي الأمر: <strong>{alert.familyHeadName}</strong></span>
                  <a
                    href={`tel:${alert.familyHeadPhone}`}
                    className="px-2 py-0.5 rounded bg-emerald-600 hover:bg-emerald-500 text-white font-mono font-bold flex items-center gap-1 text-[11px]"
                  >
                    <Phone className="w-3 h-3" />
                    <span>{alert.familyHeadPhone}</span>
                  </a>
                </div>
                <div className="text-[11px] text-rose-200 font-medium pt-0.5">
                  🛡️ إذا شاهدت هذا الطفل يرجى تسليمه لأقرب موظف يحمل شارة الحصن فوراً.
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
