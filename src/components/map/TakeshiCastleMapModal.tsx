import React, { useState } from 'react';
import { usePark } from '../../context/ParkContext';
import { Attraction, FamilyMember } from '../../types';
import { sound } from '../../utils/crypto';
import { 
  Compass, 
  Sparkles, 
  X, 
  Clock, 
  Coins, 
  Users, 
  Flame, 
  ShieldAlert, 
  CheckCircle2, 
  QrCode, 
  Maximize2, 
  Minimize2, 
  Layers, 
  Navigation,
  HelpCircle,
  Play,
  Volume2,
  VolumeX,
  Zap,
  Waves,
  Smile,
  Anchor,
  Car,
  DoorOpen,
  ShieldCheck,
  Building2,
  ArrowRight,
  TrendingUp,
  MapPin
} from 'lucide-react';

interface CastleStage {
  id: string;
  number: number;
  titleAr: string;
  titleEn: string;
  category: 'thrill' | 'family' | 'kids' | 'water' | 'gate' | 'admin' | 'security';
  descriptionAr: string;
  x: number; // percentage on SVG map
  y: number; // percentage on SVG map
  attractionId?: string; // Links to system attraction if applicable
  iconName: string;
  isSpecialStation?: boolean;
}

export const CASTLE_STAGES: CastleStage[] = [
  {
    id: 'stage-1',
    number: 1,
    titleAr: 'بوابة الحصن ونقطة الانطلاق الكبرى',
    titleEn: 'The Grand Castle Gate',
    category: 'gate',
    descriptionAr: 'بوابة الدخول الرئيسية ونقطة التحقق الفوري من تذاكر العبور ورموز Entry QR مع درع منع الاستخدام المزدوج.',
    x: 16,
    y: 84,
    iconName: 'DoorOpen',
    isSpecialStation: true
  },
  {
    id: 'stage-2',
    number: 2,
    titleAr: 'خيمة الكاشير وسوق الوحدات',
    titleEn: 'Cashier & Units Bazaar',
    category: 'admin',
    descriptionAr: 'نقطة شحن رصيد وحدات الحديقة وإصدار التذاكر الورقية الحرارية المربوطة بالحساب أو التذاكر المطبوعة مسبقاً.',
    x: 32,
    y: 86,
    iconName: 'Coins',
    isSpecialStation: true
  },
  {
    id: 'stage-3',
    number: 3,
    titleAr: 'واحة صغار المحاربين وعالم الأطفال',
    titleEn: 'Little Warriors Kingdom',
    category: 'kids',
    descriptionAr: 'منطقة ألعاب تفاعلية آمنة مصممة خصيصاً للأطفال الصغار وبناء المهارات الحركية.',
    x: 48,
    y: 76,
    attractionId: 'attr-4',
    iconName: 'Smile'
  },
  {
    id: 'stage-4',
    number: 4,
    titleAr: 'بركة الأحجار ونهر الإثارة المائي',
    titleEn: 'Rapid Splash Stepping River',
    category: 'water',
    descriptionAr: 'ممر مائي سريع مستوحى من تحدي القفز على الأحجار المائية في برنامج الحصن مع منزلقات ورذاذ منعش.',
    x: 68,
    y: 70,
    attractionId: 'attr-6',
    iconName: 'Waves'
  },
  {
    id: 'stage-5',
    number: 5,
    titleAr: 'متاهة الأبواب وسيارات التصادم',
    titleEn: 'Honeycomb Maze & Bumper Arena',
    category: 'family',
    descriptionAr: 'حلبة مطاردة وسيارات كهربائية مجهزة بأنظمة أمان حديثة لتجربة منافسة عائلية حماسية.',
    x: 82,
    y: 52,
    attractionId: 'attr-3',
    iconName: 'Car'
  },
  {
    id: 'stage-6',
    number: 6,
    titleAr: 'خليج القراصنة والسفينة الهائجة',
    titleEn: 'Pirate Galleon Swing',
    category: 'thrill',
    descriptionAr: 'أرجوحة بحرية عملاقة تتأرجح بارتفاع 20 متراً لمحاكاة الإبحار في عواصف المحيطات الغاضبة.',
    x: 64,
    y: 40,
    attractionId: 'attr-5',
    iconName: 'Anchor'
  },
  {
    id: 'stage-7',
    number: 7,
    titleAr: 'برج المراقبة وعجلة الحصن البانورامية',
    titleEn: 'Panoramic High Watchtower',
    category: 'family',
    descriptionAr: 'عجلة عملاقة تطل على كافة أرجاء الحديقة والحصن بالكامل (الموقع المسجل لآخر نشاط للطفل أحمد).',
    x: 40,
    y: 44,
    attractionId: 'attr-2',
    iconName: 'Compass'
  },
  {
    id: 'stage-8',
    number: 8,
    titleAr: 'قطار الموت والتنين السريع',
    titleEn: 'Flying Dragon Hyper Coaster',
    category: 'thrill',
    descriptionAr: 'قطار أفعواني فائق السرعة يخترق جبال ومغارات الحصن بانحدارات لولبية حابسة للأنفاس.',
    x: 20,
    y: 34,
    attractionId: 'attr-1',
    iconName: 'Zap'
  },
  {
    id: 'stage-9',
    number: 9,
    titleAr: 'برج الحراسة وغرفة الأمن والإنقاذ',
    titleEn: 'Imperial Guardhouse & Safety SOS',
    category: 'security',
    descriptionAr: 'مركز المراقبة والتحكم الميداني واستقبال بلاغات الفقدان العائلية وإدارة السلامة الفورية.',
    x: 35,
    y: 20,
    iconName: 'ShieldCheck',
    isSpecialStation: true
  },
  {
    id: 'stage-10',
    number: 10,
    titleAr: 'قصر الحصن والعرش الرئيسي (الإدارة والمزامنة)',
    titleEn: 'General Takeshi Fortress & Core Ledger',
    category: 'admin',
    descriptionAr: 'القمة النهائية للحصن؛ حيث يدار سجل الأحداث المركزي ومحرك المزامنة غير المتصلة والتقارير المالية.',
    x: 55,
    y: 12,
    iconName: 'Building2',
    isSpecialStation: true
  }
];

export const TakeshiCastleMapModal: React.FC = () => {
  const { 
    isCastleMapOpen, 
    closeCastleMap, 
    visitor, 
    attractions, 
    tickets, 
    missingAlerts,
    consumeRideAction,
    validateGateEntry,
    selectedMapAttractionId,
    setSelectedMapAttractionId,
    simulateFamilyMemberMove,
    showQRModal,
    openOnboarding
  } = usePark();

  const [activeCategoryFilter, setActiveCategoryFilter] = useState<string>('all');
  const [showHeatmap, setShowHeatmap] = useState<boolean>(false);
  const [selectedStage, setSelectedStage] = useState<CastleStage | null>(() => {
    if (selectedMapAttractionId) {
      return CASTLE_STAGES.find(s => s.attractionId === selectedMapAttractionId) || CASTLE_STAGES[6];
    }
    return CASTLE_STAGES[6]; // Stage 7 (Ferris wheel - Ahmed's location) by default
  });
  const [isSimulatingWalk, setIsSimulatingWalk] = useState<boolean>(false);
  const [feedbackToast, setFeedbackToast] = useState<string | null>(null);
  const [soundEnabled, setSoundEnabled] = useState<boolean>(true);

  if (!isCastleMapOpen) return null;

  const activeAlerts = (missingAlerts || []).filter(a => a.status === 'ACTIVE_SEARCH');

  const getStageIcon = (name: string) => {
    switch (name) {
      case 'DoorOpen': return <DoorOpen className="w-4 h-4" />;
      case 'Coins': return <Coins className="w-4 h-4" />;
      case 'Smile': return <Smile className="w-4 h-4" />;
      case 'Waves': return <Waves className="w-4 h-4" />;
      case 'Car': return <Car className="w-4 h-4" />;
      case 'Anchor': return <Anchor className="w-4 h-4" />;
      case 'Compass': return <Compass className="w-4 h-4" />;
      case 'Zap': return <Zap className="w-4 h-4" />;
      case 'ShieldCheck': return <ShieldCheck className="w-4 h-4" />;
      case 'Building2': return <Building2 className="w-4 h-4" />;
      default: return <Sparkles className="w-4 h-4" />;
    }
  };

  // Find family members at each stage based on their last recorded activity
  const getFamilyMembersAtStage = (stage: CastleStage): FamilyMember[] => {
    return (visitor?.familyMembers || []).filter(member => {
      if (!member.lastActivity) return false;
      if (stage.attractionId && member.lastActivity.locationId === stage.attractionId) {
        return true;
      }
      if (stage.id === 'stage-1' && (member.lastActivity.locationId === 'gate-1' || member.lastActivity.locationId === 'gate-station' || member.lastActivity.type === 'gate_entry')) {
        return true;
      }
      if (member.lastActivity.locationName.includes(stage.titleAr) || (stage.attractionId && member.lastActivity.locationName.includes(stage.attractionId.replace('attr-', '')))) {
        return true;
      }
      return false;
    });
  };

  // Trigger Ride / Ticket usage for selected stage
  const handleStageRideAction = (stage: CastleStage) => {
    if (soundEnabled) sound.playStepSound();

    if (stage.id === 'stage-1') {
      // Gate Entry
      const validTicket = (tickets || []).find(t => t.visitorId === visitor?.id && (t.status === 'AVAILABLE' || t.status === 'VALIDATED'));
      const res = validateGateEntry(validTicket?.id || 'T-000180', 'بوابة الحصن الرئيسية', 'EMP-004');
      setFeedbackToast(res.message);
      setTimeout(() => setFeedbackToast(null), 4000);
      return;
    }

    if (stage.attractionId) {
      const attraction = (attractions || []).find(a => a.id === stage.attractionId);
      const validTicket = (tickets || []).find(t => t.visitorId === visitor?.id && t.status === 'AVAILABLE');
      
      const res = consumeRideAction(
        stage.attractionId, 
        validTicket?.id || `{"qrType":"USAGE_QR","visitorId":"${visitor.id}","timestamp":${Date.now()},"nonce":"MAP-${Math.random().toString(36).substring(2,7)}"}`,
        'EMP-009'
      );

      setFeedbackToast(res.message);
      setTimeout(() => setFeedbackToast(null), 4000);
    }
  };

  // Simulate advancing a child to next stage
  const handleSimulateMoveChild = (memberId: string) => {
    const member = visitor.familyMembers.find(m => m.id === memberId);
    if (!member || !selectedStage) return;

    simulateFamilyMemberMove(
      memberId, 
      selectedStage.attractionId || selectedStage.id, 
      `${selectedStage.titleAr} (${selectedStage.number}#)`
    );

    setFeedbackToast(`🚶 تم تحديث آخر نشاط مسجل لـ (${member.name}) في محطة: ${selectedStage.titleAr}`);
    setTimeout(() => setFeedbackToast(null), 4000);
  };

  // Filter stages
  const filteredStages = CASTLE_STAGES.filter(stage => {
    if (activeCategoryFilter === 'all') return true;
    if (activeCategoryFilter === 'thrill') return stage.category === 'thrill';
    if (activeCategoryFilter === 'family') return stage.category === 'family';
    if (activeCategoryFilter === 'kids') return stage.category === 'kids';
    if (activeCategoryFilter === 'water') return stage.category === 'water';
    if (activeCategoryFilter === 'admin') return stage.category === 'admin' || stage.category === 'gate' || stage.category === 'security';
    return true;
  });

  const matchedAttraction = selectedStage?.attractionId 
    ? attractions.find(a => a.id === selectedStage.attractionId)
    : null;

  const membersAtSelectedStage = selectedStage ? getFamilyMembersAtStage(selectedStage) : [];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-slate-950/90 backdrop-blur-lg animate-fadeIn overflow-hidden">
      <div className="bg-slate-900 border border-slate-700/80 rounded-3xl shadow-2xl text-slate-100 w-full max-w-7xl h-[94vh] flex flex-col overflow-hidden relative">
        
        {/* Top Castle Map Header Bar */}
        <div className="px-4 py-3 bg-slate-950 border-b border-slate-800 flex flex-wrap items-center justify-between gap-3 shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-amber-500 via-rose-500 to-indigo-600 flex items-center justify-center text-white shadow-lg font-black text-xl border border-amber-400/40">
              🏯
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base sm:text-lg font-black text-white flex items-center gap-2">
                  خريطة مغامرات الحصن التفاعلية
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 font-bold border border-amber-500/30">
                    طراز برنامج الحصن 🏰
                  </span>
                </h2>
              </div>
              <p className="text-[11px] text-slate-400">
                استكشف محطات الحديقة، أوقات الانتظار، مسار أفراد الأسرة، ومواقع الأنشطة في الوقت الفعلي 🎯
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            {/* Open Educational Walkthrough button */}
            <button
              onClick={() => {
                closeCastleMap();
                openOnboarding();
              }}
              className="px-2.5 py-1.5 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 shadow-md shadow-emerald-950"
            >
              <HelpCircle className="w-3.5 h-3.5" />
              <span>جولة الحصن التعليمية 🧭</span>
            </button>

            {/* Heatmap density toggle */}
            <button
              onClick={() => {
                setShowHeatmap(!showHeatmap);
                if (soundEnabled) sound.playStepSound();
              }}
              className={`px-2.5 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 border ${
                showHeatmap 
                  ? 'bg-rose-950 text-rose-300 border-rose-500/80 ring-1 ring-rose-500' 
                  : 'bg-slate-800 text-slate-300 border-slate-700 hover:bg-slate-750'
              }`}
              title="خريطة الحرارة ومستويات كثافة الازدحام"
            >
              <Flame className={`w-3.5 h-3.5 ${showHeatmap ? 'text-rose-400 animate-pulse' : 'text-slate-400'}`} />
              <span>{showHeatmap ? 'خريطة الازدحام نشطة 🔥' : 'خريطة الازدحام'}</span>
            </button>

            {/* Sound Toggle */}
            <button
              onClick={() => setSoundEnabled(!soundEnabled)}
              className="p-2 rounded-xl bg-slate-800 hover:bg-slate-750 text-slate-300 border border-slate-700 transition-colors"
              title="كتم/تفعيل المؤثرات الصوتية"
            >
              {soundEnabled ? <Volume2 className="w-4 h-4 text-emerald-400" /> : <VolumeX className="w-4 h-4 text-slate-500" />}
            </button>

            {/* Close Modal */}
            <button
              onClick={closeCastleMap}
              className="p-2 rounded-xl bg-slate-800 hover:bg-rose-900/60 hover:text-rose-200 text-slate-400 border border-slate-700 transition-colors"
              title="إغلاق الخريطة"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Action Feedback Toast */}
        {feedbackToast && (
          <div className="absolute top-16 left-1/2 -translate-x-1/2 z-40 px-4 py-2 bg-emerald-950/95 border border-emerald-500/60 text-emerald-100 rounded-2xl text-xs font-bold shadow-2xl flex items-center gap-2 animate-bounce">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>{feedbackToast}</span>
          </div>
        )}

        {/* Main Map Body: Left Canvas/SVG + Right Inspector Sidebar */}
        <div className="flex-1 flex flex-col lg:flex-row overflow-hidden">
          
          {/* Main Interactive Map Viewport (Takeshi Mountain & Castle Layout) */}
          <div className="flex-1 flex flex-col bg-[#0b1329] relative overflow-hidden select-none border-b lg:border-b-0 lg:border-l border-slate-800">
            
            {/* Filter Bar */}
            <div className="p-2 bg-slate-950/70 border-b border-slate-800/80 flex items-center justify-between gap-2 overflow-x-auto scrollbar-none z-10">
              <div className="flex items-center gap-1.5 min-w-max text-xs">
                <span className="text-slate-400 font-bold px-1 text-[11px]">تصنيف المحطات:</span>
                {[
                  { id: 'all', label: 'كافة مراحل الحصن (10)' },
                  { id: 'thrill', label: '⚡ ألعاب الإثارة' },
                  { id: 'family', label: '🎡 عائلي وتحديات' },
                  { id: 'water', label: '🌊 مائي وأحجار' },
                  { id: 'kids', label: '👶 الصغار' },
                  { id: 'admin', label: '🛡️ بوابات وأمن' }
                ].map(tab => (
                  <button
                    key={tab.id}
                    onClick={() => {
                      setActiveCategoryFilter(tab.id);
                      if (soundEnabled) sound.playStepSound();
                    }}
                    className={`px-2.5 py-1 rounded-lg font-bold text-[11px] transition-all ${
                      activeCategoryFilter === tab.id
                        ? 'bg-amber-500 text-slate-950 shadow-md'
                        : 'bg-slate-900/80 text-slate-400 hover:text-white border border-slate-800'
                    }`}
                  >
                    {tab.label}
                  </button>
                ))}
              </div>

              <div className="hidden sm:flex items-center gap-2 text-[11px] text-amber-300 font-mono">
                <span>📍 موقع أحمد: <strong className="text-white">عجلة بانوراما (#7)</strong></span>
              </div>
            </div>

            {/* Visual SVG Takeshi Castle Map Canvas */}
            <div className="flex-1 relative overflow-auto p-4 flex items-center justify-center">
              
              <div className="relative w-full max-w-4xl aspect-[16/10] bg-gradient-to-b from-[#111c44] via-[#0d223a] to-[#081320] rounded-3xl border-2 border-amber-500/20 shadow-2xl overflow-hidden min-w-[620px]">
                
                {/* SVG Landscape & Mountain Fortress Roads */}
                <svg className="absolute inset-0 w-full h-full pointer-events-none" viewBox="0 0 1000 625" fill="none">
                  <defs>
                    {/* Gradients */}
                    <linearGradient id="castleMountainGrad" x1="0%" y1="100%" x2="50%" y2="0%">
                      <stop offset="0%" stopColor="#08182b" stopOpacity="0.9" />
                      <stop offset="50%" stopColor="#1e295d" stopOpacity="0.7" />
                      <stop offset="100%" stopColor="#312061" stopOpacity="0.8" />
                    </linearGradient>

                    <linearGradient id="riverGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" stopColor="#0284c7" stopOpacity="0.8" />
                      <stop offset="50%" stopColor="#06b6d4" stopOpacity="0.9" />
                      <stop offset="100%" stopColor="#0369a1" stopOpacity="0.8" />
                    </linearGradient>

                    <radialGradient id="summitGlow" cx="55%" cy="12%" r="25%">
                      <stop offset="0%" stopColor="#f59e0b" stopOpacity="0.35" />
                      <stop offset="100%" stopColor="#f59e0b" stopOpacity="0" />
                    </radialGradient>
                  </defs>

                  {/* Summit Glow Aura */}
                  <circle cx="550" cy="80" r="140" fill="url(#summitGlow)" />

                  {/* Mountain Terrain Curves */}
                  <path
                    d="M 0 625 L 0 450 Q 200 420 350 350 Q 550 250 550 80 Q 550 250 750 380 Q 900 440 1000 480 L 1000 625 Z"
                    fill="url(#castleMountainGrad)"
                  />

                  {/* Water River (Stepping stones challenge river) */}
                  <path
                    d="M 450 625 Q 520 540 680 440 Q 820 340 920 300 L 980 320 Q 850 380 720 480 Q 560 580 520 625 Z"
                    fill="url(#riverGrad)"
                    className="animate-pulse"
                  />

                  {/* Stepping Stones on River */}
                  {[
                    { cx: 560, cy: 540, r: 10 },
                    { cx: 610, cy: 500, r: 12 },
                    { cx: 660, cy: 460, r: 11 },
                    { cx: 720, cy: 420, r: 13 },
                    { cx: 780, cy: 380, r: 10 },
                  ].map((stone, idx) => (
                    <circle 
                      key={idx} 
                      cx={stone.cx} 
                      cy={stone.cy} 
                      r={stone.r} 
                      fill="#e2e8f0" 
                      stroke="#475569" 
                      strokeWidth="2" 
                    />
                  ))}

                  {/* Winding Adventure Paths connecting the Castle Stages */}
                  {/* Stage 1 (160, 525) -> Stage 2 (320, 535) */}
                  <path d="M 160 525 Q 240 545 320 535" stroke="#f59e0b" strokeWidth="4" strokeDasharray="6 6" opacity="0.75" />
                  
                  {/* Stage 2 (320, 535) -> Stage 3 (480, 475) */}
                  <path d="M 320 535 Q 400 520 480 475" stroke="#f59e0b" strokeWidth="4" strokeDasharray="6 6" opacity="0.75" />
                  
                  {/* Stage 3 (480, 475) -> Stage 4 (680, 435) */}
                  <path d="M 480 475 Q 580 480 680 435" stroke="#f59e0b" strokeWidth="4" strokeDasharray="6 6" opacity="0.75" />
                  
                  {/* Stage 4 (680, 435) -> Stage 5 (820, 325) */}
                  <path d="M 680 435 Q 760 390 820 325" stroke="#f59e0b" strokeWidth="4" strokeDasharray="6 6" opacity="0.75" />

                  {/* Stage 5 (820, 325) -> Stage 6 (640, 250) */}
                  <path d="M 820 325 Q 740 270 640 250" stroke="#f59e0b" strokeWidth="4" strokeDasharray="6 6" opacity="0.75" />

                  {/* Stage 6 (640, 250) -> Stage 7 (400, 275) */}
                  <path d="M 640 250 Q 520 280 400 275" stroke="#f59e0b" strokeWidth="4" strokeDasharray="6 6" opacity="0.75" />

                  {/* Stage 7 (400, 275) -> Stage 8 (200, 210) */}
                  <path d="M 400 275 Q 300 260 200 210" stroke="#f59e0b" strokeWidth="4" strokeDasharray="6 6" opacity="0.75" />

                  {/* Stage 8 (200, 210) -> Stage 9 (350, 125) */}
                  <path d="M 200 210 Q 260 150 350 125" stroke="#f59e0b" strokeWidth="4" strokeDasharray="6 6" opacity="0.75" />

                  {/* Stage 9 (350, 125) -> Stage 10 (550, 75) */}
                  <path d="M 350 125 Q 450 90 550 75" stroke="#f59e0b" strokeWidth="5" strokeDasharray="6 6" opacity="0.9" />

                  {/* Castle Fortress Roof silhouette at Summit */}
                  <g transform="translate(515, 25) scale(0.7)">
                    <polygon points="50,10 90,40 10,40" fill="#dc2626" />
                    <rect x="25" y="40" width="50" height="35" fill="#f8fafc" />
                    <rect x="40" y="55" width="20" height="20" fill="#1e293b" />
                    <polygon points="50,-15 105,15 -5,15" fill="#b91c1c" />
                  </g>
                </svg>

                {/* Heatmap Overlay Bubbles (when activated) */}
                {showHeatmap && (
                  <div className="absolute inset-0 pointer-events-none">
                    <div className="absolute left-[20%] top-[34%] w-32 h-32 rounded-full bg-rose-500/30 blur-2xl animate-pulse" />
                    <div className="absolute left-[68%] top-[70%] w-36 h-36 rounded-full bg-amber-500/30 blur-2xl animate-pulse" />
                    <div className="absolute left-[82%] top-[52%] w-28 h-28 rounded-full bg-emerald-500/20 blur-2xl" />
                    <div className="absolute left-[40%] top-[44%] w-32 h-32 rounded-full bg-blue-500/25 blur-2xl" />
                  </div>
                )}

                {/* Render All Castle Interactive Checkpoint Pins */}
                {filteredStages.map((stage) => {
                  const isSelected = selectedStage?.id === stage.id;
                  const membersHere = getFamilyMembersAtStage(stage);
                  const hasAhmed = membersHere.some(m => m.name.includes('أحمد'));
                  const isSosStation = activeAlerts.some(a => a.lastRecordedActivity.locationName.includes(stage.titleAr) || (stage.attractionId && a.lastRecordedActivity.locationId === stage.attractionId));

                  // Color by category
                  let pinBg = 'bg-slate-800 border-slate-600 text-slate-200';
                  if (stage.category === 'thrill') pinBg = 'bg-purple-900 border-purple-400 text-purple-200';
                  if (stage.category === 'family') pinBg = 'bg-blue-900 border-blue-400 text-blue-200';
                  if (stage.category === 'water') pinBg = 'bg-cyan-900 border-cyan-400 text-cyan-200';
                  if (stage.category === 'kids') pinBg = 'bg-emerald-900 border-emerald-400 text-emerald-200';
                  if (stage.category === 'admin' || stage.category === 'gate') pinBg = 'bg-amber-900 border-amber-400 text-amber-200';
                  if (stage.category === 'security') pinBg = 'bg-rose-900 border-rose-400 text-rose-200';

                  return (
                    <div
                      key={stage.id}
                      style={{
                        left: `${stage.x}%`,
                        top: `${stage.y}%`,
                        transform: 'translate(-50%, -50%)'
                      }}
                      className="absolute z-20 group"
                    >
                      {/* Family Member Avatar Markers on Map */}
                      {membersHere.length > 0 && (
                        <div className="absolute -top-7 left-1/2 -translate-x-1/2 flex items-center -space-x-2 z-30 pointer-events-none">
                          {membersHere.map((m, idx) => (
                            <span
                              key={idx}
                              title={`${m.name} (آخر نشاط مسجل: ${m.lastActivity?.timestamp})`}
                              className="w-6 h-6 rounded-full bg-slate-900 border-2 border-emerald-400 shadow-lg flex items-center justify-center text-xs animate-bounce"
                              style={{ animationDelay: `${idx * 0.2}s` }}
                            >
                              {m.avatar}
                            </span>
                          ))}
                        </div>
                      )}

                      {/* Active SOS Beacon indicator */}
                      {isSosStation && (
                        <span className="absolute -inset-3 rounded-full bg-rose-500/40 animate-ping z-10" />
                      )}

                      {/* Main Stage Checkpoint Button */}
                      <button
                        onClick={() => {
                          setSelectedStage(stage);
                          if (soundEnabled) sound.playStepSound();
                        }}
                        className={`relative z-20 flex flex-col items-center justify-center transition-all duration-300 ${
                          isSelected 
                            ? 'scale-125 ring-4 ring-amber-400 shadow-2xl z-30' 
                            : 'hover:scale-110 hover:z-25'
                        }`}
                      >
                        <div className={`w-9 h-9 sm:w-11 sm:h-11 rounded-2xl border-2 flex items-center justify-center shadow-xl ${pinBg}`}>
                          {getStageIcon(stage.iconName)}
                        </div>

                        {/* Stage Number Badge */}
                        <span className="absolute -bottom-2 -right-1 w-5 h-5 rounded-full bg-amber-500 text-slate-950 font-black text-[10px] flex items-center justify-center border border-slate-950 shadow-md">
                          {stage.number}
                        </span>
                      </button>

                      {/* Tooltip Label */}
                      <div className="absolute top-12 left-1/2 -translate-x-1/2 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity z-30 bg-slate-950/95 border border-slate-700 px-2 py-1 rounded-lg text-[10px] font-bold text-white whitespace-nowrap shadow-xl">
                        {stage.titleAr}
                      </div>
                    </div>
                  );
                })}

                {/* Legend Watermark on Map Canvas */}
                <div className="absolute bottom-2 left-2 bg-slate-950/80 backdrop-blur-md border border-slate-800/80 px-2.5 py-1.5 rounded-xl text-[10px] text-slate-300 font-bold flex items-center gap-3">
                  <div className="flex items-center gap-1">
                    <span className="w-2 h-2 rounded-full bg-amber-400" />
                    <span>مسار الحصن</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <span className="w-2 h-2 rounded-full bg-emerald-400" />
                    <span>أفراد الأسرة</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <span className="w-2 h-2 rounded-full bg-rose-500 animate-ping" />
                    <span>بلاغات الأمن SOS</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Inspector Sidebar (Stage Details, Live Queue, Action Simulation) */}
          <div className="w-full lg:w-96 bg-slate-950 p-4 sm:p-5 flex flex-col justify-between overflow-y-auto border-t lg:border-t-0 border-slate-800 shrink-0">
            {selectedStage ? (
              <div className="space-y-4">
                
                {/* Stage Header Info */}
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-[10px] font-bold text-amber-400 bg-amber-500/10 px-2.5 py-0.5 rounded-full border border-amber-500/20 flex items-center gap-1">
                      <Sparkles className="w-3 h-3 text-amber-400" />
                      المرحلة رقم {selectedStage.number} من 10
                    </span>

                    <span className="text-[10px] text-slate-400 uppercase font-mono">
                      {selectedStage.category}
                    </span>
                  </div>

                  <h3 className="text-lg font-black text-white">{selectedStage.titleAr}</h3>
                  <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                    {selectedStage.descriptionAr}
                  </p>
                </div>

                {/* Attraction Live Telemetry if Linked */}
                {matchedAttraction ? (
                  <div className="bg-slate-900/90 rounded-2xl p-3.5 border border-slate-800 space-y-3">
                    <div className="flex items-center justify-between text-xs pb-2 border-b border-slate-800">
                      <span className="text-slate-400">حالة التشغيل:</span>
                      <span className="text-emerald-400 font-bold flex items-center gap-1">
                        <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                        جاهزة ومفتوحة للزوار
                      </span>
                    </div>

                    <div className="grid grid-cols-2 gap-2 text-xs">
                      <div className="p-2.5 rounded-xl bg-slate-950 border border-slate-800">
                        <div className="text-slate-400 text-[10px] flex items-center gap-1 mb-0.5">
                          <Coins className="w-3 h-3 text-amber-400" />
                          التكلفة بالوحدات:
                        </div>
                        <div className="font-bold text-amber-300 font-mono text-sm">
                          {matchedAttraction.priceUnits} وحدة
                        </div>
                      </div>

                      <div className="p-2.5 rounded-xl bg-slate-950 border border-slate-800">
                        <div className="text-slate-400 text-[10px] flex items-center gap-1 mb-0.5">
                          <Clock className="w-3 h-3 text-blue-400" />
                          وقت الانتظار التقريبي:
                        </div>
                        <div className="font-bold text-blue-300 font-mono text-sm">
                          {matchedAttraction.avgWaitTimeMins} دقائق
                        </div>
                      </div>
                    </div>

                    {/* Queue Density Bar */}
                    <div>
                      <div className="flex items-center justify-between text-[11px] text-slate-400 mb-1">
                        <span>كثافة طابور الانتظار:</span>
                        <span className="text-slate-200 font-bold font-mono">{matchedAttraction.currentQueue} زائر</span>
                      </div>
                      <div className="w-full h-2 bg-slate-950 rounded-full overflow-hidden border border-slate-800">
                        <div 
                          className="h-full bg-gradient-to-r from-emerald-500 via-amber-500 to-rose-500 transition-all duration-500"
                          style={{ width: `${Math.min(100, (matchedAttraction.currentQueue / 50) * 100)}%` }}
                        />
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="bg-slate-900/90 rounded-2xl p-3.5 border border-slate-800 text-xs text-slate-300">
                    <div className="font-bold text-white mb-1">محطة خدمية وتشغيلية رئيسية</div>
                    <div className="text-[11px] text-slate-400">
                      تعمل هذه النقطة وفق معايير التشغيل الهجين (Phone First) بدون الحاجة إلى أجهزة بوابات أو شبكة إنترنت مستمرة.
                    </div>
                  </div>
                )}

                {/* Family Members Recorded at this Stage */}
                <div className="p-3.5 bg-slate-900/90 rounded-2xl border border-slate-800">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-bold text-white flex items-center gap-1.5">
                      <Users className="w-3.5 h-3.5 text-emerald-400" />
                      أفراد الأسرة المسجلين في هذه المحطة:
                    </span>
                    <span className="text-[10px] font-mono text-slate-400">
                      {membersAtSelectedStage.length} مسجلين
                    </span>
                  </div>

                  {membersAtSelectedStage.length > 0 ? (
                    <div className="space-y-1.5">
                      {membersAtSelectedStage.map((m) => (
                        <div 
                          key={m.id}
                          className="p-2 bg-slate-950 rounded-xl border border-slate-800 flex items-center justify-between text-xs"
                        >
                          <div className="flex items-center gap-2">
                            <span className="text-base">{m.avatar}</span>
                            <div>
                              <div className="font-bold text-white">{m.name}</div>
                              <div className="text-[10px] text-emerald-400">
                                آخر نشاط: {m.lastActivity?.timestamp}
                              </div>
                            </div>
                          </div>
                          <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-900 text-slate-300 border border-slate-700">
                            {m.assignedTicketId || 'بدون تذكرة'}
                          </span>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-2 text-slate-500 text-xs">
                      لا يوجد نشاط مسجل لأفراد العائلة في هذه المرحلة حالياً.
                    </div>
                  )}
                </div>

                {/* Interactive Simulator: Move Child to this Stage */}
                <div className="p-3.5 bg-slate-900/90 rounded-2xl border border-slate-800 space-y-2">
                  <div className="text-xs font-bold text-white flex items-center gap-1.5">
                    <Navigation className="w-3.5 h-3.5 text-indigo-400" />
                    <span>محاكاة تنقل الأطفال إلى هذه المحطة:</span>
                  </div>
                  <p className="text-[11px] text-slate-400">
                    انقر على أحد أفراد الأسرة لتسجيل وصوله وتحديث مساره الزمني تلقائياً:
                  </p>
                  
                  <div className="flex items-center gap-1.5 flex-wrap">
                    {visitor.familyMembers.filter(m => m.relation === 'child').map(c => (
                      <button
                        key={c.id}
                        onClick={() => handleSimulateMoveChild(c.id)}
                        className="px-2.5 py-1 bg-slate-950 hover:bg-indigo-900/50 text-indigo-200 border border-indigo-500/30 rounded-lg text-xs font-bold transition-all flex items-center gap-1"
                      >
                        <span>{c.avatar}</span>
                        <span>نقل {c.name} هنا</span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Primary Action Button */}
                <button
                  onClick={() => handleStageRideAction(selectedStage)}
                  className="w-full py-3 bg-gradient-to-r from-amber-500 via-emerald-500 to-teal-500 hover:from-amber-400 hover:to-teal-400 text-slate-950 font-black text-xs rounded-2xl shadow-xl flex items-center justify-center gap-2 transition-all"
                >
                  <Play className="w-4 h-4 fill-slate-950" />
                  <span>
                    {selectedStage.id === 'stage-1' 
                      ? 'المرور عبر بوابة الدخول (مسح Entry QR)' 
                      : selectedStage.attractionId
                      ? `خوض تحدي ${selectedStage.titleAr} (خصم تذكرة / وحدات)`
                      : `استخدام خدمات ${selectedStage.titleAr}`}
                  </span>
                </button>

              </div>
            ) : (
              <div className="h-full flex items-center justify-center text-center text-slate-500 text-xs">
                انقر على أي محطة على خريطة الحصن لمعاينة تفاصيلها والتحكم بها.
              </div>
            )}

            {/* Bottom Footer Note */}
            <div className="pt-3 border-t border-slate-800/80 text-[10px] text-slate-500 flex items-center justify-between">
              <span>نظام Sirafi tickets — هاتف أولاً 📱</span>
              <span className="font-mono text-emerald-400">Online & Offline Ready ⚡</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
