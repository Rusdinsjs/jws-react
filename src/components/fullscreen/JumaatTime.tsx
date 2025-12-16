import FullScreenLayout from "./FullScreenLayout";

function JumaatTime() {
    return (
        <FullScreenLayout title="SHOLAT JUM'AT" subtitle="Selamat Datang Para Jamaah" bgGradient="from-emerald-900 to-teal-900">
            <div className="flex flex-col items-center justify-center gap-10">
                <div className="w-64 h-64 bg-emerald-500/20 rounded-full flex items-center justify-center border-4 border-emerald-500/50 animate-spin-slow">
                    <span className="text-emerald-500 text-center font-bold">Image<br />Masjid</span>
                </div>
                <p className="text-3xl text-white/90 font-light text-center max-w-2xl leading-relaxed">
                    "Wahai orang-orang yang beriman! Apabila telah diseru untuk melaksanakan shalat pada hari Jum'at, maka segeralah kamu mengingat Allah dan tinggalkanlah jual beli."
                    <br />
                    <span className="text-base text-emerald-400 mt-2 block">(QS. Al-Jumu'ah: 9)</span>
                </p>
            </div>
        </FullScreenLayout>
    );
}

export default JumaatTime;
