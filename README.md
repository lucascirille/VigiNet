para ejecutar se debe tener npm instalado y ejecutar el comando `npm install` para instalar las dependencias necesarias y luego ejecutar el comando `npm start` para iniciar el servidor local para el front-end.

y para el backend con npm instalado ejecutar el comando `npm install` para instalar las dependencias necesarias y luego ejecutar el comando `npm init.mjs` para iniciar el servidor local para el back-end.

app.use(
  cors({
    origin: ["http://localhost:8081", "http://localhost:3001"], 
    credentials: true, // Si usas cookies o autenticación basada en sesión (en app.js)
  })
);


para cargar la base de datos:
```
-- 1. Crear el País
INSERT INTO "Pais" ("paisId", "nombre") 
VALUES (1, 'Argentina');

-- 2. Crear la Provincia (apuntando a Argentina)
INSERT INTO "Provincia" ("provinciaId", "nombre", "paisId") 
VALUES (1, 'Buenos Aires', 1);

-- 3. Crear la Localidad (Quilmes, apuntando a Buenos Aires)
INSERT INTO "Localidad" ("localidadId", "nombre", "provinciaId") 
VALUES (1, 'Quilmes', 1);


INSERT INTO "Vecindario" ("vecindarioId", "nombre", "localidadId")
VALUES
    (1, 'Quilmes Oeste', 1),
    (2, 'Quilmes Centro', 1),
    (3, 'Quilmes Este', 1),
    (4, 'La Colonia', 1),
    (5, 'Solano', 1),
    (6, 'San Francisco Solano', 1),
    (7, 'San Juan', 1),
    (8, 'Ezpeleta', 1),
    (9, 'Ezpeleta Oeste', 1);
```
