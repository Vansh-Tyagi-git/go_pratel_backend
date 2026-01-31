import { z } from "zod";

const eventSchema = z.object({
  name: z.string().min(1),
  type: z.string().min(1),
  dateType: z.enum(["single", "range"]),
  date: z.string().optional(),
  startDate: z.string().optional(),
  endDate: z.string().optional(),
  location: z.string().min(1),
  venue: z.string().optional()
}).superRefine((val, ctx) => {
  if (val.dateType === "single" && !val.date) {
    ctx.addIssue({ code: "custom", message: "date is required for single date", path: ["date"] });
  }
  if (val.dateType === "range" && (!val.startDate || !val.endDate)) {
    ctx.addIssue({ code: "custom", message: "startDate and endDate required for range", path: ["startDate"] });
  }
});

const plannerDetails = z.object({
  planningLevel: z.enum(["full", "partial", "day-of"]),
  guestsCount: z.number().int().min(1),
  budgetRange: z.string().min(1)
});

const performerDetails = z.object({
  performerCategory: z.string().min(1),
  genreOrStyle: z.string().min(1),
  durationMinutes: z.number().int().min(15),
  budgetRange: z.string().min(1)
});

const crewDetails = z.object({
  crewCategory: z.string().min(1),
  crewCount: z.number().int().min(1),
  hoursNeeded: z.number().int().min(1),
  budgetRange: z.string().min(1)
});

export const requirementSchema = z.object({
  event: eventSchema,
  hireType: z.enum(["planner", "performer", "crew"]),
  details: z.any()
}).superRefine((val, ctx) => {
  if (val.hireType === "planner") {
    const r = plannerDetails.safeParse(val.details);
    if (!r.success) ctx.addIssue({ code: "custom", message: "Invalid planner details", path: ["details"] });
  }
  if (val.hireType === "performer") {
    const r = performerDetails.safeParse(val.details);
    if (!r.success) ctx.addIssue({ code: "custom", message: "Invalid performer details", path: ["details"] });
  }
  if (val.hireType === "crew") {
    const r = crewDetails.safeParse(val.details);
    if (!r.success) ctx.addIssue({ code: "custom", message: "Invalid crew details", path: ["details"] });
  }
});
