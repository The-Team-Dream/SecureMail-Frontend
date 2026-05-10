import { getSettings } from "./getSettings";
import { updateProfile } from "./updateProfile";
import { changePassword } from "./changePassword";
import { updateTheme } from "./updateTheme";
import { updateNotifications } from "./updateNotifications";
import { setup2FA } from "./setup2FA";
import { enable2FA } from "./enable2FA";
import { disable2FA } from "./disable2FA";

export const settingsApi = {
  getSettings,
  updateProfile,
  changePassword,
  updateTheme,
  updateNotifications,
  setup2FA,
  enable2FA,
  disable2FA,
};
