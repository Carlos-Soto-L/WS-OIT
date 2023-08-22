const WebSocket = require('ws');
const MongoDB = require("../class/cls_mongoDB");

class WebSocketClass {
  constructor(ws, wss) {
    this.ws = ws;
    this.wss = wss;
    this.inactivityTimeout = null; // para rastrear el temporizador de inactividad
    this.iniciarconfiguracion();
  }

  iniciarconfiguracion() {
    console.log('Cliente conectado');

    this.ws.on('message',  async (message) => {
      const dataAsString = message.toString();

      // Si hay un temporizador previo, lo limpiamos.
      if (this.inactivityTimeout) {
        clearTimeout(this.inactivityTimeout);
      }

      // Configurar el temporizador de inactividad. Por ejemplo, 30 segundos de inactividad.
      this.inactivityTimeout = setTimeout(this.fin.bind(this), 30 * 1000); // .bind(this) es para asegurarnos de que 'this' dentro de fin() apunta a la instancia de WebSocketClass

      // Configurar intervalo para insertar registro cada 20 segundos
        await MongoDB.insertarRegistro(dataAsString);

        
      // Reenviar el mensaje a todos los clientes conectados
      this.wss.clients.forEach((client) => {
        if (client !== this.ws && client.readyState === WebSocket.OPEN) {
          client.send(dataAsString);
          console.log(dataAsString);
        }
      });
    });

    this.ws.on('close', () => {
      console.log('Cliente desconectado');
      if (this.inactivityTimeout) {
        clearTimeout(this.inactivityTimeout); // Limpiamos el temporizador si el cliente se desconecta
      }
    });
  }

  fin() {
    MongoDB.finRecorrido();
  }

}

module.exports = WebSocketClass;