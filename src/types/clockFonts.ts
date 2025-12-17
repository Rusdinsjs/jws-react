// Separate font options specifically for clock/time display
export type ClockFontName =
    | "digital7"
    | "orbitron"
    | "dsdigit"
    | "segment"
    | "jetbrains"
    | "roboto"
    | "bebas";

export interface ClockFont {
    name: ClockFontName;
    displayName: string;
    family: string;
}

export const CLOCK_FONTS: Record<ClockFontName, ClockFont> = {
    "digital7": {
        name: "digital7",
        displayName: "Digital 7 (LED Classic)",
        family: "'DSEG7 Classic', monospace"
    },
    "orbitron": {
        name: "orbitron",
        displayName: "Orbitron (Futuristic)",
        family: "'Orbitron', sans-serif"
    },
    "dsdigit": {
        name: "dsdigit",
        displayName: "DS-Digital (LCD)",
        family: "'DSEG14 Classic', monospace"
    },
    "segment": {
        name: "segment",
        displayName: "Segment (7-Segment)",
        family: "'DSEG7 Modern', monospace"
    },
    "jetbrains": {
        name: "jetbrains",
        displayName: "JetBrains Mono (Code)",
        family: "'JetBrains Mono', monospace"
    },
    "roboto": {
        name: "roboto",
        displayName: "Roboto Mono (Clean)",
        family: "'Roboto Mono', monospace"
    },
    "bebas": {
        name: "bebas",
        displayName: "Bebas Neue (Bold)",
        family: "'Bebas Neue', sans-serif"
    }
};

export const DEFAULT_CLOCK_FONT: ClockFontName = "orbitron";

export function getClockFont(name: ClockFontName): ClockFont {
    return CLOCK_FONTS[name] || CLOCK_FONTS[DEFAULT_CLOCK_FONT];
}

export const CLOCK_FONT_LIST = Object.values(CLOCK_FONTS);
