import { Logo } from "@/assets/Logo";
import { Button } from "@/components/ui/button";
import { UserButton } from "@clerk/clerk-react";
import { Home } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";

const AdminHeader = () => {
  const navigate = useNavigate()
  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-3 mb-8">
        <Link to="/" className="rounded-lg">
          <Logo classname="h-14 w-14" />
        </Link>
        <div>
          <h1 className="text-3xl font-bold">Music Manager</h1>
          <p className="text-zinc-400 mt-1">Manage your music catalog</p>
        </div>
      </div>
      <div className="flex items-center gap-4">
        <Button onClick={()=>navigate('/')} className="flex items-center bg-neutral-800 hover:bg-neutral-700 text-white border-neutral-700 w-full sm:w-auto"> <Home/> Home</Button>
        <UserButton />
      </div>
    </div>
  );
}

export default AdminHeader