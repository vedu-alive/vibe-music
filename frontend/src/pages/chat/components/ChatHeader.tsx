import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { useCallStore } from "@/store/useCallStore";
import { useChatStore } from "@/store/useChatStore";
import { Video } from "lucide-react";

const ChatHeader = () => {
  const { selectedUser, onlineUsers, } = useChatStore();
  const { toggleCallDialog } = useCallStore();

  if (!selectedUser) return null;

  return (
    <div className=" flex items-center justify-between p-4 border-b border-zinc-800">
      <div className="flex items-center gap-3">
        <Avatar>
          <AvatarImage src={selectedUser.imageUrl} />
          <AvatarFallback>{selectedUser.fullName[0]}</AvatarFallback>
        </Avatar>
        <div>
          <h2 className="font-medium">{selectedUser.fullName}</h2>
          <p className="text-sm text-zinc-400">
            {onlineUsers.has(selectedUser.clerkId) ? "Online" : "Offline"}
          </p>
        </div>
      </div>
      <Button
        className="bg-zinc-700 hover:bg-zinc-600 text-white"
        onClick={()=>toggleCallDialog(true)}
      >
        <Video size={24} />
      </Button>
    </div>
  );
};

export default ChatHeader;
