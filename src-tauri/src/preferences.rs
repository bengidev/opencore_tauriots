//! Persisted user settings (theme and onboarding completion).

use serde::{Deserialize, Serialize};
use std::fs;
use std::path::PathBuf;
use std::sync::Mutex;

#[derive(Debug, Clone, Copy, Default, PartialEq, Eq, Serialize, Deserialize)]
#[serde(rename_all = "lowercase")]
pub enum ThemeMode {
    #[default]
    Light,
    Dark,
}

impl ThemeMode {
    #[allow(dead_code)]
    pub fn toggle(self) -> Self {
        match self {
            Self::Light => Self::Dark,
            Self::Dark => Self::Light,
        }
    }
}

#[derive(Debug, Clone, Default, PartialEq, Serialize, Deserialize)]
#[serde(default)]
pub struct AppPreferences {
    pub theme_mode: ThemeMode,
    pub onboarding_completed: bool,
}

pub struct PreferencesStore {
    path: Option<PathBuf>,
    cache: Mutex<AppPreferences>,
}

impl PreferencesStore {
    pub fn open() -> Result<Self, String> {
        let path = default_preferences_path()?;
        let prefs = read_preferences_file(&path)?;
        Ok(Self {
            path: Some(path),
            cache: Mutex::new(prefs),
        })
    }

    pub fn in_memory() -> Self {
        Self {
            path: None,
            cache: Mutex::new(AppPreferences::default()),
        }
    }

    pub fn load(&self) -> AppPreferences {
        self.cache.lock().expect("preferences lock").clone()
    }

    pub fn save(&self, preferences: AppPreferences) -> Result<(), String> {
        if let Some(path) = &self.path {
            write_preferences_file(path, &preferences)?;
        }
        *self.cache.lock().expect("preferences lock") = preferences;
        Ok(())
    }
}

fn default_preferences_path() -> Result<PathBuf, String> {
    let base =
        directories::ProjectDirs::from("io.github.bengidev", "opencore", "opencore-tauriots")
            .ok_or_else(|| "could not resolve application data directory".to_string())?
            .data_dir()
            .to_path_buf();
    Ok(base.join("preferences.json"))
}

fn read_preferences_file(path: &PathBuf) -> Result<AppPreferences, String> {
    if !path.exists() {
        return Ok(AppPreferences::default());
    }
    let contents = fs::read_to_string(path).map_err(|e| e.to_string())?;
    match serde_json::from_str(&contents) {
        Ok(preferences) => Ok(preferences),
        Err(parse_error) => {
            eprintln!("opencore-tauriots: corrupt preferences reset to defaults ({parse_error})");
            backup_corrupt_file(path)?;
            Ok(AppPreferences::default())
        }
    }
}

fn write_preferences_file(path: &PathBuf, preferences: &AppPreferences) -> Result<(), String> {
    if let Some(parent) = path.parent() {
        fs::create_dir_all(parent).map_err(|e| e.to_string())?;
    }
    let contents = serde_json::to_string_pretty(preferences).map_err(|e| e.to_string())?;
    let temp_path = path.with_extension("tmp");
    fs::write(&temp_path, &contents).map_err(|e| e.to_string())?;
    fs::rename(&temp_path, path).map_err(|e| e.to_string())?;
    Ok(())
}

fn backup_corrupt_file(path: &PathBuf) -> Result<(), String> {
    if !path.exists() {
        return Ok(());
    }
    let backup_path = path.with_extension("corrupt");
    let _ = fs::remove_file(&backup_path);
    fs::rename(path, &backup_path).map_err(|e| e.to_string())?;
    Ok(())
}

#[cfg(test)]
mod tests {
    use super::*;
    use tempfile::TempDir;

    #[test]
    fn preferences_round_trip() {
        let dir = TempDir::new().expect("temp dir");
        let path = dir.path().join("preferences.json");
        let prefs = AppPreferences {
            theme_mode: ThemeMode::Light,
            onboarding_completed: true,
        };
        write_preferences_file(&path, &prefs).expect("write");
        let loaded = read_preferences_file(&path).expect("read");
        assert_eq!(loaded, prefs);
    }

    #[test]
    fn corrupt_file_resets_to_defaults() {
        let dir = TempDir::new().expect("temp dir");
        let path = dir.path().join("preferences.json");
        fs::write(&path, "{not json").expect("write corrupt");
        let loaded = read_preferences_file(&path).expect("read");
        assert_eq!(loaded, AppPreferences::default());
        assert!(!path.exists());
    }
}
