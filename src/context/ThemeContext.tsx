import { createContext, useContext, ReactNode, useState, useEffect } from "react";
import { Theme, ThemeName, getTheme, DEFAULT_THEME, THEME_LIST } from "../types/theme";
import {
    FontThemeName, getFont, DEFAULT_FONT, FONT_LIST, FontTheme,
    TimeFontThemeName, getTimeFont, DEFAULT_TIME_FONT, TIME_FONT_LIST, TimeFontTheme
} from "../types/fonts";

interface ThemeContextType {
    theme: Theme;
    themeName: ThemeName;
    setThemeName: (name: ThemeName) => void;
    themes: Theme[];
    fontTheme: FontThemeName;
    setFontTheme: (name: FontThemeName) => void;
    fonts: FontTheme[];
    timeFontTheme: TimeFontThemeName;
    setTimeFontTheme: (name: TimeFontThemeName) => void;
    timeFonts: TimeFontTheme[];
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

interface ThemeProviderProps {
    children: ReactNode;
    initialTheme?: ThemeName;
    initialFont?: FontThemeName;
    initialTimeFont?: TimeFontThemeName;
    onThemeChange?: (name: ThemeName) => void;
    onFontChange?: (name: FontThemeName) => void;
    onTimeFontChange?: (name: TimeFontThemeName) => void;
}

export function ThemeProvider({
    children,
    initialTheme = DEFAULT_THEME,
    initialFont = DEFAULT_FONT,
    initialTimeFont = DEFAULT_TIME_FONT,
    onThemeChange,
    onFontChange,
    onTimeFontChange
}: ThemeProviderProps) {
    const [themeName, setThemeNameState] = useState<ThemeName>(initialTheme);
    const [fontTheme, setFontThemeState] = useState<FontThemeName>(initialFont);
    const [timeFontTheme, setTimeFontThemeState] = useState<TimeFontThemeName>(initialTimeFont);

    const theme = getTheme(themeName);
    const font = getFont(fontTheme);
    const timeFont = getTimeFont(timeFontTheme);

    // Sync with external initial changes
    useEffect(() => {
        setThemeNameState(initialTheme);
    }, [initialTheme]);

    useEffect(() => {
        setFontThemeState(initialFont);
    }, [initialFont]);

    useEffect(() => {
        setTimeFontThemeState(initialTimeFont);
    }, [initialTimeFont]);

    const setThemeName = (name: ThemeName) => {
        setThemeNameState(name);
        onThemeChange?.(name);
    };

    const setFontTheme = (name: FontThemeName) => {
        setFontThemeState(name);
        onFontChange?.(name);
    };

    const setTimeFontTheme = (name: TimeFontThemeName) => {
        setTimeFontThemeState(name);
        onTimeFontChange?.(name);
    };

    // Apply CSS variables for dynamic theming
    useEffect(() => {
        const root = document.documentElement;
        root.style.setProperty("--theme-primary", theme.colors.primary);
        root.style.setProperty("--theme-primary-light", theme.colors.primaryLight);
        root.style.setProperty("--theme-primary-dark", theme.colors.primaryDark);
        root.style.setProperty("--theme-secondary", theme.colors.secondary);
        root.style.setProperty("--theme-text-primary", theme.colors.textPrimary);
        root.style.setProperty("--theme-text-secondary", theme.colors.textSecondary);
        root.style.setProperty("--theme-text-muted", theme.colors.textMuted);
        root.style.setProperty("--theme-glass-bg", theme.colors.glassBackground);
        root.style.setProperty("--theme-glass-border", theme.colors.glassBorder);

        // Apply Fonts
        root.style.setProperty("--font-family", font.family);
        root.style.setProperty("--font-family-time", timeFont.family);
    }, [theme, font, timeFont]);

    return (
        <ThemeContext.Provider value={{
            theme, themeName, setThemeName, themes: THEME_LIST,
            fontTheme, setFontTheme, fonts: FONT_LIST,
            timeFontTheme, setTimeFontTheme, timeFonts: TIME_FONT_LIST
        }}>
            {children}
        </ThemeContext.Provider>
    );
}

export function useTheme(): ThemeContextType {
    const context = useContext(ThemeContext);
    if (!context) {
        throw new Error("useTheme must be used within a ThemeProvider");
    }
    return context;
}
