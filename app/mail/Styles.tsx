import { MjmlAttributes, MjmlClass } from "mjml-react";
import React from "react";

export function Styles() {
  return (
    <MjmlAttributes>
      <MjmlClass
        name={"heading"}
        color="#EDF2F7"
        font-size="24px"
        line-height="1.2"
        font-weight="bold"
        padding-bottom="16px"
        align="center"
      />
      <MjmlClass
        name={"text"}
        color="#EDF2F7"
        line-height="1.2"
        font-size="16px"
      />
      <MjmlClass name={"button"} inner-padding="10px" width="200px" />
      <MjmlClass name={"body"} backgroundColor={"#1A202C"} />
    </MjmlAttributes>
  );
}
