const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const dotenv = require('dotenv');
const morgan = require('morgan');
const cors = require('cors');

// Importar rutas
const vecindarioRoutes = require('./routes/vecindarioRoutes');
const alarmaRoutes = require('./routes/alarmaRoutes');
const usuarioRoutes = require('./routes/usuarioRoutes');
const notificacionRoutes = require('./routes/notificacionRoutes');
const enumGeoNamesRoutes = require('./routes/enumGeoNamesRoutes');
const authRoutes = require('./routes/authRoutes');
const { verifyGeoDB } = require('./helpers/verifyGeoDB');
const globalErrorHandler = require('./middleware/globalErrorHandler');
const { cargarEnumerativa } = require('./helpers/loadGeoNamesData');

dotenv.config();

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: { origin: '*' }, // Habilitar CORS para frontend
});

// Middlewares
app.use(express.json());
app.use(morgan('dev'));
app.use(
  cors({
    origin: 'http://localhost:8081', // Asegúrate de que el frontend use este puerto
  })
);

// Ruta básica para la raíz
app.get('/', (_req, res) => {
  res.status(200).send('Bienvenido a la API de VegiNet');
});

// Rutas de autenticación
app.use('/api/auth', authRoutes);

// Rutas de vecindarios
app.use('/api/vecindarios', vecindarioRoutes);

// Rutas de alarmas
app.use('/api/alarmas', alarmaRoutes);

// Rutas de notificaciones
app.use('/api/notificaciones', notificacionRoutes);

// Rutas de Usuario
app.use('/api/usuarios', usuarioRoutes);

// Rutas de Enumerativa
app.use('/api/enumGeoNames', enumGeoNamesRoutes);

// Middleware de manejo de errores
app.use(globalErrorHandler);

// Verifica si la base de datos de geonames está cargada
if (await verifyGeoDB()) {
  cargarEnumerativa();
}

// Manejo de conexiones de usuarios con Socket.IO
io.on('connection', (socket) => {
  console.log(`Usuario conectado: ${socket.id}`);

  socket.on('unirseVecindario', (vecindarioId) => {
    socket.join(`vecindario_${vecindarioId}`);
    console.log(`Usuario ${socket.id} unido a vecindario ${vecindarioId}`);
  });

  socket.on('disconnect', () => {
    console.log(`Usuario desconectado: ${socket.id}`);
  });
});

const PORT = process.env.PORT || 3001;
server.listen(PORT, () => console.log(`Servidor en http://localhost:${PORT}`));

module.exports = app;
module.exports.io = io;