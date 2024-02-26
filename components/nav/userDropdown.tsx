import { Button } from "../ui/button";
import { User } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { signOut } from "next-auth/react";
import { redirect } from "next/navigation";
import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "../ui/alert-dialog";
import { getUser } from "@/lib/userUtils";
import LogoutMenuItem from "./logountMenuItem";
import { DarkModeToggle } from "../DarkModeToggle";

export default async function UserDropdown() {
  const user = await getUser();
  if (!user) return null;

  const permissionsSum =
    (user.isAdmin ? 1 : 0) +
    (user.isCustomer ? 1 : 0) +
    (user.isEmployee ? 1 : 0) +
    (user.isSeller ? 1 : 0);

  return (
    <AlertDialog>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="icon">
            <User className="w-5 h-5" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          {permissionsSum >= 2 ? (
            <>
              {user.isCustomer ? (
                <a href="/auth/c/store">
                  <DropdownMenuItem>Obchod</DropdownMenuItem>
                </a>
              ) : null}
              {user.isSeller ? (
                <a href="/auth/s/summary">
                  <DropdownMenuItem>Prehľad</DropdownMenuItem>
                </a>
              ) : null}
              {user.isEmployee ? (
                <a href="/auth/e/dashboard">
                  <DropdownMenuItem>Dashboard</DropdownMenuItem>
                </a>
              ) : null}
            </>
          ) : null}
          <DropdownMenuSeparator />
          <DropdownMenuLabel>Môj účet</DropdownMenuLabel>
          <AlertDialogTrigger asChild>
            <DropdownMenuItem>Profil</DropdownMenuItem>
          </AlertDialogTrigger>
          {/* <DropdownMenuItem>
            <DarkModeToggle />
          </DropdownMenuItem> */}
          <LogoutMenuItem />
        </DropdownMenuContent>
      </DropdownMenu>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Užívateľký účet</AlertDialogTitle>
        </AlertDialogHeader>
        <div>
          <p>Číslo účtu: {user.id}</p>
          <p>Email: {user.email}</p>
        </div>
        <AlertDialogFooter>
          <AlertDialogCancel>Zatvoriť</AlertDialogCancel>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
