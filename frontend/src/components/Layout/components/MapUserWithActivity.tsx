import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useChatStore } from "@/store/useChatStore";
import { User } from "@/types";
import { Music } from "lucide-react";
import { useEffect, useState } from "react";

type Props = {
    selectUser: (user: User) => void;
    user: User;
};

const MapUserWithActivity = ({selectUser,user}: Props) => {
    const { onlineUsers, userActivities } = useChatStore();
    const [isPlaying, setIsPlaying] = useState(false);
    const [activity, setActivity] = useState("");
    useEffect(() => {
        const activity = userActivities.get(user.clerkId);
        if (activity) {
            if(activity !== "Idle") setIsPlaying(true);
            else setIsPlaying(false);
        }
        setActivity(activity || "Idle");
    }, [userActivities, user.clerkId]);

    useEffect(() => {
        console.log(userActivities, "userActivities");
    },[userActivities]);
  
  return (
    <div
      onClick={() => selectUser(user)}
      key={user._id}
      className="cursor-pointer hover:bg-zinc-800/50 p-3 rounded-md transition-colors group"
    >
      <div className="flex items-start gap-3">
        <div className="relative">
          <Avatar className="size-10 border border-zinc-800">
            <AvatarImage src={user.imageUrl} alt={user.fullName} />
            <AvatarFallback>{user.fullName[0]}</AvatarFallback>
          </Avatar>
          <div
            className={`absolute bottom-0 right-0 h-3 w-3 rounded-full border-2 border-zinc-900 ${
              onlineUsers.has(user.clerkId) ? "bg-green-500" : "bg-zinc-500"
            }`}
            aria-hidden={true}
          />
        </div>
        <div className="flex-1 min-w-0 ">
          <div className="flex items-center gap-2">
            <span className="font-medium text-sm text-white">
              {user.fullName}
            </span>
            {isPlaying && <Music className="size-3.5 text-blue-500 shrink-0" />}
          </div>
          {isPlaying ? (
            <div className="mt-1">
              <div className="mt-1 text-sx text-white font-medium truncate">
                {activity.replace("Playing", "").split("by")[0]}
              </div>
              <div className="text-xs text-zinc-400 truncate">
                {activity.split("by")[1]}
              </div>
            </div>
          ) : (
            <div className="mt-1 text-xs text-zinc-400">Idle</div>
          )}
        </div>
      </div>
    </div>
  );
};

export default MapUserWithActivity;
