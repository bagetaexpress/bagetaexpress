import { JSXElementConstructor } from "react";
import Link from "next/link";

interface IProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  href: string;
  text?: string;
  Icon?: JSXElementConstructor<any>;
  isActive?: boolean;
}

export default function NavButton({ href, text, Icon, isActive = false, ...props }: IProps) {
  return (
    <Link
      prefetch={false}
      href={href}
      className={`px-4 py-2 hover:bg-accent hover:text-accent-foreground inline-flex items-center gap-2 ${
        isActive ? "underline" : ""
      }`}
    >
      {text}
      {Icon && <Icon className="h-5 w-5" />}
    </Link>
  );
}
