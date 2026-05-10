import { getSessions } from "./getSessions";
import { revokeSession } from "./revokeSession";
import { revokeOtherSessions } from "./revokeOtherSessions";

export const sessionsApi = {
  getSessions,
  revokeSession,
  revokeOtherSessions,
};
