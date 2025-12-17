import FullScreenLayout from "./FullScreenLayout";

interface ScreenSaverProps {
    bgImage?: string;
    logoUrl?: string;
}

function ScreenSaver({ bgImage, logoUrl }: ScreenSaverProps) {
    return (
        <FullScreenLayout
            title=""
            bgGradient="from-indigo-900 via-purple-900 to-indigo-900"
            bgImage={bgImage}
        >
            <div className="flex flex-col items-center justify-center gap-10 animate-pulse">
                {/* Logo or Image */}
                {logoUrl ? (
                    <img
                        src={logoUrl}
                        alt="Logo Masjid"
                        className="w-96 h-auto max-h-64 object-contain drop-shadow-2xl"
                    />
                ) : (
                    <div className="w-96 h-64 bg-white/10 rounded-xl flex items-center justify-center border border-white/20 shadow-2xl">
                        <span className="text-8xl">🕌</span>
                    </div>
                )}

                <p className="text-2xl text-white/50 tracking-[0.5em] uppercase">Screensaver</p>
            </div>
        </FullScreenLayout>
    );
}

export default ScreenSaver;
