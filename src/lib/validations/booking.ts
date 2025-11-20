import { z } from "zod";

export const configurationSchema = z.object({
  citizenship: z.string().min(1, "Citizenship is required"),
  startDate: z.string().min(1, "Start date is required").refine(
    (date) => new Date(date) >= new Date(new Date().setHours(0, 0, 0, 0)),
    "Start date cannot be in the past"
  ),
  numDays: z.number().min(1, "At least 1 day").max(30, "Maximum 30 days"),
  destination: z.string().min(1, "Destination is required"),
  boardType: z.enum(["NB", "HB", "FB"]),
});

export type ConfigurationFormData = z.infer<typeof configurationSchema>;