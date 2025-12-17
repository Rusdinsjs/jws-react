import { LayoutPosition } from "../../types/layout";
import { useTheme } from "../../context/ThemeContext";
import { usePrayerTimes } from "../../context/PrayerTimesContext";
import PrayerCard from "./PrayerCard";

interface SideBarProps {
    position?: LayoutPosition;
}

function SideBar({ position = "Vertical-Left" }: SideBarProps) {
    const { theme } = useTheme();
    const { prayerTimes } = usePrayerTimes();

    // Dynamic classes based on position
    const isVertical = position.startsWith("Vertical");

    let containerClasses = "backdrop-blur-md shadow-2xl flex items-center transition-colors duration-500 relative z-50 ";

    // Width & Height
    if (isVertical) {
        // Vertical: Scrollable vertically, centered items
        containerClasses += "w-[30%] h-full flex-col gap-6 p-6 overflow-hidden scrollbar-hide justify-start ";
    } else {
        // Horizontal: Scrollable horizontally (if needed), centered items
        containerClasses += "w-full h-[24%] flex-row gap-6 p-6 overflow-hidden scrollbar-hide justify-start ";
    }

    // Scale for Horizontal Layout: 0.9 (90%)
    // For Vertical: Height 0.9, Content 0.95
    const cardScale = isVertical ? 1 : 0.9;
    const heightScale = isVertical ? 0.9 : undefined; // falls back to cardScale
    const contentScale = isVertical ? 0.95 : undefined; // falls back to cardScale

    const content = (
        <>
            {prayerTimes.map((prayer) => (
                <PrayerCard
                    key={`original-${prayer.name}`}
                    name={prayer.name}
                    time={prayer.time}
                    isNext={prayer.isNext}
                    scale={cardScale}
                    heightScale={heightScale}
                    contentScale={contentScale}
                />
            ))}
            {/* Duplicated content for seamless scrolling */}
            {prayerTimes.map((prayer) => (
                <PrayerCard
                    key={`duplicate-${prayer.name}`}
                    name={prayer.name}
                    time={prayer.time}
                    isNext={prayer.isNext}
                    scale={cardScale}
                    heightScale={heightScale}
                    contentScale={contentScale}
                />
            ))}
        </>
    );

    return (
        <div
            className={containerClasses}
            style={{
                backgroundColor: theme.colors.glassBackground,
                // Borders removed as requested
            }}
        >
            {isVertical ? (
                <div className="w-full flex-col -mr-4 gap-6 animate-scroll-vertical flex">
                    {content}
                </div>
            ) : (
                <div className="h-full flex-row gap-6 animate-scroll-horizontal flex items-center">
                    {content}
                </div>
            )}
        </div>
    );
}

export default SideBar;
