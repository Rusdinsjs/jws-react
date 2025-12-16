import React, { createContext, useContext, useState, useEffect } from 'react';
import { Coordinates, CalculationMethod, PrayerTimes } from 'adhan';

export interface PrayerTime {
    name: string;
    time: Date;
    isNext: boolean;
    isActive: boolean;
}

interface PrayerTimesContextType {
    prayerTimes: PrayerTime[];
    nextPrayerIndex: number;
}

const PrayerTimesContext = createContext<PrayerTimesContextType | undefined>(undefined);

export function usePrayerTimes() {
    const context = useContext(PrayerTimesContext);
    if (!context) {
        throw new Error('usePrayerTimes must be used within a PrayerTimesProvider');
    }
    return context;
}

// Default to Jakarta coordinates if not provided
const DEFAULT_COORDS = new Coordinates(-6.2088, 106.8456);

interface PrayerTimesProviderProps {
    children: React.ReactNode;
    offsets: Record<string, number>; // { Subuh: 2, Maghrib: -1 }
}

export function PrayerTimesProvider({ children, offsets = {} }: PrayerTimesProviderProps) {
    const [prayerTimes, setPrayerTimes] = useState<PrayerTime[]>([]);
    const [nextPrayerIndex, setNextPrayerIndex] = useState<number>(-1);

    useEffect(() => {
        const updatePrayerTimes = () => {
            const now = new Date();
            const coords = DEFAULT_COORDS;
            const params = CalculationMethod.Singapore();

            // Calculate for today
            const timesToday = new PrayerTimes(coords, now, params);

            // Helper to apply offset
            const getOffsetTime = (baseTime: Date, name: string) => {
                const offsetMinutes = offsets[name] || 0;
                return new Date(baseTime.getTime() + offsetMinutes * 60000);
            };

            let list = [
                { name: 'Subuh', time: getOffsetTime(timesToday.fajr, 'Subuh') },
                { name: 'Syuruq', time: getOffsetTime(timesToday.sunrise, 'Syuruq') },
                { name: 'Dzuhur', time: getOffsetTime(timesToday.dhuhr, 'Dzuhur') },
                { name: 'Ashar', time: getOffsetTime(timesToday.asr, 'Ashar') },
                { name: 'Maghrib', time: getOffsetTime(timesToday.maghrib, 'Maghrib') },
                { name: 'Isya', time: getOffsetTime(timesToday.isha, 'Isya') },
            ];

            let nextIdx = -1;

            // Find next prayer today
            for (let i = 0; i < list.length; i++) {
                if (list[i].time > now) {
                    nextIdx = i;
                    break;
                }
            }

            // If all passed today, look at tomorrow
            if (nextIdx === -1) {
                const tomorrow = new Date(now);
                tomorrow.setDate(tomorrow.getDate() + 1);
                const timesTomorrow = new PrayerTimes(coords, tomorrow, params);

                // The next prayer is Subuh tomorrow
                nextIdx = 0;

                // Update list[0] to tomorrow for correct next prayer countdown
                list[0].time = getOffsetTime(timesTomorrow.fajr, 'Subuh');

                // Update full list for tomorrow
                list = [
                    { name: 'Subuh', time: getOffsetTime(timesTomorrow.fajr, 'Subuh') },
                    { name: 'Syuruq', time: getOffsetTime(timesTomorrow.sunrise, 'Syuruq') },
                    { name: 'Dzuhur', time: getOffsetTime(timesTomorrow.dhuhr, 'Dzuhur') },
                    { name: 'Ashar', time: getOffsetTime(timesTomorrow.asr, 'Ashar') },
                    { name: 'Maghrib', time: getOffsetTime(timesTomorrow.maghrib, 'Maghrib') },
                    { name: 'Isya', time: getOffsetTime(timesTomorrow.isha, 'Isya') },
                ];
            }

            const formattedList = list.map((p, idx) => ({
                ...p,
                isNext: idx === nextIdx,
                isActive: false // Could utilize this for "Currently Praying" state
            }));

            setPrayerTimes(formattedList);
            setNextPrayerIndex(nextIdx);
        };

        updatePrayerTimes();
        const interval = setInterval(updatePrayerTimes, 60000); // Re-check every minute

        return () => clearInterval(interval);
    }, [offsets]); // Re-run when offsets change

    return (
        <PrayerTimesContext.Provider value={{ prayerTimes, nextPrayerIndex }}>
            {children}
        </PrayerTimesContext.Provider>
    );
}
