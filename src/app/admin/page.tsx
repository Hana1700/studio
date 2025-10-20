
'use client';

import { useEffect, useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/use-auth';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter
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
import { AlertCircle, PlusCircle, Building, Trash2, Edit, UserPlus, ChevronDown, Library, Smartphone, Phone, LogOut, KeyRound, MoreVertical, ChevronRight, Users, ArrowLeft, Move } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import type { Contact, Structure, SubDepartment } from '@/lib/types';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
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
import { DndProvider, useDrag, useDrop } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import update from 'immutability-helper';

type View = 'structures' | 'subdepartments' | 'contacts';
type ItemType = 'structure' | 'subdepartment' | 'contact';
type DraggableItem = Structure | SubDepartment | Contact;


// Drag-and-drop Card Component
const DraggableCard = ({ item, type, index, moveCard, children, isReordering }: { item: DraggableItem, type: ItemType, index: number, moveCard: (dragIndex: number, hoverIndex: number, itemType: ItemType) => void, children: React.ReactNode, isReordering: boolean }) => {
  const ref = React.useRef<HTMLDivElement>(null);
  
  const [, drop] = useDrop({
    accept: type,
    hover(draggedItem: { index: number }, monitor) {
      if (!ref.current) return;
      const dragIndex = draggedItem.index;
      const hoverIndex = index;
      if (dragIndex === hoverIndex) return;
      const hoverBoundingRect = ref.current?.getBoundingClientRect();
      const hoverMiddleY = (hoverBoundingRect.bottom - hoverBoundingRect.top) / 2;
      const clientOffset = monitor.getClientOffset();
      const hoverClientY = clientOffset!.y - hoverBoundingRect.top;
      if (dragIndex < hoverIndex && hoverClientY < hoverMiddleY) return;
      if (dragIndex > hoverIndex && hoverClientY > hoverMiddleY) return;
      moveCard(dragIndex, hoverIndex, type);
      draggedItem.index = hoverIndex;
    },
  });

  const [{ isDragging }, drag, preview] = useDrag({
    type,
    item: () => ({ id: item.id, index }),
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
    canDrag: isReordering,
  });

  drag(drop(ref));

  return (
    <div ref={preview} style={{ opacity: isDragging ? 0.5 : 1 }} className="relative">
      <div ref={ref}>
        {children}
      </div>
      {isReordering && (
        <div className="absolute top-2 right-2 cursor-move text-muted-foreground bg-background/50 p-1 rounded-md">
          <Move className="h-5 w-5" />
        </div>
      )}
    </div>
  );
};


export default function AdminPage() {
  const { isAuthenticated, user, logout } = useAuth();
  const router = useRouter();
  const { toast } = useToast();
  
  const [structures, setStructures] = useState<Structure[]>([]);
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [directContacts, setDirectContacts] = useState<Contact[]>([]);
  const [subDeptContacts, setSubDeptContacts] = useState<Contact[]>([]);

  // Reordering state
  const [isReordering, setIsReordering] = useState(false);
  
  // Navigation state
  const [view, setView] = useState<View>('structures');
  const [selectedStructure, setSelectedStructure] = useState<Structure | null>(null);
  const [selectedSubDepartment, setSelectedSubDepartment] = useState<SubDepartment | null>(null);

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
  const [deletingContact, setDeletingContact] = useState<Contact | null>(null);
  const [isDeleteAlertOpen, setIsDeleteAlertOpen] = useState(false);
  
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
        setStructures(structuresData);
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

  // --- Reordering Logic ---
  const moveCard = useCallback((dragIndex: number, hoverIndex: number, itemType: ItemType) => {
    if (itemType === 'structure') {
      setStructures((prev) => update(prev, { $splice: [[dragIndex, 1], [hoverIndex, 0, prev[dragIndex]]], }));
    } else if (itemType === 'subdepartment' && selectedStructure) {
      setSelectedStructure((prev) => {
        if (!prev) return null;
        const newSubDepts = update(prev.subDepartments, { $splice: [[dragIndex, 1], [hoverIndex, 0, prev.subDepartments[dragIndex]]], });
        return { ...prev, subDepartments: newSubDepts };
      });
    } else if (itemType === 'contact') {
        if (view === 'subdepartments') { // Direct contacts
            setDirectContacts(prev => update(prev, {$splice: [[dragIndex, 1], [hoverIndex, 0, prev[dragIndex]]],}));
        } else if (view === 'contacts') { // Sub-department contacts
            setSubDeptContacts(prev => update(prev, {$splice: [[dragIndex, 1], [hoverIndex, 0, prev[dragIndex]]],}));
        }
    }
  }, [view, selectedStructure]);

  const handleSaveOrder = async () => {
    let payload;
    let endpointType: ItemType | '' = '';

    if (view === 'structures') {
        endpointType = 'structure';
        payload = structures.map((s, index) => ({ id: s.id, displayOrder: index }));
    } else if (view === 'subdepartments' && selectedStructure) {
        endpointType = 'subdepartment';
        payload = selectedStructure.subDepartments.map((s, index) => ({ id: s.id, displayOrder: index }));
        // Also save order of direct contacts if they were reordered
        const directContactsPayload = directContacts.map((c, index) => ({ id: c.id, displayOrder: index }));
        if (directContactsPayload.length > 0) {
            await fetch('/api/reorder', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ type: 'contact', items: directContactsPayload }),
            });
        }
    } else if (view === 'contacts' && selectedSubDepartment) {
        endpointType = 'contact';
        payload = subDeptContacts.map((c, index) => ({ id: c.id, displayOrder: index }));
    }

    if (payload && endpointType) {
        const response = await fetch('/api/reorder', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ type: endpointType, items: payload }),
        });

        if (response.ok) {
            toast({ title: 'Succès', description: "L'ordre a été sauvegardé." });
            await fetchData();
        } else {
            toast({ variant: 'destructive', title: 'Erreur', description: "Impossible de sauvegarder l'ordre." });
        }
    }
    setIsReordering(false);
  };
  

  // --- Navigation ---
  const navigateToStructureDetail = (structure: Structure) => {
    setSelectedStructure(structure);
    setDirectContacts(getContactsForStructure(structure.id));
    setView('subdepartments');
  };

  const navigateToSubDepartmentDetail = (subDepartment: SubDepartment) => {
    setSelectedSubDepartment(subDepartment);
    setSubDeptContacts(getContactsForSubDepartment(subDepartment.id));
    setView('contacts');
  };

  const goBack = () => {
    setIsReordering(false); // Disable reordering on navigation
    if (view === 'contacts') {
      setSelectedSubDepartment(null);
      setSubDeptContacts([]);
      setView('subdepartments');
    } else if (view === 'subdepartments') {
      setSelectedSubDepartment(null);
      setSelectedStructure(null);
      setDirectContacts([]);
      setView('structures');
    }
  };
  
  const getBreadcrumbItems = () => {
    const items = [{ label: 'Administration', onClick: () => { setSelectedStructure(null); setSelectedSubDepartment(null); setView('structures'); setIsReordering(false); } }];
    if (selectedStructure) {
      items.push({ label: selectedStructure.name, onClick: () => { setSelectedSubDepartment(null); setView('subdepartments'); setIsReordering(false); } });
    }
    if (selectedSubDepartment) {
      items.push({ label: selectedSubDepartment.name, onClick: () => {} });
    }
    return items.map((item, index) => ({
      label: item.label,
      href: '#',
      onClick: (e: React.MouseEvent) => { e.preventDefault(); if(index < items.length - 1) item.onClick(); },
    }));
  };

  
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

  const handleDeleteStructure = (structure: Structure) => {
    setDeletingStructure(structure);
    setIsDeleteAlertOpen(true);
  }

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

  const handleDeleteSubDepartment = (subDepartment: SubDepartment) => {
    setDeletingSubDepartment(subDepartment);
    setIsDeleteAlertOpen(true);
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
        structureId: selectedStructure?.id || '',
        subDepartmentId: selectedSubDepartment?.id || '',
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
  
  const handleDeleteContact = (contact: Contact) => {
    setDeletingContact(contact);
    setIsDeleteAlertOpen(true);
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

  // --- Delete confirmation ---
  const confirmDelete = async () => {
    let response;
    if (deletingStructure) {
      response = await fetch(`/api/structures/${deletingStructure.id}`, { method: 'DELETE' });
    } else if (deletingSubDepartment) {
      response = await fetch(`/api/subdepartments/${deletingSubDepartment.id}`, { method: 'DELETE' });
    } else if (deletingContact) {
      response = await fetch(`/api/contacts/${deletingContact.id}`, { method: 'DELETE' });
    }

    if (response && response.ok) {
      await fetchData();
      if (deletingStructure) {
        const updatedStructures = structures.filter(s => s.id !== deletingStructure.id);
        if (selectedStructure && selectedStructure.id === deletingStructure.id) {
          goBack();
        }
      }
    } else {
      console.error("Failed to delete item");
    }
    
    setDeletingStructure(null);
    setDeletingSubDepartment(null);
    setDeletingContact(null);
    setIsDeleteAlertOpen(false);
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
  
  const getContactsForStructure = (structureId: string) => {
    return contacts.filter(c => c.structureId === structureId && !c.subDepartmentId);
  }

  const getContactsForSubDepartment = (subDepartmentId: string) => {
    return contacts.filter(c => c.subDepartmentId === subDepartmentId);
  }

  if (!isAuthenticated) {
    return null;
  }
  
  const breadcrumbItems = getBreadcrumbItems();

  const renderContent = () => {
    switch (view) {
      case 'structures':
        return (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {structures.map((structure, index) => {
              const structureContacts = contacts.filter(c => c.structureId === structure.id);
              return(
              <DraggableCard key={structure.id} item={structure} type="structure" index={index} moveCard={moveCard} isReordering={isReordering}>
                <Card className="flex flex-col h-full">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Building className="h-5 w-5 text-primary" />
                      {structure.name}
                    </CardTitle>
                    <CardDescription>{structure.description || 'Pas de description'}</CardDescription>
                  </CardHeader>
                  <CardContent className="flex-grow space-y-2 text-sm">
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <Library className="h-4 w-4" />
                      <span>{structure.subDepartments.length} sous-direction(s)</span>
                    </div>
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <Users className="h-4 w-4" />
                      <span>{structureContacts.length} contact(s)</span>
                    </div>
                  </CardContent>
                  <CardFooter className="flex justify-between">
                    <Button variant="outline" onClick={() => navigateToStructureDetail(structure)}>
                      Voir le détail
                      <ChevronRight className="ml-2 h-4 w-4" />
                    </Button>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon">
                          <MoreVertical className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onSelect={() => handleEditStructure(structure)}>
                          <Edit className="mr-2 h-4 w-4" /> Modifier
                        </DropdownMenuItem>
                        <DropdownMenuItem onSelect={() => handleDeleteStructure(structure)} className="text-destructive">
                          <Trash2 className="mr-2 h-4 w-4" /> Supprimer
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </CardFooter>
                </Card>
              </DraggableCard>
            )})}
          </div>
        );
      case 'subdepartments':
        if (!selectedStructure) return null;
        return (
          <div>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold">Sous-directions</h2>
              <Button onClick={() => handleAddNewSubDepartment(selectedStructure.id)}>
                <PlusCircle className="mr-2 h-4 w-4"/> Ajouter une sous-direction
              </Button>
            </div>
            {selectedStructure.subDepartments.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {selectedStructure.subDepartments.map((sub, index) => {
                  const subContactsCount = contacts.filter(c => c.subDepartmentId === sub.id).length;
                  return (
                    <DraggableCard key={sub.id} item={sub} type="subdepartment" index={index} moveCard={moveCard} isReordering={isReordering}>
                      <Card className="flex flex-col h-full">
                        <CardHeader>
                          <CardTitle className="flex items-center gap-2">
                            <Library className="h-5 w-5 text-primary" />
                            {sub.name}
                          </CardTitle>
                        </CardHeader>
                        <CardContent className="flex-grow">
                           <div className="flex items-center gap-2 text-sm text-muted-foreground">
                              <Users className="h-4 w-4" />
                              <span>{subContactsCount} contact(s)</span>
                           </div>
                        </CardContent>
                        <CardFooter className="flex justify-between">
                          <Button variant="outline" onClick={() => navigateToSubDepartmentDetail(sub)}>
                              Voir les contacts
                              <ChevronRight className="ml-2 h-4 w-4" />
                          </Button>
                           <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="icon">
                                  <MoreVertical className="h-4 w-4" />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end">
                                <DropdownMenuItem onSelect={() => handleEditSubDepartment(sub)}>
                                  <Edit className="mr-2 h-4 w-4" /> Modifier
                                </DropdownMenuItem>
                                <DropdownMenuItem onSelect={() => handleDeleteSubDepartment(sub)} className="text-destructive">
                                  <Trash2 className="mr-2 h-4 w-4" /> Supprimer
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                        </CardFooter>
                      </Card>
                    </DraggableCard>
                )})}
              </div>
            ) : <p className="text-muted-foreground text-center py-8">Aucune sous-direction dans cette structure.</p>}
            
            <Separator className="my-8" />
            
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold">Contacts directs</h2>
               <Button onClick={handleAddNewContact}>
                <UserPlus className="mr-2 h-4 w-4"/> Ajouter un contact
              </Button>
            </div>
            {directContacts.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {directContacts.map((contact, index) => (
                      <DraggableCard key={contact.id} item={contact} type="contact" index={index} moveCard={moveCard} isReordering={isReordering}>
                        <Card>
                          <CardHeader className="flex flex-row items-start justify-between">
                            <div className="flex items-center gap-4">
                              <Avatar>
                                <AvatarFallback>{contact.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                              </Avatar>
                              <div>
                                <CardTitle className="text-lg">{contact.name}</CardTitle>
                                <CardDescription>{contact.title}</CardDescription>
                              </div>
                            </div>
                             <DropdownMenu>
                                <DropdownMenuTrigger asChild><Button variant="ghost" size="icon"><MoreVertical className="h-4 w-4" /></Button></DropdownMenuTrigger>
                                <DropdownMenuContent align="end">
                                  <DropdownMenuItem onSelect={() => handleEditContact(contact)}><Edit className="mr-2 h-4 w-4" /> Modifier</DropdownMenuItem>
                                  <DropdownMenuItem onSelect={() => handleDeleteContact(contact)} className="text-destructive"><Trash2 className="mr-2 h-4 w-4" /> Supprimer</DropdownMenuItem>
                                </DropdownMenuContent>
                              </DropdownMenu>
                          </CardHeader>
                          <CardContent className="text-sm space-y-2">
                             <p><Phone className="inline mr-2 h-4 w-4" />{`${contact.threeDigits} ${contact.fourDigits} ${contact.fourDigitsXX}`}</p>
                             {contact.fourDigitsYY && <p><Smartphone className="inline mr-2 h-4 w-4" />{contact.fourDigitsYY}</p>}
                          </CardContent>
                        </Card>
                      </DraggableCard>
                    ))}
                </div>
            ) : <p className="text-muted-foreground text-center py-8">Aucun contact direct dans cette structure.</p>}

          </div>
        );
      case 'contacts':
        if (!selectedSubDepartment) return null;
        return (
          <div>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold">Contacts de {selectedSubDepartment.name}</h2>
              <Button onClick={handleAddNewContact}>
                <UserPlus className="mr-2 h-4 w-4"/> Ajouter un contact
              </Button>
            </div>
            {subDeptContacts.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {subDeptContacts.map((contact, index) => (
                   <DraggableCard key={contact.id} item={contact} type="contact" index={index} moveCard={moveCard} isReordering={isReordering}>
                     <Card>
                        <CardHeader className="flex flex-row items-start justify-between">
                          <div className="flex items-center gap-4">
                            <Avatar>
                              <AvatarFallback>{contact.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                            </Avatar>
                            <div>
                              <CardTitle className="text-lg">{contact.name}</CardTitle>
                              <CardDescription>{contact.title}</CardDescription>
                            </div>
                          </div>
                           <DropdownMenu>
                              <DropdownMenuTrigger asChild><Button variant="ghost" size="icon"><MoreVertical className="h-4 w-4" /></Button></DropdownMenuTrigger>
                              <DropdownMenuContent align="end">
                                <DropdownMenuItem onSelect={() => handleEditContact(contact)}><Edit className="mr-2 h-4 w-4" /> Modifier</DropdownMenuItem>
                                <DropdownMenuItem onSelect={() => handleDeleteContact(contact)} className="text-destructive"><Trash2 className="mr-2 h-4 w-4" /> Supprimer</DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                        </CardHeader>
                        <CardContent className="text-sm space-y-2">
                           <p><Phone className="inline mr-2 h-4 w-4" />{`${contact.threeDigits} ${contact.fourDigits} ${contact.fourDigitsXX}`}</p>
                           {contact.fourDigitsYY && <p><Smartphone className="inline mr-2 h-4 w-4" />{contact.fourDigitsYY}</p>}
                        </CardContent>
                      </Card>
                   </DraggableCard>
                ))}
              </div>
            ) : <p className="text-muted-foreground text-center py-8">Aucun contact dans cette sous-direction.</p>}
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <DndProvider backend={HTML5Backend}>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
             <h1 className="font-headline text-3xl font-bold tracking-tight">
              Administration
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
              <div>
                 {view !== 'structures' ? (
                  <div className="flex items-center gap-4">
                    <Button variant="outline" size="icon" onClick={goBack}>
                      <ArrowLeft className="h-4 w-4" />
                    </Button>
                    <div>
                      <nav aria-label="Breadcrumb" className={'mb-1'}>
                        <ol className="flex items-center space-x-1 text-sm text-muted-foreground md:space-x-2">
                          {breadcrumbItems.map((item, index) => (
                            <li key={index} className="flex items-center">
                              <button
                                onClick={item.onClick}
                                className={`capitalize hover:text-primary ${index === breadcrumbItems.length - 1 ? 'font-medium text-foreground pointer-events-none' : ''}`}
                              >
                                {item.label}
                              </button>
                              {index < breadcrumbItems.length - 1 && (
                                <ChevronRight className="ml-1 h-4 w-4 flex-shrink-0 md:ml-2" />
                              )}
                            </li>
                          ))}
                        </ol>
                      </nav>
                       <CardTitle>Gérer {selectedSubDepartment?.name || selectedStructure?.name || 'les entités'}</CardTitle>
                    </div>
                  </div>
                ) : (
                  <CardTitle>Gérer les structures</CardTitle>
                )}
              </div>
              
              <div className="flex items-center gap-2">
                {isReordering ? (
                    <Button onClick={handleSaveOrder}>Enregistrer l'ordre</Button>
                ) : null}

                <Button variant={isReordering ? 'destructive' : 'outline'} onClick={() => setIsReordering(!isReordering)}>
                    {isReordering ? 'Annuler le tri' : 'Activer le tri'}
                </Button>
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
                       setParentStructureId(selectedStructure?.id || '');
                       setIsSubDepartmentDialogOpen(true);
                     }} disabled={!selectedStructure}>
                      <Library className="mr-2 h-4 w-4" />
                      <span>Sous-direction</span>
                    </DropdownMenuItem>
                    <DropdownMenuItem onSelect={handleAddNewContact} disabled={!selectedStructure}>
                      <UserPlus className="mr-2 h-4 w-4" />
                      <span>Contact</span>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>

            </div>
          </CardHeader>
          <CardContent>
            {renderContent()}
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
        
        {/* Delete Confirmation Dialog */}
        <AlertDialog open={isDeleteAlertOpen} onOpenChange={setIsDeleteAlertOpen}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Êtes-vous sûr ?</AlertDialogTitle>
              <AlertDialogDescription>
                Cette action est irréversible. L'élément et toutes ses données associées (sous-directions, contacts) seront définitivement supprimés.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel onClick={() => setIsDeleteAlertOpen(false)}>Annuler</AlertDialogCancel>
              <AlertDialogAction onClick={confirmDelete}>Supprimer</AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </DndProvider>
  );
}
