import { SignedOut, UserButton } from "@clerk/clerk-react";
import { LayoutDashboardIcon } from "lucide-react";
import { Link } from "react-router-dom";
import SignInOAuthButton from "./SignInOAuthButton";
import { useAuthStore } from "@/store/useAuthStore";
import { buttonVariants } from "./ui/button";
import { cn } from "@/lib/utils";
import { Logo } from "@/assets/Logo";

const Topbar = () => {
  const { isAdmin } = useAuthStore();
  return (
    <div className="flex items-center justify-between p-4 sticky top-0 z-10 bg-zinc-900/75 backdrop-blur-md">
      <div className="flex items-center gap-2"><Logo classname="h-10 w-10 p-[1px]" /> Vibe music</div>
      <div className="flex items-center gap-4">
        {isAdmin && (
          <Link to={"/admin"} className={cn(buttonVariants({variant: 'outline'}))}>
            {" "}
            <LayoutDashboardIcon className="size-4 mr-2" /> Admin Dashboard
          </Link>
        )}
        <SignedOut>
          <SignInOAuthButton />
        </SignedOut>
        <UserButton/>
      </div>
    </div>
  );
};

export default Topbar;
