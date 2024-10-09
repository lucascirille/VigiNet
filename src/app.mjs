// src/app.mjs
import express from 'express';
import vecindarioRoutes from './routes/vecindarioRoutes.mjs'; 
import alarmaRoutes from './routes/alarmaRoutes.mjs'; 
import morgan from 'morgan';
import globalErrorHandler from './middleware/globalErrorHandler.mjs'; 

const app = express();

// Middlewares
app.use(express.json()); 
app.use(morgan('dev')); 

// Ruta básica para la raíz
app.get('/', (req, res) => {
    res.status(200).send('Bienvenido a la API de VegiNet');
});

// Rutas de vecindarios
app.use('/api/vecindarios', vecindarioRoutes); 

// Rutas de alarmas
app.use('/api/alarmas', alarmaRoutes); 

// Middleware de manejo de errores
app.use(globalErrorHandler); 

export default app; 

