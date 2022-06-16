import {Form, redirect} from "remix";
import {Alert, AlertIcon, Divider, Flex, Heading, Text} from "@chakra-ui/react";
import {AuthContainer} from "~/components/auth/AuthContainer";
import {Logo} from "~/components/auth/Logo";
import {Card, CardContent} from "~/components/auth/Card";
import {Button} from "~/components/chakra/Button";
import React from "react";
import {DataFunctionArgs} from "@remix-run/server-runtime";
import {requireAndReturnAdminUser} from "~/utils/auth/session-utils.server";

export let loader = async ({ request, params }: DataFunctionArgs) => {
    const admin = await requireAndReturnAdminUser({request})
    if (admin.isApproved) {
        return redirect('/admin')
    }

    return null
}

export default function ConfirmRoute() {
    return (
        <AuthContainer>
            <Logo mx="auto" h="8" mb={{ base: "10", md: "20" }} />
            <Card>
                <CardContent>
                    <Heading mb={4} size={"md"}>
                        Dein Account wurde noch nicht bestätigt
                    </Heading>
                    <Text>
                        Wende dich an einen Administrator damit er deinen Account bestätigen kann. Vorher
                        kannst du dich nicht im Admin-Bereich einloggen
                    </Text>
                </CardContent>
                <Divider />
            </Card>
            <Flex justifyContent={"center"} mt={2}>
                <Form method={"post"} action={"/logout"}>
                    <Button variant={"ghost"} type={"submit"}>
                        Logout
                    </Button>
                </Form>
            </Flex>
        </AuthContainer>
    );
}