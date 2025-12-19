import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { InputOTP, InputOTPGroup, InputOTPSlot } from "@/components/ui/input-otp";
import { Icon } from "@/components/Icon";

interface PinValidationDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onValidate: (pin: string) => Promise<boolean>;
}

export const PinValidationDialog = ({ isOpen, onClose, onValidate }: PinValidationDialogProps) => {
  const [pin, setPin] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async () => {
    setError('');
    setIsLoading(true);
    const isValid = await onValidate(pin);
    setIsLoading(false);

    if (isValid) {
      onClose();
      setPin('');
    } else {
      setError('Code PIN incorrect.');
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Validation Requise</DialogTitle>
          <DialogDescription>
            Veuillez saisir votre code PIN à 4 chiffres pour confirmer le démarrage de la consultation.
          </DialogDescription>
        </DialogHeader>
        <div className="flex flex-col items-center justify-center py-4">
          <InputOTP maxLength={4} value={pin} onChange={setPin} disabled={isLoading}>
            <InputOTPGroup>
              <InputOTPSlot index={0} />
              <InputOTPSlot index={1} />
              <InputOTPSlot index={2} />
              <InputOTPSlot index={3} />
            </InputOTPGroup>
          </InputOTP>
          {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
        </div>
        <DialogFooter>
          <Button type="button" variant="outline" onClick={onClose} disabled={isLoading}>Annuler</Button>
          <Button type="submit" onClick={handleSubmit} disabled={isLoading}>
            {isLoading ? 'Validation...' : <><Icon name="Check" className="mr-2 h-4 w-4" /> Valider</>}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};