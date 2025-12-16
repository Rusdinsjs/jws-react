import { useState, useEffect, useRef } from "react";
import DigitalClock from "./screen/DigitalClock";
import SideBar from "./screen/SideBar";
import MainContent from "./screen/MainContent";
import SettingsModal from "./screen/SettingsModal";
import { LayoutPosition, FullScreenMode } from "../types/layout";
import { MosqueData } from "../types/mosque";
import { Slide } from "../types/slide";
import { ThemeName, DEFAULT_THEME, getTheme } from "../types/theme";
import { FontThemeName, DEFAULT_FONT } from "../types/fonts";
import { PrayerAudioSettings } from "../types/audio";
import { ThemeProvider } from "../context/ThemeContext";
import { AudioProvider } from "../context/AudioContext";
import { PrayerTimesProvider } from "../context/PrayerTimesContext";
import { loadSettings, saveSettings } from "../services/settingsStore";
import {
    PreAdzan, Adzan, IqamahWait, Sholat, ScreenSaver,
    JumaatTime, PreKhutbah, Khutbah
} from "./fullscreen";

// Default values
const DEFAULT_MOSQUE_DATA: MosqueData = {
    name: "Masjid Agung Al-Falah",
    address: "Jl. Jend. Sudirman No. 123, Kota Jambi",
    logo: ""
};

const DEFAULT_SLIDES: Slide[] = [
    { type: "text", content: "Selamat Datang di Masjid Agung Al-Falah", fontSize: "large", indent: 0, uppercase: false, italic: false },
    { type: "text", content: "Mari perbanyak ibadah dan kebaikan", fontSize: "medium", indent: 0, uppercase: false, italic: true }
];

function MainScreen() {
    const [isLoading, setIsLoading] = useState(true);
    const [isSettingsOpen, setIsSettingsOpen] = useState(false);
    const [layoutPosition, setLayoutPosition] = useState<LayoutPosition>("Vertical-Left");
    const [fullscreenMode, setFullscreenMode] = useState<FullScreenMode>("None");
    const [mosqueData, setMosqueData] = useState<MosqueData>(DEFAULT_MOSQUE_DATA);
    const [slides, setSlides] = useState<Slide[]>(DEFAULT_SLIDES);
    const [themeName, setThemeName] = useState<ThemeName>(DEFAULT_THEME);
    const [fontTheme, setFontTheme] = useState<FontThemeName>(DEFAULT_FONT);
    const [audioSettings, setAudioSettings] = useState<PrayerAudioSettings>({});
    const [prayerTimeOffsets, setPrayerTimeOffsets] = useState<Record<string, number>>({});

    // Track if initial load is complete
    const isInitialized = useRef(false);

    // Get current theme
    const theme = getTheme(themeName);

    // Load settings on mount
    useEffect(() => {
        loadSettings()
            .then(saved => {
                if (saved) {
                    setLayoutPosition(saved.layoutPosition);
                    setMosqueData(saved.mosqueData);
                    setSlides(saved.slides);
                    if (saved.themeName) setThemeName(saved.themeName);
                    if (saved.fontTheme) setFontTheme(saved.fontTheme);
                    if (saved.audio) setAudioSettings(saved.audio);
                    if (saved.prayerTimeOffsets) setPrayerTimeOffsets(saved.prayerTimeOffsets);
                }
                setIsLoading(false);
                isInitialized.current = true;
            })
            .catch((err) => {
                console.error("Failed to load settings:", err);
                setIsLoading(false);
                isInitialized.current = true;
            });
    }, []);

    // Save settings when they change (after initial load)
    useEffect(() => {
        if (isInitialized.current) {
            saveSettings({
                layoutPosition,
                mosqueData,
                slides,
                themeName,
                fontTheme,
                audio: audioSettings,
                prayerTimeOffsets: prayerTimeOffsets
            })
                .catch(err => console.error("Failed to save settings:", err));
        }
    }, [layoutPosition, mosqueData, slides, themeName, fontTheme, audioSettings, prayerTimeOffsets]);

    // Keyboard shortcuts
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === "F2") {
                setIsSettingsOpen(prev => !prev);
            }
        };

        window.addEventListener("keydown", handleKeyDown);
        return () => window.removeEventListener("keydown", handleKeyDown);
    }, []);

    const isHorizontal = layoutPosition === "Horizontal-Bottom";

    // Show loading state
    if (isLoading) {
        return (
            <div className="h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center">
                <div className="text-white text-2xl">Loading...</div>
            </div>
        );
    }

    return (
        <ThemeProvider initialTheme={themeName} initialFont={fontTheme} onThemeChange={setThemeName} onFontChange={setFontTheme}>
            <PrayerTimesProvider offsets={prayerTimeOffsets}>
                <AudioProvider initialSettings={audioSettings} onSettingsChange={setAudioSettings}>
                    <div className={`h-screen bg-gradient-to-br ${theme.colors.bgGradient} relative overflow-hidden flex ${isHorizontal ? 'flex-col' : 'flex-row'} items-stretch transition-colors duration-500`}>
                        {/* Conditional Rendering based on Layout Position */}

                        {/* Sidebar First if Vertical-Left */}
                        {layoutPosition === "Vertical-Left" && <SideBar position="Vertical-Left" />}

                        <div className="flex-1 h-full relative">
                            <MainContent
                                layoutPosition={layoutPosition}
                                mosqueData={mosqueData}
                                slides={slides}
                                onOpenSettings={() => setIsSettingsOpen(true)}
                            />
                            <DigitalClock layoutPosition={layoutPosition} />
                        </div>

                        {/* Sidebar Second if Vertical-Right */}
                        {layoutPosition === "Vertical-Right" && <SideBar position="Vertical-Right" />}

                        {/* Footer Sidebar if Horizontal-Bottom */}
                        {layoutPosition === "Horizontal-Bottom" && <SideBar position="Horizontal-Bottom" />}

                        {/* Fullscreen Overlays */}
                        {fullscreenMode === "PreAdzan" && <PreAdzan />}
                        {fullscreenMode === "Adzan" && <Adzan />}
                        {fullscreenMode === "IqamahWait" && <IqamahWait />}
                        {fullscreenMode === "Sholat" && <Sholat />}
                        {fullscreenMode === "ScreenSaver" && <ScreenSaver />}
                        {fullscreenMode === "JumaatTime" && <JumaatTime />}
                        {fullscreenMode === "PreKhutbah" && <PreKhutbah />}
                        {fullscreenMode === "Khutbah" && <Khutbah />}

                        <SettingsModal
                            isOpen={isSettingsOpen}
                            onClose={() => setIsSettingsOpen(false)}
                            layoutPosition={layoutPosition}
                            onLayoutChange={setLayoutPosition}
                            fullscreenMode={fullscreenMode}
                            onFullscreenChange={setFullscreenMode}
                            mosqueData={mosqueData}
                            onMosqueDataChange={setMosqueData}
                            slides={slides}
                            onSlidesChange={setSlides}
                            themeName={themeName}
                            onThemeChange={setThemeName}
                            fontTheme={fontTheme}
                            onFontChange={setFontTheme}
                            audioSettings={audioSettings}
                            onAudioSettingsChange={setAudioSettings}
                            prayerTimeOffsets={prayerTimeOffsets}
                            onOffsetsChange={setPrayerTimeOffsets}
                        />
                    </div>
                </AudioProvider>
            </PrayerTimesProvider>
        </ThemeProvider>
    );
}

export default MainScreen;
