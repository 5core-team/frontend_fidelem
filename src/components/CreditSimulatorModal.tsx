
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { QuickCreditSimulator } from "./QuickCreditSimulator";

interface CreditSimulatorModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function CreditSimulatorModal({ open, onOpenChange }: CreditSimulatorModalProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Simulateur de crédit</DialogTitle>
        </DialogHeader>
        <div className="mt-4">
          <QuickCreditSimulator />
        </div>
      </DialogContent>
    </Dialog>
  );
}
