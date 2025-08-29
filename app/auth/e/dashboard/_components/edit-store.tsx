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
import { Loader } from "lucide-react";
import { getUser } from "@/lib/user-utils";
import { useState } from "react";
import { useUploadThing } from "@/lib/uploadthing";
import Image from "next/image";
import { deleteFile } from "@/lib/upladthing-server";
import { Store } from "@/db/schema";
import { updateStore } from "@/lib/store-utils";

const formSchema = z.object({
  name: z.string().min(3, {
    message: "Name must be at least 3 characters.",
  }),
  websiteUrl: z.string().url().optional(),
  adress: z.string().min(3, {
    message: "Adress must be at least 3 characters.",
  }),
  description: z.string().min(3, {
    message: "Description must be at least 3 characters.",
  }),
});

interface StoreProps {
  store: Store;
}

export default function EditStore({ store }: StoreProps) {
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
  const [imageUrl, setImageUrl] = useState<string | null>(store.imageUrl ?? "");
  const router = useRouter();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: store.name,
      websiteUrl: store.websiteUrl,
      adress: store.adress,
      description: store.description,
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    const user = await getUser();
    let localUrl = imageUrl;
    if (!user || !user.storeId) {
      return;
    }
    setIsProcessing(true);

    if (image && imageUrl !== store.imageUrl) {
      setProcessingStatus("nahrávanie obrázku");
      try {
        await deleteFile(store.imageUrl);
      } catch (e) {}
      const res = await startUpload([image]);
      if (!res) {
        setIsProcessing(false);
        setError("chyba pri nahrávaní obrázku");
        return;
      }
      localUrl = res[0].url;
    } else {
      localUrl = store.imageUrl;
    }

    setProcessingStatus("konečné upravovanie");
    await updateStore({
      ...values,
      id: store.id,
      imageUrl: localUrl,
    });
    handleReset();
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
      <DialogTrigger asChild>
        <Button className="flex-1 sm:grow-0" variant="ghost">
          Upraviť obchod
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            {store.name}
            <span className="text-sm font-normal"> - Upraviť obchod</span>
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
              name="adress"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Adresa</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="websiteUrl"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Webstránka</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
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
                type="submit"
                style={{ marginLeft: 0 }}
              >
                {isProcessing && <Loader className="animate-spin mr-2" />}
                {processingStatus || (isProcessing ? "Spracovávam" : "Uložiť")}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
