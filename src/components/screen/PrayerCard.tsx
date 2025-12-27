import { useTheme } from "../../context/ThemeContext";
import { useClockFont } from "../../context/ClockFontContext";
import {
    Moon,
    Sunrise,
    Sun,
    CloudSun,
    Sunset,
    CloudMoon,
    Stars,
    LucideIcon
} from "lucide-react";

// Map prayer names to icons
const prayerIcons: Record<string, LucideIcon> = {
    "Imsak": Moon,
    "Subuh": Sunrise,
    "Syuruq": Sun,
    "Dhuha": CloudSun,
    "Dzuhur": Sun,
    "Ashar": Sunset,
    "Maghrib": CloudMoon,
    "Isya": Stars
};

interface PrayerCardProps {
    name: string;
    time: Date;
    isNext?: boolean;
    scale?: number;       // General scale (fallback)
    widthScale?: number;  // Specific width scale
    heightScale?: number; // Specific height scale
    contentScale?: number;// Specific text/icon scale
    timezone?: string;    // Timezone for display (e.g., "Asia/Makassar")
}

function PrayerCard({
    name,
    time,
    isNext = false,
    scale = 1,
    widthScale,
    heightScale,
    contentScale,
    timezone = "Asia/Makassar"
}: PrayerCardProps) {
    const { theme } = useTheme();
    const { clockFontFamily } = useClockFont();

    // Determine actual scales (override specific > general > default)
    const wScale = widthScale ?? scale;
    const hScale = heightScale ?? scale;
    const cScale = contentScale ?? scale;

    // Format time HH:mm using configured timezone
    const timeString = new Intl.DateTimeFormat("id-ID", {
        hour: "2-digit",
        minute: "2-digit",
        hour12: false,
        timeZone: timezone
    }).format(time).replace('.', ':');

    // Base Dimensions: 30vw * 0.9 = 27vw, 24vh * 0.95 = 22.8vh
    const baseWidth = 27;
    const baseHeight = 22.8;

    const width = `${baseWidth * wScale}vw`;
    const height = `${baseHeight * hScale}vh`;

    // Icon Size Base: 5rem (w-20)
    const iconSizeRem = 5 * cScale;
    const iconSize = `${iconSizeRem}rem`;

    // Font Size Bases
    const nameFontSize = `${3.2 * cScale}rem`;
    const timeFontSize = `${6.72 * cScale}rem`;

    // Get the appropriate icon for this prayer
    const IconComponent = prayerIcons[name] || Sun;

    return (
        <div
            className={`flex flex-col items-center justify-center rounded-2xl backdrop-blur-md shadow-lg transition-all duration-500 border relative overflow-hidden group ${isNext ? 'scale-105 z-10' : 'hover:scale-102'
                }`}
            style={{
                width,
                height,
                backgroundColor: isNext ? theme.colors.primary + "40" : theme.colors.glassBackground, // darker/lighter glass
                borderColor: isNext ? theme.colors.primary : theme.colors.glassBorder,
                boxShadow: isNext ? `0 0 20px ${theme.colors.primary}40` : "none"
            }}
        >
            {/* Glossy overlay effect */}
            <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent pointer-events-none" />

            {/* Icon - Top Left */}
            <div
                className="absolute top-4 left-4 rounded-full flex items-center justify-center bg-white/10 backdrop-blur-sm"
                style={{
                    color: isNext ? theme.colors.primaryLight : theme.colors.textSecondary,
                    width: iconSize,
                    height: iconSize
                }}
            >
                <IconComponent size={iconSizeRem * 10} strokeWidth={1.5} />
            </div>

            {/* Text Container - Centered */}
            <div className="flex flex-col items-center justify-center z-10 mt-8">
                <h3
                    className="font-bold tracking-wider uppercase mb-2"
                    style={{
                        color: isNext ? theme.colors.textPrimary : theme.colors.textSecondary,
                        fontSize: nameFontSize,
                        lineHeight: "1"
                    }}
                >
                    {name}
                </h3>

                <div
                    className="font-bold tracking-widest"
                    style={{
                        fontFamily: clockFontFamily,
                        color: isNext ? theme.colors.primary : theme.colors.textMuted,
                        fontSize: timeFontSize,
                        lineHeight: "1",
                        fontFamily: "var(--font-family-time)"
                    }}
                >
                    {timeString}
                </div>
            </div>

            {isNext && (
                <div
                    className="absolute top-4 right-4 px-3 py-1 rounded-lg text-sm font-bold uppercase tracking-widest text-white shadow-lg"
                    style={{ backgroundColor: theme.colors.secondary }}
                >
                    Next
                </div>
            )}
        </div>
    );
}

export default PrayerCard;
