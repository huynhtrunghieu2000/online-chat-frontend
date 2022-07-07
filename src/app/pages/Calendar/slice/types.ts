/* --- STATE --- */
export interface CalendarState {
  events: any;
  eventDetail: any;
  isLoading: boolean;
  isProcessing: boolean;
  hasError: boolean;
  error: any;
  isCreatedSuccess: boolean;
  isUpdatedSuccess: boolean;
  isDeletedSuccess: boolean;
}
