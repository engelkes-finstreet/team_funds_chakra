import { Link, useLocation } from "remix";
import { useEffect, useState } from "react";
import { seasonTransformer } from "~/breadcrumbs/seasonTransformer";
import { BreadcrumbTransformer } from "../../breadcrumbs";
import {
  Breadcrumb as ChakraBreadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
} from "@chakra-ui/react";
import { BiChevronRight } from "react-icons/bi";
import { playerTransformer } from "~/breadcrumbs/playerTransformer";
import { userTransformer } from "~/breadcrumbs/userTransformer";
import { punishmentTransformer } from "~/breadcrumbs/punishmentTransformer";
import { paymentTransformer } from "~/breadcrumbs/paymentTransformer";
import { playerPunishmentTransformer } from "~/breadcrumbs/playerPunishmentTransformer";

export function Breadcrumb() {
  const breadcrumbs = useBreadcrumb();
  const { pathname } = useLocation();

  return (
    <ChakraBreadcrumb spacing={2} separator={<BiChevronRight />}>
      {breadcrumbs.map((breadcrumb) => {
        const isActive = pathname === breadcrumb.href;

        return (
          <BreadcrumbItem key={breadcrumb.href}>
            <BreadcrumbLink
              as={Link}
              to={breadcrumb.href}
              fontWeight={isActive ? "bold" : "inherit"}
            >
              {breadcrumb.name}
            </BreadcrumbLink>
          </BreadcrumbItem>
        );
      })}
    </ChakraBreadcrumb>
  );
}

export type BreadcrumbType = {
  name: string;
  href: string;
};

const indexTransformer: Array<BreadcrumbTransformer> = [
  {
    transform: () => ({
      name: "Home",
    }),
  },
];

const transformers: { [key: string]: Array<BreadcrumbTransformer> } = {
  seasons: seasonTransformer,
  players: playerTransformer,
  users: userTransformer,
  punishments: punishmentTransformer,
  payments: paymentTransformer,
  "player-punishments": playerPunishmentTransformer,
};

function useBreadcrumb() {
  const [breadcrumbs, setBreadcrumbs] = useState<Array<BreadcrumbType>>([]);
  const { pathname } = useLocation();

  useEffect(() => {
    const breadcrumbs: Array<BreadcrumbType> = [];
    const locations = pathname.split("/").filter((location) => location !== "");

    if (locations.indexOf("admin") === -1) {
      locations.unshift("/");
    }

    const transformer = getTransformer(locations);

    locations.forEach((path, index) => {
      const transform = transformer[index]?.transform(path);
      if (transform) {
        const name = decodeURIComponent(transform.name);
        let href = locations.slice(0, index + 1).join("/");
        href = href.length > 0 ? `/${href}` : "/";

        breadcrumbs.push({ name, href });
      }
    });

    setBreadcrumbs(breadcrumbs);
  }, [pathname]);

  return breadcrumbs;
}

function getTransformer(paths: Array<string>): Array<BreadcrumbTransformer> {
  if (paths.length > 1) {
    const additionalTransformers = transformers[paths[1]];
    if (additionalTransformers) {
      return [...indexTransformer, ...transformers[paths[1]]];
    }

    return [...indexTransformer];
  }

  return [...indexTransformer];
}
