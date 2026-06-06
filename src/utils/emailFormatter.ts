import { format } from "date-fns";

export interface EmailMeta {
  subject?: string;
  fromName?: string;
  fromAddr?: string;
  receivedAt?: string;
  toAddr?: string[];
  bodyHtml?: string;
}

export const getForwardHeader = (meta: EmailMeta): string => {
  const dateStr = meta.receivedAt
    ? format(new Date(meta.receivedAt), "PPPP 'at' p")
    : "";
  const fromName = meta.fromName || "";
  const fromAddr = meta.fromAddr || "";
  const subject = meta.subject || "";
  const toStr = meta.toAddr?.join(", ") || "";

  return `
    <br>
    <div class="securemail_forward_header" style="font-family: Arial, sans-serif; font-size: 14px; color: #555; border-top: 1px solid #eee; padding-top: 15px; margin-top: 15px;">
      ---------- Forwarded message ---------<br>
      From: <b>${fromName}</b> &lt;${fromAddr}&gt;<br>
      Date: ${dateStr}<br>
      Subject: ${subject}<br>
      To: ${toStr}<br>
    </div>
    <br>
  `;
};

export const getReplyHeader = (meta: EmailMeta): string => {
  const dateStr = meta.receivedAt
    ? format(new Date(meta.receivedAt), "PPPP 'at' p")
    : "";
  const fromName = meta.fromName || "";
  const fromAddr = meta.fromAddr || "";

  return `
    <br>
    <div class="securemail_reply_header" style="font-family: Arial, sans-serif; font-size: 14px; color: #555; border-top: 1px solid #eee; padding-top: 15px; margin-top: 15px;">
      On ${dateStr}, <b>${fromName}</b> &lt;${fromAddr}&gt; wrote:<br>
    </div>
  `;
};

export const formatForwardEmail = (
  userMessage: string,
  originalHtml: string,
  meta: EmailMeta,
): string => {
  const containsHtml = /<[a-z][\s\S]*>/i.test(userMessage);
  const userHtml = containsHtml
    ? userMessage
    : `<p>${userMessage.replace(/\n/g, "<br/>")}</p>`;
  const header = getForwardHeader(meta);
  return `${userHtml}${header}<div class="gmail_quote">${originalHtml}</div>`;
};

export const formatReplyEmail = (
  userMessage: string,
  originalHtml: string,
  meta: EmailMeta,
): string => {
  const containsHtml = /<[a-z][\s\S]*>/i.test(userMessage);
  const userHtml = containsHtml
    ? userMessage
    : `<p>${userMessage.replace(/\n/g, "<br/>")}</p>`;
  const header = getReplyHeader(meta);
  return `${userHtml}${header}<blockquote class="gmail_quote" style="margin:0 0 0 .8ex;border-left:1px #ccc solid;padding-left:1ex">${originalHtml}</blockquote>`;
};
