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
  Clock, 
  CheckCircle, 
  XCircle, 
  ChevronRight,
  User,
  CreditCard,
  PiggyBank,
  Bell,
  ChevronDown
} from "lucide-react";
import { toast } from "sonner";
import { 
  CircularProgressbarWithChildren,
  buildStyles
} from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";

const UserDashboard = () => {
  const { user, isAuthenticated } = useAuth();
  const [isLoading, setIsLoading] = useState(true);
  const [showNotifications, setShowNotifications] = useState(false);
  
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1000);
    
    return () => clearTimeout(timer);
  }, []);

  if (!isAuthenticated || user?.role !== "user") {
    return <Navigate to="/login" replace />;
  }
  
  const toggleNotifications = () => {
    setShowNotifications(!showNotifications);
  };
  
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
            <div className="relative">
              <Button 
                variant="ghost"
                onClick={toggleNotifications}
                className="relative"
              >
                <Bell size={20} />
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                  {notifications.filter(n => !n.read).length}
                </span>
              </Button>
              <AnimatePresence>
                {showNotifications && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 10 }}
                    className="absolute right-0 mt-2 w-80 bg-white rounded-md shadow-lg z-50"
                  >
                    <div className="p-3 border-b">
                      <h3 className="font-semibold">Notifications</h3>
                    </div>
                    <div className="max-h-80 overflow-y-auto">
                      {notifications.map(notification => (
                        <div 
                          key={notification.id}
                          className={`p-3 border-b hover:bg-gray-50 cursor-pointer ${notification.read ? 'opacity-70' : ''}`}
                        >
                          <div className="flex items-start gap-2">
                            {!notification.read && (
                              <div className="h-2 w-2 mt-1.5 rounded-full bg-red-500"></div>
                            )}
                            <div>
                              <p className="text-sm">{notification.message}</p>
                              <p className="text-xs text-gray-500 mt-1">
                                {new Date(notification.date).toLocaleDateString("fr-FR")}
                              </p>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                    <div className="p-2 text-center border-t">
                      <button className="text-sm text-fidelem hover:underline">
                        Voir toutes les notifications
                      </button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
            <Button className="bg-fidelem hover:bg-fidelem/90">
              Contacter mon conseiller
            </Button>
          </div>
        </div>
        
        <UserSummary isLoading={isLoading} />
        
        <Tabs defaultValue="dashboard" className="mt-8">
          <TabsList className="grid w-full md:w-auto grid-cols-3">
            <TabsTrigger value="dashboard">Tableau de bord</TabsTrigger>
            <TabsTrigger value="credits">Mes crédits</TabsTrigger>
            <TabsTrigger value="simulator">Simulateur</TabsTrigger>
          </TabsList>
          
          <TabsContent value="dashboard" className="mt-6">
            <div className="grid md:grid-cols-3 gap-6">
              <div className="md:col-span-2 space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Mes demandes de crédit</CardTitle>
                    <CardDescription>
                      Suivez l'état de vos demandes de crédit en cours.
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    {userCreditRequests.length > 0 ? (
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
                            {userCreditRequests.map((request) => (
                              <TableRow key={request.id}>
                                <TableCell className="font-medium">{request.id}</TableCell>
                                <TableCell>{request.amount.toLocaleString('fr-FR')} €</TableCell>
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
                                <TableCell>{request.advisor}</TableCell>
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
                      onClick={() => toast.info("Nouvelle demande de crédit")}
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
                              <TableHead>ID</TableHead>
                              <TableHead>Montant</TableHead>
                              <TableHead>Mensualité</TableHead>
                              <TableHead>Durée restante</TableHead>
                              <TableHead>Objet</TableHead>
                              <TableHead>Prochaine échéance</TableHead>
                            </TableRow>
                          </TableHeader>
                          <TableBody>
                            {activeCredits.map((credit) => (
                              <TableRow key={credit.id}>
                                <TableCell className="font-medium">{credit.id}</TableCell>
                                <TableCell>{credit.amount.toLocaleString('fr-FR')} €</TableCell>
                                <TableCell>{credit.monthlyPayment.toLocaleString('fr-FR')} €</TableCell>
                                <TableCell>{credit.remainingMonths} mois</TableCell>
                                <TableCell>{credit.purpose}</TableCell>
                                <TableCell>{new Date(credit.nextPaymentDate).toLocaleDateString("fr-FR")}</TableCell>
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
                  <CardFooter className="flex justify-end">
                    <Button 
                      variant="outline"
                      onClick={() => toast.info("Voir tous mes crédits")}
                    >
                      Voir tous mes crédits <ChevronRight size={16} className="ml-1" />
                    </Button>
                  </CardFooter>
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
                        <p className="text-sm text-gray-500">Mon conseiller</p>
                        <p className="font-medium">Jean Dupont</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">Téléphone</p>
                        <p className="font-medium">+33 6 12 34 56 78</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">Adresse</p>
                        <p className="font-medium">123 Rue de Paris, 75001 Paris</p>
                      </div>
                    </div>
                  </CardContent>
                  <CardFooter>
                    <Button 
                      variant="outline" 
                      className="w-full"
                      onClick={() => toast.info("Modifier mon profil")}
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
                      onClick={() => toast.info("Redirection vers le simulateur")}
                    >
                      Accéder au simulateur
                    </Button>
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="credits" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle>Mes crédits</CardTitle>
                <CardDescription>
                  Consultez l'ensemble de vos crédits et demandes.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Tabs defaultValue="active">
                  <TabsList className="w-full grid grid-cols-3">
                    <TabsTrigger value="active">Crédits actifs</TabsTrigger>
                    <TabsTrigger value="requests">Demandes</TabsTrigger>
                    <TabsTrigger value="history">Historique</TabsTrigger>
                  </TabsList>
                  
                  <TabsContent value="active" className="mt-4 space-y-6">
                    {activeCredits.length > 0 ? (
                      activeCredits.map((credit) => (
                        <Card key={credit.id} className="overflow-hidden">
                          <div className="bg-fidelem text-white p-4">
                            <div className="flex justify-between items-center">
                              <h3 className="font-semibold">Crédit {credit.id}</h3>
                              <Badge className="bg-white text-fidelem">{credit.purpose}</Badge>
                            </div>
                          </div>
                          <CardContent className="p-6">
                            <div className="grid md:grid-cols-3 gap-6">
                              <div className="text-center">
                                <p className="text-sm text-gray-500">Montant emprunté</p>
                                <p className="text-2xl font-bold text-fidelem">
                                  {credit.amount.toLocaleString('fr-FR')} €
                                </p>
                              </div>
                              <div className="text-center">
                                <p className="text-sm text-gray-500">Mensualité</p>
                                <p className="text-2xl font-bold text-fidelem">
                                  {credit.monthlyPayment.toLocaleString('fr-FR')} €
                                </p>
                              </div>
                              <div className="text-center flex flex-col items-center">
                                <p className="text-sm text-gray-500">Progression</p>
                                <div className="w-20 h-20 mt-2">
                                  <CircularProgressbarWithChildren
                                    value={Math.round(((credit.duration - credit.remainingMonths) / credit.duration) * 100)}
                                    strokeWidth={8}
                                    styles={buildStyles({
                                      pathColor: "#0F3460",
                                      trailColor: "#F7F7F7"
                                    })}
                                  >
                                    <div className="text-sm font-semibold">
                                      {Math.round(((credit.duration - credit.remainingMonths) / credit.duration) * 100)}%
                                    </div>
                                  </CircularProgressbarWithChildren>
                                </div>
                              </div>
                            </div>
                            
                            <div className="mt-6 pt-6 border-t">
                              <div className="grid md:grid-cols-3 gap-6">
                                <div>
                                  <p className="text-sm text-gray-500">Prochaine échéance</p>
                                  <p className="font-medium">
                                    {new Date(credit.nextPaymentDate).toLocaleDateString("fr-FR")}
                                  </p>
                                </div>
                                <div>
                                  <p className="text-sm text-gray-500">Durée restante</p>
                                  <p className="font-medium">{credit.remainingMonths} mois</p>
                                </div>
                                <div>
                                  <p className="text-sm text-gray-500">Échéances restantes</p>
                                  <p className="font-medium">{credit.remainingMonths}</p>
                                </div>
                              </div>
                            </div>
                          </CardContent>
                          <CardFooter className="bg-gray-50 flex justify-end p-4">
                            <Button variant="outline" onClick={() => toast.info("Détails du crédit")}>
                              Voir les détails <ChevronRight size={16} className="ml-1" />
                            </Button>
                          </CardFooter>
                        </Card>
                      ))
                    ) : (
                      <div className="text-center py-12">
                        <CreditCard className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                        <h3 className="text-lg font-medium text-gray-900 mb-1">Aucun crédit actif</h3>
                        <p className="text-gray-500 mb-6">
                          Vous n'avez pas encore de crédit actif.
                        </p>
                        <Button 
                          className="bg-fidelem hover:bg-fidelem/90"
                          onClick={() => toast.info("Nouvelle demande de crédit")}
                        >
                          Faire une demande de crédit
                        </Button>
                      </div>
                    )}
                  </TabsContent>
                  
                  <TabsContent value="requests" className="mt-4">
                    <div className="border rounded-lg overflow-hidden">
                      <Table>
                        <TableHeader>
                          <TableRow className="bg-gray-50">
                            <TableHead>ID</TableHead>
                            <TableHead>Date</TableHead>
                            <TableHead>Montant</TableHead>
                            <TableHead>Durée</TableHead>
                            <TableHead>Objet</TableHead>
                            <TableHead>Statut</TableHead>
                            <TableHead>Actions</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {userCreditRequests.map((request) => (
                            <TableRow key={request.id}>
                              <TableCell className="font-medium">{request.id}</TableCell>
                              <TableCell>{new Date(request.date).toLocaleDateString("fr-FR")}</TableCell>
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
                              <TableCell>
                                <Button 
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => toast.info(`Détails de la demande ${request.id}`)}
                                >
                                  Détails
                                </Button>
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </div>
                  </TabsContent>
                  
                  <TabsContent value="history" className="mt-4">
                    <div className="text-center py-12">
                      <Clock className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                      <h3 className="text-lg font-medium text-gray-900 mb-1">Aucun historique disponible</h3>
                      <p className="text-gray-500">
                        Vous n'avez pas encore de crédit terminé ou remboursé.
                      </p>
                    </div>
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="simulator" className="mt-6">
            <CreditSimulator className="max-w-3xl mx-auto" />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

const UserSummary = ({ isLoading }: { isLoading: boolean }) => {
  const statsItems = [
    {
      title: "Crédits actifs",
      value: "1",
      icon: <CreditCard className="h-8 w-8 text-blue-600" />,
      color: "bg-blue-50 text-blue-600 border-blue-200"
    },
    {
      title: "Demandes en cours",
      value: "1",
      icon: <Clock className="h-8 w-8 text-amber-600" />,
      color: "bg-amber-50 text-amber-600 border-amber-200"
    },
    {
      title: "Demandes approuvées",
      value: "1",
      icon: <CheckCircle className="h-8 w-8 text-green-600" />,
      color: "bg-green-50 text-green-600 border-green-200"
    }
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
      {statsItems.map((item, index) => (
        <motion.div
          key={index}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: isLoading ? 0 : 1, y: isLoading ? 20 : 0 }}
          transition={{ duration: 0.5, delay: index * 0.1 }}
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
        </motion.div>
      ))}
    </div>
  );
};

export default UserDashboard;
