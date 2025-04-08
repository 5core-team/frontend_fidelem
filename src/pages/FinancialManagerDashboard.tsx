
import { useState, useEffect } from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import Navbar from "@/components/Navbar";
import UserTable from "@/components/UserTable";
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
  BarChart,
  LineChart,
  Bar, 
  Line, 
  XAxis, 
  YAxis, 
  Tooltip, 
  Legend, 
  ResponsiveContainer 
} from "recharts";
import { 
  Users, 
  CheckCircle2, 
  XCircle, 
  Clock, 
  CreditCard, 
  TrendingUp,
  AlertCircle,
  Download
} from "lucide-react";
import { motion } from "framer-motion";

// Mock data for charts
const userStatsData = [
  { name: 'Jan', "Nouveaux utilisateurs": 30, "Conseillers": 5 },
  { name: 'Fév', "Nouveaux utilisateurs": 40, "Conseillers": 8 },
  { name: 'Mar', "Nouveaux utilisateurs": 45, "Conseillers": 10 },
  { name: 'Avr', "Nouveaux utilisateurs": 75, "Conseillers": 12 },
  { name: 'Mai', "Nouveaux utilisateurs": 60, "Conseillers": 15 },
  { name: 'Juin', "Nouveaux utilisateurs": 80, "Conseillers": 18 },
];

const creditStatsData = [
  { name: 'Jan', "Montant": 150000, "Demandes": 10 },
  { name: 'Fév', "Montant": 200000, "Demandes": 15 },
  { name: 'Mar', "Montant": 180000, "Demandes": 12 },
  { name: 'Avr', "Montant": 300000, "Demandes": 25 },
  { name: 'Mai', "Montant": 250000, "Demandes": 20 },
  { name: 'Juin', "Montant": 420000, "Demandes": 35 },
];

const FinancialManagerDashboard = () => {
  const { user, isAuthenticated } = useAuth();
  const [isLoadingStats, setIsLoadingStats] = useState(true);
  
  // Simulate loading of statistics
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoadingStats(false);
    }, 1200);
    
    return () => clearTimeout(timer);
  }, []);
  
  // Redirect if not authenticated or not a manager
  if (!isAuthenticated || user?.role !== "manager") {
    return <Navigate to="/login" replace />;
  }
  
  return (
    <div className="min-h-screen bg-fidelem-light">
      <Navbar />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-fidelem">Tableau de bord</h1>
            <p className="text-gray-600 mt-1">Gérez les utilisateurs et suivez l'activité de Fidelem</p>
          </div>
          <div className="mt-4 md:mt-0">
            <Button className="bg-fidelem hover:bg-fidelem/90 flex items-center gap-2">
              <Download size={16} /> Exporter les données
            </Button>
          </div>
        </div>
        
        <DashboardSummary isLoading={isLoadingStats} />
        
        <Tabs defaultValue="users" className="mt-8">
          <TabsList className="grid w-full md:w-auto grid-cols-2 md:grid-cols-3">
            <TabsTrigger value="users">Utilisateurs</TabsTrigger>
            <TabsTrigger value="advisors">Conseillers</TabsTrigger>
            <TabsTrigger value="credits">Demandes de crédit</TabsTrigger>
          </TabsList>
          <TabsContent value="users" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle>Gestion des utilisateurs</CardTitle>
                <CardDescription>
                  Consultez et gérez les comptes utilisateurs de la plateforme.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <UserTable 
                  title="Liste des utilisateurs" 
                  description="Consultez et gérez les comptes utilisateurs de la plateforme." 
                />
              </CardContent>
            </Card>
          </TabsContent>
          <TabsContent value="advisors" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle>Gestion des conseillers</CardTitle>
                <CardDescription>
                  Validez les nouveaux comptes conseillers et gérez leurs permissions.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <UserTable 
                  title="Liste des conseillers" 
                  description="Consultez et gérez les comptes conseillers de la plateforme." 
                />
              </CardContent>
            </Card>
          </TabsContent>
          <TabsContent value="credits" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle>Suivi des demandes de crédit</CardTitle>
                <CardDescription>
                  Consultez l'ensemble des demandes de crédit et leur statut.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <h3 className="text-lg font-medium mb-4">Évolution des demandes de crédit</h3>
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={creditStatsData}>
                      <XAxis dataKey="name" />
                      <YAxis yAxisId="left" orientation="left" />
                      <YAxis yAxisId="right" orientation="right" />
                      <Tooltip />
                      <Legend />
                      <Bar yAxisId="left" dataKey="Demandes" fill="#0F3460" />
                      <Line yAxisId="right" type="monotone" dataKey="Montant" stroke="#3EDBF0" strokeWidth={2} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
                <div className="mt-8 text-center">
                  <Button variant="outline">Voir toutes les demandes</Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

const DashboardSummary = ({ isLoading }: { isLoading: boolean }) => {
  const statsItems = [
    {
      title: "Utilisateurs",
      value: "248",
      change: "+12%",
      icon: <Users className="h-8 w-8 text-blue-600" />,
      color: "bg-blue-50 text-blue-600 border-blue-200"
    },
    {
      title: "Conseillers",
      value: "36",
      change: "+5%",
      icon: <Users className="h-8 w-8 text-purple-600" />,
      color: "bg-purple-50 text-purple-600 border-purple-200"
    },
    {
      title: "Comptes en attente",
      value: "14",
      change: "",
      icon: <Clock className="h-8 w-8 text-amber-600" />,
      color: "bg-amber-50 text-amber-600 border-amber-200"
    },
    {
      title: "Demandes de crédit",
      value: "187",
      change: "+24%",
      icon: <CreditCard className="h-8 w-8 text-green-600" />,
      color: "bg-green-50 text-green-600 border-green-200"
    }
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
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
                    {item.change && !isLoading && (
                      <p className="ml-2 text-xs font-medium text-green-600">
                        {item.change}
                      </p>
                    )}
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

export default FinancialManagerDashboard;
