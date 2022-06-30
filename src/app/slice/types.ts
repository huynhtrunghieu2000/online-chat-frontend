/* --- STATE --- */
export interface AppState {
  socket: {
    isConnected: boolean;
    isReconnecting: boolean;
  };
}
