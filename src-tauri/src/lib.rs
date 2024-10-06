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
use tauri::TitleBarStyle;

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

fn setup_window(app: &mut tauri::App) -> Result<(), tauri::Error> {
    let win_builder = WebviewWindowBuilder::new(app, "main", WebviewUrl::default())
        .title("SqlZen")
        .inner_size(800.0, 600.0);

    #[cfg(target_os = "windows")]
    let win_builder = win_builder.decorations(false);

    #[cfg(target_os = "macos")]
    let win_builder = win_builder.title_bar_style(TitleBarStyle::Overlay);

    // keep normal title bar on all other operating systems

    win_builder.build()?;

    Ok(())
}

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    tauri::Builder::default()
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
