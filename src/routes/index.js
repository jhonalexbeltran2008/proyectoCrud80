// Reúne las rutas del proyecto.
const { Router } = require("express");

const usuariosRouter = require("./usuariosRoute");
const productosRouter = require("./productosRoute");

const enrutador = Router();

// Rutas de usuarios.
enrutador.use("/usuarios", usuariosRouter);

// Rutas de productos.
enrutador.use("/productos", productosRouter);

module.exports = enrutador;