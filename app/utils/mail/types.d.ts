export type ConfirmType = {
  confirmLink: string;
};

export type ConfirmPasswordResetType = {};

export type RequestResetPasswordType = {
  requestResetPasswordLink: string;
};

export type MailTemplates =
  | "confirm.html"
  | "confirm-password-reset.html"
  | "request-reset-password.html";
