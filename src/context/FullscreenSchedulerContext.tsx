import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { usePrayerTimes } from './PrayerTimesContext';
import { FullscreenSettings, PrayerDurations } from '../services/settingsStore';
import { FullScreenMode } from '../types/layout';
import { useAudio } from './AudioContext';

interface FullscreenSchedulerContextType {
    currentMode: FullScreenMode;
    currentPrayerName: string | null;
    timeRemaining: number; // seconds
    totalDuration: number; // For progress tracking
    manualOverride: (mode: FullScreenMode) => void;
}

const FullscreenSchedulerContext = createContext<FullscreenSchedulerContextType | undefined>(undefined);

export function useFullscreenScheduler() {
    const context = useContext(FullscreenSchedulerContext);
    if (!context) {
        throw new Error('useFullscreenScheduler must be used within a FullscreenSchedulerProvider');
    }
    return context;
}

interface FullscreenSchedulerProviderProps {
    children: React.ReactNode;
    settings: FullscreenSettings;
}

type SchedulerState = {
    mode: FullScreenMode;
    prayerName: string | null;
    startTime: Date | null;
    duration: number; // seconds
};

export function FullscreenSchedulerProvider({ children, settings }: FullscreenSchedulerProviderProps) {
    const { prayerTimes } = usePrayerTimes();
    const { audioSettings } = useAudio();
    const [state, setState] = useState<SchedulerState>({
        mode: "None",
        prayerName: null,
        startTime: null,
        duration: 0
    });
    const [timeRemaining, setTimeRemaining] = useState(0);
    const [totalDuration, setTotalDuration] = useState(0);

    // Check if current time is within screensaver range
    const isScreenSaverTime = useCallback(() => {
        const now = new Date();
        const currentMinutes = now.getHours() * 60 + now.getMinutes();

        const [startH, startM] = settings.screenSaverStart.split(':').map(Number);
        const [endH, endM] = settings.screenSaverEnd.split(':').map(Number);
        const startMinutes = startH * 60 + startM;
        const endMinutes = endH * 60 + endM;

        // Handle overnight range (e.g., 22:00 - 03:00)
        if (startMinutes > endMinutes) {
            return currentMinutes >= startMinutes || currentMinutes < endMinutes;
        }
        return currentMinutes >= startMinutes && currentMinutes < endMinutes;
    }, [settings.screenSaverStart, settings.screenSaverEnd]);

    // Check if today is Friday
    const isFriday = useCallback(() => {
        return new Date().getDay() === 5;
    }, []);

    // Transition to next state
    const transitionTo = useCallback((mode: FullScreenMode, prayerName: string | null, duration: number) => {
        console.log(`[Scheduler] Transitioning to: ${mode} (${prayerName}) for ${duration}s`);
        setState({
            mode,
            prayerName,
            startTime: new Date(),
            duration
        });
        setTimeRemaining(duration);
        setTotalDuration(duration);
    }, []);

    // Manual override
    const manualOverride = useCallback((mode: FullScreenMode) => {
        if (mode === "None") {
            setState({ mode: "None", prayerName: null, startTime: null, duration: 0 });
            setTimeRemaining(0);
            setTotalDuration(0);
        } else {
            // Get appropriate duration for manual test modes
            let duration = 0;
            const testPrayer = "Subuh"; // Default prayer for testing

            if (mode === "Adzan") {
                duration = audioSettings[testPrayer]?.adzanDuration || settings.Subuh?.adzanDuration || 300;
            } else if (mode === "IqamahWait") {
                duration = settings.Subuh?.iqamahWaitDuration || 600;
            } else if (mode === "Sholat") {
                duration = settings.Subuh?.sholatDuration || 900;
            } else if (mode === "PreKhutbah") {
                duration = settings.preKhutbahDuration || 900;
            } else if (mode === "Khutbah") {
                duration = settings.khutbahDuration || 1800;
            } else {
                duration = 300; // Default 5 minutes for other modes
            }

            console.log(`[Scheduler] Manual override: ${mode} with duration ${duration}s`);
            transitionTo(mode, testPrayer, duration);
        }
    }, [transitionTo, audioSettings, settings]);

    // Helper to get prayer durations
    const getPrayerDurations = useCallback((prayerName: string): PrayerDurations => {
        const durations = settings[prayerName as keyof FullscreenSettings];
        if (durations && typeof durations === 'object' && 'adzanDuration' in durations) {
            return durations as PrayerDurations;
        }
        // Fallback default
        return { adzanDuration: 300, iqamahWaitDuration: 600, sholatDuration: 900 };
    }, [settings]);

    // Main scheduler effect - check for prayer time arrivals
    useEffect(() => {
        const checkPrayerTimes = () => {
            if (state.mode !== "None") return; // Already in a sequence

            const now = new Date();

            // Find prayers that just started (within last 5 seconds)
            for (const prayer of prayerTimes) {
                const prayerTime = new Date(prayer.time);
                const diff = now.getTime() - prayerTime.getTime();

                // Prayer time arrived (within 5 second window)
                if (diff >= 0 && diff < 5000) {
                    const isDzuhurOnFriday = isFriday() && prayer.name === "Dzuhur";
                    const durations = getPrayerDurations(prayer.name);

                    // Use duration from audio settings if available, else fallback
                    const adzanDuration = audioSettings[prayer.name]?.adzanDuration || durations.adzanDuration;

                    if (isDzuhurOnFriday) {
                        // Friday Dzuhur: PreKhutbah -> Khutbah -> Sholat
                        transitionTo("PreKhutbah", prayer.name, settings.preKhutbahDuration);
                    } else if (["Subuh", "Dzuhur", "Ashar", "Maghrib", "Isya"].includes(prayer.name)) {
                        // Normal prayer: Adzan -> IqamahWait -> Sholat
                        transitionTo("Adzan", prayer.name, adzanDuration);
                    }
                    break;
                }
            }
        };

        const interval = setInterval(checkPrayerTimes, 1000);
        return () => clearInterval(interval);
    }, [prayerTimes, state.mode, isFriday, transitionTo, settings, getPrayerDurations]);

    // Countdown timer and state transitions
    useEffect(() => {
        if (state.mode === "None" || state.duration === 0) return;

        const timer = setInterval(() => {
            setTimeRemaining(prev => {
                if (prev <= 1) {
                    // Time's up, transition to next state
                    const isDzuhurOnFriday = isFriday() && state.prayerName === "Dzuhur";
                    const durations = state.prayerName ? getPrayerDurations(state.prayerName) : null;

                    if (isDzuhurOnFriday && durations) {
                        // Friday sequence
                        if (state.mode === "PreKhutbah") {
                            transitionTo("Khutbah", state.prayerName, settings.khutbahDuration);
                        } else if (state.mode === "Khutbah") {
                            transitionTo("Sholat", state.prayerName, durations.sholatDuration);
                        } else if (state.mode === "Sholat") {
                            setState({ mode: "None", prayerName: null, startTime: null, duration: 0 });
                        }
                    } else if (durations) {
                        // Normal sequence
                        if (state.mode === "Adzan") {
                            transitionTo("IqamahWait", state.prayerName, durations.iqamahWaitDuration);
                        } else if (state.mode === "IqamahWait") {
                            transitionTo("Sholat", state.prayerName, durations.sholatDuration);
                        } else if (state.mode === "Sholat") {
                            setState({ mode: "None", prayerName: null, startTime: null, duration: 0 });
                        }
                    }
                    return 0;
                }
                return prev - 1;
            });
        }, 1000);

        return () => clearInterval(timer);
    }, [state.mode, state.prayerName, state.duration, isFriday, transitionTo, settings, getPrayerDurations]);

    // ScreenSaver check
    useEffect(() => {
        const checkScreenSaver = () => {
            if (state.mode === "None" && isScreenSaverTime()) {
                setState(prev => prev.mode === "None" ? { ...prev, mode: "ScreenSaver" } : prev);
            } else if (state.mode === "ScreenSaver" && !isScreenSaverTime()) {
                setState({ mode: "None", prayerName: null, startTime: null, duration: 0 });
            }
        };

        const interval = setInterval(checkScreenSaver, 10000); // Check every 10 seconds
        checkScreenSaver(); // Initial check

        return () => clearInterval(interval);
    }, [state.mode, isScreenSaverTime]);

    return (
        <FullscreenSchedulerContext.Provider value={{
            currentMode: state.mode,
            currentPrayerName: state.prayerName,
            timeRemaining,
            totalDuration,
            manualOverride
        }}>
            {children}
        </FullscreenSchedulerContext.Provider>
    );
}
