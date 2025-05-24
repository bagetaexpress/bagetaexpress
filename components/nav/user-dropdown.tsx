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
import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "../ui/alert-dialog";
import { getUser } from "@/lib/user-utils";
import LogoutMenuItem from "./logount-menu-item";
import CopyToClipboard from "../copy-to-clipboard";
import Link from "next/link";

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
                <Link prefetch={false} href="/auth/c/store">
                  <DropdownMenuItem>Žiak</DropdownMenuItem>
                </Link>
              ) : null}
              {user.isSeller ? (
                <Link prefetch={false} href="/auth/s/summary">
                  <DropdownMenuItem>Predajca</DropdownMenuItem>
                </Link>
              ) : null}
              {user.isEmployee ? (
                <Link prefetch={false} href="/auth/e/dashboard">
                  <DropdownMenuItem>Zamestnanec</DropdownMenuItem>
                </Link>
              ) : null}
              {user.isAdmin ? (
                <a href="/auth/a/dashboard">
                  <DropdownMenuItem>Admin</DropdownMenuItem>
                </a>
              ) : null}
            </>
          ) : null}
          <Link prefetch={false} href="/about-us">
            <DropdownMenuItem>O nás</DropdownMenuItem>
          </Link>
          <Link prefetch={false} href="/support"> 
            <DropdownMenuItem>Podpora</DropdownMenuItem>
          </Link>
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
          <CopyToClipboard
            value={user.id}
            name="ID účtu"
            className=" text-left"
          >
            ID: {user.id}
            <Copy className="h-4 w-4 m-1 mt-0 inline-block" />
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
