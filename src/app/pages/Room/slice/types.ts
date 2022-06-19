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
  isUpdateRoomDetailSuccess: boolean;
  isLeaveRoomSuccess: boolean;
  isRemoveMemberSuccess: boolean;
  isUpdateRoleMemberSuccess: boolean;
  isUpdateChannelSuccess: boolean;
  isRemoveChannelSuccess: boolean;
  isLoading: boolean;
  hasError: boolean;
  error: any;
}
