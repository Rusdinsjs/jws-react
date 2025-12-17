import React, { useState } from 'react';
import {
    pickAndCopyMedia,
    MediaSubfolder,
    IMAGE_EXTENSIONS,
    AUDIO_EXTENSIONS,
    VIDEO_EXTENSIONS
} from '../../services/mediaService';

interface MediaUploaderProps {
    /** Target subfolder: Image, Audio, or Video */
    subfolder: MediaSubfolder;
    /** Current media URL value */
    value: string;
    /** Callback when media is uploaded/changed */
    onChange: (url: string) => void;
    /** Media type for preview rendering */
    type: 'image' | 'audio' | 'video';
    /** Optional label text */
    label?: string;
    /** Optional placeholder when no media */
    placeholder?: string;
    /** Optional custom file extensions filter */
    extensions?: string[];
    /** Show preview of the media */
    showPreview?: boolean;
    /** Custom styles */
    style?: React.CSSProperties;
}

/**
 * Reusable media uploader component with file picker and preview
 */
export function MediaUploader({
    subfolder,
    value,
    onChange,
    type,
    label,
    placeholder = 'Tidak ada file dipilih',
    extensions,
    showPreview = true,
    style
}: MediaUploaderProps) {
    const [isUploading, setIsUploading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    // Get default extensions based on type
    const fileExtensions = extensions || (() => {
        switch (type) {
            case 'image': return IMAGE_EXTENSIONS;
            case 'audio': return AUDIO_EXTENSIONS;
            case 'video': return VIDEO_EXTENSIONS;
        }
    })();

    const handleUpload = async () => {
        setIsUploading(true);
        setError(null);

        try {
            const url = await pickAndCopyMedia(subfolder, fileExtensions);
            if (url) {
                onChange(url);
            }
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Upload gagal');
            console.error('[MediaUploader] Upload error:', err);
        } finally {
            setIsUploading(false);
        }
    };

    const handleClear = () => {
        onChange('');
    };

    // Extract filename from URL for display
    const getFilename = (url: string): string => {
        if (!url) return '';
        const parts = url.split('/');
        return decodeURIComponent(parts[parts.length - 1]) || url;
    };

    const renderPreview = () => {
        if (!value || !showPreview) return null;

        switch (type) {
            case 'image':
                return (
                    <div style={{
                        marginTop: 8,
                        maxWidth: 200,
                        maxHeight: 150,
                        overflow: 'hidden',
                        borderRadius: 8,
                        border: '1px solid rgba(255,255,255,0.1)'
                    }}>
                        <img
                            src={value}
                            alt="Preview"
                            style={{
                                width: '100%',
                                height: '100%',
                                objectFit: 'cover'
                            }}
                            onError={(e) => {
                                (e.target as HTMLImageElement).style.display = 'none';
                            }}
                        />
                    </div>
                );
            case 'audio':
                return (
                    <audio
                        controls
                        src={value}
                        style={{ marginTop: 8, width: '100%', maxWidth: 300 }}
                    />
                );
            case 'video':
                return (
                    <video
                        controls
                        src={value}
                        style={{
                            marginTop: 8,
                            maxWidth: 300,
                            maxHeight: 200,
                            borderRadius: 8
                        }}
                    />
                );
        }
    };

    return (
        <div style={{ marginBottom: 12, ...style }}>
            {label && (
                <label style={{
                    display: 'block',
                    marginBottom: 6,
                    fontSize: 14,
                    fontWeight: 500,
                    color: 'rgba(255, 255, 255, 0.9)'
                }}>
                    {label}
                </label>
            )}

            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <button
                    onClick={handleUpload}
                    disabled={isUploading}
                    style={{
                        padding: '8px 16px',
                        borderRadius: 6,
                        border: 'none',
                        background: 'linear-gradient(135deg, #4f46e5, #7c3aed)',
                        color: 'white',
                        cursor: isUploading ? 'wait' : 'pointer',
                        fontSize: 13,
                        fontWeight: 500,
                        opacity: isUploading ? 0.7 : 1,
                        transition: 'all 0.2s ease'
                    }}
                >
                    {isUploading ? '⏳ Uploading...' : '📁 Pilih File'}
                </button>

                {value && (
                    <button
                        onClick={handleClear}
                        style={{
                            padding: '8px 12px',
                            borderRadius: 6,
                            border: '1px solid rgba(255,255,255,0.2)',
                            background: 'transparent',
                            color: 'rgba(255,255,255,0.7)',
                            cursor: 'pointer',
                            fontSize: 13
                        }}
                    >
                        ✕ Hapus
                    </button>
                )}

                <span style={{
                    fontSize: 13,
                    color: value ? 'rgba(255, 255, 255, 0.8)' : 'rgba(255, 255, 255, 0.4)',
                    flex: 1,
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    whiteSpace: 'nowrap'
                }}>
                    {value ? getFilename(value) : placeholder}
                </span>
            </div>

            {error && (
                <div style={{
                    marginTop: 6,
                    color: '#ef4444',
                    fontSize: 12
                }}>
                    ⚠️ {error}
                </div>
            )}

            {renderPreview()}
        </div>
    );
}

export default MediaUploader;
