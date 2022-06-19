/* --- STATE --- */
export interface AuthSliceState {
  data: any;
  isLoading: boolean;
  isError: boolean;
  errorMessage: string;
  isUpdateProfileSuccess: boolean;
  isRegisterSuccess: boolean;
  isChangePasswordSuccess: boolean;
}
