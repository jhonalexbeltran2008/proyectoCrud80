require("dotenv").config()

const express = require("express")
const app = express();

// IMPORTACION JSONWEBTOKEN
const jswtoken = require("jsonwebtoken")

//Configuracion de body-parse
app.use(express.json())
const sistemaArchivos = require("fs")
const ruta = require("path")
const multer = require("multer")
const PORT = process.env.MIPUERTO || 3030;

// Ruta archivo .json
const rutaArchivoJson = ruta.join(__dirname, "datosProductos.json")

// importar middlewares
const manejoErrores = require("./middleware/manejoErrores")
const registroMiddleware = require("./middleware/registroMiddleware")
const autenticarToken = require("./middleware/autenticacion")

//midleware
app.use(registroMiddleware)
app.use(manejoErrores)
//app.use(autenticarToken)

// Endpoint para probar autenticacion
app.get("/rutapro", autenticarToken, (req, res) => {
   res.json({ mensaje: "Ruta protegida.", usuario: req.aprendiz })
})

// Endpoint para provocar un error
app.use("/error", (req, res, next) => {
      next(new Error("Error provocado - intencional"))
})

// Carpeta donde se guardan las imagenes subidas
const carpetaUploads = ruta.join(__dirname, "misImagenes")
if (!sistemaArchivos.existsSync(carpetaUploads)) {
  sistemaArchivos.mkdirSync(carpetaUploads)
}

// Configuracion de multer: guarda el archivo en /misImagenes con nombre unico
const almacenamiento = multer.diskStorage({
  destination: (req, file, cb) => cb(null, carpetaUploads),
  filename: (req, file, cb) => {
    const nombreUnico = Date.now() + ruta.extname(file.originalname)
    cb(null, nombreUnico)
  }
})
const subirImagen = multer({ storage: almacenamiento })

// Servir las imagenes de forma estatica en /misImagenes/nombreArchivo.jpg
app.use("/misImagenes", express.static(carpetaUploads))

// Validacion reutilizable
function validarProducto(datosProducto) {
  const { nombre, precio, stock, categoria, imagen } = datosProducto
  if (typeof nombre !== "string" || nombre.trim() === "") return "nombre invalido."
  if (typeof precio !== "number" || precio <= 0) return "precio invalido."
  if (typeof stock !== "number" || !Number.isInteger(stock) || stock < 0) return "stock invalido."
  if (typeof categoria !== "string" || categoria.trim() === "") return "categoria invalida."
  if (imagen !== undefined && typeof imagen !== "string") return "imagen invalida."
  return null
}

app.get("/", (req, res) => {
     res.send(`<h1>Api Rest Productos la 80</h1>`);
});

// List crear endpoint
app.get("/api/productos", (req, res) => {
    sistemaArchivos.readFile(rutaArchivoJson, "utf-8", (error, datos) =>
    {
       if(error){
          return res.status(500).json({Error: "Error conexion db."})
       }
       const listaProductos = JSON.parse(datos)
       res.json(listaProductos)
    })
})

// Endpoint para traer un producto por id
app.get("/api/productos/:id", (req, res) => {
  const idProducto = parseInt(req.params.id)
  sistemaArchivos.readFile(rutaArchivoJson, "utf-8", (error, datos) => {
    if (error){
      return res.status(500).json({Error: "Error conexion db."})
    }
    const listaProductos = JSON.parse(datos)
    const producto = listaProductos.find(p => p.id === idProducto)
    if (!producto){
      return res.status(404).json({Error: "Producto no encontrado."})
    }
    res.status(200).json(producto)
  })
})

//Endpoint para adicionar
app.post("/api/productos", subirImagen.single("imagen"), (req,res)=>{
  // con multipart/form-data, express deja precio y stock como strings en req.body
  const datosProducto = {
    ...req.body,
    precio: req.body.precio !== undefined ? Number(req.body.precio) : req.body.precio,
    stock: req.body.stock !== undefined ? Number(req.body.stock) : req.body.stock
  }

  const errorValidacion = validarProducto(datosProducto)
  if (errorValidacion){
    return res.status(400).json({Error: errorValidacion})
  }

  sistemaArchivos.readFile(rutaArchivoJson, "utf-8", (error, datos)=>{
    if (error){
      return res.json({Error: "Error de conexion"})
    }

    const listaProductos = JSON.parse(datos)

    // Id autogenerado
    const nuevoId = listaProductos.length > 0 ? Math.max(...listaProductos.map(p => p.id)) + 1 : 1

    const productoNuevo = {
      id: nuevoId,
      nombre: datosProducto.nombre,
      precio: datosProducto.precio,
      stock: datosProducto.stock,
      categoria: datosProducto.categoria,
      // si llego un archivo, se guarda la ruta publica; si no, "sin imagen"
      imagen: req.file ? `/misImagenes/${req.file.filename}` : "sin imagen"
    }

    listaProductos.push(productoNuevo)
    sistemaArchivos.writeFile(rutaArchivoJson, JSON.stringify(listaProductos,null,2), (error)=>{
      if (error){
        return res.status(500).json({Error: "No se puede registrar."})
      }
      res.status(201).json(productoNuevo)
    })
  })
})

// Endpoint para editar
app.put("/api/productos/:id", (req,res)=>{
  const idProducto = parseInt(req.params.id)
  const datosProducto = req.body

  const errorValidacion = validarProducto(datosProducto)
  if (errorValidacion){
    return res.status(400).json({Error: errorValidacion})
  }

  sistemaArchivos.readFile(rutaArchivoJson,  "utf-8", (error, datos)=>{
    if (error){
      return  res.status(500).json({Error: "Error de conexion db."})
    }

    let listaProductos = JSON.parse(datos)
    const existe = listaProductos.some(p => p.id === idProducto)
    if (!existe){
      return res.status(404).json({Error: "Producto no encontrado."})
    }

    // Actualizar datos (el id nunca se sobrescribe con el del body)
    listaProductos = listaProductos.map(producto => {
      return producto.id === idProducto ? {...producto, ...datosProducto, id: idProducto} : producto
    })

    // Escritura de archivo
    sistemaArchivos.writeFile(rutaArchivoJson, JSON.stringify(listaProductos,null,2), (error) =>{
      if (error){
        return res.json({Error: "No se puede editar."})
      }
      const productoActualizado = listaProductos.find(p => p.id === idProducto)
      res.status(200).json(productoActualizado)
    })
  })
})

// Endpoint para eliminar
app.delete("/api/productos/:id", (req, res) => {
  const idProducto = parseInt(req.params.id)
  sistemaArchivos.readFile(rutaArchivoJson, "utf-8", (error, datos)=>{
    if (error){
      return res.json({Error: "Error de conexion"})
    }
    const listaProductos = JSON.parse(datos)
    const existe = listaProductos.some(p => p.id === idProducto)
    if (!existe){
      return res.status(404).json({Error: "Producto no encontrado."})
    }
    const listaFiltrada = listaProductos.filter(p => p.id !== idProducto)
    sistemaArchivos.writeFile(rutaArchivoJson, JSON.stringify(listaFiltrada,null,2), (error)=>{
      if (error){
        return res.status(500).json({Error: "No se puede eliminar."})
      }
      res.status(200).json({Mensaje: "Producto eliminado."})
    })
  })
})

app.listen(PORT, () => {
    console.log(`Servidor: http://localhost:${PORT}`);
});


// # Endpoint para login
app.post("/log", (req, res) => {
  //capturar datos
  const {usuario, clave} = req.body;    
  //simular datos del usuario en una db
  const datosUsuario = {
    "usuarioBd": "Juan",
    "clave": "AA23"
  }
  //Validar datos del usuario
if (usuario !== datosUsuario.usuarioBd || clave !== datosUsuario.clave){
  res.status(400).json({Mensaje: "Credenciales incorrectas."})
}
  // Generar y verificar 
  const token = jswtoken.sign(
    {usuario: usuario},
    process.env.JWT_SECRET,
    {expiresIn: "1h"}
  )
res.json(token)
})