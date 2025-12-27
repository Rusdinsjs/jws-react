export type FontThemeName =
    | "modern"
    | "elegant"
    | "rounded"
    | "inter"
    | "roboto"
    | "playfair"
    | "oswald"
    | "lobster"
    | "jetbrains"
    | "bebas"
    | "cinzel"
    | "quicksand"
    | "bitter"
    | "righteous"
    | "archivo";

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
    },
    "inter": {
        name: "inter",
        displayName: "Inter (Modern Sans)",
        family: "'Inter', sans-serif"
    },
    "roboto": {
        name: "roboto",
        displayName: "Roboto (Clean Tech)",
        family: "'Roboto', sans-serif"
    },
    "playfair": {
        name: "playfair",
        displayName: "Playfair Display (Elegant Serif)",
        family: "'Playfair Display', serif"
    },
    "oswald": {
        name: "oswald",
        displayName: "Oswald (Bold Condensed)",
        family: "'Oswald', sans-serif"
    },
    "lobster": {
        name: "lobster",
        displayName: "Lobster (Script Cursive)",
        family: "'Lobster', cursive"
    },
    "jetbrains": {
        name: "jetbrains",
        displayName: "JetBrains Mono (Monospace)",
        family: "'JetBrains Mono', monospace"
    },
    "bebas": {
        name: "bebas",
        displayName: "Bebas Neue (Block Caps)",
        family: "'Bebas Neue', sans-serif"
    },
    "cinzel": {
        name: "cinzel",
        displayName: "Cinzel (Roman Classic)",
        family: "'Cinzel', serif"
    },
    "quicksand": {
        name: "quicksand",
        displayName: "Quicksand (Rounded Soft)",
        family: "'Quicksand', sans-serif"
    },
    "bitter": {
        name: "bitter",
        displayName: "Bitter (Slab Serif)",
        family: "'Bitter', serif"
    },
    "righteous": {
        name: "righteous",
        displayName: "Righteous (Retro Display)",
        family: "'Righteous', sans-serif"
    },
    "archivo": {
        name: "archivo",
        displayName: "Archivo Black (Heavy Impact)",
        family: "'Archivo Black', sans-serif"
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
