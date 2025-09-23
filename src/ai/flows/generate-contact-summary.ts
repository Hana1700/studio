'use server';

/**
 * @fileOverview Contact summary generator.
 *
 * - generateContactSummary - A function that generates a contact summary.
 * - GenerateContactSummaryInput - The input type for the generateContactSummary function.
 * - GenerateContactSummaryOutput - The return type for the generateContactSummary function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateContactSummaryInputSchema = z.object({
  query: z.string().describe('The query to use to generate the contact summary.'),
});
export type GenerateContactSummaryInput = z.infer<typeof GenerateContactSummaryInputSchema>;

const GenerateContactSummaryOutputSchema = z.object({
  summary: z.string().describe('The generated contact summary.'),
});
export type GenerateContactSummaryOutput = z.infer<typeof GenerateContactSummaryOutputSchema>;

export async function generateContactSummary(input: GenerateContactSummaryInput): Promise<GenerateContactSummaryOutput> {
  return generateContactSummaryFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateContactSummaryPrompt',
  input: {schema: GenerateContactSummaryInputSchema},
  output: {schema: GenerateContactSummaryOutputSchema},
  prompt: `You are an AI assistant that generates contact summaries based on a query.

  Query: {{{query}}}

  Generate a short paragraph summarizing relevant contact information, including direct reports and peers.
  `,
});

const generateContactSummaryFlow = ai.defineFlow(
  {
    name: 'generateContactSummaryFlow',
    inputSchema: GenerateContactSummaryInputSchema,
    outputSchema: GenerateContactSummaryOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
