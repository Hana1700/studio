
'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/use-auth';
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
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';
import { AlertCircle, PlusCircle, Building, Trash2, Edit, UserPlus, ChevronDown, Library, Smartphone, Phone, LogOut, KeyRound, MoreVertical } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import type { Contact, Structure, SubDepartment } from '@/lib/types';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from '@/components/ui/dropdown-menu';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { Alert, AlertDescription } from '@/components/ui/alert';


export default function AdminPage() {
  const { isAuthenticated, user, logout } = useAuth();
  const router = useRouter();
  const { toast } = useToast();
  
  const [structures, setStructures] = useState<Structure[]>([]);
  const [contacts, setContacts] = useState<Contact[]>([]);

  // Dialog states
  const [isStructureDialogOpen, setIsStructureDialogOpen] = useState(false);
  const [isContactDialogOpen, setIsContactDialogOpen] = useState(false);
  const [isSubDepartmentDialogOpen, setIsSubDepartmentDialogOpen] = useState(false);
  const [isPasswordDialogOpen, setIsPasswordDialogOpen] = useState(false);
  
  // Form states
  const [newStructureName, setNewStructureName] = useState('');
  const [newStructureDescription, setNewStructureDescription] = useState('');
  const [newSubDepartmentName, setNewSubDepartmentName] = useState('');
  const [parentStructureId, setParentStructureId] = useState('');

  // Editing states
  const [editingStructure, setEditingStructure] = useState<Structure | null>(null);
  const [editingSubDepartment, setEditingSubDepartment] = useState<SubDepartment | null>(null);
  const [editingContact, setEditingContact] = useState<Contact | null>(null);

  // Deleting states
  const [deletingStructure, setDeletingStructure] = useState<Structure | null>(null);
  const [deletingSubDepartment, setDeletingSubDepartment] = useState<SubDepartment | null>(null);
  const [isDeleteStructureAlertOpen, setIsDeleteStructureAlertOpen] = useState(false);
  const [isDeleteSubDepartmentAlertOpen, setIsDeleteSubDepartmentAlertOpen] = useState(false);

  const [passwordForm, setPasswordForm] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [passwordError, setPasswordError] = useState('');
  
  const [contactForm, setContactForm] = useState({
    id: '',
    name: '',
    title: '',
    threeDigits: '',
    fourDigits: '',
    fourDigitsXX: '',
    fourDigitsYY: '',
    structureId: '',
    subDepartmentId: '',
  });

   useEffect(() => {
    fetchData();
  }, []);
  
  const fetchData = async () => {
    try {
      const [structuresRes, contactsRes] = await Promise.all([
        fetch('/api/structures'),
        fetch('/api/contacts'),
      ]);
      if (structuresRes.ok) {
        const structuresData = await structuresRes.json();
        if (Array.isArray(structuresData)) {
           setStructures(structuresData);
        }
      }
      if (contactsRes.ok) {
        const contactsData = await contactsRes.json();
        setContacts(contactsData);
      }
    } catch (error) {
      console.error('Failed to fetch data:', error);
    }
  };

  useEffect(() => {
    if (isAuthenticated === false) {
      router.push('/login');
    }
  }, [isAuthenticated, router]);
  
  // --- Structure Actions ---
  const handleAddNewStructure = () => {
    setEditingStructure(null);
    resetStructureForm();
    setIsStructureDialogOpen(true);
  };
  
  const handleEditStructure = (structure: Structure) => {
    setEditingStructure(structure);
    setNewStructureName(structure.name);
    setNewStructureDescription(structure.description || '');
    setIsStructureDialogOpen(true);
  };

  const handleDeleteStructure = async () => {
    if (!deletingStructure) return;
    const response = await fetch(`/api/structures/${deletingStructure.id}`, { method: 'DELETE' });
    if (response.ok) {
        await fetchData();
        setDeletingStructure(null);
        setIsDeleteStructureAlertOpen(false);
    } else {
        console.error("Failed to delete structure");
    }
  };

  const handleSaveStructure = async () => {
    const isEditing = !!editingStructure;
    const url = isEditing ? `/api/structures/${editingStructure.id}` : '/api/structures';
    const method = isEditing ? 'PUT' : 'POST';

    const structureData = {
        name: newStructureName,
        description: newStructureDescription,
    };

    const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(structureData),
    });

    if (response.ok) {
        await fetchData();
        resetStructureForm();
        setIsStructureDialogOpen(false);
    } else {
        console.error("Failed to save structure", await response.text());
    }
  };

  const resetStructureForm = () => {
    setNewStructureName('');
    setNewStructureDescription('');
    setEditingStructure(null);
  };
  
  const handleCancelStructure = () => {
    resetStructureForm();
    setIsStructureDialogOpen(false);
  };

  // --- Sub-department Actions ---
  const handleAddNewSubDepartment = (structureId: string) => {
    setEditingSubDepartment(null);
    resetSubDepartmentForm();
    setParentStructureId(structureId);
    setIsSubDepartmentDialogOpen(true);
  };

  const handleEditSubDepartment = (subDepartment: SubDepartment) => {
    setEditingSubDepartment(subDepartment);
    setNewSubDepartmentName(subDepartment.name);
    setParentStructureId(subDepartment.structureId);
    setIsSubDepartmentDialogOpen(true);
  };
  
  const handleDeleteSubDepartment = async () => {
    if (!deletingSubDepartment) return;
    const response = await fetch(`/api/subdepartments/${deletingSubDepartment.id}`, { method: 'DELETE' });
    if (response.ok) {
        await fetchData();
        setDeletingSubDepartment(null);
        setIsDeleteSubDepartmentAlertOpen(false);
    } else {
        console.error("Failed to delete sub-department");
    }
  };

  const handleSaveSubDepartment = async () => {
    if (!newSubDepartmentName.trim()) return;

    const isEditing = !!editingSubDepartment;
    const url = isEditing ? `/api/subdepartments/${editingSubDepartment.id}` : '/api/subdepartments';
    const method = isEditing ? 'PUT' : 'POST';

    const subDeptData = {
      name: newSubDepartmentName,
      structureId: parentStructureId,
    };
    
    const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(subDeptData)
    });

    if (response.ok) {
        await fetchData();
        resetSubDepartmentForm();
        setIsSubDepartmentDialogOpen(false);
    } else {
        console.error("Failed to save sub-department");
    }
  };

  const resetSubDepartmentForm = () => {
    setNewSubDepartmentName('');
    setParentStructureId('');
    setEditingSubDepartment(null);
  };

  const handleCancelSubDepartment = () => {
    resetSubDepartmentForm();
    setIsSubDepartmentDialogOpen(false);
  };
  
  // --- Contact Actions ---
  const resetContactForm = () => {
    setEditingContact(null);
    setContactForm({
        id: '',
        name: '',
        title: '',
        threeDigits: '',
        fourDigits: '',
        fourDigitsXX: '',
        fourDigitsYY: '',
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
        threeDigits: contact.threeDigits || '',
        fourDigits: contact.fourDigits || '',
        fourDigitsXX: contact.fourDigitsXX || '',
        fourDigitsYY: contact.fourDigitsYY || '',
        structureId: contact.structureId || '',
        subDepartmentId: contact.subDepartmentId || '',
    });
    setIsContactDialogOpen(true);
  };

  const handleDeleteContact = async (contactId: string) => {
    const response = await fetch(`/api/contacts/${contactId}`, {
        method: 'DELETE',
    });
    if (response.ok) {
        await fetchData();
    } else {
        console.error("Failed to delete contact");
    }
  };

  const handleSaveContact = async () => {
    const url = editingContact ? `/api/contacts/${editingContact.id}` : '/api/contacts';
    const method = editingContact ? 'PUT' : 'POST';

    const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(contactForm),
    });
    
    if (response.ok) {
        await fetchData();
        resetContactForm();
        setIsContactDialogOpen(false);
    } else {
        console.error("Failed to save contact");
    }
  };

  const handleCancelContact = () => {
    resetContactForm();
    setIsContactDialogOpen(false);
  };

  // --- Password Actions ---
  const handleChangePassword = async () => {
    setPasswordError('');
    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      setPasswordError('Les nouveaux mots de passe ne correspondent pas.');
      return;
    }
    if (!user) {
      setPasswordError('Utilisateur non trouvé.');
      return;
    }

    const response = await fetch('/api/admin/change-password', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        username: user.username,
        currentPassword: passwordForm.currentPassword,
        newPassword: passwordForm.newPassword,
      }),
    });

    const data = await response.json();

    if (response.ok) {
      toast({
        title: 'Succès',
        description: 'Votre mot de passe a été changé avec succès.',
      });
      setIsPasswordDialogOpen(false);
      setPasswordForm({ currentPassword: '', newPassword: '', confirmPassword: '' });
    } else {
      setPasswordError(data.error || 'Une erreur est survenue.');
    }
  };

  const availableSubDepartments = contactForm.structureId ? structures.find(s => s.id === contactForm.structureId)?.subDepartments : [];

  if (!isAuthenticated) {
    return null;
  }

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
           <h1 className="font-headline text-3xl font-bold tracking-tight">
            Administrateur
          </h1>
          <p className="text-muted-foreground">Connecté en tant que {user?.username}</p>
        </div>
        <div>
          <Button variant="outline" className="mr-2" onClick={() => setIsPasswordDialogOpen(true)}>
            <KeyRound className="mr-2 h-4 w-4" />
            Changer le mot de passe
          </Button>
          <Button variant="outline" onClick={logout}>
            <LogOut className="mr-2 h-4 w-4" />
            Déconnexion
          </Button>
        </div>
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
                <DropdownMenuItem onSelect={handleAddNewStructure}>
                  <Building className="mr-2 h-4 w-4" />
                  <span>Structure</span>
                </DropdownMenuItem>
                 <DropdownMenuItem onSelect={() => {
                   resetSubDepartmentForm();
                   setIsSubDepartmentDialogOpen(true);
                 }}>
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
           <Accordion type="multiple" className="w-full">
            {Array.isArray(structures) && structures.map((structure) => (
              <AccordionItem value={`structure-${structure.id}`} key={structure.id}>
                <div className='flex items-center w-full'>
                    <AccordionTrigger className="flex-1">
                        <div className='flex justify-between w-full items-center'>
                             <p className="font-medium">{structure.name}</p>
                             <div className='flex items-center'>
                                <p className="text-sm text-muted-foreground mr-4">
                                    {structure.subDepartments.length} sous-direction(s)
                                </p>
                             </div>
                        </div>
                    </AccordionTrigger>
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon" className='mr-2'>
                                <MoreVertical className="h-4 w-4" />
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                            <DropdownMenuItem onSelect={() => handleEditStructure(structure)}>
                                <Edit className="mr-2 h-4 w-4" />
                                <span>Modifier</span>
                            </DropdownMenuItem>
                            <DropdownMenuItem onSelect={() => handleAddNewSubDepartment(structure.id)}>
                                <PlusCircle className="mr-2 h-4 w-4" />
                                <span>Ajouter une sous-direction</span>
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem onSelect={() => {
                                setDeletingStructure(structure);
                                setIsDeleteStructureAlertOpen(true);
                            }} className="text-destructive">
                                <Trash2 className="mr-2 h-4 w-4" />
                                <span>Supprimer</span>
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>
                <AccordionContent>
                    <div className='pl-4 border-l ml-4'>
                        <h4 className='font-medium mb-2 ml-4'>Sous-directions</h4>
                        {structure.subDepartments.length > 0 ? (
                           <div className="flex flex-col gap-1 ml-4">
                             {structure.subDepartments.map(sub => (
                               <div key={sub.id} className="flex items-center justify-between rounded-md p-2 hover:bg-muted/50">
                                 <p className="text-sm">{sub.name}</p>
                                 <div className='flex items-center'>
                                    <Button variant="ghost" size="icon" onClick={() => handleEditSubDepartment(sub)}>
                                        <Edit className="h-4 w-4" />
                                    </Button>
                                    <Button variant="ghost" size="icon" onClick={() => {
                                        setDeletingSubDepartment(sub);
                                        setIsDeleteSubDepartmentAlertOpen(true);
                                    }}>
                                        <Trash2 className="h-4 w-4 text-destructive" />
                                    </Button>
                                 </div>
                               </div>
                             ))}
                           </div>
                        ) : (
                            <p className="text-sm text-muted-foreground text-center py-2">Aucune sous-direction.</p>
                        )}
                        <Separator className='my-4'/>
                        <h4 className='font-medium mb-2 ml-4'>Contacts</h4>
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
                                  <span>{`${contact.threeDigits} ${contact.fourDigits} ${contact.fourDigitsXX}`}</span>
                                </div>
                                {contact.fourDigitsYY && (
                                  <div className="flex items-center gap-2">
                                    <Smartphone className="h-4 w-4 text-muted-foreground" />
                                    <span>{contact.fourDigitsYY}</span>
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
                                    <TableHead>Sous-direction</TableHead>
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
                                    <TableCell>{`${contact.threeDigits} ${contact.fourDigits} ${contact.fourDigitsXX}`}</TableCell>
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
            <DialogTitle>{editingStructure ? "Modifier la structure" : "Ajouter une nouvelle structure"}</DialogTitle>
            <DialogDescription>
              Remplissez les détails de la structure.
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
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="description" className="text-right">
                Description
              </Label>
              <Textarea
                id="description"
                placeholder="Description de la structure"
                className="col-span-3"
                value={newStructureDescription}
                onChange={(e) => setNewStructureDescription(e.target.value)}
              />
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
            <DialogTitle>{editingSubDepartment ? "Modifier la sous-direction" : "Ajouter une sous-direction"}</DialogTitle>
            <DialogDescription>
              {editingSubDepartment ? "Modifiez le nom de la sous-direction." : "Sélectionnez une structure parente et nommez la nouvelle sous-direction."}
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="parent-structure" className="text-right">
                Structure
              </Label>
              <Select value={parentStructureId} onValueChange={setParentStructureId} disabled={!!editingSubDepartment}>
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
                <Label htmlFor="contact-threeDigits" className="text-right">3 chiffres</Label>
                <Input id="contact-threeDigits" value={contactForm.threeDigits} onChange={(e) => setContactForm({...contactForm, threeDigits: e.target.value})} className="col-span-3" />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="contact-fourDigits" className="text-right">4 chiffres</Label>
                <Input id="contact-fourDigits" value={contactForm.fourDigits} onChange={(e) => setContactForm({...contactForm, fourDigits: e.target.value})} className="col-span-3" />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="contact-fourDigitsXX" className="text-right">4 chiffres MDN</Label>
                <Input id="contact-fourDigitsXX" value={contactForm.fourDigitsXX} onChange={(e) => setContactForm({...contactForm, fourDigitsXX: e.target.value})} className="col-span-3" />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="contact-fourDigitsYY" className="text-right">GSM (4/10 chiffres)</Label>
                <Input id="contact-fourDigitsYY" value={contactForm.fourDigitsYY} onChange={(e) => setContactForm({...contactForm, fourDigitsYY: e.target.value})} className="col-span-3" />
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
                    value={contactForm.subDepartmentId || ''}
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

      <Dialog open={isPasswordDialogOpen} onOpenChange={setIsPasswordDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Changer le mot de passe</DialogTitle>
            <DialogDescription>
              Mettez à jour votre mot de passe administrateur ici.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="current-password"रियायत className="text-right">
                Actuel
              </Label>
              <Input
                id="current-password"
                type="password"
                className="col-span-3"
                value={passwordForm.currentPassword}
                onChange={(e) => setPasswordForm({ ...passwordForm, currentPassword: e.target.value })}
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="new-password"रियायत className="text-right">
                Nouveau
              </Label>
              <Input
                id="new-password"
                type="password"
                className="col-span-3"
                value={passwordForm.newPassword}
                onChange={(e) => setPasswordForm({ ...passwordForm, newPassword: e.target.value })}
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="confirm-password"रियायत className="text-right">
                Confirmer
              </Label>
              <Input
                id="confirm-password"
                type="password"
                className="col-span-3"
                value={passwordForm.confirmPassword}
                onChange={(e) => setPasswordForm({ ...passwordForm, confirmPassword: e.target.value })}
              />
            </div>
             {passwordError && (
                <Alert variant="destructive" className="col-span-4">
                    <AlertCircle className="h-4 w-4" />
                    <AlertDescription>
                        {passwordError}
                    </AlertDescription>
                </Alert>
            )}
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsPasswordDialogOpen(false)}>Annuler</Button>
            <Button type="submit" onClick={handleChangePassword}>Enregistrer</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      {/* Delete Confirmation Dialogs */}
      <AlertDialog open={isDeleteStructureAlertOpen} onOpenChange={setIsDeleteStructureAlertOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Êtes-vous sûr de vouloir supprimer cette structure ?</AlertDialogTitle>
            <AlertDialogDescription>
              Cette action est irréversible. Cela supprimera la structure, toutes ses sous-directions et tous les contacts associés.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setDeletingStructure(null)}>Annuler</AlertDialogCancel>
            <AlertDialogAction onClick={handleDeleteStructure}>Supprimer</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <AlertDialog open={isDeleteSubDepartmentAlertOpen} onOpenChange={setIsDeleteSubDepartmentAlertOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Êtes-vous sûr de vouloir supprimer cette sous-direction ?</AlertDialogTitle>
            <AlertDialogDescription>
              Cette action est irréversible. Cela supprimera la sous-direction et tous les contacts qui y sont directement associés.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setDeletingSubDepartment(null)}>Annuler</AlertDialogCancel>
            <AlertDialogAction onClick={handleDeleteSubDepartment}>Supprimer</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}

    