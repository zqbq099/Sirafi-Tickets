import React, { useState } from 'react';
import { usePark } from '../../context/ParkContext';
import { 
  Megaphone, 
  X, 
  ShieldAlert, 
  AlertTriangle, 
  Info, 
  Send, 
  Sparkles,
  CheckCircle,
  Radio
} from 'lucide-react';

interface EmergencyBroadcastModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultAttractionId?: string;
}

export const EmergencyBroadcastModal: React.FC<EmergencyBroadcastModalProps> = ({
  isOpen,
  onClose,
  defaultAttractionId
}) => {
  const { attractions, broadcastSecurityUrgentAlert } = usePark();

  const [targetScope, setTargetScope] = useState<string>(defaultAttractionId || 'ALL_PARK');
  const [urgency, setUrgency] = useState<'high' | 'medium' | 'low'>('high');
  const [titleAr, setTitleAr] = useState<string>('تنبيه أمني عاجل من إدارة الحديقة 🚨');
  const [messageAr, setMessageAr] = useState<string>(
    'نرجو من جميع الزوار اتباع إرشادات مراقبي السلامة والمحافظة على الهدوء.'
  );
  const [isSentSuccess, setIsSentSuccess] = useState<boolean>(false);

  if (!isOpen) return null;

  const quickTemplates = [
    {
      title: '🚨 تنبيه ضغط وازدحام مرتفع',
      msg: 'تشهد هذه اللعبة إقبالاً كثيفاً، نرجو التوجه مؤقتاً إلى الألعاب المجاورة بالمنطقة B لتقليل وقت الانتظار.',
      urgency: 'high' as const,
      iconType: 'shield'
    },
    {
      title: '⚙️ فحص أمان دوري وقصير',
      msg: 'يجري الفريق الهندسي فحص أمان اعتيادي لمدة 10 دقائق، وسنعاود استقبالكم فوراً.',
      urgency: 'medium' as const,
      iconType: 'shield'
    },
    {
      title: '🌧️ تحذير رياح ورذاذ خفيف',
      msg: 'يرجى توخي الحذر عند مسارات الألعاب المفتوحة والالتزام بإرشادات طاقم التشغيل.',
      urgency: 'medium' as const,
      iconType: 'weather'
    },
    {
      title: '📢 نداء عاجل لولي أمر',
      msg: 'يُرجى من ولي أمر الطفل التوجه إلى أقرب نقطة أمنية عند البوابة الرئيسية.',
      urgency: 'high' as const,
      iconType: 'shield'
    },
    {
      title: '🎉 بدء العرض الكرنفالي الرئيسي',
      msg: 'ينطلق الآن العرض الكرنفالي عند ساحة الحصن الكبرى، نتمنى لكم وقتاً ساحراً!',
      urgency: 'low' as const,
      iconType: 'star'
    }
  ];

  const handleApplyTemplate = (tmpl: typeof quickTemplates[0]) => {
    setTitleAr(tmpl.title);
    setMessageAr(tmpl.msg);
    setUrgency(tmpl.urgency);
  };

  const handleSendBroadcast = (e: React.FormEvent) => {
    e.preventDefault();
    if (!titleAr.trim() || !messageAr.trim()) return;

    const targetAttr = targetScope !== 'ALL_PARK' ? targetScope : undefined;
    broadcastSecurityUrgentAlert({
      titleAr: titleAr.trim(),
      messageAr: messageAr.trim(),
      targetAttractionId: targetAttr,
      urgency,
      iconType: urgency === 'high' ? 'shield' : 'coaster'
    });

    setIsSentSuccess(true);
    setTimeout(() => {
      setIsSentSuccess(false);
      onClose();
    }, 1200);
  };

  const selectedAttraction = attractions.find(a => a.id === targetScope);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fadeIn">
      <div className="bg-slate-900 border-2 border-rose-600/70 rounded-3xl max-w-xl w-full p-6 shadow-2xl relative text-slate-100 overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-800">
          <div className="flex items-center gap-2.5">
            <div className="p-2.5 bg-rose-600/20 border border-rose-500/40 rounded-2xl text-rose-400">
              <Megaphone className="w-6 h-6 animate-pulse" />
            </div>
            <div>
              <h3 className="text-lg font-black text-white">مرسل التنبيهات والتحذيرات العاجلة 📢</h3>
              <p className="text-xs text-slate-400">إرسال إشعارات فورية تظهر على شاشات الزوار والموظفين</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition-all"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {isSentSuccess ? (
          <div className="py-12 text-center space-y-3 animate-scaleUp">
            <div className="w-16 h-16 rounded-full bg-emerald-500/20 border-2 border-emerald-400 text-emerald-400 flex items-center justify-center mx-auto">
              <CheckCircle className="w-10 h-10" />
            </div>
            <h4 className="text-xl font-black text-white">تم إرسال التعميم الأمني بنجاح! 🚀</h4>
            <p className="text-xs text-emerald-400">تم بث الإشعار وتسجيله في سجل التدقيق الأمني للحديقة.</p>
          </div>
        ) : (
          <form onSubmit={handleSendBroadcast} className="space-y-4 mt-4">
            {/* Target Scope Selection */}
            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1.5">
                نطاق وتوجيه التنبيه (Target Scope):
              </label>
              <select
                value={targetScope}
                onChange={(e) => setTargetScope(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-sm font-bold text-white focus:outline-hidden focus:border-rose-500"
              >
                <option value="ALL_PARK">🌐 تعميم عام لكافة زوار وموظفي الحديقة (General Broadcast)</option>
                {attractions.map(attr => (
                  <option key={attr.id} value={attr.id}>
                    🎡 خاص برواد لعبة: {attr.nameAr} ({attr.zone})
                  </option>
                ))}
              </select>
            </div>

            {/* Urgency Level Selector */}
            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1.5">
                درجة الخطورة والاستعجال:
              </label>
              <div className="grid grid-cols-3 gap-2">
                <button
                  type="button"
                  onClick={() => setUrgency('high')}
                  className={`py-2 px-3 rounded-xl text-xs font-black flex items-center justify-center gap-1.5 border transition-all ${
                    urgency === 'high'
                      ? 'bg-rose-600 text-white border-rose-400 shadow-md shadow-rose-950/60'
                      : 'bg-slate-950 text-slate-400 border-slate-800 hover:bg-slate-800'
                  }`}
                >
                  <ShieldAlert className="w-4 h-4 text-rose-300" />
                  <span>عاجل وطارئ 🚨</span>
                </button>
                <button
                  type="button"
                  onClick={() => setUrgency('medium')}
                  className={`py-2 px-3 rounded-xl text-xs font-black flex items-center justify-center gap-1.5 border transition-all ${
                    urgency === 'medium'
                      ? 'bg-amber-600 text-white border-amber-400 shadow-md shadow-amber-950/60'
                      : 'bg-slate-950 text-slate-400 border-slate-800 hover:bg-slate-800'
                  }`}
                >
                  <AlertTriangle className="w-4 h-4 text-amber-300" />
                  <span>تحذير سلامة ⚠️</span>
                </button>
                <button
                  type="button"
                  onClick={() => setUrgency('low')}
                  className={`py-2 px-3 rounded-xl text-xs font-black flex items-center justify-center gap-1.5 border transition-all ${
                    urgency === 'low'
                      ? 'bg-blue-600 text-white border-blue-400 shadow-md'
                      : 'bg-slate-950 text-slate-400 border-slate-800 hover:bg-slate-800'
                  }`}
                >
                  <Info className="w-4 h-4 text-blue-300" />
                  <span>إرشاد عام ℹ️</span>
                </button>
              </div>
            </div>

            {/* Fast Preset Templates */}
            <div>
              <label className="block text-[11px] font-bold text-slate-400 mb-1.5">
                قوالب وتنبيهات أمنية سريعة بنقرة واحدة:
              </label>
              <div className="flex flex-wrap gap-1.5">
                {quickTemplates.map((tmpl, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => handleApplyTemplate(tmpl)}
                    className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white text-[11px] font-medium transition-all border border-slate-700/60"
                  >
                    {tmpl.title}
                  </button>
                ))}
              </div>
            </div>

            {/* Custom Title Input */}
            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1">
                عنوان التحذير / الإشعار:
              </label>
              <input
                type="text"
                value={titleAr}
                onChange={(e) => setTitleAr(e.target.value)}
                required
                className="w-full px-3.5 py-2 rounded-xl bg-slate-950 border border-slate-700 text-sm font-bold text-white focus:outline-hidden focus:border-rose-500"
                placeholder="أدخل عنوان التنبيه المباشر..."
              />
            </div>

            {/* Custom Message Input */}
            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1">
                نص الرسالة والإرشادات الموجهة للزوار:
              </label>
              <textarea
                value={messageAr}
                onChange={(e) => setMessageAr(e.target.value)}
                required
                rows={3}
                className="w-full px-3.5 py-2 rounded-xl bg-slate-950 border border-slate-700 text-sm text-slate-200 focus:outline-hidden focus:border-rose-500 leading-relaxed"
                placeholder="اكتب التوجيه الأمني هنا بدقة ووضوح..."
              />
            </div>

            {/* Target preview badge */}
            <div className="p-3 bg-slate-950/80 rounded-xl border border-slate-800 text-xs flex items-center justify-between text-slate-400">
              <span className="flex items-center gap-1.5">
                <Radio className="w-4 h-4 text-rose-400 animate-pulse" />
                <span>الوجهة: <strong className="text-white">{selectedAttraction ? selectedAttraction.nameAr : 'كافة زوار وموظفي الحديقة'}</strong></span>
              </span>
              <span className="font-mono text-emerald-400 font-bold">بث فوري عبر السحابة ⚡</span>
            </div>

            {/* Submit Buttons */}
            <div className="pt-3 border-t border-slate-800 flex items-center justify-end gap-3">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-bold transition-all"
              >
                إلغاء
              </button>
              <button
                type="submit"
                className="btn-game-rose px-6 py-2.5 text-xs font-black flex items-center gap-2 shadow-lg shadow-rose-950/50"
              >
                <Send className="w-4 h-4" />
                <span>بث التنبيه فوراً لجميع الشاشات 📢</span>
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
