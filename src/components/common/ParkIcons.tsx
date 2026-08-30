import React from 'react';

interface IconProps {
  className?: string;
  size?: number;
}

// 1. Roller Coaster (قطار الموت السريع)
export const RollerCoasterIcon: React.FC<IconProps> = ({ className = 'w-6 h-6', size }) => (
  <svg 
    viewBox="0 0 64 64" 
    fill="none" 
    xmlns="http://www.w3.org/2000/svg" 
    className={className}
    style={size ? { width: size, height: size } : undefined}
  >
    <path d="M4 56C12 56 16 38 24 38C32 38 34 52 44 52C52 52 56 20 60 16" stroke="#FB7185" strokeWidth="4" strokeLinecap="round" />
    <path d="M4 60H60" stroke="#94A3B8" strokeWidth="3" strokeLinecap="round" />
    <path d="M12 56V60M24 38V60M34 52V60M44 52V60M56 26V60" stroke="#CBD5E1" strokeWidth="2" strokeDasharray="2 2" />
    {/* Coaster Car */}
    <rect x="18" y="28" width="14" height="9" rx="3" fill="#F43F5E" stroke="#881337" strokeWidth="1.5" />
    <circle cx="21" cy="37" r="2" fill="#334155" />
    <circle cx="29" cy="37" r="2" fill="#334155" />
    <circle cx="24" cy="25" r="2.5" fill="#FDE047" />
    {/* Speed lines */}
    <path d="M10 26L14 26M8 30L13 30" stroke="#FDE047" strokeWidth="1.5" strokeLinecap="round" />
  </svg>
);

// 2. Ferris Wheel (عجلة الفلك البانورامية)
export const FerrisWheelIcon: React.FC<IconProps> = ({ className = 'w-6 h-6', size }) => (
  <svg 
    viewBox="0 0 64 64" 
    fill="none" 
    xmlns="http://www.w3.org/2000/svg" 
    className={className}
    style={size ? { width: size, height: size } : undefined}
  >
    {/* Stand */}
    <path d="M32 32L18 60H46L32 32Z" fill="#E2E8F0" stroke="#64748B" strokeWidth="2.5" strokeLinejoin="round" />
    {/* Outer Wheel */}
    <circle cx="32" cy="30" r="22" stroke="#0EA5E9" strokeWidth="3.5" strokeDasharray="8 3" />
    <circle cx="32" cy="30" r="14" stroke="#38BDF8" strokeWidth="2" opacity="0.7" />
    {/* Center Hub */}
    <circle cx="32" cy="30" r="4.5" fill="#F59E0B" stroke="#B45309" strokeWidth="1.5" />
    {/* Spokes */}
    <line x1="32" y1="8" x2="32" y2="52" stroke="#0284C7" strokeWidth="1.5" />
    <line x1="10" y1="30" x2="54" y2="30" stroke="#0284C7" strokeWidth="1.5" />
    <line x1="16" y1="14" x2="48" y2="46" stroke="#0284C7" strokeWidth="1.5" />
    <line x1="16" y1="46" x2="48" y2="14" stroke="#0284C7" strokeWidth="1.5" />
    {/* Gondolas */}
    <rect x="30" y="5" width="4" height="5" rx="1.5" fill="#F43F5E" />
    <rect x="30" y="50" width="4" height="5" rx="1.5" fill="#10B981" />
    <rect x="7" y="28" width="5" height="4" rx="1.5" fill="#F59E0B" />
    <rect x="52" y="28" width="5" height="4" rx="1.5" fill="#8B5CF6" />
  </svg>
);

// 3. Carousel (الخيول الدوارة الملكية)
export const CarouselIcon: React.FC<IconProps> = ({ className = 'w-6 h-6', size }) => (
  <svg 
    viewBox="0 0 64 64" 
    fill="none" 
    xmlns="http://www.w3.org/2000/svg" 
    className={className}
    style={size ? { width: size, height: size } : undefined}
  >
    {/* Canopy */}
    <path d="M10 24L32 6L54 24H10Z" fill="#EC4899" stroke="#9D174D" strokeWidth="2" strokeLinejoin="round" />
    <path d="M10 24C10 24 16 28 21 24C26 20 32 28 32 28C32 28 38 20 43 24C48 28 54 24 54 24" fill="#FDE047" />
    {/* Base */}
    <ellipse cx="32" cy="54" rx="24" ry="5" fill="#FBCFE8" stroke="#DB2777" strokeWidth="2" />
    {/* Center Pole */}
    <rect x="30" y="24" width="4" height="28" fill="#F59E0B" />
    {/* Side Poles */}
    <line x1="18" y1="24" x2="18" y2="52" stroke="#FDE047" strokeWidth="2" strokeDasharray="3 3" />
    <line x1="46" y1="24" x2="46" y2="52" stroke="#FDE047" strokeWidth="2" strokeDasharray="3 3" />
    {/* Little Carousel Horse */}
    <path d="M14 36C14 36 17 34 20 36C22 37 23 40 21 42L16 43L14 46H12L13 41L14 36Z" fill="#6366F1" />
    <path d="M42 38C42 38 45 36 48 38C50 39 51 42 49 44L44 45L42 48H40L41 43L42 38Z" fill="#10B981" />
  </svg>
);

// 4. Bumper Cars (سيارات التصادم)
export const BumperCarsIcon: React.FC<IconProps> = ({ className = 'w-6 h-6', size }) => (
  <svg 
    viewBox="0 0 64 64" 
    fill="none" 
    xmlns="http://www.w3.org/2000/svg" 
    className={className}
    style={size ? { width: size, height: size } : undefined}
  >
    {/* Electric Antenna & Ceiling Grid */}
    <line x1="8" y1="8" x2="56" y2="8" stroke="#64748B" strokeWidth="2" strokeDasharray="4 2" />
    <line x1="44" y1="8" x2="44" y2="34" stroke="#94A3B8" strokeWidth="1.5" />
    <circle cx="44" cy="8" r="2.5" fill="#FDE047" />
    {/* Car Body */}
    <path d="M12 44C12 36 18 34 26 34H42C48 34 52 38 52 44C52 48 48 52 42 52H18C14 52 12 48 12 44Z" fill="#3B82F6" stroke="#1D4ED8" strokeWidth="2" />
    {/* Rubber Bumper */}
    <path d="M8 48C8 44 14 42 22 42H46C54 42 58 44 58 48C58 52 54 55 46 55H22C14 55 8 52 8 48Z" fill="#1E293B" stroke="#0F172A" strokeWidth="1.5" />
    {/* Steering Wheel & Driver */}
    <circle cx="28" cy="28" r="4" fill="#FBBF24" />
    <path d="M22 34L26 31" stroke="#0F172A" strokeWidth="2" strokeLinecap="round" />
    {/* Headlight */}
    <circle cx="14" cy="46" r="2.5" fill="#FEF08A" />
    <path d="M6 44L10 46L6 48" stroke="#FEF08A" strokeWidth="1.5" strokeLinecap="round" />
  </svg>
);

// 5. Drop Tower (برج السقوط الحر)
export const DropTowerIcon: React.FC<IconProps> = ({ className = 'w-6 h-6', size }) => (
  <svg 
    viewBox="0 0 64 64" 
    fill="none" 
    xmlns="http://www.w3.org/2000/svg" 
    className={className}
    style={size ? { width: size, height: size } : undefined}
  >
    {/* Tower Base & Mast */}
    <path d="M18 60H46" stroke="#475569" strokeWidth="4" strokeLinecap="round" />
    <rect x="28" y="8" width="8" height="52" fill="#E2E8F0" stroke="#64748B" strokeWidth="2" />
    <line x1="28" y1="16" x2="36" y2="24" stroke="#94A3B8" strokeWidth="1.5" />
    <line x1="36" y1="16" x2="28" y2="24" stroke="#94A3B8" strokeWidth="1.5" />
    <line x1="28" y1="32" x2="36" y2="40" stroke="#94A3B8" strokeWidth="1.5" />
    <line x1="36" y1="32" x2="28" y2="40" stroke="#94A3B8" strokeWidth="1.5" />
    <line x1="28" y1="48" x2="36" y2="56" stroke="#94A3B8" strokeWidth="1.5" />
    <line x1="36" y1="48" x2="28" y2="56" stroke="#94A3B8" strokeWidth="1.5" />
    {/* Top Beacon */}
    <circle cx="32" cy="6" r="3.5" fill="#EF4444" className="animate-pulse" />
    {/* Drop Ring Carriage */}
    <rect x="18" y="22" width="28" height="8" rx="2" fill="#F59E0B" stroke="#B45309" strokeWidth="1.5" />
    <circle cx="22" cy="26" r="1.5" fill="#FFF" />
    <circle cx="42" cy="26" r="1.5" fill="#FFF" />
    {/* Downward speed arrows */}
    <path d="M22 34V42M22 42L20 40M22 42L24 40" stroke="#F59E0B" strokeWidth="2" strokeLinecap="round" />
    <path d="M42 34V42M42 42L40 40M42 42L44 40" stroke="#F59E0B" strokeWidth="2" strokeLinecap="round" />
  </svg>
);

// 6. Water Splash / Flume Ride (المنزلق المائي العجيب)
export const WaterSplashIcon: React.FC<IconProps> = ({ className = 'w-6 h-6', size }) => (
  <svg 
    viewBox="0 0 64 64" 
    fill="none" 
    xmlns="http://www.w3.org/2000/svg" 
    className={className}
    style={size ? { width: size, height: size } : undefined}
  >
    {/* Water Waves */}
    <path d="M6 52C14 48 18 56 26 52C34 48 38 56 46 52C54 48 58 56 62 52" stroke="#0EA5E9" strokeWidth="3.5" strokeLinecap="round" />
    <path d="M10 58C18 55 22 61 30 58C38 55 42 61 50 58C58 55 60 59 62 58" stroke="#38BDF8" strokeWidth="2.5" strokeLinecap="round" opacity="0.6" />
    {/* Splash Droplets */}
    <path d="M16 38C12 30 18 22 22 28" stroke="#38BDF8" strokeWidth="2" strokeLinecap="round" />
    <path d="M48 38C52 30 46 22 42 28" stroke="#38BDF8" strokeWidth="2" strokeLinecap="round" />
    <circle cx="18" cy="20" r="2" fill="#0EA5E9" />
    <circle cx="46" cy="20" r="2" fill="#0EA5E9" />
    <circle cx="32" cy="14" r="2.5" fill="#38BDF8" />
    {/* Boat Flume */}
    <path d="M20 44L24 34H40L44 44H20Z" fill="#10B981" stroke="#047857" strokeWidth="2" strokeLinejoin="round" />
    <rect x="28" y="32" width="8" height="4" rx="1" fill="#FEF08A" />
  </svg>
);

// 7. Takeshi Castle (قلعة الحصن)
export const TakeshiCastleIcon: React.FC<IconProps> = ({ className = 'w-6 h-6', size }) => (
  <svg 
    viewBox="0 0 64 64" 
    fill="none" 
    xmlns="http://www.w3.org/2000/svg" 
    className={className}
    style={size ? { width: size, height: size } : undefined}
  >
    {/* Base wall */}
    <path d="M10 56H54V38H10V56Z" fill="#F8FAFC" stroke="#475569" strokeWidth="2" />
    {/* Main Gate Door */}
    <path d="M26 56V42C26 38.6863 28.6863 36 32 36C35.3137 36 38 38.6863 38 42V56H26Z" fill="#92400E" stroke="#78350F" strokeWidth="1.5" />
    {/* Curved Castle Roofs (Pagoda tiers) */}
    <path d="M6 38C12 36 18 36 32 30C46 36 52 36 58 38L52 32H12L6 38Z" fill="#DC2626" stroke="#991B1B" strokeWidth="1.5" />
    {/* Upper Level */}
    <rect x="18" y="20" width="28" height="12" fill="#FFF" stroke="#475569" strokeWidth="1.5" />
    <path d="M12 20C18 18 24 18 32 14C40 18 46 18 52 20L48 15H16L12 20Z" fill="#DC2626" stroke="#991B1B" strokeWidth="1.5" />
    {/* Tower Top & Gold Shachihoko */}
    <path d="M32 6L28 14H36L32 6Z" fill="#F59E0B" stroke="#B45309" strokeWidth="1.5" />
    {/* Flags */}
    <line x1="16" y1="15" x2="16" y2="8" stroke="#475569" strokeWidth="1.5" />
    <path d="M16 8L22 10.5L16 13V8Z" fill="#3B82F6" />
    <line x1="48" y1="15" x2="48" y2="8" stroke="#475569" strokeWidth="1.5" />
    <path d="M48 8L54 10.5L48 13V8Z" fill="#10B981" />
  </svg>
);

// 8. Cotton Candy (حلوى غزل البنات)
export const CottonCandyIcon: React.FC<IconProps> = ({ className = 'w-6 h-6', size }) => (
  <svg 
    viewBox="0 0 64 64" 
    fill="none" 
    xmlns="http://www.w3.org/2000/svg" 
    className={className}
    style={size ? { width: size, height: size } : undefined}
  >
    {/* Stick */}
    <line x1="32" y1="36" x2="32" y2="60" stroke="#CBD5E1" strokeWidth="3" strokeLinecap="round" />
    <line x1="32" y1="42" x2="32" y2="60" stroke="#F43F5E" strokeWidth="1.5" strokeDasharray="3 3" />
    {/* Fluffy Candy Clouds */}
    <circle cx="32" cy="22" r="16" fill="#F472B6" opacity="0.9" />
    <circle cx="22" cy="26" r="12" fill="#38BDF8" opacity="0.8" />
    <circle cx="42" cy="26" r="12" fill="#FDE047" opacity="0.8" />
    <circle cx="32" cy="16" r="11" fill="#C084FC" opacity="0.85" />
    {/* Sparkle */}
    <path d="M26 12L28 8L30 12L34 14L30 16L28 20L26 16L22 14L26 12Z" fill="#FFF" />
  </svg>
);

// 9. Golden Ticket Ribbon (تذكرة المغامرة الذهبية)
export const TicketRibbonIcon: React.FC<IconProps> = ({ className = 'w-6 h-6', size }) => (
  <svg 
    viewBox="0 0 64 64" 
    fill="none" 
    xmlns="http://www.w3.org/2000/svg" 
    className={className}
    style={size ? { width: size, height: size } : undefined}
  >
    <rect x="8" y="18" width="48" height="28" rx="4" fill="#FBBF24" stroke="#D97706" strokeWidth="2.5" />
    {/* Perforations */}
    <circle cx="8" cy="32" r="4.5" fill="#FFF" stroke="#D97706" strokeWidth="1.5" />
    <circle cx="56" cy="32" r="4.5" fill="#FFF" stroke="#D97706" strokeWidth="1.5" />
    <line x1="22" y1="20" x2="22" y2="44" stroke="#B45309" strokeWidth="2" strokeDasharray="3 2" />
    {/* Star Emblem */}
    <path d="M38 24L40 29L45 29L41 32L43 37L38 34L33 37L35 32L31 29L36 29L38 24Z" fill="#DC2626" />
  </svg>
);

// 10. Achievement Trophy (كأس البطولة والإنجاز)
export const AchievementTrophyIcon: React.FC<IconProps> = ({ className = 'w-6 h-6', size }) => (
  <svg 
    viewBox="0 0 64 64" 
    fill="none" 
    xmlns="http://www.w3.org/2000/svg" 
    className={className}
    style={size ? { width: size, height: size } : undefined}
  >
    {/* Base */}
    <rect x="22" y="52" width="20" height="8" rx="2" fill="#1E293B" stroke="#0F172A" strokeWidth="1.5" />
    <rect x="28" y="44" width="8" height="8" fill="#F59E0B" stroke="#B45309" strokeWidth="1.5" />
    {/* Cup */}
    <path d="M16 12H48V26C48 34.8366 40.8366 42 32 42C23.1634 42 16 34.8366 16 26V12Z" fill="#FBBF24" stroke="#D97706" strokeWidth="2" />
    {/* Handles */}
    <path d="M16 18H10C7.79086 18 6 19.7909 6 22V24C6 28.4183 9.58172 32 14 32H16" stroke="#D97706" strokeWidth="2.5" strokeLinecap="round" />
    <path d="M48 18H54C56.2091 18 58 19.7909 58 22V24C58 28.4183 54.4183 32 50 32H48" stroke="#D97706" strokeWidth="2.5" strokeLinecap="round" />
    {/* Star inside cup */}
    <path d="M32 20L34 24L38 24L35 27L36 31L32 28.5L28 31L29 27L26 24L30 24L32 20Z" fill="#DC2626" />
  </svg>
);

// 11. Weather Indicators
export const WeatherSunIcon: React.FC<IconProps> = ({ className = 'w-6 h-6', size }) => (
  <svg 
    viewBox="0 0 64 64" 
    fill="none" 
    xmlns="http://www.w3.org/2000/svg" 
    className={className}
    style={size ? { width: size, height: size } : undefined}
  >
    <circle cx="32" cy="32" r="14" fill="#F59E0B" stroke="#D97706" strokeWidth="2" />
    <path d="M32 6V12M32 52V58M6 32H12M52 32H58M14 14L18 18M46 46L50 50M14 50L18 46M46 18L50 14" stroke="#F59E0B" strokeWidth="3" strokeLinecap="round" />
  </svg>
);

export const WeatherRainIcon: React.FC<IconProps> = ({ className = 'w-6 h-6', size }) => (
  <svg 
    viewBox="0 0 64 64" 
    fill="none" 
    xmlns="http://www.w3.org/2000/svg" 
    className={className}
    style={size ? { width: size, height: size } : undefined}
  >
    <path d="M20 38C15.5817 38 12 34.4183 12 30C12 26.0424 14.8732 22.7562 18.6657 22.1065C20.3015 15.1873 26.5413 10 34 10C42.8366 10 50 17.1634 50 26C52.2091 26 54 27.7909 54 30C54 34.4183 50.4183 38 46 38H20Z" fill="#94A3B8" stroke="#64748B" strokeWidth="2" />
    {/* Rain drops */}
    <line x1="22" y1="44" x2="18" y2="54" stroke="#0EA5E9" strokeWidth="2.5" strokeLinecap="round" />
    <line x1="32" y1="44" x2="28" y2="54" stroke="#0EA5E9" strokeWidth="2.5" strokeLinecap="round" />
    <line x1="42" y1="44" x2="38" y2="54" stroke="#0EA5E9" strokeWidth="2.5" strokeLinecap="round" />
  </svg>
);

export const WeatherWindIcon: React.FC<IconProps> = ({ className = 'w-6 h-6', size }) => (
  <svg 
    viewBox="0 0 64 64" 
    fill="none" 
    xmlns="http://www.w3.org/2000/svg" 
    className={className}
    style={size ? { width: size, height: size } : undefined}
  >
    <path d="M8 24H38C41.3137 24 44 21.3137 44 18C44 14.6863 41.3137 12 38 12C34.6863 12 32 14.6863 32 18" stroke="#38BDF8" strokeWidth="3" strokeLinecap="round" />
    <path d="M12 34H48C51.3137 34 54 36.6863 54 40C54 43.3137 51.3137 46 48 46C44.6863 46 42 43.3137 42 40" stroke="#0284C7" strokeWidth="3" strokeLinecap="round" />
    <path d="M6 44H26C28.2091 44 30 46.2091 30 48.4183C30 50.6274 28.2091 52.4366 26 52.4366C23.7909 52.4366 22 50.6274 22 48.4183" stroke="#38BDF8" strokeWidth="2.5" strokeLinecap="round" />
  </svg>
);

// Map of attraction ID to customized custom SVG icon
export const getAttractionCustomIcon = (attractionId: string, className = 'w-8 h-8') => {
  switch (attractionId) {
    case 'attr-roller-coaster':
    case 'takeshi-dragon-coaster':
    case 'dragon-mountain-coaster':
      return <RollerCoasterIcon className={className} />;
    case 'attr-ferris-wheel':
    case 'takeshi-giant-wheel':
      return <FerrisWheelIcon className={className} />;
    case 'attr-carousel':
    case 'takeshi-magic-carousel':
      return <CarouselIcon className={className} />;
    case 'attr-bumper-cars':
    case 'takeshi-battle-cars':
      return <BumperCarsIcon className={className} />;
    case 'attr-drop-tower':
    case 'takeshi-sky-drop':
      return <DropTowerIcon className={className} />;
    case 'attr-water-splash':
    case 'takeshi-water-maze':
      return <WaterSplashIcon className={className} />;
    default:
      return <TakeshiCastleIcon className={className} />;
  }
};
