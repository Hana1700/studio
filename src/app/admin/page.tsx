import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogDescription,
} from "@/components/ui/dialog";
import { AlertCircle, PlusCircle } from "lucide-react";

export default function AdminPage() {
  return (
    <div className="space-y-8">
        <div className="flex items-center justify-between">
            <h1 className="font-headline text-3xl font-bold tracking-tight">
                Zone d'administration
            </h1>
            <Dialog>
                <DialogTrigger asChild>
                    <Button>
                        <PlusCircle className="mr-2 h-4 w-4" />
                        Ajouter une structure
                    </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[425px]">
                    <DialogHeader>
                        <DialogTitle>Ajouter une nouvelle structure</DialogTitle>
                        <DialogDescription>
                            Cette fonctionnalité est en cours de développement.
                        </DialogDescription>
                    </DialogHeader>
                    <div className="py-4">
                        <p className="text-sm text-muted-foreground">Le formulaire pour ajouter une structure, ses services et leurs numéros de téléphone apparaîtra ici bientôt.</p>
                    </div>
                </DialogContent>
            </Dialog>
        </div>

        <Card className="w-full">
            <CardHeader>
                <CardTitle className="flex items-center gap-2 font-headline">
                    <AlertCircle className="w-6 h-6 text-primary"/>
                    Information
                </CardTitle>
            </CardHeader>
            <CardContent>
                <p className="text-muted-foreground">
                    Cette section est réservée aux administrateurs. Une authentification est requise pour ajouter, modifier ou supprimer des contacts et des structures.
                </p>
            </CardContent>
        </Card>
    </div>
  );
}
