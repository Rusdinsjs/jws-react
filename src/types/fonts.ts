export type FontThemeName =
    | "modern"
    | "elegant"
    | "rounded";

export interface FontTheme {
    name: FontThemeName;
    displayName: string;
    family: string;
}

export const FONTS: Record<FontThemeName, FontTheme> = {
    "modern": {
        name: "modern",
        displayName: "Modern Geometric (Outfit)",
        family: "'Outfit', sans-serif"
    },
    "elegant": {
        name: "elegant",
        displayName: "Classic Elegant (Playfair)",
        family: "'Playfair Display', serif"
    },
    "rounded": {
        name: "rounded",
        displayName: "Modern Rounded (Quicksand)",
        family: "'Quicksand', sans-serif"
    }
};

export type TimeFontThemeName =
    | "digital"
    | "lcd"
    | "impact"
    | "minimal"
    | "retro";

export interface TimeFontTheme {
    name: TimeFontThemeName;
    displayName: string;
    family: string;
}

export const TIME_FONTS: Record<TimeFontThemeName, TimeFontTheme> = {
    "digital": {
        name: "digital",
        displayName: "Digital Modern (Orbitron)",
        family: "'Orbitron', sans-serif"
    },
    "lcd": {
        name: "lcd",
        displayName: "LCD Monospace (Share Tech Mono)",
        family: "'Share Tech Mono', monospace"
    },
    "impact": {
        name: "impact",
        displayName: "Tall Impact (Bebas Neue)",
        family: "'Bebas Neue', cursiv"
    },
    "minimal": {
        name: "minimal",
        displayName: "Minimalist Sharp (Teko)",
        family: "'Teko', sans-serif"
    },
    "retro": {
        name: "retro",
        displayName: "Retro Pixel (Silkscreen)",
        family: "'Silkscreen', cursive"
    }
};

export const DEFAULT_FONT: FontThemeName = "modern";
export const DEFAULT_TIME_FONT: TimeFontThemeName = "digital";

export function getFont(name: FontThemeName): FontTheme {
    return FONTS[name] || FONTS[DEFAULT_FONT];
}

export function getTimeFont(name: TimeFontThemeName): TimeFontTheme {
    return TIME_FONTS[name] || TIME_FONTS[DEFAULT_TIME_FONT];
}

export const FONT_LIST = Object.values(FONTS);
export const TIME_FONT_LIST = Object.values(TIME_FONTS);

