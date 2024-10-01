import "server-only";
import { db } from "@/db";
import { Cart, cart, cartItem, CartItem } from "@/db/schema";
import { and, eq, sql } from "drizzle-orm";

async function addItemToCart({
  userId,
  itemId,
}: {
  userId: Cart["userId"];
  itemId: CartItem["itemId"];
}): Promise<void> {
  let foundCart = await getSingle({ userId });
  if (!foundCart) {
    foundCart = await createSingle({ userId });
  }
  await db.transaction(async (tx) => {
    const [updatedCartItem] = await tx
      .insert(cartItem)
      .values({
        cartId: foundCart.userId,
        quantity: 1,
        itemId,
      })
      .onConflictDoUpdate({
        target: [cartItem.cartId, cartItem.itemId],
        set: {
          quantity: sql`${cartItem.quantity} + 1`,
        },
      })
      .returning();
    if (!updatedCartItem) {
      throw new Error("Failed to update cart item");
    }
    if (updatedCartItem.quantity > 5) {
      throw new Error("V košíku už máte maximálny počet kusov");
    }
  });
}

async function updateCartItemSingle({
  userId,
  itemId,
  quantity,
}: {
  userId: Cart["userId"];
  itemId: CartItem["itemId"];
  quantity: CartItem["quantity"];
}): Promise<void> {
  let foundCart = await getSingle({ userId });
  if (!foundCart) {
    throw new Error(`No cart found for user ${userId}`);
  }

  if (quantity > 5) {
    throw new Error("V košíku už máte maximálny počet kusov");
  }

  if (quantity <= 0) {
    await db
      .delete(cartItem)
      .where(
        and(eq(cartItem.cartId, foundCart.userId), eq(cartItem.itemId, itemId)),
      );
    return;
  }
  const [updatedItem] = await db
    .update(cartItem)
    .set({
      quantity: quantity,
    })
    .where(
      and(eq(cartItem.cartId, foundCart.userId), eq(cartItem.itemId, itemId)),
    )
    .returning();

  if (updatedItem.quantity <= 0) {
    await db
      .delete(cartItem)
      .where(
        and(eq(cartItem.cartId, foundCart.userId), eq(cartItem.itemId, itemId)),
      );
  }
}

async function getCartItemMultiple({
  cartId,
}: {
  cartId: CartItem["cartId"];
}): Promise<CartItem[]> {
  return await db.select().from(cartItem).where(eq(cartItem.cartId, cartId));
}

async function getSingle({
  userId,
}: {
  userId: Cart["userId"];
}): Promise<Cart | null> {
  const [found] = await db.select().from(cart).where(eq(cart.userId, userId));
  return found ?? null;
}

async function createSingle({
  userId,
}: {
  userId: Cart["userId"];
}): Promise<Cart> {
  const [created] = await db
    .insert(cart)
    .values({
      userId,
    })
    .returning();
  return created;
}

async function deleteSingle({
  userId,
}: {
  userId: Cart["userId"];
}): Promise<void> {
  await db.transaction(async (tx) => {
    await tx.delete(cartItem).where(eq(cartItem.cartId, userId));
    await tx.delete(cart).where(eq(cart.userId, userId));
  });
}

export const cartRepository = {
  addItemToCart,
  updateCartItemSingle,
  getCartItemMultiple,
  getSingle,
  createSingle,
  deleteSingle,
};

export default cartRepository;
