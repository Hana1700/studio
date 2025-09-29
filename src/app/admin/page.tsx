
'use client';

import { useState } from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogDescription,
  DialogFooter,
  DialogClose,
} from '@/components/ui/dialog';
import { AlertCircle, PlusCircle, Building, Trash2 } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { structures as initialStructures } from '@/lib/data';

export default function AdminPage() {
  const [structures, setStructures] = useState(initialStructures);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [newStructureName, setNewStructureName] = useState('');
  const [subDepartments, setSubDepartments] = useState([{ id: 1, name: '' }]);

  const handleAddSubDepartment = () => {
    setSubDepartments([
      ...subDepartments,
      { id: Date.now(), name: '' },
    ]);
  };

  const handleRemoveSubDepartment = (id: number) => {
    setSubDepartments(subDepartments.filter((sub) => sub.id !== id));
  };

  const handleSubDepartmentNameChange = (id: number, name: string) => {
    setSubDepartments(
      subDepartments.map((sub) => (sub.id === id ? { ...sub, name } : sub))
    );
  };

  const handleSave = () => {
    // This is a mock save. In a real app, this would be an API call.
    const newStructure = {
      id: newStructureName.toLowerCase().replace(/\s/g, '-'),
      name: newStructureName,
      icon: Building,
      description: 'Nouvelle structure ajoutée',
      subDepartments: subDepartments
        .filter((sd) => sd.name.trim() !== '')
        .map((sd) => ({
          id: sd.name.toLowerCase().replace(/\s/g, '-'),
          name: sd.name,
          icon: Building,
          contacts: [],
        })),
    };

    if (newStructure.name.trim() !== '') {
        // This state update is temporary and will be lost on page refresh.
        // @ts-ignore
        setStructures([...structures, newStructure]);
    }

    resetForm();
    setIsDialogOpen(false);
  };

  const resetForm = () => {
    setNewStructureName('');
    setSubDepartments([{ id: 1, name: '' }]);
  };

  const handleCancel = () => {
    resetForm();
    setIsDialogOpen(false);
  };


  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <h1 className="font-headline text-3xl font-bold tracking-tight">
          Administrateur
        </h1>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={() => setIsDialogOpen(true)}>
              <PlusCircle className="mr-2 h-4 w-4" />
              Ajouter une structure
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[525px]">
            <DialogHeader>
              <DialogTitle>Ajouter une nouvelle structure</DialogTitle>
              <DialogDescription>
                Remplissez les détails de la structure et de ses
                sous-directions.
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-6 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="name" className="text-right">
                  Nom
                </Label>
                <Input
                  id="name"
                  placeholder="Nom de la structure"
                  className="col-span-3"
                  value={newStructureName}
                  onChange={(e) => setNewStructureName(e.target.value)}
                />
              </div>

              <Separator />

              <div>
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-medium">Sous-directions</h3>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleAddSubDepartment}
                  >
                    <PlusCircle className="mr-2 h-4 w-4" />
                    Ajouter
                  </Button>
                </div>
                <div className="space-y-4 max-h-[200px] overflow-y-auto pr-2">
                  {subDepartments.map((sub, index) => (
                    <div
                      key={sub.id}
                      className="flex items-center gap-4 rounded-lg border p-4"
                    >
                      <Building className="h-6 w-6 text-primary" />
                      <div className="flex-1">
                        <Input
                          placeholder={`Nom de la sous-direction ${index + 1}`}
                          className="w-full"
                          value={sub.name}
                          onChange={(e) =>
                            handleSubDepartmentNameChange(sub.id, e.target.value)
                          }
                        />
                      </div>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleRemoveSubDepartment(sub.id)}
                        disabled={subDepartments.length <= 1}
                      >
                        <Trash2 className="h-4 w-4 text-destructive" />
                      </Button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
            <DialogFooter>
               <Button variant="outline" onClick={handleCancel}>Annuler</Button>
              <Button type="submit" onClick={handleSave}>Enregistrer</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

       {/* Display existing structures (this part is just for demo, it will be updated from the main list) */}
       <div className="overflow-hidden rounded-lg border">
        <ul className="divide-y">
          {structures.map((structure) => (
            <li key={structure.id} className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">{structure.name}</p>
                  <p className="text-sm text-muted-foreground">
                    {structure.subDepartments.length} sous-direction(s)
                  </p>
                </div>
              </div>
            </li>
          ))}
        </ul>
      </div>

      <Card className="w-full">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 font-headline">
            <AlertCircle className="w-6 h-6 text-primary" />
            Information
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">
            Cette section est réservée aux administrateurs. Une authentification
            est requise pour ajouter, modifier ou supprimer des contacts et des
            structures. Les ajouts effectués ici sont temporaires et seront perdus au rechargement de la page.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}

