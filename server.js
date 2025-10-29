const express = require('express');
const { Client } = require('pg');
const app = express();
const port = 3000;

// Configuración de la base de datos
const dbConfig = {
    host: process.env.DB_HOST || 'localhost',
    port: process.env.DB_PORT || 5432,
    user: process.env.DB_USER || 'admin',
    password: process.env.DB_PASSWORD || '12345',
    database: process.env.DB_NAME || 'parcial_db'
};

// Middleware
app.use(express.json());

// Datos del estudiante
const studentInfo = {
    nombre: "JOSUE DANIEL MANCIA FLORES",
    expediente: "MF22-I04-001",
    codigo_estudiantil: "26185",
    materia: "Implantación de Sistemas",
    parcial: "Segundo Parcial"
};

// Conexión a la base de datos
async function connectDB() {
    try {
        const client = new Client(dbConfig);
        await client.connect();
        console.log('✅ Conectado a PostgreSQL');
        return client;
    } catch (error) {
        console.error('❌ Error conectando a PostgreSQL:', error.message);
        return null;
    }
}

// Endpoint principal
app.get('/', (req, res) => {
    res.json({
        message: "API del Segundo Parcial - Docker",
        student: studentInfo,
        database: {
            connected: true,
            host: dbConfig.host,
            database: dbConfig.database
        },
        timestamp: new Date().toISOString()
    });
});

// Endpoint de health check
app.get('/health', (req, res) => {
    res.json({
        status: 'OK',
        service: 'parcial-api',
        database: 'PostgreSQL',
        timestamp: new Date().toISOString()
    });
});

// Endpoint para obtener estudiantes
app.get('/estudiantes', async (req, res) => {
    try {
        const client = await connectDB();
        if (!client) {
            return res.status(500).json({ error: 'Database connection failed' });
        }

        const result = await client.query('SELECT * FROM estudiantes');
        await client.end();

        res.json({
            count: result.rowCount,
            estudiantes: result.rows
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.listen(port, () => {
    console.log(`🚀 Servidor corriendo en http://localhost:${port}`);
});
