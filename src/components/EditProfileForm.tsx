import { useEffect, useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { toast } from "sonner";
import { useAuth } from "@/context/AuthContext";
import { Eye, EyeOff } from "lucide-react"; 
import { updateProfile, updatePassword } from "@/config/api";
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const profileSchema = z.object({
  firstName: z.string().min(2, {
    message: "Le prénom doit contenir au moins 2 caractères.",
  }),
  lastName: z.string().min(2, {
    message: "Le nom doit contenir au moins 2 caractères.",
  }),
  email: z.string().email({
    message: "Veuillez entrer une adresse email valide.",
  }),
  phone: z.string().refine((v) => !v || v.replace(/\D/g, "").length >= 8, {
    message: "Indiquez un numéro de téléphone complet.",
  }),
  address: z.string().max(255),
  // Demandé par l'API quand l'adresse e-mail change.
  currentPassword: z.string().optional(),
});

const passwordSchema = z.object({
  currentPassword: z.string().min(1, {
    message: "Indiquez votre mot de passe actuel.",
  }),
  newPassword: z.string().min(8, {
    message: "Le nouveau mot de passe doit contenir au moins 8 caractères.",
  }),
  confirmPassword: z.string().min(8, {
    message: "La confirmation doit contenir au moins 8 caractères.",
  }),
}).refine((data) => data.newPassword === data.confirmPassword, {
  message: "Les mots de passe ne correspondent pas.",
  path: ["confirmPassword"],
});

interface EditProfileFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function EditProfileForm({ open, onOpenChange }: EditProfileFormProps) {
  const { user, majUtilisateur } = useAuth();
  const [activeTab, setActiveTab] = useState("profile");
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [showContactAdvisorMessage, setShowContactAdvisorMessage] = useState(false);

  const isRegularUser = user?.role === "user";

  const valeursProfil = () => ({
    firstName: user?.name || "",
    lastName: user?.last_name || "",
    email: user?.email || "",
    phone: user?.phone || "",
    address: user?.address || "",
    currentPassword: "",
  });

  const profileForm = useForm<z.infer<typeof profileSchema>>({
    resolver: zodResolver(profileSchema),
    defaultValues: valeursProfil(),
  });

  // À chaque ouverture, le formulaire repart des informations à jour.
  useEffect(() => { if (open) profileForm.reset(valeursProfil()); }, [open]); // eslint-disable-line react-hooks/exhaustive-deps

  const passwordForm = useForm<z.infer<typeof passwordSchema>>({
    resolver: zodResolver(passwordSchema),
    defaultValues: {
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    },
  });

  async function onProfileSubmit(values: z.infer<typeof profileSchema>) {
    try {
      const { currentPassword, ...profil } = values;
      const emailChange = profil.email?.trim().toLowerCase() !== user?.email?.toLowerCase();
      const response = await updateProfile({ ...(profil as Parameters<typeof updateProfile>[0]), ...(emailChange ? { currentPassword } : {}) });
      if (response.data.user) majUtilisateur(response.data.user);
      toast.success(response.data.message || "Profil mis à jour.");
      onOpenChange(false);
    } catch (error) {
      const { message, champs } = lireErreur(error);
      Object.entries(champs).forEach(([champ, m]) => profileForm.setError(champ as keyof z.infer<typeof profileSchema>, { message: m }));
      toast.error(message || "Le profil n'a pas pu être mis à jour.");
    }
  }

async function onPasswordSubmit(values: z.infer<typeof passwordSchema>) {
  try {
    const response = await updatePassword({
      currentPassword: values.currentPassword,
      newPassword: values.newPassword,
      newPassword_confirmation: values.confirmPassword, // Utilisez newPassword_confirmation
    });
    toast.success(response.data.message || "Mot de passe modifié.");
    passwordForm.reset();
    onOpenChange(false);
  } catch (error) {
    const { message, champs } = lireErreur(error);
    if (champs.currentPassword) passwordForm.setError("currentPassword", { message: champs.currentPassword });
    if (champs.newPassword) passwordForm.setError("newPassword", { message: champs.newPassword });
    toast.error(message || "Le mot de passe n'a pas pu être modifié.");
  }
}


  return (
    <Dialog open={open} onOpenChange={(open) => {
      onOpenChange(open);
      setShowContactAdvisorMessage(false);
    }}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Modifier mes informations</DialogTitle>
        </DialogHeader>
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="profile">Profil</TabsTrigger>
            <TabsTrigger value="password">Mot de passe</TabsTrigger>
          </TabsList>
          
          <TabsContent value="profile" className="mt-4">
            <Form {...profileForm}>
              <form onSubmit={(e) => {
                e.preventDefault();
                if (isRegularUser) {
                  setShowContactAdvisorMessage(true);
                } else {
                  profileForm.handleSubmit(onProfileSubmit)(e);
                }
              }} className="space-y-4">
                
                {showContactAdvisorMessage && (
                  <div className="p-4 bg-yellow-50 border-l-4 border-yellow-400 text-yellow-700">
                    <p>Pour modifier vos informations, contactez votre conseiller FIDELEM.</p>
                  </div>
                )}
                
                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={profileForm.control}
                    name="firstName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Prénom</FormLabel>
                        <FormControl>
                          <Input {...field} disabled={isRegularUser} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={profileForm.control}
                    name="lastName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Nom</FormLabel>
                        <FormControl>
                          <Input {...field} disabled={isRegularUser} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                
                <FormField
                  control={profileForm.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email</FormLabel>
                      <FormControl>
                        <Input type="email" {...field} disabled={isRegularUser} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={profileForm.control}
                  name="phone"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Téléphone</FormLabel>
                      <FormControl>
                        <Input {...field} disabled={isRegularUser} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={profileForm.control}
                  name="address"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Adresse</FormLabel>
                      <FormControl>
                        <Textarea {...field} disabled={isRegularUser} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {!isRegularUser && profileForm.watch("email")?.trim().toLowerCase() !== user?.email?.toLowerCase() && (
                  <FormField
                    control={profileForm.control}
                    name="currentPassword"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Mot de passe actuel</FormLabel>
                        <FormControl>
                          <Input type="password" autoComplete="current-password" {...field} />
                        </FormControl>
                        <p className="text-sm text-muted-foreground">Demandé pour changer l'adresse qui sert à vous connecter.</p>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                )}
                
                <Button 
                  type="submit" 
                  className="w-full bg-fidelem hover:bg-fidelem/90"
                  disabled={isRegularUser && !showContactAdvisorMessage}
                >
                  {isRegularUser ? "Modification non autorisée" : "Sauvegarder"}
                </Button>
              </form>
            </Form>
          </TabsContent>
          <TabsContent value="password" className="mt-4">
        <Form {...passwordForm}>
          <form onSubmit={passwordForm.handleSubmit(onPasswordSubmit)} className="space-y-4">
            <FormField
              control={passwordForm.control}
              name="currentPassword"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Mot de passe actuel</FormLabel>
                  <FormControl>
                    <div className="relative">
                      <Input type={showCurrentPassword ? "text" : "password"} {...field} />
                      <button
                        type="button"
                        onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                        className="absolute inset-y-0 right-0 flex items-center pr-3"
                      >
                        {showCurrentPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </button>
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={passwordForm.control}
              name="newPassword"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nouveau mot de passe</FormLabel>
                  <FormControl>
                    <div className="relative">
                      <Input type={showNewPassword ? "text" : "password"} {...field} />
                      <button
                        type="button"
                        onClick={() => setShowNewPassword(!showNewPassword)}
                        className="absolute inset-y-0 right-0 flex items-center pr-3"
                      >
                        {showNewPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </button>
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={passwordForm.control}
              name="confirmPassword"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Confirmer le mot de passe</FormLabel>
                  <FormControl>
                    <div className="relative">
                      <Input type={showConfirmPassword ? "text" : "password"} {...field} />
                      <button
                        type="button"
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        className="absolute inset-y-0 right-0 flex items-center pr-3"
                      >
                        {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </button>
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit" className="w-full bg-fidelem hover:bg-fidelem/90">Modifier le mot de passe</Button>
          </form>
        </Form>
      </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}
