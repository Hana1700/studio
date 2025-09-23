'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { handleGenerateSummary } from '@/app/actions';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Loader2 } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';

const formSchema = z.object({
  query: z.string().min(3, {
    message: 'La requête doit contenir au moins 3 caractères.',
  }),
});

export function ContactSummaryGenerator() {
  const [summary, setSummary] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      query: '',
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsLoading(true);
    setError(null);
    setSummary('');

    const result = await handleGenerateSummary(values);

    if (result.error) {
      setError(result.error);
    } else {
      setSummary(result.summary);
    }

    setIsLoading(false);
  }

  return (
    <div className="grid gap-6">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <FormField
            control={form.control}
            name="query"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Requête</FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="Ex: 'Directs reports de Jean Dupont'"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button type="submit" disabled={isLoading}>
            {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Générer
          </Button>
        </form>
      </Form>
      {error && (
        <p className="text-sm font-medium text-destructive">{error}</p>
      )}
      {summary && (
        <Card>
            <CardHeader>
                <CardTitle className='font-headline text-lg'>Résumé généré</CardTitle>
            </CardHeader>
            <CardContent>
                <p className='text-sm text-muted-foreground'>{summary}</p>
            </CardContent>
        </Card>
      )}
    </div>
  );
}
