use postgres::{Client, NoTls, Error};
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
struct CustomResponse<'a> {
    rows: Vec<Vec<Option<&'a [u8]>>>
}

#[tauri::command]
fn query(sql: &str) -> Result<CustomResponse, Error> {
    let mut client = Client::connect("host=localhost user=postgres password=postgres", NoTls)?;

    let query_res = client.query(sql, &[])?;

    let rows: Vec<Vec<Option<&[u8]>>> = query_res.iter().map(|row| {
        row.columns().iter().enumerate().map(|(i, _column)| {
            let raw_value: RawValue = row.get(i);
            raw_value.raw
        }).collect()
    }).collect();

    client.close()?;

    // TODO: err: returns a value referencing data owned by the current function
    Ok(CustomResponse {
        rows
    })
}

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    tauri::Builder::default()
        .plugin(tauri_plugin_shell::init())
        .invoke_handler(tauri::generate_handler![greet])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
