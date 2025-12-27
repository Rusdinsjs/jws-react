import { useState, useEffect } from "react";

import { LayoutPosition } from "../../types/layout";

interface DigitalClockProps {
    layoutPosition?: LayoutPosition;
}

// layoutPosition prop left for future extensibility but currently unused for positioning
function DigitalClock({ }: DigitalClockProps) {
    const [currentTime, setCurrentTime] = useState(new Date());

    useEffect(() => {
        const timer = setInterval(() => {
            setCurrentTime(new Date());
        }, 1000);

        return () => clearInterval(timer);
    }, []);

    const getTimeComponents = (date: Date) => {
        const hours = date.getHours().toString().padStart(2, "0");
        const minutes = date.getMinutes().toString().padStart(2, "0");
        const seconds = date.getSeconds().toString().padStart(2, "0");
        return { hours, minutes, seconds };
    };

    const formatDate = (date: Date) => {
        return date.toLocaleDateString("id-ID", {
            weekday: "long",
            year: "numeric",
            month: "long",
            day: "numeric",
        });
    };

    const time = getTimeComponents(currentTime);

    const formatHijriDate = (date: Date) => {
        return date.toLocaleDateString("id-ID-u-ca-islamic", {
            day: "numeric",
            month: "long",
            year: "numeric",
        });
    };

    // Determine position classes based on layout
    // Always Top-Right as requested
    const positionClasses = "absolute top-10 right-8 text-right z-50";

    // Determine flex alignment for date container
    const dateContainerClasses = "mt-1 flex flex-col items-end";

    return (
        <div className={positionClasses}>
            <div className="flex items-start font-bold text-white tracking-wider -mt-5 drop-shadow-2xl p-1 justify-end ">
                <span className="text-[7rem] leading-none w-[400px]" style={{ fontFamily: "var(--font-family-time)" }}>
                    {time.hours}:{time.minutes}
                </span>
                <span className="text-[5rem] leading-none -translate-y-1 ml-1 opacity-90 text-amber-500 w-[120px]" style={{ fontFamily: "var(--font-family-time)" }}>
                    {time.seconds}
                </span>
            </div>
            <div className={dateContainerClasses}>
                <p className="text-[1.95rem] text-slate-300 font-bold">
                    {formatDate(currentTime) + " M"}
                </p>
                <p className="text-[1.625rem] text-amber-500/80 font-bold mt-1">
                    {formatHijriDate(currentTime)}
                </p>
            </div>
        </div>
    );
}

export default DigitalClock;
