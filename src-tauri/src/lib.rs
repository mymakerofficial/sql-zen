mod client;
mod error;
mod mysql;
mod postgres;
mod types;

use client::Client;
use error::Error;
use mysql::MySQLClient;
use postgres::PostgresClient;
use serde::{Deserialize, Serialize};
use std::collections::HashMap;
use tauri::{Manager, State, WebviewUrl, WebviewWindowBuilder};
use tokio::sync::Mutex;
use types::QueryResult;

#[cfg(target_os = "macos")]
use tauri::{TitleBarStyle, WebviewWindow};

#[derive(Default)]
struct AppState {
    clients: HashMap<String, Box<dyn Client>>,
}

#[derive(Serialize, Deserialize)]
enum DatabaseDriver {
    #[serde(rename = "postgresql")]
    Postgres,
    #[serde(rename = "mysql")]
    MySQL,
}

async fn connect_postgres(state: &mut AppState, key: String, url: String) -> Result<(), Error> {
    let client = PostgresClient::connect(&url).await?;
    state.clients.insert(key, Box::new(client));
    Ok(())
}

async fn connect_mysql(state: &mut AppState, key: String, url: String) -> Result<(), Error> {
    let client = MySQLClient::connect(&url).await?;
    state.clients.insert(key, Box::new(client));
    Ok(())
}

#[tauri::command]
async fn connect(
    state: State<'_, Mutex<AppState>>,
    key: String,
    driver: DatabaseDriver,
    url: String,
) -> Result<(), Error> {
    let mut state = state.lock().await;
    match driver {
        DatabaseDriver::Postgres => connect_postgres(&mut state, key, url).await,
        DatabaseDriver::MySQL => connect_mysql(&mut state, key, url).await,
    }
}

#[tauri::command]
async fn query(
    state: State<'_, Mutex<AppState>>,
    key: &str,
    sql: &str,
) -> Result<QueryResult, Error> {
    let state = state.lock().await;
    let client = state.clients.get(key).ok_or(Error::Io(std::io::Error::new(
        std::io::ErrorKind::NotFound,
        "client not found",
    )))?;
    client.query(sql).await
}

fn setup_state(app: &mut tauri::App) {
    app.manage(Mutex::new(AppState {
        clients: HashMap::new(),
    }));
}

// https://gist.github.com/charrondev/43150e940bd2771b1ea88256d491c7a9
#[cfg(target_os = "macos")]
fn position_traffic_lights(window: WebviewWindow, x: f64, y: f64) {
    use cocoa::appkit::{NSView, NSWindow, NSWindowButton};
    use cocoa::foundation::NSRect;
    use objc::{msg_send, sel, sel_impl};

    unsafe {
        let ns_window =
            window.ns_window().expect("Failed to get ns window handle") as cocoa::base::id;

        let close = ns_window.standardWindowButton_(NSWindowButton::NSWindowCloseButton);
        let miniaturize =
            ns_window.standardWindowButton_(NSWindowButton::NSWindowMiniaturizeButton);
        let zoom = ns_window.standardWindowButton_(NSWindowButton::NSWindowZoomButton);

        let title_bar_container_view = close.superview().superview();

        let close_rect: NSRect = msg_send![close, frame];
        let button_height = close_rect.size.height;

        let title_bar_frame_height = button_height + y;
        let mut title_bar_rect = NSView::frame(title_bar_container_view);
        title_bar_rect.size.height = title_bar_frame_height;
        title_bar_rect.origin.y = NSView::frame(ns_window).size.height - title_bar_frame_height;
        let _: () = msg_send![title_bar_container_view, setFrame: title_bar_rect];

        let window_buttons = vec![close, miniaturize, zoom];
        let space_between = NSView::frame(miniaturize).origin.x - NSView::frame(close).origin.x;

        for (i, button) in window_buttons.into_iter().enumerate() {
            let mut rect: NSRect = NSView::frame(button);
            rect.origin.x = x + (i as f64 * space_between);
            button.setFrameOrigin(rect.origin);
        }
    }
}

#[cfg(target_os = "macos")]
fn setup_macos_window(window: WebviewWindow) {
    use tauri::WindowEvent;

    position_traffic_lights(window.clone(), 22.0, 22.0);

    window.clone().on_window_event(move |event| {
        let set_traffic_lights = || {
            position_traffic_lights(window.clone(), 22.0, 22.0);
        };

        match event {
            WindowEvent::Resized(..) => set_traffic_lights(),
            WindowEvent::ThemeChanged(..) => set_traffic_lights(),
            _ => {}
        }
    })
}

fn setup_window(app: &mut tauri::App) -> Result<(), tauri::Error> {
    let win_builder = WebviewWindowBuilder::new(app, "main", WebviewUrl::default())
        .title("SqlZen")
        .inner_size(800.0, 600.0);

    #[cfg(target_os = "windows")]
    let win_builder = win_builder.decorations(false);

    #[cfg(target_os = "macos")]
    let win_builder = win_builder
        .title_bar_style(TitleBarStyle::Overlay)
        .hidden_title(true);

    // keep normal title bar on all other operating systems

    let window = win_builder.build()?;

    #[cfg(target_os = "macos")]
    setup_macos_window(window);

    Ok(())
}

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    tauri::Builder::default()
        .plugin(tauri_plugin_process::init())
        .plugin(tauri_plugin_updater::Builder::new().build())
        .plugin(tauri_plugin_os::init())
        .plugin(tauri_plugin_shell::init())
        .setup(|app| {
            setup_state(app);
            setup_window(app)?;
            Ok(())
        })
        .invoke_handler(tauri::generate_handler![connect, query])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
