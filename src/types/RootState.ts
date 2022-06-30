import { AuthSliceState } from 'app/pages/Auth/slice/types';
import { DashboardState } from 'app/pages/Dashboard/slice/types';
import { RoomState } from 'app/pages/Room/slice/types';
import { CalendarState } from 'app/pages/Calendar/slice/types';
import { AppState } from 'app/slice/types';
// [IMPORT NEW CONTAINERSTATE ABOVE] < Needed for generating containers seamlessly

/* 
  Because the redux-injectors injects your reducers asynchronously somewhere in your code
  You have to declare them here manually
*/

export interface RootState {
  authSlice?: AuthSliceState;
  dashboard?: DashboardState;
  room?: RoomState;
  calendar?: CalendarState;
  app?: AppState;
  // [INSERT NEW REDUCER KEY ABOVE] < Needed for generating containers seamlessly
}
