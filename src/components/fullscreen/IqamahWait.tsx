import FullScreenLayout from "./FullScreenLayout";
import Countdown from "./Countdown";

function IqamahWait() {
    return (
        <FullScreenLayout title="MENUNGGU IQAMAH" subtitle="Luruskan dan Rapatkan Shaf">
            <div className="flex flex-col items-center gap-10">
                {/* Animation Placeholder */}
                <div className="w-64 h-64 bg-blue-500/20 rounded-lg animate-pulse flex items-center justify-center border-4 border-blue-500/50">
                    <span className="text-blue-500 text-center font-bold">Image<br />Tunggu Sholat</span>
                </div>

                <Countdown minutes={10} seconds={0} label="Iqamah Dalam" />
            </div>
        </FullScreenLayout>
    );
}

export default IqamahWait;
