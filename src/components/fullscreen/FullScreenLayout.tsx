import { ReactNode } from "react";
import { useTheme } from "../../context/ThemeContext";

interface FullScreenLayoutProps {
    children: ReactNode;
    title?: string;
    subtitle?: string;
    bgGradient?: string; // Optional gradient override
    bgImage?: string;    // Background image URL
}

function FullScreenLayout({
    children,
    title,
    subtitle,
    bgGradient,
    bgImage
}: FullScreenLayoutProps) {
    const { theme } = useTheme();

    // Use provided gradient or theme's fullscreen gradient
    const gradient = bgGradient || theme.colors.fullscreenGradient;

    return (
        <div
            className={`fixed inset-0 z-[100] flex flex-col items-center justify-center text-white p-10 transition-colors duration-500`}
            style={{
                backgroundImage: bgImage
                    ? `linear-gradient(to bottom right, rgba(0,0,0,0.6), rgba(0,0,0,0.8)), url(${bgImage})`
                    : undefined,
                backgroundSize: bgImage ? 'cover' : undefined,
                backgroundPosition: bgImage ? 'center' : undefined
            }}
        >
            {/* Fallback gradient if no image */}
            {!bgImage && (
                <div className={`absolute inset-0 bg-gradient-to-br ${gradient} -z-10`} />
            )}

            {(title || subtitle) && (
                <div className="absolute top-10 left-0 right-0 text-center">
                    {title && (
                        <h1
                            className="text-6xl font-bold mb-4 tracking-wider drop-shadow-lg"
                            style={{ color: theme.colors.textPrimary }}
                        >
                            {title}
                        </h1>
                    )}
                    {subtitle && (
                        <p
                            className="text-3xl font-light tracking-wide"
                            style={{ color: theme.colors.textSecondary }}
                        >
                            {subtitle}
                        </p>
                    )}
                </div>
            )}

            <div className="flex-1 flex flex-col items-center justify-center w-full">
                {children}
            </div>
        </div>
    );
}

export default FullScreenLayout;
