// llamao el paquete express es el que ayuda a hacer servicio web
const express = require('express');


// con esta funcion puedo verificar que si el usuario esta autenticado
let { verificaToken, verificaAdmin_Role } = require('../middlewares/autenticacion');

// a la variable app le agego el paquet express para poder usaarlo
let app = express();

// llamo el modelo de la categoria
let Categoria = require('../models/categoria');

// =============================
// Mostrar todas las categorias
// =============================
// get ayuda a consultar se manda primero el lkink
app.get('/categoria', verificaToken, (req, res) => {
    // Categoria.find();
    // para consultas general se usa el find esta es funcion de mongoose
    Categoria.find()
        // esta es otra funcion adicional nos ayuda a order el resultado
        .sort('descripcion')
        // populate esta funcion es adiciona y nos ayuda a traer informacion de otras tablas por medio del
        // object_id el primer parametro es la colletion y despeus los campos que quiero mostrar
        .populate('usuario', 'nombre email')
        .exec((err, categorias) => {
            if (err) {
                return res.status(500).json({
                    ok: false,
                    err
                })
            }

            res.json({
                ok: true,
                categorias
            })
        })
});


// =============================
// Mostrar una categoria por ID
// =============================
app.get('/categoria/:id', verificaToken, (req, res) => {
    // Categirua.findById();
    // se extrae el id del request
    let id = req.params.id;

    //con la funcion findbyid  puedo consultar por 
    Categoria.findById(id).exec((err, categoriaDB) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                err
            })
        }

        if (!categoriaDB) {
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'El ID no existe'
                }
            });
        }

        res.json({
            ok: true,
            categoriaDB
        })
    });
});



// =============================
// Crear nueva categoria 
// =============================
app.post('/categoria', verificaToken, (req, res) => {
    // regresa la nueva categoria
    // req.usuario._id

    let body = req.body;
    let usuario = req.usuario;


    let categoria = new Categoria({
        descripcion: body.descripcion,
        usuario: usuario._id
    });


    // Guarado la categoria
    categoria.save((err, categoriaDB) => {
        // Si da un error retorno el mensaje que me da el callback
        if (err) {
            return res.status(500).json({
                ok: false,
                err
            });
        }

        // Verifico si la categoria se guardo y si dio error lo retorno
        if (!categoriaDB) {
            return res.status(500).json({
                ok: false,
                categoriaDB
            });
        }

        // si no dio error es que llego aqui y mando una respuesta siempre debo mandar una respuestao sino qued trabado
        res.json({
            ok: true,
            categoria: categoriaDB
        });
    });



});

// =============================
// Actualizar el nombre de la categoria
// =============================
app.put('/categoria/:id', verificaToken, (req, res) => {

    // de esta forma obtengo el id del encabezdo
    let id = req.params.id;

    let body = req.body;

    // pongo los campos a actualizar
    let descCategoria = {
        descripcion: body.descripcion
    };

    Categoria.findByIdAndUpdate(id, descCategoria, { new: true, runValidators: true }, (err, categoriaDB) => {

        if (err) {
            return res.status(500).json({
                ok: false,
                err
            });
        }

        // Verifico si la categoria se guardo y si dio error lo retorno
        if (!categoriaDB) {
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'El id de Categoria no existe'
                }
            });
        }

        res.json({
            ok: true,
            categoria: categoriaDB
        })
    })

});



// =============================
// Eliminar la categoria fisicamente
// =============================
app.delete('/categoria/:id', [verificaToken, verificaAdmin_Role], (req, res) => {
    // solo un administrador puede borrar categorias
    let id = req.params.id;

    Categoria.findByIdAndRemove(id, (err, categoriaDB) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                err
            });
        }


        // Verifico si la categoria se guardo y si dio error lo retorno
        if (!categoriaDB) {
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'El id no existe'
                }
            });
        }

        res.json({
            ok: true,
            message: 'Categoria Borrada'
        })
    });
});


module.exports = app;