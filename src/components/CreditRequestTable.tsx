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
  RotateCw, // Changed from Trash2 to RotateCw
  Search,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { getCreditRequestsAdmin, approveCreditRequest, rejectCreditRequest, updateCreditRequestStatus } from '../config/api'; // deleteCreditRequest replaced with updateCreditRequestStatus

interface CreditRequest {
  id: string;
  user_id: string;
  user: {
    name: string;
    last_name: string;
  };
  amount: number;
  duration: number;
  purpose: string;
  status: "Approuvé" | "En attente" | "Rejeté";
  created_at: string;
}

interface CreditRequestTableProps {
  title: string;
  description?: string;
}

const CreditRequestTable = ({ title, description }: CreditRequestTableProps) => {
  const [creditRequests, setCreditRequests] = useState<CreditRequest[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCreditRequests = async () => {
      try {
        const response = await getCreditRequestsAdmin();
        console.log("Réponse de l'API :", response);
        if (Array.isArray(response)) {
          setCreditRequests(response);
        } else {
          console.error("La réponse de l'API n'est pas un tableau :", response);
          setCreditRequests([]);
        }
      } catch (error) {
        console.error("Erreur lors de la récupération des demandes de crédit:", error);
        toast.error("Erreur lors de la récupération des demandes de crédit");
      } finally {
        setLoading(false);
      }
    };

    fetchCreditRequests();
  }, []);

  const handleApprove = async (requestId: string) => {
    try {
      await approveCreditRequest(requestId);
      setCreditRequests(creditRequests.map(request =>
        request.id === requestId ? { ...request, status: "Approuvé" as const } : request
      ));
      toast.success("Demande de crédit approuvée avec succès");
    } catch (error) {
      toast.error("Erreur lors de l'approbation de la demande de crédit");
    }
  };

  const handleReject = async (requestId: string) => {
    try {
      await rejectCreditRequest(requestId);
      setCreditRequests(creditRequests.map(request =>
        request.id === requestId ? { ...request, status: "Rejeté" as const } : request
      ));
      toast.success("Demande de crédit rejetée");
    } catch (error) {
      toast.error("Erreur lors du rejet de la demande de crédit");
    }
  };

  const handleRestore = async (requestId: string) => {
    try {
      await updateCreditRequestStatus(requestId, "En attente"); // Use the updateCreditRequestStatus function
      setCreditRequests(creditRequests.map(request =>
        request.id === requestId ? { ...request, status: "En attente" as const } : request
      ));
      toast.success("Demande de crédit restaurée et mise en attente");
    } catch (error) {
      toast.error("Erreur lors de la restauration de la demande de crédit");
    }
  };

  const filteredCreditRequests = Array.isArray(creditRequests)
    ? creditRequests.filter(request =>
      request.user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      request.purpose.toLowerCase().includes(searchQuery.toLowerCase())
    )
    : [];

  const getStatusBadge = (status: CreditRequest["status"]) => {
    switch (status) {
      case "Approuvé":
        return <Badge className="bg-green-500">Approuvé</Badge>;
      case "En attente":
        return <Badge className="bg-amber-500">En attente</Badge>;
      case "Rejeté":
        return <Badge className="bg-red-500">Rejeté</Badge>;
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
            placeholder="Rechercher une demande de crédit..."
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
              <TableHead>Nom de l'utilisateur</TableHead>
              <TableHead>Montant</TableHead>
              <TableHead>Durée</TableHead>
              <TableHead>But</TableHead>
              <TableHead>Statut</TableHead>
              <TableHead>Date de création</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredCreditRequests.length > 0 ? (
              filteredCreditRequests.map((request) => (
                <TableRow key={request.id}>
                  <TableCell className="font-medium">
                    {request.user ? `${request.user.name} ${request.user.last_name}` : 'Utilisateur inconnu'}
                  </TableCell>
                  <TableCell>{request.amount}</TableCell>
                  <TableCell>{request.duration}</TableCell>
                  <TableCell>{request.purpose}</TableCell>
                  <TableCell>{getStatusBadge(request.status)}</TableCell>
                  <TableCell>{new Date(request.created_at).toLocaleDateString("fr-FR")}</TableCell>
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
                        {request.status === "En attente" && (
                          <>
                            <DropdownMenuItem onClick={() => handleApprove(request.id)}>
                              <CheckCircle2 className="mr-2 h-4 w-4 text-green-500" /> Approuver
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => handleReject(request.id)}>
                              <XCircle className="mr-2 h-4 w-4 text-red-500" /> Rejeter
                            </DropdownMenuItem>
                          </>
                        )}
                        {request.status === "Approuvé" || request.status === "Rejeté" ? (
                          <DropdownMenuItem
                            onClick={() => handleRestore(request.id)}
                          >
                            <RotateCw className="mr-2 h-4 w-4" /> Restaurer
                          </DropdownMenuItem>
                        ) : null}
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={7} className="h-24 text-center">
                  Aucune demande de crédit trouvée.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default CreditRequestTable;
