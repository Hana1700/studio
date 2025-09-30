import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BookUser } from "lucide-react";


export default function Home() {
  return (
    <div className="flex h-full items-center justify-center">
        <Card className="w-full max-w-md text-center">
            <CardHeader>
                <div className="flex justify-center mb-4">
                    <BookUser className="h-16 w-16 text-primary" />
                </div>
                <CardTitle className="font-headline text-2xl">Bienvenue dans l'annuaire</CardTitle>
            </CardHeader>
            <CardContent>
                <p className="text-muted-foreground">
                    Utilisez le menu sur la gauche pour naviguer entre les différentes structures et trouver les contacts que vous cherchez.
                </p>
            </CardContent>
        </Card>
    </div>
  );
}
