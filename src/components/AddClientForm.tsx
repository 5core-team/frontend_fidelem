import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { toast } from "sonner";
import { creerClient } from "@/config/apiEspace";
import { lireErreur } from "@/config/http";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Eye, EyeOff } from "lucide-react";

const formSchema = z.object({
  name: z.string().min(2, {
    message: "Le prénom doit contenir au moins 2 caractères.",
  }),
  last_name: z.string().min(2, {
    message: "Le nom doit contenir au moins 2 caractères.",
  }),
  email: z.string().email({
    message: "Veuillez entrer une adresse email valide.",
  }),
  phone: z.string().refine((v) => v.replace(/\D/g, "").length >= 8, {
    message: "Indiquez un numéro de téléphone complet.",
  }),
  address: z.string().max(255),
  password: z.string().min(8, {
    message: "Le mot de passe doit contenir au moins 8 caractères.",
  }),
  confirmPassword: z.string().min(8, {
    message: "Le mot de passe doit contenir au moins 8 caractères.",
  }),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Les mots de passe ne correspondent pas.",
  path: ["confirmPassword"],
});

interface AddClientFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function AddClientForm({ open, onOpenChange }: AddClientFormProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      last_name: "",
      email: "",
      phone: "",
      address: "",
      password: "",
      confirmPassword: "",
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsLoading(true);
    try {
      await creerClient({
        name: values.name,
        last_name: values.last_name,
        email: values.email,
        phone: values.phone,
        address: values.address || undefined,
        password: values.password,
      });
      toast.success("Client ajouté. Il peut se connecter dès maintenant avec son e-mail.");
      form.reset();
      onOpenChange(false);
    } catch (error) {
      const { message, champs } = lireErreur(error);
      Object.entries(champs).forEach(([champ, m]) => form.setError(champ as keyof z.infer<typeof formSchema>, { message: m }));
      toast.error("Le client n'a pas été créé.", { description: message ?? "Réessayez dans un instant." });
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Ajouter un nouveau client</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Prénom</FormLabel>
                    <FormControl>
                      <Input placeholder="Florence" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="last_name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Nom</FormLabel>
                    <FormControl>
                      <Input placeholder="Adjovi" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input type="email" placeholder="florence.adjovi@exemple.bj" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="phone"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Téléphone</FormLabel>
                  <FormControl>
                    <Input type="tel" inputMode="tel" placeholder="01 91 22 33 44" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="address"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Adresse <span className="text-muted-foreground">· facultatif</span></FormLabel>
                  <FormControl>
                    <Textarea placeholder="Quartier, commune" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Mot de passe</FormLabel>
                  <FormControl>
                    <div className="relative">
                      <Input type={showPassword ? "text" : "password"} placeholder="••••••••" {...field} />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute inset-y-0 right-0 pr-3 flex items-center"
                      >
                        {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </button>
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="confirmPassword"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Confirmer le mot de passe</FormLabel>
                  <FormControl>
                    <div className="relative">
                      <Input type={showConfirmPassword ? "text" : "password"} placeholder="••••••••" {...field} />
                      <button
                        type="button"
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        className="absolute inset-y-0 right-0 pr-3 flex items-center"
                      >
                        {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </button>
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit" className="w-full bg-fidelem hover:bg-fidelem/90" disabled={isLoading}>
              {isLoading ? "Création en cours..." : "Ajouter le client"}
            </Button>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
