
const views = [
    { name: "TartilView", title: "TARTIL", color: "from-cyan-900 to-slate-900" },
    { name: "TarhimView", title: "TARHIM", color: "from-amber-900 to-slate-900" },
    { name: "PreAdzanView", title: "MENJELANG ADZAN", color: "from-red-900 to-slate-900" },
    { name: "AdzanView", title: "ADZAN", color: "from-green-900 to-slate-900" },
    { name: "IqamahView", title: "MENUNGGU IQAMAH", color: "from-orange-900 to-slate-900" },
    { name: "SholatView", title: "SHOLAT BERLANGSUNG", color: "from-black to-slate-950" },
    { name: "ScreenSaverView", title: "SCREENSAVER", color: "from-purple-900 to-slate-900" },
    { name: "JumaatView", title: "JUM'AT", color: "from-teal-900 to-slate-900" },
    { name: "PreKhutbahView", title: "SEBELUM KHUTBAH", color: "from-blue-900 to-slate-900" },
    { name: "KhutbahView", title: "KHUTBAH SEDANG BERLANGSUNG", color: "from-indigo-900 to-slate-900" },
];

const fs = require('fs');
const path = require('path');

const dir = '/home/rus/Code/Tauri/jws-react/src/components/screen/views';

views.forEach(view => {
    const content = `
function ${view.name}() {
    return (
        <div className="flex items-center justify-center h-full w-full bg-gradient-to-br ${view.color} flex-col">
            <h1 className="text-8xl font-bold text-white drop-shadow-2xl text-center">
                ${view.title}
            </h1>
            <p className="text-2xl text-slate-300 mt-8 animate-pulse">
                Mode ${view.name}
            </p>
        </div>
    );
}

export default ${view.name};
`;
    fs.writeFileSync(path.join(dir, `${view.name}.tsx`), content);
});
