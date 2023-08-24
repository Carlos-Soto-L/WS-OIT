const Sensor_data = require("../model/mdl_Sensor_data");
const axios = require('axios');
const twilio = require('twilio');
const crypto = require('crypto');


// Define tus credenciales de Twilio
const accountSid = process.env.ACCOUNT_SID; // Reemplaza con tu Account SID de Twilio
const authToken = process.env.AUTH_TOKEN; // Reemplaza con tu Auth Token de Twilio
const client = new twilio(accountSid, authToken);

function decrypt(text) {
    let textParts = text.split(':');
    let iv = Buffer.from(textParts.shift(), 'hex');
    let encryptedText = Buffer.from(textParts.join(':'), 'hex');
    let decipher = crypto.createDecipheriv('aes-256-cbc', Buffer.from('utng2023utng2023utng2023utng2023'), iv);
    let decrypted = decipher.update(encryptedText);
    
    decrypted = Buffer.concat([decrypted, decipher.final()]);
    
    return decrypted.toString();
}

class Telegram {

    static async enviarMensaje(){
        let response = "";
        let address = "";
        let decryptedLon = "";
        let decryptedLat = "";
    
        try {
            const document = await Sensor_data.findOne({ iActivo: 1 }, 'sLontitud sLatitud').exec();
    
            if (document) {
                console.log("Lontitud:", document.sLontitud);
                console.log("Latitud:", document.sLatitud);

                if (document.sLontitud == "0" && document.sLatitud == "0") {
                    address = "¡Emergencia! Posiblemente he tenido un accidente. Mándame un mensaje o solicita ayuda en la dirección donde me dirigía.";
                } else {
                    decryptedLon = decrypt(document.sLontitud.toString());
                    decryptedLat = decrypt(document.sLatitud.toString());

                    response = await axios.get(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${decryptedLat}&lon=${decryptedLon}`, {
                        headers: {
                            'User-Agent': 'CascoGuardian'
                        },
                        timeout: 10000
                    });

                    address = "¡Emergencia! Posiblemente he tenido un accidente. Por favor, envía ayuda a " + response.data.display_name;
                }

                try {
                    const message = await client.messages.create({
                       body: address,
                       from: 'whatsapp:+14155238886', // Reemplaza con tu número de Twilio para WhatsApp
                       to: 'whatsapp:+5214181876396'   // Reemplaza con el número del destinatario (Debe estar registrado en Twilio para pruebas)
                    });
        
                    console.log("Mensaje enviado con ID:", message.sid);
                } catch (error) {
                    console.log("Error enviando el mensaje a WhatsApp:", error.message);
                }
                    
            } else {
                console.log("No se encontró ningún documento con iActivo = 1");
            }
    
        } catch (error) {
            console.log("Error sending location: " + error.message);
        }
    }

}

module.exports = Telegram;