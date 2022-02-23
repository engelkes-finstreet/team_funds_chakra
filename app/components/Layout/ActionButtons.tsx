import { useMatches } from "remix";

export function ActionButtons() {
  const matches = useMatches();

  return (
    <>
      {matches
        .filter((match) => match.handle && match.handle.actionButtons)
        .map((match, index) => {
          const actionButtons = match.handle.actionButtons(match.data);
          return <div key={index}>{actionButtons}</div>;
        })}
    </>
  );
}
