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
  | "confirm.mjml"
  | "confirm-password-reset.mjml"
  | "request-reset-password.mjml";
