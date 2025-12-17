import React, { createContext, useContext, useState } from 'react';
import { ClockFontName, getClockFont, DEFAULT_CLOCK_FONT, CLOCK_FONT_LIST } from '../types/clockFonts';

interface ClockFontContextType {
    clockFont: ClockFontName;
    clockFontFamily: string;
    setClockFont: (font: ClockFontName) => void;
    fontList: typeof CLOCK_FONT_LIST;
}

const ClockFontContext = createContext<ClockFontContextType | undefined>(undefined);

export function useClockFont() {
    const context = useContext(ClockFontContext);
    if (!context) {
        throw new Error('useClockFont must be used within a ClockFontProvider');
    }
    return context;
}

interface ClockFontProviderProps {
    children: React.ReactNode;
    initialFont?: ClockFontName;
    onFontChange?: (font: ClockFontName) => void;
}

export function ClockFontProvider({
    children,
    initialFont = DEFAULT_CLOCK_FONT,
    onFontChange
}: ClockFontProviderProps) {
    const [clockFont, setClockFontState] = useState<ClockFontName>(initialFont);

    const setClockFont = (font: ClockFontName) => {
        setClockFontState(font);
        onFontChange?.(font);
    };

    const clockFontFamily = getClockFont(clockFont).family;

    return (
        <ClockFontContext.Provider value={{
            clockFont,
            clockFontFamily,
            setClockFont,
            fontList: CLOCK_FONT_LIST
        }}>
            {children}
        </ClockFontContext.Provider>
    );
}
