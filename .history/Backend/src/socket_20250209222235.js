import { useEffect } from "react";
import io from "socket.io-client";

const socket = io("http://localhost:3001"); // Ajusta el puerto según tu backend

const App = () => {
  useEffect(() => {
    socket.on("change", (data) => {
      console.log("Nuevo comentario recibido:", data);
      // Aquí puedes actualizar el estado con los nuevos comentarios
    });

    return () => {
      socket.off("change");
    };
  }, []);

  return <div>Escuchando cambios en comentarios...</div>;
};

export default App;
