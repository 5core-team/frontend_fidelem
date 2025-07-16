import React, { useState } from 'react';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Navbar from "../components/Navbar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { submitFundingRequest } from '@/config/api';

const FundingRequestForm = () => {
  const [formData, setFormData] = useState({
    companyName: '',
    email: '',
    phone: '',
    mission: '',
    vision: '',
    sector: '',
    productDescription: '',
    productStatus: '',
    amountRequested: '',
    useOfFunds: '',
  });

  const [file, setFile] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await submitFundingRequest({ formData, files: { businessPlan: file } });
      console.log('Form submitted successfully', response.data);

      // Afficher une alerte toast de succès
      toast.success('Demande de levée de fonds soumise avec succès!', {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });

      // Réinitialiser le formulaire
      setFormData({
        companyName: '',
        email: '',
        phone: '',
        mission: '',
        vision: '',
        sector: '',
        productDescription: '',
        productStatus: '',
        amountRequested: '',
        useOfFunds: '',
      });

      setFile(null);

    } catch (error) {
      console.error('Error submitting form', error);

      // Afficher une alerte toast d'erreur
      toast.error('Erreur lors de la soumission du formulaire.', {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });
    }
  };

  return (
    <div className="min-h-screen bg-fidelem-light">
      <Navbar />
      <div className="max-w-4xl mx-auto p-6">
        <Card className="mt-10">
          <CardHeader>
            <CardTitle className="text-center">Demande de Levée de Fonds</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Nom de l'Entreprise</label>
                  <Input
                    id="companyName"
                    name="companyName"
                    type="text"
                    value={formData.companyName}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Email</label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Téléphone</label>
                  <Input
                    id="phone"
                    name="phone"
                    type="tel"
                    value={formData.phone}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Secteur d'Activité</label>
                  <Input
                    id="sector"
                    name="sector"
                    type="text"
                    value={formData.sector}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Mission de l'Entreprise</label>
                <Textarea
                  id="mission"
                  name="mission"
                  value={formData.mission}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Vision de l'Entreprise</label>
                <Textarea
                  id="vision"
                  name="vision"
                  value={formData.vision}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Description du Produit/Service</label>
                <Textarea
                  id="productDescription"
                  name="productDescription"
                  value={formData.productDescription}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">État Actuel du Produit</label>
                <select
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  id="productStatus"
                  name="productStatus"
                  value={formData.productStatus}
                  onChange={handleChange}
                  required
                >
                  <option value="">Sélectionnez un état</option>
                  <option value="idées">Idées</option>
                  <option value="prototype">Prototype</option>
                  <option value="sur le marché">Sur le marché</option>
                </select>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Montant de Fonds Recherché</label>
                <Input
                  id="amountRequested"
                  name="amountRequested"
                  type="number"
                  value={formData.amountRequested}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Utilisation Prévue des Fonds</label>
                <Textarea
                  id="useOfFunds"
                  name="useOfFunds"
                  value={formData.useOfFunds}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Business Plan (Fichier)</label>
                <Input
                  id="businessPlan"
                  name="businessPlan"
                  type="file"
                  onChange={handleFileChange}
                  required
                />
              </div>
              <Button type="submit" className="w-full bg-fidelem hover:bg-fidelem/90">
                Soumettre
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
      <ToastContainer />
    </div>
  );
};

export default FundingRequestForm;
