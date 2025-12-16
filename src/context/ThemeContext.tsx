import { createContext, useContext, ReactNode, useState, useEffect } from "react";
import { Theme, ThemeName, getTheme, DEFAULT_THEME, THEME_LIST } from "../types/theme";
import { FontThemeName, getFont, DEFAULT_FONT, FONT_LIST, FontTheme } from "../types/fonts";

interface ThemeContextType {
    theme: Theme;
    themeName: ThemeName;
    setThemeName: (name: ThemeName) => void;
    themes: Theme[];
    fontTheme: FontThemeName;
    setFontTheme: (name: FontThemeName) => void;
    fonts: FontTheme[];
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

interface ThemeProviderProps {
    children: ReactNode;
    initialTheme?: ThemeName;
    initialFont?: FontThemeName;
    onThemeChange?: (name: ThemeName) => void;
    onFontChange?: (name: FontThemeName) => void;
}

export function ThemeProvider({ children, initialTheme = DEFAULT_THEME, initialFont = DEFAULT_FONT, onThemeChange, onFontChange }: ThemeProviderProps) {
    const [themeName, setThemeNameState] = useState<ThemeName>(initialTheme);
    const [fontTheme, setFontThemeState] = useState<FontThemeName>(initialFont);
    const theme = getTheme(themeName);
    const font = getFont(fontTheme);

    // Sync with external initialTheme changes
    useEffect(() => {
        setThemeNameState(initialTheme);
    }, [initialTheme]);

    useEffect(() => {
        setFontThemeState(initialFont);
    }, [initialFont]);

    const setThemeName = (name: ThemeName) => {
        setThemeNameState(name);
        onThemeChange?.(name);
    };

    const setFontTheme = (name: FontThemeName) => {
        setFontThemeState(name);
        onFontChange?.(name);
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

        // Apply Font
        root.style.setProperty("--font-family", font.family);
    }, [theme, font]);

    return (
        <ThemeContext.Provider value={{ theme, themeName, setThemeName, themes: THEME_LIST, fontTheme, setFontTheme, fonts: FONT_LIST }}>
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
