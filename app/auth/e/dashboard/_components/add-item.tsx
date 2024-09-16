"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
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
import { Loader, Trash2, X } from "lucide-react";
import { getUser } from "@/lib/user-utils";
import { addItem, updateItem } from "@/db/controllers/item-controller";
import { useEffect, useMemo, useRef, useState } from "react";
import {
  createItemAllergen,
  deleteAllItemAllergens,
} from "@/db/controllers/allergen-controller";
import {
  createItemIngredient,
  deleteItemIngredients,
} from "@/db/controllers/ingredient-controller";
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
import { deleteFile } from "@/lib/upladthing-server";
import { Allergen, Ingredient, Item } from "@/db/schema";
import React from "react";
import { revalidateItems } from "@/lib/store-utils";

const formSchema = z.object({
  name: z.string().min(3, {
    message: "Názov musí mať aspoň 3 znaky.",
  }),
  description: z.string(),
  weight: z.string().regex(/^\d+$/, {
    message: "Váha musí byť celé číslo.",
  }),
  price: z.string().regex(/^\d+(\.\d{1,2})?$/, {
    message:
      "Cena musí byť číslo s maximálne dvoma desatinnými miestami oddelenými bodkov.",
  }),
  allergens: z.string().regex(/^\d+(,\d+)*$/, {
    message: "Alergény musia byť zapísané vo formáte 1,2,3,...",
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
  const imageInputRef = useRef<HTMLInputElement>(null);
  const { startUpload } = useUploadThing("imageUploader", {
    onUploadError: () => {
      setProcessingStatus("error");
    },
    onClientUploadComplete: () => {
      setProcessingStatus("upload complete");
    },
  });

  const [isOpen, setIsOpen] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [processingStatus, setProcessingStatus] = useState<string>("");
  const [image, setImage] = useState<File | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [imageUrl, setImageUrl] = useState<string | null>(item?.imageUrl ?? "");
  const [ingredients, setIngredients] = useState<idName[]>(
    item?.ingredients ?? [],
  );

  const filteredIngredients = useMemo(() => {
    const res = ingredientList.filter(
      (a) => !ingredients.find((b) => a.id === b.id),
    );
    return res;
  }, [ingredients, ingredientList]);

  const router = useRouter();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: useMemo(
      () => ({
        name: item?.name ?? "",
        weight: item?.weight ? item.weight.toString() : undefined,
        description: item?.description ?? "",
        price: item?.price ? item.price.toString() : "",
        allergens: item?.allergens.map((a) => a.id).join(",") ?? "",
      }),
      [item],
    ),
  });

  useEffect(() => {
    if (!item) return;
    form.reset({
      name: item.name,
      weight: item.weight.toString(),
      description: item.description,
      price: item.price ? item.price.toString() : "",
      allergens: item.allergens.map((a) => a.id).join(","),
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [item]);

  async function onSubmit(values: z.infer<typeof formSchema>) {
    const user = await getUser();
    let localUrl = imageUrl;
    if (!user || !user.storeId) {
      return;
    }
    setIsProcessing(true);

    let notFound: number[] = [];
    const allergens = values.allergens.split(",").map((val) => {
      const id = parseInt(val);
      const found = allergenList.find((a) => a.number === id);
      if (!found) {
        notFound.push(id);
        return null;
      }
      return { id: found.id, name: found.name };
    }) as idName[];
    if (notFound.length > 0) {
      setError(`Alergény s číslami ${notFound.join(", ")} neexistujú.`);
      setIsProcessing(false);
      return;
    }

    switch (action) {
      case "update":
        if (!item) return;

        if (image && imageUrl !== item.imageUrl) {
          setProcessingStatus("nahrávanie obrázku");
          try {
            await deleteFile(item.imageUrl);
          } catch (e) {}
          const res = await startUpload([image]);
          if (!res) {
            setIsProcessing(false);
            setError("chyba pri nahrávaní obrázku");
            return;
          }
          localUrl = res[0].url;
        } else {
          localUrl = item.imageUrl;
        }

        setProcessingStatus("upravovanie alergénov");
        // remove allergens
        await deleteAllItemAllergens(item.id);
        for (const allergen of allergens) {
          await createItemAllergen(item.id, allergen.id);
        }

        setProcessingStatus("upravovanie ingrediencií");
        // remove ingredients
        await deleteItemIngredients(item.id);
        for (const ingredient of ingredients) {
          await createItemIngredient(item.id, ingredient.id);
        }

        setProcessingStatus("konečné upravovanie");
        await updateItem({
          ...(({ allergens, ...rest }) => rest)(values),
          price: parseFloat(values.price),
          weight: parseInt(values.weight),
          id: item.id,
          imageUrl: localUrl ?? "",
        });
        break;
      case "add":
        localUrl = "";
        if (image) {
          setProcessingStatus("nahrávanie obrázku");
          const res = await startUpload([image]);
          if (!res) {
            setIsProcessing(false);
            setError("Chyba pri nahrávaní obrázku");
            return;
          }
          localUrl = res[0].url;
        }

        setProcessingStatus("Pridávanie produktu");
        const id = await addItem({
          ...values,
          price: parseFloat(values.price),
          weight: parseInt(values.weight),
          storeId: user.storeId,
          imageUrl: localUrl ?? "",
        });

        await deleteAllItemAllergens(id);
        for (const allergen of allergens) {
          await createItemAllergen(id, allergen.id);
        }
        await deleteItemIngredients(id);
        for (const ingredient of ingredients) {
          await createItemIngredient(id, ingredient.id);
        }
        break;
      default:
        break;
    }
    handleReset();
    revalidateItems();
    setIsOpen(false);
    router.refresh();
  }

  function handleReset() {
    form.reset();
    setImage(null);
    setImageUrl(null);
    setIsProcessing(false);
    setProcessingStatus("");
    setError(null);
    setIngredients([]);
  }

  return (
    <Dialog
      open={isOpen}
      onOpenChange={() => {
        if (isOpen) {
          handleReset();
        } else {
          setImageUrl(item?.imageUrl ?? "");
          setIngredients(item?.ingredients ?? []);
        }
        setIsOpen((prev) => !prev);
      }}
    >
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="max-h-dvh overflow-auto">
        <DialogHeader>
          <DialogTitle>
            {
              {
                add: "Nový produkt",
                update: "Upravovanie produktu",
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
                <Image
                  src={imageUrl ?? ""}
                  alt="Obrázok produktu"
                  height={200}
                  width={200}
                />
              </div>
            )}
            <Input
              type="file"
              name="image"
              ref={imageInputRef}
              onChange={async (e) => {
                if (!e.target.files) return;
                const file = e.target.files[0];
                if (!file) return;
                if (!file.type.startsWith("image/")) {
                  e.target.value = "";
                  return;
                }
                setImage(file);
                setImageUrl(URL.createObjectURL(file));
              }}
            />
            {imageUrl != null && imageUrl !== "" && (
              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  if (imageInputRef != null && imageInputRef.current != null) {
                    imageInputRef.current.value = "";
                  }
                  setImage(null);
                  setImageUrl(null);
                }}
              >
                Zmazať fotku
                <Trash2 className="w-4 h-4 ml-2" />
              </Button>
            )}
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Názov</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="weight"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Váha (g)</FormLabel>
                  <FormControl>
                    <Input {...field} inputMode="text" />
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
                  <FormLabel>Popis</FormLabel>
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
                  <FormLabel>Cena</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="allergens"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Alergény</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="py-3">
              <p className=" text-lg font-bold">Zloženie</p>
              <div className="flex gap-2 py-2 pb-3 flex-wrap">
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
                          prev.filter((a) => a.id !== ingredient.id),
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
                disabled={filteredIngredients.length <= 0}
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
                  <SelectValue placeholder="Pridať zložku" />
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
            {error && <p className="text-red-500 text-center py-2">{error}</p>}
            <DialogFooter className="gap-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  handleReset();
                  setIsOpen(false);
                }}
              >
                Zrušiť
              </Button>
              <Button
                disabled={isProcessing}
                style={{ marginLeft: 0 }}
                type="submit"
              >
                {isProcessing && <Loader className="animate-spin mr-2" />}
                {processingStatus ||
                  { add: "Pridať", update: "Upraviť" }[action]}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
