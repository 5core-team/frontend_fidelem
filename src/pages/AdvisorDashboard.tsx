import { useState, useEffect } from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import Navbar from "@/components/Navbar";

import {
  getClientsByAdvisor,
  getAdvisorStats,
  getCreditRequestsConseiller,
} from "../config/api"; // Import the API functions
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
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
  TableRow,
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
  User,
} from "lucide-react";
import { toast } from "sonner";
import { AddClientForm } from "@/components/AddClientForm";
import { AddCreditRequestForm } from "@/components/AddCreditRequestForm";
import { EditProfileForm } from "@/components/EditProfileForm";

const AdvisorDashboard = () => {
  const { user, isAuthenticated } = useAuth();
  const [searchQuery, setSearchQuery] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [addClientOpen, setAddClientOpen] = useState(false);
  const [addCreditRequestOpen, setAddCreditRequestOpen] = useState(false);
  const [editProfileOpen, setEditProfileOpen] = useState(false);
  const [clients, setClients] = useState([]);
  const [creditRequests, setCreditRequests] = useState([]);
  const [userStats, setUserStats] = useState({
    totalUsers: 0,
    pendingUsers: 0,
    pendingRequests: 0,
    approvedRequests: 0,
  });

  useEffect(() => {
    const fetchData = async () => {
      if (!user?.id) return;

      try {
        const [clientsResponse, statsResponse, creditRequestsResponse] =
          await Promise.all([
            getClientsByAdvisor(user.id),
            getAdvisorStats(user.id),
            getCreditRequestsConseiller
            (user.id), // Utilisez getCreditRequests au lieu de getCreditRequestsByAdvisor
          ]);

        setClients(clientsResponse.data);
        setUserStats(statsResponse.data);
        setCreditRequests(creditRequestsResponse); // Pas de .data ici car getCreditRequests retourne déjà response.data
      } catch (error) {
        toast.error("Erreur lors de la récupération des données");
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [user?.id]);

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
            <h1 className="text-3xl font-bold text-fidelem">
              Tableau de bord Conseiller
            </h1>
            <p className="text-gray-600 mt-1">
              Gérez vos clients et les demandes de crédit
            </p>
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
          </div>
        </div>

        <Summary isLoading={isLoading} userStats={userStats} />

        <Tabs defaultValue="credit-requests" className="mt-8">
          <TabsList className="grid w-full md:w-auto grid-cols-2">
            <TabsTrigger value="credit-requests">
              Demandes de crédit
            </TabsTrigger>
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
              </CardHeader>
              <CardContent>
                <div className="flex flex-col sm:flex-row justify-between items-center gap-4 mb-4">
                  <div className="relative w-full sm:w-auto">
                    <Search
                      className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                      size={18}
                    />
                    <Input
                      placeholder="Rechercher une demande..."
                      className="pl-10 w-full sm:w-80"
                    />
                  </div>
                </div>

                <div className="border rounded-lg overflow-hidden">
                  <Table>
                    <TableHeader>
                      <TableRow className="bg-gray-50">
                        <TableHead>Client</TableHead>
                        <TableHead>Montant</TableHead>
                        <TableHead>Durée</TableHead>
                        <TableHead>Objet</TableHead>
                        <TableHead>Statut</TableHead>
                        <TableHead>Date</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {creditRequests.map((request) => (
                        <TableRow key={request.id}>
                          <TableCell>{request.user?.name || "N/A"}</TableCell>
                          <TableCell>
                            {request.amount.toLocaleString("fr-FR")} F
                          </TableCell>
                          <TableCell>{request.duration} mois</TableCell>
                          <TableCell>{request.purpose}</TableCell>
                          <TableCell>
                            {request.status === "Approuvé" && (
                              <Badge className="bg-green-500">Approuvée</Badge>
                            )}
                            {request.status === "En attente" && (
                              <Badge className="bg-amber-500">En attente</Badge>
                            )}
                            {request.status === "Réjetée" && (
                              <Badge className="bg-red-500">Rejetée</Badge>
                            )}
                          </TableCell>
                          <TableCell>
                            {new Date(request.created_at).toLocaleDateString(
                              "fr-FR"
                            )}
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
                    <Search
                      className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                      size={18}
                    />
                    <Input
                      placeholder="Rechercher un client..."
                      className="pl-10 w-full sm:w-80"
                    />
                  </div>
                </div>

                <div className="border rounded-lg overflow-hidden">
                  <Table>
                    <TableHeader>
                      <TableRow className="bg-gray-50">
                        
                        <TableHead>Nom</TableHead>
                        <TableHead>Email</TableHead>
                        <TableHead>Téléphone</TableHead>
                        <TableHead>Statut</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {clients.map((client) => (
                        <TableRow key={client.id}>
                          
                          <TableCell>{client.name}</TableCell>
                          <TableCell>{client.email}</TableCell>
                          <TableCell>{client.phone}</TableCell>
                          <TableCell>
                            {client.statut === "Actif" && (
                              <Badge className="bg-green-500">Actif</Badge>
                            )}
                            {client.statut === "En attente" && (
                              <Badge className="bg-amber-500">En attente</Badge>
                            )}
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
      <AddCreditRequestForm
        open={addCreditRequestOpen}
        onOpenChange={setAddCreditRequestOpen}
        isAdvisor={true}
      />
      <EditProfileForm
        open={editProfileOpen}
        onOpenChange={setEditProfileOpen}
      />
    </div>
  );
};

// Summary cards for advisor dashboard
const Summary = ({
  isLoading,
  userStats,
}: {
  isLoading: boolean;
  userStats: {
    totalUsers: number;
    pendingUsers: number;
    pendingRequests: number;
    approvedRequests: number;
  };
}) => {
  const statsItems = [
    {
      title: "Clients",
      value: userStats.totalUsers,
      icon: <Users className="h-8 w-8 text-blue-600" />,
      color: "bg-blue-50 text-blue-600 border-blue-200",
    },
    {
      title: "Clients en attente",
      value: userStats.pendingUsers,
      icon: <Clock className="h-8 w-8 text-amber-600" />,
      color: "bg-amber-50 text-amber-600 border-amber-200",
    },
    {
      title: "Demandes en cours",
      value: userStats.pendingRequests,
      icon: <FileText className="h-8 w-8 text-green-600" />,
      color: "bg-green-50 text-green-600 border-green-200",
    },
    {
      title: "Demandes approuvées",
      value: userStats.approvedRequests,
      icon: <CheckCircle className="h-8 w-8 text-indigo-600" />,
      color: "bg-indigo-50 text-indigo-600 border-indigo-200",
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
      {statsItems.map((item, index) => (
        <div
          key={index}
          className={`transition-opacity duration-500 ${
            isLoading ? "opacity-0" : "opacity-100"
          }`}
          style={{ transitionDelay: `${index * 100}ms` }}
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
