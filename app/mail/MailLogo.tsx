import { MjmlColumn, MjmlImage, MjmlSection } from "mjml-react";
import React from "react";

export function MailLogo() {
  return (
    <MjmlSection>
      <MjmlColumn>
        <MjmlImage
          width={"150px"}
          src={
            "https://ik.imagekit.io/skiclubteamfunds/Logo_Neu_CGkd32YtE.png?ik-sdk-version=javascript-1.4.3&updatedAt=1651676798778"
          }
        />
      </MjmlColumn>
    </MjmlSection>
  );
}
