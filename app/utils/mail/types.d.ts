export type ConfirmType = {
  confirmLink: string;
};

export type ConfirmPasswordResetType = {
  loginLink: string;
  name: string;
};

export type RequestResetPasswordType = {
  requestResetPasswordLink: string;
  name: string;
};

export type MailTemplates =
  | "confirm.html"
  | "confirm-password-reset.html"
  | "request-reset-password.html";
