import React, { createContext, useContext, useEffect, useState, useRef } from 'react';
import { usePrayerTimes } from './PrayerTimesContext';
import { PrayerAudioSettings, AudioState } from '../types/audio';

interface AudioContextType {
    audioState: AudioState;
    currentPrayerName: string | null;
    currentAudioSrc: string | null;
    audioSettings: PrayerAudioSettings;
    updateAudioSettings: (settings: PrayerAudioSettings) => void;
    testAudio: (state: AudioState, prayerName: string, src?: string) => void;
    stopTest: () => void;
}

const AudioContext = createContext<AudioContextType | undefined>(undefined);

export function useAudio() {
    const context = useContext(AudioContext);
    if (!context) {
        throw new Error('useAudio must be used within an AudioProvider');
    }
    return context;
}

interface AudioProviderProps {
    children: React.ReactNode;
    initialSettings: PrayerAudioSettings;
    onSettingsChange: (settings: PrayerAudioSettings) => void;
}

export function AudioProvider({ children, initialSettings, onSettingsChange }: AudioProviderProps) {
    const { prayerTimes } = usePrayerTimes();
    const [audioState, setAudioState] = useState<AudioState>("Idle");
    const [currentPrayerName, setCurrentPrayerName] = useState<string | null>(null);
    const [currentAudioSrc, setCurrentAudioSrc] = useState<string | null>(null);
    const audioRef = useRef<HTMLAudioElement | null>(null);

    // Keep settings in check
    const [settings, setSettings] = useState<PrayerAudioSettings>(initialSettings);
    const [isTestMode, setIsTestMode] = useState(false);

    // Sync individual setting updates
    const updateAudioSettings = (newSettings: PrayerAudioSettings) => {
        setSettings(newSettings);
        onSettingsChange(newSettings);
    };

    // Test audio state manually
    const testAudio = (state: AudioState, prayerName: string, src?: string) => {
        console.log(`[Audio] Test mode: ${state} (${prayerName})`);
        setIsTestMode(true);
        setAudioState(state);
        setCurrentPrayerName(prayerName);

        // If no src provided, try to find it in settings
        let finalSrc = src;
        if (!finalSrc) {
            const config = settings[prayerName];
            if (config) {
                if (state === "Tartil") finalSrc = config.tartilSrc;
                else if (state === "Tarhim") finalSrc = config.tarhimSrc;
                else if (state === "Adzan") finalSrc = config.adzanSrc;
            }
        }

        // Play audio if source found
        if (finalSrc && audioRef.current) {
            audioRef.current.pause();
            audioRef.current.src = finalSrc;
            audioRef.current.play().catch(e => console.error("Audio playback error:", e));
        }
    };

    // Stop test
    const stopTest = () => {
        console.log(`[Audio] Stopping test mode`);
        setIsTestMode(false);
        setAudioState("Idle");
        setCurrentPrayerName(null);
        if (audioRef.current) {
            audioRef.current.pause();
            audioRef.current.currentTime = 0;
        }
    };

    // Initialize audio element
    useEffect(() => {
        audioRef.current = new Audio();
        return () => {
            if (audioRef.current) {
                audioRef.current.pause();
                audioRef.current = null;
            }
        };
    }, []);

    // Scheduler Logic
    useEffect(() => {
        if (!audioRef.current || isTestMode) return; // Skip scheduler in test mode

        const checkSchedule = () => {
            const now = new Date();
            let activeState: AudioState = "Idle";
            let activePrayer = null;
            let activeSrc = null;

            // Sort prayers by time to handle sequence correctly
            // Note: prayerTimes might include tomorrow's Subuh.

            for (const prayer of prayerTimes) {
                const config = settings[prayer.name];
                if (!config || !config.enabled) continue;

                // Times
                const prayerTime = new Date(prayer.time);
                const tarhimStart = new Date(prayerTime.getTime() - (config.tarhimDuration * 1000));
                const tartilStart = new Date(prayerTime.getTime() - (config.tartilOffset * 60 * 1000));

                // Logic:
                // Tartil: [TartilStart ... TarhimStart)
                // Tarhim: [TarhimStart ... PrayerTime)
                // Adzan:  [PrayerTime ... PrayerTime + AdzanDuration)

                // 3. Adzan (Highest Priority Check)
                const adzanEnd = new Date(prayerTime.getTime() + (config.adzanDuration * 1000));

                if (now >= prayerTime && now < adzanEnd) {
                    activeState = "Adzan";
                    activePrayer = prayer.name;
                    activeSrc = config.adzanSrc;
                }
                // 2. Tarhim (Only if not Adzan)
                else if (now >= tarhimStart && now < prayerTime) {
                    activeState = "Tarhim";
                    activePrayer = prayer.name;
                    activeSrc = config.tarhimSrc;
                }
                // 1. Tartil (Only if not Tarhim or Adzan)
                else if (now >= tartilStart && now < tarhimStart) {
                    activeState = "Tartil";
                    activePrayer = prayer.name;
                    activeSrc = config.tartilSrc;
                }
            }

            // State Transition Handling
            if (activeState !== audioState || activePrayer !== currentPrayerName) {
                console.log(`[Audio] State change: ${audioState} -> ${activeState} (${activePrayer})`);

                // Stop previous audio
                if (audioRef.current) {
                    audioRef.current.pause();
                    audioRef.current.currentTime = 0;
                }

                // Start new audio
                if (activeState !== "Idle" && activeSrc && audioRef.current) {
                    audioRef.current.src = activeSrc;
                    audioRef.current.play().catch(e => console.error("Audio playback error:", e));
                }

                setAudioState(activeState);
                setCurrentPrayerName(activePrayer);
                setCurrentAudioSrc(activeSrc);
            }
        };

        const interval = setInterval(checkSchedule, 1000);
        checkSchedule(); // check immediately

        return () => clearInterval(interval);
    }, [prayerTimes, settings, audioState, currentPrayerName, isTestMode]);

    return (
        <AudioContext.Provider value={{ audioState, currentPrayerName, currentAudioSrc, audioSettings: settings, updateAudioSettings, testAudio, stopTest }}>
            {children}
        </AudioContext.Provider>
    );
}
