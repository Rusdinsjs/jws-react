import { useEffect, useState } from "react";
import { LayoutPosition, FullScreenMode } from "../../types/layout";
import { MosqueData } from "../../types/mosque";
import { Slide, TextSlide, MediaSlide } from "../../types/slide";
import { ThemeName, THEME_LIST, getTheme } from "../../types/theme";
import { FontThemeName, FONT_LIST, TimeFontThemeName, TIME_FONT_LIST } from "../../types/fonts";
import { PrayerAudioSettings, DEFAULT_AUDIO_CONFIG } from "../../types/audio";
import { LocationSettings, FullscreenSettings } from "../../services/settingsStore";
import { CALCULATION_METHODS, MADHAB_LIST, TIMEZONE_LIST } from "../../context/PrayerTimesContext";
import { useAudio } from "../../context/AudioContext";
import { useFullscreenScheduler } from "../../context/FullscreenSchedulerContext";
import { MediaUploader } from "./MediaUploader";
import { getAudioDuration } from "../../services/mediaService";
import { exit } from "@tauri-apps/plugin-process";
import { getCurrentWindow } from "@tauri-apps/api/window";

type TabName = "tampilan" | "masjid" | "jadwal" | "slideshow" | "audio" | "fullscreen" | "layout";

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
    timeFontTheme: TimeFontThemeName;
    onTimeFontChange: (name: TimeFontThemeName) => void;
    audioSettings: PrayerAudioSettings;
    onAudioSettingsChange: (settings: PrayerAudioSettings) => void;
    prayerTimeOffsets: Record<string, number>;
    onOffsetsChange: (offsets: Record<string, number>) => void;
    locationSettings: LocationSettings;
    onLocationChange: (settings: LocationSettings) => void;
    fullscreenSettings: FullscreenSettings;
    onFullscreenSettingsChange: (settings: FullscreenSettings) => void;
}

const TABS: { id: TabName; label: string; icon: string }[] = [
    { id: "tampilan", label: "Tampilan", icon: "🎨" },
    { id: "masjid", label: "Masjid", icon: "🕌" },
    { id: "jadwal", label: "Jadwal", icon: "🕰️" },
    { id: "slideshow", label: "Slideshow", icon: "📺" },
    { id: "audio", label: "Audio", icon: "🔊" },
    { id: "fullscreen", label: "Fullscreen", icon: "🖥️" },
    { id: "layout", label: "Layout", icon: "📐" },
];

// Test buttons component for Tartil/Tarhim/Adzan testing
interface TestAudioButtonsProps {
    onFullscreenChange: (mode: FullScreenMode) => void;
    fullscreenMode: FullScreenMode;
    onClose?: () => void;
}

function TestAudioButtons({ onFullscreenChange, fullscreenMode, onClose }: TestAudioButtonsProps) {
    const { audioState, testAudio, stopTest } = useAudio();
    const { manualOverride } = useFullscreenScheduler();
    const [testPrayer, setTestPrayer] = useState("Subuh");

    const prayers = ["Subuh", "Dzuhur", "Ashar", "Maghrib", "Isya"];

    // All fullscreen modes for testing (not Adzan - separate handling)
    const fullscreenModes: { mode: FullScreenMode; label: string; icon: string; color: string }[] = [
        { mode: "IqamahWait", label: "Iqamah", icon: "⏳", color: "purple" },
        { mode: "Sholat", label: "Sholat", icon: "🙏", color: "green" },
        { mode: "PreKhutbah", label: "PreKhutbah", icon: "📜", color: "amber" },
        { mode: "Khutbah", label: "Khutbah", icon: "🎤", color: "orange" },
        { mode: "ScreenSaver", label: "ScreenSaver", icon: "🌙", color: "slate" },
    ];

    // Adzan: trigger audio AND fullscreen with countdown
    const handleTestAdzan = () => {
        console.log(`[Test] Triggering Adzan with audio for ${testPrayer}`);

        // Respect audio settings for test?
        // Let's use forcefully test for "Test Button".
        testAudio("Adzan", testPrayer);

        manualOverride("Adzan", testPrayer); // Start countdown timer via context
        onFullscreenChange("Adzan"); // Update UI state
        if (onClose) onClose(); // Close modal
    };

    const handleTestFullscreen = (mode: FullScreenMode) => {
        console.log(`[Test] Navigating to fullscreen: ${mode} for ${testPrayer}`);
        manualOverride(mode, testPrayer); // Start countdown timer via context
        onFullscreenChange(mode); // Update UI state
        if (onClose) onClose(); // Close modal to show fullscreen
    };

    const handleStopTest = () => {
        stopTest();
        manualOverride("None"); // Stop countdown
        onFullscreenChange("None"); // Update UI state
    };

    const isFullscreenActive = fullscreenMode !== "None";

    return (
        <div className="space-y-4">
            {/* Audio Test Section */}
            <div className="space-y-2">
                <p className="text-xs text-slate-500 uppercase tracking-wide">Audio Test (Info Panel)</p>
                <select
                    value={testPrayer}
                    onChange={(e) => setTestPrayer(e.target.value)}
                    className="w-full bg-slate-700 border border-slate-600 text-white rounded px-3 py-2 text-sm"
                >
                    {prayers.map(p => (
                        <option key={p} value={p}>{p}</option>
                    ))}
                </select>
                <div className="grid grid-cols-2 gap-2">
                    <button
                        onClick={() => testAudio("Tartil", testPrayer)}
                        className={`p-2 rounded-lg transition-all text-sm ${audioState === "Tartil"
                            ? "bg-emerald-500 text-white"
                            : "bg-emerald-500/20 text-emerald-400 hover:bg-emerald-500/40"}`}
                    >
                        🎵 Tartil
                    </button>
                    <button
                        onClick={() => testAudio("Tarhim", testPrayer)}
                        className={`p-2 rounded-lg transition-all text-sm ${audioState === "Tarhim"
                            ? "bg-amber-500 text-white"
                            : "bg-amber-500/20 text-amber-400 hover:bg-amber-500/40"}`}
                    >
                        🔔 Tarhim
                    </button>
                </div>
            </div>

            {/* Fullscreen Test Section */}
            <div className="space-y-2">
                <p className="text-xs text-slate-500 uppercase tracking-wide">Fullscreen Test</p>

                {/* Adzan with Audio */}
                <button
                    onClick={handleTestAdzan}
                    className={`w-full p-2 rounded-lg transition-all text-sm ${fullscreenMode === "Adzan"
                        ? "bg-blue-500 text-white"
                        : "bg-blue-500/20 text-blue-400 hover:bg-blue-500/40"}`}
                >
                    📢 Adzan (dengan Audio)
                </button>

                {/* Other fullscreen modes */}
                <div className="grid grid-cols-3 gap-2">
                    {fullscreenModes.map(({ mode, label, icon, color }) => (
                        <button
                            key={mode}
                            onClick={() => handleTestFullscreen(mode)}
                            className={`p-2 rounded-lg transition-all text-xs ${fullscreenMode === mode
                                ? `bg-${color}-500 text-white`
                                : `bg-${color}-500/20 text-${color}-400 hover:bg-${color}-500/40`}`}
                        >
                            {icon} {label}
                        </button>
                    ))}
                </div>
            </div>

            {/* Stop button */}
            {(audioState !== "Idle" || isFullscreenActive) && (
                <button
                    onClick={handleStopTest}
                    className="w-full p-2 bg-red-500/20 text-red-400 hover:bg-red-500/40 rounded-lg transition-all text-sm"
                >
                    ⏹️ Stop All Tests
                </button>
            )}

            {/* Status indicator */}
            <div className="text-center text-xs text-slate-400">
                Audio: <span className={audioState === "Idle" ? "text-slate-500" : "text-green-400"}>{audioState}</span>
                {isFullscreenActive && <span className="ml-2 text-blue-400">| Screen: {fullscreenMode}</span>}
            </div>
        </div>
    );
}

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
    timeFontTheme,
    onTimeFontChange,
    audioSettings,
    onAudioSettingsChange,
    prayerTimeOffsets,
    onOffsetsChange,
    locationSettings,
    onLocationChange,
    fullscreenSettings,
    onFullscreenSettingsChange
}: SettingsModalProps) {
    const [activeTab, setActiveTab] = useState<TabName>("tampilan");

    // Local state for new slide form
    const [newSlideType, setNewSlideType] = useState<"text" | "image" | "video">("text");
    const [textContent, setTextContent] = useState("");
    const [textFontSize, setTextFontSize] = useState("text-4xl");
    const [textFont, setTextFont] = useState<FontThemeName>("modern");
    const [textIndent, setTextIndent] = useState(0);
    const [textUppercase, setTextUppercase] = useState(false);
    const [textItalic, setTextItalic] = useState(false);
    const [mediaUrl, setMediaUrl] = useState("");
    const [showExitConfirm, setShowExitConfirm] = useState(false);

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
                fontFamily: "'Inter', sans-serif", // Default fixed font for slides
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

                    {/* Window Control Buttons - Icon Only */}
                    <div className="mt-4 pt-4 border-t border-white/10 flex items-center gap-3">
                        <button
                            onClick={onClose}
                            className="p-2 text-slate-400 hover:text-white hover:bg-white/10 rounded-lg transition-colors"
                            title="Tutup (F2)"
                        >
                            <span className="text-xl">✕</span>
                        </button>
                        <button
                            onClick={() => getCurrentWindow().minimize()}
                            className="p-2 text-slate-400 hover:text-white hover:bg-white/10 rounded-lg transition-colors"
                            title="Minimize"
                        >
                            <span className="text-xl">🔽</span>
                        </button>
                        <button
                            onClick={() => setShowExitConfirm(true)}
                            className="p-2 text-red-400 hover:text-red-300 hover:bg-red-500/10 rounded-lg transition-colors"
                            title="Keluar Aplikasi"
                        >
                            <span className="text-xl">⏻</span>
                        </button>
                    </div>
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

                            <div className="border-t border-white/10 my-6"></div>

                            <div>
                                <h3 className="text-2xl font-bold text-white mb-2">Pilih Font Waktu & Jam</h3>
                                <p className="text-slate-400 text-sm mb-6">Pilih jenis huruf khusus untuk tampilan waktu, jam, dan hitung mundur</p>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                {TIME_FONT_LIST.map((f) => (
                                    <button
                                        key={f.name}
                                        onClick={() => onTimeFontChange(f.name as TimeFontThemeName)}
                                        className={`relative rounded-xl p-4 transition-all duration-200 border-2 hover:scale-105 ${timeFontTheme === f.name
                                            ? "border-white ring-2 ring-white/50 bg-white/10"
                                            : "border-slate-700 hover:border-slate-500 bg-slate-800/50"
                                            }`}
                                    >
                                        <span
                                            className="text-2xl block mb-1 text-white text-center font-bold"
                                            style={{ fontFamily: f.family }}
                                        >
                                            12:34:56
                                        </span>
                                        <span
                                            className="text-xs text-slate-400 block text-center"
                                        >
                                            {f.displayName}
                                        </span>

                                        {timeFontTheme === f.name && (
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
                                    <MediaUploader
                                        subfolder="Image"
                                        type="image"
                                        label="Logo Masjid"
                                        value={mosqueData.logo}
                                        onChange={(url) => handleMosqueChange("logo", url)}
                                        placeholder="Pilih file logo..."
                                    />
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Tab: Jadwal */}
                    {activeTab === "jadwal" && (
                        <div className="space-y-6">
                            {/* Location Settings */}
                            <div>
                                <h3 className="text-2xl font-bold text-white mb-2">Koordinat Lokasi</h3>
                                <p className="text-slate-400 text-sm mb-4">Masukkan koordinat untuk perhitungan waktu sholat yang akurat</p>

                                <div className="grid grid-cols-2 gap-4 mb-4">
                                    <div className="space-y-2">
                                        <label className="text-sm text-slate-300">Latitude</label>
                                        <input
                                            type="number"
                                            step="0.0001"
                                            value={locationSettings.latitude}
                                            onChange={(e) => onLocationChange({
                                                ...locationSettings,
                                                latitude: parseFloat(e.target.value) || 0
                                            })}
                                            className="w-full bg-slate-700 border border-slate-600 text-white rounded px-3 py-2"
                                            placeholder="-6.2088"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-sm text-slate-300">Longitude</label>
                                        <input
                                            type="number"
                                            step="0.0001"
                                            value={locationSettings.longitude}
                                            onChange={(e) => onLocationChange({
                                                ...locationSettings,
                                                longitude: parseFloat(e.target.value) || 0
                                            })}
                                            className="w-full bg-slate-700 border border-slate-600 text-white rounded px-3 py-2"
                                            placeholder="106.8456"
                                        />
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <label className="text-sm text-slate-300">Metode Perhitungan</label>
                                    <select
                                        value={locationSettings.calculationMethod}
                                        onChange={(e) => onLocationChange({
                                            ...locationSettings,
                                            calculationMethod: e.target.value
                                        })}
                                        className="w-full bg-slate-700 border border-slate-600 text-white rounded px-3 py-2"
                                    >
                                        {CALCULATION_METHODS.map((method) => (
                                            <option key={method.id} value={method.id}>
                                                {method.label}
                                            </option>
                                        ))}
                                    </select>
                                </div>

                                <div className="grid grid-cols-2 gap-4 mt-4">
                                    <div className="space-y-2">
                                        <label className="text-sm text-slate-300">Timezone</label>
                                        <select
                                            value={locationSettings.timezone || "Asia/Makassar"}
                                            onChange={(e) => onLocationChange({
                                                ...locationSettings,
                                                timezone: e.target.value
                                            })}
                                            className="w-full bg-slate-700 border border-slate-600 text-white rounded px-3 py-2"
                                        >
                                            {TIMEZONE_LIST.map((tz) => (
                                                <option key={tz.id} value={tz.id}>
                                                    {tz.label}
                                                </option>
                                            ))}
                                        </select>
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-sm text-slate-300">Madzhab (Ashar)</label>
                                        <select
                                            value={locationSettings.madhab || "Shafi"}
                                            onChange={(e) => onLocationChange({
                                                ...locationSettings,
                                                madhab: e.target.value
                                            })}
                                            className="w-full bg-slate-700 border border-slate-600 text-white rounded px-3 py-2"
                                        >
                                            {MADHAB_LIST.map((m) => (
                                                <option key={m.id} value={m.id}>
                                                    {m.label}
                                                </option>
                                            ))}
                                        </select>
                                    </div>
                                </div>
                            </div>

                            <hr className="border-white/10" />

                            {/* Offset Settings */}
                            <div>
                                <h3 className="text-2xl font-bold text-white mb-2">Koreksi Jadwal Sholat</h3>
                                <p className="text-slate-400 text-sm mb-6">Sesuaikan waktu sholat jika ada selisih (+/- menit)</p>
                            </div>

                            {/* Global Ihtiati */}
                            <div className="bg-slate-800/50 p-4 rounded-xl border border-white/5 mb-4">
                                <label className="block text-sm font-medium text-slate-300 mb-2">
                                    Ihtiati (Koreksi Global)
                                </label>
                                <div className="flex items-center gap-4">
                                    <input
                                        type="number"
                                        value={locationSettings.ihtiati || 2}
                                        onChange={(e) => onLocationChange({
                                            ...locationSettings,
                                            ihtiati: parseInt(e.target.value) || 0
                                        })}
                                        className="bg-slate-700 border border-slate-600 text-white rounded-lg p-2 w-20 text-center font-bold"
                                    />
                                    <span className="text-slate-400 text-sm">Menit (Ditambahkan ke semua waktu sholat)</span>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 gap-4">
                                {["Imsak", "Subuh", "Syuruq", "Dhuha", "Dzuhur", "Ashar", "Maghrib", "Isya"].map((prayer) => (
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
                                    <MediaUploader
                                        subfolder={newSlideType === "image" ? "Image" : "Video"}
                                        type={newSlideType as "image" | "video"}
                                        value={mediaUrl}
                                        onChange={setMediaUrl}
                                        placeholder={newSlideType === "image" ? "Pilih file gambar..." : "Pilih file video..."}
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

                            {/* Media Tartil & Tarhim */}
                            <div className="space-y-4 bg-slate-800/30 rounded-xl p-4 border border-slate-700">
                                <h4 className="font-semibold text-white">Media Tartil & Tarhim</h4>
                                <p className="text-slate-400 text-sm">
                                    Media (gambar/video) yang ditampilkan di slide saat audio Tartil dan Tarhim diputar
                                </p>

                                <div className="space-y-4">
                                    <div className="bg-teal-500/10 p-3 rounded-lg border border-teal-500/20">
                                        <label className="block text-sm font-medium text-teal-400 mb-2">
                                            📖 Media Tartil
                                        </label>
                                        <MediaUploader
                                            subfolder="Image"
                                            type="image"
                                            value={fullscreenSettings.tartilMediaUrl}
                                            onChange={(url) => onFullscreenSettingsChange({
                                                ...fullscreenSettings,
                                                tartilMediaUrl: url
                                            })}
                                            placeholder="Pilih gambar/video untuk Tartil..."
                                        />
                                    </div>

                                    <div className="bg-amber-500/10 p-3 rounded-lg border border-amber-500/20">
                                        <label className="block text-sm font-medium text-amber-400 mb-2">
                                            🕌 Media Tarhim
                                        </label>
                                        <MediaUploader
                                            subfolder="Image"
                                            type="image"
                                            value={fullscreenSettings.tarhimMediaUrl}
                                            onChange={(url) => onFullscreenSettingsChange({
                                                ...fullscreenSettings,
                                                tarhimMediaUrl: url
                                            })}
                                            placeholder="Pilih gambar/video untuk Tarhim..."
                                        />
                                    </div>
                                </div>
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
                                                            <MediaUploader
                                                                subfolder="Audio"
                                                                type="audio"
                                                                value={config.tartilSrc}
                                                                onChange={(url) => updateConfig("tartilSrc", url)}
                                                                placeholder="Pilih file tartil..."
                                                                showPreview={false}
                                                            />
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
                                                            <MediaUploader
                                                                subfolder="Audio"
                                                                type="audio"
                                                                value={config.tarhimSrc}
                                                                onChange={(url) => {
                                                                    updateConfig("tarhimSrc", url);
                                                                    if (url) {
                                                                        getAudioDuration(url).then(duration => {
                                                                            updateConfig("tarhimDuration", duration);
                                                                        }).catch(err => console.error("Failed to get duration:", err));
                                                                    }
                                                                }}
                                                                placeholder="Pilih file tarhim..."
                                                                showPreview={false}
                                                            />
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
                                                        <div className="flex items-center justify-between mb-3">
                                                            <h5 className="text-sm font-semibold text-green-400 flex items-center gap-2">
                                                                🔊 Adzan (Saat Waktu Sholat)
                                                            </h5>
                                                            <label className="flex items-center gap-2 cursor-pointer">
                                                                <span className="text-xs text-slate-400">Audio Adzan</span>
                                                                <input
                                                                    type="checkbox"
                                                                    checked={config.adzanAudioEnabled}
                                                                    onChange={(e) => {
                                                                        const isEnabled = e.target.checked;
                                                                        onAudioSettingsChange({
                                                                            ...audioSettings,
                                                                            [prayer]: {
                                                                                ...config,
                                                                                adzanAudioEnabled: isEnabled,
                                                                                adzanDuration: !isEnabled ? 300 : config.adzanDuration
                                                                            }
                                                                        });
                                                                    }}
                                                                    className="w-4 h-4 rounded"
                                                                />
                                                            </label>
                                                        </div>

                                                        <div className="grid grid-cols-[1fr_120px] gap-3 mb-2">
                                                            {config.adzanAudioEnabled ? (
                                                                <MediaUploader
                                                                    subfolder="Audio"
                                                                    type="audio"
                                                                    value={config.adzanSrc}
                                                                    onChange={(url) => {
                                                                        updateConfig("adzanSrc", url);
                                                                        if (url) {
                                                                            getAudioDuration(url).then(duration => {
                                                                                updateConfig("adzanDuration", Math.ceil(duration));
                                                                            }).catch(err => console.error("Failed to get duration:", err));
                                                                        }
                                                                    }}
                                                                    placeholder="Pilih file adzan..."
                                                                    showPreview={false}
                                                                />
                                                            ) : (
                                                                <div className="bg-slate-800/50 rounded-lg p-3 text-xs text-slate-500 italic flex items-center">
                                                                    Audio Adzan Dinonaktifkan (Simulasi Visual Saja)
                                                                </div>
                                                            )}
                                                            <div className="space-y-1">
                                                                <label className="text-xs text-slate-400">Durasi (Detik)</label>
                                                                <input
                                                                    type="number"
                                                                    value={config.adzanDuration}
                                                                    onChange={(e) => {
                                                                        if (!config.adzanAudioEnabled) {
                                                                            updateConfig("adzanDuration", Number(e.target.value));
                                                                        }
                                                                    }}
                                                                    disabled={config.adzanAudioEnabled}
                                                                    className={`w-full bg-slate-700 border border-slate-600 text-white rounded px-2 py-1.5 text-sm ${config.adzanAudioEnabled ? 'opacity-50 cursor-not-allowed' : ''}`}
                                                                />
                                                            </div>
                                                        </div>
                                                        <p className="text-xs text-slate-500 italic">
                                                            {config.adzanAudioEnabled
                                                                ? "Audio akan diputar tepat saat waktu sholat."
                                                                : "Hanya menampilkan layar fullscreen saat waktu sholat."}
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

                    {/* Tab: Fullscreen */}
                    {activeTab === "fullscreen" && (
                        <div className="space-y-6">
                            <div>
                                <h3 className="text-2xl font-bold text-white mb-2">Pengaturan Fullscreen</h3>
                                <p className="text-slate-400 text-sm mb-6">Atur durasi tampilan layar penuh untuk setiap waktu sholat</p>
                            </div>

                            <div className="space-y-4">
                                {/* Per-Prayer Duration Settings */}
                                {(["Subuh", "Dzuhur", "Ashar", "Maghrib", "Isya"] as const).map((prayer) => {
                                    const prayerSettings = fullscreenSettings[prayer] || { adzanDuration: 300, iqamahWaitDuration: 600, sholatDuration: 900 };
                                    const updatePrayerSetting = (field: string, value: number) => {
                                        onFullscreenSettingsChange({
                                            ...fullscreenSettings,
                                            [prayer]: { ...prayerSettings, [field]: value }
                                        });
                                    };

                                    return (
                                        <div key={prayer} className="bg-slate-800/50 p-4 rounded-xl border border-white/5">
                                            <h4 className="text-lg font-bold text-white mb-3 flex items-center gap-2">
                                                🕌 {prayer}
                                            </h4>
                                            <div className="grid grid-cols-3 gap-4">
                                                {/* Adzan */}
                                                <div className="space-y-1">
                                                    <label className="text-xs text-slate-400">Adzan</label>
                                                    <div className="flex items-center gap-1">
                                                        <input
                                                            type="number"
                                                            value={Math.floor(prayerSettings.adzanDuration / 60)}
                                                            onChange={(e) => updatePrayerSetting('adzanDuration', Number(e.target.value) * 60)}
                                                            className="w-16 bg-slate-700 border border-slate-600 text-white rounded px-2 py-1 text-center text-sm"
                                                        />
                                                        <span className="text-slate-500 text-xs">mnt</span>
                                                    </div>
                                                </div>
                                                {/* Iqamah */}
                                                <div className="space-y-1">
                                                    <label className="text-xs text-slate-400">Iqamah</label>
                                                    <div className="flex items-center gap-1">
                                                        <input
                                                            type="number"
                                                            value={Math.floor(prayerSettings.iqamahWaitDuration / 60)}
                                                            onChange={(e) => updatePrayerSetting('iqamahWaitDuration', Number(e.target.value) * 60)}
                                                            className="w-16 bg-slate-700 border border-slate-600 text-white rounded px-2 py-1 text-center text-sm"
                                                        />
                                                        <span className="text-slate-500 text-xs">mnt</span>
                                                    </div>
                                                </div>
                                                {/* Sholat */}
                                                <div className="space-y-1">
                                                    <label className="text-xs text-slate-400">Sholat</label>
                                                    <div className="flex items-center gap-1">
                                                        <input
                                                            type="number"
                                                            value={Math.floor(prayerSettings.sholatDuration / 60)}
                                                            onChange={(e) => updatePrayerSetting('sholatDuration', Number(e.target.value) * 60)}
                                                            className="w-16 bg-slate-700 border border-slate-600 text-white rounded px-2 py-1 text-center text-sm"
                                                        />
                                                        <span className="text-slate-500 text-xs">mnt</span>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    );
                                })}

                                <hr className="border-white/10 my-2" />

                                {/* Friday Settings */}
                                <div className="bg-amber-900/20 p-4 rounded-xl border border-amber-500/20">
                                    <h4 className="text-lg font-medium text-amber-400 mb-4">🕌 Pengaturan Jum'at (Dzuhur)</h4>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="space-y-1">
                                            <label className="text-sm text-slate-300">Sebelum Khutbah</label>
                                            <div className="flex items-center gap-2">
                                                <input
                                                    type="number"
                                                    value={Math.floor(fullscreenSettings.preKhutbahDuration / 60)}
                                                    onChange={(e) => onFullscreenSettingsChange({
                                                        ...fullscreenSettings,
                                                        preKhutbahDuration: Number(e.target.value) * 60
                                                    })}
                                                    className="w-20 bg-slate-700 border border-slate-600 text-white rounded px-3 py-2 text-center"
                                                />
                                                <span className="text-slate-400 text-sm">menit</span>
                                            </div>
                                        </div>
                                        <div className="space-y-1">
                                            <label className="text-sm text-slate-300">Durasi Khutbah</label>
                                            <div className="flex items-center gap-2">
                                                <input
                                                    type="number"
                                                    value={Math.floor(fullscreenSettings.khutbahDuration / 60)}
                                                    onChange={(e) => onFullscreenSettingsChange({
                                                        ...fullscreenSettings,
                                                        khutbahDuration: Number(e.target.value) * 60
                                                    })}
                                                    className="w-20 bg-slate-700 border border-slate-600 text-white rounded px-3 py-2 text-center"
                                                />
                                                <span className="text-slate-400 text-sm">menit</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <hr className="border-white/10 my-2" />

                                {/* ScreenSaver Settings */}
                                <div className="bg-slate-800/50 p-4 rounded-xl border border-white/5">
                                    <h4 className="text-lg font-medium text-white mb-4">🌙 Screen Saver</h4>
                                    <div className="flex items-center gap-4">
                                        <div className="flex items-center gap-2">
                                            <label className="text-slate-300 text-sm">Mulai:</label>
                                            <input
                                                type="time"
                                                value={fullscreenSettings.screenSaverStart}
                                                onChange={(e) => onFullscreenSettingsChange({
                                                    ...fullscreenSettings,
                                                    screenSaverStart: e.target.value
                                                })}
                                                className="bg-slate-700 border border-slate-600 text-white rounded px-3 py-2"
                                            />
                                        </div>
                                        <span className="text-slate-400">-</span>
                                        <div className="flex items-center gap-2">
                                            <label className="text-slate-300 text-sm">Selesai:</label>
                                            <input
                                                type="time"
                                                value={fullscreenSettings.screenSaverEnd}
                                                onChange={(e) => onFullscreenSettingsChange({
                                                    ...fullscreenSettings,
                                                    screenSaverEnd: e.target.value
                                                })}
                                                className="bg-slate-700 border border-slate-600 text-white rounded px-3 py-2"
                                            />
                                        </div>
                                    </div>
                                </div>

                                <hr className="border-white/10 my-2" />

                                {/* Tartil/Tarhim Media */}
                                <div className="bg-slate-800/50 p-4 rounded-xl border border-white/5">
                                    <h4 className="text-lg font-medium text-white mb-4">🎵 Media Tartil & Tarhim</h4>
                                    <p className="text-sm text-slate-400 mb-4">URL gambar/video untuk ditampilkan saat Tartil/Tarhim aktif</p>

                                    <div className="space-y-3">
                                        <div className="space-y-1">
                                            <label className="text-sm text-emerald-400">Tartil Media URL</label>
                                            <input
                                                type="text"
                                                value={fullscreenSettings.tartilMediaUrl}
                                                onChange={(e) => onFullscreenSettingsChange({
                                                    ...fullscreenSettings,
                                                    tartilMediaUrl: e.target.value
                                                })}
                                                placeholder="https://example.com/tartil-video.mp4"
                                                className="w-full bg-slate-700 border border-slate-600 text-white rounded px-3 py-2"
                                            />
                                        </div>
                                        <div className="space-y-1">
                                            <label className="text-sm text-amber-400">Tarhim Media URL</label>
                                            <input
                                                type="text"
                                                value={fullscreenSettings.tarhimMediaUrl}
                                                onChange={(e) => onFullscreenSettingsChange({
                                                    ...fullscreenSettings,
                                                    tarhimMediaUrl: e.target.value
                                                })}
                                                placeholder="https://example.com/tarhim-video.mp4"
                                                className="w-full bg-slate-700 border border-slate-600 text-white rounded px-3 py-2"
                                            />
                                        </div>
                                    </div>
                                </div>
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

                                {/* Test Audio Section */}
                                <div className="space-y-3 pt-4 border-t border-white/10">
                                    <label className="block text-sm font-medium text-slate-300">🧪 Test Audio & Display</label>
                                    <TestAudioButtons onFullscreenChange={onFullscreenChange} fullscreenMode={fullscreenMode} onClose={onClose} />
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {/* Exit Confirmation Modal */}
            {
                showExitConfirm && (
                    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[200] flex items-center justify-center">
                        <div className="bg-slate-800 border border-white/10 rounded-2xl p-6 max-w-sm mx-4 shadow-2xl">
                            <h3 className="text-xl font-bold text-white mb-4 text-center">
                                ⚠️ Konfirmasi Keluar
                            </h3>
                            <p className="text-slate-300 text-center mb-6">
                                Apakah Anda yakin untuk mengakhiri aplikasi?
                            </p>
                            <div className="flex gap-3">
                                <button
                                    onClick={() => setShowExitConfirm(false)}
                                    className="flex-1 px-4 py-2.5 bg-slate-700 hover:bg-slate-600 text-white rounded-lg transition-colors"
                                >
                                    Batal
                                </button>
                                <button
                                    onClick={() => exit(0)}
                                    className="flex-1 px-4 py-2.5 bg-red-500 hover:bg-red-600 text-white rounded-lg transition-colors font-semibold"
                                >
                                    Ya, Keluar
                                </button>
                            </div>
                        </div>
                    </div>
                )
            }
        </div >
    );
}

export default SettingsModal;
