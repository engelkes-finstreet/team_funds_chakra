import {
  render,
  Mjml,
  MjmlHead,
  MjmlTitle,
  MjmlPreview,
  MjmlBody,
  MjmlSection,
  MjmlColumn,
  MjmlButton,
  MjmlImage,
  MjmlAttributes,
  MjmlClass,
  MjmlText,
} from "mjml-react";
import React from "react";
import { Styles } from "./Styles";
import { MailLogo } from "./MailLogo";
import { ConfirmPasswordResetType } from "~/utils/mail/types";

export function confirmPasswordReset({
  name,
  loginLink,
}: ConfirmPasswordResetType) {
  const { html } = render(
    <Mjml>
      <MjmlHead>
        <MjmlPreview>Dein Passwort wurde erfolgreich zurückgesetzt</MjmlPreview>
        <Styles />
      </MjmlHead>
      <MjmlBody mjClass={"body"}>
        <MailLogo />
        <MjmlSection>
          <MjmlColumn>
            <MjmlText mjClass={"heading"}>
              Passwort erfolgreich zurückgesetzt
            </MjmlText>
            <MjmlText mjClass={"text"}>Hey {name},</MjmlText>
            <MjmlText mjClass={"text"}>
              dein Passwort wurde zurückgesetzt. Du kannst dich nun wie gewohnt
              einloggen!
            </MjmlText>
            <MjmlButton mjClass={"button"} href={loginLink}>
              Login
            </MjmlButton>
          </MjmlColumn>
        </MjmlSection>
      </MjmlBody>
    </Mjml>,
    { validationLevel: "soft" }
  );
  return html;
}
