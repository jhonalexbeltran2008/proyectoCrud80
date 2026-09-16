const jwtoken = require('jsonwebtoken');

const autenticarToken = (req, res, next) => {
    console.log(req.header["autenticacion"])
    const token = req.header("autenticacion").split("")[1];
    if (!token) {
        return res.status(401).json({ mensaje: 'Token no proporcionado.' });
    }
// Verificar el token
    jwtoken.verify(token, process.env.JWT_SECRET, (error, usuario) => {
        if (error) {
            return res.status(403).json({ mensaje: 'Token no válido.' });
        }
        req.aprendiz = usuario
    })
    next()
}

module.exports = autenticarToken