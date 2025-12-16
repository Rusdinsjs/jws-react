export interface TextSlide {
    type: "text";
    content: string;
    fontSize: string; // Tailwind class (e.g. "text-sm", "text-xl") or arbitrary
    fontFamily?: string; // Font family name or class
    indent: number; // 0-100 px
    uppercase: boolean;
    italic: boolean;
}

export interface MediaSlide {
    type: "image" | "video";
    src: string; // URL or file path
    duration?: number; // seconds to display (for images, videos use their length)
}

export type Slide = TextSlide | MediaSlide;

export interface SliderConfig {
    slides: Slide[];
    interval: number; // seconds between slides
}
