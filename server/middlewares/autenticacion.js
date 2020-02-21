const jwt = require('jsonwebtoken');

// =============================
// Verificar token
// =============================


let verificaToken = (req, res, next) => {
    let token = req.get('token'); //si usaramos Authorization se pusiera esa palabra

    jwt.verify(token, process.env.SEED, (err, decoded) => {

        if (err) {
            return res.status(401).json({
                ok: false,
                err: 'Token no valido'
            });
        }

        req.usuario = decoded.usuario;
        next();

    })
};


let verificaAdmin_Role = (req, res, next) => {
    let usuario = req.usuario;

    if (usuario.role === 'ADMIN_ROLE') {
        next();
    } else {
        return res.json({
            ok: false,
            err: {
                message: 'El usuario no es Admnistrador'
            }
        })
    }


}


module.exports = {
    verificaToken,
    verificaAdmin_Role
}