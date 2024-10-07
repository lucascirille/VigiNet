// src/app.mjs
import express from 'express';
import vecindarioRoutes from './routes/vecindarioRoutes.mjs';

const app = express();

// Middlewares
app.use(express.json());

// Ruta básica para la raíz
app.get('/', (req, res) => {
	res.status(200).send('Bienvenido a la API de Vecindarios');
});

// Rutas de vecindarios
app.use('/api/vecindarios', vecindarioRoutes);

// Middleware de manejo de errores
app.use((err, req, res, next) => {
	res.status(500).json({ message: err.message });
});

const port = process.env.PORT || 3000;

app.listen(port, () => {
	console.log(`Servidor corriendo en el puerto ${port}`);
});

export default app;
