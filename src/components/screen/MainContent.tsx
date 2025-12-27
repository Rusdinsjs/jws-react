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
    timezone?: string;
}

function MainContent({ layoutPosition = "Vertical-Left", mosqueData, slides = [], onOpenSettings, timezone }: MainContentProps) {
    const isHorizontalBottom = layoutPosition === "Horizontal-Bottom";

    return (
        <div className="flex-1 flex flex-col h-full overflow-hidden p-6 gap-6">
            {/* Header Area */}
            <div className="h-[18vh] shrink-0">
                <Header className="rounded-3xl" data={mosqueData} onOpenSettings={onOpenSettings} />
            </div>

            {/* Content Area */}
            <div className="flex-1 min-h-0">
                {isHorizontalBottom ? (
                    /* Horizontal-Bottom Layout: Row 2 split into 2 Cols (70% - 30%) */
                    <div className="grid grid-cols-[70%_30%] h-full gap-6">
                        {/* Col 1 (70%) */}
                        <Slider className="rounded-3xl" slides={slides} />

                        {/* Col 2 (30%) */}
                        <div className="grid grid-rows-2 h-full gap-6">
                            <NextPrayer className="rounded-3xl" timezone={timezone} />
                            <Info className="rounded-3xl" />
                        </div>
                    </div>
                ) : (
                    /* Default Layout (Vertical) */
                    <div className="grid grid-rows-[65%_35%] h-full gap-6">
                        {/* Row 2a - 65% for Slider */}
                        <Slider className="rounded-3xl" slides={slides} />

                        {/* Row 2b - 35% (Split into 2 cols) */}
                        <div className="grid grid-cols-2 h-full gap-6">
                            <NextPrayer className="rounded-3xl" timezone={timezone} />
                            <Info className="rounded-3xl" />
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}

export default MainContent;
