import Topbar from "@/components/Topbar";
import { useChatStore } from "@/store/useChatStore"
import { useUser } from "@clerk/clerk-react";
import { useEffect } from "react";
import UsersList from "./components/UsersList";
import EmptyState from "./components/EmptyState";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarImage } from "@/components/ui/avatar";
import MessageInput from "./components/MessageInput";
import { formatChatTime } from "@/utils";
import ChatHeader from "./components/ChatHeader";
import MessageSkeleton from "@/components/Skeletons/MessageSkeleton";




const Chat = () => {
  const { messages, selectedUser, messageLoading, fetchUsers, fetchMessages } = useChatStore();
  const { user } = useUser();

  useEffect(() => {
    if (user) {
      fetchUsers();
    }
  }, [user, fetchUsers]);

  useEffect(() => {
    if(selectedUser) {
      fetchMessages(selectedUser.clerkId);
    }
  },[selectedUser, fetchMessages]);

  return (
    <main className="h-full rounded-lg bg-gradient-to-b from-zinc-800 to-zinc-900 overflow-hidden">
      <Topbar />
      <div className="grid lg:grid-cols-[300px_1fr] grid-cols-[80px_1fr] h-[calc(100vh-180px)]">
        <UsersList />
        <div className="flex flex-col h-full">
          {selectedUser ? (
            <>
              <ChatHeader />
              <ScrollArea className="h-[calc(100vh-340px)]">
                <div className="p-4 space-y-4">
                  {messageLoading ? (
                    <MessageSkeleton />
                  ) : (
                    messages.map((message) => (
                      <div
                        key={message._id}
                        className={`flex items-start gap-3 ${
                          message.senderId === user?.id
                            ? "flex-row-reverse"
                            : ""
                        }`}
                      >
                        <Avatar className="size-8">
                          <AvatarImage
                            src={
                              message.senderId === user?.id
                                ? user.imageUrl
                                : selectedUser.imageUrl
                            }
                          />
                        </Avatar>

                        <div
                          className={`rounded-lg p-3 max-w-[70%]
													${message.senderId === user?.id ? "bg-blue-500" : "bg-zinc-800"}
												`}
                        >
                          <p className="text-sm">{message.content}</p>
                          <span className="text-xs text-zinc-300 mt-1 block">
                            {formatChatTime(message.createdAt)}
                          </span>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </ScrollArea>
              <MessageInput />
            </>
          ) : (
            <EmptyState />
          )}
        </div>
      </div>
    </main>
  );
}

export default Chat
