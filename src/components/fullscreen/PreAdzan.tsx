import FullScreenLayout from "./FullScreenLayout";
import Countdown from "./Countdown";

function PreAdzan() {
    return (
        <FullScreenLayout title="MENJELANG ADZAN" subtitle="Persiapkan Diri Untuk Sholat">
            <div className="flex flex-col items-center gap-10">
                {/* Animation Placeholder */}
                <div className="w-64 h-64 bg-amber-500/20 rounded-full animate-pulse flex items-center justify-center border-4 border-amber-500/50">
                    <span className="text-amber-500 text-center font-bold">Image<br />Menunggu Adzan</span>
                </div>

                <Countdown minutes={5} seconds={0} label="Menuju Adzan" />
            </div>
        </FullScreenLayout>
    );
}

export default PreAdzan;
