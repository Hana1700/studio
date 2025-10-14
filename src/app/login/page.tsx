'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/hooks/use-auth';
import { AppLogo } from '@/components/icons';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AlertCircle } from 'lucide-react';

export default function LoginPage() {
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const router = useRouter();
  const { login } = useAuth();

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (login(password)) {
      router.push('/admin');
    } else {
      setError('Mot de passe incorrect.');
    }
  };

  return (
    <div className="flex h-full items-center justify-center bg-background">
      <Card className="w-full max-w-sm">
        <CardHeader className="text-center">
            <div className="flex justify-center items-center space-x-2 mb-4">
                <AppLogo className="h-10 w-10 text-primary" />
                <CardTitle className="text-3xl font-headline">Annuaire</CardTitle>
            </div>
          <CardDescription>
            Veuillez entrer le mot de passe pour accéder à la section administrateur.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleLogin} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="password">Mot de passe</Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            {error && (
                <Alert variant="destructive">
                    <AlertCircle className="h-4 w-4" />
                    <AlertDescription>
                        {error}
                    </AlertDescription>
                </Alert>
            )}
            <Button type="submit" className="w-full">
              Se connecter
            </Button>
             <div className="text-center text-xs text-muted-foreground pt-4">
              Le mot de passe par défaut est `admin`.
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
