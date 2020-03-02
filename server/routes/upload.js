const express = require('express');
const fileUpload = require('express-fileupload');
const app = express();


// para poder guardar en un usuario tengo que importar el esquema(models)
const Usuario = require('../models/usuario');
const Producto = require('../models/producto');

// estos paquetes fs y path existen por defecto en node
// para poder borrar un archivo se puede verificar en el file system con el paquete fs
const fs = require('fs');
//  con paquete path vamos a construir la ruta desde el lugar donde estemos en este caso routes
const path = require('path');

// middleware cuando se llama esta opcion todos los archivos que se cargana
// caen deentro del archivo req.files eso hace este middleware
// default options
app.use(fileUpload());

app.put('/upload/:tipo/:id', (req, res) => {

    let tipo = req.params.tipo;
    let id = req.params.id;


    // se verifica si trae algun archivo
    if (!req.files || Object.keys(req.files).length === 0) {
        return res.status(400).json({
            ok: false,
            err: {
                message: 'No se ha seleecionado ningun archivo'
            }
        });
    }

    // Validar tipos
    let tiposValidos = ['productos', 'usuarios'];

    if (tiposValidos.indexOf(tipo) < 0) {
        return res.status(400).json({
            ok: false,
            err: {
                message: 'Los tipos permitidos son ' + tiposValidos.join(', ')
            }
        })
    }

    // The name of the input field (i.e. "sampleFile") is used to retrieve the uploaded file
    //  si viene un archivo lo guardamos en samplefile
    let archivo = req.files.archivo;
    // para poder saber que extension es el archivo 
    // uso la funicon split la cual me separa por el parametro que yo
    // le de en este caso por punto .
    let nombreCortado = archivo.name.split('.');
    // extraigo el ultimo elemento del arreglo para saber que extension es
    let extension = nombreCortado[nombreCortado.length - 1];

    // arreglo de las extensiones validas
    let extensionesValidas = ['png', 'jpg', 'gif', 'jpeg'];

    // por medio del indexOf buscamos en el array par aver si existe la extension que trae el archivo a cargar
    if (extensionesValidas.indexOf(extension) < 0) {
        return res.status(400).json({
            ok: false,
            err: {
                message: 'Las extensiones permitidas son ' + extensionesValidas.join(', '),
                ext: extension
            }
        });
    }

    // cambiamos el nombre del archivo para que no se vaya a duplicar
    // para evitar el cache por si subimos 2 veces la mism imagen le ponemos los milisegundos
    let nombreArchivo = `${ id }-${ new Date().getMilliseconds() }.${ extension }`;

    // Use the mv() method to place the file somewhere on your server
    archivo.mv(`uploads/${ tipo }/${ nombreArchivo}`, (err) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                err
            });
        }
        if (tipo === 'usuarios') {
            imagenUsuario(id, res, nombreArchivo);
        } else {
            imagenProducto(id, res, nombreArchivo);
        }





        /*
        res.json({
            ok: true,
            message: 'Imagen Subida Correctamente'
        })
        */
    });


});


function imagenUsuario(id, res, nombreArchivo) {
    Usuario.findById(id, (err, usuarioDB) => {
        if (err) {
            // elimino el archivo porque auqnue de error el archivo fue cargado
            borraArchivo(nombreArchivo, 'usuarios');
            return res.status(500).json({
                ok: false,
                err
            });
        }

        if (!usuarioDB) {
            // borro la imagen si el usuari no existe para que no quede registro
            borraArchivo(nombreArchivo, 'usuarios');
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'El usuario no existe'
                }
            });
        }

        // con el paquete path se puede crear la ruta del archivo
        // let pathImagen = path.resolve(__dirname, `../../uploads/usuarios/${ usuarioDB.img}`);
        // if (fs.existsSync(pathImagen)) {
        //     fs.unlinkSync(pathImagen);
        // }

        // borro el archivo si existe
        borraArchivo(usuarioDB.img, 'usuarios');

        usuarioDB.img = nombreArchivo;

        usuarioDB.save((err, usuarioGuardado) => {
            res.json({
                ok: true,
                usuario: usuarioGuardado,
                img: nombreArchivo
            });
        });


    });


}


function imagenProducto(id, res, nombreArchivo) {
    Producto.findById(id, (err, productoDB) => {
        if (err) {
            // elimino el archivo porque aunque de error el archivo fue cargado
            borraArchivo(nombreArchivo, 'productos');
            return res.status(500).json({
                ok: false,
                err
            });
        }

        if (!productoDB) {
            // borro la imagen si el usuari no existe para que no quede registro
            borraArchivo(nombreArchivo, 'productos');
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'El producto no existe'
                }
            });
        }

        // borro el archivo si existe uno para no duplicarlo
        borraArchivo(productoDB.img, 'productos');

        productoDB.img = nombreArchivo;

        productoDB.save((err, productoGuardado) => {
            res.json({
                ok: true,
                usuario: productoGuardado,
                img: nombreArchivo
            });
        });


    });
}


function borraArchivo(nombreImagen, tipo) {
    let pathImagen = path.resolve(__dirname, `../../uploads/${ tipo }/${ nombreImagen }`);
    if (fs.existsSync(pathImagen)) {
        fs.unlinkSync(pathImagen);
    }
}

module.exports = app;