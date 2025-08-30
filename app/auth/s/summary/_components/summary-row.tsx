import itemRepository from "@/repositories/item-repository";
import { Order } from "@/db/schema";

interface IProps {
  orderId: number;
  orderStatus: Order["status"];
}

export default async function SummaryRow({ orderId, orderStatus }: IProps) {
  const items = await itemRepository.getManyWithQuantity({
    orderId,
    orderStatus: [orderStatus],
  });

  const total = items
    .reduce((acc, { item, quantity }) => acc + item.price * quantity, 0)
    .toFixed(2);

  return (
    <div>
      <div className="grid grid-cols-1 divide-y-2">
        {items.map(({ item, quantity }, i) => (
          <div key={i} className="flex justify-between p-1">
            <div>
              <h3 className="text-lg">{item.name}</h3>
              <p className="font-light text-sm">{item.description}</p>
            </div>
            <div className="flex justify-center text-center gap-2 flex-col">
              <p className="text-xl">
                {quantity}x{item.price.toFixed(2)}€
              </p>
            </div>
          </div>
        ))}
      </div>
      <div className="flex justify-between py-4">
        <p className="font-semibold text-lg">Zhrnutie</p>
        <p className="font-semibold text-xl">{total}€</p>
      </div>
    </div>
  );
}
