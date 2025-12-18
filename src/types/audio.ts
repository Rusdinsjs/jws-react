export interface AudioConfig {
    tartilSrc: string; // URL
    tartilOffset: number; // Minutes before prayer to start (default 20)
    tarhimSrc: string; // URL
    tarhimDuration: number; // Seconds duration of tarhim (to calculate start time)
    adzanSrc: string; // URL
    adzanDuration: number; // Seconds duration of adzan (default 300 / 5 mins)
    enabled: boolean;
    adzanAudioEnabled: boolean;
}

// Keyed by prayer name (Subuh, Dzuhur, etc.)
export interface PrayerAudioSettings {
    [key: string]: AudioConfig;
}

export type AudioState = "Idle" | "Tartil" | "Tarhim" | "Adzan";

export const DEFAULT_AUDIO_CONFIG: AudioConfig = {
    tartilSrc: "",
    tartilOffset: 20,
    tarhimSrc: "",
    tarhimDuration: 300, // 5 minutes default
    adzanSrc: "",
    adzanDuration: 300, // 5 minutes default
    enabled: true,
    adzanAudioEnabled: false
};
