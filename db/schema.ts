import { order } from "./order/order";
import { orderItem } from "./order/orderItem";
import { school } from "./school/school";
import { schoolStore } from "./school/schoolStore";
import { user } from "./user/user";
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

export const tables = {
  order,
  orderItem,
  school,
  schoolStore,
  user,
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
