use crate::client::Client;
use crate::error::Error;
use crate::types::{Column, QueryResult};
use async_trait::async_trait;
use std::sync::Arc;
use tokio_postgres::NoTls;

pub struct PostgresClient {
    client: Arc<tokio_postgres::Client>,
}

impl PostgresClient {
    pub async fn connect(url: &str) -> Result<Self, Error> {
        let (client, connection) = tokio_postgres::connect(&url, NoTls)
            .await
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
        let columns = stmt
            .columns()
            .iter()
            .map(|c| Column {
                name: c.name().to_owned(),
                type_id: c.type_().oid().to_owned(),
            })
            .collect::<Vec<_>>();
        let columns_len = columns.len();

        let rows = self.client.simple_query(&sql).await?;
        let rows = rows
            .into_iter()
            .filter_map(|r| {
                if let tokio_postgres::SimpleQueryMessage::Row(row) = r {
                    Some(row)
                } else {
                    None
                }
            })
            .map(|r| {
                let mut cells = Vec::with_capacity(columns_len);

                for i in 0..columns_len {
                    let val = r.get(i).unwrap_or_default();
                    cells.push(val.to_owned());
                }

                cells
            })
            .collect::<Vec<_>>();

        Ok(QueryResult { columns, rows })
    }
}
