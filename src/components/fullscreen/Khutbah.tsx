import FullScreenLayout from "./FullScreenLayout";
import Countdown from "./Countdown";
import { useFullscreenScheduler } from "../../context/FullscreenSchedulerContext";

interface KhutbahProps {
    bgImage?: string;
}

function Khutbah({ bgImage }: KhutbahProps) {
    const { timeRemaining } = useFullscreenScheduler();
    const minutes = Math.floor(timeRemaining / 60);
    const seconds = timeRemaining % 60;

    return (
        <FullScreenLayout
            title="KHUTBAH JUM'AT"
            bgGradient="from-slate-900 via-stone-900 to-slate-900"
            bgImage={bgImage}
        >
            <div className="flex flex-col items-center gap-10">
                {/* Animation - shows when no bgImage */}
                {!bgImage && (
                    <div className="w-64 h-64 bg-amber-500/10 rounded-lg flex items-center justify-center border-2 border-amber-500/30">
                        <span className="text-8xl">🕋</span>
                    </div>
                )}

                <Countdown minutes={minutes} seconds={seconds} label="Estimasi Durasi Khutbah" />

                <p className="text-2xl text-white/60 font-light italic mt-4">Mohon diam dan mendengarkan</p>
            </div>
        </FullScreenLayout>
    );
}

export default Khutbah;
