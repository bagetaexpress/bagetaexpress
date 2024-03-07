import { order } from "./order/order";
import { orderItem } from "./order/orderItem";
import { school } from "./school/school";
import { schoolStore } from "./school/schoolStore";
import { account, session, user, verificationToken } from "./user/user";
import { employee } from "./user/employee";
import { customer } from "./user/customer";
import { item } from "./item/item";
import { store } from "./store/store";

import { cart } from "./cart/cart";
import { cartItem } from "./cart/cartItem";
import { seller } from "./user/seller";
import { allergen } from "./item/allergen";
import { itemAllergen } from "./item/itemAllergen";
import { ingredient } from "./item/ingredient";
import { itemIngredient } from "./item/itemIngredient";
import { InferSelectModel } from "drizzle-orm";

/*
DROP TABLE IF EXISTS 
  `__drizzle_migrations`,
  `order`,
  `order_item`,
  `school`,
  `school_store`,
  `user`,
  `account`,
  `session`,
  `verificationToken`,
  `employee`,
  `customer`,
  `item`,
  `store`,
  `cart`,
  `cart_item`,
  `seller`,
  `allergen`,
  `item_allergen`,
  `ingredient`,
  `item_ingredient`;
*/

export type Order = InferSelectModel<typeof order>;
export type OrderItem = InferSelectModel<typeof orderItem>;
export type School = InferSelectModel<typeof school>;
export type SchoolStore = InferSelectModel<typeof schoolStore>;
export type User = InferSelectModel<typeof user>;
export type Account = InferSelectModel<typeof account>;
export type Session = InferSelectModel<typeof session>;
export type VerificationToken = InferSelectModel<typeof verificationToken>;
export type Employee = InferSelectModel<typeof employee>;
export type Customer = InferSelectModel<typeof customer>;
export type Item = InferSelectModel<typeof item>;
export type Store = InferSelectModel<typeof store>;
export type Cart = InferSelectModel<typeof cart>;
export type CartItem = InferSelectModel<typeof cartItem>;
export type Seller = InferSelectModel<typeof seller>;
export type Allergen = InferSelectModel<typeof allergen>;
export type ItemAllergen = InferSelectModel<typeof itemAllergen>;
export type Ingredient = InferSelectModel<typeof ingredient>;
export type ItemIngredient = InferSelectModel<typeof itemIngredient>;

export const tables = {
  order,
  orderItem,
  school,
  schoolStore,
  user,
  account,
  session,
  verificationToken,
  employee,
  customer,
  item,
  store,
  cart,
  cartItem,
  seller,
  allergen,
  itemAllergen,
  ingredient,
  itemIngredient,
};

export {
  order,
  orderItem,
  school,
  schoolStore,
  user,
  account,
  session,
  verificationToken,
  employee,
  customer,
  item,
  store,
  cart,
  cartItem,
  seller,
  allergen,
  itemAllergen,
  ingredient,
  itemIngredient,
};
