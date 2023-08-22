const Sensor_data = require("../model/mdl_Sensor_data");
const Utils = require("./cls_utils");
const Telegram = require("./cls_envioTelegram");


class MongoDB {
    static async insertarRegistro(JSONString) {
        let objeto;
        let horaActual;
        try {
            objeto = JSON.parse(JSONString);
            if (objeto.tipo === "inicio") {
                horaActual = Utils.obtenerHoraActual();

                try {

                    const result = await Sensor_data.updateMany({ sUsuario: objeto.usuario }, { $set: { iActivo: 0 } });
                    console.log('Documentos actualizados:', result.nModified);

                    const nuevoDato = new Sensor_data({
                        sUsuario: objeto.usuario,
                        sFechaRegistroInicio: horaActual,
                        sFechaRegistroFin: "",
                        iValorSensorDH11Hum: 0,
                        iValorSensorDH11Tem: 0,
                        iValorSensorIman: 0,
                        iValorSensorGolpe: 0,
                        sLontitud: "0",
                        sLatitud: "0",
                        iActivo: 1
                    });

                    const doc = await nuevoDato.save();
                    console.log('Dato guardado:', doc);

                } catch (err) {
                    console.error('Error al guardar el dato:', err);
                }
            } else if (objeto.tipo === "sensorDHT11") {
                await MongoDB.updateField({ iActivo: 1 }, { iValorSensorDH11Tem: objeto.temp, iValorSensorDH11Hum: objeto.hum });
            } else if (objeto.tipo === "sensorGolpe") {
                await MongoDB.updateField({ iActivo: 1 }, { iValorSensorGolpe: 1 });
                setInterval(await Telegram.enviarMensaje(), 20000);
            } else if (objeto.tipo === "sensorGPS") {
                await MongoDB.updateField({ iActivo: 1 }, { sLontitud: objeto.lon, sLatitud: objeto.lat });
            } else if (objeto.tipo === "sensorIman") {
                await MongoDB.updateField({ iActivo: 1 }, { iValorSensorIman: 1 });
            }
        } catch (error) {
            console.error(error);
        }
    }

    static async updateField(query, setFields) {
        try {
            const result = await Sensor_data.updateMany(query, { $set: setFields });
            // console.log('Documentos actualizados:', result);
        } catch (err) {
            console.error('Error actualizando los documentos:', err);
        }
    }

    static async finRecorrido() {
        let horaActual = Utils.obtenerHoraActual();
        await MongoDB.updateField({ iActivo: 1 }, { sFechaRegistroFin: horaActual, iActivo: 2 });
    }
}

module.exports = MongoDB;