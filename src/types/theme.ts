export type ThemeName =
    | "midnight-ocean"
    | "emerald-mosque"
    | "royal-gold"
    | "sunset-amber"
    | "purple-majesty"
    | "arctic-blue"
    | "rose-quartz"
    | "obsidian"
    | "tropical-teal";

export interface Theme {
    name: ThemeName;
    displayName: string;
    colors: {
        // Main background gradient
        bgGradient: string;
        // Primary accent color
        primary: string;
        primaryLight: string;
        primaryDark: string;
        // Secondary accent
        secondary: string;
        // Text colors
        textPrimary: string;
        textSecondary: string;
        textMuted: string;
        // Glass/overlay effects
        glassBackground: string;
        glassBorder: string;
        // Fullscreen specific
        fullscreenGradient: string;
    };
}

export const THEMES: Record<ThemeName, Theme> = {
    "midnight-ocean": {
        name: "midnight-ocean",
        displayName: "Midnight Ocean",
        colors: {
            bgGradient: "from-slate-950 via-blue-950 to-cyan-950",
            primary: "#0ea5e9",
            primaryLight: "#38bdf8",
            primaryDark: "#0284c7",
            secondary: "#06b6d4",
            textPrimary: "#f1f5f9",
            textSecondary: "#94a3b8",
            textMuted: "#64748b",
            glassBackground: "rgba(15, 23, 42, 0.7)",
            glassBorder: "rgba(56, 189, 248, 0.2)",
            fullscreenGradient: "from-slate-950 via-blue-900 to-cyan-900",
        },
    },
    "emerald-mosque": {
        name: "emerald-mosque",
        displayName: "Emerald Mosque",
        colors: {
            bgGradient: "from-slate-950 via-emerald-950 to-green-950",
            primary: "#10b981",
            primaryLight: "#34d399",
            primaryDark: "#059669",
            secondary: "#22c55e",
            textPrimary: "#f0fdf4",
            textSecondary: "#86efac",
            textMuted: "#4ade80",
            glassBackground: "rgba(6, 78, 59, 0.6)",
            glassBorder: "rgba(52, 211, 153, 0.3)",
            fullscreenGradient: "from-emerald-950 via-emerald-900 to-green-900",
        },
    },
    "royal-gold": {
        name: "royal-gold",
        displayName: "Royal Gold",
        colors: {
            bgGradient: "from-slate-950 via-amber-950 to-yellow-950",
            primary: "#f59e0b",
            primaryLight: "#fbbf24",
            primaryDark: "#d97706",
            secondary: "#eab308",
            textPrimary: "#fffbeb",
            textSecondary: "#fcd34d",
            textMuted: "#fbbf24",
            glassBackground: "rgba(30, 20, 10, 0.8)",
            glassBorder: "rgba(251, 191, 36, 0.3)",
            fullscreenGradient: "from-amber-950 via-yellow-900 to-orange-900",
        },
    },
    "sunset-amber": {
        name: "sunset-amber",
        displayName: "Sunset Amber",
        colors: {
            bgGradient: "from-slate-950 via-orange-950 to-red-950",
            primary: "#f97316",
            primaryLight: "#fb923c",
            primaryDark: "#ea580c",
            secondary: "#ef4444",
            textPrimary: "#fff7ed",
            textSecondary: "#fdba74",
            textMuted: "#fb923c",
            glassBackground: "rgba(50, 20, 10, 0.7)",
            glassBorder: "rgba(251, 146, 60, 0.3)",
            fullscreenGradient: "from-orange-950 via-red-900 to-rose-900",
        },
    },
    "purple-majesty": {
        name: "purple-majesty",
        displayName: "Purple Majesty",
        colors: {
            bgGradient: "from-slate-950 via-purple-950 to-fuchsia-950",
            primary: "#a855f7",
            primaryLight: "#c084fc",
            primaryDark: "#9333ea",
            secondary: "#d946ef",
            textPrimary: "#faf5ff",
            textSecondary: "#d8b4fe",
            textMuted: "#c084fc",
            glassBackground: "rgba(30, 10, 50, 0.7)",
            glassBorder: "rgba(192, 132, 252, 0.3)",
            fullscreenGradient: "from-purple-950 via-fuchsia-900 to-pink-900",
        },
    },
    "arctic-blue": {
        name: "arctic-blue",
        displayName: "Arctic Blue",
        colors: {
            bgGradient: "from-slate-900 via-sky-950 to-blue-950",
            primary: "#38bdf8",
            primaryLight: "#7dd3fc",
            primaryDark: "#0ea5e9",
            secondary: "#60a5fa",
            textPrimary: "#f0f9ff",
            textSecondary: "#bae6fd",
            textMuted: "#7dd3fc",
            glassBackground: "rgba(8, 47, 73, 0.6)",
            glassBorder: "rgba(125, 211, 252, 0.25)",
            fullscreenGradient: "from-sky-950 via-blue-900 to-indigo-900",
        },
    },
    "rose-quartz": {
        name: "rose-quartz",
        displayName: "Rose Quartz",
        colors: {
            bgGradient: "from-slate-950 via-rose-950 to-pink-950",
            primary: "#fb7185",
            primaryLight: "#fda4af",
            primaryDark: "#f43f5e",
            secondary: "#ec4899",
            textPrimary: "#fff1f2",
            textSecondary: "#fecdd3",
            textMuted: "#fda4af",
            glassBackground: "rgba(50, 15, 30, 0.7)",
            glassBorder: "rgba(253, 164, 175, 0.3)",
            fullscreenGradient: "from-rose-950 via-pink-900 to-fuchsia-900",
        },
    },
    "obsidian": {
        name: "obsidian",
        displayName: "Obsidian",
        colors: {
            bgGradient: "from-neutral-950 via-zinc-950 to-stone-950",
            primary: "#a1a1aa",
            primaryLight: "#d4d4d8",
            primaryDark: "#71717a",
            secondary: "#a3a3a3",
            textPrimary: "#fafafa",
            textSecondary: "#d4d4d4",
            textMuted: "#a3a3a3",
            glassBackground: "rgba(23, 23, 23, 0.8)",
            glassBorder: "rgba(163, 163, 163, 0.2)",
            fullscreenGradient: "from-neutral-950 via-zinc-900 to-stone-900",
        },
    },
    "tropical-teal": {
        name: "tropical-teal",
        displayName: "Tropical Teal",
        colors: {
            bgGradient: "from-slate-950 via-teal-950 to-cyan-950",
            primary: "#14b8a6",
            primaryLight: "#2dd4bf",
            primaryDark: "#0d9488",
            secondary: "#22d3ee",
            textPrimary: "#f0fdfa",
            textSecondary: "#5eead4",
            textMuted: "#2dd4bf",
            glassBackground: "rgba(8, 51, 68, 0.7)",
            glassBorder: "rgba(45, 212, 191, 0.25)",
            fullscreenGradient: "from-teal-950 via-cyan-900 to-emerald-900",
        },
    },
};

export const DEFAULT_THEME: ThemeName = "emerald-mosque";

export function getTheme(name: ThemeName): Theme {
    return THEMES[name] || THEMES[DEFAULT_THEME];
}

export const THEME_LIST = Object.values(THEMES);
