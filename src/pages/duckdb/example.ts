const origin = window.location.origin;

export default `-- Welcome to sql-zen
-- You can run queries by clicking the "Run All" button

SELECT station_name, count(*) AS num_services
FROM '${origin}/train_services.parquet'
GROUP BY ALL
ORDER BY num_services DESC
LIMIT 10;`