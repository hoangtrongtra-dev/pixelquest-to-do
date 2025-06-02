'use server';

/**
 * @fileOverview AI agent that suggests similar tasks to the user.
 *
 * - suggestSimilarTasks - A function that suggests tasks similar to the user's current tasks.
 * - SuggestSimilarTasksInput - The input type for the suggestSimilarTasks function.
 * - SuggestSimilarTasksOutput - The return type for the suggestSimilarTasks function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const SuggestSimilarTasksInputSchema = z.object({
  tasks: z
    .array(z.string())
    .describe('The list of current tasks the user has.'),
});
export type SuggestSimilarTasksInput = z.infer<typeof SuggestSimilarTasksInputSchema>;

const SuggestSimilarTasksOutputSchema = z.object({
  suggestedTasks: z
    .array(z.string())
    .describe('A list of tasks that are similar to the current tasks.'),
});
export type SuggestSimilarTasksOutput = z.infer<typeof SuggestSimilarTasksOutputSchema>;

export async function suggestSimilarTasks(input: SuggestSimilarTasksInput): Promise<SuggestSimilarTasksOutput> {
  return suggestSimilarTasksFlow(input);
}

const prompt = ai.definePrompt({
  name: 'suggestSimilarTasksPrompt',
  input: {schema: SuggestSimilarTasksInputSchema},
  output: {schema: SuggestSimilarTasksOutputSchema},
  prompt: `You are a helpful AI assistant that suggests tasks similar to the user\'s current tasks.

  Here are the current tasks:
  {{#each tasks}}- {{{this}}}\n{{/each}}

  Suggest 5 more tasks that the user may have forgotten that are similar to the tasks above.
  Return the tasks as a list of strings.
  Do not return any explanation, just the list of tasks.
  `,
});

const suggestSimilarTasksFlow = ai.defineFlow(
  {
    name: 'suggestSimilarTasksFlow',
    inputSchema: SuggestSimilarTasksInputSchema,
    outputSchema: SuggestSimilarTasksOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
