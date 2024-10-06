use crate::error::Error;
use crate::types::QueryResult;
use async_trait::async_trait;

#[async_trait]
pub trait Client: Send + Sync {
    async fn query(&self, sql: &str) -> Result<QueryResult, Error>;
}
