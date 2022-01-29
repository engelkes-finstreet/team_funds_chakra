import { Link as RemixLink, LinkProps as RemixLinkProps } from "remix";
import { chakra, LinkProps } from "@chakra-ui/react";

const LinkFactory = chakra(RemixLink);

type Props = {} & RemixLinkProps & LinkProps;

export function Link({ to, children, ...rest }: Props) {
  return (
    <LinkFactory to={to} color={"blue.200"} {...rest}>
      {children}
    </LinkFactory>
  );
}
