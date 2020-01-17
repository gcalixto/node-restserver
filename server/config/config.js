// =========
// puerto
// =========

process.env.PORT = process.env.PORT || 3000;


// =========
// Entorno
// =========
process.env.NODE_ENV = process.env.NODE_ENV || 'dev';

// =========
// Base de Datos
// =========
let urlDB;


    urlDB = 'mongodb://localhost:27017/cafe';




process.env.URLDB = urlDB;
