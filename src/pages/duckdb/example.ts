const origin = window.location.origin

export default `-- Welcome to sql-zen
-- You can run queries by clicking the play button next to the query,
--  or run all with the 'Run All' button at the top of the page

-- This query will return the top 10 stations with the most services
SELECT station_name, count(*) AS num_services
FROM '${origin}/train_services.parquet'
GROUP BY ALL
ORDER BY num_services DESC
LIMIT 10;`
