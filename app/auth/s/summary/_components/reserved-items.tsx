import { getReservedItemsByStoreAndSchool } from "@/db/controllers/item-controller";
import { User } from "next-auth";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { Suspense } from "react";
import { Loader } from "lucide-react";
import { getUser } from "@/lib/user-utils";

export default function ReservedItems() {
  return (
    <Suspense
      fallback={
        <Button variant="outline" className="flex-1 md:grow-0" disabled>
          <Loader className="w-5 h-5 animate-spin" />
        </Button>
      }
    >
      <ReservedItemsInner />
    </Suspense>
  );
}

async function ReservedItemsInner() {
  const user = await getUser();
  if (!user || !user.schoolId) {
    return null;
  }

  const items = await getReservedItemsByStoreAndSchool(1, user.schoolId);

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" className="flex-1 md:grow-0">
          Zobraziť rezervované
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Rezervované položky</DialogTitle>
        </DialogHeader>
        {items.length === 0 && (
          <div className="text-center text-gray-500">Žiadne rezervácie</div>
        )}
        <div className="grid divide-y-2">
          {items.map(({ item, store, quantity }) => (
            <div
              key={item.id}
              className={`flex justify-between p-2 items-center`}
            >
              <div className="flex gap-1 items-center">
                {item.imageUrl != null && item.imageUrl != "" ? (
                  <Image
                    src={item.imageUrl}
                    width={150}
                    height={150}
                    alt="Obrázok produktu"
                    className="rounded-md max-w-24 object-contain"
                  />
                ) : null}
                <div>
                  <h3 className="font-semibold text-lg">{item.name}</h3>
                  <p className="font-light text-sm">{store.name}</p>
                </div>
              </div>
              <div className="flex justify-center text-center gap-2 flex-col">
                <p className="font-medium text-xl">{quantity} ks.</p>
              </div>
            </div>
          ))}
        </div>
      </DialogContent>
    </Dialog>
  );
}
