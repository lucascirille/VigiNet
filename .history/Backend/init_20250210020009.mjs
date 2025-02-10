import http from 'http';
import app from './src/app.mjs';
import { Server } from 'socket.io';
import cors from 'cors';


export const configureSocket = (server) => {
  const io = new Server(server, {
    cors: {
      origin: ["http://localhost:8081", "http://localhost:3000"],
      methods: ["GET", "POST"],
      credentials: true
    }
  });

  // Mapa para mantener registro de usuarios conectados
  const connectedUsers = new Map();

  io.on('connection', (socket) => {
    console.log('Usuario conectado:', socket.id);

    // Cuando un usuario se identifica
    socket.on('identificarUsuario', (userId) => {
      console.log(`Usuario ${userId} identificado con socket ${socket.id}`);
      connectedUsers.set(userId, socket.id);
      socket.join(`user_${userId}`);
    });

    // Cuando un usuario se une a un vecindario
    socket.on('unirseAlVecindario', (vecindarioId) => {
      console.log(`Socket ${socket.id} uniéndose al vecindario ${vecindarioId}`);
      socket.join(`vecindario_${vecindarioId}`);
    });

    socket.on('disconnect', () => {
      // Limpiar usuario del mapa cuando se desconecta
      for (const [userId, socketId] of connectedUsers.entries()) {
        if (socketId === socket.id) {
          connectedUsers.delete(userId);
          break;
        }
      }
      console.log('Usuario desconectado:', socket.id);
    });
  });

  return io;
};