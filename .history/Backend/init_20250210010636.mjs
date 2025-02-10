const express = require("express");
const http = require("http");
const socketIo = require("socket.io");

const app = express();
const server = http.createServer(app);
const io = socketIo(server);

let users = {}; // Almacena los usuarios conectados por vecindarios

// Conexión de socket
io.on("connection", (socket) => {
  console.log("Un usuario se ha conectado");

  // Obtener el vecindario del usuario, por ejemplo, después de que se haya autenticado
  socket.on("setNeighborhood", (neighborhoodId) => {
    users[socket.id] = neighborhoodId;
    console.log(`Usuario conectado a vecindario: ${neighborhoodId}`);
  });

  // Escuchar eventos de alerta
  socket.on("sendAlert", (alertData) => {
    // Emitir solo a los usuarios que pertenecen al vecindario de la alerta
    for (const [socketId, neighborhoodId] of Object.entries(users)) {
      if (neighborhoodId === alertData.neighborhoodId) {
        io.to(socketId).emit("nuevaAlarma", alertData);
      }
    }
  });

  socket.on("disconnect", () => {
    console.log("Usuario desconectado");
    delete users[socket.id]; // Limpiar cuando un usuario se desconecta
  });
});

// Configura el servidor para escuchar en un puerto
server.listen(3000, () => {
  console.log("Servidor en el puerto 3000");
});
