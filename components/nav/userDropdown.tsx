import { Button } from "../ui/button";
import { Copy, User } from "lucide-react";
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
import CopyToClipboard from "../copyToClipboard";

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
          <LogoutMenuItem />
        </DropdownMenuContent>
      </DropdownMenu>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Používateľký účet</AlertDialogTitle>
        </AlertDialogHeader>
        <div>
          <CopyToClipboard value={user.id} name="Číslo účtu">
            ID: {user.id}
            <Copy className="h-4 w-4 inline-block ml-1" />
          </CopyToClipboard>
          <p>Email: {user.email}</p>
          {user.name && <p>Meno: {user.name}</p>}
        </div>
        <AlertDialogFooter>
          <AlertDialogCancel>Zatvoriť</AlertDialogCancel>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
