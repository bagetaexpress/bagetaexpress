"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { set, useForm } from "react-hook-form";
import * as z from "zod";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useRouter } from "next/navigation";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Loader, X } from "lucide-react";
import { getUser } from "@/lib/userUtils";
import { Item, addItem, updateItem } from "@/db/controllers/itemController";
import { useMemo, useState } from "react";
import {
  Allergen,
  createItemAllergen,
  deleteItemAllergen,
} from "@/db/controllers/allergenController";
import {
  Ingredient,
  createItemIngredient,
  deleteItemIngredient,
} from "@/db/controllers/ingredientController";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useUploadThing } from "@/lib/uploadthing";
import Image from "next/image";

const formSchema = z.object({
  name: z.string().min(3, {
    message: "Name must be at least 3 characters.",
  }),
  description: z.string(),
  price: z.string().regex(/^\d+(\.\d{1,2})?$/, {
    message: "Price must be a valid number.",
  }),
});

type idName = {
  id: number;
  name: string;
};

interface IPorps {
  item?: Item & {
    allergens: idName[];
    ingredients: idName[];
  };
  action: "add" | "update";
  children?: React.ReactNode;
  allergens: Allergen[];
  ingredients: Ingredient[];
}

export default function AddItemForm({
  item,
  action,
  children,
  allergens: allergenList,
  ingredients: ingredientList,
}: IPorps) {
  const { startUpload } = useUploadThing("imageUploader", {
    onUploadError: () => {
      setProcessingStatus("error");
    },
  });

  const [isOpen, setIsOpen] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [processingStatus, setProcessingStatus] = useState<string>("");
  const [allergens, setAllergens] = useState<idName[]>(item?.allergens ?? []);
  const [image, setImage] = useState<string | null>(null);
  const [ingredients, setIngredients] = useState<idName[]>(
    item?.ingredients ?? []
  );

  const filteredIngredients = useMemo(() => {
    const res = ingredientList.filter(
      (a) => !ingredients.find((b) => a.id === b.id)
    );
    return res;
  }, [ingredients, ingredientList]);

  const filteredAllergens = useMemo(() => {
    const res = allergenList.filter(
      (a) => !allergens.find((b) => a.id === b.id)
    );
    return res;
  }, [allergens, allergenList]);

  const router = useRouter();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: item?.name ?? "",
      description: item?.description ?? "",
      price: item?.price ?? "",
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    const user = await getUser();
    if (!user || !user.storeId) {
      return;
    }
    setIsProcessing(true);
    switch (action) {
      case "update":
        if (!item) return;

        // remove allergens
        for (const allergen of item.allergens) {
          if (allergens.find((a) => a.id === allergen.id)) continue;
          await deleteItemAllergen(item.id, allergen.id);
        }
        // add new allergens
        for (const allergen of allergens) {
          if (item.allergens.find((a) => a.id === allergen.id)) continue;
          await createItemAllergen(item.id, allergen.id);
        }

        // remove ingredients
        for (const ingredient of item.ingredients) {
          if (ingredients.find((a) => a.id === ingredient.id)) continue;
          await deleteItemIngredient(item.id, ingredient.id);
        }
        // add new ingredients
        for (const ingredient of ingredients) {
          if (item.ingredients.find((a) => a.id === ingredient.id)) continue;
          await createItemIngredient(item.id, ingredient.id);
        }

        await updateItem({ ...values, id: item.id });
        break;
      case "add":
        const id = await addItem({ ...values, storeId: user.storeId });
        for (const allergen of allergens) {
          await createItemAllergen(id, allergen.id);
        }
        for (const ingredient of ingredients) {
          await createItemIngredient(id, ingredient.id);
        }
        break;
      default:
        break;
    }
    setIsProcessing(false);
    form.reset();
    router.refresh();
    setIsOpen(false);
  }

  function handleReset() {
    form.reset();
    setImage(null);
    setAllergens([]);
    setIngredients([]);
  }

  return (
    <Dialog
      open={isOpen}
      onOpenChange={() => {
        if (isOpen) {
          handleReset();
        }
        setIsOpen((prev) => !prev);
      }}
    >
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            {
              {
                add: "New item",
                update: "Updating item",
              }[action]
            }
          </DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="flex flex-col gap-3"
          >
            {image && (
              <div className="flex justify-center">
                <Image src={image} alt="Item imgae" height={200} width={200} />
              </div>
            )}
            <Input
              type="file"
              name="image"
              onChange={async (e) => {
                if (!e.target.files) return;
                const file = e.target.files[0];
                if (!file) return;
                if (!file.type.startsWith("image/")) {
                  e.target.value = "";
                  return;
                }
                const res = await startUpload([file]);
                console.log(res);
                setImage(URL.createObjectURL(file));
              }}
            />
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="price"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Price</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="py-3">
              <p className=" text-lg font-bold">Ingredients</p>
              <div className="flex gap-2 py-2 pb-3">
                {ingredients.map((ingredient, i) => (
                  <Badge
                    key={i + "removeAllergen"}
                    className="flex gap-2 items-center"
                  >
                    {ingredient.name}
                    <button
                      type="button"
                      onClick={() =>
                        setIngredients((prev) =>
                          prev.filter((a) => a.id !== ingredient.id)
                        )
                      }
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </Badge>
                ))}
              </div>
              <Select
                value=""
                onValueChange={(v) => {
                  if (!v) return;
                  const id = parseInt(v);
                  const ingredient = ingredientList.find((a) => a.id === id);
                  if (!ingredient) return;
                  setIngredients((prev) => [
                    ...prev,
                    { id, name: ingredient.name },
                  ]);
                }}
              >
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Add allergen" />
                </SelectTrigger>
                <SelectContent>
                  {filteredIngredients.map((ingredient, i) => (
                    <SelectItem key={i} value={ingredient.id.toString()}>
                      {ingredient.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="py-3">
              <p className=" text-lg font-bold">Allergens</p>
              <div className="flex gap-2 py-2 pb-3">
                {allergens.map((allergen, i) => (
                  <Badge
                    key={i + "removeAllergen"}
                    className="flex gap-2 items-center"
                  >
                    {allergen.name}
                    <button
                      type="button"
                      onClick={() =>
                        setAllergens((prev) =>
                          prev.filter((a) => a.id !== allergen.id)
                        )
                      }
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </Badge>
                ))}
              </div>
              <Select
                value=""
                onValueChange={(v) => {
                  if (!v) return;
                  const id = parseInt(v);
                  const allergen = allergenList.find((a) => a.id === id);
                  if (!allergen) return;
                  setAllergens((prev) => [
                    ...prev,
                    { id, name: allergen.name },
                  ]);
                }}
              >
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Add allergen" />
                </SelectTrigger>
                <SelectContent>
                  {filteredAllergens.map((allergen, i) => (
                    <SelectItem key={i} value={allergen.id.toString()}>
                      {allergen.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  handleReset();
                  setIsOpen(false);
                }}
              >
                Cancel
              </Button>
              <Button disabled={isProcessing} type="submit">
                {isProcessing && <Loader className="animate-spin" />}
                {
                  {
                    add: "Add",
                    update: "Update",
                  }[action]
                }
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
