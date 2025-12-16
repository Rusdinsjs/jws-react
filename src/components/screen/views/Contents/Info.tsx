import { useState, useEffect } from "react";
import { getNextSunnahFasting, getNextIslamicHoliday, IslamicEvent } from "../../../../utils/islamicEvents";
import { useAudio } from "../../../../context/AudioContext";

interface ViewProps {
    className?: string;
}

function Info({ className = "" }: ViewProps) {
    const [event, setEvent] = useState<IslamicEvent | null>(null);
    const [contentMode, setContentMode] = useState<"Fasting" | "Holiday">("Fasting");

    const { audioState, currentPrayerName } = useAudio();

    useEffect(() => {
        // Function to update content
        const updateContent = () => {
            if (contentMode === "Fasting") {
                setEvent(getNextSunnahFasting());
            } else {
                setEvent(getNextIslamicHoliday());
            }
        };

        // Initial load
        updateContent();

        // Toggle mode every 1 minute (60000ms)
        const modeTimer = setInterval(() => {
            setContentMode(prev => prev === "Fasting" ? "Holiday" : "Fasting");
        }, 60000);

        return () => clearInterval(modeTimer);
    }, []);

    // Effect to refresh event when mode changes
    useEffect(() => {
        if (contentMode === "Fasting") {
            setEvent(getNextSunnahFasting());
        } else {
            setEvent(getNextIslamicHoliday());
        }
    }, [contentMode]);


    // Override content if Audio is playing (Tartil/Tarhim/Adzan)
    if (audioState !== "Idle" && currentPrayerName) {
        const isTartil = audioState === "Tartil";
        const isTarhim = audioState === "Tarhim";

        // Color schemes for different states
        const colorScheme = isTartil
            ? { primary: "from-emerald-500 to-teal-600", text: "text-emerald-400", bg: "bg-emerald-500", glow: "rgba(16, 185, 129, 0.5)" }
            : isTarhim
                ? { primary: "from-amber-500 to-orange-600", text: "text-amber-400", bg: "bg-amber-500", glow: "rgba(245, 158, 11, 0.5)" }
                : { primary: "from-blue-500 to-indigo-600", text: "text-blue-400", bg: "bg-blue-500", glow: "rgba(59, 130, 246, 0.5)" };

        return (
            <div className={`bg-gradient-to-br ${colorScheme.primary} p-6 shadow-2xl flex flex-col items-center justify-center h-full w-full relative overflow-hidden ${className}`}>
                {/* Background animated circles */}
                <div className="absolute inset-0 overflow-hidden">
                    <div className="absolute -top-20 -left-20 w-40 h-40 bg-white/10 rounded-full animate-pulse" />
                    <div className="absolute -bottom-10 -right-10 w-32 h-32 bg-white/10 rounded-full animate-pulse" style={{ animationDelay: '0.5s' }} />
                    <div className="absolute top-1/2 left-1/4 w-24 h-24 bg-white/5 rounded-full animate-bounce" style={{ animationDuration: '3s' }} />
                </div>

                <div className="flex flex-col items-center z-10">
                    {/* Status label */}
                    <div className="flex items-center gap-2 mb-3">
                        <span className="w-2 h-2 bg-white rounded-full animate-ping" />
                        <p className="text-white/80 text-lg font-medium tracking-widest uppercase">
                            {isTartil ? "Sedang Berlangsung" : isTarhim ? "Menuju Waktu Sholat" : "Waktu Sholat Tiba"}
                        </p>
                    </div>

                    {/* Main Title */}
                    <h2 className="text-6xl text-white font-black text-center mb-2 tracking-wider"
                        style={{ textShadow: `0 0 30px ${colorScheme.glow}, 0 0 60px ${colorScheme.glow}` }}>
                        {isTartil ? "TARTIL" : isTarhim ? "TARHIM" : "ADZAN"}
                    </h2>

                    {/* Prayer Name */}
                    <div className="bg-white/20 backdrop-blur-sm px-6 py-2 rounded-full mb-4">
                        <p className="text-2xl text-white font-bold text-center">
                            {currentPrayerName}
                        </p>
                    </div>

                    {/* Audio Wave Animation */}
                    <div className="flex gap-1.5 h-12 items-end mt-2">
                        {[...Array(9)].map((_, i) => (
                            <div
                                key={i}
                                className="w-2 bg-white/80 rounded-full"
                                style={{
                                    animation: 'audioWave 0.8s ease-in-out infinite',
                                    animationDelay: `${i * 0.1}s`,
                                    height: `${20 + Math.sin(i * 0.5) * 20}px`
                                }}
                            />
                        ))}
                    </div>

                    {/* Subtitle */}
                    <p className="text-white/60 text-sm mt-4 tracking-wide">
                        {isTartil ? "Persiapkan diri untuk beribadah" :
                            isTarhim ? "Waktu sholat akan segera tiba" :
                                "Hayya 'alash Sholah"}
                    </p>
                </div>

                {/* CSS Animation for audio wave */}
                <style>{`
                    @keyframes audioWave {
                        0%, 100% { transform: scaleY(0.3); }
                        50% { transform: scaleY(1); }
                    }
                `}</style>
            </div>
        );
    }

    if (!event) return null;

    return (
        <div className={`bg-white/10 backdrop-blur-md p-6 shadow-2xl flex flex-col items-center justify-center h-full w-full ${className}`}>
            <p className="text-amber-500 text-[1.31rem] font-semibold tracking-wider uppercase mb-1">
                {event.type === "Fasting" ? "Jadwal Puasa Sunnah" : "Hari Besar Islam Berikutnya"}
            </p>
            <h2 className="text-4xl text-white font-bold text-center mb-1 drop-shadow-md">
                {event.name}
            </h2>
            <p className="text-3xl text-slate-200 font-light text-center">
                {event.date}
            </p>

            {/* Countdown Badge */}
            {event.rawDate && (() => {
                const diffTime = event.rawDate.getTime() - new Date().setHours(0, 0, 0, 0); // Compare dates start of day
                const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

                let countdownText = `${diffDays} Hari Lagi`;
                if (diffDays === 0) countdownText = "Hari Ini";
                if (diffDays === 1) countdownText = "Besok";

                return (
                    <div className="mt-2 mb-1">
                        <span className="bg-amber-500 text-black text-lg font-bold px-3 py-1 rounded-full animate-pulse shadow-lg">
                            {countdownText}
                        </span>
                    </div>
                );
            })()}

            {event.description && (
                <div className="mt-2 bg-black/20 rounded-lg px-4 py-2 border border-white/5">
                    <p className="text-lg text-slate-400 text-center italic">
                        "{event.description}"
                    </p>
                </div>
            )}
        </div>
    );
}

export default Info;
