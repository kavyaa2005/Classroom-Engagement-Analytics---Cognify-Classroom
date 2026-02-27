import { io, Socket } from "socket.io-client";
import { getToken } from "./api";

const SOCKET_URL = "http://localhost:5000";

let socket: Socket | null = null;

// ─── Connect ──────────────────────────────────────────────────────────────────

export function connectSocket(): Socket {
  if (socket?.connected) return socket;

  socket = io(SOCKET_URL, {
    auth: { token: getToken() ?? "" },
    transports: ["websocket"],
    reconnection: true,
    reconnectionAttempts: 5,
    reconnectionDelay: 2000,
  });

  socket.on("connect", () => {
    console.log("[Socket] Connected:", socket?.id);
  });

  socket.on("disconnect", (reason) => {
    console.log("[Socket] Disconnected:", reason);
  });

  socket.on("connect_error", (err) => {
    console.warn("[Socket] Connection error:", err.message);
  });

  return socket;
}

// ─── Disconnect ───────────────────────────────────────────────────────────────

export function disconnectSocket(): void {
  if (socket) {
    socket.disconnect();
    socket = null;
  }
}

// ─── Get current instance (may be null) ──────────────────────────────────────

export function getSocket(): Socket | null {
  return socket;
}
