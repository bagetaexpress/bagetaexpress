import { order } from "./order/order";
import { orderItem } from "./order/orderItem";
import { school } from "./school/school";
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
import { storeRelations } from "./store/store";


export const schema = {
  order,
  orderItem,
  school,
  user,
  employee,
  customer,
  item,
  store,

  orderRelations,
  orderItemRelations,
  itemRelations,
  employeeRelations,
  customerRelations,
  schoolRelations,
  storeRelations,
}

export {
  order,
  orderItem,
  school,
  user,
  employee,
  customer,
  item,
  store,

  orderRelations,
  orderItemRelations,
  itemRelations,
  employeeRelations,
  customerRelations,
  schoolRelations,
  storeRelations,
}