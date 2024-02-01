import { order } from "./order/order";
import { orderItem } from "./order/orderItem";
import { school } from "./school/school";
import { schoolStore } from "./school/schoolStore";
import { account, session, user, verificationToken } from "./user/user";
import { employee } from "./user/employee";
import { customer } from "./user/customer";
import { item } from "./item/item";
import { store } from "./store/store";

import { orderRelations } from "./order/order";
import { orderItemRelations } from "./order/orderItem";
import { itemRelations } from "./item/item";
import { employeeRelations } from "./user/employee";
import { customerRelations } from "./user/customer";
import { schoolRelations } from "./school/school";
import { schoolStoreRelations } from "./school/schoolStore";
import { storeRelations } from "./store/store";
import { cart, cartRelations } from "./cart/cart";
import { cartItem, cartItemRelations } from "./cart/cartItem";
import { seller, sellerRelations } from "./user/seller";
import { allergen, allergenRelations } from "./item/allergen";
import { itemAllergen, itemAllergenRelations } from "./item/itemAllergen";
import { ingredient, ingredientRelations } from "./item/ingredient";
import { itemIngredient, itemIngredientRelations } from "./item/itemIngredient";
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

export const relations = {
  orderRelations,
  orderItemRelations,
  itemRelations,
  employeeRelations,
  customerRelations,
  schoolRelations,
  schoolStoreRelations,
  storeRelations,
  cartRelations,
  cartItemRelations,
  sellerRelations,
  allergenRelations,
  itemAllergenRelations,
  ingredientRelations,
  itemIngredientRelations,
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
  orderRelations,
  orderItemRelations,
  itemRelations,
  employeeRelations,
  customerRelations,
  schoolRelations,
  schoolStoreRelations,
  storeRelations,
  cartRelations,
  cartItemRelations,
  sellerRelations,
  allergenRelations,
  itemAllergenRelations,
  ingredientRelations,
  itemIngredientRelations,
};
