const express = require('express');

const fs = require('fs');


const path = require('path');


const { verificaTokenImg } = require('../middlewares/autenticacion');


let app = express();




app.get('/imagen/:tipo/:img', verificaTokenImg, (req, res) => {

    let tipo = req.params.tipo;
    let img = req.params.img;

    // construimos el path absoluto
    let pathImagen = path.resolve(__dirname, `../../uploads/${ tipo }/${ img }`);


    if (fs.existsSync(pathImagen)) {
        // res.json({
        //     ok: true,
        //     path: pathImagen
        // });
        res.sendFile(pathImagen);
    } else {
        // creo el path aboluto para poder mandar la imagen en la respuesta
        let noImagePath = path.resolve(__dirname, '../assets/no-image.jpg');
        // res.json({
        //     ok: false,
        //     path: noImagePath
        // });
        res.sendFile(noImagePath);
    }



})







module.exports = app;