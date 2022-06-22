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
import { RequestResetPasswordType } from "~/utils/mail/types";

export function requestResetPassword({
  name,
  requestResetPasswordLink,
}: RequestResetPasswordType) {
  const { html } = render(
    <Mjml>
      <MjmlHead>
        <MjmlPreview>Setze dein Passwort bei TeamFunds zurück</MjmlPreview>
        <Styles />
      </MjmlHead>
      <MjmlBody mjClass={"body"}>
        <MailLogo />
        <MjmlSection>
          <MjmlColumn>
            <MjmlText mjClass={"heading"}>
              Instruktionen zum Passwort zurücksetzen
            </MjmlText>
            <MjmlText mjClass={"text"}>Hey {name},</MjmlText>
            <MjmlText mjClass={"text"}>
              eine Anfrage für ein Passwort-Reset wurde für deinen TeamFunds
              Account gestellt. Falls du diese Anfrage nicht gestellt hast,
              kannst du diese E-Mail ignorieren. Dein Passwort wird nicht
              geändert und dein Account ist weiterhin sicher.
            </MjmlText>
            <MjmlText mjClass={"text"}>
              Um dein Passwort zurückzusetzen klicke auf den untenstehenden
              Button. Du wirst dann gefragt ein neues Passwort deiner Wahl zu
              vergeben
            </MjmlText>
            <MjmlButton mjClass={"button"} href={requestResetPasswordLink}>
              Passwort zurücksetzen
            </MjmlButton>
          </MjmlColumn>
        </MjmlSection>
      </MjmlBody>
    </Mjml>,
    { validationLevel: "soft" }
  );

  return html;
}
