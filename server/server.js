require('./config/config');

const express = require('express');
// Using Node.js `require()`
const mongoose = require('mongoose');

const app = express();
const bodyParser = require('body-parser');

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));

// parse application/json
app.use(bodyParser.json());


// configuracion global de rutas
app.use(require('./routes/index'));




/*-
mongoose.connect('mongodb://localhost:27017/cafe', (err, res) => {
    if (err) throw err;
    console.log('Base de datos Online');
});*/

const conMongodb = async() => {
    // await mongoose.connect('mongodb://localhost:27017/cafe', {
    //await mongoose.connect('mongodb+srv://gcalixto:Pa$$w0rd@cluster0-yi6s4.mongodb.net/cafe', {
    await mongoose.connect(process.env.URLDB, {
        useNewUrlParser: true,
        useUnifiedTopology: true
    });
}

conMongodb()
    .then(console.log('Base de datos Online'))
    .catch(console.log);

app.listen(process.env.PORT, () => {
    console.log('Escuchando el puerto: ', process.env.PORT);
})