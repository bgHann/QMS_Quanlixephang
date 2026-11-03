import api from "./api";
import {
  ForgotPasswordFormValues,
  LoginFormValues,
  LoginResponse,
} from "../types/auth";

export const login = async (data: LoginFormValues) => {
  return api.post<LoginResponse>("/auth/login", data);
};
//quên mk
export const forgotPassword = async (data: ForgotPasswordFormValues) => {
  return api.post("/auth/forgot-password", data);
};
