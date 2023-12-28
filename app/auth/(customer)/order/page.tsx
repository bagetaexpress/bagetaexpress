import { getItemsFromOrder } from "@/db/controllers/itemController";
import { getOrdersByUserId } from "@/db/controllers/orderController";
import { getUser } from "@/lib/userUtils";
import QrCode from "./_components/qrCode";

export default async function OrderPage() {
  const currUser = await getUser();
  if (!currUser) return null;

  const foundOrders = await getOrdersByUserId(currUser.id, "ordered");
  if (foundOrders.length === 0) return null;
  const order = foundOrders[0];

  const items = await getItemsFromOrder(order.id);
  const total = items.reduce(
    (acc, { item }) => acc + parseFloat(item.price),
    0
  );

  return (
    <div>
      <h1 className="text-2xl font-semibold pt-2">Order</h1>
      <div className="flex justify-center">
        <QrCode pin={order.pin} />
      </div>
      <h3 className="pb-3 text-center font-bold text-lg">
        Order pin: {order.pin}
      </h3>
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
        <p className="font-semibold text-xl">
          {items
            .reduce(
              (acc, item) => acc + parseFloat(item.item.price) * item.quantity,
              0
            )
            .toFixed(2)}
          €
        </p>
      </div>
    </div>
  );
}
