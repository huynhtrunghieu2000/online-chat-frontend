import { API_URL } from 'app/config';
import { io, Socket } from 'socket.io-client';
import { getToken } from '../services/storage.service';
// import { readFileSync } from 'fs';

export class SocketClient {
  private static _instance: SocketClient;
  private socket: Socket;
  // private _conferenceSocket: Socket;
  constructor() {
    if (SocketClient._instance) {
      throw new Error(
        'Error: Instantiation failed: Use SocketClient.getInstance() instead of new.',
      );
    }
    SocketClient._instance = this;
    this.socket = io(API_URL, {
      transports: ['websocket'],
      auth: {
        token: getToken(),
      },
      autoConnect: false,
    });
    // this._conferenceSocket = io(API_URL + '/video-conference', {
    //   transports: ['websocket'],
    //   auth: {
    //     token: getToken(),
    //   },
    //   autoConnect: false,
    // });
    this.socket.on('connect', () => {
      console.log('Connected to server');
    });
    this.socket.on('disconnect', () => {
      console.log('Disconnected from server');
    });
    this.socket.on('error', error => {
      console.log(error);
    });
    this.socket.onAnyOutgoing((event, ...args) => {
      console.log(`emitted ${event}`, args);
    });
  }

  public static getInstance(): SocketClient {
    return SocketClient._instance;
  }

  get Socket() {
    return this.socket;
  }

  // get conferenceSocket() {
  //   return this._conferenceSocket;
  // }
}
