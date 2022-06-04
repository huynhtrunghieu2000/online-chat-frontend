export const SOCKET_EVENT = {
  MESSAGE: {
    SEND: 'message-send',
    SEND_SUCCESS: 'message:send:success',
    SEND_FAIL: 'message:send:fail',
    GET: 'message:get',
  },
  CHANNEL: {
    JOIN: 'channel:join',
    JOIN_SUCCESS: 'channel:join:success',
    JOIN_FAIL: 'channel:join:fail',
    LEAVE: 'channel:leave',
    LEAVE_SUCCESS: 'channel:leave:success',
    LEAVE_FAIL: 'channel:leave:fail',
    NEW_MESSAGE: 'channel:new:message',
  },
};
