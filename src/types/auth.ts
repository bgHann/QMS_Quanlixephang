export interface LoginFormValues {
  username: string;
  password: string;
}
export interface ForgotPasswordFormValues {
  email: string;
}
export interface LoginResponse {
  accessToken: string;
  refreshToken: string;
  user: {
    id: string;
    username: string;
    email: string;
    role: string;
  };
}
export interface ForgotPasswordResponse {
  message: string;
  status: string;
}
