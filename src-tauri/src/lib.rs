use tokio_postgres::{NoTls};
use serde::Serialize;

#[derive(Clone, Serialize)]
#[serde(rename_all = "camelCase")]
struct Column {
    name: String,
    type_id: u32,
}

#[derive(Clone, Serialize)]
#[serde(rename_all = "camelCase")]
struct QueryResult {
    columns: Vec<Column>,
    rows: Vec<Vec<String>>,
}

#[tauri::command]
async fn run_query(sql: &str, params: &str) -> Result<QueryResult, ()> {
    let (client, connection) = tokio_postgres::connect(&params, NoTls).await.unwrap();
    tokio::spawn(async move {
        if let Err(e) = connection.await {
            eprintln!("postgres connection error: {}", e);
        }
    });

    let stmt = client.prepare(&sql).await.unwrap();
    let columns = stmt.columns().iter().map(|c| Column {
        name: c.name().to_owned(),
        type_id: c.type_().oid().to_owned(),
    }).collect::<Vec<_>>();
    let columns_len = columns.len();

    let rows = client.simple_query(&sql).await.unwrap();
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

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    tauri::Builder::default()
        .plugin(tauri_plugin_shell::init())
        .invoke_handler(tauri::generate_handler![run_query])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
