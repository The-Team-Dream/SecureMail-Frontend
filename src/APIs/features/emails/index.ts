import { getEmails } from "./getEmails";
import { deleteEmail } from "./deleteEmail";
import { searchEmails } from "./searchEmails";
import { getEmailDetails } from "./getEmailDetails";
import { markAsRead } from "./markAsRead";
import { starEmail } from "./starEmail";
import { reportEmail } from "./reportEmail";
import { reclassify } from "./reclassify";
import { sendEmail } from "./sendEmail";
import { replyEmail } from "./replyEmail";
import { forwardEmail } from "./forwardEmail";
import { downloadAttachment } from "./downloadAttachment";
import { scanEmail } from "./scanEmail";
import { scanAllEmails } from "./scanAllEmails";
import { getScanProgress } from "./getScanProgress";
import { getQueueStatus, controlQueue, cancelScanJob } from "./scanQueue";

export const emailsApi = {
  getEmails,
  deleteEmail,
  searchEmails,
  getEmailDetails,
  markAsRead,
  starEmail,
  reportEmail,
  reclassify,
  sendEmail,
  replyEmail,
  forwardEmail,
  downloadAttachment,
  scanEmail,
  scanAllEmails,
  getScanProgress,
  getQueueStatus,
  controlQueue,
  cancelScanJob,
};
