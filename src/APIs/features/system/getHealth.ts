import axiosInstance from "@/lib/axios";
import { SystemHealth } from "../../types/System";
import { unwrap } from "../utils";

export const getHealth = async (): Promise<SystemHealth> => {
  const res = await axiosInstance.get<SystemHealth>("/health");
  return unwrap(res);
};
