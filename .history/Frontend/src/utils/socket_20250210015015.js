import io from "socket.io-client";

const socket = io("http://localhost:3000", {
  autoConnect: false,
  withCredentials: true,
  transports: ['websocket', 'polling'],
  extraHeaders: {
    "Access-Control-Allow-Origin": "*"
  }
});

export const connectSocket = (vecindarioId) => {
  if (!socket.connected) {
    socket.connect();
    socket.emit("unirseAlVecindario", vecindarioId);
  }
};

export default socket;