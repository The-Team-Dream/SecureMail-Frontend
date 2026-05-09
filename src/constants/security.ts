export const RISK_LEVELS = {
  HIGH: "High",
  MEDIUM: "Medium",
  LOW: "Low",
  HIGH_RISK: "High Risk",
  CREDENTIAL_THEFT: "Credential Theft",
  SCAM_ALERT: "Scam Alert",
  SUSPICIOUS_LINK: "Suspicious Link",
} as const;

export const RISK_STYLE_MAP = {
  [RISK_LEVELS.HIGH]: "text-error-500",
  [RISK_LEVELS.MEDIUM]: "text-warning-500 ",
  [RISK_LEVELS.LOW]: "text-secondary-500",
  [RISK_LEVELS.HIGH_RISK]: "text-red-500 ",
  [RISK_LEVELS.CREDENTIAL_THEFT]: "text-error-500 ",
  [RISK_LEVELS.SCAM_ALERT]: "text-warning-500 ",
  [RISK_LEVELS.SUSPICIOUS_LINK]: "text-info-500",
};

export type RiskLevel = (typeof RISK_LEVELS)[keyof typeof RISK_LEVELS];
