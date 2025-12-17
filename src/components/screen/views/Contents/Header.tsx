import { MosqueData } from "../../../../types/mosque";
import defaultLogo from "../../../../assets/default-logo.svg";

interface ViewProps {
    className?: string;
    data?: MosqueData;
    onOpenSettings?: () => void;
}

function Header({ className = "", data, onOpenSettings }: ViewProps) {
    // Default values if data is missing
    const name = data?.name || "Nama Masjid";
    const address = data?.address || "Alamat Masjid belum diatur";
    const logo = data?.logo || defaultLogo;

    return (
        <div className={`bg-white/10 backdrop-blur-md p-6 shadow-2xl flex items-center h-full w-full ${className}`}>
            <div className="flex items-center w-full gap-6">
                {/* Column 1: Logo */}
                <div
                    className="w-[15%] flex justify-center border-r border-white/10 pr-6 cursor-pointer hover:opacity-80 transition-opacity"
                    onClick={onOpenSettings}
                >
                    {logo ? (
                        <img src={logo} alt="Logo Masjid" className="h-24 w-24 object-contain drop-shadow-lg" />
                    ) : (
                        <div className="h-24 w-24 bg-white/10 rounded-full flex items-center justify-center border-2 border-white/20">
                            <span className="text-white/30 text-xs text-center">No Logo</span>
                        </div>
                    )}
                </div>

                {/* Column 2: Mosque Info */}
                <div className="flex-1 flex flex-col justify-center items-start text-left">
                    <h1 className="text-4xl font-bold text-white tracking-wide drop-shadow-lg mb-1">{name}</h1>
                    <p className="text-xl text-slate-300 font-light tracking-wider opacity-90">{address}</p>
                </div>
            </div>
        </div>
    );
}

export default Header;
