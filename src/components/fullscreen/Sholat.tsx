import FullScreenLayout from "./FullScreenLayout";
import Countdown from "./Countdown";

function Sholat() {
    return (
        <FullScreenLayout title="" bgGradient="from-black via-slate-900 to-black">
            <div className="flex flex-col items-center justify-center gap-10 opacity-50">
                {/* Animation Placeholder */}
                <div className="w-80 h-80 bg-white/5 rounded-full flex items-center justify-center border-2 border-white/10">
                    <span className="text-white/50 text-center font-bold">Image<br />Orang Sholat</span>
                </div>

                <div className="text-center">
                    <h2 className="text-4xl text-white font-light tracking-widest mb-4">SHOLAT SEDANG BERLANGSUNG</h2>
                    <p className="text-xl text-slate-500">Mohon Nonaktifkan Handphone</p>
                </div>

                <div className="scale-75 opacity-50">
                    <Countdown minutes={10} seconds={0} label="Estimasi Selesai" />
                </div>
            </div>
        </FullScreenLayout>
    );
}

export default Sholat;
