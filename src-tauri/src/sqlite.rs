use crate::client::Client;
use crate::error::Error;
use crate::types::{Column, QueryResult};
use async_trait::async_trait;
use tokio_rusqlite::types::ValueRef;
use tokio_rusqlite::Connection;

pub struct SQLiteClient {
    connection: Connection,
}

impl SQLiteClient {
    pub async fn connect(path: &str) -> Result<Self, Error> {
        let connection = Connection::open(path).await?;
        Ok(Self { connection })
    }
}

#[async_trait]
impl Client for SQLiteClient {
    async fn query(&self, sql: &str) -> Result<QueryResult, Error> {
        let sql = sql.to_string();

        let result = self
            .connection
            .call(move |connection| {
                let mut stmt = connection.prepare(&sql)?;

                let columns = stmt
                    .columns()
                    .iter()
                    .map(|column| Column {
                        name: column.name().to_string(),
                        type_id: None,
                        type_name: column.decl_type().map(|s| s.to_string()),
                    })
                    .collect::<Vec<_>>();

                let rows = stmt.query_map([], |row| {
                    let mut cells = Vec::with_capacity(columns.len());
                    for i in 0..columns.len() {
                        // let value = row.get::<_, String>(i)?;
                        let value = row.get_ref(i)?;
                        let value = match value {
                            ValueRef::Null => "NULL".to_string(),
                            ValueRef::Integer(i) => i.to_string(),
                            ValueRef::Real(f) => f.to_string(),
                            ValueRef::Text(s) => String::from_utf8_lossy(s).to_string(),
                            ValueRef::Blob(_b) => "BLOB".to_string(),
                        };
                        cells.push(value);
                    }
                    Ok(cells)
                })?;

                let rows = rows.map(|row| row.unwrap_or_default()).collect::<Vec<_>>();

                Ok(QueryResult { columns, rows })
            })
            .await?;

        Ok(result)
    }
}
