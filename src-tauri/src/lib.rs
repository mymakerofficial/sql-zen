mod error;
mod client;
mod types;
mod postgres;

use std::collections::HashMap;
use tauri::{Manager, State};
use tokio::sync::Mutex;
use client::Client;
use error::Error;
use postgres::PostgresClient;
use types::QueryResult;

#[derive(Default)]
struct AppState {
    clients: HashMap<String, Box<dyn Client>>,
}

#[tauri::command]
async fn connect(state: State<'_, Mutex<AppState>>, key: String, url: String) -> Result<(), Error> {
    let mut state = state.lock().await;
    let client = PostgresClient::connect(&url).await?;
    state.clients.insert(key, Box::new(client));
    Ok(())
}

#[tauri::command]
async fn query(state: State<'_, Mutex<AppState>>, key: &str, sql: &str) -> Result<QueryResult, Error> {
    let state = state.lock().await;
    let client = state.clients.get(key)
        .ok_or(Error::Io(std::io::Error::new(std::io::ErrorKind::NotFound, "client not found")))?;
    client.query(sql).await
}

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    tauri::Builder::default()
        .setup(|app| {
            app.manage(Mutex::new(AppState {
                clients: HashMap::new(),
            }));
            Ok(())
        })
        .invoke_handler(tauri::generate_handler![connect, query])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
