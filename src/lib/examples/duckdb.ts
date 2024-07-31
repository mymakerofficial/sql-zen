const origin = window.location.origin

export default `-- Try running the following queries from the DuckDB documentation:

-- Load Parquet file, find the top-10 stations with the most services
SELECT station_name, count(*) AS num_services
FROM '${origin}/train_services.parquet'
GROUP BY ALL
ORDER BY num_services DESC
LIMIT 10;

-- Install and load the spatial extension
INSTALL spatial;
LOAD spatial;

-- Load CSV file, auto-detecting column name and types
CREATE TABLE stations AS
FROM '${origin}/stations.csv';

-- What are the top-3 closest Intercity stations
--  using aerial distance?
SELECT
    s1.name_long AS station1,
    s2.name_long AS station2,
    ST_Distance(
        ST_Point(s1.geo_lng, s1.geo_lat),
        ST_Point(s2.geo_lng, s2.geo_lat)
    ) * 111139 AS distance
FROM stations s1, stations s2
WHERE s1.type LIKE '%Intercity%'
  AND s2.type LIKE '%Intercity%'
  AND s1.id < s2.id
ORDER BY distance ASC
LIMIT 3;`
