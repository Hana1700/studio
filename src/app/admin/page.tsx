
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
import { AlertCircle, PlusCircle, Building, Trash2, Edit, UserPlus } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { structures as initialStructures, allContacts as initialContacts } from '@/lib/data';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import type { Contact } from '@/lib/types';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';


export default function AdminPage() {
  const [structures, setStructures] = useState(initialStructures);
  const [contacts, setContacts] = useState(initialContacts);
  const [isStructureDialogOpen, setIsStructureDialogOpen] = useState(false);
  const [isContactDialogOpen, setIsContactDialogOpen] = useState(false);
  const [newStructureName, setNewStructureName] = useState('');
  const [subDepartments, setSubDepartments] = useState([{ id: 1, name: '' }]);

  const [editingContact, setEditingContact] = useState<Contact | null>(null);
  
  const [contactForm, setContactForm] = useState({
    id: '',
    name: '',
    title: '',
    phone: '',
    mobile: '',
    email: '',
    structureId: '',
    subDepartmentId: '',
  });


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

  const handleSaveStructure = () => {
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
        // @ts-ignore
        setStructures([...structures, newStructure]);
    }

    resetStructureForm();
    setIsStructureDialogOpen(false);
  };

  const resetStructureForm = () => {
    setNewStructureName('');
    setSubDepartments([{ id: 1, name: '' }]);
  };
  
  const handleCancelStructure = () => {
    resetStructureForm();
    setIsStructureDialogOpen(false);
  };

  const resetContactForm = () => {
    setEditingContact(null);
    setContactForm({
        id: '',
        name: '',
        title: '',
        phone: '',
        mobile: '',
        email: '',
        structureId: '',
        subDepartmentId: '',
    });
  };

  const handleAddNewContact = () => {
    resetContactForm();
    setIsContactDialogOpen(true);
  };

  const handleEditContact = (contact: Contact) => {
    setEditingContact(contact);
    setContactForm({
        id: contact.id,
        name: contact.name,
        title: contact.title,
        phone: contact.phone,
        mobile: contact.mobile || '',
        email: contact.email,
        structureId: contact.structureId || '',
        subDepartmentId: contact.subDepartmentId || '',
    });
    setIsContactDialogOpen(true);
  };

  const handleDeleteContact = (contactId: string) => {
    setContacts(contacts.filter(c => c.id !== contactId));
  };

  const handleSaveContact = () => {
    if (editingContact) {
      // @ts-ignore
      setContacts(contacts.map(c => c.id === editingContact.id ? { ...c, ...contactForm } : c));
    } else {
       // @ts-ignore
      setContacts([...contacts, { ...contactForm, id: `contact-${Date.now()}` }]);
    }
    resetContactForm();
    setIsContactDialogOpen(false);
  };

  const handleCancelContact = () => {
    resetContactForm();
    setIsContactDialogOpen(false);
  };

  const availableSubDepartments = contactForm.structureId ? structures.find(s => s.id === contactForm.structureId)?.subDepartments : [];


  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <h1 className="font-headline text-3xl font-bold tracking-tight">
          Administrateur
        </h1>
      </div>

       <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Gérer les contacts</CardTitle>
            <Button onClick={handleAddNewContact}>
              <UserPlus className="mr-2 h-4 w-4" />
              Ajouter un contact
            </Button>
          </div>
          <CardDescription>
            Ajoutez, modifiez ou supprimez des contacts.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nom</TableHead>
                <TableHead>Service</TableHead>
                <TableHead>Téléphone</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {contacts.map(contact => (
                <TableRow key={contact.id}>
                  <TableCell>
                    <div className="font-medium">{contact.name}</div>
                    <div className="text-sm text-muted-foreground">{contact.title}</div>
                  </TableCell>
                  <TableCell>{contact.subDepartmentName}</TableCell>
                  <TableCell>{contact.phone}</TableCell>
                  <TableCell className="text-right">
                    <Button variant="ghost" size="icon" onClick={() => handleEditContact(contact)}>
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="icon" onClick={() => handleDeleteContact(contact.id)}>
                      <Trash2 className="h-4 w-4 text-destructive" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>


      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Gérer les structures</CardTitle>
             <Dialog open={isStructureDialogOpen} onOpenChange={setIsStructureDialogOpen}>
              <DialogTrigger asChild>
                <Button onClick={() => setIsStructureDialogOpen(true)}>
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
                  <Button variant="outline" onClick={handleCancelStructure}>Annuler</Button>
                  <Button type="submit" onClick={handleSaveStructure}>Enregistrer</Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
           <CardDescription>
            Ajoutez ou modifiez des structures et sous-directions.
          </CardDescription>
        </CardHeader>
        <CardContent>
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
        </CardContent>
      </Card>

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

      <Dialog open={isContactDialogOpen} onOpenChange={setIsContactDialogOpen}>
        <DialogContent className="sm:max-w-[525px]">
            <DialogHeader>
              <DialogTitle>{editingContact ? 'Modifier le contact' : 'Ajouter un nouveau contact'}</DialogTitle>
              <DialogDescription>
                Remplissez les informations ci-dessous.
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="contact-name" className="text-right">Nom</Label>
                <Input id="contact-name" value={contactForm.name} onChange={(e) => setContactForm({...contactForm, name: e.target.value})} className="col-span-3" />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="contact-title" className="text-right">Grade</Label>
                <Input id="contact-title" value={contactForm.title} onChange={(e) => setContactForm({...contactForm, title: e.target.value})} className="col-span-3" />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="contact-phone" className="text-right">Numéro 1</Label>
                <Input id="contact-phone" value={contactForm.phone} onChange={(e) => setContactForm({...contactForm, phone: e.target.value})} className="col-span-3" />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="contact-mobile" className="text-right">Numéro 2</Label>
                <Input id="contact-mobile" value={contactForm.mobile} onChange={(e) => setContactForm({...contactForm, mobile: e.target.value})} className="col-span-3" />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="contact-email" className="text-right">Email</Label>
                <Input id="contact-email" type="email" value={contactForm.email} onChange={(e) => setContactForm({...contactForm, email: e.target.value})} className="col-span-3" />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                 <Label htmlFor="structure" className="text-right">Structure</Label>
                 <Select
                    value={contactForm.structureId}
                    onValueChange={(value) => setContactForm({...contactForm, structureId: value, subDepartmentId: '' })}
                  >
                    <SelectTrigger className="col-span-3">
                      <SelectValue placeholder="Sélectionner une structure" />
                    </SelectTrigger>
                    <SelectContent>
                      {structures.map((s) => (
                        <SelectItem key={s.id} value={s.id}>{s.name}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
              </div>
               <div className="grid grid-cols-4 items-center gap-4">
                 <Label htmlFor="subDepartment" className="text-right">Sous-direction</Label>
                 <Select
                    value={contactForm.subDepartmentId}
                    onValueChange={(value) => setContactForm({...contactForm, subDepartmentId: value})}
                    disabled={!contactForm.structureId}
                  >
                    <SelectTrigger className="col-span-3">
                      <SelectValue placeholder="Sélectionner une sous-direction" />
                    </SelectTrigger>
                    <SelectContent>
                      {availableSubDepartments?.map((sd) => (
                        <SelectItem key={sd.id} value={sd.id}>{sd.name}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={handleCancelContact}>Annuler</Button>
              <Button onClick={handleSaveContact}>Enregistrer</Button>
            </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
