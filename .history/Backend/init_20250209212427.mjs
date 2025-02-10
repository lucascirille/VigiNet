// src/init.mjs
import app from './src/app.mjs';

const port = process.env.PORT || 3002;

app.listen(port, () => {
	console.log(`Servidor corriendo en el puerto ${port}`);
});

