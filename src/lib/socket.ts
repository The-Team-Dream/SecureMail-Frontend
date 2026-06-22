import { io, Socket } from "socket.io-client";
import Cookies from "js-cookie";
import { baseURL } from "./axios";

let socket: Socket | null = null;

/**
 * Returns the singleton Socket.IO instance.
 * Creates a new connection if one doesn't exist or was disconnected.
 */
export const getSocket = (): Socket => {
  if (socket) {
    if (!socket.connected) {
      // Update token just in case it changed
      const token = Cookies.get("token");
      socket.auth = { token };
      socket.connect();
    }
    return socket;
  }

  const token = Cookies.get("token");
  console.log("[WebSocket] Attempting to connect to:", baseURL);
  console.log("[WebSocket] Token exists:", !!token);

  socket = io(baseURL, {
    auth: { token },
    autoConnect: true,
    reconnection: true,
    reconnectionAttempts: Infinity,
    reconnectionDelay: 1000,
    reconnectionDelayMax: 10000,
    transports: ["websocket"],
  });

  return socket;
};

/**
 * Disconnect and clean up the socket instance.
 */
export const disconnectSocket = (): void => {
  if (socket) {
    socket.removeAllListeners();
    socket.disconnect();
    socket = null;
  }
};

/**
 * Check if the socket is currently connected.
 */
export const isSocketConnected = (): boolean => {
  return socket?.connected ?? false;
};
