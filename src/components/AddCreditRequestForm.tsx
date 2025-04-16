
import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";

const formSchema = z.object({
  clientId: z.string().min(1, {
    message: "Veuillez sélectionner un client.",
  }),
  amount: z.number().min(1000, {
    message: "Le montant doit être d'au moins 1 000 €.",
  }).max(100000, {
    message: "Le montant ne peut pas dépasser 100 000 €.",
  }),
  duration: z.number().min(12, {
    message: "La durée doit être d'au moins 12 mois.",
  }).max(120, {
    message: "La durée ne peut pas dépasser 120 mois.",
  }),
  purpose: z.string().min(1, {
    message: "Veuillez sélectionner un objet pour le crédit.",
  }),
  additionalDetails: z.string().optional(),
});

// Liste fictive de clients
const clients = [
  { id: "CL001", name: "Sophie Martin" },
  { id: "CL002", name: "Thomas Bernard" },
  { id: "CL003", name: "Julie Petit" },
  { id: "CL004", name: "Marc Dubois" },
  { id: "CL005", name: "Caroline Leroy" },
];

interface AddCreditRequestFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  isAdvisor?: boolean;
}

export function AddCreditRequestForm({ open, onOpenChange, isAdvisor = false }: AddCreditRequestFormProps) {
  const [amount, setAmount] = useState(25000);
  const [duration, setDuration] = useState(48);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      clientId: isAdvisor ? "" : "CL001", // Pour l'utilisateur, on présélectionne son propre ID
      amount: 25000,
      duration: 48,
      purpose: "",
      additionalDetails: "",
    },
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    // Simulation d'une création de demande de crédit
    console.log(values);
    toast.success("Demande de crédit créée avec succès");
    form.reset();
    onOpenChange(false);
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Nouvelle demande de crédit</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            {isAdvisor && (
              <FormField
                control={form.control}
                name="clientId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Client</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Sélectionner un client" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {clients.map(client => (
                          <SelectItem key={client.id} value={client.id}>{client.name}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}
            <FormField
              control={form.control}
              name="amount"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Montant du crédit</FormLabel>
                  <div className="space-y-2">
                    <p className="text-lg font-semibold">€{amount.toLocaleString('fr-FR')}</p>
                    <Slider
                      defaultValue={[amount]}
                      max={100000}
                      min={1000}
                      step={1000}
                      onValueChange={(values) => {
                        setAmount(values[0]);
                        field.onChange(values[0]);
                      }}
                    />
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="duration"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Durée du crédit</FormLabel>
                  <div className="space-y-2">
                    <p className="text-lg font-semibold">{duration} mois</p>
                    <Slider
                      defaultValue={[duration]}
                      max={120}
                      min={12}
                      step={12}
                      onValueChange={(values) => {
                        setDuration(values[0]);
                        field.onChange(values[0]);
                      }}
                    />
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="purpose"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Objet du crédit</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Sélectionner un objet" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="auto">Achat automobile</SelectItem>
                      <SelectItem value="personal">Personnel</SelectItem>
                      <SelectItem value="home">Rénovation</SelectItem>
                      <SelectItem value="education">Études</SelectItem>
                      <SelectItem value="business">Projet professionnel</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="additionalDetails"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Informations complémentaires</FormLabel>
                  <FormControl>
                    <Textarea placeholder="Détails supplémentaires sur votre demande de crédit..." {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit" className="w-full bg-fidelem hover:bg-fidelem/90">Soumettre la demande</Button>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
