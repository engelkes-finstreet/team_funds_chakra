import { Button as ChakraButton, ButtonProps } from "@chakra-ui/react";

export enum ButtonType {
  NORMAL,
  DELETE,
}

type Props = { buttonType?: ButtonType } & Omit<ButtonProps, "colorScheme">;
export const Button = ({ buttonType = ButtonType.NORMAL, ...rest }: Props) => {
  let colorScheme = "";
  switch (buttonType) {
    case ButtonType.NORMAL:
      colorScheme = "blue";
      break;
    case ButtonType.DELETE:
      colorScheme = "red";
      break;
  }

  return <ChakraButton colorScheme={colorScheme} {...rest} />;
};
