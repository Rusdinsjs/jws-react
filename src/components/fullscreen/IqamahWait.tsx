import FullScreenLayout from "./FullScreenLayout";
import Countdown from "./Countdown";
import { useFullscreenScheduler } from "../../context/FullscreenSchedulerContext";

interface IqamahWaitProps {
    bgImage?: string;
}

function IqamahWait({ bgImage }: IqamahWaitProps) {
    const { timeRemaining, currentPrayerName } = useFullscreenScheduler();
    const minutes = Math.floor(timeRemaining / 60);
    const seconds = timeRemaining % 60;

    return (
        <FullScreenLayout
            title="MENUNGGU IQAMAH"
            subtitle={currentPrayerName ? `Sholat ${currentPrayerName}` : "Luruskan dan Rapatkan Shaf"}
            bgImage={bgImage}
        >
            <div className="flex flex-col items-center gap-10">
                {/* Animation - shows when no bgImage */}
                {!bgImage && (
                    <div className="w-64 h-64 bg-blue-500/20 rounded-lg animate-pulse flex items-center justify-center border-4 border-blue-500/50">
                        <span className="text-8xl">🧎</span>
                    </div>
                )}

                <Countdown minutes={minutes} seconds={seconds} label="Iqamah Dalam" />

                <p className="text-3xl text-white/80 font-medium tracking-wide">
                    Luruskan dan Rapatkan Shaf
                </p>
            </div>
        </FullScreenLayout>
    );
}

export default IqamahWait;
