import { useState, useEffect } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  CheckCircle2,
  XCircle,
  MoreHorizontal,
  Edit2,
  Trash2,
  Eye,
  Search,
  UserCheck,
  UserX
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { getUsers, approveUser, rejectUser, deleteUser } from '../config/api'; // Import API functions

interface User {
  id: string;
  name: string;
  last_name: string;
  email: string;
  phone: string;
  address: string;
  type_compte: string;
  statut: "Actif" | "En attente" | "Rejeté";
  created_at: string;
}

interface UserTableProps {
  title: string;
  description?: string;
  filterType?: string; // Add filterType prop
}

const UserTable = ({ title, description, filterType }: UserTableProps) => {
  const [users, setUsers] = useState<User[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await getUsers();
        setUsers(response.data);
      } catch (error) {
        toast.error("Erreur lors de la récupération des utilisateurs");
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  const handleApprove = async (userId: string) => {
    try {
      await approveUser(userId);
      setUsers(users.map(user =>
        user.id === userId ? { ...user, statut: "Actif" as const } : user
      ));
      toast.success("Utilisateur approuvé avec succès");
    } catch (error) {
      toast.error("Erreur lors de l'approbation de l'utilisateur");
    }
  };

  const handleReject = async (userId: string) => {
    try {
      await rejectUser(userId);
      setUsers(users.map(user =>
        user.id === userId ? { ...user, statut: "Rejeté" as const } : user
      ));
      toast.success("Utilisateur rejeté");
    } catch (error) {
      toast.error("Erreur lors du rejet de l'utilisateur");
    }
  };

  const handleDelete = async (userId: string) => {
    try {
      await deleteUser(userId);
      setUsers(users.filter(user => user.id !== userId));
      toast.success("Utilisateur supprimé avec succès");
    } catch (error) {
      toast.error("Erreur lors de la suppression de l'utilisateur");
    }
  };

  const filteredUsers = users.filter(user =>
    (!filterType || user.type_compte === filterType) &&
    (user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    user.email.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const gettype_compteBadge = (statut: User["statut"]) => {
    switch (statut) {
      case "Actif":
        return <Badge className="bg-green-500">Actif</Badge>;
      case "En attente":
        return <Badge className="bg-amber-500">En attente</Badge>;
      case "Rejeté":
        return <Badge className="bg-red-500">Rejeté</Badge>;
      default:
        return null;
    }
  };

  const getRoleBadge = (type_compte: string) => {
    switch (type_compte) {
      case "advisor":
        return <Badge variant="outline" className="border-fidelem text-fidelem">Conseiller</Badge>;
      case "user":
        return <Badge variant="outline" className="border-gray-500 text-gray-500">Utilisateur</Badge>;
      default:
        return null;
    }
  };

  if (loading) return <div>Chargement...</div>;

  return (
    <div className="space-y-4">
      <div>
        <h2 className="text-2xl font-bold text-fidelem">{title}</h2>
        {description && <p className="text-gray-600 mt-1">{description}</p>}
      </div>

      <div className="flex flex-col sm:flex-row justify-between items-center gap-4 mb-4">
        <div className="relative w-full sm:w-auto">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
          <Input
            placeholder="Rechercher un utilisateur..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
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
              <TableHead>Rôle</TableHead>
              <TableHead>Statut</TableHead>
              <TableHead>Date de création</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredUsers.length > 0 ? (
              filteredUsers.map((user) => (
                <TableRow key={user.id}>
                  <TableCell className="font-medium">{user.name} {user.last_name}</TableCell>
                  <TableCell>{user.email}</TableCell>
                  <TableCell>{getRoleBadge(user.type_compte)}</TableCell>
                  <TableCell>{gettype_compteBadge(user.statut)}</TableCell>
                  <TableCell>{new Date(user.created_at).toLocaleDateString("fr-FR")}</TableCell>
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

                        {user.statut === "En attente" && (
                          <>
                            <DropdownMenuItem onClick={() => handleApprove(user.id)}>
                              <UserCheck className="mr-2 h-4 w-4 text-green-500" /> Approuver
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => handleReject(user.id)}>
                              <UserX className="mr-2 h-4 w-4 text-red-500" /> Rejeter
                            </DropdownMenuItem>
                          </>
                        )}

                        <DropdownMenuItem
                          onClick={() => handleDelete(user.id)}
                          className="text-red-600 focus:text-red-600"
                        >
                          <Trash2 className="mr-2 h-4 w-4" /> Supprimer
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={6} className="h-24 text-center">
                  Aucun utilisateur trouvé.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default UserTable;
