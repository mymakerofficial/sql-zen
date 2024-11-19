use serde::Serialize;

#[derive(Clone, Serialize)]
#[serde(untagged)]
pub enum CellValue {
    Null,
    Text(String),
    Int64(i64),
    Float64(f64),
    Blob(Vec<u8>),
}

#[derive(Clone, Serialize)]
#[serde(rename_all = "camelCase")]
pub struct Column {
    pub name: String,
    #[serde(rename = "dataTypeID")]
    pub type_id: Option<u32>,
    #[serde(rename = "dataTypeName")]
    pub type_name: Option<String>,
}

#[derive(Clone, Serialize)]
#[serde(rename_all = "camelCase")]
pub struct QueryResult {
    pub columns: Vec<Column>,
    pub rows: Vec<Vec<CellValue>>,
}
