import axiosInstance from "@/lib/axios";
import {
  ChangePasswordPayload,
  ChangePasswordResponse,
} from "../../types/UserSettings";

export const changePassword = async (
  data: ChangePasswordPayload,
): Promise<ChangePasswordResponse> => {
  const res = await axiosInstance.patch<ChangePasswordResponse>(
    "/user-settings/password",
    data,
  );
  return res.data;
};
