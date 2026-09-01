require("dotenv").config()

// importación del paquete de express, tradicional (require)
const express = require("express");
const { error } = require("console");
const sistemaArchivos = require("fs");
const ruta = require("path")

// creación de mi aplicación de express
const miApp = express();
const miPuerto = process.env.MIPUERTO || 3333

//Configuracion de body-parse
miApp.use(express.json())

// Ruta archivo .json
const rutaArchivoJson = ruta.join(__dirname, "datosProductos.json")

// endpoint raíz, no tiene ruta
miApp.get("/", (req, res) => {
  res.send(`<h1>Api Rest Productos la 80</h1>`);
});

// Listar todos los productos
miApp.get("/api/productos", (req, res) => {
  sistemaArchivos.readFile(rutaArchivoJson, "utf-8", (error, datos) => {
    if (error) {
      return res.status(500).json({ Error: "Error conexion db." })
    }
    const listaProductos = JSON.parse(datos)
    res.json(listaProductos)
  })
})

// Obtener un producto por su ID
miApp.get("/api/productos/:di", (req, res) => {
  const diProducto = parseInt(req.params.di)
  sistemaArchivos.readFile(rutaArchivoJson, "utf-8", (error, datos) => {
    if (error) {
      return res.status(500).json({ Error: "Error conexion db." })
    }
    const listaProductos = JSON.parse(datos)
    const producto = listaProductos.find(p => p.di === diProducto)

    if (!producto) {
      return res.status(404).json({ Error: "Producto no encontrado." })
    }

    res.status(200).json(producto)
  })
})

// Crear un producto (con validaciones)
miApp.post("/api/productos", (req, res) => {
  const datosProducto = req.body
  const { nombre, precio, stock, categoria } = datosProducto

  // Validaciones
  if (nombre === undefined || nombre === "" ||
      precio === undefined || precio === "" ||
      stock === undefined || stock === "" ||
      categoria === undefined || categoria === "") {
    return res.status(400).json({ Error: "Bad Request: nombre, precio, stock y categoria son obligatorios." })
  }

  sistemaArchivos.readFile(rutaArchivoJson, "utf-8", (error, datos) => {
    if (error) {
      return res.status(500).json({ Error: "Error de conexion" })
    }

    const listaProductos = JSON.parse(datos)

    // Asignar imagen temporal
    datosProducto.imagen = datosProducto.imagen || "sin imagen"

    listaProductos.push(datosProducto)
    sistemaArchivos.writeFile(rutaArchivoJson, JSON.stringify(listaProductos, null, 2), (error) => {
      if (error) {
        return res.status(500).json({ Error: "No se puede registrar." })
      }
      res.status(201).json(datosProducto)
    })
  })
})

// Actualizar producto
miApp.put("/api/productos/:di", (req, res) => {
  const diProducto = parseInt(req.params.di)
  const datosProducto = req.body
  const { nombre, precio, stock, categoria } = datosProducto

  // Validaciones
  if (nombre === undefined || nombre === "" ||
      precio === undefined || precio === "" ||
      stock === undefined || stock === "" ||
      categoria === undefined || categoria === "") {
    return res.status(400).json({ Error: "Bad Request: nombre, precio, stock y categoria son obligatorios." })
  }

  sistemaArchivos.readFile(rutaArchivoJson, "utf-8", (error, datos) => {
    if (error) {
      return res.status(500).json({ Error: "Error de conexion db." })
    }

    let listaProductos = JSON.parse(datos)
    const existe = listaProductos.some(p => p.di === diProducto)

    if (!existe) {
      return res.status(404).json({ Error: "Producto no encontrado." })
    }

    // Actualizar datos
    listaProductos = listaProductos.map(producto => {
      return producto.di === diProducto ? { ...producto, ...datosProducto } : producto
    })

    // Escritura de archivo
    sistemaArchivos.writeFile(rutaArchivoJson, JSON.stringify(listaProductos, null, 2), (error) => {
      if (error) {
        return res.status(500).json({ Error: "No se puede editar." })
      }
      res.status(200).json(datosProducto)
    })
  })
})

// Eliminar un producto por ID
miApp.delete("/api/productos/:di", (req, res) => {
  const diProducto = parseInt(req.params.di)

  sistemaArchivos.readFile(rutaArchivoJson, "utf-8", (error, datos) => {
    if (error) {
      return res.status(500).json({ Error: "Error de conexion" })
    }

    const listaProductos = JSON.parse(datos)
    const existe = listaProductos.some(p => p.di === diProducto)

    if (!existe) {
      return res.status(404).json({ Error: "Producto no encontrado." })
    }

    const listaFiltrada = listaProductos.filter(p => p.di !== diProducto)

    sistemaArchivos.writeFile(rutaArchivoJson, JSON.stringify(listaFiltrada, null, 2), (error) => {
      res.status(200).json({ Mensaje: "Producto eliminado." })
    })
  })
})

// Link del servidor
miApp.listen(miPuerto, () => {
  console.log(`SERVIDOR: http://localhost:${miPuerto}`);
});