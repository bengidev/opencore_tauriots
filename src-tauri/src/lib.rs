mod preferences;

use preferences::{AppPreferences, PreferencesStore};
use tauri::{App, LogicalSize, Manager, PhysicalPosition, State, WebviewWindow};

const WELCOME_WINDOW_WIDTH: u32 = 960;
const WELCOME_WINDOW_HEIGHT: u32 = 740;
const HOME_WINDOW_WIDTH: u32 = 1280;
const HOME_WINDOW_HEIGHT: u32 = 800;

fn window_size_for_preferences(preferences: &AppPreferences) -> (u32, u32) {
    if preferences.onboarding_completed {
        (HOME_WINDOW_WIDTH, HOME_WINDOW_HEIGHT)
    } else {
        (WELCOME_WINDOW_WIDTH, WELCOME_WINDOW_HEIGHT)
    }
}

fn logical_inner_size(window: &WebviewWindow) -> Result<(u32, u32), String> {
    let physical = window.inner_size().map_err(|e| e.to_string())?;
    let scale = window.scale_factor().map_err(|e| e.to_string())?;
    Ok((
        (physical.width as f64 / scale).round() as u32,
        (physical.height as f64 / scale).round() as u32,
    ))
}

fn center_on_screen(window: &WebviewWindow) -> Result<(), String> {
    if window.center().is_ok() {
        return Ok(());
    }

    let monitor = window
        .current_monitor()
        .map_err(|e| e.to_string())?
        .ok_or_else(|| "no monitor available".to_string())?;
    let window_size = window.outer_size().map_err(|e| e.to_string())?;
    let monitor_size = monitor.size();
    let monitor_pos = monitor.position();
    let x = monitor_pos.x + (monitor_size.width as i32 - window_size.width as i32) / 2;
    let y = monitor_pos.y + (monitor_size.height as i32 - window_size.height as i32) / 2;
    window
        .set_position(PhysicalPosition::new(x, y))
        .map_err(|e| e.to_string())
}

fn resize_and_center(window: &WebviewWindow, width: u32, height: u32) -> Result<(), String> {
    let (current_width, current_height) = logical_inner_size(window)?;
    let needs_resize = current_width != width || current_height != height;

    if needs_resize {
        window
            .set_size(LogicalSize::new(width, height))
            .map_err(|e| e.to_string())?;
    }

    center_on_screen(window)?;

    if needs_resize {
        let deferred_window = window.clone();
        let _ = window.run_on_main_thread(move || {
            let _ = center_on_screen(&deferred_window);
        });
    }

    Ok(())
}

fn apply_boot_window_layout(app: &App, preferences: &AppPreferences) -> Result<(), String> {
    let window = app
        .get_webview_window("main")
        .ok_or_else(|| "main window not found".to_string())?;
    let (width, height) = window_size_for_preferences(preferences);
    resize_and_center(&window, width, height)
}

#[tauri::command]
fn load_preferences(store: State<'_, PreferencesStore>) -> AppPreferences {
    store.load()
}

#[tauri::command]
fn save_preferences(
    preferences: AppPreferences,
    store: State<'_, PreferencesStore>,
) -> Result<(), String> {
    store.save(preferences)
}

#[tauri::command]
fn reset_preferences(store: State<'_, PreferencesStore>) -> Result<AppPreferences, String> {
    let defaults = AppPreferences::default();
    store.save(defaults.clone())?;
    Ok(defaults)
}

#[tauri::command]
fn resize_and_center_window(
    window: WebviewWindow,
    width: u32,
    height: u32,
) -> Result<(), String> {
    resize_and_center(&window, width, height)
}

#[tauri::command]
fn center_window(window: WebviewWindow) -> Result<(), String> {
    center_on_screen(&window)
}

pub fn run() {
    let preferences_store = PreferencesStore::open().unwrap_or_else(|error| {
        eprintln!("opencore-tauriots: preferences unavailable ({error}), using in-memory defaults");
        PreferencesStore::in_memory()
    });
    let boot_preferences = preferences_store.load();

    tauri::Builder::default()
        .plugin(tauri_plugin_opener::init())
        .manage(preferences_store)
        .setup(move |app| {
            apply_boot_window_layout(app, &boot_preferences)?;
            Ok(())
        })
        .invoke_handler(tauri::generate_handler![
            load_preferences,
            save_preferences,
            reset_preferences,
            resize_and_center_window,
            center_window
        ])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
