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
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Loader } from "lucide-react";
import { getUser } from "@/lib/userUtils";
import { Item, addItem, updateItem } from "@/db/controllers/itemController";
import { useState } from "react";

const formSchema = z.object({
  name: z.string().min(3, {
    message: "Name must be at least 3 characters.",
  }),
  description: z.string(),
  price: z.string().regex(/^\d+(\.\d{1,2})?$/, {
    message: "Price must be a valid number.",
  }),
});

interface IPorps {
  item?: Item;
  action: "add" | "update";
  children?: React.ReactNode;
}

export default function AddItemForm({ item, action, children }: IPorps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
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
        await updateItem({ ...values, id: item.id });
        break;
      case "add":
        await addItem({ ...values, storeId: user.storeId });
        break;
      default:
        break;
    }
    setIsProcessing(false);
    form.reset();
    router.refresh();
    setIsOpen(false);
  }

  return (
    <Dialog open={isOpen} onOpenChange={() => setIsOpen((prev) => !prev)}>
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
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsOpen(false)}>
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
