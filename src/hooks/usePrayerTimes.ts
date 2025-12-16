import { useState, useEffect } from 'react';
import { Coordinates, CalculationMethod, PrayerTimes } from 'adhan';

export interface PrayerTime {
    name: string;
    time: Date;
    isNext: boolean;
    isActive: boolean;
}

// Default to Jakarta coordinates if not provided
const DEFAULT_COORDS = new Coordinates(-6.2088, 106.8456);

export function usePrayerTimes() {
    const [prayerTimes, setPrayerTimes] = useState<PrayerTime[]>([]);
    const [nextPrayerIndex, setNextPrayerIndex] = useState<number>(-1);

    useEffect(() => {
        const updatePrayerTimes = () => {
            const now = new Date();
            const coords = DEFAULT_COORDS; // Could be dynamic later
            const params = CalculationMethod.Singapore();

            // Calculate for today
            const timesToday = new PrayerTimes(coords, now, params);

            let list = [
                { name: 'Subuh', time: timesToday.fajr },
                { name: 'Syuruq', time: timesToday.sunrise },
                { name: 'Dzuhur', time: timesToday.dhuhr },
                { name: 'Ashar', time: timesToday.asr },
                { name: 'Maghrib', time: timesToday.maghrib },
                { name: 'Isya', time: timesToday.isha },
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

                // Update the time in the list for Subuh to be tomorrow's time
                // (Note: This might affect display if we want to show TODAY's schedule, 
                // but for "Next Prayer" logic it needs to be the future time)
                // A better approach might be to keep today's schedule for list, but handle "next" specially.
                // For simplified requirement, let's update list[0] to tomorrow so countdown works.
                list[0].time = timesTomorrow.fajr;

                // Also update others if we want the whole list to roll over?
                // Usually JWS rolls over after Isya. So let's replace the whole list with tomorrow's if passed Isya.
                list = [
                    { name: 'Subuh', time: timesTomorrow.fajr },
                    { name: 'Syuruq', time: timesTomorrow.sunrise },
                    { name: 'Dzuhur', time: timesTomorrow.dhuhr },
                    { name: 'Ashar', time: timesTomorrow.asr },
                    { name: 'Maghrib', time: timesTomorrow.maghrib },
                    { name: 'Isya', time: timesTomorrow.isha },
                ];
            }

            const formattedList = list.map((p, idx) => ({
                ...p,
                isNext: idx === nextIdx,
                isActive: false
            }));

            setPrayerTimes(formattedList);
            setNextPrayerIndex(nextIdx);
        };

        updatePrayerTimes();
        const interval = setInterval(updatePrayerTimes, 60000); // Check every minute for rollover

        return () => clearInterval(interval);
    }, []);

    return { prayerTimes, nextPrayerIndex };
}
