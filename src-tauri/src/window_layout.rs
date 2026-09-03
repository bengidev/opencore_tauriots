use serde::Deserialize;

#[derive(Debug, Deserialize)]
struct WindowSize {
    width: u32,
    height: u32,
}

#[derive(Debug, Deserialize)]
struct WindowLayout {
    welcome: WindowSize,
    home: WindowSize,
}

fn layout() -> WindowLayout {
    serde_json::from_str(include_str!("../../src/shared/window-layout.json"))
        .expect("parse window-layout.json")
}

pub fn welcome_window_size() -> (u32, u32) {
    let layout = layout();
    (layout.welcome.width, layout.welcome.height)
}

pub fn home_window_size() -> (u32, u32) {
    let layout = layout();
    (layout.home.width, layout.home.height)
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn window_layout_matches_tauri_conf_defaults() {
        let (welcome_w, welcome_h) = welcome_window_size();
        let (home_w, home_h) = home_window_size();
        assert_eq!((welcome_w, welcome_h), (960, 740));
        assert_eq!((home_w, home_h), (1280, 800));
    }
}
