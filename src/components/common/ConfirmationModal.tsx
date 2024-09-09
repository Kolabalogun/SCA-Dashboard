/* eslint-disable @typescript-eslint/no-explicit-any */
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface ConfirmationModalProps {
  title?: string;
  message?: string;
  isOpen: boolean;
  onConfirm: any;
  onCancel: () => void;
  isLoading?: boolean;
}

const ConfirmationModal = ({
  title = "Confirm Action",
  message = "Are you sure you want to proceed?",
  isOpen,
  onConfirm,
  onCancel,
  isLoading,
}: ConfirmationModalProps) => {
  return (
    <Dialog open={isOpen} onOpenChange={onCancel}>
      <DialogContent className="bg-gray-200 ">
        <DialogHeader>
          <DialogTitle className="text-black">{title}</DialogTitle>
        </DialogHeader>
        <p className="text-black">{message}</p>
        <DialogFooter>
          <Button
            disabled={isLoading}
            className="bg-red-600"
            onClick={onConfirm}
          >
            {isLoading ? "Loading..." : "Confirm"}
          </Button>
          <Button className="text-black" variant="outline" onClick={onCancel}>
            Cancel
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ConfirmationModal;
