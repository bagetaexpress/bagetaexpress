import { Item } from "@/db/schema";
import { useMemo } from "react";

interface UseFreeItemsProps {
  data: {
    item: Item;
    quantity: number;
  }[];
  totalOrdered: number;
}

export default function useFreeItems({
  data,
  totalOrdered,
}: UseFreeItemsProps): {
  cartTotalItems: number;
  freeItemsNum: number;
  tillNextFree: number;
  totalPrice: number;
  freeItemsPrice: number;
} {
  const cartTotalItems = useMemo(
    () => data.reduce((acc, item) => acc + item.quantity, 0),
    [data],
  );

  const freeItemsNum = useMemo(
    () => Math.trunc(((totalOrdered % 5) + cartTotalItems) / 5),
    [cartTotalItems, totalOrdered],
  );

  const tillNextFree = useMemo(
    () => 5 - (((totalOrdered % 5) + cartTotalItems) % 5),
    [cartTotalItems, totalOrdered],
  );

  const totalPrice = useMemo(() => {
    return data.reduce((acc, item) => acc + item.item.price * item.quantity, 0);
  }, [data]);

  const freeItemsPrice = useMemo(() => {
    const sortedData = data.toSorted((a, b) => a.item.price - b.item.price);
    let priceSum = 0;
    let index = 0;
    let quantity = sortedData[index].quantity;

    for (let i = 0; i < freeItemsNum; i++) {
      if (quantity <= 0) {
        index++;
        quantity = sortedData[index].quantity;
      }
      priceSum += sortedData[index].item.price;
      quantity--;
    }
    return priceSum;
  }, [freeItemsNum, data]);

  return {
    cartTotalItems,
    freeItemsNum,
    tillNextFree,
    totalPrice,
    freeItemsPrice,
  };
}
