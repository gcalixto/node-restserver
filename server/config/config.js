// =========
// puerto
// =========

process.env.PORT = process.env.PORT || 3000;


// =========
// Entorno
// =========
process.env.NODE_ENV = process.env.NODE_ENV || 'dev';

// =========
// Vencimiento del Token
// =========
// 60 SEGUNDOS
// 60 MINUTOS
// 24 HORAS
// 30 DIAS
process.env.CADUCIDAD_TOKEN = 60 * 60 * 24 * 30;

// =========
// Vencimiento del Token
// =========
process.env.SEED = process.env.SEED || 'este-es-el-seed-desarrollo';




// =========
// Base de Datos
// =========
let urlDB;

if (process.env.NODE_ENV === 'dev') {
    urlDB = 'mongodb://localhost:27017/cafe';
} else {
    urlDB = process.env.MONGO_URI;
}

process.env.URLDB = urlDB;


// =========
// Google Client ID
// =========

process.env.CLIENT_ID = process.env.CLIENT_ID || '159324021844-mp8vupkt4fnr3afonq7jfgrj46d3l6pm.apps.googleusercontent.com';