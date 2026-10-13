const datos = [
    {"id": 1, "nombre": "Hamburgesa", "precio": 20000},
    {"id": 2, "nombre": "Salchipapa", "precio": 10000}
];
const listar = async () => {
    return datos;
};

module.exports = { listar }