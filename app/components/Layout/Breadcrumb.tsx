import { Link, useLocation, useMatches } from "remix";
import {
  Breadcrumb as ChakraBreadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
} from "@chakra-ui/react";
import { BiChevronRight } from "react-icons/bi";

export function Breadcrumb() {
  const matches = useMatches();
  const { pathname } = useLocation();

  return (
    <ChakraBreadcrumb spacing={2} separator={<BiChevronRight />}>
      {matches
        .filter((match) => match.handle && match.handle.breadcrumb)
        .map((match, index) => {
          const breadcrumb = match.handle.breadcrumb(match.data);
          const isActive = pathname === match.pathname;
          return (
            <BreadcrumbItem key={index}>
              <BreadcrumbLink
                as={Link}
                to={match.pathname}
                fontWeight={isActive ? "bold" : "inherit"}
              >
                {breadcrumb}
              </BreadcrumbLink>
            </BreadcrumbItem>
          );
        })}
    </ChakraBreadcrumb>
  );
}
