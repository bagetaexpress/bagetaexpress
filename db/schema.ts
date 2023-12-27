import { order } from "./order/order";
import { orderItem } from "./order/orderItem";
import { school } from "./school/school";
import { schoolStore } from "./school/schoolStore";
import { user } from "./user/user";
import { employee } from "./user/employee";
import { customer } from "./user/customer";
import { item } from "./store/item";
import { store } from "./store/store";

import { orderRelations } from "./order/order";
import { orderItemRelations } from "./order/orderItem";
import { itemRelations } from "./store/item";
import { employeeRelations } from "./user/employee";
import { customerRelations } from "./user/customer";
import { schoolRelations } from "./school/school";
import { schoolStoreRelations } from "./school/schoolStore";
import { storeRelations } from "./store/store";
import { cart, cartRelations } from "./cart/cart";
import { cartItem, cartItemRelations } from "./cart/cartItem";


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
}

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
}

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
}