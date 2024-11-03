use fmt::Display;
use std::error::Error as StdError;
use std::fmt;
use serde::{Serialize, Serializer};

#[derive(Debug)]
pub enum Error {
    Postgres(tokio_postgres::Error),
    MySQL(mysql_async::Error),
    SQLite(tokio_rusqlite::Error),
    Io(std::io::Error),
}

impl Display for Error {
    fn fmt(&self, f: &mut fmt::Formatter<'_>) -> fmt::Result {
        match self {
            Error::Postgres(err) => err.fmt(f),
            Error::MySQL(err) => err.fmt(f),
            // tokio_rusqlite wraps rusqlite errors in `Rusqlite(...)`
            Error::SQLite(err) => write!(f, "{}", match err.source() {
                Some(source) => source.to_string(),
                None => err.to_string(),
            }),
            Error::Io(err) => err.fmt(f),
        }
    }
}

impl StdError for Error {
    fn source(&self) -> Option<&(dyn StdError + 'static)> {
        match self {
            Error::Postgres(err) => Some(err),
            Error::MySQL(err) => Some(err),
            Error::SQLite(err) => Some(err),
            Error::Io(err) => Some(err),
        }
    }
}

impl From<tokio_postgres::Error> for Error {
    fn from(err: tokio_postgres::Error) -> Self {
        Error::Postgres(err)
    }
}

impl From<mysql_async::Error> for Error {
    fn from(err: mysql_async::Error) -> Self {
        Error::MySQL(err)
    }
}

impl From<tokio_rusqlite::Error> for Error {
    fn from(err: tokio_rusqlite::Error) -> Self {
        Error::SQLite(err)
    }
}

impl From<std::io::Error> for Error {
    fn from(err: std::io::Error) -> Self {
        Error::Io(err)
    }
}

impl Serialize for Error {
    fn serialize<S>(&self, serializer: S) -> Result<S::Ok, S::Error>
    where
        S: Serializer,
    {
        serializer.serialize_str(self.to_string().as_ref())
    }
}
