import FullScreenLayout from "./FullScreenLayout";
import Countdown from "./Countdown";

interface AdzanProps {
    timeRemaining?: number;
}

function Adzan({ timeRemaining = 300 }: AdzanProps) {
    const minutes = Math.floor(timeRemaining / 60);
    const seconds = timeRemaining % 60;

    return (
        <FullScreenLayout title="ADZAN" bgGradient="from-emerald-900 via-emerald-800 to-emerald-900">
            <div className="flex flex-col items-center gap-10">
                {/* Animation Placeholder */}
                <div className="w-64 h-64 bg-emerald-500/20 rounded-full animate-bounce flex items-center justify-center border-4 border-emerald-500/50">
                    <span className="text-emerald-500 text-center font-bold">Image<br />Adzan</span>
                </div>

                <Countdown minutes={minutes} seconds={seconds} label="Durasi Adzan" />
                <p className="text-4xl text-white font-bold mt-4 animate-pulse">SAATNYA ADZAN BERKUMANDANG</p>
            </div>
        </FullScreenLayout>
    );
}

export default Adzan;
