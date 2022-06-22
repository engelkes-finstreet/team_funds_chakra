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
import { ConfirmType } from "~/utils/mail/types";
import { Styles } from "./Styles";

export function confirmMail({ confirmLink }: ConfirmType) {
  const { html } = render(
    <Mjml>
      <MjmlHead>
        <MjmlPreview>Bestätige deinen Account für TeamFunds</MjmlPreview>
        <Styles />
      </MjmlHead>
      <MjmlBody mjClass={"body"}>
        <MjmlSection>
          <MjmlColumn>
            <MjmlImage
              width={"150px"}
              src="https://ik.imagekit.io/skiclubteamfunds/Logo_Neu_CGkd32YtE.png?ik-sdk-version=javascript-1.4.3&updatedAt=1651676798778"
            />
          </MjmlColumn>
        </MjmlSection>
        <MjmlSection>
          <MjmlColumn>
            <MjmlText mjClass={"heading"}>
              Herzlich Willkommen bei der Mannschaftskasse des Ski Club Rheine
            </MjmlText>
            <MjmlText mjClass={"text"} paddingBottom={"16px"}>
              Du bist nur noch einen Schritt von der Nutzung der
              Mannschaftskasse entfernt. Klicke auf untenstehenden Link um
              deinen Account zu bestätigen
            </MjmlText>
            <MjmlButton mjClass={"button"} href={confirmLink}>
              Account bestätigen
            </MjmlButton>
          </MjmlColumn>
        </MjmlSection>
      </MjmlBody>
    </Mjml>,
    { validationLevel: "soft" }
  );
  return html;
}
