use crate::client::Client;
use crate::error::Error;
use crate::types::{Column, QueryResult};
use async_trait::async_trait;
use mysql_async::{prelude::*, Pool};
use std::sync::Arc;

pub struct MySQLClient {
    pool: Arc<Pool>,
}

impl MySQLClient {
    pub async fn connect(url: &str) -> Result<Self, Error> {
        let pool = Pool::from_url(url)?;
        Ok(Self {
            pool: Arc::new(pool),
        })
    }
}

#[async_trait]
impl Client for MySQLClient {
    async fn query(&self, sql: &str) -> Result<QueryResult, Error> {
        let mut conn = self.pool.get_conn().await?;

        let stmt = conn.prep(sql).await?;
        let columns = stmt
            .columns()
            .iter()
            .map(|c| Column {
                name: c.name_str().to_string(),
                type_id: 0,
            })
            .collect::<Vec<_>>();
        let columns_len = columns.len();

        let rows = conn.query_iter(sql).await?;
        let rows = rows
            .map_and_drop(|mut r| {
                let mut cells = Vec::with_capacity(columns_len);

                for i in 0..columns_len {
                    let val = r.take(i).unwrap_or_default();
                    cells.push(val)
                }

                cells
            })
            .await?;

        Ok(QueryResult { columns, rows })
    }
}
