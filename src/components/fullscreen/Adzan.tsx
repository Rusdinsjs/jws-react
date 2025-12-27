import FullScreenLayout from "./FullScreenLayout";
import Countdown from "./Countdown";
import { useFullscreenScheduler } from "../../context/FullscreenSchedulerContext";

interface AdzanProps {
    bgImage?: string;
    timeRemaining?: number; // Added for compatibility
}

function Adzan({ bgImage }: AdzanProps) {
    const { timeRemaining, currentPrayerName } = useFullscreenScheduler();
    const minutes = Math.floor(timeRemaining / 60);
    const seconds = timeRemaining % 60;


    return (
        <FullScreenLayout
            title="ADZAN"
            subtitle={currentPrayerName ? `Waktu ${currentPrayerName} Telah Tiba` : undefined}
            bgGradient="from-emerald-900 via-emerald-800 to-emerald-900"
            bgImage={bgImage}
        >
            <div className="flex flex-col items-center gap-10">
                {/* Animation Placeholder - shows when no bgImage */}
                {!bgImage && (
                    <div className="w-64 h-64 bg-emerald-500/20 rounded-full animate-pulse flex items-center justify-center border-4 border-emerald-500/50">
                        <span className="text-8xl">🕌</span>
                    </div>
                )}

                <Countdown minutes={minutes} seconds={seconds} label="Durasi Adzan" />
                <p className="text-4xl text-white font-bold mt-4 animate-pulse">SAATNYA ADZAN BERKUMANDANG</p>
            </div>
        </FullScreenLayout>
    );
}

export default Adzan;
