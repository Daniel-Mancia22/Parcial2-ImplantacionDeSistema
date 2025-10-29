# 📝 Parcial Docker Integrado

## Descripción del Proyecto

Este proyecto consiste en la implementación de una aplicación contenerizada utilizando Docker y Docker Compose. La aplicación incluye un servicio API desarrollado en Node.js con Express y una base de datos PostgreSQL, demostrando conceptos de containerización, persistencia de datos y orquestación de servicios.

## 🛠️ Tecnologías Utilizadas
**Backend & Base de Datos**
- 🟢 Node.js 18 - Runtime de JavaScript
- ⚡ Express.js - Framework web para Node.js
- 🐘 PostgreSQL 15 - Base de datos relacional
- 🐳 Docker - Plataforma de contenerización
- 🔗 Docker Compose - Orquestación de contenedores

## 🚀 Ejercicio 1 - Servicio Base con Dockerfile
### ▶️ Comandos ejecutados:

    docker build -t parcial-api .
    docker run -d -p 3000:3000 --name parcial-container parcial-api

### 🔍 **1. Verificar que el contenedor se levanta sin errores**

- Verificar que el contenedor está corriendo
    
      docker ps

- Ver los logs del contenedor para confirmar que no hay errores
  
      docker logs parcial-container

### ✅ 2. Verificar endpoint / responde datos personales

- Usar curl para probar el endpoint principal

      curl http://localhost:3000/

- O usar el navegador y visitar

      http://localhost:3000/

### ✅ **3. Verificar endpoint /health devuelve { status: 'OK' }**

- Probar el endpoint de health

      curl http://localhost:3000/health

### 🔐 **4. Verificar que Dockerfile no usa usuario root**

- Verificar el usuario dentro del contenedor

      docker exec parcial-container whoami

- O verificar el ID del usuario
  
      docker exec parcial-container id

### 📦 **5. Verificar que la imagen tiene tamaño razonable (<200MB)**

- Ver el tamaño de la imagen

      docker images parcial-api


## 🗃️ Ejercicio 2 - Persistencia con PostgreSQL
### ▶️ Comandos ejecutados:

- Crear volumen para persistencia

      docker volume create db_data

- Ejecutar contenedor PostgreSQL

      docker run -d --name postgres-db -e POSTGRES_USER=admin -e POSTGRES_PASSWORD=12345 -e POSTGRES_DB=parcial_db -v db_data:/var/lib/postgresql/data -p 5432:5432 postgres:15-alpine

- Conectar a PostgreSQL y crear tabla

      docker exec -it postgres-db psql -U admin -d parcial_db

- Dentro de psql ejecutamos:

        CREATE TABLE estudiantes (
          id SERIAL PRIMARY KEY,
          nombre VARCHAR(100) NOT NULL,
          expediente VARCHAR(50) UNIQUE NOT NULL,
          codigo_estudiantil VARCHAR(50) UNIQUE NOT NULL,
          carrera VARCHAR(100),
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        );

- Dentro de sql ejecutamos lugo la insercion de datos:

        INSERT INTO estudiantes (nombre, expediente, codigo_estudiantil, carrera) VALUES
          ('JOSUE DANIEL MANCIA FLORES', 'MF22-I04-001', '26185', 'Ingeniería en Sistemas'),
          ('Estudiante Prueba 1', 'EXP001', 'COD001', 'Ingeniería'),
          ('Estudiante Prueba 2', 'EXP002', 'COD002', 'Sistemas'),
          ('MARIA GABRIELA LOPEZ RAMIREZ', 'MF22-I04-002', '26186', 'Ingeniería en Sistemas'),
          ('CARLOS ALBERTO MARTINEZ SUAREZ', 'MF22-I04-003', '26187', 'Ingeniería Industrial'),
          ('SOFIA ELENA HERNANDEZ GOMEZ', 'MF22-I04-004', '26188', 'Ingeniería Civil'),
          ('LUIS FERNANDO RODRIGUEZ DIAZ', 'MF22-I04-005', '26189', 'Ingeniería Mecánica');
          
- Verificar persistencia después de reinicio
                  
      docker stop postgres-db
      docker start postgres-db
      docker exec -it postgres-db psql -U admin -d parcial_db -c "SELECT * FROM estudiantes;"

- Listar volúmenes
    
      docker volume ls

## 🐳 Ejercicio 3 - Docker Compose
### ▶️ Comandos ejecutados:

- 🧩 Crear archivos de configuración
     
      touch docker-compose.yml
      touch .env

- 🔄 Resolver problema de dependencias

      rm -rf package-lock.json node_modules
      npm install

▶️ Levantar servicios con Docker Compose
    
      docker compose up -d --build

- 🔍 Verificar estado de servicios
    
      docker compose ps

- Ver logs de los servicios
  
      docker compose logs api
      docker compose logs db

- 🧱 Crear tabla y datos desde Docker Compose
    
      docker compose exec db psql -U admin -d parcial_db -c "
      CREATE TABLE IF NOT EXISTS estudiantes (
        id SERIAL PRIMARY KEY,
        nombre VARCHAR(100) NOT NULL,
        expediente VARCHAR(50) UNIQUE NOT NULL,
        codigo_estudiantil VARCHAR(50) UNIQUE NOT NULL,
        carrera VARCHAR(100),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );"

    Dentro de sql ejecutamos lugo la insercion de datos:

      docker compose exec db psql -U admin -d parcial_db -c "INSERT INTO estudiantes (nombre, expediente, codigo_estudiantil, carrera) VALUES
        ('JOSUE DANIEL MANCIA FLORES', 'MF22-I04-010', '26200', 'Ingeniería en Sistemas'),
        ('Estudiante Prueba 3', 'EXP003', 'COD003', 'Ingeniería'),
        ('Estudiante Prueba 4', 'EXP004', 'COD004', 'Sistemas'),
        ('MARIA GABRIELA LOPEZ RAMIREZ', 'MF22-I04-011', '26201', 'Ingeniería en Sistemas'),
        ('CARLOS ALBERTO MARTINEZ SUAREZ', 'MF22-I04-012', '26202', 'Ingeniería Industrial'),
        ('SOFIA ELENA HERNANDEZ GOMEZ', 'MF22-I04-013', '26203', 'Ingeniería Civil'),
        ('LUIS FERNANDO RODRIGUEZ DIAZ', 'MF22-I04-014', '26204', 'Ingeniería Mecánica');"

    Verificar datos

      docker compose exec db psql -U admin -d parcial_db -c "SELECT * FROM estudiantes;"

- ✅ Verificar healthcheck
    
      docker compose exec db pg_isready -U admin -d parcial_db

- 🌐 Probar endpoint de la API

    curl http://localhost:3000/estudiantes

- 🔐 Verificar usuario no-root
    
      docker compose exec api whoami
      docker compose exec api id

- ⚙️ Gestión de servicios

      docker compose restart
      docker compose down

## 👨🏽‍💻 Desarrollador
- [Daniel Mancia](https://github.com/DANIEL-MANCIA) - DevMadCode

## 📄 Notas
Este proyecto es desarrollado con fines académicos para mi Segundo Parcial de la materia de Implantación de sistemas.
