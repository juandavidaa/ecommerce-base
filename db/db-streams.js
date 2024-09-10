import mysql from 'mysql2';

// Configuración del pool de conexiones para streaming (sin promesas)
const db = mysql.createPool({
  host: 'localhost',
  user: 'root',
  password: '@1234Juan',
  database: 'pruebas',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

export default db;