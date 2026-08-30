import React, { useState } from 'react';
import { usePark } from '../../../context/ParkContext';
import { 
  Users, 
  ShieldAlert, 
  Clock, 
  History, 
  CheckCircle2, 
  MapPin, 
  QrCode, 
  Share2, 
  Sparkles, 
  Compass, 
  ArrowRight,
  ShieldCheck,
  AlertTriangle
} from 'lucide-react';
import { encodeQRPayload, generateNonce, sound } from '../../../utils/crypto';

export const Stage3FamilySquad: React.FC = () => {
  const { 
    visitor, 
    tickets, 
    reportMissingChild, 
    showQRModal, 
    assignTicketToMember,
    openCastleMap,
    nextVisitorGameStage 
  } = usePark();

  const [showSOSModal, setShowSOSModal] = useState<boolean>(false);
  const [selectedChildForSOS, setSelectedChildForSOS] = useState<string>('');
  const [clothingNotes, setClothingNotes] = useState<string>('');
  const [sosSentSuccess, setSosSentSuccess] = useState<boolean>(false);

  const handleSubmitSOS = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedChildForSOS) return;
    sound.playLevelUp();
    reportMissingChild(selectedChildForSOS, clothingNotes, 'بلاغ صادر عبر تطبيق ولي الأمر');
    setShowSOSModal(false);
    setSosSentSuccess(true);
    setTimeout(() => setSosSentSuccess(false), 5000);
    setSelectedChildForSOS('');
    setClothingNotes('');
  };

  // Generate Usage QR for Family Member
  const handleShowUsageQR = (ticketId?: string, memberId?: string) => {
    sound.playPop();
    const payload = encodeQRPayload({
      qrType: 'USAGE_QR',
      visitorId: visitor.id,
      ticketId,
      familyMemberId: memberId,
      timestamp: Date.now(),
      nonce: generateNonce()
    });

    const member = visitor.familyMembers.find(m => m.id === memberId);
    showQRModal({
      title: `رمز تشغيل اللعبة لـ (${member?.name || visitor.name}) 🎡`,
      subtitle: ticketId ? `التذكرة: ${ticketId}` : `خصم مباشر من رصيد وحدات العائلة`,
      qrData: payload,
      qrType: 'USAGE_QR'
    });
  };

  return (
    <div className="space-y-6">
      {/* SOS Sent Confirmation Toast */}
      {sosSentSuccess && (
        <div className="p-4 rounded-3xl bg-rose-500 border-3 border-rose-600 text-white font-black flex items-center justify-between shadow-xl animate-bounce-subtle">
          <div className="flex items-center gap-3">
            <ShieldAlert className="w-7 h-7" />
            <div>
              <div className="text-sm">🚨 تم إرسال بلاغ الاستنفار بنجاح إلى غرفة الأمن الميدانية!</div>
              <div className="text-xs font-medium text-rose-100">تم تزويدهم بآخر نشاط مسجل ومواصفات الملابس فورياً</div>
            </div>
          </div>
        </div>
      )}

      {/* Family Safety Hero Banner */}
      <div className="bg-gradient-to-br from-rose-400 via-pink-400 to-rose-500 rounded-3xl p-6 sm:p-8 border-4 border-rose-300 shadow-2xl text-white relative overflow-hidden">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6 relative z-10">
          <div className="space-y-2 text-center md:text-right">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/90 text-rose-950 font-black text-xs shadow-sm">
              <Users className="w-4 h-4 text-rose-600" />
              <span>نظام السلامة العائلية الذكي (Section 20 - Privacy First) 🛡️</span>
            </div>

            <h3 className="text-2xl sm:text-3xl font-black">
              فرقة العائلة ورادار الأنشطة ({visitor.familyMembers.length} أفراد) 👨‍👩‍👧‍👦
            </h3>

            <p className="text-xs sm:text-sm font-medium text-rose-100 max-w-xl">
              النظام يسجل آخر نشاط تم مسحه عند الألعاب دون تتبع GPS مباشر احتراماً للخصوصية، مع إمكانية إشعار الأمن فوراً عند فقدان أي فرد.
            </p>
          </div>

          {/* Big SOS Emergency Button (Section 22) */}
          <button
            id="open-sos-modal-stage-btn"
            onClick={() => setShowSOSModal(true)}
            className="btn-game-rose py-4 px-6 text-sm font-black flex items-center justify-center gap-2.5 shadow-2xl animate-bounce-subtle shrink-0"
          >
            <ShieldAlert className="w-6 h-6 stroke-[2.5]" />
            <span>🚨 الإبلاغ عن فقدان فرد من الأسرة</span>
          </button>
        </div>
      </div>

      {/* Family Member Cartoon Cards Grid */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-2xl bg-rose-400 text-slate-950 font-black">
              <Users className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-lg font-black text-slate-900 dark:text-white">أفراد الأسرة والتذاكر المخصصة 👨‍👩‍👧‍👦</h4>
              <p className="text-xs text-slate-600 dark:text-slate-400 font-medium">لكل فرد تذكرة مستقلة وسجل نشاط آمن</p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {(visitor?.familyMembers || []).map((member) => {
            const memberTicket = (tickets || []).find(t => t.id === member.assignedTicketId);

            return (
              <div
                key={member.id}
                className="bg-white dark:bg-slate-800 rounded-3xl p-5 border-3 border-rose-200 dark:border-slate-700 shadow-lg flex flex-col justify-between hover:border-rose-400 transition-all"
              >
                <div>
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <span className="text-4xl p-2 rounded-2xl bg-rose-50 dark:bg-slate-900 border-2 border-rose-200 dark:border-slate-700 shadow-sm">
                        {member.avatar}
                      </span>
                      <div>
                        <h5 className="font-black text-base text-slate-900 dark:text-white">{member.name}</h5>
                        <span className="text-xs font-bold text-slate-500">
                          {member.age ? `العمر: ${member.age} سنوات` : 'رب الأسرة'}
                        </span>
                      </div>
                    </div>

                    <span className="text-[11px] font-mono px-2.5 py-1 rounded-full bg-rose-100 dark:bg-rose-950 text-rose-800 dark:text-rose-300 font-black border border-rose-300">
                      {member.assignedTicketId || 'بدون تذكرة'}
                    </span>
                  </div>

                  {/* Last Recorded Activity Radar Box */}
                  <div 
                    onClick={() => openCastleMap(member.lastActivity?.locationId)}
                    className="cursor-pointer bg-rose-50/70 dark:bg-slate-900/60 rounded-2xl p-3 border border-rose-200 dark:border-slate-700 text-xs space-y-1 mb-4 hover:bg-rose-100/70 transition-colors"
                    title="انقر لعرض موقع المحطة على خريطة الحصن التفاعلية"
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-black text-rose-700 dark:text-rose-400 flex items-center gap-1">
                        <Clock className="w-3.5 h-3.5" />
                        آخر نشاط مسجل:
                      </span>
                      <span className="font-mono font-black text-slate-900 dark:text-white bg-white dark:bg-slate-800 px-2 py-0.5 rounded-full border border-rose-200">
                        {member.lastActivity?.timestamp || '20:00'}
                      </span>
                    </div>
                    <div className="text-slate-900 dark:text-white font-black text-xs flex items-center gap-1 pt-0.5">
                      <MapPin className="w-3.5 h-3.5 text-rose-500" />
                      <span>{member.lastActivity?.locationName || 'بوابة الدخول الرئيسية'}</span>
                    </div>
                  </div>
                </div>

                {/* Actions */}
                <div className="pt-3 border-t border-rose-100 dark:border-slate-700 flex items-center gap-2">
                  <button
                    onClick={() => handleShowUsageQR(member.assignedTicketId, member.id)}
                    className="btn-game-rose flex-1 py-2 text-xs font-black flex items-center justify-center gap-1"
                  >
                    <QrCode className="w-3.5 h-3.5" />
                    <span>رمز اللعبة 🎡</span>
                  </button>

                  <button
                    onClick={() => openCastleMap(member.lastActivity?.locationId)}
                    className="btn-game-white p-2 text-xs font-bold"
                    title="عرض على خريطة الحصن"
                  >
                    <Compass className="w-3.5 h-3.5 text-rose-600" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Ahmed's Timeline Proof (Section 21 & Section 35 Safety Test Scenario) */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 border-3 border-rose-300 dark:border-slate-800 shadow-xl">
        <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b-2 border-rose-100 dark:border-slate-800 mb-4">
          <div className="flex items-center gap-2">
            <History className="w-5 h-5 text-rose-500" />
            <h4 className="text-base font-black text-slate-900 dark:text-white">
              سجل تسلسل أنشطة الطفل أحمد (Family Safety Timeline):
            </h4>
          </div>
          <span className="text-xs px-3 py-1 bg-rose-100 text-rose-800 font-black rounded-full border border-rose-300">
            اختبار الأمان الواقعي (Section 35) ✓
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800 border-2 border-slate-200 dark:border-slate-700 flex items-center justify-between">
            <div>
              <div className="text-xs font-bold text-slate-500">20:12</div>
              <div className="text-sm font-black text-slate-900 dark:text-white">1. عالم الصغار (#4)</div>
            </div>
            <CheckCircle2 className="w-5 h-5 text-emerald-500" />
          </div>

          <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800 border-2 border-slate-200 dark:border-slate-700 flex items-center justify-between">
            <div>
              <div className="text-xs font-bold text-slate-500">20:41</div>
              <div className="text-sm font-black text-slate-900 dark:text-white">2. سيارات التصادم (#3)</div>
            </div>
            <CheckCircle2 className="w-5 h-5 text-emerald-500" />
          </div>

          <div className="p-3.5 rounded-2xl bg-rose-50 dark:bg-rose-950/60 border-2 border-rose-400 flex items-center justify-between">
            <div>
              <div className="text-xs font-black text-rose-600">21:03 (آخر نشاط مسجل)</div>
              <div className="text-sm font-black text-slate-900 dark:text-white">3. عجلة بانوراما (#2)</div>
            </div>
            <span className="w-3 h-3 rounded-full bg-rose-500 animate-ping" />
          </div>
        </div>
      </div>

      {/* Emergency Missing Person Report Modal (Section 22 & 23) */}
      {showSOSModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fadeIn">
          <div className="bg-white dark:bg-slate-900 border-4 border-rose-500 rounded-3xl p-6 sm:p-8 shadow-2xl text-slate-900 dark:text-white max-w-lg w-full">
            <div className="flex items-center gap-3 text-rose-600 mb-3">
              <div className="p-3 bg-rose-100 rounded-2xl">
                <ShieldAlert className="w-8 h-8 animate-bounce-subtle" />
              </div>
              <div>
                <h3 className="text-xl font-black">إرسال استنفار فقدان فرد إلى الأمن 🚨</h3>
                <p className="text-xs text-slate-600 dark:text-slate-400 font-medium">ربط فوري بآخر موقع ولعبة مسجلة للطفل</p>
              </div>
            </div>

            <form onSubmit={handleSubmitSOS} className="space-y-4">
              <div>
                <label className="block text-xs font-black text-slate-800 dark:text-slate-200 mb-1.5">
                  اختر الفرد المفقود:
                </label>
                <select
                  value={selectedChildForSOS}
                  onChange={(e) => {
                    setSelectedChildForSOS(e.target.value);
                    const mem = visitor.familyMembers.find(m => m.id === e.target.value);
                    if (mem) setClothingNotes(mem.clothingDescription || '');
                  }}
                  required
                  className="w-full p-3 bg-slate-50 dark:bg-slate-800 border-2 border-slate-300 dark:border-slate-700 rounded-2xl text-xs font-bold text-slate-900 dark:text-white focus:outline-none focus:border-rose-500"
                >
                  <option value="">-- اضغط لاختيار الطفل --</option>
                  {(visitor?.familyMembers || []).filter(m => m.relation === 'child').map(c => (
                    <option key={c.id} value={c.id}>
                      {c.name} ({c.age} سنوات) - آخر لعبة: {c.lastActivity?.locationName} ({c.lastActivity?.timestamp})
                    </option>
                  ))}
                </select>
              </div>

              {selectedChildForSOS && (
                <div className="p-3.5 bg-rose-50 dark:bg-slate-800 rounded-2xl border-2 border-rose-200 dark:border-slate-700 text-xs space-y-1">
                  <div className="text-rose-600 font-black">بيانات الاستدلال الميداني التلقائية:</div>
                  <div className="text-slate-800 dark:text-slate-200">
                    آخر محطة مسجلة: <strong>عجلة بانوراما العملاقة (#2)</strong>
                  </div>
                  <div className="text-slate-800 dark:text-slate-200">الوقت: <strong>21:03</strong></div>
                  <div className="text-slate-500 text-[11px]">التذكرة المربوطة: T-000182</div>
                </div>
              )}

              <div>
                <label className="block text-xs font-black text-slate-800 dark:text-slate-200 mb-1.5">
                  أوصاف الملابس والمظهر الخارجي:
                </label>
                <textarea
                  value={clothingNotes}
                  onChange={(e) => setClothingNotes(e.target.value)}
                  placeholder="مثال: قميص أزرق جينز وبنطال رمادي وحذاء أبيض..."
                  rows={2}
                  className="w-full p-3 bg-slate-50 dark:bg-slate-800 border-2 border-slate-300 dark:border-slate-700 rounded-2xl text-xs font-bold text-slate-900 dark:text-white focus:outline-none focus:border-rose-500"
                />
              </div>

              <div className="flex items-center gap-3 pt-2">
                <button
                  type="submit"
                  disabled={!selectedChildForSOS}
                  className="btn-game-rose flex-1 py-3 text-xs font-black disabled:opacity-40"
                >
                  إرسال الاستنفار لغرفة الأمن 🚨
                </button>
                <button
                  type="button"
                  onClick={() => setShowSOSModal(false)}
                  className="btn-game-white py-3 px-5 text-xs font-bold"
                >
                  إلغاء
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Next Stage Navigation CTA */}
      <div className="bg-rose-50 dark:bg-slate-900 rounded-3xl p-5 border-3 border-rose-200 dark:border-slate-800 shadow-md flex items-center justify-between">
        <div>
          <h5 className="text-base font-black text-slate-900 dark:text-white">المرحلة التالية: حلبة الألعاب وتحديات الحصن 🎢</h5>
          <p className="text-xs text-slate-600 dark:text-slate-400 font-medium">
            تصفح ألعاب الحديقة، أوقات الانتظار، وتشغيل الألعاب بالتذاكر والوحدات
          </p>
        </div>
        <button
          onClick={() => {
            sound.playLevelUp();
            nextVisitorGameStage();
          }}
          className="btn-game-rose px-6 py-2.5 text-xs font-black shrink-0"
        >
          الانتقال للمرحلة 4 (الألعاب) ➔
        </button>
      </div>
    </div>
  );
};
