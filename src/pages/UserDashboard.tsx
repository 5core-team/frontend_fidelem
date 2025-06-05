import { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import Navbar from "@/components/Navbar";
import CreditSimulator from "@/components/CreditSimulator";
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
  FileText,
  ChevronRight,
  User,
  CreditCard,
  PiggyBank,
  Plus
} from "lucide-react";
import { toast } from "sonner";
import {
  CircularProgressbarWithChildren,
  buildStyles
} from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";
import { AddCreditRequestForm } from "@/components/AddCreditRequestForm";
import { CreditSimulatorModal } from "@/components/CreditSimulatorModal";
import { EditProfileForm } from "@/components/EditProfileForm";
import { getCreditRequests, getActiveCredits } from "../config/api";

const UserDashboard = () => {
  const { user, isAuthenticated } = useAuth();
  const [isLoading, setIsLoading] = useState(true);
  const [addCreditRequestOpen, setAddCreditRequestOpen] = useState(false);
  const [simulatorModalOpen, setSimulatorModalOpen] = useState(false);
  const [editProfileOpen, setEditProfileOpen] = useState(false);
  const [creditRequests, setCreditRequests] = useState([]);
  const [activeCredits, setActiveCredits] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const userId = user?.id;
        const [requests, credits] = await Promise.all([
          getCreditRequests(userId),
          getActiveCredits(userId)
        ]);
        setCreditRequests(requests);
        setActiveCredits(credits);
      } catch (error) {
        console.error("Error fetching data:", error);
        toast.error("Erreur lors de la récupération des données");
      } finally {
        setIsLoading(false);
      }
    };

    if (user?.id) {
      fetchData();
    }
  }, [user?.id]);

  if (!isAuthenticated || user?.role !== "user") {
    return <Navigate to="/login" replace />;
  }

  return (
    <div className="min-h-screen bg-fidelem-light">
      <Navbar />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-fidelem">Mon espace personnel</h1>
            <p className="text-gray-600 mt-1">Bienvenue, {user.name}</p>
          </div>
          <div className="mt-4 md:mt-0 flex items-center gap-3">
            <Button
              className="bg-fidelem hover:bg-fidelem/90"
              onClick={() => setEditProfileOpen(true)}
            >
              <User size={16} className="mr-1" /> Mon profil
            </Button>
          </div>
        </div>

        <UserSummary isLoading={isLoading} />

        <Tabs defaultValue="dashboard" className="mt-8">
          <TabsList className="grid w-full md:w-auto grid-cols-2">
            <TabsTrigger value="dashboard">Tableau de bord</TabsTrigger>
            <TabsTrigger value="simulator">Simulateur</TabsTrigger>
          </TabsList>

          <TabsContent value="dashboard" className="mt-6">
            <div className="grid md:grid-cols-3 gap-6">
              <div className="md:col-span-2 space-y-6">
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between">
                    <div>
                      <CardTitle>Mes demandes de crédit</CardTitle>
                      <CardDescription>
                        Suivez l'état de vos demandes de crédit en cours.
                      </CardDescription>
                    </div>
                    <Button
                      className="bg-fidelem hover:bg-fidelem/90 flex items-center gap-2"
                      onClick={() => setAddCreditRequestOpen(true)}
                    >
                      <Plus size={16} /> Nouvelle demande
                    </Button>
                  </CardHeader>
                  <CardContent>
                    {creditRequests.length > 0 ? (
                      <div className="border rounded-lg overflow-hidden">
                        <Table>
                          <TableHeader>
                            <TableRow className="bg-gray-50">
                              <TableHead>ID</TableHead>
                              <TableHead>Montant</TableHead>
                              <TableHead>Objet</TableHead>
                              <TableHead>Statut</TableHead>
                              <TableHead>Date</TableHead>
                              <TableHead>Conseiller</TableHead>
                            </TableRow>
                          </TableHeader>
                          <TableBody>
                            {creditRequests.map((request) => (
                              <TableRow key={request.id}>
                                <TableCell className="font-medium">{request.id}</TableCell>
                                <TableCell>{request.amount.toLocaleString('fr-FR')} €</TableCell>
                                <TableCell>{request.purpose}</TableCell>
                                <TableCell>
                                  {request.status === "Approuvée" && (
                                    <Badge className="bg-green-500">Approuvée</Badge>
                                  )}
                                  {request.status === "En attente" && (
                                    <Badge className="bg-amber-500">En attente</Badge>
                                  )}
                                  {request.status === "Rejetée" && (
                                    <Badge className="bg-red-500">Rejetée</Badge>
                                  )}
                                </TableCell>
                                <TableCell>{new Date(request.created_at).toLocaleDateString("fr-FR")}</TableCell>
                                <TableCell>{request.user?.advisor?.name || 'Non assigné'}</TableCell>
                              </TableRow>
                            ))}
                          </TableBody>
                        </Table>
                      </div>
                    ) : (
                      <div className="text-center py-8">
                        <FileText className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                        <h3 className="text-lg font-medium text-gray-900 mb-1">Aucune demande en cours</h3>
                        <p className="text-gray-500">
                          Vous n'avez pas encore de demande de crédit.
                        </p>
                      </div>
                    )}
                  </CardContent>
                  <CardFooter className="flex justify-end">
                    <Button
                      variant="outline"
                      onClick={() => setAddCreditRequestOpen(true)}
                      className="text-fidelem border-fidelem hover:bg-fidelem/10"
                    >
                      Nouvelle demande <ChevronRight size={16} className="ml-1" />
                    </Button>
                  </CardFooter>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Mes crédits actifs</CardTitle>
                    <CardDescription>
                      Consultez les informations sur vos crédits en cours.
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    {activeCredits.length > 0 ? (
                      <div className="border rounded-lg overflow-hidden">
                        <Table>
                          <TableHeader>
                            <TableRow className="bg-gray-50">
                              
                              <TableHead>Montant</TableHead>
                              <TableHead>Mensualité</TableHead>
                              <TableHead>Objet</TableHead>
                            
                            </TableRow>
                          </TableHeader>
                          <TableBody>
                            {activeCredits.map((credit) => (
                              <TableRow key={credit.id}>
                                <TableCell>{credit.amount.toLocaleString('fr-FR')} €</TableCell>
                                <TableCell>{credit.duration} mois</TableCell>
                                <TableCell>{credit.purpose}</TableCell>
                              </TableRow>
                            ))}
                          </TableBody>
                        </Table>
                      </div>
                    ) : (
                      <div className="text-center py-8">
                        <CreditCard className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                        <h3 className="text-lg font-medium text-gray-900 mb-1">Aucun crédit actif</h3>
                        <p className="text-gray-500">
                          Vous n'avez pas encore de crédit actif.
                        </p>
                      </div>
                    )}
                  </CardContent>
                 
                </Card>
              </div>

              <div>
                <Card>
                  <CardHeader>
                    <CardTitle>Mon profil</CardTitle>
                    <CardDescription>
                      Informations personnelles
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="flex flex-col items-center mb-6">
                      <div className="bg-fidelem text-white rounded-full p-4 mb-3">
                        <User size={32} />
                      </div>
                      <h3 className="font-semibold text-lg">{user?.name}</h3>
                      <p className="text-gray-500">{user?.email}</p>
                    </div>
                    <div className="space-y-4">
                      
                      <div>
                        <p className="text-sm text-gray-500">Téléphone</p>
                        <p className="font-medium">{user?.phone}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">Adresse</p>
                        <p className="font-medium">{user?.address}</p>
                      </div>
                    </div>
                  </CardContent>
                  <CardFooter>
                    <Button
                      variant="outline"
                      className="w-full"
                      onClick={() => setEditProfileOpen(true)}
                    >
                      Modifier mon profil
                    </Button>
                  </CardFooter>
                </Card>

                <Card className="mt-6">
                  <CardHeader>
                    <CardTitle>Simuler un crédit</CardTitle>
                    <CardDescription>
                      Estimez vos mensualités rapidement
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="text-center">
                    <PiggyBank size={48} className="text-fidelem mx-auto mb-4" />
                    <p className="mb-4">
                      Utilisez notre simulateur pour estimer vos mensualités et le coût total de votre crédit.
                    </p>
                    <Button
                      className="bg-fidelem hover:bg-fidelem/90 w-full"
                      onClick={() => setSimulatorModalOpen(true)}
                    >
                      Accéder au simulateur
                    </Button>
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>


          <TabsContent value="simulator" className="mt-6">
            <CreditSimulator className="max-w-3xl mx-auto" />
          </TabsContent>
        </Tabs>
      </div>

      <AddCreditRequestForm open={addCreditRequestOpen} onOpenChange={setAddCreditRequestOpen} />
      <CreditSimulatorModal open={simulatorModalOpen} onOpenChange={setSimulatorModalOpen} />
      <EditProfileForm open={editProfileOpen} onOpenChange={setEditProfileOpen} />
    </div>
  );
};

const UserSummary = ({ isLoading }: { isLoading: boolean }) => {
  

  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
   
    </div>
  );
};

export default UserDashboard;
