const registroMiddleware = (req, res, next) => {
const tiempoMilisegundos = Date.now()
const tiempoUTC = new Date().toDateString

console.log(`[${tiempoUTC}: ${req.method} - ${req.url}] - ${req.ip}`)
res.on("finish", () => {
  const duration = new Date() - tiempoMilisegundos
  console.log("TiempoUTC", 'respuesta', res.statusCode, duration + "ms");
});
next() 
}
module.exports = registroMiddleware