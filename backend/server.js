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
  ssl: {
    rejectUnauthorized: false
  }
});

// Middleware de logging
app.use((req, res, next) => {
  console.log(`📨 ${req.method} ${req.url}`, req.query);
  next();
});

// ---------------------
// Rutas de la API
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

// Datos del mapa
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

// Otros endpoints: /api/dispersion, /api/kpis, /api/apoyo-social, /api/libertad-regiones, /api/evolucion
// [Puedes copiar exactamente como los tienes ahora]

// ---------------------
// Manejo de errores
// ---------------------
app.use((error, req, res, next) => {
  console.error('💥 Error global:', error);
  res.status(500).json({ error: 'Error interno del servidor' });
});

// Ruta no encontrada
app.use('*', (req, res) => {
  res.status(404).json({ error: 'Ruta no encontrada' });
});

// Puerto dinámico para Render
const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`🚀 Servidor API ejecutándose en http://localhost:${PORT}`);
});
