import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";

export default function EditOrderClose() {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button>Upraviť dátum</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Upraviť dátum</DialogTitle>
          <DialogDescription></DialogDescription>
        </DialogHeader>
        <div className="flex flex-col gap-2">
          <label className="text-sm font-semibold">Dátum</label>
          <Input type="datetime-local" name="datetime" />
        </div>
      </DialogContent>
    </Dialog>
  );
}
