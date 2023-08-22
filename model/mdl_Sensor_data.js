const mongoose = require('mongoose');

const Schema = mongoose.Schema;
const model = mongoose.model;

const Sensor_dataSchema = new Schema({
    sUsuario: { type: String, required: true },
    sFechaRegistroInicio: { type: String, required: false },
    sFechaRegistroFin: { type: String, required: false },
    iValorSensorDH11Hum: { type: Number, required: false },
    iValorSensorDH11Tem: { type: Number, required: false },
    iValorSensorIman: { type: Number, required: false },
    iValorSensorGolpe: { type: Number, required: false },
    sLontitud: { type: String, required: false },
    sLatitud: { type: String, required: false },
    iActivo: { type: Number, required: false },
  },
  {
    collection: 'Sensor_data'
  });

const Sensor_data = model('Sensor_data', Sensor_dataSchema);

module.exports = Sensor_data;