const { listarUsuarios, listarUsuarioPorID, crearUsuario, editarUsuario, eliminarUsuario } = require("../modelService/usuariosService")

const listarController = async(req, res)=>{
    try {
        const usuarios = await listarUsuarios()
        res.status(200).json(usuarios)
    } catch (error) {
        res.status(500).json({Error: error.message})
    }
};

const listarUnUsuario = async(req, res) =>{
    try{
        const id = Number (req.params.id)
        const usuario = await listarUsuarioPorID(id)

        if (!usuario) {
            return res.status(404).json({ mensaje: "Usuario no encontrado" })
        }

        res.status(200).json(usuario)
    } catch (error) {
        res.status(500).json({Error: error.message})
    }
};

const crear = async(req, res) =>{
    try{
        const {email, name, clave} = req.body
        const userNew = await crearUsuario(email, name, clave)
        res.status(201).json({mensaje: "Usuario creado", userNew})
    } catch (error) {
        res.status(500).json({Error: error.message})
    }
};

const editar = async (req, res) => {
    try {
        const id = Number(req.params.id)
        const { email, name, clave } = req.body
        const usuarioEditado = await editarUsuario(id, email, name, clave)
        res.status(200).json({ mensaje: "Usuario actualizado", usuarioEditado })
    } catch (error) {
        res.status(500).json({ Error: error.message })
    }
};

const eliminar = async(req, res) =>{
    try{
        const id = Number (req.params.id)
        await eliminarUsuario(id)
        res.status(200).json({mensaje: "Usuario eliminado"})
    } catch (error) {
        res.status(500).json({ Error: error.message })
    }
};

module.exports = { listarController, listarUnUsuario, crear, editar, eliminar }