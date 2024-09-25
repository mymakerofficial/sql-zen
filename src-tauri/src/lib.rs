use sqlx::Row;
use tauri::ipc::Response;

#[tauri::command]
async fn run_query(sql: &str, params: &str) -> Result<Response, ()> {
    let pool = sqlx::postgres::PgPoolOptions::new()
        .connect(params).await.unwrap();

    let query = sqlx::query(sql);
    let rows = query.fetch_all(&pool).await.unwrap();

    let mut data: Vec<u8> = Vec::new();

    // get raw byte data for each cell
    for row in rows {
        for i in 0..row.len() {
            let raw_value = row.try_get_raw(i).unwrap();
            data.extend_from_slice(raw_value.as_bytes().unwrap());
        }
    }

    Ok(Response::new(data))
}

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    tauri::Builder::default()
        .plugin(tauri_plugin_shell::init())
        .invoke_handler(tauri::generate_handler![run_query])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
