"use server";

import itemRepository from "@/repositories/item-repository";

const updateItem = itemRepository.updateSingle;
const createItem = itemRepository.createSingle;

export { updateItem, createItem };
