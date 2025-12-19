import { UserRole } from '@/types';

// Seule la secrétaire peut créer et modifier des réservations
export const canManageBookings = (role: UserRole): boolean => {
  return ['secretaire'].includes(role);
};

// Le superadmin et le superviseur QHSE peuvent consulter le planning mais ne peuvent pas créer/modifier
export const canViewBookings = (role: UserRole): boolean => {
  return ['superadmin', 'superviseur_qhse', 'secretaire', 'medecin'].includes(role);
};