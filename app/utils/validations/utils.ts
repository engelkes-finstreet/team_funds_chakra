import * as z from "zod";

export function stringToNumberValidation(nonEmptyMessage: string) {
  return z
    .string()
    .nonempty(nonEmptyMessage)
    .refine((value) => !isNaN(Number(value)), {
      message: "Es dürfen nur Zahlen eingegeben werden",
    })
    .transform((value) => Number(value));
}

export function checkbox() {
  return z.any().transform((value) => value !== undefined);
}
