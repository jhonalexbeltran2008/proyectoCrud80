//importar dependencia dotenv
require("dotenv").config()

// importación del paquete de express, tradicional (require)
const express = require("express");

// creación de mi aplicación de express
const miApp = express();
const miPuerto = process.env.MIPUERTO || 3333

// endpoint raíz, no tiene ruta
miApp.get("/", (req, res) => {
  res.send(`<h1>Api Rest Productos la 80</h1>`);
});

// link del servidor, por donde se escuchan las peticiones del usuario.
miApp.listen(miPuerto, () => {
  console.log(`SERVIDOR: http://localhost:${miPuerto}`);
});