// const { listarProductos } =require("../models/ProductosModel.js");
const { listar } = require("../modelService/ProductosModel")
const listarProductos = async (req, res)=>{
    try {
    //Obtener listado de productos, utilizando el servicio
        const productos = await listar()
        res.status(200).json(productos)
    } catch (error) {
        res.status(500).json({Error: error.mensaje});
    }
}
const listarUnProducto = (req, res)=>{
    res.json({mensaje: "Listado de un producto"})}

const crearProductos = (req, res)=>{
    res.json({mensaje: "Crear un producto"})}

const eliminarProductos = (req, res)=>{
    res.json({mensaje: "Eliminar un producto"})}
 
module.exports = { 
    listarProductos, 
    listarUnProducto, 
    crearProductos, 
    eliminarProductos };