import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Icon } from "@/components/Icon";
import { User } from '@/types';
import { showError, showSuccess } from '@/utils/toast';
import { resetUserPassword } from '@/utils/supabase-admin';

interface ResetPasswordDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  userToReset: User;
}

export const ResetPasswordDialog = ({ isOpen, onOpenChange, userToReset }: ResetPasswordDialogProps) => {
  const [newPassword, setNewPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    if (!newPassword || newPassword.length < 6) {
      showError('Le nouveau mot de passe doit contenir au moins 6 caractères.');
      return;
    }

    setLoading(true);
    const success = await resetUserPassword(userToReset.id, newPassword);
    setLoading(false);

    if (success) {
      showSuccess(`Le mot de passe de ${userToReset.first_name} ${userToReset.last_name} a été réinitialisé.`);
      onOpenChange(false);
      setNewPassword('');
    } else {
      showError("Échec de la réinitialisation du mot de passe.");
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Réinitialiser le mot de passe de {userToReset.first_name} {userToReset.last_name}</DialogTitle>
          <DialogDescription>
            Saisissez un nouveau mot de passe pour cet utilisateur.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="newPassword" className="text-right">Nouveau mot de passe</Label>
            <Input 
              id="newPassword" 
              type="password" 
              value={newPassword} 
              onChange={(e) => setNewPassword(e.target.value)} 
              className="col-span-3" 
              required 
              minLength={6}
            />
          </div>
        </div>
        <DialogFooter>
          <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>Annuler</Button>
          <Button type="submit" onClick={handleSubmit} disabled={loading}>
            {loading ? 'Réinitialisation...' : <><Icon name="KeyRound" className="mr-2 h-4 w-4" /> Réinitialiser</>}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};