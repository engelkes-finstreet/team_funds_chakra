import { useFetcher } from "remix";
import { Flex, IconButton, Td } from "@chakra-ui/react";
import { ValidatedForm } from "remix-validated-form";
import { TextField } from "~/components/form/TextField";
import { deletePlayerValidator } from "~/utils/validations/playerValidations";
import { HiX } from "react-icons/hi";

export function DeletePlayer({ playerId }: { playerId: string }) {
  const fetcher = useFetcher();
  const isDeleting = fetcher.submission?.formData.get("_playerId") === playerId;

  return (
    <Td hidden={isDeleting} w={"20%"}>
      <ValidatedForm
        validator={deletePlayerValidator}
        method={"post"}
        defaultValues={{
          _method: "delete",
          _playerId: playerId,
        }}
      >
        <Flex justifyContent={"flex-start"}>
          <TextField hidden={true} name={"_method"} />
          <TextField hidden={true} name={"_playerId"} />
          <IconButton
            type={"submit"}
            aria-label={"Spieler löschen"}
            colorScheme={"red"}
            icon={<HiX />}
          >
            Löschen
          </IconButton>
        </Flex>
      </ValidatedForm>
    </Td>
  );
}
