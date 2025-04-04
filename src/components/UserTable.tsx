
import { useState } from "react";
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

interface User {
  id: string;
  name: string;
  email: string;
  role: string;
  status: "active" | "pending" | "rejected";
  dateCreated: string;
}

interface UserTableProps {
  title: string;
  description?: string;
}

const UserTable = ({ title, description }: UserTableProps) => {
  // Mock data for demonstration
  const initialUsers: User[] = [
    {
      id: "1",
      name: "Jean Dupont",
      email: "jean.dupont@example.com",
      role: "advisor",
      status: "pending",
      dateCreated: "2023-04-02"
    },
    {
      id: "2",
      name: "Marie Laurent",
      email: "marie.laurent@example.com",
      role: "advisor",
      status: "active",
      dateCreated: "2023-03-28"
    },
    {
      id: "3",
      name: "Thomas Bernard",
      email: "thomas.bernard@example.com",
      role: "user",
      status: "active",
      dateCreated: "2023-04-01"
    },
    {
      id: "4",
      name: "Sophie Martin",
      email: "sophie.martin@example.com",
      role: "user",
      status: "pending",
      dateCreated: "2023-04-03"
    },
    {
      id: "5",
      name: "Lucie Petit",
      email: "lucie.petit@example.com",
      role: "user",
      status: "rejected",
      dateCreated: "2023-03-25"
    },
  ];

  const [users, setUsers] = useState<User[]>(initialUsers);
  const [searchQuery, setSearchQuery] = useState("");

  const handleApprove = (userId: string) => {
    setUsers(users.map(user => 
      user.id === userId ? { ...user, status: "active" as const } : user
    ));
    toast.success("Utilisateur approuvé avec succès");
  };

  const handleReject = (userId: string) => {
    setUsers(users.map(user => 
      user.id === userId ? { ...user, status: "rejected" as const } : user
    ));
    toast.success("Utilisateur rejeté");
  };

  const handleDelete = (userId: string) => {
    setUsers(users.filter(user => user.id !== userId));
    toast.success("Utilisateur supprimé avec succès");
  };

  const filteredUsers = users.filter(user => 
    user.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
    user.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const getStatusBadge = (status: User["status"]) => {
    switch (status) {
      case "active":
        return <Badge className="bg-green-500">Actif</Badge>;
      case "pending":
        return <Badge className="bg-amber-500">En attente</Badge>;
      case "rejected":
        return <Badge className="bg-red-500">Rejeté</Badge>;
      default:
        return null;
    }
  };

  const getRoleBadge = (role: string) => {
    switch (role) {
      case "advisor":
        return <Badge variant="outline" className="border-fidelem text-fidelem">Conseiller</Badge>;
      case "user":
        return <Badge variant="outline" className="border-gray-500 text-gray-500">Utilisateur</Badge>;
      default:
        return null;
    }
  };

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
                  <TableCell className="font-medium">{user.name}</TableCell>
                  <TableCell>{user.email}</TableCell>
                  <TableCell>{getRoleBadge(user.role)}</TableCell>
                  <TableCell>{getStatusBadge(user.status)}</TableCell>
                  <TableCell>{new Date(user.dateCreated).toLocaleDateString("fr-FR")}</TableCell>
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
                        <DropdownMenuItem onClick={() => toast.info(`Voir les détails de ${user.name}`)}>
                          <Eye className="mr-2 h-4 w-4" /> Voir les détails
                        </DropdownMenuItem>
                        {user.status === "pending" && (
                          <>
                            <DropdownMenuItem onClick={() => handleApprove(user.id)}>
                              <UserCheck className="mr-2 h-4 w-4 text-green-500" /> Approuver
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => handleReject(user.id)}>
                              <UserX className="mr-2 h-4 w-4 text-red-500" /> Rejeter
                            </DropdownMenuItem>
                          </>
                        )}
                        <DropdownMenuItem onClick={() => toast.info(`Éditer ${user.name}`)}>
                          <Edit2 className="mr-2 h-4 w-4" /> Éditer
                        </DropdownMenuItem>
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
