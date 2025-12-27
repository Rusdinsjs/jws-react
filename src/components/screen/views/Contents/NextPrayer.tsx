import { useState, useEffect } from "react";
import { useTheme } from "../../../../context/ThemeContext";
import { usePrayerTimes } from "../../../../context/PrayerTimesContext";


interface ViewProps {
    className?: string;
    timezone?: string;
}

function NextPrayer({ className = "", timezone = "Asia/Makassar" }: ViewProps) {
    const { theme } = useTheme();
    // const { clockFontFamily } = useClockFont(); // Removed
    const { prayerTimes, nextPrayerIndex } = usePrayerTimes();
    const [timeLeft, setTimeLeft] = useState<string>("");

    // Get next prayer details
    const nextPrayer = nextPrayerIndex !== -1 ? prayerTimes[nextPrayerIndex] : null;

    useEffect(() => {
        if (!nextPrayer) return;

        const calculateTimeLeft = () => {
            const now = new Date();
            const target = new Date(nextPrayer.time);

            // If measurement is effectively "negative" (passed), handle logic (perhaps show 00:00:00 or switch to next)
            // But usePrayerTimes should theoretically give us the correct "next" one.
            // If target < now, it means usePrayerTimes hasn't updated to next day yet or we are in the moment.

            let diff = target.getTime() - now.getTime();

            if (diff < 0) {
                // Handle passing of time (maybe refetch or wait for hook update)
                diff = 0;
            }

            const hours = Math.floor(diff / (1000 * 60 * 60));
            const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
            const seconds = Math.floor((diff % (1000 * 60)) / 1000);

            const pad = (n: number) => n.toString().padStart(2, '0');
            setTimeLeft(`${pad(hours)}:${pad(minutes)}:${pad(seconds)}`);
        };

        calculateTimeLeft();
        const interval = setInterval(calculateTimeLeft, 1000);

        return () => clearInterval(interval);
    }, [nextPrayer]);

    if (!nextPrayer) {
        return (
            <div className={`flex items-center justify-center h-full w-full ${className}`} style={{ backgroundColor: theme.colors.glassBackground }}>
                <p style={{ color: theme.colors.textMuted }}>Loading...</p>
            </div>
        );
    }

    const formattedTime = new Intl.DateTimeFormat("id-ID", {
        hour: "2-digit",
        minute: "2-digit",
        hour12: false,
        timeZone: timezone
    }).format(nextPrayer.time).replace('.', ':');

    return (
        <div
            className={`flex flex-col items-center justify-center h-full w-full backdrop-blur-md p-6 relative overflow-hidden group ${className}`}
            style={{
                backgroundColor: theme.colors.glassBackground,
            }}
        >
            {/* Animated Background Pulse */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700" />

            {/* Label */}
            <h3
                className="text-xl lg:text-2xl font-bold tracking-widest uppercase mb-4 opacity-80"
                style={{ color: theme.colors.textSecondary }}
            >
                Menuju {nextPrayer.name}
            </h3>

            {/* Countdown Box */}
            <div className="relative z-10 flex flex-col items-center">
                <div
                    className="text-5xl lg:text-7xl font-bold tracking-wider tabular-nums flex items-center justify-center"
                    style={{

                        color: theme.colors.primary,
                        textShadow: `0 0 30px ${theme.colors.primary}60`,
                        fontFamily: "var(--font-family-time)"
                    }}
                >
                    <span className="animate-pulse-slow">{timeLeft || "--:--:--"}</span>
                </div>

                {/* Secondary Info (Actual Time) */}
                <div
                    className="text-center mt-2 text-sm lg:text-base font-medium tracking-wide uppercase"
                    style={{ color: theme.colors.textMuted }}
                >
                    {formattedTime}
                </div>
            </div>


        </div>
    );
}

export default NextPrayer;
