
export interface IslamicEvent {
    name: string;
    date: string; // "DD MMMM YYYY" (Hijri or Gregorian formatted)
    rawDate?: Date; // Optional raw date object for countdowns
    type: "Fasting" | "Holiday";
    description?: string;
}

// Helper to get Hijri date parts
function getHijriDate(date: Date) {
    const formatter = new Intl.DateTimeFormat('en-u-ca-islamic-civil-nu-latn', {
        day: 'numeric',
        month: 'numeric',
        year: 'numeric'
    });
    const parts = formatter.formatToParts(date);
    const day = parseInt(parts.find(p => p.type === 'day')?.value || '1');
    const month = parseInt(parts.find(p => p.type === 'month')?.value || '1');
    const year = parseInt(parts.find(p => p.type === 'year')?.value || '1446');
    return { day, month, year };
}

// Helper to format date nicely
function formatDateID(date: Date) {
    return date.toLocaleDateString("id-ID", {
        weekday: 'long',
        day: 'numeric',
        month: 'long',
        year: 'numeric'
    });
}


export function getNextSunnahFasting(): IslamicEvent {
    const today = new Date();
    const dayOfWeek = today.getDay(); // 0 = Sunday, 1 = Monday, ...

    // 1. Check Senin (Monday = 1) / Kamis (Thursday = 4)
    let daysToNextMonday = (1 - dayOfWeek + 7) % 7;
    if (daysToNextMonday === 0) daysToNextMonday = 7; // If today is Monday, next is next week? Or today? Let's say next upcoming. 
    // Actually typically display "Besok" or "Hari ini".
    // If today is Monday, valid fasting is today if before maghrib? Let's assume looking for *future* or *active* fast.
    // Simplifying: Look for the very next occurrence (including today if early enough, but let's stick to future dates for "Upcoming").

    // Let's iterate next 7 days and see which comes first: Monday, Thursday, or Ayyamul Bidh.

    // For simplicity, let's just pick the nearest Monday or Thursday.
    let nextFastDate = new Date(today);
    let fastName = "";

    // Calculate next Monday
    const nextMonday = new Date(today);
    nextMonday.setDate(today.getDate() + ((1 - dayOfWeek + 7) % 7 || 7));

    // Calculate next Thursday
    const nextThursday = new Date(today);
    nextThursday.setDate(today.getDate() + ((4 - dayOfWeek + 7) % 7 || 7));

    if (nextMonday < nextThursday) {
        nextFastDate = nextMonday;
        fastName = "Puasa Sunnah Senin";
    } else {
        nextFastDate = nextThursday;
        fastName = "Puasa Sunnah Kamis";
    }

    // Ayyamul Bidh logic (Dates 13, 14, 15 Hijri) is complex without a robust library to map Future Gregorian to Hijri accurately.
    // For this MVP, we will stick to Senin/Kamis which is safer and always correct.

    return {
        name: fastName,
        date: formatDateID(nextFastDate),
        rawDate: nextFastDate, // Added raw date for countdown
        type: "Fasting",
        description: "Disunnahkan berpuasa pada hari Senin dan Kamis."
    };
}

const ISLAMIC_HOLIDAYS = [
    { month: 1, day: 1, name: "Tahun Baru Islam" },
    { month: 3, day: 12, name: "Maulid Nabi Muhammad SAW" },
    { month: 7, day: 27, name: "Isra' Mi'raj" },
    { month: 9, day: 1, name: "Awal Ramadhan" },
    { month: 9, day: 17, name: "Nuzulul Qur'an" },
    { month: 10, day: 1, name: "Hari Raya Idul Fitri" },
    { month: 12, day: 10, name: "Hari Raya Idul Adha" }
];

export function getNextIslamicHoliday(): IslamicEvent {
    // This is valid approximation. 
    // We get today's Hijri date, then find the next matching month/day in list.
    const today = new Date();
    const { day: hDay, month: hMonth, year: hYear } = getHijriDate(today);

    let nextEvent = null;
    let eventYear = hYear;

    // Find first event in current year that hasn't passed
    for (const event of ISLAMIC_HOLIDAYS) {
        if (event.month > hMonth || (event.month === hMonth && event.day >= hDay)) {
            nextEvent = event;
            break;
        }
    }

    // If no event left this year, pick first of next year
    if (!nextEvent) {
        nextEvent = ISLAMIC_HOLIDAYS[0];
        eventYear = hYear + 1;
    }

    // Find the Gregorian date for this Hijri event by searching forward
    const targetDate = new Date(today);
    // Limit search to ~1 year (approx 360 days) to prevent infinite loops
    let daysSearched = 0;
    while (daysSearched < 360) {
        const h = getHijriDate(targetDate);
        if (h.month === nextEvent.month && h.day === nextEvent.day) {
            break;
        }
        targetDate.setDate(targetDate.getDate() + 1);
        daysSearched++;
    }

    const hijriMonthNames = ["Muharram", "Safar", "Rabiul Awal", "Rabiul Akhir", "Jumadil Awal", "Jumadil Akhir", "Rajab", "Sya'ban", "Ramadhan", "Syawal", "Dzulkaidah", "Dzulhijjah"];
    const formattedDate = `${nextEvent.day} ${hijriMonthNames[nextEvent.month - 1]} ${eventYear}`;

    return {
        name: nextEvent.name,
        date: formattedDate,
        rawDate: targetDate, // Populated via search
        type: "Holiday",
        description: "Mari persiapkan diri menyambut hari besar ini."
    };
}
