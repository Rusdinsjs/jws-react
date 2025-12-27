import FullScreenLayout from "./FullScreenLayout";
import Countdown from "./Countdown";
import { useFullscreenScheduler } from "../../context/FullscreenSchedulerContext";

interface SholatProps {
    bgImage?: string;
}

function Sholat({ bgImage }: SholatProps) {
    const { timeRemaining, currentPrayerName } = useFullscreenScheduler();
    const minutes = Math.floor(timeRemaining / 60);
    const seconds = timeRemaining % 60;

    return (
        <FullScreenLayout
            title=""
            bgGradient="from-black via-slate-900 to-black"
            bgImage={bgImage}
        >
            <div className="flex flex-col items-center justify-center gap-10">
                {/* Animation - shows when no bgImage */}
                {!bgImage && (
                    <div className="w-80 h-80 bg-white/5 rounded-full flex items-center justify-center border-2 border-white/10 opacity-50">
                        <span className="text-9xl opacity-50">🤲</span>
                    </div>
                )}

                <div className="text-center">
                    <h2 className="text-5xl text-white font-light tracking-widest mb-4">
                        {currentPrayerName ? `SHOLAT ${currentPrayerName.toUpperCase()}` : "SHOLAT SEDANG BERLANGSUNG"}
                    </h2>
                    <p className="text-2xl text-slate-400">Mohon Nonaktifkan Handphone</p>
                </div>

                <div className="scale-75 opacity-70">
                    <Countdown minutes={minutes} seconds={seconds} label="Estimasi Selesai" />
                </div>
            </div>
        </FullScreenLayout>
    );
}

export default Sholat;
