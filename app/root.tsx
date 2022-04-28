import {
  json,
  Links,
  LiveReload,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
  useCatch,
  useLoaderData,
} from "remix";
import type { MetaFunction } from "remix";
import React, { useEffect } from "react";
import {
  AlertStatus,
  Box,
  ChakraProvider,
  Divider,
  Heading,
  Text,
  useToast,
} from "@chakra-ui/react";
import { withEmotionCache } from "@emotion/react";
import ServerStyleContext from "~/chakra/context.server";
import ClientStyleContext from "./chakra/context.client";
import { theme } from "./chakra/theme";
import { DataFunctionArgs } from "@remix-run/server-runtime";
import { getFlashContent } from "~/utils/flashMessage.server";
import { TFHandle } from "~/utils/types/handle.types";
import { HiHome } from "react-icons/hi";
import { PayPalScriptProvider } from "@paypal/react-paypal-js";

export const handle: TFHandle<any> = {
  breadcrumb: (match) => {
    return "Home";
  },
};

export const meta: MetaFunction = () => {
  return { title: "Mannschaftskasse SkiClub" };
};

export let loader = async ({ request, params }: DataFunctionArgs) => {
  const { title, description, status, header } = await getFlashContent(request);

  return json({ title, description, status }, header);
};

export function ErrorBoundary({ error }: { error: Error }) {
  return (
    <Document title="Error!">
      <Box>
        <Heading as="h1">There was an error</Heading>
        <Text>{error.message}</Text>
        <Divider />
        <Text>
          Hey, developer, you should replace this with what you want your users
          to see.
        </Text>
      </Box>
    </Document>
  );
}

export function CatchBoundary() {
  let caught = useCatch();

  let message;
  switch (caught.status) {
    case 401:
      message = (
        <Text>
          Oops! Looks like you tried to visit a page that you do not have access
          to.
        </Text>
      );
      break;
    case 404:
      message = (
        <Text>
          Oops! Looks like you tried to visit a page that does not exist.
        </Text>
      );
      break;

    default:
      throw new Error(caught.data || caught.statusText);
  }

  return (
    <Document title={`${caught.status} - ${caught.statusText}`}>
      <Heading as="h1">
        {caught.status}: {caught.statusText}
      </Heading>
      {message}
    </Document>
  );
}

interface DocumentProps {
  children: React.ReactNode;
  title?: string;
}

const Document = withEmotionCache(
  ({ children, title }: DocumentProps, emotionCache) => {
    const serverSyleData = React.useContext(ServerStyleContext);
    const clientStyleData = React.useContext(ClientStyleContext);
    const data = useLoaderData();

    // Only executed on client
    React.useEffect(() => {
      // re-link sheet container
      emotionCache.sheet.container = document.head;
      // re-inject tags
      const tags = emotionCache.sheet.tags;
      emotionCache.sheet.flush();
      tags.forEach((tag) => {
        (emotionCache.sheet as any)._insertTag(tag);
      });
      // reset cache to reapply global styles
      clientStyleData.reset();
    }, []);

    return (
      <html lang="en">
        <head>
          <meta charSet="utf-8" />
          <meta name="viewport" content="width=device-width,initial-scale=1" />
          {title ? <title>{title}</title> : null}
          <Meta />
          <Links />
          {serverSyleData?.map(({ key, ids, css }) => (
            <style
              key={key}
              data-emotion={`${key} ${ids.join(" ")}`}
              // eslint-disable-next-line react/no-danger
              dangerouslySetInnerHTML={{ __html: css }}
            />
          ))}
        </head>
        <body>
          <ChakraProvider theme={theme}>
            <PayPalScriptProvider
              options={{
                "client-id":
                  "AaqrYkBySj6rJHhqnfaJ7asP0JrZ-MNTri-dPQbk_zCFy8an0eBisZjiIoruYwAjebOukzmX8CS2tUQD",
                currency: "EUR",
              }}
            >
              <Toast
                title={data?.title}
                description={data?.description}
                status={data?.status}
              />
              {children}
            </PayPalScriptProvider>
          </ChakraProvider>
          <ScrollRestoration />
          <Scripts />
          {process.env.NODE_ENV === "development" && <LiveReload />}
        </body>
      </html>
    );
  }
);

type ToastProps = {
  title: string | null;
  description: string | null;
  status: AlertStatus | null;
};

function Toast({ title, description, status }: ToastProps) {
  const toast = useToast();

  useEffect(() => {
    if (title && status) {
      toast({
        title,
        description,
        status,
        duration: 5000,
        isClosable: true,
        position: "top",
      });
    }
  }, [title, description, status]);

  return null;
}

export default function App() {
  return (
    <Document>
      <Outlet />
    </Document>
  );
}
