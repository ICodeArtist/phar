const api = {
  Login: '/phar/login',
  Logout: '/auth/logout',
  ForgePassword: '/auth/forge-password',
  Register: '/auth/register',
  twoStepCode: '/auth/2step-code',
  SendSms: '/index/buildCode',
  RegPhar: '/phar/register',
  Recover: '/phar/recover',
  SendSmsErr: '/account/sms_err',
  // get my info
  UserInfo: '/user/info'
}
export default api
