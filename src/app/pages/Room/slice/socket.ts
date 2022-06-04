import { SOCKET_EVENT } from 'app/core/constants/socket-actionTypes';
import { MiddlewareAPI } from '@reduxjs/toolkit';
export const roomSocketListener = (socket, storeAPI: MiddlewareAPI) => {
  socket.on(SOCKET_EVENT.MESSAGE.SEND_SUCCESS, data => {
    storeAPI.dispatch({
      type: SOCKET_EVENT.MESSAGE.SEND_SUCCESS,
    });
  });
};
