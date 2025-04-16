import { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import Navbar from "@/components/Navbar";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { 
  Users, 
  Clock, 
  Plus, 
  Search, 
  FileText, 
  CheckCircle, 
  XCircle, 
  MoreHorizontal,
  Eye,
  Edit,
  MessageSquare,
  UserPlus,
  User
} from "lucide-react";
import { toast } from "sonner";
import { AddClientForm } from "@/components/AddClientForm";
import { AddCreditRequestForm } from "@/components/AddCreditRequestForm";
import { EditProfileForm } from "@/components/EditProfileForm";

// Mock data for credit requests
const creditRequests = [
  {
    id: "CR001",
    clientName: "Sophie Martin",
    amount: 15000,
    duration: 36,
    purpose: "Achat automobile",
    status: "approved",
    date: "2023-04-01"
  },
  {
    id: "CR002",
    clientName: "Thomas Bernard",
    amount: 25000,
    duration: 48,
    purpose: "Rénovation",
    status: "pending",
    date: "2023-04-02"
  },
  {
    id: "CR003",
    clientName: "Julie Petit",
    amount: 8000,
    duration: 24,
    purpose: "Personnel",
    status: "pending",
    date: "2023-04-03"
  },
  {
    id: "CR004",
    clientName: "Marc Dubois",
    amount: 12000,
    duration: 36,
    purpose: "Études",
    status: "rejected",
    date: "2023-03-28"
  },
  {
    id: "CR005",
    clientName: "Caroline Leroy",
    amount: 7500,
    duration: 18,
    purpose: "Personnel",
    status: "approved",
    date: "2023-03-25"
  }
];

// Mock data for clients
const clients = [
  {
    id: "CL001",
    name: "Sophie Martin",
    email: "sophie.martin@example.com",
    phone: "+33 6 12 34 56 78",
    status: "active"
  },
  {
    id: "CL002",
    name: "Thomas Bernard",
    email: "thomas.bernard@example.com",
    phone: "+33 6 23 45 67 89",
    status: "active"
  },
  {
    id: "CL003",
    name: "Julie Petit",
    email: "julie.petit@example.com",
    phone: "+33 6 34 56 78 90",
    status: "pending"
  },
  {
    id: "CL004",
    name: "Marc Dubois",
    email: "marc.dubois@example.com",
    phone: "+33 6 45 67 89 01",
    status: "active"
  },
  {
    id: "CL005",
    name: "Caroline Leroy",
    email: "caroline.leroy@example.com",
    phone: "+33 6 56 78 90 12",
    status: "active"
  }
];

const AdvisorDashboard = () => {
  const { user, isAuthenticated } = useAuth();
  const [searchQuery, setSearchQuery] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [addClientOpen, setAddClientOpen] = useState(false);
  const [addCreditRequestOpen, setAddCreditRequestOpen] = useState(false);
  const [editProfileOpen, setEditProfileOpen] = useState(false);
  
  useEffect(() => {
    // Simulate loading data
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1000);
    
    return () => clearTimeout(timer);
  }, []);

  // Redirect if not authenticated or not an advisor
  if (!isAuthenticated || user?.role !== "advisor") {
    return <Navigate to="/login" replace />;
  }
  
  const handleCreateCreditRequest = () => {
    setAddCreditRequestOpen(true);
  };
  
  const handleAddClient = () => {
    setAddClientOpen(true);
  };
  
  return (
    <div className="min-h-screen bg-fidelem-light">
      <Navbar />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-fidelem">Tableau de bord Conseiller</h1>
            <p className="text-gray-600 mt-1">Gérez vos clients et les demandes de crédit</p>
          </div>
          <div className="mt-4 md:mt-0 space-x-2 flex">
            <Button 
              className="bg-fidelem hover:bg-fidelem/90 flex items-center gap-2"
              onClick={() => setEditProfileOpen(true)}
            >
              <User size={16} /> Mon profil
            </Button>
            <Button 
              className="bg-fidelem hover:bg-fidelem/90 flex items-center gap-2"
              onClick={handleAddClient}
            >
              <UserPlus size={16} /> Ajouter un client
            </Button>
            <Button 
              className="bg-fidelem hover:bg-fidelem/90 flex items-center gap-2"
              onClick={handleCreateCreditRequest}
            >
              <Plus size={16} /> Nouvelle demande
            </Button>
          </div>
        </div>
        
        <Summary isLoading={isLoading} />
        
        <Tabs defaultValue="credit-requests" className="mt-8">
          <TabsList className="grid w-full md:w-auto grid-cols-2">
            <TabsTrigger value="credit-requests">Demandes de crédit</TabsTrigger>
            <TabsTrigger value="clients">Clients</TabsTrigger>
          </TabsList>
          
          <TabsContent value="credit-requests" className="mt-6">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <div>
                  <CardTitle>Demandes de crédit</CardTitle>
                  <CardDescription>
                    Consultez et gérez les demandes de crédit de vos clients.
                  </CardDescription>
                </div>
                <Button 
                  className="bg-fidelem hover:bg-fidelem/90 flex items-center gap-2"
                  onClick={handleCreateCreditRequest}
                >
                  <Plus size={16} /> Nouvelle demande
                </Button>
              </CardHeader>
              <CardContent>
                <div className="flex flex-col sm:flex-row justify-between items-center gap-4 mb-4">
                  <div className="relative w-full sm:w-auto">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                    <Input 
                      placeholder="Rechercher une demande..." 
                      className="pl-10 w-full sm:w-80"
                    />
                  </div>
                  <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
                    <Button variant="outline" size="sm">Filtrer</Button>
                    <Button variant="outline" size="sm">Exporter</Button>
                  </div>
                </div>
                
                <div className="border rounded-lg overflow-hidden">
                  <Table>
                    <TableHeader>
                      <TableRow className="bg-gray-50">
                        <TableHead>ID</TableHead>
                        <TableHead>Client</TableHead>
                        <TableHead>Montant</TableHead>
                        <TableHead>Durée</TableHead>
                        <TableHead>Objet</TableHead>
                        <TableHead>Statut</TableHead>
                        <TableHead>Date</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {creditRequests.map((request) => (
                        <TableRow key={request.id}>
                          <TableCell className="font-medium">{request.id}</TableCell>
                          <TableCell>{request.clientName}</TableCell>
                          <TableCell>{request.amount.toLocaleString('fr-FR')} €</TableCell>
                          <TableCell>{request.duration} mois</TableCell>
                          <TableCell>{request.purpose}</TableCell>
                          <TableCell>
                            {request.status === "approved" && (
                              <Badge className="bg-green-500">Approuvée</Badge>
                            )}
                            {request.status === "pending" && (
                              <Badge className="bg-amber-500">En attente</Badge>
                            )}
                            {request.status === "rejected" && (
                              <Badge className="bg-red-500">Rejetée</Badge>
                            )}
                          </TableCell>
                          <TableCell>{new Date(request.date).toLocaleDateString("fr-FR")}</TableCell>
                          <TableCell className="text-right">
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button variant="ghost" className="h-8 w-8 p-0">
                                  <MoreHorizontal className="h-4 w-4" />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end">
                                <DropdownMenuLabel>Actions</DropdownMenuLabel>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem onClick={() => toast.success(`Détails de la demande ${request.id}`)}>
                                  <Eye className="mr-2 h-4 w-4" /> Voir détails
                                </DropdownMenuItem>
                                <DropdownMenuItem onClick={() => toast.success(`Édition de la demande ${request.id}`)}>
                                  <Edit className="mr-2 h-4 w-4" /> Éditer
                                </DropdownMenuItem>
                                <DropdownMenuItem onClick={() => toast.success(`Message au client ${request.clientName}`)}>
                                  <MessageSquare className="mr-2 h-4 w-4" /> Contacter client
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="clients" className="mt-6">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <div>
                  <CardTitle>Clients</CardTitle>
                  <CardDescription>
                    Consultez et gérez vos clients.
                  </CardDescription>
                </div>
                <Button 
                  onClick={handleAddClient}
                  className="bg-fidelem hover:bg-fidelem/90 flex items-center gap-2"
                >
                  <UserPlus size={16} /> Nouveau client
                </Button>
              </CardHeader>
              <CardContent>
                <div className="flex flex-col sm:flex-row justify-between items-center gap-4 mb-4">
                  <div className="relative w-full sm:w-auto">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                    <Input 
                      placeholder="Rechercher un client..." 
                      className="pl-10 w-full sm:w-80"
                    />
                  </div>
                  <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
                    <Button variant="outline" size="sm">Filtrer</Button>
                    <Button variant="outline" size="sm">Exporter</Button>
                  </div>
                </div>
                
                <div className="border rounded-lg overflow-hidden">
                  <Table>
                    <TableHeader>
                      <TableRow className="bg-gray-50">
                        <TableHead>ID</TableHead>
                        <TableHead>Nom</TableHead>
                        <TableHead>Email</TableHead>
                        <TableHead>Téléphone</TableHead>
                        <TableHead>Statut</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {clients.map((client) => (
                        <TableRow key={client.id}>
                          <TableCell className="font-medium">{client.id}</TableCell>
                          <TableCell>{client.name}</TableCell>
                          <TableCell>{client.email}</TableCell>
                          <TableCell>{client.phone}</TableCell>
                          <TableCell>
                            {client.status === "active" && (
                              <Badge className="bg-green-500">Actif</Badge>
                            )}
                            {client.status === "pending" && (
                              <Badge className="bg-amber-500">En attente</Badge>
                            )}
                          </TableCell>
                          <TableCell className="text-right">
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button variant="ghost" className="h-8 w-8 p-0">
                                  <MoreHorizontal className="h-4 w-4" />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end">
                                <DropdownMenuLabel>Actions</DropdownMenuLabel>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem onClick={() => toast.success(`Profil de ${client.name}`)}>
                                  <Eye className="mr-2 h-4 w-4" /> Voir profil
                                </DropdownMenuItem>
                                <DropdownMenuItem onClick={() => toast.success(`Édition du profil de ${client.name}`)}>
                                  <Edit className="mr-2 h-4 w-4" /> Éditer
                                </DropdownMenuItem>
                                <DropdownMenuItem onClick={() => toast.success(`Nouvelle demande pour ${client.name}`)}>
                                  <Plus className="mr-2 h-4 w-4" /> Nouvelle demande
                                </DropdownMenuItem>
                                <DropdownMenuItem onClick={() => toast.success(`Message à ${client.name}`)}>
                                  <MessageSquare className="mr-2 h-4 w-4" /> Contacter
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
      
      <AddClientForm open={addClientOpen} onOpenChange={setAddClientOpen} />
      <AddCreditRequestForm open={addCreditRequestOpen} onOpenChange={setAddCreditRequestOpen} isAdvisor={true} />
      <EditProfileForm open={editProfileOpen} onOpenChange={setEditProfileOpen} />
    </div>
  );
};

// Summary cards for advisor dashboard
const Summary = ({ isLoading }: { isLoading: boolean }) => {
  const statsItems = [
    {
      title: "Clients",
      value: "24",
      icon: <Users className="h-8 w-8 text-blue-600" />,
      color: "bg-blue-50 text-blue-600 border-blue-200"
    },
    {
      title: "Clients en attente",
      value: "3",
      icon: <Clock className="h-8 w-8 text-amber-600" />,
      color: "bg-amber-50 text-amber-600 border-amber-200"
    },
    {
      title: "Demandes en cours",
      value: "12",
      icon: <FileText className="h-8 w-8 text-green-600" />,
      color: "bg-green-50 text-green-600 border-green-200"
    },
    {
      title: "Demandes approuvées",
      value: "8",
      icon: <CheckCircle className="h-8 w-8 text-indigo-600" />,
      color: "bg-indigo-50 text-indigo-600 border-indigo-200"
    }
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
      {statsItems.map((item, index) => (
        <div
          key={index}
          className={`transition-opacity duration-500 ${isLoading ? 'opacity-0' : 'opacity-100'}`}
          style={{transitionDelay: `${index * 100}ms`}}
        >
          <Card className={`border ${item.color}`}>
            <CardContent className="p-6">
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-sm font-medium">{item.title}</p>
                  <div className="flex items-baseline mt-1">
                    <h3 className="text-2xl font-bold">
                      {isLoading ? (
                        <div className="h-8 w-16 bg-gray-200 animate-pulse rounded"></div>
                      ) : (
                        item.value
                      )}
                    </h3>
                  </div>
                </div>
                {item.icon}
              </div>
            </CardContent>
          </Card>
        </div>
      ))}
    </div>
  );
};

export default AdvisorDashboard;
