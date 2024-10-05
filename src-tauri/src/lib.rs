use std::collections::HashMap;
use std::sync::Arc;
use tokio_postgres::{NoTls};
use serde::{Serialize, Serializer};
use tauri::{Manager, State};
use tokio::sync::Mutex;
use async_trait::async_trait;

#[derive(Clone, Serialize)]
#[serde(rename_all = "camelCase")]
struct Column {
    name: String,
    #[serde(rename = "dataTypeID")]
    type_id: u32,
}

#[derive(Clone, Serialize)]
#[serde(rename_all = "camelCase")]
struct QueryResult {
    columns: Vec<Column>,
    rows: Vec<Vec<String>>,
}

#[derive(Debug, thiserror::Error)]
pub enum Error {
    #[error("{0}")]
    Postgres(#[from] tokio_postgres::Error),
    #[error("{0}")]
    Io(#[from] std::io::Error),
}

impl Serialize for Error {
    fn serialize<S>(&self, serializer: S) -> Result<S::Ok, S::Error>
    where
        S: Serializer,
    {
        serializer.serialize_str(self.to_string().as_ref())
    }
}

#[derive(Default)]
struct AppState {
    clients: HashMap<String, Box<dyn Client>>,
}

#[async_trait]
trait Client: Send + Sync {
    async fn query(&self, sql: &str) -> Result<QueryResult, Error>;
}

struct PostgresClient {
    client: Arc<tokio_postgres::Client>,
}

impl PostgresClient {
    async fn connect(url: &str) -> Result<Self, Error> {
        let (client, connection) = tokio_postgres::connect(&url, NoTls).await
            .map_err(Error::from)?;
        tokio::spawn(async move {
            if let Err(e) = connection.await {
                eprintln!("postgres connection error: {}", e);
            }
        });
        Ok(Self {
            client: Arc::new(client),
        })
    }
}

#[async_trait]
impl Client for PostgresClient {
    async fn query(&self, sql: &str) -> Result<QueryResult, Error> {
        let stmt = self.client.prepare(&sql).await?;
        let columns = stmt.columns().iter().map(|c| Column {
            name: c.name().to_owned(),
            type_id: c.type_().oid().to_owned(),
        }).collect::<Vec<_>>();
        let columns_len = columns.len();

        let rows = self.client.simple_query(&sql).await?;
        let rows = rows.into_iter().filter_map(|r| {
            if let tokio_postgres::SimpleQueryMessage::Row(row) = r {
                Some(row)
            } else {
                None
            }
        }).map(|r| {
            let mut rows = Vec::with_capacity(columns_len);
            for i in 0..columns_len {
                let val = r.get(i).unwrap_or_default();
                rows.push(val.to_owned());
            }
            rows
        }).collect::<Vec<_>>();

        Ok(QueryResult {
            columns,
            rows
        })
    }
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
