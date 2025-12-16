import FullScreenLayout from "./FullScreenLayout";

function ScreenSaver() {
    return (
        <FullScreenLayout title="" bgGradient="from-indigo-900 via-purple-900 to-indigo-900">
            <div className="flex flex-col items-center justify-center gap-10 animate-pulse">
                {/* Logo/Image Placeholder */}
                <div className="w-96 h-64 bg-white/10 rounded-xl flex items-center justify-center border border-white/20 shadow-2xl">
                    <span className="text-white/80 text-3xl font-bold tracking-widest">LOGO MASJID</span>
                </div>

                <p className="text-2xl text-white/50 tracking-[0.5em] uppercase">Screensaver</p>
            </div>
        </FullScreenLayout>
    );
}

export default ScreenSaver;
