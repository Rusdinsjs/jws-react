export type FontThemeName =
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

export const DEFAULT_FONT: FontThemeName = "inter";

export function getFont(name: FontThemeName): FontTheme {
    return FONTS[name] || FONTS[DEFAULT_FONT];
}

export const FONT_LIST = Object.values(FONTS);
