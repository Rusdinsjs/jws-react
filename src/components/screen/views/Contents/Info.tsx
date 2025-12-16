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


    // Override content if Audio is playing (Tartil/Tarhim)
    if (audioState !== "Idle" && currentPrayerName) {
        return (
            <div className={`bg-white/10 backdrop-blur-md p-6 shadow-2xl flex flex-col items-center justify-center h-full w-full ${className}`}>
                <div className="flex flex-col items-center animate-pulse">
                    <p className="text-teal-400 text-[1.5rem] font-bold tracking-widest uppercase mb-2">
                        {audioState === "Tartil" ? "Sedang Berlangsung" :
                            audioState === "Adzan" ? "Waktu Sholat Telah Tiba" : "Menuju Waktu Sholat"}
                    </p>
                    <h2 className="text-5xl text-white font-bold text-center mb-2 drop-shadow-[0_0_15px_rgba(255,255,255,0.5)]">
                        {audioState === "Tartil" ? "TARTIL" :
                            audioState === "Adzan" ? "ADZAN" : "TARHIM"}
                    </h2>
                    <p className="text-3xl text-slate-200 font-light text-center">
                        {currentPrayerName}
                    </p>

                    {/* Audio Wave Animation Placeholder */}
                    <div className="flex gap-1 mt-6 h-8 items-end">
                        {[...Array(5)].map((_, i) => (
                            <div key={i} className="w-2 bg-teal-500 rounded-full animate-bounce"
                                style={{ animationDelay: `${i * 0.1}s`, height: '100%', animationDuration: '0.8s' }}
                            />
                        ))}
                    </div>
                </div>
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
