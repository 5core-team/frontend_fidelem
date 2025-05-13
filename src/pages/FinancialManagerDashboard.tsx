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
  Download,
  UserPlus,
  User
} from "lucide-react";
import { toast } from "sonner";
import { AddFinancialAdvisorForm } from "@/components/AddFinancialAdvisorForm";
import { EditProfileForm } from "@/components/EditProfileForm";
import { getUsers, getUserStats, getCreditStats } from '../config/api'; // Import API functions

const FinancialManagerDashboard = () => {
  const { user, isAuthenticated } = useAuth();
  const [isLoadingStats, setIsLoadingStats] = useState(true);
  const [addAdvisorOpen, setAddAdvisorOpen] = useState(false);
  const [editProfileOpen, setEditProfileOpen] = useState(false);
  const [userStats, setUserStats] = useState({ totalUsers: 0, totalAdvisors: 0, pendingAccounts: 0 });
  const [creditStatsData, setCreditStatsData] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const userStatsResponse = await getUserStats();
        const creditStatsResponse = await getCreditStats();

        setUserStats(userStatsResponse.data);
        setCreditStatsData(creditStatsResponse.data);
      } catch (error) {
        toast.error("Erreur lors de la récupération des statistiques");
      } finally {
        setIsLoadingStats(false);
      }
    };

    fetchData();
  }, []);

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
          <div className="mt-4 md:mt-0 space-x-2 flex">
            <Button
              className="bg-fidelem hover:bg-fidelem/90 flex items-center gap-2"
              onClick={() => setEditProfileOpen(true)}
            >
              <User size={16} /> Mon profil
            </Button>
            <Button
              className="bg-fidelem hover:bg-fidelem/90 flex items-center gap-2"
              onClick={() => setAddAdvisorOpen(true)}
            >
              <UserPlus size={16} /> Nouveau conseiller
            </Button>
          </div>
        </div>

        <DashboardSummary isLoading={isLoadingStats} userStats={userStats} creditStatsData={creditStatsData} />

        <Tabs defaultValue="users" className="mt-8">
          <TabsList className="grid w-full md:w-auto grid-cols-2 md:grid-cols-2">
            <TabsTrigger value="users">Utilisateurs</TabsTrigger>
            <TabsTrigger value="advisors">Conseillers</TabsTrigger>
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
              <CardHeader className="flex flex-row items-center justify-between">
                <div>
                  <CardTitle>Gestion des conseillers</CardTitle>
                  <CardDescription>
                    Validez les nouveaux comptes conseillers et gérez leurs permissions.
                  </CardDescription>
                </div>
                <Button
                  className="bg-fidelem hover:bg-fidelem/90 flex items-center gap-2"
                  onClick={() => setAddAdvisorOpen(true)}
                >
                  <UserPlus size={16} /> Nouveau conseiller
                </Button>
              </CardHeader>
              <CardContent>
                <UserTable
                  title="Liste des conseillers"
                  description="Consultez et gérez les comptes conseillers de la plateforme."
                  filterType="advisor"
                />
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>

      <AddFinancialAdvisorForm open={addAdvisorOpen} onOpenChange={setAddAdvisorOpen} />
      <EditProfileForm open={editProfileOpen} onOpenChange={setEditProfileOpen} />
    </div>
  );
};

const DashboardSummary = ({ isLoading, userStats, creditStatsData }) => {
  const statsItems = [
    {
      title: "Utilisateurs",
      value: userStats.totalUsers,
      icon: <Users className="h-8 w-8 text-blue-600" />,
      color: "bg-blue-50 text-blue-600 border-blue-200"
    },
    {
      title: "Conseillers",
      value: userStats.totalAdvisors,
      icon: <Users className="h-8 w-8 text-purple-600" />,
      color: "bg-purple-50 text-purple-600 border-purple-200"
    },
    {
      title: "Comptes en attente",
      value: userStats.pendingAccounts,
      icon: <Clock className="h-8 w-8 text-amber-600" />,
      color: "bg-amber-50 text-amber-600 border-amber-200"
    },
    {
      title: "Demandes de crédit",
      value: creditStatsData.reduce((sum, month) => sum + month["Demandes"], 0),
      icon: <CreditCard className="h-8 w-8 text-green-600" />,
      color: "bg-green-50 text-green-600 border-green-200"
    }
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
      {statsItems.map((item, index) => (
        <div
          key={index}
          className={`transition-opacity duration-500 opacity-${isLoading ? '0' : '100'}`}
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

export default FinancialManagerDashboard;
