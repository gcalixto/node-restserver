const express = require('express');

const app = express();


// aqui se importan las rutas para poder usuarlas 
app.use(require('./usuario'));
app.use(require('./login'));
app.use(require('./categoria'));
app.use(require('./producto'));
app.use(require('./upload'));
app.use(require('./imagenes'));


module.exports = app;