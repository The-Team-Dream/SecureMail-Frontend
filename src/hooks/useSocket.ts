"use client";

import { useEffect, useCallback } from "react";
import { useSocketContext } from "@/utils/providers/SocketProvider";
import type { SocketEvent, ServerToClientEvents } from "@/APIs/types/WebSocket";

/**
 * Hook to listen to a specific socket event.
 * Automatically subscribes/unsubscribes on mount/unmount.
 *
 * @example
 * ```tsx
 * useSocketEvent(SocketEvent.NEW_EMAIL, (data) => {
 *   console.log("New email in mailbox:", data.mailboxId);
 * });
 * ```
 */
export function useSocketEvent<E extends keyof ServerToClientEvents>(
  event: E,
  handler: ServerToClientEvents[E],
) {
  const { socket, isConnected } = useSocketContext();

  const stableHandler = useCallback(handler, [handler]);

  useEffect(() => {
    if (!socket || !isConnected) return;

    socket.on(event as string, stableHandler as any);
    return () => {
      socket.off(event as string, stableHandler as any);
    };
  }, [socket, isConnected, event, stableHandler]);
}

/**
 * Hook to access the socket connection state.
 *
 * @example
 * ```tsx
 * const { isConnected, connectionError } = useSocketStatus();
 * ```
 */
export function useSocketStatus() {
  const { isConnected, connectionError } = useSocketContext();
  return { isConnected, connectionError };
}
