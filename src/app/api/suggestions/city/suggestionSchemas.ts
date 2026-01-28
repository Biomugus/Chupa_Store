import { z } from 'zod';

export const DadataSuggestionSchema = z.object({
  value: z.string(),
  data: z.object({
    city: z.string().nullable().optional(),
    settlement: z.string().nullable().optional(),
    region_with_type: z.string(),
  }),
});

export const DadataResponseSchema = z.object({
  suggestions: z.array(DadataSuggestionSchema),
});

export type DadataResponse = z.infer<typeof DadataResponseSchema>;
export type DadataSuggestion = z.infer<typeof DadataSuggestionSchema>;
