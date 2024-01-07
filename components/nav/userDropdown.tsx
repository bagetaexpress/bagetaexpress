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

export default async function UserDropdown() {
  const user = await getUser();
  if (!user) return null;

  return (
    <AlertDialog>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="icon">
            <User className="w-5 h-5" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          {user.isAdmin && (
            <>
              <DropdownMenuLabel>Admin</DropdownMenuLabel>
              <a href="/auth/c/store">
                <DropdownMenuItem>Zákazník</DropdownMenuItem>
              </a>
              <a href="/auth/s/summary">
                <DropdownMenuItem>Predajca</DropdownMenuItem>
              </a>
              <a href="/auth/e/dashboard">
                <DropdownMenuItem>Zamestnanec</DropdownMenuItem>
              </a>
              <DropdownMenuSeparator />
            </>
          )}
          <DropdownMenuLabel>Môj účet</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <AlertDialogTrigger asChild>
            <DropdownMenuItem>Profil</DropdownMenuItem>
          </AlertDialogTrigger>
          <DropdownMenuSeparator />
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
