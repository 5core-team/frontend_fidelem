
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Mail, Phone, MapPin } from "lucide-react";

const Contact = () => {
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Logique de soumission du formulaire à implémenter
  };

  return (
    <div className="min-h-screen bg-fidelem-light py-12 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-fidelem mb-4">Contactez-nous</h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Notre équipe est à votre disposition pour répondre à toutes vos questions
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 mb-12">
          <Card>
            <CardContent className="flex flex-col items-center text-center p-6">
              <Phone className="h-12 w-12 text-fidelem mb-4" />
              <CardTitle className="mb-2">Téléphone</CardTitle>
              <p className="text-gray-600">+33 (0)1 23 45 67 89</p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="flex flex-col items-center text-center p-6">
              <Mail className="h-12 w-12 text-fidelem mb-4" />
              <CardTitle className="mb-2">Email</CardTitle>
              <p className="text-gray-600">contact@fidelem.com</p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="flex flex-col items-center text-center p-6">
              <MapPin className="h-12 w-12 text-fidelem mb-4" />
              <CardTitle className="mb-2">Adresse</CardTitle>
              <p className="text-gray-600">123 Avenue des Finances<br />75008 Paris</p>
            </CardContent>
          </Card>
        </div>

        <Card className="max-w-2xl mx-auto">
          <CardHeader>
            <CardTitle>Envoyez-nous un message</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Nom</label>
                  <Input type="text" placeholder="Votre nom" required />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Email</label>
                  <Input type="email" placeholder="votre@email.com" required />
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Sujet</label>
                <Input type="text" placeholder="Sujet de votre message" required />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Message</label>
                <Textarea placeholder="Votre message" rows={5} required />
              </div>
              <Button type="submit" className="w-full bg-fidelem hover:bg-fidelem/90">
                Envoyer le message
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Contact;
