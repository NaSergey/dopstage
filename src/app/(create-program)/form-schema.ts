import { z } from "zod";

export const basicInfoSchema = z.object({
  // Only letters, spaces and dashes; no digits
  name: z
    .string()
    .min(2, "Name is too short")
    .regex(/^[A-Za-z\s\-]+$/, "Letters only (no digits)"),
  // Only letters; no digits
  ticker: z
    .string()
    .min(1, "Ticker is required")
    .max(10, "Max 10 chars")
    .regex(/^[A-Za-z]+$/, "Letters only (no digits)"),
  description: z.string().max(500, "Max 500 chars").optional().or(z.literal("")),
  xHandle: z.string().optional().or(z.literal("")),
  website: z.string().optional().or(z.literal("")),
  telegram: z.string().optional().or(z.literal("")),
  logo: z.any().optional(),
  banner: z.any().optional(),
});

export const reviewSchema = z.object({
  rewardAllocation: z.number().min(0).max(100),
  campaignDays: z.number().min(0).max(90),
  devSupplyAllocation: z.number().min(0).max(100),
  boosters: z.object({
    newAuthor: z.boolean().default(false),
    consistency: z.boolean().default(false),
    frequency: z.boolean().default(false),
  }),
  filters: z.object({
    sentiment: z.boolean().default(false),
    soloMention: z.boolean().default(false),
    onlyMedia: z.boolean().default(false),
    verified: z.boolean().default(false),
  }),
});

export const createCampaignSchema = basicInfoSchema.merge(reviewSchema);

export type CreateCampaignFormValues = z.infer<typeof createCampaignSchema>;

export const defaultValues: CreateCampaignFormValues = {
  name: "",
  ticker: "",
  description: "",
  xHandle: "",
  website: "",
  telegram: "",
  logo: undefined,
  banner: undefined,
  rewardAllocation: 28,
  campaignDays: 14,
  devSupplyAllocation: 10,
  boosters: { newAuthor: false, consistency: false, frequency: false },
  filters: { sentiment: false, soloMention: false, onlyMedia: false, verified: false },
};


