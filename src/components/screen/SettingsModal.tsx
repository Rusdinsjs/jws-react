import { useEffect, useState } from "react";
import { LayoutPosition, FullScreenMode } from "../../types/layout";
import { MosqueData } from "../../types/mosque";
import { Slide, TextSlide, MediaSlide } from "../../types/slide";
import { ThemeName, THEME_LIST, getTheme } from "../../types/theme";
import { FontThemeName, FONT_LIST } from "../../types/fonts";
import { PrayerAudioSettings, DEFAULT_AUDIO_CONFIG } from "../../types/audio";

type TabName = "tampilan" | "masjid" | "jadwal" | "slideshow" | "layout" | "audio";

interface SettingsModalProps {
    isOpen: boolean;
    onClose: () => void;
    layoutPosition: LayoutPosition;
    onLayoutChange: (position: LayoutPosition) => void;
    fullscreenMode: FullScreenMode;
    onFullscreenChange: (mode: FullScreenMode) => void;
    mosqueData: MosqueData;
    onMosqueDataChange: (data: MosqueData) => void;
    slides: Slide[];
    onSlidesChange: (slides: Slide[]) => void;
    themeName: ThemeName;
    onThemeChange: (name: ThemeName) => void;
    fontTheme: FontThemeName;
    onFontChange: (name: FontThemeName) => void;
    audioSettings: PrayerAudioSettings;
    onAudioSettingsChange: (settings: PrayerAudioSettings) => void;
    prayerTimeOffsets: Record<string, number>;
    onOffsetsChange: (offsets: Record<string, number>) => void;
}

const TABS: { id: TabName; label: string; icon: string }[] = [
    { id: "tampilan", label: "Tampilan", icon: "🎨" },
    { id: "masjid", label: "Masjid", icon: "🕌" },
    { id: "jadwal", label: "Jadwal", icon: "🕰️" },
    { id: "slideshow", label: "Slideshow", icon: "📺" },
    { id: "audio", label: "Audio", icon: "🔊" },
    { id: "layout", label: "Layout", icon: "📐" },
];

function SettingsModal({
    isOpen,
    onClose,
    layoutPosition,
    onLayoutChange,
    fullscreenMode,
    onFullscreenChange,
    mosqueData,
    onMosqueDataChange,
    slides,
    onSlidesChange,
    themeName,
    onThemeChange,
    fontTheme,
    onFontChange,
    audioSettings,
    onAudioSettingsChange,
    prayerTimeOffsets,
    onOffsetsChange
}: SettingsModalProps) {
    const [activeTab, setActiveTab] = useState<TabName>("tampilan");

    // Local state for new slide form
    const [newSlideType, setNewSlideType] = useState<"text" | "image" | "video">("text");
    const [textContent, setTextContent] = useState("");
    const [textFontSize, setTextFontSize] = useState("text-4xl");
    const [textFont, setTextFont] = useState<FontThemeName>("inter");
    const [textIndent, setTextIndent] = useState(0);
    const [textUppercase, setTextUppercase] = useState(false);
    const [textItalic, setTextItalic] = useState(false);
    const [mediaUrl, setMediaUrl] = useState("");

    const currentTheme = getTheme(themeName);

    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === "F2") {
                onClose();
            }
        };

        window.addEventListener("keydown", handleKeyDown);
        return () => window.removeEventListener("keydown", handleKeyDown);
    }, [onClose]);

    if (!isOpen) return null;

    const handleMosqueChange = (field: keyof MosqueData, value: string) => {
        onMosqueDataChange({
            ...mosqueData,
            [field]: value
        });
    };

    const addSlide = () => {
        if (newSlideType === "text") {
            if (!textContent.trim()) return;
            const newSlide: TextSlide = {
                type: "text",
                content: textContent,
                fontSize: textFontSize,
                fontFamily: "inherit",
                indent: textIndent,
                uppercase: textUppercase,
                italic: textItalic
            };

            const selectedFont = FONT_LIST.find(f => f.name === textFont);
            if (selectedFont) {
                newSlide.fontFamily = selectedFont.family;
            }

            onSlidesChange([...slides, newSlide]);
            setTextContent("");
        } else {
            if (!mediaUrl.trim()) return;
            const newSlide: MediaSlide = {
                type: newSlideType,
                src: mediaUrl
            };
            onSlidesChange([...slides, newSlide]);
            setMediaUrl("");
        }
    };

    const removeSlide = (index: number) => {
        onSlidesChange(slides.filter((_, i) => i !== index));
    };

    return (
        <div className="absolute top-0 left-0 h-full w-[50%] bg-black/30 backdrop-blur-md z-[100] border-r shadow-2xl transition-all duration-300"
            style={{ borderColor: currentTheme.colors.glassBorder }}
        >
            <div className="flex h-full">
                {/* Sidebar Tabs */}
                <div className="w-48 bg-black/20 border-r border-white/10 p-4 flex flex-col">
                    <h2 className="text-xl font-bold text-white mb-6 px-2">Settings</h2>

                    <nav className="space-y-1 flex-1">
                        {TABS.map((tab) => (
                            <button
                                key={tab.id}
                                onClick={() => setActiveTab(tab.id)}
                                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-left transition-all duration-200 ${activeTab === tab.id
                                    ? "text-white"
                                    : "text-slate-400 hover:text-white hover:bg-white/5"
                                    }`}
                                style={activeTab === tab.id ? {
                                    backgroundColor: currentTheme.colors.primary + "30",
                                    borderLeft: `3px solid ${currentTheme.colors.primary}`
                                } : {}}
                            >
                                <span className="text-lg">{tab.icon}</span>
                                <span className="font-medium">{tab.label}</span>
                            </button>
                        ))}
                    </nav>

                    <button
                        onClick={onClose}
                        className="mt-auto flex items-center gap-2 px-3 py-2 text-slate-400 hover:text-white transition-colors"
                    >
                        <span>✕</span>
                        <span className="text-sm">Tutup (F2)</span>
                    </button>
                </div>

                {/* Content Area */}
                <div className="flex-1 p-6 overflow-y-auto">
                    {/* Tab: Tampilan */}
                    {activeTab === "tampilan" && (
                        <div className="space-y-6">
                            <div>
                                <h3 className="text-2xl font-bold text-white mb-2">Pilih Tema</h3>
                                <p className="text-slate-400 text-sm mb-6">Pilih tema yang sesuai dengan suasana masjid Anda</p>
                            </div>

                            <div className="grid grid-cols-3 gap-4">
                                {THEME_LIST.map((t) => (
                                    <button
                                        key={t.name}
                                        onClick={() => onThemeChange(t.name)}
                                        className={`relative rounded-xl p-3 transition-all duration-200 border-2 hover:scale-105 ${themeName === t.name
                                            ? "border-white ring-2 ring-white/50 scale-105"
                                            : "border-transparent hover:border-white/30"
                                            }`}
                                        style={{ backgroundColor: "rgba(0,0,0,0.3)" }}
                                    >
                                        <div className={`h-16 rounded-lg bg-gradient-to-br ${t.colors.bgGradient} mb-2`} />
                                        <span
                                            className="text-sm font-semibold block text-center"
                                            style={{ color: t.colors.primary }}
                                        >
                                            {t.displayName}
                                        </span>
                                        {themeName === t.name && (
                                            <div
                                                className="absolute -top-2 -right-2 w-6 h-6 rounded-full flex items-center justify-center text-xs text-white font-bold"
                                                style={{ backgroundColor: t.colors.primary }}
                                            >
                                                ✓
                                            </div>
                                        )}
                                    </button>
                                ))}
                            </div>

                            <div className="border-t border-white/10 my-6"></div>

                            <div>
                                <h3 className="text-2xl font-bold text-white mb-2">Pilih Font</h3>
                                <p className="text-slate-400 text-sm mb-6">Pilih jenis huruf untuk tampilan utama</p>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                {FONT_LIST.map((f) => (
                                    <button
                                        key={f.name}
                                        onClick={() => onFontChange(f.name)}
                                        className={`relative rounded-xl p-4 transition-all duration-200 border-2 hover:scale-105 ${fontTheme === f.name
                                            ? "border-white ring-2 ring-white/50 bg-white/10"
                                            : "border-slate-700 hover:border-slate-500 bg-slate-800/50"
                                            }`}
                                    >
                                        <span
                                            className="text-lg block mb-1 text-white"
                                            style={{ fontFamily: f.family }}
                                        >
                                            {f.displayName}
                                        </span>
                                        <span
                                            className="text-sm text-slate-400 block"
                                            style={{ fontFamily: f.family }}
                                        >
                                            12:34 - Subuh
                                        </span>

                                        {fontTheme === f.name && (
                                            <div
                                                className="absolute -top-2 -right-2 w-6 h-6 rounded-full flex items-center justify-center text-xs text-white font-bold"
                                                style={{ backgroundColor: currentTheme.colors.primary }}
                                            >
                                                ✓
                                            </div>
                                        )}
                                    </button>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Tab: Masjid */}
                    {activeTab === "masjid" && (
                        <div className="space-y-6">
                            <div>
                                <h3 className="text-2xl font-bold text-white mb-2">Identitas Masjid</h3>
                                <p className="text-slate-400 text-sm mb-6">Informasi masjid yang akan ditampilkan</p>
                            </div>

                            <div className="space-y-4">
                                <div className="space-y-2">
                                    <label className="block text-sm font-medium text-slate-300">Nama Masjid</label>
                                    <input
                                        type="text"
                                        value={mosqueData.name}
                                        onChange={(e) => handleMosqueChange("name", e.target.value)}
                                        className="w-full bg-slate-800/80 border border-slate-600 text-white rounded-lg p-3 focus:ring-2 focus:border-transparent placeholder-slate-500"
                                        style={{ "--tw-ring-color": currentTheme.colors.primary } as React.CSSProperties}
                                        placeholder="Masjid Agung..."
                                    />
                                </div>

                                <div className="space-y-2">
                                    <label className="block text-sm font-medium text-slate-300">Alamat Masjid</label>
                                    <textarea
                                        value={mosqueData.address}
                                        onChange={(e) => handleMosqueChange("address", e.target.value)}
                                        className="w-full bg-slate-800/80 border border-slate-600 text-white rounded-lg p-3 focus:ring-2 focus:border-transparent placeholder-slate-500"
                                        rows={3}
                                        placeholder="Jl. ..."
                                    />
                                </div>

                                <div className="space-y-2">
                                    <label className="block text-sm font-medium text-slate-300">URL Logo</label>
                                    <input
                                        type="text"
                                        value={mosqueData.logo}
                                        onChange={(e) => handleMosqueChange("logo", e.target.value)}
                                        className="w-full bg-slate-800/80 border border-slate-600 text-white rounded-lg p-3 focus:ring-2 focus:border-transparent placeholder-slate-500"
                                        placeholder="https://example.com/logo.png"
                                    />
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Tab: Jadwal */}
                    {activeTab === "jadwal" && (
                        <div className="space-y-6">
                            <div>
                                <h3 className="text-2xl font-bold text-white mb-2">Koreksi Jadwal Sholat</h3>
                                <p className="text-slate-400 text-sm mb-6">Sesuaikan waktu sholat jika ada selisih (+/- menit)</p>
                            </div>

                            <div className="grid grid-cols-1 gap-4">
                                {["Subuh", "Syuruq", "Dzuhur", "Ashar", "Maghrib", "Isya"].map((prayer) => (
                                    <div key={prayer} className="flex items-center justify-between bg-slate-800/50 p-4 rounded-xl border border-white/5">
                                        <span className="text-lg font-medium text-white">{prayer}</span>
                                        <div className="flex items-center gap-4">
                                            <button
                                                onClick={() => onOffsetsChange({ ...prayerTimeOffsets, [prayer]: (prayerTimeOffsets[prayer] || 0) - 1 })}
                                                className="w-8 h-8 rounded-full bg-red-500/20 text-red-400 hover:bg-red-500 hover:text-white transition-colors flex items-center justify-center font-bold text-lg"
                                            >
                                                -
                                            </button>
                                            <span className={`w-12 text-center font-mono font-bold text-xl ${(prayerTimeOffsets[prayer] || 0) === 0 ? "text-slate-400" :
                                                    (prayerTimeOffsets[prayer] || 0) > 0 ? "text-green-400" : "text-red-400"
                                                }`}>
                                                {(prayerTimeOffsets[prayer] || 0) > 0 ? "+" : ""}
                                                {prayerTimeOffsets[prayer] || 0}
                                            </span>
                                            <button
                                                onClick={() => onOffsetsChange({ ...prayerTimeOffsets, [prayer]: (prayerTimeOffsets[prayer] || 0) + 1 })}
                                                className="w-8 h-8 rounded-full bg-green-500/20 text-green-400 hover:bg-green-500 hover:text-white transition-colors flex items-center justify-center font-bold text-lg"
                                            >
                                                +
                                            </button>
                                            <span className="text-xs text-slate-500 w-10">Menit</span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Tab: Slideshow */}
                    {activeTab === "slideshow" && (
                        <div className="space-y-6">
                            <div>
                                <h3 className="text-2xl font-bold text-white mb-2">Pengaturan Slideshow</h3>
                                <p className="text-slate-400 text-sm mb-6">Kelola slide yang ditampilkan di layar utama</p>
                            </div>

                            {/* Current Slides */}
                            <div className="space-y-3">
                                <label className="block text-sm font-medium text-slate-300">
                                    Slide Saat Ini ({slides.length})
                                </label>
                                <div className="max-h-48 overflow-y-auto space-y-2 bg-slate-800/50 rounded-lg p-3">
                                    {slides.length === 0 ? (
                                        <p className="text-slate-500 text-center py-4">Belum ada slide</p>
                                    ) : (
                                        slides.map((slide, idx) => (
                                            <div key={idx} className="flex items-center justify-between bg-slate-700/50 rounded-lg px-3 py-2">
                                                <span className="text-sm truncate flex-1 text-slate-200">
                                                    {slide.type === "text" ? `📝 ${slide.content.slice(0, 40)}${slide.content.length > 40 ? '...' : ''}` :
                                                        slide.type === "image" ? `🖼️ Image` : `🎬 Video`}
                                                </span>
                                                <button
                                                    onClick={() => removeSlide(idx)}
                                                    className="text-red-400 hover:text-red-300 text-sm ml-3 px-2 py-1 rounded hover:bg-red-400/20 transition-colors"
                                                >
                                                    Hapus
                                                </button>
                                            </div>
                                        ))
                                    )}
                                </div>
                            </div>

                            {/* Add New Slide */}
                            <div className="space-y-4 bg-slate-800/30 rounded-xl p-4 border border-slate-700">
                                <h4 className="font-semibold text-white">Tambah Slide Baru</h4>

                                <select
                                    value={newSlideType}
                                    onChange={(e) => setNewSlideType(e.target.value as "text" | "image" | "video")}
                                    className="w-full bg-slate-700 border border-slate-600 text-white rounded-lg p-2.5"
                                >
                                    <option value="text" className="bg-slate-700">Text</option>
                                    <option value="image" className="bg-slate-700">Image (URL)</option>
                                    <option value="video" className="bg-slate-700">Video (URL)</option>
                                </select>

                                {newSlideType === "text" ? (
                                    <div className="space-y-3">
                                        <textarea
                                            value={textContent}
                                            onChange={(e) => setTextContent(e.target.value)}
                                            className="w-full bg-slate-700 border border-slate-600 text-white rounded-lg p-3"
                                            rows={3}
                                            placeholder="Isi teks slide..."
                                        />
                                        <div className="grid grid-cols-2 gap-3">
                                            <select
                                                value={textFontSize}
                                                onChange={(e) => setTextFontSize(e.target.value)}
                                                className="bg-slate-700 border border-slate-600 text-white rounded-lg p-2"
                                            >
                                                <option value="text-sm" className="bg-slate-700">Small</option>
                                                <option value="text-base" className="bg-slate-700">Normal</option>
                                                <option value="text-lg" className="bg-slate-700">Large</option>
                                                <option value="text-xl" className="bg-slate-700">XL</option>
                                                <option value="text-2xl" className="bg-slate-700">2XL</option>
                                                <option value="text-4xl" className="bg-slate-700">4XL</option>
                                                <option value="text-6xl" className="bg-slate-700">6XL</option>
                                            </select>

                                            <select
                                                value={textFont}
                                                onChange={(e) => setTextFont(e.target.value as FontThemeName)}
                                                className="bg-slate-700 border border-slate-600 text-white rounded-lg p-2"
                                            >
                                                {FONT_LIST.map(f => (
                                                    <option key={f.name} value={f.name} className="bg-slate-700">
                                                        {f.displayName}
                                                    </option>
                                                ))}
                                            </select>
                                        </div>

                                        <div className="grid grid-cols-1 gap-3">
                                            <input
                                                type="number"
                                                value={textIndent}
                                                onChange={(e) => setTextIndent(Number(e.target.value))}
                                                className="bg-slate-700 border border-slate-600 text-white rounded-lg p-2 w-full"
                                                placeholder="Indent (px)"
                                                min={0}
                                                max={100}
                                            />
                                        </div>
                                        <div className="flex gap-6">
                                            <label className="flex items-center gap-2 text-slate-300">
                                                <input
                                                    type="checkbox"
                                                    checked={textUppercase}
                                                    onChange={(e) => setTextUppercase(e.target.checked)}
                                                    className="rounded"
                                                />
                                                UPPERCASE
                                            </label>
                                            <label className="flex items-center gap-2 text-slate-300">
                                                <input
                                                    type="checkbox"
                                                    checked={textItalic}
                                                    onChange={(e) => setTextItalic(e.target.checked)}
                                                    className="rounded"
                                                />
                                                Italic
                                            </label>
                                        </div>
                                    </div>
                                ) : (
                                    <input
                                        type="text"
                                        value={mediaUrl}
                                        onChange={(e) => setMediaUrl(e.target.value)}
                                        className="w-full bg-slate-700 border border-slate-600 text-white rounded-lg p-3"
                                        placeholder={newSlideType === "image" ? "https://example.com/image.jpg" : "https://example.com/video.mp4"}
                                    />
                                )}

                                <button
                                    onClick={addSlide}
                                    className="w-full text-white rounded-lg py-3 font-semibold transition-all hover:opacity-90 hover:scale-[1.02]"
                                    style={{ backgroundColor: currentTheme.colors.primary }}
                                >
                                    + Tambah Slide
                                </button>
                            </div>
                        </div>
                    )}

                    {/* Tab: Audio */}
                    {activeTab === "audio" && (
                        <div className="space-y-6">
                            <div>
                                <h3 className="text-2xl font-bold text-white mb-2">Pengaturan Audio</h3>
                                <p className="text-slate-400 text-sm mb-6">Atur file audio Tartil dan Tarhim untuk setiap waktu sholat</p>
                            </div>

                            <div className="space-y-6">
                                {["Subuh", "Dzuhur", "Ashar", "Maghrib", "Isya"].map((prayer) => {
                                    const config = audioSettings[prayer] || { ...DEFAULT_AUDIO_CONFIG };

                                    const updateConfig = (key: keyof typeof config, value: any) => {
                                        onAudioSettingsChange({
                                            ...audioSettings,
                                            [prayer]: { ...config, [key]: value }
                                        });
                                    };

                                    return (
                                        <div key={prayer} className="bg-slate-800/50 rounded-xl p-4 border border-white/10">
                                            <div className="flex items-center justify-between mb-4">
                                                <h4 className="text-lg font-bold text-white">{prayer}</h4>
                                                <label className="flex items-center gap-2 cursor-pointer">
                                                    <span className="text-sm text-slate-300">Aktifkan Audio</span>
                                                    <input
                                                        type="checkbox"
                                                        checked={config.enabled}
                                                        onChange={(e) => updateConfig("enabled", e.target.checked)}
                                                        className="toggle rounded"
                                                    />
                                                </label>
                                            </div>

                                            {config.enabled && (
                                                <div className="space-y-4">
                                                    {/* Tartil Section */}
                                                    <div className="bg-slate-900/30 p-3 rounded-lg border border-white/5">
                                                        <h5 className="text-sm font-semibold text-teal-400 mb-3 flex items-center gap-2">
                                                            📖 Tartil (Sebelum Tarhim)
                                                        </h5>
                                                        <div className="grid grid-cols-[1fr_120px] gap-3 mb-2">
                                                            <div className="space-y-1">
                                                                <label className="text-xs text-slate-400">URL File Audio</label>
                                                                <input
                                                                    type="text"
                                                                    value={config.tartilSrc}
                                                                    onChange={(e) => updateConfig("tartilSrc", e.target.value)}
                                                                    className="w-full bg-slate-700 border border-slate-600 text-white rounded px-2 py-1.5 text-sm"
                                                                    placeholder="/audio/tartil-subuh.mp3"
                                                                />
                                                            </div>
                                                            <div className="space-y-1">
                                                                <label className="text-xs text-slate-400">Mulai (Menit)</label>
                                                                <input
                                                                    type="number"
                                                                    value={config.tartilOffset}
                                                                    onChange={(e) => updateConfig("tartilOffset", Number(e.target.value))}
                                                                    className="w-full bg-slate-700 border border-slate-600 text-white rounded px-2 py-1.5 text-sm"
                                                                />
                                                            </div>
                                                        </div>
                                                        <p className="text-xs text-slate-500 italic">
                                                            Diputar {config.tartilOffset} menit sebelum waktu sholat.
                                                        </p>
                                                    </div>

                                                    {/* Tarhim Section */}
                                                    <div className="bg-slate-900/30 p-3 rounded-lg border border-white/5">
                                                        <h5 className="text-sm font-semibold text-amber-400 mb-3 flex items-center gap-2">
                                                            🕌 Tarhim (Menjelang Adzan)
                                                        </h5>
                                                        <div className="grid grid-cols-[1fr_120px] gap-3 mb-2">
                                                            <div className="space-y-1">
                                                                <label className="text-xs text-slate-400">URL File Audio</label>
                                                                <input
                                                                    type="text"
                                                                    value={config.tarhimSrc}
                                                                    onChange={(e) => updateConfig("tarhimSrc", e.target.value)}
                                                                    className="w-full bg-slate-700 border border-slate-600 text-white rounded px-2 py-1.5 text-sm"
                                                                    placeholder="/audio/tarhim-subuh.mp3"
                                                                />
                                                            </div>
                                                            <div className="space-y-1">
                                                                <label className="text-xs text-slate-400">Durasi (Detik)</label>
                                                                <input
                                                                    type="number"
                                                                    value={config.tarhimDuration}
                                                                    onChange={(e) => updateConfig("tarhimDuration", Number(e.target.value))}
                                                                    className="w-full bg-slate-700 border border-slate-600 text-white rounded px-2 py-1.5 text-sm"
                                                                />
                                                            </div>
                                                        </div>
                                                        <p className="text-xs text-slate-500 italic">
                                                            Diputar {Math.floor(config.tarhimDuration / 60)} menit {config.tarhimDuration % 60} detik sebelum waktu sholat.
                                                        </p>
                                                    </div>

                                                    {/* Adzan Section */}
                                                    <div className="bg-slate-900/30 p-3 rounded-lg border border-white/5">
                                                        <h5 className="text-sm font-semibold text-green-400 mb-3 flex items-center gap-2">
                                                            🔊 Adzan (Saat Waktu Sholat)
                                                        </h5>
                                                        <div className="grid grid-cols-[1fr_120px] gap-3 mb-2">
                                                            <div className="space-y-1">
                                                                <label className="text-xs text-slate-400">URL File Audio</label>
                                                                <input
                                                                    type="text"
                                                                    value={config.adzanSrc}
                                                                    onChange={(e) => updateConfig("adzanSrc", e.target.value)}
                                                                    className="w-full bg-slate-700 border border-slate-600 text-white rounded px-2 py-1.5 text-sm"
                                                                    placeholder="/audio/adzan.mp3"
                                                                />
                                                            </div>
                                                            <div className="space-y-1">
                                                                <label className="text-xs text-slate-400">Durasi (Detik)</label>
                                                                <input
                                                                    type="number"
                                                                    value={config.adzanDuration}
                                                                    onChange={(e) => updateConfig("adzanDuration", Number(e.target.value))}
                                                                    className="w-full bg-slate-700 border border-slate-600 text-white rounded px-2 py-1.5 text-sm"
                                                                />
                                                            </div>
                                                        </div>
                                                        <p className="text-xs text-slate-500 italic">
                                                            Diputar tepat saat waktu sholat tiba.
                                                        </p>
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    )}

                    {/* Tab: Layout */}
                    {activeTab === "layout" && (
                        <div className="space-y-6">
                            <div>
                                <h3 className="text-2xl font-bold text-white mb-2">Pengaturan Layout</h3>
                                <p className="text-slate-400 text-sm mb-6">Atur posisi dan tampilan layar</p>
                            </div>

                            <div className="space-y-6">
                                <div className="space-y-3">
                                    <label className="block text-sm font-medium text-slate-300">Posisi Layout</label>
                                    <div className="grid grid-cols-3 gap-3">
                                        {[
                                            { value: "Vertical-Left", label: "Kiri", icon: "◀️" },
                                            { value: "Vertical-Right", label: "Kanan", icon: "▶️" },
                                            { value: "Horizontal-Bottom", label: "Bawah", icon: "🔽" },
                                        ].map((option) => (
                                            <button
                                                key={option.value}
                                                onClick={() => onLayoutChange(option.value as LayoutPosition)}
                                                className={`p-4 rounded-xl border-2 transition-all ${layoutPosition === option.value
                                                    ? "border-white bg-white/10"
                                                    : "border-slate-600 hover:border-slate-500"
                                                    }`}
                                            >
                                                <div className="text-2xl mb-2">{option.icon}</div>
                                                <div className="text-sm text-white font-medium">{option.label}</div>
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                <div className="space-y-3">
                                    <label className="block text-sm font-medium text-slate-300">Preview Fullscreen Mode</label>
                                    <select
                                        value={fullscreenMode}
                                        onChange={(e) => onFullscreenChange(e.target.value as FullScreenMode)}
                                        className="w-full bg-slate-800 border border-slate-600 text-white rounded-lg p-3"
                                    >
                                        <option value="None" className="bg-slate-800">None (Normal View)</option>
                                        <option value="PreAdzan" className="bg-slate-800">Pre-Adzan</option>
                                        <option value="Adzan" className="bg-slate-800">Adzan</option>
                                        <option value="IqamahWait" className="bg-slate-800">Menunggu Iqamah</option>
                                        <option value="Sholat" className="bg-slate-800">Sedang Sholat</option>
                                        <option value="ScreenSaver" className="bg-slate-800">Screen Saver</option>
                                        <option value="JumaatTime" className="bg-slate-800">Sholat Jum'at</option>
                                        <option value="PreKhutbah" className="bg-slate-800">Persiapan Khutbah</option>
                                        <option value="Khutbah" className="bg-slate-800">Sedang Khutbah</option>
                                    </select>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

export default SettingsModal;
