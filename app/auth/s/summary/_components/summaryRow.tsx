import { Separator } from "@/components/ui/separator";
import { getItemsFromOrder } from "@/db/controllers/itemController";
import { Order } from "@/db/schema";

interface IProps {
  order: Order;
}

export default async function SummaryRow({ order }: IProps) {
  const items = await getItemsFromOrder(order.id);

  const total = items.reduce(
    (acc, { item, quantity }) => acc + item.price * quantity,
    0
  );

  return (
    <div>
      <div className="grid grid-cols-1 divide-y-2">
        {items.map(({ item, quantity }, i) => (
          <div key={i} className="flex justify-between p-1">
            <div>
              <h3 className="font-semibold text-lg">{item.name}</h3>
              <p className="font-light text-sm">{item.description}</p>
            </div>
            <div className="flex justify-center text-center gap-2 flex-col">
              <p className=" font-medium text-xl">
                {quantity}x{item.price.toFixed(2)}€
              </p>
            </div>
          </div>
        ))}
      </div>
      <div className="flex justify-between py-3">
        <p className="font-semibold text-lg">Spolu</p>
        <p className="font-semibold text-xl">{total.toFixed(2)}€</p>
      </div>
      {order.discount > 0 && (
        <>
          <Separator />
          <div className="flex justify-between py-3">
            <p className="font-semibold text-lg">Zľava</p>
            <p className="font-semibold text-xl">
              {order.discount.toFixed(2)}€
            </p>
          </div>
          <Separator />
          <div className="flex justify-between py-3">
            <p className="font-semibold text-lg">Celkom</p>
            <p className="font-semibold text-xl">
              {(total - order.discount).toFixed(2)}€
            </p>
          </div>
        </>
      )}
    </div>
  );
}
