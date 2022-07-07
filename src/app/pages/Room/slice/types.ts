/* --- STATE --- */
export interface RoomState {
  roomList: any;
  roomDetail: any;
  channelDetail: any;
  messages: any[];
  currentMeeting: any;
  socketCondition: any;
  isJoinRoomSuccess: boolean;
  isCreateRoomSuccess: boolean;
  isCreateChannelSuccess: boolean;
  isInviteUserSuccess: boolean;
  isUpdateRoomDetailSuccess: boolean;
  isLeaveRoomSuccess: boolean;
  isDeleteRoomSuccess: boolean;
  isRemoveMemberSuccess: boolean;
  isUpdateRoleMemberSuccess: boolean;
  isUpdateChannelSuccess: boolean;
  isRemoveChannelSuccess: boolean;
  isCreateEventSuccess: boolean;
  isUpdateEventSuccess: boolean;
  isLoading: boolean;
  hasError: boolean;
  error: any;
}
