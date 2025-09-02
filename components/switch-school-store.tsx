"use server";

import { Suspense } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { getUser } from "@/lib/user-utils";
import { Button } from "./ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import schoolRepository from "@/repositories/school-repository";
import storeRepository from "@/repositories/store-repository";
import userRepository from "@/repositories/user-repository";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

interface SwitchSchoolStoreProps {
  path: string;
  showChangeSchool?: boolean;
  showChangeStore?: boolean;
  adminOnly?: boolean;
  storeOwnerOnly?: boolean;
}

async function SwitchSchoolStore(props: SwitchSchoolStoreProps) {
  if (!props.showChangeSchool && !props.showChangeStore) {
    return null;
  }

  return (
    <Suspense fallback={<SwitchSchoolStoreFallback />}>
      <SwitchSchoolStoreInner {...props} />
    </Suspense>
  )
}

async function SwitchSchoolStoreInner({
  path,
  showChangeSchool = false,
  showChangeStore = false,
  adminOnly = false,
  storeOwnerOnly = false,
}: SwitchSchoolStoreProps) {
  const user = await getUser();
  if (!user || !(user.isStoreOwner || user.isAdmin)) {
    return null;
  }

  if (!user.storeId) {
    return null;
  }

  if (adminOnly && !user.isAdmin) {
    return null;
  }

  if (storeOwnerOnly && !user.isStoreOwner && !user.isAdmin) {
    return null;
  }

  const schools = await schoolRepository.getMany({ storeId: user.storeId });
  const stores = user.isAdmin ? await storeRepository.getMany() : [];

  async function handleStoreChange(formData: FormData) {
    "use server";
    const user = await getUser();
    if (!user) {
      throw new Error("User not found");
    }
    if (!user.isAdmin) {
      throw new Error("User not authorized");
    }
    const storeId = formData.get("storeId") as string;
    await userRepository.updateSingle({
      userId: user.id,
      storeId: parseInt(storeId),
    });

    revalidatePath(path);
    redirect(path);
  }

  async function handleSchoolChange(formData: FormData) {
    "use server";
    const user = await getUser();
    if (!user) {
      throw new Error("User not found");
    }
    if (!user.isStoreOwner && !user.isAdmin) {
      throw new Error("User not authorized");
    }
    const schoolId = formData.get("schoolId") as string;
    await userRepository.updateSingle({
      userId: user.id,
      schoolId: parseInt(schoolId),
    });

    revalidatePath(path);
    redirect(path);
  }

  return (
    <div className="flex flex-col sm:flex-row sm:gap-4 flex-wrap items-center border-b border-gray-200 max-w-screen-lg mx-auto w-full">
      {user.isAdmin && showChangeStore && (
        <form
          action={handleStoreChange}
          className="flex py-2 gap-2 flex-1 md:grow-0 w-full sm:w-auto"
        >
          <Select name="storeId" defaultValue={user.storeId.toString()}>
            <SelectTrigger className="flex-1 md:grow-0 md:min-w-[180px]">
              <SelectValue placeholder="Vyberte obchod" />
            </SelectTrigger>
            <SelectContent>
              {stores.map((store) => (
                <SelectItem key={store.id} value={store.id.toString()}>{store.id === user.storeId ? `${store.name} (aktuálny)` : store.name}</SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Button type="submit">
            Zmeniť obchod
          </Button>
        </form>
        )
      }
      {showChangeSchool && (
        <form
          action={handleSchoolChange}
          className="flex py-2 gap-2 flex-1 md:grow-0 w-full sm:w-auto"
        >
          <Select name="schoolId" defaultValue={user.schoolId?.toString()}>
            <SelectTrigger className="flex-1 md:grow-0 md:min-w-[180px]">
              <SelectValue placeholder="Vyberte školu" />
            </SelectTrigger>
            <SelectContent>
              {schools.map((school) => (
                <SelectItem key={school.id} value={school.id.toString()}>{school.id === user.schoolId ? `${school.name} (aktuálna)` : school.name}</SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Button type="submit">
            Zmeniť školu
          </Button>
        </form>
      )}
    </div>
  )
}

function SwitchSchoolStoreFallback() {
  return (
    <div className="flex flex-col sm:flex-row sm:gap-4 flex-wrap items-center border-b border-gray-200 max-w-screen-lg mx-auto w-full">
      <div className="flex py-2 gap-2 flex-1 md:grow-0">
        <Skeleton className="h-10 w-[180px]" />
        <Skeleton className="h-10 w-28" />
      </div>
      <div className="flex py-2 gap-2 flex-1 md:grow-0">
        <Skeleton className="h-10 w-[180px]" />
        <Skeleton className="h-10 w-28" />
      </div>
    </div>
  )
}

export default SwitchSchoolStore;