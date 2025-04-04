
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Clock, ArrowLeft } from "lucide-react";
import { motion } from "framer-motion";

const PendingApproval = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-fidelem-light p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md"
      >
        <Card className="border-none shadow-lg">
          <CardHeader className="space-y-1 items-center">
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.2, duration: 0.5 }}
              className="bg-amber-100 p-3 rounded-full mb-4"
            >
              <Clock size={48} className="text-amber-600" />
            </motion.div>
            <CardTitle className="text-2xl font-bold text-center">Compte en attente de validation</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 text-center">
            <p className="text-gray-600">
              Votre compte de conseiller financier a été créé avec succès mais nécessite une validation par un responsable financier.
            </p>
            <p className="text-gray-600">
              Vous recevrez une notification par e-mail dès que votre compte sera approuvé.
            </p>
            <div className="pt-6">
              <Link to="/">
                <Button variant="outline" className="flex items-center gap-2">
                  <ArrowLeft size={16} />
                  Retour à l'accueil
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
};

export default PendingApproval;
