

import { io } from "socket.io-client";


const SOCKET_URL = "https://smart-connect-backend-eu0p.onrender.com";

const socket = io(SOCKET_URL, {
  transports: ["websocket"],
  reconnectionAttempts: 5,
  reconnectionDelay: 2000,
  autoConnect: true,
  withCredentials: false,
});

export default socket;
