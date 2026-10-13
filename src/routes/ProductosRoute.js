const { Router } = require("express");
const { listarProductos, 
        listarUnProducto,
        crearProductos, 
        eliminarProductos } = require("../controllers/productosController")

const router = Router();

// Ruta final complementaria para formar api/productos/listado
router.get("/listado", listarProductos);
router.get("/listarUno", listarUnProducto);
router.get("/crear", crearProductos);
router.get("/eliminar", eliminarProductos);

module.exports = router;