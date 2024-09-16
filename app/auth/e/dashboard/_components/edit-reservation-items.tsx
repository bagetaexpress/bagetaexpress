import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import {
  createReservation,
  deleteReservation,
  updateReservation,
} from "@/db/controllers/reservation-controller";
import { Item, Reservation, School } from "@/db/schema";
import { Plus, Save, Trash2 } from "lucide-react";
import { revalidatePath } from "next/cache";

export default function EditReservationItems({
  schoolId,
  reservations,
}: {
  schoolId: School["id"];
  reservations: Array<{
    item: Item;
    reservation: Reservation | null;
  }>;
}) {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button className="flex-1">Položky rezervácie</Button>
      </DialogTrigger>
      <DialogContent autoFocus={false} className="max-h-dvh overflow-auto">
        <DialogHeader>
          <DialogTitle>Upraviť položky rezervácie</DialogTitle>
        </DialogHeader>
        <div className="grid gap-2">
          {reservations
            .filter(({ reservation }) => reservation)
            .map(({ item, reservation }) => (
              <EditReservationItem
                item={item}
                reservation={reservation as Reservation}
                key={item.id}
              />
            ))}
          {reservations
            .filter(({ reservation }) => !reservation)
            .map(({ item }) => (
              <CreateReservationRow
                item={item}
                schoolId={schoolId}
                key={item.id}
              />
            ))}
        </div>
      </DialogContent>
    </Dialog>
  );
}

function EditReservationItem({
  item,
  reservation,
}: {
  item: Item;
  reservation: Reservation;
}) {
  return (
    <div key={item.id} className="flex gap-2 justify-between">
      <p>{item.name}</p>
      <div className="flex gap-1">
        <form
          autoFocus={false}
          className="flex gap-1"
          action={async (form: FormData) => {
            "use server";
            const quantity = Number(form.get("quantity"));
            if (isNaN(quantity)) return;

            await updateReservation({
              itemId: item.id,
              schoolId: reservation.schoolId,
              quantity,
            });
            revalidatePath("/auth/e/dashboard");
          }}
        >
          <Input
            type="number"
            autoFocus={false}
            min={0}
            tabIndex={-1}
            name="quantity"
            defaultValue={reservation.quantity}
            className="min-w-0 w-fit max-w-[8ch] aspect-[4/3]"
          />
          <Button size="icon" className="aspect-square" type="submit">
            <Save className="h-5 w-5" />
          </Button>
        </form>
        <DeleteReservationDialog item={item} schoolId={reservation.schoolId} />
      </div>
    </div>
  );
}

function DeleteReservationDialog({
  item,
  schoolId,
}: {
  item: Item;
  schoolId: School["id"];
}) {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" size="icon" className="aspect-square">
          <Trash2 className="h-5 w-5" />
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Odstrániť rezerváciu</DialogTitle>
        </DialogHeader>
        <p>Chcete odstrániť rezerváciu?</p>
        <DialogFooter className="grid grid-cols-2">
          <DialogClose asChild>
            <Button variant="outline">Nie</Button>
          </DialogClose>
          <form
            action={async () => {
              "use server";
              await deleteReservation(item.id, schoolId);
              revalidatePath("/auth/e/dashboard");
            }}
            className="grid"
          >
            <Button variant="destructive" type="submit">
              Áno
            </Button>
          </form>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

function CreateReservationRow({
  item,
  schoolId,
}: {
  item: Item;
  schoolId: School["id"];
}) {
  return (
    <div key={item.id} className="flex gap-2 justify-between">
      <p className="flex-1">{item.name}</p>
      <form
        autoFocus={false}
        className="flex gap-1"
        action={async (form: FormData) => {
          "use server";

          const quantity = Number(form.get("quantity"));
          if (isNaN(quantity)) return;

          await createReservation({
            schoolId,
            itemId: item.id,
            quantity,
          });
          revalidatePath("/auth/e/dashboard");
        }}
      >
        <Input
          type="number"
          min={0}
          tabIndex={-1}
          autoFocus={false}
          name="quantity"
          className="min-w-0 max-w-[8ch] aspect-[4/3]"
        />
        <Button className="px-8">
          <Plus className="h-5 w-5" />
        </Button>
      </form>
    </div>
  );
}
