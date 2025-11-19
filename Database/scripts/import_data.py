import pandas as pd
import mysql.connector
from mysql.connector import Error
import os

def create_db_connection():
    """Crear conexión a la base de datos MySQL"""
    try:
        connection = mysql.connector.connect(
            host='localhost',
            database='world_happiness_db',
            user='root',
            password=''  # XAMPP por defecto
        )
        return connection
    except Error as e:
        print(f"Error conectando a MySQL: {e}")
        return None

def find_data_folder():
    """
    Encuentra la carpeta de datos automáticamente
    """
    # Obtener la carpeta donde está este script
    script_dir = os.path.dirname(os.path.abspath(__file__))
    
    # Intentar diferentes rutas posibles
    possible_paths = [
        os.path.join(script_dir, "..", "raw_data"),           # ../raw_data
        os.path.join(script_dir, "raw_data"),                 # ./raw_data
        os.path.join(os.path.dirname(script_dir), "raw_data") # ../database/raw_data
    ]
    
    for path in possible_paths:
        abs_path = os.path.abspath(path)
        if os.path.exists(abs_path):
            print(f" Carpeta de datos encontrada: {abs_path}")
            return abs_path
    
    # Si no encuentra, mostrar ayuda
    print(" No se encontró la carpeta raw_data")
    print("Por favor asegúrate de que la estructura sea:")
    print("proyecto_felicidad/")
    print("├── database/")
    print("│   ├── scripts/    ← Aquí está este archivo")
    print("│   └── raw_data/   ← Aquí deben estar los CSV")
    print("└── ...")
    return None

def import_csv_files():
    """Importar todos los archivos CSV del dataset"""
    connection = create_db_connection()
    if connection is None:
        return
    
    cursor = connection.cursor()
    
    # RUTA FLEXIBLE - funciona en cualquier PC
    data_folder = find_data_folder()
    if data_folder is None:
        return
    
    # Verificar que hay archivos CSV
    csv_files = [f for f in os.listdir(data_folder) if f.endswith('.csv')]
    if not csv_files:
        print(" No se encontraron archivos CSV en la carpeta")
        print("Archivos necesarios: World Happiness 2015.csv ... World Happiness 2024.csv")
        return
    
    print(f" Archivos CSV encontrados: {len(csv_files)}")
    
    # Primero: Insertar regiones únicas
    print("\n Procesando regiones...")
    all_regions = set()
    
    # Explorar archivos para obtener todas las regiones
    for year in range(2015, 2025):
        filename = os.path.join(data_folder, f"World Happiness {year}.csv")
        if os.path.exists(filename):
            df = pd.read_csv(filename)
            regions = df['Regional_indicator'].unique()
            all_regions.update(regions)
            print(f" Regiones de {year}: {list(regions)}")
        else:
            print(f" Archivo no encontrado: World Happiness {year}.csv")
    
    if not all_regions:
        print(" No se encontraron regiones. Verifica los archivos CSV.")
        return
    
    # Insertar regiones
    region_map = {}
    for region in all_regions:
        cursor.execute("INSERT IGNORE INTO regions (region_name) VALUES (%s)", (region,))
        connection.commit()
        cursor.execute("SELECT id FROM regions WHERE region_name = %s", (region,))
        result = cursor.fetchone()
        if result:
            region_map[region] = result[0]
            print(f" Región: {region} (ID: {result[0]})")
    
    # Procesar cada archivo anual
    print("\n🚀 Iniciando importación de datos...")
    for year in range(2015, 2025):
        filename = os.path.join(data_folder, f"World Happiness {year}.csv")
        if not os.path.exists(filename):
            print(f" Saltando: World Happiness {year}.csv (no encontrado)")
            continue
            
        print(f"\n=== Procesando {year} ===")
        df = pd.read_csv(filename)
        print(f" Registros: {len(df)}")
        
        records_inserted = 0
        errors = 0
        
        for index, row in df.iterrows():
            try:
                # Insertar país si no existe
                country = row['Country']
                region = row['Regional_indicator']
                
                cursor.execute("SELECT id FROM countries WHERE country_name = %s", (country,))
                country_result = cursor.fetchone()
                
                if country_result is None:
                    cursor.execute(
                        "INSERT INTO countries (country_name, region_id) VALUES (%s, %s)",
                        (country, region_map[region])
                    )
                    country_id = cursor.lastrowid
                else:
                    country_id = country_result[0]
                
                # Insertar datos de felicidad
                cursor.execute("""
                    INSERT IGNORE INTO happiness_data 
                    (country_id, year, ranking, ladder_score, gdp_per_capita, 
                     social_support, healthy_life_expectancy, freedom_to_make_life_choices, 
                     generosity, perceptions_of_corruption)
                    VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s)
                """, (
                    country_id, year, row['Ranking'], row['Happiness_score'], 
                    row['GDP_per_capita'], row['Social_support'], 
                    row['Healthy_life_expectancy'], row['Freedom_to_make_life_choices'],
                    row['Generosity'], row['Perceptions_of_corruption']
                ))
                
                records_inserted += 1
                
            except Exception as e:
                errors += 1
                if errors == 1:  # Mostrar solo el primer error
                    print(f" Error ejemplo: {e}")
                continue
        
        connection.commit()
        print(f" {year}: {records_inserted} registros, {errors} errores")
    
    cursor.close()
    connection.close()
    print("\n IMPORTACIÓN COMPLETADA!")
    print(" Ejecuta las consultas de verificación en DBeaver")

if __name__ == "__main__":
    import_csv_files()