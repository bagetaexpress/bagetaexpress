import { getItemsFromOrder } from "@/db/controllers/itemController";

interface IProps {
  orderId: number;
}

export default async function SummaryRow({ orderId }: IProps) {
  const items = await getItemsFromOrder(orderId);

  const total = items
    .reduce(
      (acc, { item, quantity }) => acc + parseFloat(item.price) * quantity,
      0
    )
    .toFixed(2);

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
                {/* {(parseFloat(item.price) * q).toFixed(2)}€ */}
                {quantity}x{parseFloat(item.price).toFixed(2)}€
              </p>
            </div>
          </div>
        ))}
      </div>
      <div className="flex justify-between py-4">
        <p className="font-semibold text-lg">Total</p>
        <p className="font-semibold text-xl">{total}€</p>
      </div>
    </div>
  );
}
