/* --- STATE --- */
export interface RoomState {
  roomList: any;
  roomDetail: any;
  channelDetail: any;
  messages: any[];
  currentMeeting: any;
  socketCondition: any;
  isCreateRoomSuccess: boolean;
  isCreateChannelSuccess: boolean;
  isInviteUserSuccess: boolean;
  isUpdateRoomDetailSuccess: boolean;
  isLeaveRoomSuccess: boolean;
  isRemoveMemberSuccess: boolean;
  isUpdateRoleMemberSuccess: boolean;
  isUpdateChannelSuccess: boolean;
  isRemoveChannelSuccess: boolean;
  isCreateEventSuccess: boolean;
  isLoading: boolean;
  hasError: boolean;
  error: any;
}
