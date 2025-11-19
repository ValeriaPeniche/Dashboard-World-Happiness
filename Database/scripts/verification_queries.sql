-- Verificar datos cargados
USE world_happiness_db;

-- Conteo por año
SELECT year, COUNT(*) as total_paises FROM happiness_data GROUP BY year ORDER BY year;

-- Top 10 países 2024
SELECT c.country_name, h.ranking, h.ladder_score 
FROM happiness_data h 
JOIN countries c ON h.country_id = c.id 
WHERE h.year = 2024 
ORDER BY h.ranking 
LIMIT 10;

