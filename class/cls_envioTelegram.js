const Sensor_data = require("../model/mdl_Sensor_data");
const axios = require('axios');

class Telegram {

    static async enviarMensaje(){
        let response = "";
        let address = "";
    
        try {
            const document = await Sensor_data.findOne({ iActivo: 1 }, 'sLontitud sLatitud').exec();
    
            if (document) {
                console.log("Lontitud:", document.sLontitud);
                console.log("Latitud:", document.sLatitud);
                
                response = await axios.get(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${document.sLatitud}&lon=${document.sLontitud}`, {
                    headers: {
                        'User-Agent': 'CascoGuardian'
                    },
                    timeout: 10000
                });
    
                address = "¡Emergencia! Posiblemente he tenido un accidente. Por favor, envía ayuda a " + response.data.display_name;

                // Enviar la dirección como un mensaje a Telegram
                const telegramURL = `https://api.telegram.org/bot${process.env.TELEGRAM_TOKEN}/sendMessage?chat_id=${process.env.CHAT_ID}&text=${address}`;
                const telegramResponse = await axios.post(telegramURL);
                console.log("Response from Telegram:", telegramResponse.data);
    
                console.log("Location sent to Telegram successfully!");
    
            } else {
                console.log("No se encontró ningún documento con iActivo = 1");
            }
    
        } catch (error) {
            console.log("Error sending location: " + error.message);
        }
    }

}

module.exports = Telegram;