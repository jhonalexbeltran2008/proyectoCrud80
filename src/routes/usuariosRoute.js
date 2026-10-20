const { Router } = require('express') 
const {listarController, listarUnUsuario , crear, editar, eliminar} = require("../controllers/usuariosController");

const router = Router();

//router.post("/registro", registrar);
router.get("/listado", listarController)
router.get("/listar/:id", listarUnUsuario)
router.post("/crear", crear)
router.put("/editar", editar)
router.delete("/eliminar", eliminar)

module.exports = router;