'use server';

import {
  generateContactSummary,
  GenerateContactSummaryInput,
} from '@/ai/flows/generate-contact-summary';
import { z } from 'zod';

const inputSchema = z.object({
  query: z.string().min(3, 'La requête doit contenir au moins 3 caractères.'),
});

export async function handleGenerateSummary(input: GenerateContactSummaryInput) {
  const validatedInput = inputSchema.safeParse(input);

  if (!validatedInput.success) {
    return {
      summary: '',
      error: validatedInput.error.errors.map((e) => e.message).join(' '),
    };
  }

  try {
    const result = await generateContactSummary(validatedInput.data);
    return { summary: result.summary, error: null };
  } catch (error) {
    console.error('Error generating summary:', error);
    return {
      summary: '',
      error: "Une erreur s'est produite lors de la génération du résumé.",
    };
  }
}
