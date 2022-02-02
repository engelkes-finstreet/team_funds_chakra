import { useFetcher } from "remix";
import { Button, Td } from "@chakra-ui/react";
import { ValidatedForm } from "remix-validated-form";
import { TextField } from "~/components/form/TextField";
import { deletePlayerValidator } from "~/routes/admin/players";

export function DeletePlayer({ playerId }: { playerId: string }) {
  const fetcher = useFetcher();
  const isDeleting = fetcher.submission?.formData.get("_playerId") === playerId;

  return (
    <Td hidden={isDeleting}>
      <ValidatedForm
        validator={deletePlayerValidator}
        method={"post"}
        defaultValues={{
          _method: "delete",
          _playerId: playerId,
        }}
      >
        <TextField hidden={true} name={"_method"} />
        <TextField hidden={true} name={"_playerId"} />
        <Button type={"submit"} colorScheme={"red"}>
          Löschen
        </Button>
      </ValidatedForm>
    </Td>
  );
}
