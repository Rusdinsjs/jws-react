import React, { createContext, useContext, useState, useEffect } from 'react';
import { Coordinates, CalculationMethod, PrayerTimes, Madhab } from 'adhan';

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
const DEFAULT_COORDS = { latitude: -6.2088, longitude: 106.8456 };

// Available calculation methods
export const CALCULATION_METHODS = [
    { id: "Singapore", label: "Singapore / Malaysia / Brunei" },
    { id: "MuslimWorldLeague", label: "Muslim World League" },
    { id: "Egyptian", label: "Egyptian General Authority" },
    { id: "Karachi", label: "University of Islamic Sciences, Karachi" },
    { id: "UmmAlQura", label: "Umm al-Qura University, Makkah" },
    { id: "Dubai", label: "Dubai" },
    { id: "MoonsightingCommittee", label: "Moonsighting Committee" },
    { id: "NorthAmerica", label: "ISNA (North America)" },
    { id: "Kuwait", label: "Kuwait" },
    { id: "Qatar", label: "Qatar" },
    { id: "Tehran", label: "Tehran" },
    { id: "Turkey", label: "Turkey" },
];

// Available madhabs for Asr calculation
export const MADHAB_LIST = [
    { id: "Shafi", label: "Syafi'i / Maliki / Hambali" },
    { id: "Hanafi", label: "Hanafi" },
];

// Common timezones for Indonesia
export const TIMEZONE_LIST = [
    { id: "Asia/Jakarta", label: "WIB (Jakarta, Sumatera, Jawa Barat)" },
    { id: "Asia/Makassar", label: "WITA (Makassar, Bali, Kalimantan)" },
    { id: "Asia/Jayapura", label: "WIT (Jayapura, Papua)" },
    { id: "Asia/Singapore", label: "Singapore" },
    { id: "Asia/Kuala_Lumpur", label: "Malaysia" },
];

interface PrayerTimesProviderProps {
    children: React.ReactNode;
    offsets: Record<string, number>; // { Subuh: 2, Maghrib: -1 }
    latitude?: number;
    longitude?: number;
    calculationMethod?: string;
    madhab?: string;
    timezone?: string;
    ihtiati?: number;
}

export function PrayerTimesProvider({
    children,
    offsets = {},
    latitude = DEFAULT_COORDS.latitude,
    longitude = DEFAULT_COORDS.longitude,
    calculationMethod = "Singapore",
    madhab = "Shafi",
    timezone = "Asia/Makassar",
    ihtiati = 2
}: PrayerTimesProviderProps) {
    const [prayerTimes, setPrayerTimes] = useState<PrayerTime[]>([]);
    const [nextPrayerIndex, setNextPrayerIndex] = useState<number>(-1);

    useEffect(() => {
        const updatePrayerTimes = () => {
            const now = new Date();
            const coords = new Coordinates(latitude, longitude);

            // Get calculation method params
            let params;
            switch (calculationMethod) {
                case "MuslimWorldLeague": params = CalculationMethod.MuslimWorldLeague(); break;
                case "Egyptian": params = CalculationMethod.Egyptian(); break;
                case "Karachi": params = CalculationMethod.Karachi(); break;
                case "UmmAlQura": params = CalculationMethod.UmmAlQura(); break;
                case "Dubai": params = CalculationMethod.Dubai(); break;
                case "MoonsightingCommittee": params = CalculationMethod.MoonsightingCommittee(); break;
                case "NorthAmerica": params = CalculationMethod.NorthAmerica(); break;
                case "Kuwait": params = CalculationMethod.Kuwait(); break;
                case "Qatar": params = CalculationMethod.Qatar(); break;
                case "Tehran": params = CalculationMethod.Tehran(); break;
                case "Turkey": params = CalculationMethod.Turkey(); break;
                default: params = CalculationMethod.Singapore(); break;
            }

            // Apply madhab for Asr calculation
            params.madhab = madhab === "Hanafi" ? Madhab.Hanafi : Madhab.Shafi;

            // Calculate for today
            const timesToday = new PrayerTimes(coords, now, params);

            // Helper to apply offset
            const getOffsetTime = (baseTime: Date, name: string) => {
                const offsetMinutes = offsets[name] || 0;
                // Add Global Ihtiati
                return new Date(baseTime.getTime() + (offsetMinutes + ihtiati) * 60000);
            };

            // Helper to calculate Imsak (10 mins before Subuh)
            const getImsakTime = (fajrTime: Date) => {
                const imsakBase = new Date(fajrTime.getTime() - (10 * 60000));
                return getOffsetTime(imsakBase, 'Imsak');
            };

            // Helper to calculate Dhuha (15 mins after Syuruq)
            const getDhuhaTime = (sunriseTime: Date) => {
                const dhuhaBase = new Date(sunriseTime.getTime() + (15 * 60000));
                return getOffsetTime(dhuhaBase, 'Dhuha');
            };

            let list = [
                { name: 'Imsak', time: getImsakTime(timesToday.fajr) },
                { name: 'Subuh', time: getOffsetTime(timesToday.fajr, 'Subuh') },
                { name: 'Syuruq', time: getOffsetTime(timesToday.sunrise, 'Syuruq') },
                { name: 'Dhuha', time: getDhuhaTime(timesToday.sunrise) },
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
                    { name: 'Imsak', time: getImsakTime(timesTomorrow.fajr) },
                    { name: 'Subuh', time: getOffsetTime(timesTomorrow.fajr, 'Subuh') },
                    { name: 'Syuruq', time: getOffsetTime(timesTomorrow.sunrise, 'Syuruq') },
                    { name: 'Dhuha', time: getDhuhaTime(timesTomorrow.sunrise) },
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

            // Debug logging
            console.log('[PrayerTimes] Calculation params:', { latitude, longitude, calculationMethod, madhab, timezone });
            console.log('[PrayerTimes] Calculated times:', formattedList.map(p => ({ name: p.name, time: p.time.toLocaleTimeString() })));
        };

        updatePrayerTimes();
        const interval = setInterval(updatePrayerTimes, 60000); // Re-check every minute

        return () => clearInterval(interval);
    }, [offsets, latitude, longitude, calculationMethod, madhab, timezone, ihtiati]); // Re-run when settings change

    return (
        <PrayerTimesContext.Provider value={{ prayerTimes, nextPrayerIndex }}>
            {children}
        </PrayerTimesContext.Provider>
    );
}
