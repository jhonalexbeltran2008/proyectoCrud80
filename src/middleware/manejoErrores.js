const manejoErrores = (err, req, res, next) => {
const codigoEstado = err.statusCode || 5000.

const mensajeError = err.message || "Errror innesperado"
const fecha = new Date().toISOString()
console.log([ "Fecha:", fecha - "Estado:", codigoEstado - "Mensaje:", mensajeError,])
// Parte de mensaje de error
if(err.stack){
    console.error(err.stack)
}
//Rta del servidor 
res.status(codigoEstado).json({
    estado: "Error",
    mensaje,
// + Detalles cuando somos desarrolladores
        ...(process.env.NODE_ENV === "production" && {stack: err.stack})
})
}

module.exports = manejoErrores