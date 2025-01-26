import UsersListSkeleton from "@/components/Skeletons/UserListSkeleton";

import { ScrollArea } from "@/components/ui/scroll-area";
import { useChatStore } from "@/store/useChatStore";
import { User } from "@/types";
import { useUser } from "@clerk/clerk-react";
import { HeadphonesIcon, Users } from "lucide-react";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import MapUserWithActivity from "./MapUserWithActivity";

const LoginPrompt = () => (
  <div className="h-full flex flex-col items-center justify-center p-6 text-center space-y-4">
    <div className="relative">
      <div
        className="absolute -inset-1 bg-gradient-to-r from-blue-500 to-sky-500 rounded-full blur-lg
       opacity-75 animate-pulse"
        aria-hidden="true"
      />
      <div className="relative bg-zinc-900 rounded-full p-4">
        <HeadphonesIcon className="size-8 text-blue-500" />
      </div>
    </div>

    <div className="space-y-2 max-w-[250px]">
      <h3 className="text-lg font-semibold text-white">
        See What Friends Are Playing
      </h3>
      <p className="text-sm text-zinc-400">
        Login to discover what music your friends are enjoying right now
      </p>
    </div>
  </div>
);

const FriendsActivity = () => {
  const {
    fetchUsers,
    isLoading,
    users,
    setSelectedUser,
  } = useChatStore();
  const { user } = useUser();

  const pathName = window.location.pathname;
  const navigate = useNavigate();

  const selectUser = (user:User) => {
    setSelectedUser(user);
    if(pathName !== '/chat') {
      navigate('/chat');
    }
  }

  useEffect(() => {
    if (user) fetchUsers();
  }, [fetchUsers, user]);

  if (isLoading) {
    return <UsersListSkeleton />;
  }

  return (
    <div className="h-full bg-zinc-900 rounded-lg flex flex-col">
      <div className="p-4 flex justify-between items-center border-b border-zinc-800">
        <div className="flex items-center gap-2">
          {" "}
          <Users className="size-5 shrink-0" />
          <h2 className="font-semibold">What they're listening to</h2>
        </div>
      </div>
      {!user && <LoginPrompt />}
      <ScrollArea className="flex-1">
        <div className="p-4 space-y-4">
          {users.map((user) => {
            return <MapUserWithActivity selectUser={selectUser} user={user} />;
          })}
        </div>
      </ScrollArea>
    </div>
  );
};

export default FriendsActivity;
