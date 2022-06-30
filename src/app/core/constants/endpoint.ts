export const API_ENDPOINT = {
  user: {
    index: '/user',
    me: '/user/me',
    login: '/user/login',
    signup: '/user/signup',
    signupVerify: '/user/signup/verify',
    updateProfile: '/user/update_profile',
    changePassword: '/user/change_password',
    forgotPassword: '/user/forgot_password',
    forgotPasswordVerify: '/user/forgot_password/verify/:token',
    resetPassword: '/user/reset_password',
    notification: '/user/notification',
  },
  room: {
    index: '/classrooms',
  },
  channel: {
    index: '/channels',
  },
  event: {
    index: '/events',
  },
};
