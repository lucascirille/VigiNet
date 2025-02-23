para ejecutar se debe tener npm instalado y ejecutar el comando `npm install` para instalar las dependencias necesarias y luego ejecutar el comando `npm start` para iniciar el servidor local para el front-end.

y para el backend con npm instalado ejecutar el comando `npm install` para instalar las dependencias necesarias y luego ejecutar el comando `npm init.mjs` para iniciar el servidor local para el back-end.

app.use(
  cors({
    origin: ["http://localhost:8081", "http://localhost:3001"], 
    credentials: true, // Si usas cookies o autenticación basada en sesión (en app.js)
  })
);
