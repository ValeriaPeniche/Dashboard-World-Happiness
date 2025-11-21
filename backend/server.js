const express = require('express');
const cors = require('cors');
const { Pool } = require('pg');

const app = express();

// Configuración de CORS
const corsOptions = {
  origin: [
    'http://localhost:5173', // desarrollo local
    'https://proyecto1-felicidad.vercel.app' // frontend en Vercel
  ],
  optionsSuccessStatus: 200
};
app.use(cors(corsOptions));

// Para recibir JSON
app.use(express.json());

// Conexión a PostgreSQL usando Render DATABASE_URL
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false }
});

// Middleware de logging
app.use((req, res, next) => {
  console.log(`📨 ${req.method} ${req.url}`, req.query);
  next();
});

// ---------------------
// RUTAS DE LA API
// ---------------------

// Ruta de prueba
app.get('/api/test', async (req, res) => {
  try {
    const result = await pool.query('SELECT 1 + 1 AS result');
    res.json({ message: 'Conexión exitosa a PostgreSQL', result: result.rows[0].result });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Obtener años
app.get('/api/anios', async (req, res) => {
  try {
    const result = await pool.query('SELECT DISTINCT year FROM happiness_data ORDER BY year DESC');
    res.json(result.rows.map(r => r.year.toString()));
  } catch (error) {
    console.error('❌ Error en años:', error);
    res.status(500).json({ error: 'Error en base de datos' });
  }
});

// Obtener regiones
app.get('/api/regiones', async (req, res) => {
  try {
    const result = await pool.query('SELECT DISTINCT region_name FROM regions ORDER BY region_name');
    res.json(result.rows.map(r => r.region_name));
  } catch (error) {
    console.error('❌ Error en regiones:', error);
    res.status(500).json({ error: 'Error en base de datos' });
  }
});

// Datos para el mapa
app.get('/api/mapa', async (req, res) => {
  const { anio = '2024', region = 'todas' } = req.query;

  let query = `
    SELECT c.country_name as pais,
           h.ladder_score as score,
           r.region_name as region,
           h.year,
           h.social_support,
           h.gdp_per_capita,
           h.healthy_life_expectancy,
           h.freedom_to_make_life_choices
    FROM happiness_data h
    JOIN countries c ON h.country_id = c.id
    JOIN regions r ON c.region_id = r.id
    WHERE h.year = $1
  `;
  const params = [anio];

  if (region !== 'todas') {
    query += ' AND r.region_name = $2';
    params.push(region);
  }

  query += ' ORDER BY h.ladder_score DESC';

  try {
    const result = await pool.query(query, params);
    res.json(result.rows);
  } catch (error) {
    console.error('❌ Error en mapa:', error);
    res.status(500).json({ error: error.message });
  }
});

// Datos para gráfico de dispersión
app.get('/api/dispersion', async (req, res) => {
  const { anio = '2024', region = 'todas' } = req.query;

  let query = `
    SELECT c.country_name as pais,
           h.gdp_per_capita as pib,
           h.ladder_score as felicidad,
           r.region_name as region,
           h.year
    FROM happiness_data h
    JOIN countries c ON h.country_id = c.id
    JOIN regions r ON c.region_id = r.id
    WHERE h.year = $1
  `;
  const params = [anio];

  if (region !== 'todas') {
    query += ' AND r.region_name = $2';
    params.push(region);
  }

  try {
    const result = await pool.query(query, params);
    res.json(result.rows);
  } catch (error) {
    console.error('❌ Error en dispersión:', error);
    res.status(500).json({ error: error.message });
  }
});

// KPIs
app.get('/api/kpis', async (req, res) => {
  const { anio = '2024', region = 'todas' } = req.query;

  let query = `
    SELECT 
      ROUND(AVG(h.ladder_score)::numeric, 3) as felicidad_promedio,
      ROUND(AVG(h.gdp_per_capita)::numeric, 3) as pib_promedio,
      ROUND(AVG(h.social_support)::numeric, 3) as apoyo_social_promedio,
      ROUND(AVG(h.healthy_life_expectancy)::numeric, 1) as esperanza_vida_promedio,
      ROUND(AVG(h.freedom_to_make_life_choices)::numeric, 3) as libertad_promedio,
      COUNT(*) as total_paises
    FROM happiness_data h
    JOIN countries c ON h.country_id = c.id
    JOIN regions r ON c.region_id = r.id
    WHERE h.year = $1
  `;
  const params = [anio];

  if (region !== 'todas') {
    query += ' AND r.region_name = $2';
    params.push(region);
  }

  try {
    const result = await pool.query(query, params);
    res.json(result.rows[0]);
  } catch (error) {
    console.error('❌ Error en KPIs:', error);
    res.status(500).json({ error: error.message });
  }
});

// Apoyo social
app.get('/api/apoyo-social', async (req, res) => {
  const { anio = '2024', region = 'todas' } = req.query;

  let query = `
    SELECT c.country_name as pais,
           h.social_support as social_support,
           r.region_name as region,
           h.year,
           h.ladder_score
    FROM happiness_data h
    JOIN countries c ON h.country_id = c.id
    JOIN regions r ON c.region_id = r.id
    WHERE h.year = $1 AND h.social_support IS NOT NULL
  `;
  const params = [anio];

  if (region !== 'todas') {
    query += ' AND r.region_name = $2';
    params.push(region);
  }

  query += ' ORDER BY h.social_support DESC';

  try {
    const result = await pool.query(query, params);
    res.json(result.rows);
  } catch (error) {
    console.error('❌ Error en apoyo social:', error);
    res.status(500).json({ error: error.message });
  }
});

// Libertad por regiones
app.get('/api/libertad-regiones', async (req, res) => {
  const { anio = '2024' } = req.query;

  const query = `
    SELECT r.region_name as region,
           ROUND(AVG(h.freedom_to_make_life_choices)::numeric, 3) as libertad_promedio,
           ROUND(AVG(h.ladder_score)::numeric, 3) as felicidad_promedio,
           COUNT(*) as cantidad_paises
    FROM happiness_data h
    JOIN countries c ON h.country_id = c.id
    JOIN regions r ON c.region_id = r.id
    WHERE h.year = $1 AND h.freedom_to_make_life_choices IS NOT NULL
    GROUP BY r.region_name
    HAVING COUNT(*) > 0
    ORDER BY felicidad_promedio DESC
  `;

  try {
    const result = await pool.query(query, [anio]);
    res.json(result.rows);
  } catch (error) {
    console.error('❌ Error en libertad regiones:', error);
    res.status(500).json({ error: error.message });
  }
});

// Evolución temporal
app.get('/api/evolucion', async (req, res) => {
  const { region = 'todas' } = req.query;

  let query = `
    SELECT h.year,
           ROUND(AVG(h.healthy_life_expectancy)::numeric, 1) as esperanza_vida,
           ROUND(AVG(h.ladder_score)::numeric, 3) as felicidad,
           COUNT(*) as paises
    FROM happiness_data h
    JOIN countries c ON h.country_id = c.id
    JOIN regions r ON c.region_id = r.id
    WHERE h.healthy_life_expectancy IS NOT NULL
  `;
  const params = [];

  if (region !== 'todas') {
    query += ' AND r.region_name = $1';
    params.push(region);
  }

  query += ' GROUP BY h.year ORDER BY h.year ASC';

  try {
    const result = await pool.query(query, params);
    res.json(result.rows);
  } catch (error) {
    console.error('❌ Error en evolución:', error);
    res.status(500).json({ error: error.message });
  }
});

// ---------------------
// Manejo de errores global
// ---------------------
app.use((error, req, res, next) => {
  console.error('💥 Error global:', error);
  res.status(500).json({ error: 'Error interno del servidor' });
});

// Ruta no encontrada (AL FINAL)
app.use('*', (req, res) => {
  res.status(404).json({ error: 'Ruta no encontrada' });
});

// Puerto dinámico para Render
const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`🚀 Servidor API ejecutándose en http://localhost:${PORT}`);
});
