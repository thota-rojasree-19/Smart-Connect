<<<<<<< HEAD
=======
// // src/socket.js
// import { io } from "socket.io-client";

// // ✅ Use your backend server URL here
// const SOCKET_URL = "http://localhost:5000";

// // Create a single socket connection for the entire app
// const socket = io(SOCKET_URL, {
//   withCredentials: true,
//   transports: ["websocket"], // optional for stability
// });

// export default socket;




// // src/socket.js
// import { io } from "socket.io-client";

// // 🔗 Use your backend server URL
// const SOCKET_URL = "http://localhost:5000";

// // ✅ Create a single persistent socket instance
// const socket = io(SOCKET_URL, {
//   transports: ["websocket"], // use WebSocket transport directly
//   reconnectionAttempts: 5,   // try reconnecting up to 5 times
//   reconnectionDelay: 2000,   // wait 2s between reconnects
//   autoConnect: true,         // automatically connect on import
//   withCredentials: false,    // no credentials needed for localhost
// });

// export default socket;





>>>>>>> 32152e9e6930315a4cf111cae252faf2df3a9203


import { io } from "socket.io-client";

<<<<<<< HEAD

const SOCKET_URL = "https://smart-connect-backend-eu0p.onrender.com";
=======
const SOCKET_URL = "http://localhost:5000";
>>>>>>> 32152e9e6930315a4cf111cae252faf2df3a9203

const socket = io(SOCKET_URL, {
  transports: ["websocket"],
  reconnectionAttempts: 5,
  reconnectionDelay: 2000,
  autoConnect: true,
  withCredentials: false,
});

export default socket;
