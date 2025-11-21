-- Comentario prueba
-- Crear la base de datos
CREATE DATABASE IF NOT EXISTS world_happiness_db;
USE world_happiness_db;

-- Tabla de regiones
CREATE TABLE regions (
    id INT PRIMARY KEY AUTO_INCREMENT,
    region_name VARCHAR(100) NOT NULL UNIQUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tabla de países
CREATE TABLE countries (
    id INT PRIMARY KEY AUTO_INCREMENT,
    country_name VARCHAR(100) NOT NULL UNIQUE,
    iso_code VARCHAR(3),
    region_id INT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (region_id) REFERENCES regions(id)
);

-- Tabla principal de datos de felicidad
CREATE TABLE happiness_data (
    id INT PRIMARY KEY AUTO_INCREMENT,
    country_id INT NOT NULL,
    year YEAR NOT NULL,
    ranking INT,
    ladder_score DECIMAL(5,3),
    gdp_per_capita DECIMAL(6,4),
    social_support DECIMAL(5,4),
    healthy_life_expectancy DECIMAL(5,3),
    freedom_to_make_life_choices DECIMAL(5,4),
    generosity DECIMAL(5,4),
    perceptions_of_corruption DECIMAL(5,4),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (country_id) REFERENCES countries(id),
    UNIQUE KEY unique_country_year (country_id, year)
);

-- Índices para optimización
CREATE INDEX idx_happiness_year ON happiness_data(year);
CREATE INDEX idx_happiness_score ON happiness_data(ladder_score);
CREATE INDEX idx_country_region ON countries(region_id);
CREATE INDEX idx_ranking_year ON happiness_data(year, ranking);