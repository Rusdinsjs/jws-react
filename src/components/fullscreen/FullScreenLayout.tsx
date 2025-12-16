import { ReactNode } from "react";
import { useTheme } from "../../context/ThemeContext";

interface FullScreenLayoutProps {
    children: ReactNode;
    title?: string;
    subtitle?: string;
    bgGradient?: string; // Optional override
}

function FullScreenLayout({
    children,
    title,
    subtitle,
    bgGradient
}: FullScreenLayoutProps) {
    const { theme } = useTheme();

    // Use provided gradient or theme's fullscreen gradient
    const gradient = bgGradient || theme.colors.fullscreenGradient;

    return (
        <div className={`fixed inset-0 z-[100] flex flex-col items-center justify-center bg-gradient-to-br ${gradient} text-white p-10 transition-colors duration-500`}>
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
