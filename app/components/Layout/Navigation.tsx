import { Flex, Stack } from "@chakra-ui/react";
import { ScrollArea } from "~/components/Layout/ScrollArea";
import * as React from "react";
import { Form } from "remix";
import { Button } from "../chakra/Button";

type Props = {
  children: React.ReactNode;
};

export function Navigation({ children }: Props) {
  return (
    <ScrollArea pt="5" pb="6">
      <Flex
        flexDirection={"column"}
        justifyContent={"space-between"}
        h={"full"}
      >
        <Stack pb="6">{children}</Stack>
        <Form method={"post"} action={"/logout"}>
          <Button variant={"outline"} type={"submit"} isFullWidth={true}>
            Logout
          </Button>
        </Form>
      </Flex>
    </ScrollArea>
  );
}
