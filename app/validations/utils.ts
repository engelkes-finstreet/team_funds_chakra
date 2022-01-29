import * as z from "zod";

export function stringToNumberValidation(message: string) {
  return z
    .string()
    .refine((value) => !isNaN(Number(value)), {
      message,
    })
    .transform((value) => Number(value));
}
