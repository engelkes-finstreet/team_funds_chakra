import * as React from "react";
import { UserInfoButton } from "~/components/Layout/UserInfoButton";

type Props = {
  email: string;
};

export const UserInfo = ({ email }: Props) => {
  return <UserInfoButton email={email} />;
};
