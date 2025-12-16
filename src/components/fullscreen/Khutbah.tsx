import FullScreenLayout from "./FullScreenLayout";
import Countdown from "./Countdown";

function Khutbah() {
    return (
        <FullScreenLayout title="KHUTBAH JUM'AT" bgGradient="from-slate-900 via-stone-900 to-slate-900">
            <div className="flex flex-col items-center gap-10">
                {/* Animation Placeholder */}
                <div className="w-64 h-64 bg-amber-500/10 rounded-lg flex items-center justify-center border-2 border-amber-500/30">
                    <span className="text-amber-500 text-center font-bold">Image<br />Khatib</span>
                </div>

                <Countdown minutes={15} seconds={0} label="Estimasi Durasi Khutbah" />

                <p className="text-2xl text-white/60 font-light italic mt-4">Mohon diam dan mendengarkan</p>
            </div>
        </FullScreenLayout>
    );
}

export default Khutbah;
