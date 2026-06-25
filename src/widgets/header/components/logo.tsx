import { LogoIcon } from "@/shared/ui/icons";
import Link from "next/link";

function Logo() {
  return (
    <Link href="/">
      <LogoIcon />
    </Link>
  );
}

export default Logo;
