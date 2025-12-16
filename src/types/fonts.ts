export type FontThemeName =
    | "inter"
    | "roboto"
    | "playfair"
    | "montserrat"
    | "lato";

export interface FontTheme {
    name: FontThemeName;
    displayName: string;
    family: string;
}

export const FONTS: Record<FontThemeName, FontTheme> = {
    "inter": {
        name: "inter",
        displayName: "Inter (System)",
        family: "'Inter', sans-serif"
    },
    "roboto": {
        name: "roboto",
        displayName: "Roboto (Modern)",
        family: "'Roboto', sans-serif"
    },
    "playfair": {
        name: "playfair",
        displayName: "Playfair Display (Elegant)",
        family: "'Playfair Display', serif"
    },
    "montserrat": {
        name: "montserrat",
        displayName: "Montserrat (Geometric)",
        family: "'Montserrat', sans-serif"
    },
    "lato": {
        name: "lato",
        displayName: "Lato (Classic)",
        family: "'Lato', sans-serif"
    }
};

export const DEFAULT_FONT: FontThemeName = "inter";

export function getFont(name: FontThemeName): FontTheme {
    return FONTS[name] || FONTS[DEFAULT_FONT];
}

export const FONT_LIST = Object.values(FONTS);
