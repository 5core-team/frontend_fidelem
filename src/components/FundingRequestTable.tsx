import React, { useState, useEffect } from 'react';
import { getFundingRequests, deleteFundingRequest } from '@/config/api';
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Download, Trash2 } from "lucide-react";

const FundingRequestTable = () => {
  const [fundingRequests, setFundingRequests] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchFundingRequests = async () => {
      try {
        const response = await getFundingRequests();
        setFundingRequests(response);
      } catch (error) {
        toast.error("Erreur lors de la récupération des demandes de levée de fonds");
      } finally {
        setIsLoading(false);
      }
    };

    fetchFundingRequests();
  }, []);

const handleDownload = (fileUrl) => {
  // Utilisez l'URL de l'API depuis .env
  const baseUrl = import.meta.env.VITE_API_URL;
  // Remplacez '/api' par '/uploads' pour accéder au fichier
  const fullUrl = baseUrl.replace('/api', '/uploads') + '/' + fileUrl.split('/').pop();
  window.open(fullUrl, '_blank');
};


  const handleDelete = async (id) => {
    try {
      await deleteFundingRequest(id);
      setFundingRequests(fundingRequests.filter(request => request.id !== id));
      toast.success("Demande de levée de fonds supprimée avec succès!");
    } catch (error) {
      toast.error("Erreur lors de la suppression de la demande de levée de fonds");
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Demandes de Levée de Fonds</CardTitle>
        <CardDescription>
          Consultez et gérez les demandes de levée de fonds de la plateforme.
        </CardDescription>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div>Chargement...</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nom de l'Entreprise</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Téléphone</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Montant</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {fundingRequests.map((request) => (
                  <tr key={request.id}>
                    <td className="px-6 py-4 whitespace-nowrap">{request.companyName}</td>
                    <td className="px-6 py-4 whitespace-nowrap">{request.email}</td>
                    <td className="px-6 py-4 whitespace-nowrap">{request.phone}</td>
                    <td className="px-6 py-4 whitespace-nowrap">{request.amountRequested}</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex space-x-2">
                        {request.businessPlan && (
                          <Button
                            onClick={() => handleDownload(request.businessPlan)}
                            className="flex items-center gap-2"
                          >
                            <Download size={16} /> Télécharger
                          </Button>
                        )}
                        <Button
                          onClick={() => handleDelete(request.id)}
                          className="flex items-center gap-2 bg-red-500 hover:bg-red-700"
                        >
                          <Trash2 size={16} /> Supprimer
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default FundingRequestTable;
