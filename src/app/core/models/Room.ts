import { User } from './User';

export class Room {
  id: number;
  name: string;
  avatar: string;
  createdAt: Date;
  updatedAt: Date;
  Channels: Channel[];

  constructor(data: any) {
    this.id = data.id || -1;
    this.name = data.name || '';
    this.avatar = data.avatar || '';
    this.createdAt = data.createdAt || new Date();
    this.updatedAt = data.updatedAt || new Date();
    this.Channels = data.Channels?.map(channel => new Channel(channel)) || [];
  }
}

export enum CHANNEL_TYPE {
  TEXT = 'text',
  VIDEO = 'video',
}

export class Channel {
  id: number;
  roomId: number;
  name: string;
  type: CHANNEL_TYPE;
  userActiveInChannel: User[];

  constructor(data: any) {
    this.id = data.id || -1;
    this.roomId = data.ClassroomId || -1;
    this.name = data.name || '';
    this.type = data.type || CHANNEL_TYPE.TEXT;
    this.userActiveInChannel =
      data.userActiveInChannel?.map(user => new User(user)) || [];
  }
}
