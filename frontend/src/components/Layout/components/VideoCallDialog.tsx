import CallLoader from "@/components/Skeletons/CallLoader";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import peerService from "@/lib/peerService";
import { useCallStore } from "@/store/useCallStore";
import { useChatStore } from "@/store/useChatStore";
import { useAuth, useUser } from "@clerk/clerk-react";
import { PhoneCall } from "lucide-react";
import { useCallback, useEffect } from "react";
import ReactPlayer from "react-player";

const VideoCallDialog = () => {
  const { selectedUser, socket } = useChatStore();
  const {
    initiateVideoCall,
    handleNegotiation,
    myStream,
    isLoading,
    remoteStream,
    setCurrentUserId,
    showCallDialog,
    showCallAactionButtons,
    setRemoteStream,
    setReceiverSocketId,
    handleIncomingCall,
    setSelectedReceiverId,
    callerName,
    toggleCallDialog,
  } = useCallStore();
  const currentUserId = useAuth().userId;
  const currentUserName = useUser().user?.fullName;

  const handleIncomingNegotiation = useCallback(
    async ({
      from,
      offer,
    }: {
      from: string;
      offer: RTCSessionDescriptionInit;
    }) => {
      const answer = await peerService.getAnswer(offer);
      socket.emit("call-negotiation-done", { to: from, answer });
    },
    [socket]
  );

  const handleNegotiaionFinal = useCallback(
    async ({ answer }: { answer: any }) => {
      await peerService.setLocalDescription(new RTCSessionDescription(answer));
    },
    []
  );

  const handleInitiateViedioCall = useCallback((receiverId: string) => {
    console.log("initiate-video-call setting receiverId", receiverId);
    setReceiverSocketId(receiverId);
  }, [setReceiverSocketId]);

  useEffect(() => {
    socket.on("call-negotiation", handleIncomingNegotiation);
    socket.on("call-negotiation-done", handleNegotiaionFinal);
    socket.on("initiate-video-call", handleInitiateViedioCall);
    return () => {
      socket.off("call-negotiation", handleIncomingNegotiation);
      socket.off("call-negotiation-done", handleNegotiaionFinal);
      socket.off("initiate-video-call", handleInitiateViedioCall);
    };
  }, [
    handleIncomingNegotiation,
    socket,
    handleNegotiaionFinal,
    handleInitiateViedioCall,
  ]);

  useEffect(() => {
    peerService.peer?.addEventListener("negotiationneeded", handleNegotiation);
    return () => {
      peerService.peer?.removeEventListener(
        "negotiationneeded",
        handleNegotiation
      );
    };
  }, [handleNegotiation]);

  useEffect(() => {
    peerService.peer?.addEventListener(
      "track",
      async (event: RTCTrackEvent) => {
        const remoteStreams = event.streams;
        setRemoteStream(remoteStreams[0]);
      }
    );
    return () => {
      peerService.peer?.removeEventListener("track", () => {});
    };
  }, [setRemoteStream]);

  useEffect(() => {
    if (showCallDialog) {
      if (currentUserId && selectedUser && currentUserName) {
        setCurrentUserId(currentUserId);
        setSelectedReceiverId(selectedUser.clerkId);
        initiateVideoCall(currentUserId, selectedUser.clerkId, currentUserName);
      }
    }
  }, [
    showCallDialog,
    currentUserId,
    selectedUser,
    initiateVideoCall,
    currentUserName,
    setCurrentUserId,
    setSelectedReceiverId,
  ]);

  return (
    <Dialog open={showCallDialog} onOpenChange={toggleCallDialog}>
      <DialogContent className="max-h-[70vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Call</DialogTitle>
          {isLoading && <CallLoader />}
          {myStream && (
            <>
              My stream
              <ReactPlayer
                playing
                muted
                height={"300px"}
                width={"500px"}
                url={myStream}
              />
            </>
          )}
          {callerName && <div>Call from {callerName}</div>}
          {remoteStream && (
            <>
              Remote Stream
              <ReactPlayer
                playing
                muted
                height={"300px"}
                width={"500px"}
                url={remoteStream}
              />
            </>
          )}
        </DialogHeader>

        {showCallAactionButtons && (
          <div className="flex gap-4 items-center justify-center">
            <Button
              size={"icon"}
              className="rounded-full bg-red-500"
              variant={"destructive"}
              onClick={() => peerService.closeConnection()}
            >
              <PhoneCall />
            </Button>
            <Button
              onClick={handleIncomingCall}
              className="rounded-full bg-green-400"
              size={"icon"}
            >
              <PhoneCall />
            </Button>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default VideoCallDialog;
