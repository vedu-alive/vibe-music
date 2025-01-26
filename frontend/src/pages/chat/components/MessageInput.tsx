import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useChatStore } from '@/store/useChatStore';
import { useUser } from '@clerk/clerk-react';
import { Send } from 'lucide-react';
import React from 'react'

const MessageInput = () => {

    const [newMessage, setNewMessage] = React.useState('');
    const { user } = useUser();
    const { selectedUser, sendMessage } = useChatStore();
    
    const handleSend = () => {
        if(selectedUser && newMessage && user) {
            sendMessage(selectedUser.clerkId, user.id, newMessage.trim());
            setNewMessage('');
        }
    }

    return (
      <div className="p-4 mt-auto border-t border-zinc-800">
        <div className="flex gap-2 flex-nowrap">
          <Input
            placeholder="Type a message"
            value={newMessage}
            className="bg-zinc-800 border-none"
            onChange={(e) => setNewMessage(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSend()}
          />
          <Button
            size={"icon"}
            onClick={handleSend}
            disabled={!newMessage.trim()}
          >
            <Send className="size-4" />
          </Button>
        </div>
      </div>
    );
}

export default MessageInput