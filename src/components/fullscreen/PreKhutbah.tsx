import FullScreenLayout from "./FullScreenLayout";
import Countdown from "./Countdown";
import { useFullscreenScheduler } from "../../context/FullscreenSchedulerContext";

interface PreKhutbahProps {
    bgImage?: string;
}

function PreKhutbah({ bgImage }: PreKhutbahProps) {
    const { timeRemaining } = useFullscreenScheduler();
    const minutes = Math.floor(timeRemaining / 60);
    const seconds = timeRemaining % 60;

    return (
        <FullScreenLayout
            title="PERSIAPAN KHUTBAH"
            subtitle="Harap Tenang dan Dengarkan Khatib"
            bgGradient="from-teal-900 to-cyan-900"
            bgImage={bgImage}
        >
            <div className="flex flex-col items-center justify-center gap-10">
                {/* Animation - shows when no bgImage */}
                {!bgImage && (
                    <div className="w-64 h-64 bg-teal-500/20 rounded-full flex items-center justify-center border-4 border-teal-500/50 animate-pulse">
                        <span className="text-8xl">📖</span>
                    </div>
                )}

                <Countdown minutes={minutes} seconds={seconds} label="Menuju Khutbah" />

                <p className="text-2xl text-white/90 text-center max-w-2xl">
                    "Barangsiapa yang berbicara pada hari Jum'at ketika imam sedang berkhutbah, meskipun hanya berkata 'diamlah' kepada temannya, maka dia telah berbuat sia-sia."
                    <br />
                    <span className="text-base text-teal-400 mt-2 block">(HR. Bukhari & Muslim)</span>
                </p>
            </div>
        </FullScreenLayout>
    );
}

export default PreKhutbah;
