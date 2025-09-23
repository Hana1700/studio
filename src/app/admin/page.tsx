import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AlertCircle } from "lucide-react";

export default function AdminPage() {
  return (
    <div className="flex justify-center items-center h-full">
        <Card className="w-full max-w-md">
            <CardHeader>
                <CardTitle className="flex items-center gap-2 font-headline">
                    <AlertCircle className="w-6 h-6 text-primary"/>
                    Zone d'administration
                </CardTitle>
            </CardHeader>
            <CardContent>
                <p className="text-muted-foreground">
                    Cette section est réservée aux administrateurs. Une authentification est requise pour ajouter, modifier ou supprimer des contacts.
                </p>
            </CardContent>
        </Card>
    </div>
  );
}
