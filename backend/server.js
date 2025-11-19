const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

// Conexión a MySQL (XAMPP) con manejo de errores mejorado
const connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '', // XAMPP por defecto vacío
  database: 'world_happiness_db',
  charset: 'utf8mb4'
});

// Verificar conexión
connection.connect((err) => {
  if (err) {
    console.error('❌ Error conectando a MySQL:', err.message);
    console.log('💡 Asegúrate de que:');
    console.log('   1. XAMPP esté ejecutándose');
    console.log('   2. MySQL esté activo en XAMPP');
    console.log('   3. La base de datos "world_happiness_db" exista');
    return;
  }
  console.log('✅ Conectado a MySQL - world_happiness_db');
});

// Middleware de logging
app.use((req, res, next) => {
  console.log(`📨 ${req.method} ${req.url}`, req.query);
  next();
});

// Ruta de prueba
app.get('/api/test', (req, res) => {
  connection.query('SELECT 1 + 1 AS result', (error, results) => {
    if (error) {
      return res.status(500).json({ error: error.message });
    }
    res.json({ message: 'Conexión exitosa a MySQL', result: results[0].result });
  });
});

// Obtener años disponibles
app.get('/api/anios', (req, res) => {
  const query = 'SELECT DISTINCT year FROM happiness_data ORDER BY year DESC';
  
  connection.query(query, (error, results) => {
    if (error) {
      console.error('Error en años:', error);
      return res.status(500).json({ error: 'Error en base de datos' });
    }
    res.json(results.map(row => row.year.toString()));
  });
});

// Obtener regiones disponibles
app.get('/api/regiones', (req, res) => {
  const query = 'SELECT DISTINCT region_name FROM regions ORDER BY region_name';
  
  connection.query(query, (error, results) => {
    if (error) {
      console.error('Error en regiones:', error);
      return res.status(500).json({ error: 'Error en base de datos' });
    }
    res.json(results.map(row => row.region_name));
  });
});

// Datos para el mapa CON FILTROS
app.get('/api/mapa', (req, res) => {
  const { anio = '2024', region = 'todas' } = req.query;
  
  console.log('📊 Solicitando datos mapa:', { anio, region });
  
  let query = `
    SELECT 
      c.country_name as pais,
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
    WHERE h.year = ?
  `;
  
  const params = [anio];
  
  if (region !== 'todas') {
    query += ' AND r.region_name = ?';
    params.push(region);
  }
  
  query += ' ORDER BY h.ladder_score DESC';

  connection.query(query, params, (error, results) => {
    if (error) {
      console.error('❌ Error en mapa:', error);
      return res.status(500).json({ error: 'Error en base de datos: ' + error.message });
    }
    console.log(`✅ Mapa: ${results.length} países encontrados`);
    res.json(results);
  });
});

// Datos para gráfico de dispersión
app.get('/api/dispersion', (req, res) => {
  const { anio = '2024', region = 'todas' } = req.query;
  
  let query = `
    SELECT 
      c.country_name as pais,
      h.gdp_per_capita as pib,
      h.ladder_score as felicidad,
      r.region_name as region,
      h.year
    FROM happiness_data h
    JOIN countries c ON h.country_id = c.id
    JOIN regions r ON c.region_id = r.id
    WHERE h.year = ?
  `;
  
  const params = [anio];
  
  if (region !== 'todas') {
    query += ' AND r.region_name = ?';
    params.push(region);
  }

  connection.query(query, params, (error, results) => {
    if (error) {
      console.error('❌ Error en dispersión:', error);
      return res.status(500).json({ error: 'Error en base de datos' });
    }
    res.json(results);
  });
});

// KPIs actualizados CON FILTROS
app.get('/api/kpis', (req, res) => {
  const { anio = '2024', region = 'todas' } = req.query;
  
  console.log('📈 Solicitando KPIs:', { anio, region });
  
  let query = `
    SELECT 
      ROUND(AVG(h.ladder_score), 3) as felicidad_promedio,
      ROUND(AVG(h.gdp_per_capita), 3) as pib_promedio,
      ROUND(AVG(h.social_support), 3) as apoyo_social_promedio,
      ROUND(AVG(h.healthy_life_expectancy), 1) as esperanza_vida_promedio,
      ROUND(AVG(h.freedom_to_make_life_choices), 3) as libertad_promedio,
      COUNT(*) as total_paises
    FROM happiness_data h
    JOIN countries c ON h.country_id = c.id
    JOIN regions r ON c.region_id = r.id
    WHERE h.year = ?
  `;
  
  const params = [anio];
  
  if (region !== 'todas') {
    query += ' AND r.region_name = ?';
    params.push(region);
  }

  connection.query(query, params, (error, results) => {
    if (error) {
      console.error('❌ Error en KPIs:', error);
      return res.status(500).json({ error: 'Error en base de datos: ' + error.message });
    }
    
    const kpis = results[0] || {};
    console.log('✅ KPIs calculados:', kpis);
    res.json(kpis);
  });
});

// Ruta para datos de apoyo social (barras horizontales)
app.get('/api/apoyo-social', (req, res) => {
  const { anio = '2024', region = 'todas' } = req.query;
  
  console.log('📊 Solicitando apoyo social:', { anio, region });
  
  let query = `
    SELECT 
      c.country_name as pais,
      h.social_support as social_support,
      r.region_name as region,
      h.year,
      h.ladder_score
    FROM happiness_data h
    JOIN countries c ON h.country_id = c.id
    JOIN regions r ON c.region_id = r.id
    WHERE h.year = ? AND h.social_support IS NOT NULL
  `;
  
  const params = [anio];
  
  if (region !== 'todas') {
    query += ' AND r.region_name = ?';
    params.push(region);
  }
  
  query += ' ORDER BY h.social_support DESC';

  connection.query(query, params, (error, results) => {
    if (error) {
      console.error('❌ Error en apoyo social:', error);
      return res.status(500).json({ error: 'Error en base de datos: ' + error.message });
    }
    
    console.log(`✅ Apoyo social: ${results.length} países encontrados`);
    res.json(results);
  });
});

// Ruta para datos de libertad (barras agrupadas) 
app.get('/api/libertad-regiones', (req, res) => {
  const { anio = '2024' } = req.query;
  
  console.log('🆓 Solicitando libertad por regiones:', { anio });
  
  const query = `
    SELECT 
      r.region_name as region,
      ROUND(AVG(h.freedom_to_make_life_choices), 3) as libertad_promedio,
      ROUND(AVG(h.ladder_score), 3) as felicidad_promedio,
      COUNT(*) as cantidad_paises
    FROM happiness_data h
    JOIN countries c ON h.country_id = c.id
    JOIN regions r ON c.region_id = r.id
    WHERE h.year = ? AND h.freedom_to_make_life_choices IS NOT NULL
    GROUP BY r.region_name
    HAVING COUNT(*) > 0
    ORDER BY felicidad_promedio DESC
  `;

  connection.query(query, [anio], (error, results) => {
    if (error) {
      console.error('❌ Error en libertad regiones:', error);
      return res.status(500).json({ error: 'Error en base de datos: ' + error.message });
    }
    
    console.log(`✅ Libertad regiones: ${results.length} regiones encontradas`);
    res.json(results);
  });
});

// Ruta para datos de evolución temporal - NUEVA
app.get('/api/evolucion', (req, res) => {
  const { region = 'todas' } = req.query;
  
  console.log('📈 Solicitando evolución:', { region });
  
  let query = `
    SELECT 
      h.year,
      ROUND(AVG(h.healthy_life_expectancy), 1) as esperanza_vida,
      ROUND(AVG(h.ladder_score), 3) as felicidad,
      COUNT(*) as paises
    FROM happiness_data h
    JOIN countries c ON h.country_id = c.id
    JOIN regions r ON c.region_id = r.id
    WHERE h.healthy_life_expectancy IS NOT NULL
  `;
  
  const params = [];
  
  if (region !== 'todas') {
    query += ' AND r.region_name = ?';
    params.push(region);
  }
  
  query += ' GROUP BY h.year ORDER BY h.year ASC';

  connection.query(query, params, (error, results) => {
    if (error) {
      console.error('❌ Error en evolución:', error);
      return res.status(500).json({ error: 'Error en base de datos: ' + error.message });
    }
    
    console.log(`✅ Evolución: ${results.length} años de datos`);
    res.json(results);
  });
});

// Manejo de errores global
app.use((error, req, res, next) => {
  console.error('💥 Error global:', error);
  res.status(500).json({ error: 'Error interno del servidor' });
});

// Ruta no encontrada
app.use('*', (req, res) => {
  res.status(404).json({ error: 'Ruta no encontrada' });
});

const PORT = 3001;
app.listen(PORT, () => {
  console.log(`🚀 Servidor API ejecutándose en http://localhost:${PORT}`);
  console.log('📋 Endpoints disponibles:');
  console.log('   GET /api/test              - Probar conexión MySQL');
  console.log('   GET /api/anios             - Lista de años disponibles');
  console.log('   GET /api/regiones          - Lista de regiones disponibles');
  console.log('   GET /api/mapa              - Datos para mapa (todos los campos)');
  console.log('   GET /api/dispersion        - Datos para gráfico dispersión');
  console.log('   GET /api/kpis              - Datos para KPIs');
  console.log('   GET /api/apoyo-social      - Datos para barras horizontales');
  console.log('   GET /api/libertad-regiones - Datos para barras agrupadas');
  console.log('   GET /api/evolucion         - Datos para gráfico de líneas');
});