import { useState, useEffect, useRef } from "react";
import { Slide } from "../../../../types/slide";

interface ViewProps {
    className?: string;
    slides?: Slide[];
    interval?: number; // seconds
}

function Slider({ className = "", slides = [], interval = 10 }: ViewProps) {
    const [currentIndex, setCurrentIndex] = useState(0);
    const videoRef = useRef<HTMLVideoElement>(null);

    // Auto-rotation
    useEffect(() => {
        if (slides.length <= 1) return;

        const currentSlide = slides[currentIndex];

        // For videos, wait for video to end instead of fixed interval
        if (currentSlide?.type === "video" && videoRef.current) {
            const handleVideoEnd = () => {
                setCurrentIndex(prev => (prev + 1) % slides.length);
            };
            videoRef.current.addEventListener("ended", handleVideoEnd);
            return () => videoRef.current?.removeEventListener("ended", handleVideoEnd);
        }

        // For text/image, use interval
        const timer = setInterval(() => {
            setCurrentIndex(prev => (prev + 1) % slides.length);
        }, interval * 1000);

        return () => clearInterval(timer);
    }, [currentIndex, slides, interval]);

    // Reset index if slides change
    useEffect(() => {
        setCurrentIndex(0);
    }, [slides.length]);

    if (slides.length === 0) {
        return (
            <div className={`bg-white/10 backdrop-blur-md p-6 shadow-2xl flex items-center justify-center h-full w-full ${className}`}>
                <p className="text-slate-400 text-center italic">Tidak ada slide. Tambahkan slide di Settings.</p>
            </div>
        );
    }

    const currentSlide = slides[currentIndex];

    const renderSlide = () => {
        if (currentSlide.type === "text") {
            // Backward compatibility for old slides
            let fontSizeClass = currentSlide.fontSize;
            if (currentSlide.fontSize === "small") fontSizeClass = "text-2xl";
            else if (currentSlide.fontSize === "medium") fontSizeClass = "text-4xl";
            else if (currentSlide.fontSize === "large") fontSizeClass = "text-6xl";

            return (
                <p
                    className={`text-white font-light leading-relaxed ${fontSizeClass}`}
                    style={{
                        paddingLeft: `${currentSlide.indent}px`,
                        textTransform: currentSlide.uppercase ? "uppercase" : "none",
                        fontStyle: currentSlide.italic ? "italic" : "normal",
                        fontFamily: currentSlide.fontFamily
                    }}
                >
                    {currentSlide.content}
                </p>
            );
        }

        if (currentSlide.type === "image") {
            return (
                <img
                    src={currentSlide.src}
                    alt="Slide"
                    className="max-w-full max-h-full object-contain drop-shadow-lg"
                    style={{ width: 'auto', height: 'auto' }}
                />
            );
        }

        if (currentSlide.type === "video") {
            return (
                <video
                    ref={videoRef}
                    src={currentSlide.src}
                    className="max-w-full max-h-full object-contain"
                    style={{ width: 'auto', height: 'auto' }}
                    autoPlay
                    muted
                    playsInline
                />
            );
        }

        return null;
    };

    return (
        <div className={`bg-white/10 backdrop-blur-md p-6 shadow-2xl flex items-center justify-center h-full w-full relative overflow-hidden ${className}`}>
            {renderSlide()}

            {/* Slide Indicator */}
            {slides.length > 1 && (
                <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
                    {slides.map((_, idx) => (
                        <div
                            key={idx}
                            className={`w-2 h-2 rounded-full transition-all ${idx === currentIndex ? "bg-amber-500 scale-125" : "bg-white/30"
                                }`}
                        />
                    ))}
                </div>
            )}
        </div>
    );
}

export default Slider;
