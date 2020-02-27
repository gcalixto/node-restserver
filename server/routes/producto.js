// inicializo el paquete express
const express = require('express');

// Inicializo la funcion que verificara el token
const { verificaToken } = require('../middlewares/autenticacion');

// Inicializo la variable express
let app = express();

// Inicializo el modelo del producto
let Producto = require('../models/producto');


// =================================
// Obtener los productos
// =================================
app.get('/producto', verificaToken, (req, res) => {
    // trae todos los productos
    // populate: usuario categoria
    // paginado

    let desde = req.query.desde || 0;
    desde = Number(desde);

    let hasta = req.query.hasta || 5;
    hasta = Number(hasta);

    // dentro del find se puede poner un fitro para que traiga solo los que esten disponible true
    Producto.find({ disponible: true })
        .skip(desde)
        .limit(hasta)
        .populate('usuario', 'nombre email')
        .populate('categoria', 'descripcion')
        .exec((err, productoDB) => {
            if (err) {
                return res.status(500).json({
                    ok: false,
                    err
                });
            }

            res.json({
                ok: true,
                productoDB
            })
        });
})

// =================================
// Obtener un producto
// =================================
app.get('/producto/:id', verificaToken, (req, res) => {
    // populate: usuario categoria
    let id = req.params.id;

    Producto.findById(id)
        .populate('usuario', 'nombre email')
        .populate('categoria', 'descripcion')
        .exec((err, productoDB) => {
            if (err) {
                return res.status(500).json({
                    ok: false,
                    err
                });
            }

            if (!productoDB) {
                return res.status(400).json({
                    ok: false,
                    err: {
                        message: 'El Id del Producto No existe'
                    }
                });
            }


            res.json({
                ok: true,
                productoDB
            });
        });

});

// =================================
// Buscar Productos
// =================================

app.get('/producto/buscar/:termino', verificaToken, (req, res) => {


    //  si mando el termino sin tocarlo me traera solo el nombre que sea igual al termino
    let termino = req.params.termino;

    // pero si uso exp regualres me ayuda a hacer busqueda por partes como un like
    // le pongo i para que no sea sensible a minusculas y mayusculas 
    let regex = new RegExp(termino, 'i');

    // Producto.find({ nombre: termino })
    Producto.find({ nombre: regex })
        .populate('categoria', 'descripcion')
        .exec((err, productoDB) => {
            if (err) {
                return res.status(500).json({
                    ok: false,
                    err
                });
            }

            res.json({
                ok: true,
                productoDB
            });
        });

});

// =================================
// Crear un nuevo productos
// =================================
app.post('/producto', verificaToken, (req, res) => {
    // grabar el usuario
    // grabar una categoriadel listado

    let body = req.body;
    let usuario = req.usuario;

    let producto = new Producto({
        nombre: body.nombre,
        precioUni: body.precioUni,
        descripcion: body.descripcion,
        disponible: true,
        categoria: body.categoria,
        usuario: usuario._id
    });

    producto.save((err, productoDB) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                err
            });
        }

        if (!productoDB) {
            return res.status(400).json({
                ok: false,
                err
            });
        }

        res.json({
            ok: true,
            productoDB
        })

    })


})

// =================================
// Actualiza un producto
// =================================
app.put('/producto/:id', verificaToken, (req, res) => {
    // 
    let id = req.params.id;

    let body = req.body;

    let producto = {
        nombre: body.nombre,
        precioUni: body.precioUni,
        descripcion: body.descripcion,
        disponible: body.disponible,
        categoria: body.categoria
    }

    Producto.findByIdAndUpdate(id, producto, { new: true, runValidators: true }, (err, productoDB) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                err
            });
        }

        if (!productoDB) {
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'El id de Producto no existe'
                }
            });
        }

        res.json({
            ok: true,
            productoDB
        });

    })

})

// =================================
// borrar productos
// =================================
app.delete('/producto/:id', (req, res) => {
    //solo cambiarle el estado en disponible o nos

    let id = req.params.id;

    let estProducto = {
        disponible: false
    }

    Producto.findByIdAndUpdate(id, estProducto, { new: true, runValidators: true }, (err, productoDB) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                err
            });
        }

        if (!productoDB) {
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'El id no existe'
                }
            });
        }

        res.json({
            ok: true,
            productoDB,
            mensage: 'Producto Borrado'
        })

    });
})


// exportamos el archivo para poder usarlo fuera de aqui
module.exports = app;