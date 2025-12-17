// Learn more about Tauri commands at https://tauri.app/develop/calling-rust/
use std::fs;
use std::path::PathBuf;
use tauri::Manager;

/// Get the media directory path in AppData
fn get_media_dir(app_handle: &tauri::AppHandle) -> Result<PathBuf, String> {
    let app_data_dir = app_handle
        .path()
        .app_data_dir()
        .map_err(|e| format!("Failed to get app data dir: {}", e))?;
    Ok(app_data_dir.join("media"))
}

/// Copy a file from source path to AppData media subfolder
/// Subfolders: Image, Audio, Video
#[tauri::command]
fn copy_file_to_appdata(
    app_handle: tauri::AppHandle,
    source_path: String,
    subfolder: String,
) -> Result<String, String> {
    // Validate subfolder
    if !["Image", "Audio", "Video"].contains(&subfolder.as_str()) {
        return Err("Invalid subfolder. Must be: Image, Audio, or Video".to_string());
    }

    let source = PathBuf::from(&source_path);
    if !source.exists() {
        return Err(format!("Source file does not exist: {}", source_path));
    }

    // Get filename
    let filename = source
        .file_name()
        .ok_or("Invalid filename")?
        .to_string_lossy()
        .to_string();

    // Create target directory
    let media_dir = get_media_dir(&app_handle)?;
    let target_dir = media_dir.join(&subfolder);
    fs::create_dir_all(&target_dir).map_err(|e| format!("Failed to create directory: {}", e))?;

    // Copy file
    let target_path = target_dir.join(&filename);
    fs::copy(&source, &target_path).map_err(|e| format!("Failed to copy file: {}", e))?;

    // Return the relative path for asset URL
    Ok(format!("{}/{}", subfolder, filename))
}

/// Get the full file path for a media file (used with convertFileSrc on frontend)
#[tauri::command]
fn get_media_file_path(
    app_handle: tauri::AppHandle,
    subfolder: String,
    filename: String,
) -> Result<String, String> {
    let media_dir = get_media_dir(&app_handle)?;
    let file_path = media_dir.join(&subfolder).join(&filename);

    if !file_path.exists() {
        return Err(format!("File does not exist: {}/{}", subfolder, filename));
    }

    // Return the full file path as a string
    Ok(file_path.to_string_lossy().to_string())
}

/// Get the media directory base path
#[tauri::command]
fn get_media_base_path(app_handle: tauri::AppHandle) -> Result<String, String> {
    let media_dir = get_media_dir(&app_handle)?;
    fs::create_dir_all(&media_dir)
        .map_err(|e| format!("Failed to create media directory: {}", e))?;
    Ok(media_dir.to_string_lossy().to_string())
}

/// List all files in a media subfolder
#[tauri::command]
fn list_media_files(
    app_handle: tauri::AppHandle,
    subfolder: String,
) -> Result<Vec<String>, String> {
    let media_dir = get_media_dir(&app_handle)?;
    let target_dir = media_dir.join(&subfolder);

    if !target_dir.exists() {
        return Ok(vec![]);
    }

    let entries =
        fs::read_dir(&target_dir).map_err(|e| format!("Failed to read directory: {}", e))?;

    let mut files: Vec<String> = Vec::new();
    for entry in entries {
        if let Ok(entry) = entry {
            if let Ok(file_type) = entry.file_type() {
                if file_type.is_file() {
                    if let Some(name) = entry.file_name().to_str() {
                        files.push(name.to_string());
                    }
                }
            }
        }
    }

    Ok(files)
}

/// Delete a file from media subfolder
#[tauri::command]
fn delete_media_file(
    app_handle: tauri::AppHandle,
    subfolder: String,
    filename: String,
) -> Result<(), String> {
    let media_dir = get_media_dir(&app_handle)?;
    let file_path = media_dir.join(&subfolder).join(&filename);

    if !file_path.exists() {
        return Err(format!("File does not exist: {}/{}", subfolder, filename));
    }

    fs::remove_file(&file_path).map_err(|e| format!("Failed to delete file: {}", e))?;

    Ok(())
}

#[tauri::command]
fn greet(name: &str) -> String {
    format!("Hello, {}! You've been greeted from Rust!", name)
}

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    tauri::Builder::default()
        .plugin(tauri_plugin_opener::init())
        .plugin(tauri_plugin_store::Builder::new().build())
        .plugin(tauri_plugin_dialog::init())
        .plugin(tauri_plugin_fs::init())
        .plugin(tauri_plugin_process::init())
        .invoke_handler(tauri::generate_handler![
            greet,
            copy_file_to_appdata,
            get_media_file_path,
            get_media_base_path,
            list_media_files,
            delete_media_file
        ])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
