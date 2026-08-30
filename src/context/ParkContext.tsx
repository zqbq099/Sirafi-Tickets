import React, { createContext, useContext, useState, useEffect, useMemo } from 'react';
import { 
  Achievement,
  AppTheme,
  Attraction, 
  Employee, 
  MissingPersonAlert, 
  OfflineSyncItem, 
  ParkEvent, 
  SmartNotification,
  ThemeOption,
  Ticket, 
  UserRole, 
  Visitor,
  WeatherStatus 
} from '../types';

export const THEME_OPTIONS: ThemeOption[] = [
  {
    id: 'joyful_wonderland',
    nameAr: 'مدينة الألعاب والبهجة',
    nameEn: 'Joyful Wonderland & Playground',
    descriptionAr: 'ثيم الحدائق والملاهي المبهج بألوان فاتحة زاهية وأزرار ثلاثية الأبعاد تنبض بالحيوية والمرح للأطفال والعائلات.',
    badge: 'الأكثر بهجة ومرحاً 🎡',
    icon: 'Sparkles',
    previewColors: ['#fef3c7', '#38bdf8', '#fb7185', '#34d399'],
    isDark: false
  },
  {
    id: 'candy_carnival',
    nameAr: 'عالم الحلوى والكرنفال',
    nameEn: 'Candy Carnival Pops',
    descriptionAr: 'ألوان كاندي مشرقة ومبهجة بنكهة الفراولة والكراميل والسماء الزرقاء المنعشة مع خطوط عريضة لطيفة.',
    badge: 'حلوى وكرنفال 🍭',
    icon: 'Sun',
    previewColors: ['#fff1f2', '#f43f5e', '#ec4899', '#06b6d4'],
    isDark: false
  },
  {
    id: 'sunny_adventure',
    nameAr: 'مغامرة شمس الحصن',
    nameEn: 'Sunny Adventure & Quest',
    descriptionAr: 'طابع مشمس مفعم بالطاقة والحيوية بدرجات البرتقالي المنعش والأصفر الدافئ وأزرق الشلالات المائية.',
    badge: 'شمس ومغامرة ☀️',
    icon: 'Sun',
    previewColors: ['#fffbeb', '#f59e0b', '#fb923c', '#0284c7'],
    isDark: false
  },
  {
    id: 'magic_fantasy',
    nameAr: 'مملكة الخيال والمرح',
    nameEn: 'Magic Fantasy Kingdom',
    descriptionAr: 'أجواء سحرية حالمة بلمسات اللافندر الناعمة، والبنفسجي الباستيل، والنجوم الذهبية البراقة.',
    badge: 'خيال وسحر 🦄',
    icon: 'Sparkles',
    previewColors: ['#faf5ff', '#a855f7', '#ec4899', '#fbbf24'],
    isDark: false
  },
  {
    id: 'emerald_park',
    nameAr: 'واحة الحديقة المنعشة',
    nameEn: 'Fresh Emerald Garden',
    descriptionAr: 'أجواء طبيعية نضرة بألوان الأعشاب والواحات الخضراء والبحيرات الصافية لتجربة نهارية مريحة وفخمة.',
    badge: 'طبيعة وواحة 🌿',
    icon: 'Palmtree',
    previewColors: ['#f0fdf4', '#10b981', '#059669', '#3b82f6'],
    isDark: false
  },
  {
    id: 'night_carnival',
    nameAr: 'كرنفال الأضواء الليلي',
    nameEn: 'Festive Lights Night',
    descriptionAr: 'أجواء المهرجانات والألعاب ليلاً مع إضاءات احتفالية ملونة لمن يفضل المظهر الليلي الغني بالألوان.',
    badge: 'أضواء ليلية 🎆',
    icon: 'Moon',
    previewColors: ['#0f172a', '#3b82f6', '#f43f5e', '#fbbf24'],
    isDark: true
  }
];
import { 
  INITIAL_ACHIEVEMENTS,
  INITIAL_ATTRACTIONS, 
  INITIAL_EMPLOYEES, 
  INITIAL_EVENTS, 
  INITIAL_MISSING_ALERTS, 
  INITIAL_NOTIFICATIONS,
  INITIAL_TICKETS, 
  INITIAL_VISITOR, 
  INITIAL_WEATHER
} from '../utils/mockData';
import { decodeAndVerifyQR, encodeQRPayload, generateNonce, generateSignature, sound } from '../utils/crypto';
import { triggerCelebrationConfetti, triggerGrandCelebration } from '../components/common/AchievementBadge';
import { offlineStorageEngine } from '../utils/offlineStorageEngine';

interface QRModalState {
  isOpen: boolean;
  title: string;
  qrData: string;
  qrType: string;
  expiresSec?: number;
  subtitle?: string;
}

interface ScannerModalState {
  isOpen: boolean;
  title: string;
  targetAction: string;
  targetAttractionId?: string;
  onScanSuccess: (data: string) => void;
}

interface ThermalTicketModalState {
  isOpen: boolean;
  tickets: Ticket[];
  buyerName: string;
  buyerId: string;
  totalUnits: number;
}

interface ValidationResult {
  success: boolean;
  title: string;
  message: string;
  details?: {
    ticketId?: string;
    visitorName?: string;
    familyMemberName?: string;
    remainingUnits?: number;
    mode: 'ONLINE' | 'OFFLINE';
  };
}

interface ParkContextType {
  isOnline: boolean;
  toggleNetworkMode: () => void;
  currentRole: UserRole;
  setCurrentRole: (role: UserRole) => void;
  visitor: Visitor;
  tickets: Ticket[];
  attractions: Attraction[];
  events: ParkEvent[];
  employees: Employee[];
  missingAlerts: MissingPersonAlert[];
  offlineSyncQueue: OfflineSyncItem[];
  
  // Theme & Appearance
  theme: AppTheme;
  setTheme: (theme: AppTheme) => void;
  isThemeModalOpen: boolean;
  openThemeModal: () => void;
  closeThemeModal: () => void;

  // Smart Notifications & Weather Alert System
  notifications: SmartNotification[];
  dismissNotification: (id: string) => void;
  addNotification: (notif: Omit<SmartNotification, 'id' | 'timestamp' | 'read'>) => void;
  weather: WeatherStatus;
  simulateWeatherChange: (condition: WeatherStatus['condition']) => void;
  simulateRideVacancyNotification: (attractionId?: string) => void;

  // Achievements & Badges (with Confetti)
  achievements: Achievement[];
  activeAchievementPopup: Achievement | null;
  setActiveAchievementPopup: (ach: Achievement | null) => void;
  isAchievementsModalOpen: boolean;
  openAchievementsModal: () => void;
  closeAchievementsModal: () => void;
  unlockAchievement: (id: string) => void;

  // Game Stage Navigation (Quest Deck)
  visitorGameStage: number; // 1 to 5
  setVisitorGameStage: (stage: number) => void;
  nextVisitorGameStage: () => void;
  prevVisitorGameStage: () => void;
  visitorNavMode: 'game_stages' | 'all_cards';
  setVisitorNavMode: (mode: 'game_stages' | 'all_cards') => void;

  // Modals
  qrModal: QRModalState;
  showQRModal: (opts: Omit<QRModalState, 'isOpen'>) => void;
  hideQRModal: () => void;
  
  scannerModal: ScannerModalState;
  openScannerModal: (opts: Omit<ScannerModalState, 'isOpen'>) => void;
  closeScannerModal: () => void;
  
  thermalModal: ThermalTicketModalState;
  showThermalTickets: (opts: Omit<ThermalTicketModalState, 'isOpen'>) => void;
  closeThermalModal: () => void;

  // Castle Interactive Map & Onboarding Walkthrough
  isCastleMapOpen: boolean;
  openCastleMap: (attractionId?: string) => void;
  closeCastleMap: () => void;
  selectedMapAttractionId: string | null;
  setSelectedMapAttractionId: (id: string | null) => void;
  
  isOnboardingOpen: boolean;
  openOnboarding: () => void;
  closeOnboarding: () => void;
  simulateFamilyMemberMove: (memberId: string, locationId: string, locationName: string) => void;

  // Actions
  buyUnits: (amountSAR: number, paymentMethod?: string) => void;
  buyTicketsWithUnits: (count: number, isPhysicalPaper?: boolean) => Ticket[];
  anonymousCashSale: (count: number, amountSAR: number, employeeId: string) => Ticket[];
  bindPreprintedRange: (startNum: number, endNum: number, visitorId: string, employeeId: string) => { success: boolean; message: string; count: number };
  assignTicketToMember: (ticketId: string, memberId: string) => void;
  validateGateEntry: (qrOrTicketRaw: string, gateStation: string, employeeId: string) => ValidationResult;
  consumeRideAction: (attractionId: string, qrOrTicketRaw: string, employeeId: string) => ValidationResult;
  transferTicketToVisitor: (ticketId: string, targetVisitorId: string) => boolean;
  
  // Safety
  reportMissingChild: (memberId: string, clothingDesc: string, extraNotes?: string) => MissingPersonAlert;
  resolveMissingAlert: (alertId: string, officerName: string, notes: string) => void;
  toggleFreezeAttraction: (attractionId: string, reason?: string) => void;
  adjustSafetyStaff: (attractionId: string, delta: number) => void;
  broadcastSecurityUrgentAlert: (params: { titleAr: string; messageAr: string; targetAttractionId?: string; urgency: 'high' | 'medium' | 'low'; iconType?: string }) => void;
  activePublicMissingAlert: MissingPersonAlert | null;
  isPublicMissingBannerDismissed: boolean;
  dismissPublicMissingBanner: () => void;
  restorePublicMissingBanner: () => void;

  // Tests & Sync
  syncOfflineQueueManually: () => void;
  testReplayAttack: () => ValidationResult;
  resetToInitialDemoState: () => void;
}

const ParkContext = createContext<ParkContextType | null>(null);

const STORAGE_KEYS = {
  THEME: 'sirafi_theme_v1',
  VISITOR: 'sirafi_visitor_v1',
  TICKETS: 'sirafi_tickets_v1',
  ATTRACTIONS: 'sirafi_attractions_v1',
  EVENTS: 'sirafi_events_v1',
  ALERTS: 'sirafi_alerts_v1',
  EMPLOYEES: 'sirafi_employees_v1',
  SYNC_QUEUE: 'sirafi_sync_queue_v1',
  SPENT_NONCES: 'sirafi_spent_nonces_v1',
  ONBOARDING: 'sirafi_onboarding_completed_v2',
  NOTIFICATIONS: 'sirafi_notifications_v1',
  WEATHER: 'sirafi_weather_v1',
  ACHIEVEMENTS: 'sirafi_achievements_v1'
};

export const ParkProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [theme, setThemeState] = useState<AppTheme>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.THEME);
    return (saved as AppTheme) || 'joyful_wonderland';
  });
  const [isThemeModalOpen, setIsThemeModalOpen] = useState<boolean>(false);

  // Game Stage Navigation (Quest Mode)
  const [visitorGameStage, setVisitorGameStageState] = useState<number>(1);
  const [visitorNavMode, setVisitorNavModeState] = useState<'game_stages' | 'all_cards'>('game_stages');

  const setVisitorGameStage = (stage: number) => {
    setVisitorGameStageState(stage);
    sound.playStageSwipe();
  };

  const nextVisitorGameStage = () => {
    setVisitorGameStageState(prev => {
      const next = prev < 5 ? prev + 1 : 1;
      sound.playLevelUp();
      return next;
    });
  };

  const prevVisitorGameStage = () => {
    setVisitorGameStageState(prev => {
      const prevStage = prev > 1 ? prev - 1 : 5;
      sound.playStageSwipe();
      return prevStage;
    });
  };

  const setVisitorNavMode = (mode: 'game_stages' | 'all_cards') => {
    setVisitorNavModeState(mode);
    sound.playPop();
  };

  const setTheme = (newTheme: AppTheme) => {
    setThemeState(newTheme);
    localStorage.setItem(STORAGE_KEYS.THEME, newTheme);
    sound.playSuccess();
  };

  const openThemeModal = () => setIsThemeModalOpen(true);
  const closeThemeModal = () => setIsThemeModalOpen(false);

  const [isOnline, setIsOnline] = useState<boolean>(true);
  const [currentRole, setCurrentRole] = useState<UserRole>('visitor');

  const [visitor, setVisitor] = useState<Visitor>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.VISITOR);
    return saved ? JSON.parse(saved) : INITIAL_VISITOR;
  });

  const [tickets, setTickets] = useState<Ticket[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.TICKETS);
    return saved ? JSON.parse(saved) : INITIAL_TICKETS;
  });

  const [attractions, setAttractions] = useState<Attraction[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.ATTRACTIONS);
    return saved ? JSON.parse(saved) : INITIAL_ATTRACTIONS;
  });

  const [events, setEvents] = useState<ParkEvent[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.EVENTS);
    return saved ? JSON.parse(saved) : INITIAL_EVENTS;
  });

  const [employees, setEmployees] = useState<Employee[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.EMPLOYEES);
    return saved ? JSON.parse(saved) : INITIAL_EMPLOYEES;
  });

  const [missingAlerts, setMissingAlerts] = useState<MissingPersonAlert[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.ALERTS);
    return saved ? JSON.parse(saved) : INITIAL_MISSING_ALERTS;
  });

  const [offlineSyncQueue, setOfflineSyncQueue] = useState<OfflineSyncItem[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.SYNC_QUEUE);
    return saved ? JSON.parse(saved) : [];
  });

  const [spentNonces, setSpentNonces] = useState<string[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.SPENT_NONCES);
    return saved ? JSON.parse(saved) : [];
  });

  // Notifications State
  const [notifications, setNotifications] = useState<SmartNotification[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.NOTIFICATIONS);
    return saved ? JSON.parse(saved) : INITIAL_NOTIFICATIONS;
  });

  const dismissNotification = (id: string) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
    sound.playPop();
  };

  const addNotification = (notif: Omit<SmartNotification, 'id' | 'timestamp' | 'read'>) => {
    const nowStr = new Date().toISOString().replace('T', ' ').substring(11, 16);
    const newNotif: SmartNotification = {
      ...notif,
      id: `notif-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      timestamp: nowStr,
      read: false
    };
    setNotifications(prev => [newNotif, ...prev]);
    sound.playLevelUp();
  };

  // Weather State & Simulation
  const [weather, setWeather] = useState<WeatherStatus>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.WEATHER);
    return saved ? JSON.parse(saved) : INITIAL_WEATHER;
  });

  const simulateWeatherChange = (condition: WeatherStatus['condition']) => {
    const nowHHMM = new Date().toISOString().replace('T', ' ').substring(11, 16);
    let updated: WeatherStatus;

    if (condition === 'rainy') {
      updated = {
        condition: 'rainy',
        temperatureC: 22,
        windSpeedKmH: 24,
        titleAr: 'تنبيه هطول أمطار ورذاذ 🌧️',
        descriptionAr: 'رذاذ خفيف في أرجاء الحديقة. الألعاب المغطاة والمائية تعمل كالمعتاد.',
        outdoorRidesStatus: 'PARTIAL_CHECKS',
        lastUpdatedTime: nowHHMM
      };
      addNotification({
        type: 'WEATHER_ALERT',
        titleAr: '🌧️ تنبيه رذاذ مطري منعش',
        messageAr: 'بدء تساقط رذاذ لطيف. تم تفعيل المظلات وتستمر جميع الألعاب المغطاة كالمعتاد!',
        urgency: 'medium',
        iconType: 'weather'
      });
    } else if (condition === 'windy') {
      updated = {
        condition: 'windy',
        temperatureC: 26,
        windSpeedKmH: 38,
        titleAr: 'تنبيه سرعة الرياح 💨',
        descriptionAr: 'نشاط في حركة الرياح. برج السقوط وعجلة الهواء تجري فحص السلامة المعتاد.',
        outdoorRidesStatus: 'CAUTION_HIGH_WINDS',
        lastUpdatedTime: nowHHMM
      };
      addNotification({
        type: 'WEATHER_ALERT',
        titleAr: '💨 فحص دوري للألعاب المرتفعة',
        messageAr: 'نشاط خفيف للرياح (38 كم/س). تجري فحص أمان لمدة 5 دقائق لألعاب الارتفاع.',
        urgency: 'high',
        iconType: 'weather'
      });
    } else {
      updated = {
        condition: 'perfect',
        temperatureC: 28,
        windSpeedKmH: 12,
        titleAr: 'طقس مشمس ورائع ☀️',
        descriptionAr: 'الأجواء منعشة وصافية تماماً! كافة الألعاب والمغامرات مفتوحة ومتاحة بدون أي قيود.',
        outdoorRidesStatus: 'ALL_OPEN',
        lastUpdatedTime: nowHHMM
      };
      addNotification({
        type: 'WEATHER_ALERT',
        titleAr: '☀️ سماء صافية وطقس ذهبي',
        messageAr: 'الطقس مثالي جداً الآن (28°C). جميع المغامرات والألعاب المائية تعمل بكامل طاقتها!',
        urgency: 'low',
        iconType: 'weather'
      });
    }

    setWeather(updated);
    localStorage.setItem(STORAGE_KEYS.WEATHER, JSON.stringify(updated));
    sound.playLevelUp();
  };

  const simulateRideVacancyNotification = (targetAttractionId?: string) => {
    const attr = attractions.find(a => a.id === targetAttractionId) || attractions[0];
    addNotification({
      type: 'RIDE_VACANCY',
      titleAr: `⚡ شاغر فوري: ${attr.nameAr}!`,
      messageAr: `انخفض وقت الانتظار إلى دقيقتين فقط في ${attr.nameAr}! مقاعد شاغرة للدخول الفوري.`,
      urgency: 'high',
      targetAttractionId: attr.id,
      iconType: 'coaster'
    });
    sound.playCastleFanfare();
  };

  // Achievements State
  const [achievements, setAchievements] = useState<Achievement[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.ACHIEVEMENTS);
    return saved ? JSON.parse(saved) : INITIAL_ACHIEVEMENTS;
  });

  const [activeAchievementPopup, setActiveAchievementPopup] = useState<Achievement | null>(null);
  const [isAchievementsModalOpen, setIsAchievementsModalOpen] = useState<boolean>(false);

  const openAchievementsModal = () => {
    setIsAchievementsModalOpen(true);
    sound.playLevelUp();
  };

  const closeAchievementsModal = () => {
    setIsAchievementsModalOpen(false);
  };

  const unlockAchievement = (id: string) => {
    setAchievements(prev => {
      const target = prev.find(a => a.id === id);
      if (!target || target.unlocked) return prev;

      const nowStr = new Date().toISOString().replace('T', ' ').substring(0, 16);
      const updatedAch: Achievement = {
        ...target,
        unlocked: true,
        unlockedAt: nowStr
      };

      // Trigger Confetti & Sound
      triggerCelebrationConfetti();
      sound.playLevelUp();
      setActiveAchievementPopup(updatedAch);

      // Add Notification
      addNotification({
        type: 'ACHIEVEMENT_UNLOCKED',
        titleAr: `🏆 وسام جديد: ${updatedAch.titleAr}!`,
        messageAr: `${updatedAch.descriptionAr} (+${updatedAch.rewardUnits} وحدة مكافأة مجانية!)`,
        urgency: 'medium',
        iconType: 'trophy'
      });

      // Reward units to visitor
      setVisitor(v => ({
        ...v,
        unitsBalance: v.unitsBalance + updatedAch.rewardUnits
      }));

      const newAchievements = prev.map(a => a.id === id ? updatedAch : a);
      localStorage.setItem(STORAGE_KEYS.ACHIEVEMENTS, JSON.stringify(newAchievements));
      return newAchievements;
    });
  };

  // Modal States
  const [qrModal, setQrModal] = useState<QRModalState>({
    isOpen: false,
    title: '',
    qrData: '',
    qrType: 'ENTRY_QR'
  });

  const [scannerModal, setScannerModal] = useState<ScannerModalState>({
    isOpen: false,
    title: '',
    targetAction: '',
    onScanSuccess: () => {}
  });

  const [thermalModal, setThermalModal] = useState<ThermalTicketModalState>({
    isOpen: false,
    tickets: [],
    buyerName: '',
    buyerId: '',
    totalUnits: 0
  });

  // Castle Map & Interactive Onboarding Walkthrough State
  const [isCastleMapOpen, setIsCastleMapOpen] = useState<boolean>(false);
  const [selectedMapAttractionId, setSelectedMapAttractionId] = useState<string | null>(null);
  
  const [isOnboardingOpen, setIsOnboardingOpen] = useState<boolean>(() => {
    const isDone = localStorage.getItem(STORAGE_KEYS.ONBOARDING);
    // Open by default on fresh visit for interactive onboarding guide
    return isDone !== 'true';
  });

  const openCastleMap = (attractionId?: string) => {
    if (attractionId) {
      setSelectedMapAttractionId(attractionId);
    }
    setIsCastleMapOpen(true);
    sound.playCastleFanfare();
  };

  const closeCastleMap = () => {
    setIsCastleMapOpen(false);
  };

  const openOnboarding = () => {
    setIsOnboardingOpen(true);
    sound.playCastleFanfare();
  };

  const closeOnboarding = () => {
    setIsOnboardingOpen(false);
    localStorage.setItem(STORAGE_KEYS.ONBOARDING, 'true');
    sound.playSuccess();
  };

  const simulateFamilyMemberMove = (memberId: string, locationId: string, locationName: string) => {
    const nowStr = new Date().toISOString().replace('T', ' ').substring(0, 19);
    const timeHHMM = nowStr.substring(11, 16);

    setVisitor(prev => ({
      ...prev,
      familyMembers: prev.familyMembers.map(m => {
        if (m.id === memberId) {
          return {
            ...m,
            lastActivity: {
              locationId,
              locationName,
              timestamp: timeHHMM,
              type: 'ride'
            }
          };
        }
        return m;
      })
    }));

    const member = visitor.familyMembers.find(m => m.id === memberId);
    logEvent({
      eventType: 'RIDE_USAGE',
      visitorId: visitor.id,
      visitorName: visitor.name,
      familyMemberName: member?.name || memberId,
      attractionId: locationId,
      attractionName: locationName,
      validationMode: isOnline ? 'ONLINE' : 'OFFLINE',
      status: 'SUCCESS',
      notes: `محاكاة انتقال الفرد (${member?.name}) إلى محطة (${locationName}) بخريطة الحصن.`
    });

    sound.playStepSound();
  };

  // Save to storage
  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.VISITOR, JSON.stringify(visitor));
  }, [visitor]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.TICKETS, JSON.stringify(tickets));
  }, [tickets]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.ATTRACTIONS, JSON.stringify(attractions));
  }, [attractions]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.EVENTS, JSON.stringify(events));
  }, [events]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.ALERTS, JSON.stringify(missingAlerts));
  }, [missingAlerts]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.EMPLOYEES, JSON.stringify(employees));
  }, [employees]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.SYNC_QUEUE, JSON.stringify(offlineSyncQueue));
  }, [offlineSyncQueue]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.SPENT_NONCES, JSON.stringify(spentNonces));
  }, [spentNonces]);

  // Deep Snapshot persistence to IndexedDB (Ensures zero data loss and persistent storage on Android)
  useEffect(() => {
    offlineStorageEngine.saveDeepSnapshot({
      timestamp: new Date().toISOString(),
      visitor,
      tickets,
      attractions,
      events,
      alerts: missingAlerts,
      employees,
      syncQueue: offlineSyncQueue,
      spentNonces,
      notifications,
      weather,
      achievements
    });
  }, [visitor, tickets, attractions, events, missingAlerts, employees, offlineSyncQueue, spentNonces, notifications, weather, achievements]);

  const logEvent = (eventData: Omit<ParkEvent, 'id' | 'timestamp' | 'signatureHash'>): ParkEvent => {
    const nowStr = new Date().toISOString().replace('T', ' ').substring(0, 19);
    const eventId = `EVT-${Math.floor(1000 + Math.random() * 9000)}`;
    const signatureHash = generateSignature(`${eventId}:${eventData.eventType}:${eventData.visitorId}:${nowStr}`);
    
    const newEvent: ParkEvent = {
      ...eventData,
      id: eventId,
      timestamp: nowStr,
      signatureHash
    };

    setEvents(prev => [newEvent, ...prev]);

    if (!isOnline) {
      const syncItem: OfflineSyncItem = {
        id: `SYNC-${eventId}`,
        event: newEvent,
        generatedAt: nowStr,
        deviceEmployeeId: eventData.employeeId || 'DEVICE-LOCAL',
        synced: false,
        syncAttempts: 0
      };
      setOfflineSyncQueue(prev => [syncItem, ...prev]);
    }

    return newEvent;
  };

  // Toggle Network Online / Offline with Auto Sync
  const toggleNetworkMode = () => {
    const nextMode = !isOnline;
    setIsOnline(nextMode);

    if (nextMode && offlineSyncQueue.length > 0) {
      // Auto commit offline queue when coming back online
      const pendingCount = offlineSyncQueue.length;
      setOfflineSyncQueue([]);
      logEvent({
        eventType: 'OFFLINE_SYNC_COMMITTED',
        visitorId: 'SYSTEM',
        visitorName: 'خادم المزامنة المركزي',
        validationMode: 'ONLINE',
        status: 'SUCCESS',
        notes: `تمت مزامنة (${pendingCount}) عملية معلقة كانت مسجلة في الوضع غير المتصل بنجاح ودون أي تعارض.`
      });
      sound.playSuccess();
    }
  };

  const syncOfflineQueueManually = () => {
    if (offlineSyncQueue.length === 0) return;
    const count = offlineSyncQueue.length;
    setOfflineSyncQueue([]);
    logEvent({
      eventType: 'OFFLINE_SYNC_COMMITTED',
      visitorId: 'SYSTEM',
      visitorName: 'خادم المزامنة اليدوية',
      validationMode: 'ONLINE',
      status: 'SUCCESS',
      notes: `تمت المزامنة اليدوية لعدد (${count}) حدث بنجاح.`
    });
    sound.playSuccess();
  };

  const showQRModal = (opts: Omit<QRModalState, 'isOpen'>) => {
    setQrModal({ ...opts, isOpen: true });
  };

  const hideQRModal = () => {
    setQrModal(prev => ({ ...prev, isOpen: false }));
  };

  const openScannerModal = (opts: Omit<ScannerModalState, 'isOpen'>) => {
    setScannerModal({ ...opts, isOpen: true });
  };

  const closeScannerModal = () => {
    setScannerModal(prev => ({ ...prev, isOpen: false }));
  };

  const showThermalTickets = (opts: Omit<ThermalTicketModalState, 'isOpen'>) => {
    setThermalModal({ ...opts, isOpen: true });
  };

  const closeThermalModal = () => {
    setThermalModal(prev => ({ ...prev, isOpen: false }));
  };

  // Buy Units (100 SAR = 500 units e.g. 5 units per 1 SAR)
  const buyUnits = (amountSAR: number, paymentMethod: string = 'Mada / Apple Pay') => {
    const unitsToAdd = amountSAR * 5;
    setVisitor(prev => ({
      ...prev,
      unitsBalance: prev.unitsBalance + unitsToAdd
    }));

    logEvent({
      eventType: 'UNIT_PURCHASE',
      visitorId: visitor.id,
      visitorName: visitor.name,
      unitsAmount: unitsToAdd,
      amountSAR,
      validationMode: isOnline ? 'ONLINE' : 'OFFLINE',
      status: 'SUCCESS',
      notes: `شراء ${unitsToAdd} وحدة بقيمة ${amountSAR} ريال (${paymentMethod})`
    });

    // Auto unlock achievement for buying units
    unlockAchievement('ach-first-units');

    sound.playSuccess();
  };

  // Buy Tickets with Units (25 units per ticket)
  const buyTicketsWithUnits = (count: number, isPhysicalPaper: boolean = false): Ticket[] => {
    const unitPricePerTicket = 25;
    const totalUnitsCost = count * unitPricePerTicket;

    if (visitor.unitsBalance < totalUnitsCost) {
      sound.playError();
      throw new Error(`رصيد الوحدات غير كافٍ. المطلوب: ${totalUnitsCost} وحدة، رصيدك الحالي: ${visitor.unitsBalance} وحدة.`);
    }

    // Deduct units
    setVisitor(prev => ({
      ...prev,
      unitsBalance: prev.unitsBalance - totalUnitsCost
    }));

    // Deduct from employee offline quota if offline
    if (!isOnline) {
      setEmployees(prev => prev.map(emp => {
        if (emp.role === 'cashier') {
          return {
            ...emp,
            offlineInventoryRemaining: Math.max(0, emp.offlineInventoryRemaining - count),
            todayTransactionsCount: emp.todayTransactionsCount + 1
          };
        }
        return emp;
      }));
    }

    const newTickets: Ticket[] = [];
    const nowStr = new Date().toISOString().replace('T', ' ').substring(0, 19);

    for (let i = 0; i < count; i++) {
      const randomSeq = Math.floor(100000 + Math.random() * 900000);
      const ticketId = `T-${randomSeq}`;
      const token = generateSignature(`${ticketId}:${visitor.id}:${nowStr}`);

      const newT: Ticket = {
        id: ticketId,
        visitorId: visitor.id,
        status: 'AVAILABLE',
        ticketType: 'single_ride',
        isPhysicalPaper,
        paperSerialNumber: isPhysicalPaper ? `PAPER-SRF-${randomSeq}` : undefined,
        createdAt: nowStr,
        signatureToken: token
      };
      newTickets.push(newT);
    }

    setTickets(prev => [...newTickets, ...prev]);

    logEvent({
      eventType: 'TICKET_PURCHASE',
      visitorId: visitor.id,
      visitorName: visitor.name,
      ticketId: newTickets.map(t => t.id).join(', '),
      unitsAmount: totalUnitsCost,
      validationMode: isOnline ? 'ONLINE' : 'OFFLINE',
      status: 'SUCCESS',
      notes: `شراء ${count} تذكرة بخصم ${totalUnitsCost} وحدة من حساب الزائر ${visitor.id} ${isPhysicalPaper ? '(طباعة ورقية)' : '(تذاكر رقمية)'}`
    });

    // Auto unlock achievement for buying tickets
    unlockAchievement('ach-master-tickets');

    sound.playSuccess();
    return newTickets;
  };

  // Anonymous Cash Sale at Cashier (Visitor without app/registration)
  const anonymousCashSale = (count: number, amountSAR: number, employeeId: string): Ticket[] => {
    const newTickets: Ticket[] = [];
    const nowStr = new Date().toISOString().replace('T', ' ').substring(0, 19);

    for (let i = 0; i < count; i++) {
      const randomSeq = Math.floor(100000 + Math.random() * 900000);
      const ticketId = `T-${randomSeq}`;
      const token = generateSignature(`${ticketId}:ANONYMOUS:${nowStr}`);

      const newT: Ticket = {
        id: ticketId,
        visitorId: 'ANONYMOUS',
        status: 'AVAILABLE',
        ticketType: 'single_ride',
        isPhysicalPaper: true,
        paperSerialNumber: `PAPER-ANON-${randomSeq}`,
        createdAt: nowStr,
        signatureToken: token
      };
      newTickets.push(newT);
    }

    setTickets(prev => [...newTickets, ...prev]);

    // Update cashier stats
    setEmployees(prev => prev.map(emp => {
      if (emp.id === employeeId || emp.role === 'cashier') {
        return {
          ...emp,
          offlineInventoryRemaining: Math.max(0, emp.offlineInventoryRemaining - count),
          todayTransactionsCount: emp.todayTransactionsCount + 1
        };
      }
      return emp;
    }));

    logEvent({
      eventType: 'ANONYMOUS_SALE',
      visitorId: 'ANONYMOUS',
      visitorName: 'زائر نقدي (غير مسجل)',
      ticketId: newTickets.map(t => t.id).join(', '),
      amountSAR,
      employeeId,
      employeeName: employees.find(e => e.id === employeeId)?.name || 'الكاشير',
      validationMode: isOnline ? 'ONLINE' : 'OFFLINE',
      status: 'SUCCESS',
      notes: `بيع نقدي تقليدي لعدد ${count} تذكرة ورقية مجهولة الهوية بمبلغ ${amountSAR} ريال`
    });

    sound.playSuccess();
    return newTickets;
  };

  // Bind Pre-Printed Ticket Batch Range (e.g. 001 - 020) to Visitor
  const bindPreprintedRange = (startNum: number, endNum: number, visitorId: string, employeeId: string) => {
    if (startNum > endNum) {
      return { success: false, message: 'نطاق الأرقام غير صالح', count: 0 };
    }
    const count = endNum - startNum + 1;
    const nowStr = new Date().toISOString().replace('T', ' ').substring(0, 19);
    const newBoundTickets: Ticket[] = [];

    for (let seq = startNum; seq <= endNum; seq++) {
      const paddedSeq = seq.toString().padStart(6, '0');
      const ticketId = `T-${paddedSeq}`;
      const token = generateSignature(`${ticketId}:${visitorId}:${nowStr}`);

      const newT: Ticket = {
        id: ticketId,
        visitorId,
        status: 'AVAILABLE',
        ticketType: 'single_ride',
        isPhysicalPaper: true,
        paperSerialNumber: `ROLL-SRF-${paddedSeq}`,
        createdAt: nowStr,
        signatureToken: token
      };
      newBoundTickets.push(newT);
    }

    setTickets(prev => {
      // Remove any previous conflicting ids and add new
      const filtered = prev.filter(t => !newBoundTickets.some(n => n.id === t.id));
      return [...newBoundTickets, ...filtered];
    });

    logEvent({
      eventType: 'PREPRINTED_LINK',
      visitorId,
      visitorName: visitor.id === visitorId ? visitor.name : visitorId,
      ticketId: `T-${startNum.toString().padStart(6, '0')}..${endNum.toString().padStart(6, '0')}`,
      employeeId,
      employeeName: employees.find(e => e.id === employeeId)?.name || 'الموظف',
      validationMode: isOnline ? 'ONLINE' : 'OFFLINE',
      status: 'SUCCESS',
      notes: `ربط حزمة تذاكر مطبوعة مسبقاً (${count} تذكرة) بالحساب ${visitorId} دون إعادة طباعة`
    });

    sound.playSuccess();
    return { success: true, message: `تم بنجاح ربط ${count} تذكرة مطبوعة بالحساب ${visitorId}`, count };
  };

  // Assign Ticket to a Family Member
  const assignTicketToMember = (ticketId: string, memberId: string) => {
    setTickets(prev => prev.map(t => {
      if (t.id === ticketId) {
        return { ...t, familyMemberId: memberId };
      }
      return t;
    }));

    setVisitor(prev => ({
      ...prev,
      familyMembers: prev.familyMembers.map(m => {
        if (m.id === memberId) {
          return { ...m, assignedTicketId: ticketId };
        }
        return m;
      })
    }));

    sound.playSuccess();
  };

  // Gate Entry Validation (Instant pass/fail with anti double-spend)
  const validateGateEntry = (qrOrTicketRaw: string, gateStation: string, employeeId: string): ValidationResult => {
    let ticketId = qrOrTicketRaw.trim();
    let qrVisitorId = '';
    let nonce = '';
    let familyMemberId = '';

    // Check if raw text is a JSON QR
    if (ticketId.startsWith('{')) {
      const decoded = decodeAndVerifyQR(ticketId);
      if (!decoded.valid || !decoded.payload) {
        sound.playError();
        logEvent({
          eventType: 'GATE_ENTRY',
          visitorId: 'UNKNOWN',
          visitorName: 'محاولة دخول غير صالحة',
          validationMode: isOnline ? 'ONLINE' : 'OFFLINE',
          status: 'BLOCKED',
          notes: `فشل مسح QR البوابة: ${decoded.reason}`
        });
        return { success: false, title: 'رمز غير صالح', message: decoded.reason || 'فشل التحقق من رمز QR' };
      }
      ticketId = decoded.payload.ticketId || '';
      qrVisitorId = decoded.payload.visitorId;
      nonce = decoded.payload.nonce;
      familyMemberId = decoded.payload.familyMemberId || '';
    }

    // Check Double Spend / Replay token
    if (nonce && spentNonces.includes(nonce)) {
      sound.playError();
      logEvent({
        eventType: 'DOUBLE_SPEND_BLOCKED',
        visitorId: qrVisitorId || visitor.id,
        visitorName: visitor.name,
        ticketId,
        validationMode: isOnline ? 'ONLINE' : 'OFFLINE',
        status: 'BLOCKED',
        notes: `تحذير أمني: تم اعتراض محاولة تكرار استخدام رمز QR ممسوح مسبقاً (Replay/Screenshot Attack). Nonce: ${nonce}`
      });
      return {
        success: false,
        title: '⛔ رمز مكرر مسبقاً!',
        message: 'تم استخدام هذا الرمز أو تصويره مسبقاً. نظام الحماية منع الاستخدام المزدوج (Anti-Replay Attack Protection).'
      };
    }

    // Find ticket
    const ticket = tickets.find(t => t.id === ticketId);
    if (!ticket) {
      sound.playError();
      return {
        success: false,
        title: 'التذكرة غير موجودة',
        message: `لم يتم العثور على التذكرة (${ticketId}) في النظام.`
      };
    }

    if (ticket.status === 'CONSUMED') {
      sound.playError();
      return {
        success: false,
        title: 'التذكرة مستهلكة بالكامل',
        message: `تم استخدام هذه التذكرة مسبقاً في ${ticket.consumedAtLocationName || 'الحديقة'} في ${ticket.consumedAt || 'وقت سابق'}.`
      };
    }

    const nowStr = new Date().toISOString().replace('T', ' ').substring(0, 19);
    const member = visitor.familyMembers.find(m => m.id === (familyMemberId || ticket.familyMemberId));

    // Update Ticket State to VALIDATED
    setTickets(prev => prev.map(t => {
      if (t.id === ticketId) {
        return {
          ...t,
          status: 'VALIDATED',
          validatedAt: nowStr
        };
      }
      return t;
    }));

    // Record Member Last Activity for Family Safety
    if (member) {
      setVisitor(prev => ({
        ...prev,
        familyMembers: prev.familyMembers.map(m => {
          if (m.id === member.id) {
            return {
              ...m,
              lastActivity: {
                locationName: gateStation,
                locationId: 'gate-station',
                timestamp: nowStr.substring(11, 16),
                type: 'gate_entry'
              }
            };
          }
          return m;
        })
      }));
    }

    if (nonce) {
      setSpentNonces(prev => [...prev, nonce]);
    }

    // Update Gate employee stats
    setEmployees(prev => prev.map(emp => {
      if (emp.id === employeeId || emp.role === 'gate_staff') {
        return { ...emp, todayTransactionsCount: emp.todayTransactionsCount + 1 };
      }
      return emp;
    }));

    logEvent({
      eventType: 'GATE_ENTRY',
      visitorId: ticket.visitorId,
      visitorName: ticket.visitorId === visitor.id ? visitor.name : ticket.visitorId,
      familyMemberName: member?.name || (ticket.visitorId === 'ANONYMOUS' ? 'زائر تذكرة ورقية' : undefined),
      ticketId: ticket.id,
      employeeId,
      employeeName: employees.find(e => e.id === employeeId)?.name || 'مراقب البوابة',
      validationMode: isOnline ? 'ONLINE' : 'OFFLINE',
      status: 'SUCCESS',
      notes: `دخول مصرح به عبر ${gateStation} (${isOnline ? '🟢 تحقق متصل' : '🟠 تحقق محلي دون إنترنت'})`
    });

    // Auto unlock Castle Entrance achievement
    unlockAchievement('ach-castle-entrance');

    sound.playSuccess();
    return {
      success: true,
      title: 'دخول مصرح به ✅',
      message: `مرحباً بك! تم التحقق من التذكرة بنجاح.`,
      details: {
        ticketId: ticket.id,
        visitorName: visitor.name,
        familyMemberName: member?.name,
        mode: isOnline ? 'ONLINE' : 'OFFLINE'
      }
    };
  };

  // Consume Ride Action (Either Ticket or direct Units QR)
  const consumeRideAction = (attractionId: string, qrOrTicketRaw: string, employeeId: string): ValidationResult => {
    const attraction = attractions.find(a => a.id === attractionId);
    if (!attraction) {
      sound.playError();
      return { success: false, title: 'خطأ', message: 'اللعبة المحددة غير صالحة' };
    }

    let raw = qrOrTicketRaw.trim();
    let isDirectUnits = false;
    let unitsToDeduct = attraction.priceUnits;
    let ticketId = '';
    let visitorId = visitor.id;
    let familyMemberId = '';
    let nonce = '';

    if (raw.startsWith('{')) {
      const decoded = decodeAndVerifyQR(raw);
      if (!decoded.valid || !decoded.payload) {
        sound.playError();
        return { success: false, title: 'رمز غير صالح', message: decoded.reason || 'فشل التحقق الأمني للرمز' };
      }
      visitorId = decoded.payload.visitorId;
      ticketId = decoded.payload.ticketId || '';
      familyMemberId = decoded.payload.familyMemberId || '';
      nonce = decoded.payload.nonce;

      if (decoded.payload.qrType === 'USAGE_QR' && !ticketId) {
        isDirectUnits = true;
      }
    } else {
      ticketId = raw;
    }

    // Anti-Replay / Double spend check
    if (nonce && spentNonces.includes(nonce)) {
      sound.playError();
      logEvent({
        eventType: 'DOUBLE_SPEND_BLOCKED',
        visitorId,
        visitorName: visitor.name,
        attractionId,
        attractionName: attraction.nameAr,
        ticketId,
        validationMode: isOnline ? 'ONLINE' : 'OFFLINE',
        status: 'BLOCKED',
        notes: `محاولة استخدام مكرر لرمز اللعبة (Replay Attack). اللعبة: ${attraction.nameAr}`
      });
      return {
        success: false,
        title: '⛔ رمز مكرر أو منتهي!',
        message: 'تم استخدام هذا الرمز أو تصويره مسبقاً. منع الاستخدام المزدوج للمحافظة على الأمان.'
      };
    }

    // Check if attraction is frozen by Security & Safety
    if (attraction.isFrozenForSafety) {
      sound.playError();
      return {
        success: false,
        title: '🛑 اللعبة مجمّدة مؤقتاً لدواعي السلامة',
        message: attraction.freezeReason || 'تم تجميد الدخول وتمرير التذاكر مؤقتاً بأمر غرفة الأمن والسلامة لإدارة الحشود أو إجراء فحص فني سريع.'
      };
    }

    const nowStr = new Date().toISOString().replace('T', ' ').substring(0, 19);

    if (isDirectUnits) {
      // Direct Units consumption at ride
      if (visitor.unitsBalance < unitsToDeduct) {
        sound.playError();
        return {
          success: false,
          title: 'رصيد الوحدات غير كافٍ',
          message: `المطلوب ${unitsToDeduct} وحدة، والرصيد الحالي ${visitor.unitsBalance} وحدة.`
        };
      }

      setVisitor(prev => ({
        ...prev,
        unitsBalance: prev.unitsBalance - unitsToDeduct
      }));
    } else {
      // Ticket consumption
      const ticket = tickets.find(t => t.id === ticketId);
      if (!ticket) {
        sound.playError();
        return { success: false, title: 'تذكرة غير موجودة', message: `لم يتم العثور على التذكرة ${ticketId}` };
      }
      if (ticket.status === 'CONSUMED') {
        sound.playError();
        return {
          success: false,
          title: 'التذكرة مستهلكة مسبقاً',
          message: `تم استخدام هذه التذكرة مسبقاً في ${ticket.consumedAtLocationName || 'لعبة أخرى'} في ${ticket.consumedAt}`
        };
      }

      familyMemberId = familyMemberId || ticket.familyMemberId || '';

      // Transition State Machine to CONSUMED
      setTickets(prev => prev.map(t => {
        if (t.id === ticketId) {
          return {
            ...t,
            status: 'CONSUMED',
            consumedAt: nowStr,
            consumedAtLocationId: attraction.id,
            consumedAtLocationName: attraction.nameAr,
            consumedByEmployeeId: employeeId
          };
        }
        return t;
      }));
    }

    // Update Family Member Safety Timeline
    const member = visitor.familyMembers.find(m => m.id === familyMemberId);
    if (member) {
      setVisitor(prev => ({
        ...prev,
        familyMembers: prev.familyMembers.map(m => {
          if (m.id === member.id) {
            return {
              ...m,
              lastActivity: {
                locationName: `${attraction.nameAr} (لعبة #${attraction.id.replace('attr-', '')})`,
                locationId: attraction.id,
                timestamp: nowStr.substring(11, 16),
                type: 'ride'
              }
            };
          }
          return m;
        })
      }));
    }

    if (nonce) {
      setSpentNonces(prev => [...prev, nonce]);
    }

    // Update Attraction metrics
    setAttractions(prev => prev.map(a => {
      if (a.id === attractionId) {
        return {
          ...a,
          totalRidesToday: a.totalRidesToday + 1,
          currentQueue: Math.max(0, a.currentQueue - 1 + Math.floor(Math.random() * 3))
        };
      }
      return a;
    }));

    // Update Employee
    setEmployees(prev => prev.map(emp => {
      if (emp.id === employeeId || emp.role === 'attraction_staff') {
        return { ...emp, todayTransactionsCount: emp.todayTransactionsCount + 1 };
      }
      return emp;
    }));

    logEvent({
      eventType: 'RIDE_USAGE',
      visitorId,
      visitorName: visitor.name,
      familyMemberName: member?.name,
      attractionId: attraction.id,
      attractionName: attraction.nameAr,
      ticketId: ticketId || undefined,
      unitsAmount: isDirectUnits ? unitsToDeduct : undefined,
      employeeId,
      employeeName: employees.find(e => e.id === employeeId)?.name || 'مشغل اللعبة',
      validationMode: isOnline ? 'ONLINE' : 'OFFLINE',
      status: 'SUCCESS',
      notes: isDirectUnits 
        ? `خصم ${unitsToDeduct} وحدة لاستخدام ${attraction.nameAr}`
        : `استهلاك تذكرة ${ticketId} في ${attraction.nameAr}`
    });

    // Auto unlock Coaster Conqueror / Ride Rider achievement
    unlockAchievement('ach-coaster-conqueror');

    sound.playSuccess();
    return {
      success: true,
      title: 'استخدام مصرح به 🎉',
      message: `نتمنى لكم جولة ممتعة في ${attraction.nameAr}!`,
      details: {
        ticketId: ticketId || 'خصم وحدات مباشر',
        visitorName: visitor.name,
        familyMemberName: member?.name,
        remainingUnits: visitor.unitsBalance - (isDirectUnits ? unitsToDeduct : 0),
        mode: isOnline ? 'ONLINE' : 'OFFLINE'
      }
    };
  };

  // Peer-to-Peer or Staff-to-Visitor Offline Ticket Transfer
  const transferTicketToVisitor = (ticketId: string, targetVisitorId: string): boolean => {
    const ticket = tickets.find(t => t.id === ticketId);
    if (!ticket || ticket.status === 'CONSUMED') {
      sound.playError();
      return false;
    }

    setTickets(prev => prev.map(t => {
      if (t.id === ticketId) {
        return {
          ...t,
          visitorId: targetVisitorId,
          familyMemberId: undefined
        };
      }
      return t;
    }));

    logEvent({
      eventType: 'TICKET_TRANSFER',
      visitorId: targetVisitorId,
      visitorName: targetVisitorId,
      ticketId,
      validationMode: isOnline ? 'ONLINE' : 'OFFLINE',
      status: 'SUCCESS',
      notes: `نقل ملكية التذكرة ${ticketId} بنجاح إلى المستلم ${targetVisitorId} (${isOnline ? 'Online' : 'Offline Transfer QR'})`
    });

    sound.playSuccess();
    return true;
  };

  // Family Safety: Report Missing Child SOS
  const reportMissingChild = (memberId: string, clothingDesc: string, extraNotes?: string): MissingPersonAlert => {
    const member = visitor.familyMembers.find(m => m.id === memberId);
    if (!member) throw new Error('فرد العائلة غير موجود');

    const alertId = `SOS-${Math.floor(1000 + Math.random() * 9000)}`;
    const nowStr = new Date().toISOString().replace('T', ' ').substring(0, 19);

    const newAlert: MissingPersonAlert = {
      id: alertId,
      childName: member.name,
      age: member.age || 8,
      familyHeadName: visitor.name,
      familyHeadPhone: visitor.phone,
      familyHeadId: visitor.id,
      clothingDescription: clothingDesc || member.clothingDescription || 'ملابس اعتيادية',
      reportedAt: nowStr,
      status: 'ACTIVE_SEARCH',
      notes: extraNotes,
      lastRecordedActivity: {
        locationName: member.lastActivity?.locationName || 'بوابة الدخول الرئيسية',
        locationId: member.lastActivity?.locationId || 'gate-1',
        time: member.lastActivity?.timestamp || nowStr.substring(11, 16),
        ticketId: member.assignedTicketId
      },
      previousActivity: {
        locationName: 'سيارات التصادم الكهربائية (لعبة #3)',
        locationId: 'attr-3',
        time: '20:41'
      }
    };

    setMissingAlerts(prev => [newAlert, ...prev]);

    logEvent({
      eventType: 'MISSING_CHILD_ALERT',
      visitorId: visitor.id,
      visitorName: visitor.name,
      familyMemberName: member.name,
      ticketId: member.assignedTicketId,
      attractionName: member.lastActivity?.locationName,
      validationMode: isOnline ? 'ONLINE' : 'OFFLINE',
      status: 'FLAGGED',
      notes: `🚨 بلاغ طوارئ: فقدان فرد من الأسرة (${member.name}). آخر نشاط مسجل: ${member.lastActivity?.locationName} الساعة ${member.lastActivity?.timestamp}`
    });

    // Auto unlock Family Shield achievement
    unlockAchievement('ach-family-shield');

    sound.playEmergency();
    return newAlert;
  };

  // Resolve Missing Child Alert by Security
  const resolveMissingAlert = (alertId: string, officerName: string, notes: string) => {
    const nowStr = new Date().toISOString().replace('T', ' ').substring(0, 19);

    setMissingAlerts(prev => prev.map(a => {
      if (a.id === alertId) {
        return {
          ...a,
          status: 'FOUND_RESOLVED',
          resolvedAt: nowStr,
          assignedOfficer: officerName,
          notes: notes || a.notes
        };
      }
      return a;
    }));

    const alert = missingAlerts.find(a => a.id === alertId);

    logEvent({
      eventType: 'MISSING_CHILD_FOUND',
      visitorId: alert?.familyHeadId || 'SYSTEM',
      visitorName: alert?.familyHeadName || 'الأمن',
      familyMemberName: alert?.childName,
      employeeName: officerName,
      validationMode: isOnline ? 'ONLINE' : 'OFFLINE',
      status: 'SUCCESS',
      notes: `🟢 تم إغلاق البلاغ ${alertId}: تم العثور على ${alert?.childName} وتسليمه لذويه بأمان.`
    });

    sound.playSuccess();
  };

  // Safety & Public Emergency Banner State
  const [isPublicMissingBannerDismissed, setIsPublicMissingBannerDismissed] = useState<boolean>(false);

  const activePublicMissingAlert = useMemo(() => {
    return missingAlerts.find(a => a.status === 'ACTIVE_SEARCH') || null;
  }, [missingAlerts]);

  const dismissPublicMissingBanner = () => {
    setIsPublicMissingBannerDismissed(true);
  };

  const restorePublicMissingBanner = () => {
    setIsPublicMissingBannerDismissed(false);
  };

  const toggleFreezeAttraction = (attractionId: string, reason?: string) => {
    setAttractions(prev => prev.map(a => {
      if (a.id === attractionId) {
        const nextState = !a.isFrozenForSafety;
        if (nextState) {
          sound.playFreeze();
          addNotification({
            titleAr: `❄️ تجميد تذاكر ${a.nameAr} مؤقتاً`,
            messageAr: reason || 'تم إيقاف تمرير التذاكر لدواعي تنظيم الحشود وفحص السلامة.',
            type: 'SAFETY_UPDATE',
            urgency: 'high',
            iconType: 'shield',
            targetAttractionId: a.id
          });
        } else {
          sound.playUnfreeze();
          addNotification({
            titleAr: `✅ استئناف تشغيل وتذاكر ${a.nameAr}`,
            messageAr: 'تم فك التجميد وتعمل اللعبة الآن بكامل طاقتها لاستقبال الزوار.',
            type: 'SAFETY_UPDATE',
            urgency: 'low',
            iconType: 'coaster',
            targetAttractionId: a.id
          });
        }
        return {
          ...a,
          isFrozenForSafety: nextState,
          freezeReason: nextState ? (reason || 'تجميد مؤقت لسلامة الزوار وفحص الحشود') : undefined
        };
      }
      return a;
    }));

    const attr = attractions.find(a => a.id === attractionId);
    logEvent({
      eventType: 'RIDE_USAGE',
      visitorId: 'SECURITY-DISPATCH',
      visitorName: 'غرفة الأمن والسلامة',
      attractionId,
      attractionName: attr?.nameAr,
      employeeId: 'EMP-004',
      employeeName: 'سلطان الدوسري (مشرف السلامة)',
      validationMode: 'ONLINE',
      status: 'FLAGGED',
      notes: `تحديث حالة تجميد اللعبة: ${attr?.nameAr} - ${reason || 'إجراء أمني للتحكم في تدفق الزوار'}`
    });
  };

  const adjustSafetyStaff = (attractionId: string, delta: number) => {
    setAttractions(prev => prev.map(a => {
      if (a.id === attractionId) {
        const current = a.assignedSafetyStaff || 0;
        const next = Math.max(0, current + delta);
        return {
          ...a,
          assignedSafetyStaff: next
        };
      }
      return a;
    }));
    sound.playStepSound();
  };

  const broadcastSecurityUrgentAlert = (params: {
    titleAr: string;
    messageAr: string;
    targetAttractionId?: string;
    urgency: 'high' | 'medium' | 'low';
    iconType?: string;
  }) => {
    sound.playSecurityBroadcast();
    addNotification({
      titleAr: params.titleAr,
      messageAr: params.messageAr,
      type: 'SAFETY_UPDATE',
      urgency: params.urgency,
      targetAttractionId: params.targetAttractionId,
      iconType: (params.iconType as any) || 'shield'
    });

    logEvent({
      eventType: 'MISSING_CHILD_ALERT',
      visitorId: 'ALL-PARK',
      visitorName: 'تعميم أمني',
      attractionId: params.targetAttractionId,
      attractionName: attractions.find(a => a.id === params.targetAttractionId)?.nameAr,
      employeeId: 'EMP-004',
      employeeName: 'غرفة العمليات المركزية',
      validationMode: 'ONLINE',
      status: params.urgency === 'high' ? 'FLAGGED' : 'SUCCESS',
      notes: `تعميم أمني عاجل: ${params.titleAr} - ${params.messageAr}`
    });
  };

  // Double Spend / Replay Attack Test Simulator
  const testReplayAttack = (): ValidationResult => {
    // Generate a nonce, add it to spent tokens, then try to scan again
    const fakeNonce = 'STOLEN-NONCE-XYZ';
    setSpentNonces(prev => [...prev, fakeNonce]);

    const fakePayload = {
      qrType: 'USAGE_QR' as const,
      visitorId: visitor.id,
      ticketId: 'T-000182',
      timestamp: Date.now(),
      nonce: fakeNonce
    };

    const encoded = encodeQRPayload(fakePayload);
    return consumeRideAction('attr-2', encoded, 'EMP-009');
  };

  // Reset to initial clean state
  const resetToInitialDemoState = () => {
    setVisitor(INITIAL_VISITOR);
    setTickets(INITIAL_TICKETS);
    setAttractions(INITIAL_ATTRACTIONS);
    setEvents(INITIAL_EVENTS);
    setEmployees(INITIAL_EMPLOYEES);
    setMissingAlerts([]);
    setOfflineSyncQueue([]);
    setSpentNonces([]);
    setIsPublicMissingBannerDismissed(false);
    sound.playSuccess();
  };

  return (
    <ParkContext.Provider
      value={{
        theme,
        setTheme,
        isThemeModalOpen,
        openThemeModal,
        closeThemeModal,
        notifications,
        dismissNotification,
        addNotification,
        weather,
        simulateWeatherChange,
        simulateRideVacancyNotification,
        achievements,
        activeAchievementPopup,
        setActiveAchievementPopup,
        isAchievementsModalOpen,
        openAchievementsModal,
        closeAchievementsModal,
        unlockAchievement,
        visitorGameStage,
        setVisitorGameStage,
        nextVisitorGameStage,
        prevVisitorGameStage,
        visitorNavMode,
        setVisitorNavMode,
        isOnline,
        toggleNetworkMode,
        currentRole,
        setCurrentRole,
        visitor,
        tickets,
        attractions,
        events,
        employees,
        missingAlerts,
        offlineSyncQueue,
        qrModal,
        showQRModal,
        hideQRModal,
        scannerModal,
        openScannerModal,
        closeScannerModal,
        thermalModal,
        showThermalTickets,
        closeThermalModal,
        isCastleMapOpen,
        openCastleMap,
        closeCastleMap,
        selectedMapAttractionId,
        setSelectedMapAttractionId,
        isOnboardingOpen,
        openOnboarding,
        closeOnboarding,
        simulateFamilyMemberMove,
        buyUnits,
        buyTicketsWithUnits,
        anonymousCashSale,
        bindPreprintedRange,
        assignTicketToMember,
        validateGateEntry,
        consumeRideAction,
        transferTicketToVisitor,
        reportMissingChild,
        resolveMissingAlert,
        toggleFreezeAttraction,
        adjustSafetyStaff,
        broadcastSecurityUrgentAlert,
        activePublicMissingAlert,
        isPublicMissingBannerDismissed,
        dismissPublicMissingBanner,
        restorePublicMissingBanner,
        syncOfflineQueueManually,
        testReplayAttack,
        resetToInitialDemoState
      }}
    >
      {children}
    </ParkContext.Provider>
  );
};

export const usePark = () => {
  const ctx = useContext(ParkContext);
  if (!ctx) throw new Error('usePark must be used within a ParkProvider');
  return ctx;
};
