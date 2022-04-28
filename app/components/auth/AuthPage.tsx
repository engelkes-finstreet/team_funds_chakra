import { Logo } from "~/components/auth/Logo";
import React from "react";
import { Heading, Text } from "@chakra-ui/react";
import { Link } from "~/components/Link";
import { Card, CardContent } from "./Card";

type Props = {
  heading: string;
  subHeading: string;
  subHeadingLink: string;
  subHeadingText: string;
  children: React.ReactNode;
};

export function AuthPage({
  heading,
  subHeading,
  subHeadingLink,
  subHeadingText,
  children,
}: Props) {
  return (
    <>
      <AuthHeading>{heading}</AuthHeading>
      <Text mt="4" mb="8" align="center" maxW="md" fontWeight="medium">
        <Text as="span">{subHeading}</Text>
        <Link to={subHeadingLink}> {subHeadingText}</Link>
      </Text>
      <Card>
        <CardContent>{children}</CardContent>
      </Card>
    </>
  );
}

type AuthHeadingProps = {
  children: React.ReactNode;
};

export const AuthHeading = ({ children }: AuthHeadingProps) => {
  return (
    <Heading textAlign="center" size="xl" fontWeight="extrabold">
      {children}
    </Heading>
  );
};

type AuthTextProps = {
  children: React.ReactNode;
};

export const AuthText = ({ children }: AuthTextProps) => {
  return (
    <Text mt="4" mb="8" align="center" maxW="md" fontWeight="medium">
      {children}
    </Text>
  );
};
