const ormPrisma = require("../config/conexion")
const bcrypt = require("bcryptjs");

//=======================================
const listarUsuarios = ()=>{
    const datos = ormPrisma.usuarios.findMany()
    return datos;
};

const listarUsuarioPorID = async(id)=>{
    const usuario = await ormPrisma.usuarios.findUnique({
        where: { id: id }
    });
    return usuario;
};

const crearUsuario = async (email, name, clave) =>{
    const claveHash = await bcrypt.hash(clave, 10);
    const nuevoUsuario = await ormPrisma.usuarios.create({
        data: {email: email, name: name, clave: claveHash}
    });
    return nuevoUsuario;
};

const editarUsuario = async (id, email, name, clave)=>{
    const claveHash = await bcrypt.hash(clave, 10);
    const usuarioEditado = await ormPrisma.usuarios.update({
        where: { id: id },
        data: {email: email, name: name, clave: claveHash}
    });
    return usuarioEditado
};

const eliminarUsuario = async (id)=>{
    const usuarioEliminado = await ormPrisma.usuarios.delete({
        where: { id: id }
    });
    return usuarioEliminado
};

module.exports = {
    listarUsuarios,
    listarUsuarioPorID,
    crearUsuario,
    editarUsuario,
    eliminarUsuario
};