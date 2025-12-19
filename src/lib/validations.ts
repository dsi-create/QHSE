import { z } from "zod";

// Schéma de validation pour l'authentification
export const signInSchema = z.object({
  email: z.string().email("Email invalide"),
  password: z.string().min(6, "Le mot de passe doit contenir au moins 6 caractères")
});

export const signUpSchema = z.object({
  email: z.string().email("Email invalide"),
  password: z.string()
    .min(6, "Le mot de passe doit contenir au moins 6 caractères")
    .regex(/[a-zA-Z]/, "Le mot de passe doit contenir au moins une lettre")
    .regex(/[0-9]/, "Le mot de passe doit contenir au moins un chiffre"),
  username: z.string()
    .min(3, "Le nom d'utilisateur doit contenir au moins 3 caractères")
    .max(50, "Le nom d'utilisateur ne peut pas dépasser 50 caractères"),
  first_name: z.string().min(2, "Le prénom doit contenir au moins 2 caractères"),
  last_name: z.string().min(2, "Le nom doit contenir au moins 2 caractères"),
  role: z.enum([
    'agent_securite',
    'agent_entretien',
    'technicien',
    'superviseur_qhse',
    'superadmin',
    'secretaire',
    'superviseur_agent_securite',
    'superviseur_agent_entretien',
    'superviseur_technicien',
    'medecin',
    'Infirmier'
  ]),
  civility: z.enum(['M.', 'Mme', 'Mlle']).optional(),
  service: z.string().optional(),
  pin: z.string().length(4, "Le code PIN doit contenir 4 chiffres").optional()
});

export const passwordUpdateSchema = z.object({
  password: z.string()
    .min(6, "Le mot de passe doit contenir au moins 6 caractères")
    .regex(/[a-zA-Z]/, "Le mot de passe doit contenir au moins une lettre")
    .regex(/[0-9]/, "Le mot de passe doit contenir au moins un chiffre")
});

// Schéma de validation pour les incidents
export const incidentSchema = z.object({
  type: z.string().min(1, "Le type d'incident est requis"),
  description: z.string().min(10, "La description doit contenir au moins 10 caractères"),
  priorite: z.enum(['faible', 'moyenne', 'élevée', 'urgente']).optional(),
  service: z.string().optional(),
  lieu: z.string().optional(),
  photo_urls: z.array(z.string().url()).optional()
});

// Schéma de validation pour les visiteurs
export const visitorSchema = z.object({
  full_name: z.string().min(2, "Le nom complet est requis (minimum 2 caractères)"),
  id_document: z.string().min(1, "Le numéro de pièce d'identité est requis"),
  reason: z.string().optional(),
  destination: z.string().optional(),
  person_to_see: z.string().optional()
});

// Schéma de validation pour les réservations
export const bookingSchema = z.object({
  room_id: z.string().uuid("ID de salle invalide"),
  title: z.string().min(1, "Le titre est requis"),
  start_time: z.string().datetime("Date de début invalide"),
  end_time: z.string().datetime("Date de fin invalide"),
  doctor_id: z.string().uuid().optional()
}).refine((data) => new Date(data.start_time) < new Date(data.end_time), {
  message: "L'heure de fin doit être après l'heure de début",
  path: ["end_time"]
});

// Schéma de validation pour les équipements biomédicaux
export const biomedicalEquipmentSchema = z.object({
  name: z.string().min(1, "Le nom est requis"),
  model: z.string().optional(),
  serial_number: z.string().min(1, "Le numéro de série est requis"),
  department: z.string().optional(),
  location: z.string().min(1, "L'emplacement est requis")
});

// Schéma de validation pour les tâches planifiées
export const plannedTaskSchema = z.object({
  title: z.string().min(1, "Le titre est requis"),
  description: z.string().min(1, "La description est requise"),
  assigned_to: z.string().uuid().optional(),
  due_date: z.string().date("Date invalide")
});

// Type helper pour extraire le type TypeScript depuis un schéma Zod
export type SignInInput = z.infer<typeof signInSchema>;
export type SignUpInput = z.infer<typeof signUpSchema>;
export type PasswordUpdateInput = z.infer<typeof passwordUpdateSchema>;
export type IncidentInput = z.infer<typeof incidentSchema>;
export type VisitorInput = z.infer<typeof visitorSchema>;
export type BookingInput = z.infer<typeof bookingSchema>;
export type BiomedicalEquipmentInput = z.infer<typeof biomedicalEquipmentSchema>;
export type PlannedTaskInput = z.infer<typeof plannedTaskSchema>;



