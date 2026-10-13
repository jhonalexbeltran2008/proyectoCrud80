const app = require("./app.js");
const PORT = process.env.PORT || 3500;

app.listen(PORT, () => {
  console.log(`SERVIDOR EN EL PUERTO: http://localhost:${PORT}`);
});