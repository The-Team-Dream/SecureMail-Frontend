import { getMailboxes } from "./getMailboxes";
import { getMailboxById } from "./getMailboxById";
import { getMailboxReports } from "./getMailboxReports";
import { updateMailbox } from "./updateMailbox";
import { deleteMailbox } from "./deleteMailbox";
import { syncMailbox } from "./syncMailbox";
import { connectImap } from "./connectImap";
import { getGmailAuthUrl } from "./getGmailAuthUrl";
import { connectGmail } from "./connectGmail";
import { getOutlookAuthUrl } from "./getOutlookAuthUrl";
import { connectOutlook } from "./connectOutlook";

export const mailboxApi = {
  getMailboxes,
  getMailboxById,
  getMailboxReports,
  updateMailbox,
  deleteMailbox,
  syncMailbox,
  connectImap,
  getGmailAuthUrl,
  connectGmail,
  getOutlookAuthUrl,
  connectOutlook,
};
