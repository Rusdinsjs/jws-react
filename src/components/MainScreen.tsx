import { useState, useEffect, useRef } from "react";
import DigitalClock from "./screen/DigitalClock";
import SideBar from "./screen/SideBar";
import MainContent from "./screen/MainContent";
import SettingsModal from "./screen/SettingsModal";
import { LayoutPosition, FullScreenMode } from "../types/layout";
import { MosqueData } from "../types/mosque";
import { Slide } from "../types/slide";
import { ThemeName, DEFAULT_THEME, getTheme } from "../types/theme";
import { FontThemeName, DEFAULT_FONT, TimeFontThemeName, DEFAULT_TIME_FONT } from "../types/fonts";
import { PrayerAudioSettings } from "../types/audio";
import { ThemeProvider } from "../context/ThemeContext";
import { AudioProvider } from "../context/AudioContext";
import { PrayerTimesProvider } from "../context/PrayerTimesContext";
import { FullscreenSchedulerProvider, useFullscreenScheduler } from "../context/FullscreenSchedulerContext";
import { loadSettings, saveSettings, LocationSettings, FullscreenSettings, DEFAULT_FULLSCREEN_SETTINGS } from "../services/settingsStore";
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
    const [timeFontTheme, setTimeFontTheme] = useState<TimeFontThemeName>(DEFAULT_TIME_FONT);
    const [audioSettings, setAudioSettings] = useState<PrayerAudioSettings>({});
    const [prayerTimeOffsets, setPrayerTimeOffsets] = useState<Record<string, number>>({});
    const [locationSettings, setLocationSettings] = useState<LocationSettings>({
        latitude: -6.2088,
        longitude: 106.8456,
        calculationMethod: "Singapore",
        timezone: "Asia/Makassar",
        madhab: "Shafi",
        ihtiati: 2
    });
    const [fullscreenSettings, setFullscreenSettings] = useState<FullscreenSettings>(DEFAULT_FULLSCREEN_SETTINGS);

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
                    if (saved.timeFontTheme) setTimeFontTheme(saved.timeFontTheme);
                    if (saved.audio) setAudioSettings(saved.audio);
                    if (saved.prayerTimeOffsets) setPrayerTimeOffsets(saved.prayerTimeOffsets);
                    if (saved.location) setLocationSettings(saved.location);
                    if (saved.fullscreen) setFullscreenSettings(saved.fullscreen);
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
                timeFontTheme,
                audio: audioSettings,
                prayerTimeOffsets: prayerTimeOffsets,
                location: locationSettings,
                fullscreen: fullscreenSettings
            })
                .catch(err => console.error("Failed to save settings:", err));
        }
    }, [layoutPosition, mosqueData, slides, themeName, fontTheme, timeFontTheme, audioSettings, prayerTimeOffsets, locationSettings, fullscreenSettings]);

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
        <ThemeProvider
            initialTheme={themeName}
            initialFont={fontTheme}
            initialTimeFont={timeFontTheme}
            onThemeChange={setThemeName}
            onFontChange={setFontTheme}
            onTimeFontChange={setTimeFontTheme}
        >
            <PrayerTimesProvider
                offsets={prayerTimeOffsets}
                latitude={locationSettings.latitude}
                longitude={locationSettings.longitude}
                calculationMethod={locationSettings.calculationMethod}
                madhab={locationSettings.madhab}
                timezone={locationSettings.timezone}
                ihtiati={locationSettings.ihtiati}
            >
                <AudioProvider initialSettings={audioSettings} onSettingsChange={setAudioSettings}>
                    <FullscreenSchedulerProvider settings={fullscreenSettings}>
                        <MainScreenContent
                            theme={theme}
                            isHorizontal={isHorizontal}
                            layoutPosition={layoutPosition}
                            setLayoutPosition={setLayoutPosition}
                            fullscreenMode={fullscreenMode}
                            setFullscreenMode={setFullscreenMode}
                            mosqueData={mosqueData}
                            setMosqueData={setMosqueData}
                            slides={slides}
                            setSlides={setSlides}
                            themeName={themeName}
                            setThemeName={setThemeName}
                            fontTheme={fontTheme}
                            setFontTheme={setFontTheme}
                            timeFontTheme={timeFontTheme}
                            setTimeFontTheme={setTimeFontTheme}
                            audioSettings={audioSettings}
                            setAudioSettings={setAudioSettings}
                            prayerTimeOffsets={prayerTimeOffsets}
                            setPrayerTimeOffsets={setPrayerTimeOffsets}
                            locationSettings={locationSettings}
                            setLocationSettings={setLocationSettings}
                            fullscreenSettings={fullscreenSettings}
                            setFullscreenSettings={setFullscreenSettings}
                            isSettingsOpen={isSettingsOpen}
                            setIsSettingsOpen={setIsSettingsOpen}
                        />
                    </FullscreenSchedulerProvider>
                </AudioProvider>
            </PrayerTimesProvider>
        </ThemeProvider>
    );
}

// Inner component that can use useFullscreenScheduler
interface MainScreenContentProps {
    theme: ReturnType<typeof getTheme>;
    isHorizontal: boolean;
    layoutPosition: LayoutPosition;
    setLayoutPosition: (pos: LayoutPosition) => void;
    fullscreenMode: FullScreenMode;
    setFullscreenMode: (mode: FullScreenMode) => void;
    mosqueData: MosqueData;
    setMosqueData: (data: MosqueData) => void;
    slides: Slide[];
    setSlides: (slides: Slide[]) => void;
    themeName: ThemeName;
    setThemeName: (name: ThemeName) => void;
    fontTheme: FontThemeName;
    setFontTheme: (name: FontThemeName) => void;
    timeFontTheme: TimeFontThemeName;
    setTimeFontTheme: (name: TimeFontThemeName) => void;
    audioSettings: PrayerAudioSettings;
    setAudioSettings: (settings: PrayerAudioSettings) => void;
    prayerTimeOffsets: Record<string, number>;
    setPrayerTimeOffsets: (offsets: Record<string, number>) => void;
    locationSettings: LocationSettings;
    setLocationSettings: (settings: LocationSettings) => void;
    fullscreenSettings: FullscreenSettings;
    setFullscreenSettings: (settings: FullscreenSettings) => void;
    isSettingsOpen: boolean;
    setIsSettingsOpen: (open: boolean) => void;
}

function MainScreenContent({
    theme,
    isHorizontal,
    layoutPosition,
    setLayoutPosition,
    fullscreenMode,
    setFullscreenMode,
    mosqueData,
    setMosqueData,
    slides,
    setSlides,
    themeName,
    setThemeName,
    fontTheme,
    setFontTheme,
    timeFontTheme,
    setTimeFontTheme,
    audioSettings,
    setAudioSettings,
    prayerTimeOffsets,
    setPrayerTimeOffsets,
    locationSettings,
    setLocationSettings,
    fullscreenSettings,
    setFullscreenSettings,
    isSettingsOpen,
    setIsSettingsOpen
}: MainScreenContentProps) {
    const { currentMode, timeRemaining } = useFullscreenScheduler();
    const schedulerModeRef = useRef(currentMode);

    // Sync scheduler mode to state - only when scheduler initiates a new mode
    // Don't interfere with manual overrides
    useEffect(() => {
        // Only update if scheduler has changed from what we last saw
        if (currentMode !== schedulerModeRef.current) {
            console.log(`[MainScreen] Scheduler mode changed: ${schedulerModeRef.current} -> ${currentMode}`);
            schedulerModeRef.current = currentMode;

            // If scheduler is activating something, follow it
            if (currentMode !== "None") {
                setFullscreenMode(currentMode);
            }
            // Don't reset fullscreenMode when scheduler goes to None - allow manual control
        }
    }, [currentMode, setFullscreenMode]);

    return (
        <div className={`h-screen bg-gradient-to-br ${theme.colors.bgGradient} relative overflow-hidden flex ${isHorizontal ? 'flex-col' : 'flex-row'} items-stretch transition-colors duration-500`}>
            {/* Conditional Rendering based on Layout Position */}

            {/* Sidebar First if Vertical-Left */}
            {layoutPosition === "Vertical-Left" && <SideBar position="Vertical-Left" timezone={locationSettings.timezone} />}

            <div className="flex-1 h-full relative">
                <MainContent
                    layoutPosition={layoutPosition}
                    mosqueData={mosqueData}
                    slides={slides}
                    onOpenSettings={() => setIsSettingsOpen(true)}
                    timezone={locationSettings.timezone}
                />
                <DigitalClock layoutPosition={layoutPosition} />
            </div>

            {/* Sidebar Second if Vertical-Right */}
            {layoutPosition === "Vertical-Right" && <SideBar position="Vertical-Right" timezone={locationSettings.timezone} />}

            {/* Footer Sidebar if Horizontal-Bottom */}
            {layoutPosition === "Horizontal-Bottom" && <SideBar position="Horizontal-Bottom" timezone={locationSettings.timezone} />}

            {/* Fullscreen Overlays */}
            {fullscreenMode === "PreAdzan" && <PreAdzan />}
            {fullscreenMode === "Adzan" && <Adzan timeRemaining={timeRemaining} />}
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
                timeFontTheme={timeFontTheme}
                onTimeFontChange={setTimeFontTheme}
                audioSettings={audioSettings}
                onAudioSettingsChange={setAudioSettings}
                prayerTimeOffsets={prayerTimeOffsets}
                onOffsetsChange={setPrayerTimeOffsets}
                locationSettings={locationSettings}
                onLocationChange={setLocationSettings}
                fullscreenSettings={fullscreenSettings}
                onFullscreenSettingsChange={setFullscreenSettings}
            />
        </div>
    );
}

export default MainScreen;
