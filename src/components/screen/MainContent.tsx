import { LayoutPosition } from "../../types/layout";
import { MosqueData } from "../../types/mosque";
import { Slide } from "../../types/slide";
import Header from "./views/Contents/Header";
import Slider from "./views/Contents/Slider";
import NextPrayer from "./views/Contents/NextPrayer";
import Info from "./views/Contents/Info";

interface MainContentProps {
    layoutPosition?: LayoutPosition;
    mosqueData?: MosqueData;
    slides?: Slide[];
    onOpenSettings?: () => void;
}

function MainContent({ layoutPosition = "Vertical-Left", mosqueData, slides = [], onOpenSettings }: MainContentProps) {
    const isHorizontalBottom = layoutPosition === "Horizontal-Bottom";

    return (
        <div className="flex-1 grid grid-rows-[20vh_1fr] h-full overflow-hidden">
            {/* Row 1 - 20vh (Fixed Height) */}
            <Header data={mosqueData} onOpenSettings={onOpenSettings} />

            {/* Row 2 - Rest of height */}
            {isHorizontalBottom ? (
                /* Horizontal-Bottom Layout: Row 2 split into 2 Cols (70% - 30%) */
                <div className="grid grid-cols-[70%_30%] h-full overflow-hidden">
                    {/* Col 1 (70%) */}
                    <Slider slides={slides} />

                    {/* Col 2 (30%) */}
                    <div className="grid grid-rows-2 h-full overflow-hidden">
                        <NextPrayer />
                        <Info />
                    </div>
                </div>
            ) : (
                /* Default Layout (Vertical) */
                <div className="grid grid-rows-[70%_30%] h-full overflow-hidden">
                    {/* Row 2a - 70% */}
                    <Slider slides={slides} />

                    {/* Row 2b - 30% (Split into 2 cols) */}
                    <div className="grid grid-cols-2 h-full overflow-hidden">
                        <NextPrayer />
                        <Info />
                    </div>
                </div>
            )}
        </div>
    );
}

export default MainContent;
