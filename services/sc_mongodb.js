const mongoose = require("mongoose");

async function connectDB() {
    
    try {
        await mongoose.connect(process.env.DB_CONN_STRING);
        console.log("Conectado con éxito a la base de datos: DB_GuardianGear");
    } catch (err) {
        console.error(err.message);
    }
}

module.exports = { connectDB };