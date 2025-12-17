import FullScreenLayout from "./FullScreenLayout";
import Countdown from "./Countdown";
import { useFullscreenScheduler } from "../../context/FullscreenSchedulerContext";

interface PreAdzanProps {
    bgImage?: string;
}

function PreAdzan({ bgImage }: PreAdzanProps) {
    const { timeRemaining, currentPrayerName } = useFullscreenScheduler();
    const minutes = Math.floor(timeRemaining / 60);
    const seconds = timeRemaining % 60;

    return (
        <FullScreenLayout
            title="MENJELANG ADZAN"
            subtitle={currentPrayerName ? `Bersiap untuk ${currentPrayerName}` : "Persiapkan Diri Untuk Sholat"}
            bgImage={bgImage}
        >
            <div className="flex flex-col items-center gap-10">
                {/* Animation - shows when no bgImage */}
                {!bgImage && (
                    <div className="w-64 h-64 bg-amber-500/20 rounded-full animate-pulse flex items-center justify-center border-4 border-amber-500/50">
                        <span className="text-8xl">⏰</span>
                    </div>
                )}

                <Countdown minutes={minutes} seconds={seconds} label="Menuju Adzan" />
            </div>
        </FullScreenLayout>
    );
}

export default PreAdzan;
