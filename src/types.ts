export type UserRole = 
  | 'visitor' 
  | 'cashier' 
  | 'gate_staff' 
  | 'attraction_staff' 
  | 'security' 
  | 'admin';

export type AppTheme = 
  | 'joyful_wonderland' // مدينة الألعاب والبهجة (الافتراضي: ألوان فاتحة مرحة، أزرار ثلاثية الأبعاد جذابة كالألعاب)
  | 'candy_carnival'    // عالم الحلوى والكرنفال (وردي مرح، توت، أزرق سحابي منعش)
  | 'sunny_adventure'   // مغامرة شمس الحصن (برتقالي وأصفر مشرق وأخضر نعناعي)
  | 'magic_fantasy'     // مملكة الخيال والمرح (لافندر ناعم، بنفسجي خيالي، نجوم ذهبية)
  | 'emerald_park'      // واحة الحديقة المنعشة (أخضر عشبي نضر، أبيض ساطع، وتفاصيل نقية)
  | 'night_carnival';   // كرنفال الأضواء الليلي (لمحبي الأجواء الاحتفالية الليلية بالأضواء الملونة)

export interface ThemeOption {
  id: AppTheme;
  nameAr: string;
  nameEn: string;
  descriptionAr: string;
  badge: string;
  icon: string;
  previewColors: string[];
  isDark: boolean;
}

export type TicketStatus = 
  | 'ISSUED' 
  | 'AVAILABLE' 
  | 'RESERVED' 
  | 'VALIDATED' 
  | 'CONSUMED' 
  | 'CANCELLED' 
  | 'EXPIRED' 
  | 'REJECTED';

export type QRType = 
  | 'PURCHASE_QR'   // Used by visitor at Cashier to buy tickets with units
  | 'TRANSFER_QR'   // Used to transfer tickets between phones offline/online
  | 'ENTRY_QR'      // Used at Gate to enter park
  | 'USAGE_QR';     // Used at Ride to consume ticket or units

export interface FamilyMember {
  id: string;
  name: string;
  relation: 'father' | 'mother' | 'child' | 'relative' | 'other';
  age?: number;
  avatar: string;
  assignedTicketId?: string;
  clothingDescription?: string;
  lastActivity?: {
    locationName: string;
    locationId: string;
    timestamp: string;
    type: 'gate_entry' | 'ride' | 'purchase';
  };
}

export interface Visitor {
  id: string; // e.g. "V-123765"
  name: string;
  phone: string;
  unitsBalance: number;
  isAnonymous: boolean;
  registeredAt: string;
  familyMembers: FamilyMember[];
}

export interface Ticket {
  id: string; // e.g. "T-000182"
  visitorId: string; // owner
  familyMemberId?: string;
  status: TicketStatus;
  ticketType: 'single_ride' | 'park_entry' | 'unlimited_pass';
  isPhysicalPaper: boolean;
  paperSerialNumber?: string;
  createdAt: string;
  validatedAt?: string;
  consumedAt?: string;
  consumedAtLocationId?: string;
  consumedAtLocationName?: string;
  consumedByEmployeeId?: string;
  signatureToken: string; // Anti-tamper crypto token
}

export interface Attraction {
  id: string;
  nameAr: string;
  nameEn: string;
  priceUnits: number;
  category: 'thrill' | 'family' | 'kids' | 'water';
  status: 'OPEN' | 'BUSY' | 'MAINTENANCE';
  capacity: number;
  zone: string;
  operatingHours: string;
  icon: string;
  currentQueue: number;
  totalRidesToday: number;
  avgWaitTimeMins: number;
  isFrozenForSafety?: boolean;
  freezeReason?: string;
  assignedSafetyStaff?: number;
  treasureMapCoords?: { x: number; y: number };
}

export interface ParkEvent {
  id: string;
  timestamp: string;
  eventType: 
    | 'UNIT_PURCHASE'
    | 'TICKET_PURCHASE'
    | 'TICKET_TRANSFER'
    | 'GATE_ENTRY'
    | 'RIDE_USAGE'
    | 'ANONYMOUS_SALE'
    | 'PREPRINTED_LINK'
    | 'MISSING_CHILD_ALERT'
    | 'MISSING_CHILD_FOUND'
    | 'OFFLINE_SYNC_COMMITTED'
    | 'DOUBLE_SPEND_BLOCKED';
  visitorId: string;
  visitorName: string;
  familyMemberName?: string;
  ticketId?: string;
  attractionId?: string;
  attractionName?: string;
  employeeId?: string;
  employeeName?: string;
  unitsAmount?: number;
  amountSAR?: number;
  validationMode: 'ONLINE' | 'OFFLINE';
  status: 'SUCCESS' | 'BLOCKED' | 'FLAGGED';
  notes: string;
  signatureHash: string;
}

export interface MissingPersonAlert {
  id: string;
  childName: string;
  age: number;
  familyHeadName: string;
  familyHeadPhone: string;
  familyHeadId: string;
  lastRecordedActivity: {
    locationName: string;
    locationId: string;
    time: string;
    ticketId?: string;
  };
  previousActivity?: {
    locationName: string;
    locationId: string;
    time: string;
  };
  clothingDescription: string;
  reportedAt: string;
  status: 'ACTIVE_SEARCH' | 'FOUND_RESOLVED';
  resolvedAt?: string;
  assignedOfficer?: string;
  notes?: string;
}

export interface Employee {
  id: string;
  name: string;
  role: UserRole;
  roleTitleAr: string;
  assignedStation: string;
  offlineInventoryRemaining: number;
  offlineInventoryAllocated: number;
  todayTransactionsCount: number;
}

export interface QRPayload {
  qrType: QRType;
  visitorId: string;
  ticketId?: string;
  ticketsCount?: number;
  unitsAmount?: number;
  attractionId?: string;
  familyMemberId?: string;
  timestamp: number;
  nonce: string;
  signature: string;
  offlineSigned?: boolean;
}

export interface OfflineSyncItem {
  id: string;
  event: ParkEvent;
  generatedAt: string;
  deviceEmployeeId: string;
  synced: boolean;
  syncAttempts: number;
}

export type NotificationType = 
  | 'RIDE_VACANCY'      // توفر أماكن شاغرة / انخفاض وقت الانتظار
  | 'WEATHER_ALERT'     // تنبيهات الطقس وتأثيرها على الألعاب
  | 'ACHIEVEMENT_UNLOCKED' // فوز بإنجاز أو وسام جديد
  | 'SAFETY_UPDATE'     // تحديث أمان عائلي
  | 'SYSTEM_BROADCAST'; // تعميم من إدارة الحصن

export interface SmartNotification {
  id: string;
  titleAr: string;
  messageAr: string;
  type: NotificationType;
  timestamp: string;
  read: boolean;
  targetAttractionId?: string;
  urgency: 'low' | 'medium' | 'high';
  iconType?: 'coaster' | 'weather' | 'trophy' | 'shield' | 'star' | 'water';
  actionUrl?: string;
}

export interface WeatherStatus {
  condition: 'sunny' | 'cloudy' | 'windy' | 'rainy' | 'perfect';
  temperatureC: number;
  windSpeedKmH: number;
  titleAr: string;
  descriptionAr: string;
  outdoorRidesStatus: 'ALL_OPEN' | 'PARTIAL_CHECKS' | 'CAUTION_HIGH_WINDS';
  lastUpdatedTime: string;
}

export interface Achievement {
  id: string;
  titleAr: string;
  descriptionAr: string;
  category: 'units' | 'tickets' | 'rides' | 'safety' | 'explorer';
  icon: string;
  rewardUnits: number;
  unlocked: boolean;
  unlockedAt?: string;
  progressCurrent?: number;
  progressMax?: number;
}

