import { invoke, convertFileSrc } from '@tauri-apps/api/core';
import { open } from '@tauri-apps/plugin-dialog';

export type MediaSubfolder = 'Image' | 'Audio' | 'Video';

export interface MediaFile {
    filename: string;
    url: string;
}

/**
 * Get the full file path for a media file in AppData
 */
async function getMediaFilePath(subfolder: MediaSubfolder, filename: string): Promise<string> {
    return await invoke<string>('get_media_file_path', { subfolder, filename });
}

/**
 * Opens a file dialog and copies the selected file to AppData media folder
 * @param subfolder - Target subfolder (Image, Audio, or Video)
 * @param extensions - File extensions to filter (e.g., ['png', 'jpg'])
 * @returns Asset URL of the copied file, or null if cancelled
 */
export async function pickAndCopyMedia(
    subfolder: MediaSubfolder,
    extensions: string[]
): Promise<string | null> {
    try {
        // Open file dialog
        const selected = await open({
            multiple: false,
            filters: [{
                name: subfolder,
                extensions: extensions
            }]
        });

        if (!selected) {
            return null; // User cancelled
        }

        const sourcePath = selected as string;

        // Copy to AppData
        const relativePath = await invoke<string>('copy_file_to_appdata', {
            sourcePath,
            subfolder
        });

        // Get the filename from relative path
        const filename = relativePath.split('/').pop() || '';

        // Get the full file path and convert to asset URL
        const filePath = await getMediaFilePath(subfolder, filename);
        const url = convertFileSrc(filePath);

        return url;
    } catch (error) {
        console.error('[MediaService] Failed to pick and copy media:', error);
        throw error;
    }
}

/**
 * Get list of all media files in a subfolder
 */
export async function listMediaFiles(subfolder: MediaSubfolder): Promise<MediaFile[]> {
    try {
        const filenames = await invoke<string[]>('list_media_files', { subfolder });

        const files: MediaFile[] = [];
        for (const filename of filenames) {
            try {
                const filePath = await getMediaFilePath(subfolder, filename);
                const url = convertFileSrc(filePath);
                files.push({ filename, url });
            } catch {
                // Skip files that can't get URL
                console.warn(`[MediaService] Could not get URL for ${subfolder}/${filename}`);
            }
        }

        return files;
    } catch (error) {
        console.error('[MediaService] Failed to list media files:', error);
        return [];
    }
}

/**
 * Delete a media file from AppData
 */
export async function deleteMediaFile(subfolder: MediaSubfolder, filename: string): Promise<void> {
    try {
        await invoke('delete_media_file', { subfolder, filename });
    } catch (error) {
        console.error('[MediaService] Failed to delete media file:', error);
        throw error;
    }
}

/**
 * Get the base path for media files in AppData
 */
export async function getMediaBasePath(): Promise<string> {
    try {
        return await invoke<string>('get_media_base_path');
    } catch (error) {
        console.error('[MediaService] Failed to get media base path:', error);
        throw error;
    }
}

// File extension presets for common media types
export const IMAGE_EXTENSIONS = ['png', 'jpg', 'jpeg', 'gif', 'webp', 'bmp', 'svg'];
export const AUDIO_EXTENSIONS = ['mp3', 'wav', 'ogg', 'm4a', 'aac', 'flac'];
export const VIDEO_EXTENSIONS = ['mp4', 'webm', 'mkv', 'avi', 'mov'];

/**
 * Get the duration of an audio file from its URL
 * @param url Asset URL of the audio file
 * @returns Promise resolving to duration in seconds
 */
export function getAudioDuration(url: string): Promise<number> {
    return new Promise((resolve, reject) => {
        const audio = new Audio(url);
        audio.onloadedmetadata = () => {
            resolve(Math.ceil(audio.duration));
        };
        audio.onerror = (e) => {
            reject(new Error(`Failed to load audio: ${e}`));
        };
    });
}
