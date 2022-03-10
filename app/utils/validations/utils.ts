import * as z from "zod";

export function stringToNumberValidationAndTransformation(
  nonEmptyMessage: string,
  refineFunction?: (value: number) => boolean
) {
  return z
    .string()
    .nonempty(nonEmptyMessage)
    .refine(
      (value) => {
        const isNumber = !isNaN(Number(value));
        if (refineFunction && isNumber) {
          return refineFunction(Number(value));
        }

        return isNumber;
      },
      {
        message: "Es dürfen nur Zahlen eingegeben werden",
      }
    )
    .transform((value) => Number(value));
}

export function stringToNumberValidation(nonEmptyMessage: string) {
  return z
    .string()
    .nonempty(nonEmptyMessage)
    .refine((value) => !isNaN(Number(value)), {
      message: "Es dürfen nur Zahlen eingegeben werden",
    });
}

export function checkbox() {
  return z.any().transform((value) => value !== undefined);
}
