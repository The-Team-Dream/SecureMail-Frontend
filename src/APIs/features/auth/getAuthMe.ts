import axiosInstance from "@/lib/axios";
import { AuthMe } from "../../types/auth";
import { unwrap } from "../utils";

export const getAuthMe = async (): Promise<AuthMe> => {
  const res = await axiosInstance.get<AuthMe>("/user/profile");
  return unwrap(res);
};
