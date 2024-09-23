use postgres::{Client, NoTls};
use postgres::types::{to_sql_checked, FromSql, IsNull, ToSql, Type};
use postgres::types::private::BytesMut;

#[derive(Debug)]
struct RawValue<'a> {
    type_: Type,
    raw: Option<&'a [u8]>,
}

impl<'a> FromSql<'a> for RawValue<'a> {
    fn from_sql(
        type_: &Type,
        raw: &'a [u8]
    ) -> Result<Self, Box<dyn std::error::Error + 'static + Send + Sync>> {
        Ok(RawValue {
            type_: type_.clone(),
            raw: Some(raw)
        })
    }

    fn accepts(_: &Type) -> bool {
        true
    }

    fn from_sql_null(
        type_: &Type
    ) -> Result<Self, Box<dyn std::error::Error + 'static + Send + Sync>> {
        Ok(RawValue {
            type_: type_.clone(),
            raw: None,
        })
    }
}

impl ToSql for RawValue<'_> {
    fn to_sql(
        &self,
        type_: &Type,
        out: &mut BytesMut
    ) -> Result<IsNull, Box<dyn std::error::Error + 'static + Send + Sync>> {
        if self.type_ != *type_ {
            return Err(format!("expected type {} but saw {}", self.type_, type_).into());
        }

        match self.raw {
            Some(raw) => {
                out.extend_from_slice(raw);
                Ok(IsNull::No)
            }
            None => Ok(IsNull::Yes)
        }
    }

    fn accepts(_: &Type) -> bool {
        true
    }

    to_sql_checked!();
}

#[derive(serde::Serialize)]
struct CustomResponse {
    rows: Vec<Vec<Option<Vec<u8>>>>
}

#[tauri::command]
fn run_query(sql: &str) -> CustomResponse {
    let mut client = Client::connect("host=localhost user=postgres password=postgres", NoTls).unwrap();

    let query_res = client.query(sql, &[]).unwrap();

    let rows: Vec<Vec<Option<Vec<u8>>>> = query_res.iter().map(|row| {
        row.columns().iter().enumerate().map(|(i, _column)| {
            let raw_value: RawValue = row.get(i);
            raw_value.raw.map(|v| v.to_vec())
        }).collect()
    }).collect();

    client.close().unwrap();

    CustomResponse {
        rows
    }
}

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    tauri::Builder::default()
        .plugin(tauri_plugin_shell::init())
        .invoke_handler(tauri::generate_handler![run_query])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
