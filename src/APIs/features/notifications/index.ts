import { getNotifications } from "./getNotifications";
import { getUnreadCount } from "./getUnreadCount";
import { readAllNotifications } from "./readAllNotifications";
import { readOneNotification } from "./readOneNotification";
import { deleteNotification } from "./deleteNotification";

export const notificationsApi = {
  getNotifications,
  getUnreadCount,
  readAllNotifications,
  readOneNotification,
  deleteNotification,
};
