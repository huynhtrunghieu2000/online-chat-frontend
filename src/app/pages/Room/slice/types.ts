import { Channel, Room } from 'app/core/models/Room';

/* --- STATE --- */
export interface RoomState {
  roomList: any;
  roomDetail: any;
  channelDetail: any;
  messages: any[];
  currentMeeting: any;
  isCreateRoomSuccess: boolean;
  isCreateChannelSuccess: boolean;
  isInviteUserSuccess: boolean;
  isLoading: boolean;
  hasError: boolean;
  error: any;
}
