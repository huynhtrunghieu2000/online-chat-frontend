import React, { createContext, useContext, useEffect } from 'react';
import { SocketClient } from './socket-client';

export const SocketContext = createContext<SocketClient>(new SocketClient());

export const useSocket = () => {
  const socket = useContext(SocketContext);
  return socket.Socket;
};

export const SocketProvider = ({ children }) => {
  const socket = SocketClient.getInstance();

  return (
    <SocketContext.Provider value={socket}>{children}</SocketContext.Provider>
  );
};
