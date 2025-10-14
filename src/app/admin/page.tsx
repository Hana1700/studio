'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/use-auth.tsx';
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
import { AlertCircle, PlusCircle, Building, Trash2, Edit, UserPlus, ChevronDown, Library, Smartphone, Phone, LogOut } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { structures as initialStructures, allContacts as initialContacts } from '@/lib/data';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import type { Contact } from '@/lib/types';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';


export default function AdminPage() {
  const { isAuthenticated, logout } = useAuth();
  const router = useRouter();
  
  const [structures, setStructures] = useState([...initialStructures]);
  const [contacts, setContacts] = useState([...initialContacts]);
  const [isStructureDialogOpen, setIsStructureDialogOpen] = useState(false);
  const [isContactDialogOpen, setIsContactDialogOpen] = useState(false);
  const [isSubDepartmentDialogOpen, setIsSubDepartmentDialogOpen] = useState(false);
  
  const [newStructureName, setNewStructureName] = useState('');
  const [newSubDepartmentName, setNewSubDepartmentName] = useState('');
  const [parentStructureId, setParentStructureId] = useState('');

  const [subDepartments, setSubDepartments] = useState([{ id: 1, name: '' }]);

  const [editingContact, setEditingContact] = useState<Contact | null>(null);
  
  const [contactForm, setContactForm] = useState({
    id: '',
    name: '',
    title: '',
    phone: '',
    mobile: '',
    structureId: '',
    subDepartmentId: '',
  });

  useEffect(() => {
    // If auth state is known and it is false, redirect.
    // Using `isAuthenticated === false` is important to avoid redirecting
    // on the initial render when the state is not yet known.
    if (isAuthenticated === false) {
      router.push('/login');
    }
  }, [isAuthenticated, router]);

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
  
  const handleSaveSubDepartment = () => {
    if (!parentStructureId || !newSubDepartmentName.trim()) return;

    const newSubDept = {
      id: newSubDepartmentName.toLowerCase().replace(/\s/g, '-'),
      name: newSubDepartmentName,
      icon: Building,
      contacts: [],
    };

    setStructures(structures.map(s => 
      s.id === parentStructureId 
        ? { ...s, subDepartments: [...s.subDepartments, newSubDept] }
        : s
    ));

    resetSubDepartmentForm();
    setIsSubDepartmentDialogOpen(false);
  };

  const resetSubDepartmentForm = () => {
    setNewSubDepartmentName('');
    setParentStructureId('');
  };

  const handleCancelSubDepartment = () => {
    resetSubDepartmentForm();
    setIsSubDepartmentDialogOpen(false);
  };

  const availableSubDepartments = contactForm.structureId ? structures.find(s => s.id === contactForm.structureId)?.subDepartments : [];

  // We render nothing until we know the auth status, to prevent flash of content
  // and hydration errors. The useEffect above will handle the redirect.
  if (!isAuthenticated) {
    return null;
  }

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <h1 className="font-headline text-3xl font-bold tracking-tight">
          Administrateur
        </h1>
        <Button variant="outline" onClick={logout}>
          <LogOut className="mr-2 h-4 w-4" />
          Déconnexion
        </Button>
      </div>

       <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Gérer les structures et contacts</CardTitle>
            
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button>
                  <PlusCircle className="mr-2 h-4 w-4" />
                  Ajouter
                  <ChevronDown className="ml-2 h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuItem onSelect={() => setIsStructureDialogOpen(true)}>
                  <Building className="mr-2 h-4 w-4" />
                  <span>Structure</span>
                </DropdownMenuItem>
                 <DropdownMenuItem onSelect={() => setIsSubDepartmentDialogOpen(true)}>
                  <Library className="mr-2 h-4 w-4" />
                  <span>Sous-direction</span>
                </DropdownMenuItem>
                <DropdownMenuItem onSelect={handleAddNewContact}>
                  <UserPlus className="mr-2 h-4 w-4" />
                  <span>Contact</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

          </div>
          <CardDescription>
            Ajoutez, modifiez ou supprimez des structures et des contacts.
          </CardDescription>
        </CardHeader>
        <CardContent>
           <Accordion type="single" collapsible className="w-full">
            {structures.map((structure) => (
              <AccordionItem value={`structure-${structure.id}`} key={structure.id}>
                <AccordionTrigger>
                    <div className='flex justify-between w-full items-center'>
                         <p className="font-medium">{structure.name}</p>
                         <div className='flex items-center'>
                            <p className="text-sm text-muted-foreground mr-4">
                                {structure.subDepartments.length} sous-direction(s)
                            </p>
                            {/* Actions for structure can go here */}
                         </div>
                    </div>
                </AccordionTrigger>
                <AccordionContent>
                    <div className='pl-4 border-l'>
                        <h4 className='font-medium mb-2'>Contacts</h4>
                        {/* Mobile view */}
                        <div className="grid grid-cols-1 gap-4 md:hidden">
                           {contacts.filter(c => c.structureId === structure.id).map(contact => (
                            <Card key={contact.id}>
                              <CardHeader className="flex flex-row items-center gap-4 pb-2">
                                <Avatar className='h-10 w-10'>
                                  <AvatarFallback>
                                    {contact.name.split(' ').map((n) => n[0]).join('')}
                                  </AvatarFallback>
                                </Avatar>
                                <div>
                                  <CardTitle className="text-base font-medium">{contact.name}</CardTitle>
                                  <CardDescription>{contact.title}</CardDescription>
                                </div>
                              </CardHeader>
                              <CardContent className="space-y-2 text-sm pt-2">
                                {contact.subDepartmentName && <p><span className="font-semibold">Service:</span> {contact.subDepartmentName}</p>}
                                <div className="flex items-center gap-2">
                                  <Phone className="h-4 w-4 text-muted-foreground" />
                                  <span>{contact.phone}</span>
                                </div>
                                {contact.mobile && (
                                  <div className="flex items-center gap-2">
                                    <Smartphone className="h-4 w-4 text-muted-foreground" />
                                    <span>{contact.mobile}</span>
                                  </div>
                                )}
                              </CardContent>
                              <div className="flex justify-end p-2 pt-0">
                                <Button variant="ghost" size="icon" onClick={() => handleEditContact(contact)}>
                                  <Edit className="h-4 w-4" />
                                </Button>
                                <Button variant="ghost" size="icon" onClick={() => handleDeleteContact(contact.id)}>
                                  <Trash2 className="h-4 w-4 text-destructive" />
                                </Button>
                              </div>
                            </Card>
                          ))}
                        </div>

                        {/* Desktop view */}
                        <Table className="hidden md:table">
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Nom</TableHead>
                                    <TableHead>Service</TableHead>
                                    <TableHead>Téléphone</TableHead>
                                    <TableHead className="text-right">Actions</TableHead>
                                </TableRow>
                            </TableHeader>
                             <TableBody>
                                {contacts.filter(c => c.structureId === structure.id).map(contact => (
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
                                {contacts.filter(c => c.structureId === structure.id).length === 0 && (
                                    <TableRow>
                                        <TableCell colSpan={4} className="text-center text-muted-foreground">Aucun contact dans cette structure.</TableCell>
                                    </TableRow>
                                )}
                            </TableBody>
                        </Table>
                         {contacts.filter(c => c.structureId === structure.id).length === 0 && (
                            <p className="text-sm text-center text-muted-foreground py-4 md:hidden">Aucun contact dans cette structure.</p>
                        )}
                    </div>
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </CardContent>
      </Card>

      <Dialog open={isStructureDialogOpen} onOpenChange={setIsStructureDialogOpen}>
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
      
      <Dialog open={isSubDepartmentDialogOpen} onOpenChange={setIsSubDepartmentDialogOpen}>
        <DialogContent className="sm:max-w-[525px]">
          <DialogHeader>
            <DialogTitle>Ajouter une sous-direction</DialogTitle>
            <DialogDescription>
              Sélectionnez une structure parente et nommez la nouvelle sous-direction.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="parent-structure" className="text-right">
                Structure
              </Label>
              <Select value={parentStructureId} onValueChange={setParentStructureId}>
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
              <Label htmlFor="subdepartment-name" className="text-right">
                Nom
              </Label>
              <Input
                id="subdepartment-name"
                placeholder="Nom de la sous-direction"
                className="col-span-3"
                value={newSubDepartmentName}
                onChange={(e) => setNewSubDepartmentName(e.target.value)}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={handleCancelSubDepartment}>Annuler</Button>
            <Button onClick={handleSaveSubDepartment}>Enregistrer</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>


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
