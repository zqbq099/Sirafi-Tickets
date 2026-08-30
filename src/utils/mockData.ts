import { Attraction, Employee, MissingPersonAlert, ParkEvent, Ticket, Visitor } from '../types';
import { generateSignature } from './crypto';

export const INITIAL_ATTRACTIONS: Attraction[] = [
  {
    id: 'attr-1',
    nameAr: 'قطار الموت السريع',
    nameEn: 'Hyper Roller Coaster',
    priceUnits: 15,
    category: 'thrill',
    status: 'OPEN',
    capacity: 28,
    zone: 'منطقة المغامرات (المنطقة A)',
    operatingHours: '16:00 - 01:00',
    icon: 'Zap',
    currentQueue: 38,
    totalRidesToday: 420,
    avgWaitTimeMins: 18,
    isFrozenForSafety: false,
    assignedSafetyStaff: 3,
    treasureMapCoords: { x: 20, y: 30 }
  },
  {
    id: 'attr-2',
    nameAr: 'عجلة بانوراما العملاقة',
    nameEn: 'Giant Ferris Wheel',
    priceUnits: 10,
    category: 'family',
    status: 'OPEN',
    capacity: 48,
    zone: 'الساحة الرئيسية (المنطقة B)',
    operatingHours: '16:00 - 01:00',
    icon: 'Compass',
    currentQueue: 18,
    totalRidesToday: 510,
    avgWaitTimeMins: 8,
    isFrozenForSafety: false,
    assignedSafetyStaff: 1,
    treasureMapCoords: { x: 50, y: 25 }
  },
  {
    id: 'attr-3',
    nameAr: 'سيارات التصادم الكهربائية',
    nameEn: 'Dodgem Bumper Cars',
    priceUnits: 8,
    category: 'family',
    status: 'OPEN',
    capacity: 20,
    zone: 'منطقة الصخب (المنطقة C)',
    operatingHours: '16:00 - 01:00',
    icon: 'Car',
    currentQueue: 24,
    totalRidesToday: 680,
    avgWaitTimeMins: 10,
    isFrozenForSafety: false,
    assignedSafetyStaff: 2,
    treasureMapCoords: { x: 80, y: 35 }
  },
  {
    id: 'attr-4',
    nameAr: 'عالم الصغار التفاعلي',
    nameEn: 'Wonder Kids Kingdom',
    priceUnits: 5,
    category: 'kids',
    status: 'OPEN',
    capacity: 50,
    zone: 'واحة الأطفال (المنطقة D)',
    operatingHours: '16:00 - 00:00',
    icon: 'Smile',
    currentQueue: 12,
    totalRidesToday: 390,
    avgWaitTimeMins: 5,
    isFrozenForSafety: false,
    assignedSafetyStaff: 2,
    treasureMapCoords: { x: 75, y: 75 }
  },
  {
    id: 'attr-5',
    nameAr: 'سفينة القراصنة الهائجة',
    nameEn: 'Pirate Gale Ship',
    priceUnits: 12,
    category: 'thrill',
    status: 'OPEN',
    capacity: 32,
    zone: 'خليج القراصنة (المنطقة A)',
    operatingHours: '16:00 - 01:00',
    icon: 'Anchor',
    currentQueue: 16,
    totalRidesToday: 310,
    avgWaitTimeMins: 12,
    isFrozenForSafety: false,
    assignedSafetyStaff: 1,
    treasureMapCoords: { x: 22, y: 75 }
  },
  {
    id: 'attr-6',
    nameAr: 'النهر السريع المائي',
    nameEn: 'Rapid Splash River',
    priceUnits: 12,
    category: 'water',
    status: 'OPEN',
    capacity: 24,
    zone: 'المنطقة المائية (المنطقة E)',
    operatingHours: '16:00 - 23:30',
    icon: 'Waves',
    currentQueue: 42,
    totalRidesToday: 490,
    avgWaitTimeMins: 22,
    isFrozenForSafety: false,
    assignedSafetyStaff: 4,
    treasureMapCoords: { x: 48, y: 65 }
  }
];

export const INITIAL_VISITOR: Visitor = {
  id: 'V-123765',
  name: 'أبو سالم (محمد السالم)',
  phone: '0555123765',
  unitsBalance: 500,
  isAnonymous: false,
  registeredAt: '2026-08-29 18:30',
  familyMembers: [
    {
      id: 'mem-1',
      name: 'محمد السالم (الأب)',
      relation: 'father',
      avatar: '👨',
      assignedTicketId: 'T-000180',
      lastActivity: {
        locationName: 'بوابة الدخول الرئيسية',
        locationId: 'gate-1',
        timestamp: '20:00',
        type: 'gate_entry'
      }
    },
    {
      id: 'mem-2',
      name: 'أم سالم (نورة)',
      relation: 'mother',
      avatar: '👩',
      assignedTicketId: 'T-000181',
      lastActivity: {
        locationName: 'بوابة الدخول الرئيسية',
        locationId: 'gate-1',
        timestamp: '20:00',
        type: 'gate_entry'
      }
    },
    {
      id: 'mem-3',
      name: 'أحمد',
      relation: 'child',
      age: 10,
      avatar: '👦',
      assignedTicketId: 'T-000182',
      clothingDescription: 'قميص أزرق جينز وبنطال رمادي وحذاء رياضي أبيض',
      lastActivity: {
        locationName: 'عجلة بانوراما العملاقة (لعبة #2)',
        locationId: 'attr-2',
        timestamp: '21:03',
        type: 'ride'
      }
    },
    {
      id: 'mem-4',
      name: 'سارة',
      relation: 'child',
      age: 7,
      avatar: '👧',
      assignedTicketId: 'T-000183',
      clothingDescription: 'فستان أصفر وحذاء وردي وربطة شعر بيضاء',
      lastActivity: {
        locationName: 'عالم الصغار التفاعلي (لعبة #4)',
        locationId: 'attr-4',
        timestamp: '20:50',
        type: 'ride'
      }
    },
    {
      id: 'mem-5',
      name: 'فيصل',
      relation: 'child',
      age: 4,
      avatar: '🧒',
      assignedTicketId: 'T-000184',
      clothingDescription: 'تيشيرت أحمر عليه رسمة كرتونية وقبعة كحلي',
      lastActivity: {
        locationName: 'عالم الصغار التفاعلي (لعبة #4)',
        locationId: 'attr-4',
        timestamp: '20:50',
        type: 'ride'
      }
    }
  ]
};

export const INITIAL_TICKETS: Ticket[] = [
  {
    id: 'T-000180',
    visitorId: 'V-123765',
    familyMemberId: 'mem-1',
    status: 'VALIDATED',
    ticketType: 'single_ride',
    isPhysicalPaper: false,
    createdAt: '2026-08-29 19:45',
    validatedAt: '2026-08-29 20:00',
    signatureToken: generateSignature('T-000180:V-123765')
  },
  {
    id: 'T-000181',
    visitorId: 'V-123765',
    familyMemberId: 'mem-2',
    status: 'VALIDATED',
    ticketType: 'single_ride',
    isPhysicalPaper: false,
    createdAt: '2026-08-29 19:45',
    validatedAt: '2026-08-29 20:00',
    signatureToken: generateSignature('T-000181:V-123765')
  },
  {
    id: 'T-000182',
    visitorId: 'V-123765',
    familyMemberId: 'mem-3',
    status: 'AVAILABLE',
    ticketType: 'single_ride',
    isPhysicalPaper: true,
    paperSerialNumber: 'PAPER-SRF-000182',
    createdAt: '2026-08-29 19:45',
    signatureToken: generateSignature('T-000182:V-123765')
  },
  {
    id: 'T-000183',
    visitorId: 'V-123765',
    familyMemberId: 'mem-4',
    status: 'AVAILABLE',
    ticketType: 'single_ride',
    isPhysicalPaper: true,
    paperSerialNumber: 'PAPER-SRF-000183',
    createdAt: '2026-08-29 19:45',
    signatureToken: generateSignature('T-000183:V-123765')
  },
  {
    id: 'T-000184',
    visitorId: 'V-123765',
    familyMemberId: 'mem-5',
    status: 'AVAILABLE',
    ticketType: 'single_ride',
    isPhysicalPaper: true,
    paperSerialNumber: 'PAPER-SRF-000184',
    createdAt: '2026-08-29 19:45',
    signatureToken: generateSignature('T-000184:V-123765')
  },
  {
    id: 'T-000185',
    visitorId: 'V-123765',
    status: 'AVAILABLE',
    ticketType: 'single_ride',
    isPhysicalPaper: false,
    createdAt: '2026-08-29 19:45',
    signatureToken: generateSignature('T-000185:V-123765')
  }
];

export const INITIAL_EMPLOYEES: Employee[] = [
  {
    id: 'EMP-017',
    name: 'سلطان الشمري',
    role: 'cashier',
    roleTitleAr: 'كاشير مبيعات وتذاكر (نقطة 3)',
    assignedStation: 'كاشير البوابة الشمالية',
    offlineInventoryAllocated: 1000,
    offlineInventoryRemaining: 980,
    todayTransactionsCount: 84
  },
  {
    id: 'EMP-004',
    name: 'فيصل الحربي',
    role: 'gate_staff',
    roleTitleAr: 'مراقب بوابة الدخول',
    assignedStation: 'البوابة الرئيسية A',
    offlineInventoryAllocated: 500,
    offlineInventoryRemaining: 500,
    todayTransactionsCount: 230
  },
  {
    id: 'EMP-009',
    name: 'عبدالله القحطاني',
    role: 'attraction_staff',
    roleTitleAr: 'مشغل ألعاب (عجلة بانوراما)',
    assignedStation: 'لعبة عجلة بانوراما (#2)',
    offlineInventoryAllocated: 0,
    offlineInventoryRemaining: 0,
    todayTransactionsCount: 165
  },
  {
    id: 'EMP-002',
    name: 'النقيب ماجد العتيبي',
    role: 'security',
    roleTitleAr: 'مسؤول غرفة التحكم والأمن والسلامة',
    assignedStation: 'غرفة الأمن المركزية',
    offlineInventoryAllocated: 0,
    offlineInventoryRemaining: 0,
    todayTransactionsCount: 12
  }
];

export const INITIAL_EVENTS: ParkEvent[] = [
  {
    id: 'EVT-1001',
    timestamp: '2026-08-29 19:40:12',
    eventType: 'UNIT_PURCHASE',
    visitorId: 'V-123765',
    visitorName: 'أبو سالم',
    unitsAmount: 500,
    amountSAR: 100,
    employeeId: 'EMP-017',
    employeeName: 'سلطان الشمري',
    validationMode: 'ONLINE',
    status: 'SUCCESS',
    notes: 'شراء 500 وحدة عبر تطبيق الدفع السريع - كاشير 3',
    signatureHash: 'SRF-HASH-001'
  },
  {
    id: 'EVT-1002',
    timestamp: '2026-08-29 19:45:00',
    eventType: 'TICKET_PURCHASE',
    visitorId: 'V-123765',
    visitorName: 'أبو سالم',
    ticketId: 'T-000180..185',
    unitsAmount: 150,
    validationMode: 'ONLINE',
    status: 'SUCCESS',
    notes: 'شراء 6 تذاكر بالوحدات للعائلة (25 وحدة لكل تذكرة)',
    signatureHash: 'SRF-HASH-002'
  },
  {
    id: 'EVT-1003',
    timestamp: '2026-08-29 20:00:15',
    eventType: 'GATE_ENTRY',
    visitorId: 'V-123765',
    visitorName: 'أبو سالم',
    ticketId: 'T-000180',
    familyMemberName: 'محمد السالم (الأب)',
    employeeId: 'EMP-004',
    employeeName: 'فيصل الحربي',
    validationMode: 'ONLINE',
    status: 'SUCCESS',
    notes: 'دخول ناجح عبر البوابة الرئيسية A',
    signatureHash: 'SRF-HASH-003'
  },
  {
    id: 'EVT-1004',
    timestamp: '2026-08-29 20:12:30',
    eventType: 'RIDE_USAGE',
    visitorId: 'V-123765',
    visitorName: 'أبو سالم',
    familyMemberName: 'أحمد',
    attractionId: 'attr-4',
    attractionName: 'عالم الصغار التفاعلي',
    unitsAmount: 5,
    employeeId: 'EMP-009',
    employeeName: 'عبدالله القحطاني',
    validationMode: 'ONLINE',
    status: 'SUCCESS',
    notes: 'استخدام لعبة عالم الصغار للطفل أحمد',
    signatureHash: 'SRF-HASH-004'
  },
  {
    id: 'EVT-1005',
    timestamp: '2026-08-29 20:41:10',
    eventType: 'RIDE_USAGE',
    visitorId: 'V-123765',
    visitorName: 'أبو سالم',
    familyMemberName: 'أحمد',
    attractionId: 'attr-3',
    attractionName: 'سيارات التصادم الكهربائية',
    unitsAmount: 8,
    employeeId: 'EMP-009',
    employeeName: 'عبدالله القحطاني',
    validationMode: 'ONLINE',
    status: 'SUCCESS',
    notes: 'استخدام سيارات التصادم للطفل أحمد',
    signatureHash: 'SRF-HASH-005'
  },
  {
    id: 'EVT-1006',
    timestamp: '2026-08-29 21:03:45',
    eventType: 'RIDE_USAGE',
    visitorId: 'V-123765',
    visitorName: 'أبو سالم',
    familyMemberName: 'أحمد',
    attractionId: 'attr-2',
    attractionName: 'عجلة بانوراما العملاقة',
    ticketId: 'T-000182',
    unitsAmount: 10,
    employeeId: 'EMP-009',
    employeeName: 'عبدالله القحطاني',
    validationMode: 'ONLINE',
    status: 'SUCCESS',
    notes: 'آخر نشاط مسجل للطفل أحمد على عجلة بانوراما',
    signatureHash: 'SRF-HASH-006'
  }
];

export const INITIAL_MISSING_ALERTS: MissingPersonAlert[] = [];

export const INITIAL_WEATHER: import('../types').WeatherStatus = {
  condition: 'perfect',
  temperatureC: 28,
  windSpeedKmH: 12,
  titleAr: 'طقس مثالي ومشمس ☀️',
  descriptionAr: 'الأجواء معتدلة ومثالية لجميع ألعاب الحصن الخارجية والمنزلقات المائية.',
  outdoorRidesStatus: 'ALL_OPEN',
  lastUpdatedTime: '2026-08-29 21:00'
};

export const INITIAL_NOTIFICATIONS: import('../types').SmartNotification[] = [
  {
    id: 'notif-1',
    titleAr: '⚡ شاغر فوري في قطار الموت السريع!',
    messageAr: 'انخفض وقت الانتظار إلى 3 دقائق فقط! توجد مقاعد شاغرة للركوب الفوري الآن.',
    type: 'RIDE_VACANCY',
    timestamp: '21:05',
    read: false,
    targetAttractionId: 'attr-1',
    urgency: 'high',
    iconType: 'coaster'
  },
  {
    id: 'notif-2',
    titleAr: '☀️ طقس المساء المنعش في الحديقة',
    messageAr: 'درجة الحرارة 28°C وسرعة الرياح هادئة 12 كم/س. جميع المغامرات تعمل بكامل طاقتها.',
    type: 'WEATHER_ALERT',
    timestamp: '20:50',
    read: false,
    urgency: 'low',
    iconType: 'weather'
  },
  {
    id: 'notif-3',
    titleAr: '🏎️ سيارات التصادم: مسار سباق حر متاح',
    messageAr: 'حلبة سيارات التصادم جاهزة مع 8 سيارات شاغرة للدخول السريع بدون طوابير.',
    type: 'RIDE_VACANCY',
    timestamp: '20:30',
    read: true,
    targetAttractionId: 'attr-3',
    urgency: 'medium',
    iconType: 'coaster'
  }
];

export const INITIAL_ACHIEVEMENTS: import('../types').Achievement[] = [
  {
    id: 'ach-first-units',
    titleAr: '💰 سيد العملات الذهبية',
    descriptionAr: 'شحن رصيد الوحدات لأول مرة في حساب العائلة لتشغيل المغامرات.',
    category: 'units',
    icon: '🪙',
    rewardUnits: 20,
    unlocked: true,
    unlockedAt: '2026-08-29 19:40'
  },
  {
    id: 'ach-master-tickets',
    titleAr: '🎟️ قائد التذاكر الذكية',
    descriptionAr: 'شراء حزمة تذاكر وتوزيعها على أفراد العائلة أو طباعتها بالكاشير.',
    category: 'tickets',
    icon: '🎫',
    rewardUnits: 25,
    unlocked: true,
    unlockedAt: '2026-08-29 19:55'
  },
  {
    id: 'ach-castle-entrance',
    titleAr: '🏰 فاتح بوابات قلعة الحصن',
    descriptionAr: 'مسح رمز دخول البوابة والدخول بنجاح مع أفراد العائلة.',
    category: 'explorer',
    icon: '🏯',
    rewardUnits: 30,
    unlocked: true,
    unlockedAt: '2026-08-29 20:00'
  },
  {
    id: 'ach-coaster-conqueror',
    titleAr: '🎢 قاهر قطار الموت والمغامرات',
    descriptionAr: 'ركوب لعبة قطار الموت السريع أو الألعاب الحماسية وتوثيقها بالسجل.',
    category: 'rides',
    icon: '🚀',
    rewardUnits: 50,
    unlocked: false
  },
  {
    id: 'ach-family-shield',
    titleAr: '🛡️ حارس أمان العائلة',
    descriptionAr: 'ربط أفراد العائلة وتفعيل مراقبة سجل آخر نشاط للأطفال.',
    category: 'safety',
    icon: '👨‍👩‍👧‍👦',
    rewardUnits: 35,
    unlocked: true,
    unlockedAt: '2026-08-29 20:10'
  },
  {
    id: 'ach-grand-master',
    titleAr: '🏆 أسطورة قلعة تاكيشي الملكية',
    descriptionAr: 'إكمال جميع المراحل الخمس والتنقل عبر خريطة الحصن التفاعلية.',
    category: 'explorer',
    icon: '👑',
    rewardUnits: 100,
    unlocked: false
  }
];

