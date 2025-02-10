const express = require('express');
const app = express();
const http = require('http').createServer(app);
const io = require('socket.io')(http);
const jwt = require('jsonwebtoken');

// Middleware para autenticar conexiones de socket
io.use((socket, next) => {
  const token = socket.handshake.auth.token;
  try {
    const decoded = jwt.verify(token, 'your_jwt_secret');
    socket.userId = decoded.userId;
    next();
  } catch (err) {
    next(new Error('Authentication error'));
  }
});

// Manejar conexiones
io.on('connection', (socket) => {
  console.log('Usuario conectado:', socket.userId);

  // Unirse al room del vecindario
  socket.on('joinNeighborhood', (neighborhoodId) => {
    socket.join(`neighborhood_${neighborhoodId}`);
  });

  // Manejar nuevas alertas
  socket.on('sendAlert', async (alertData) => {
    // Guardar la alerta en la base de datos si es necesario
    try {
      // Emitir la alerta a todos los usuarios del vecindario
      io.to(`neighborhood_${alertData.neighborhoodId}`).emit('newAlert', {
        title: alertData.title,
        message: alertData.message,
        userName: alertData.userName,
        userId: alertData.userId
      });
    } catch (error) {
      console.error('Error sending alert:', error);
    }
  });

  socket.on('disconnect', () => {
    console.log('Usuario desconectado:', socket.userId);
  });
});

http.listen(3000, () => {
  console.log('Server running on port 3000');
});