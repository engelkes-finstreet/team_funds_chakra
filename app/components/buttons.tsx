import { AiOutlinePlus } from "react-icons/ai";
import { Link, LinkProps } from "remix";
import { IconButton, IconButtonProps } from "@chakra-ui/react";

type Props = Pick<LinkProps, "to"> &
  Omit<IconButtonProps, "size" | "colorScheme" | "as">;

export const IconLinkButton = ({ ...rest }: Props) => {
  return (
    <IconButton
      size={"sm"}
      colorScheme={"blue"}
      as={Link}
      prefetch={"intent"}
      {...rest}
    />
  );
};
