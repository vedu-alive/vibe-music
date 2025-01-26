import { Outlet } from "react-router-dom";
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "../ui/resizable";
import LeftSidebar from "./components/LeftSidebar";
import FriendsActivity from "./components/FriendsActivity";
import AudioPlayer from "./components/AudioPlayer";
import PlaybackControles from "./components/PlaybackControles";
import { useEffect, useState } from "react";
import { useChatStore } from "@/store/useChatStore";
import { useUser } from "@clerk/clerk-react";
import { useCallStore } from "@/store/useCallStore";
import VideoCallDialog from "@/components/Layout/components/VideoCallDialog";

const MainLayout = () => {
  const [isMobile, setIsMobile] = useState(false);
  const { socket } = useChatStore();
  const { setCallActionButtons, handleAcceptCall } =
    useCallStore();
  const { user } = useUser();


  useEffect(() => {
    if (!user) return;
    socket.on("incomming-call", setCallActionButtons);
    socket.on("call-accepted", handleAcceptCall);
    return () => {
      socket.off("incomming-call", setCallActionButtons);
      socket.off("call-accepted", handleAcceptCall);
    };
  }, [user, socket, setCallActionButtons, handleAcceptCall]);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  return (
    <div className=" h-screen text-white bg-black flex flex-col">
      <VideoCallDialog />
      <AudioPlayer />
      <ResizablePanelGroup
        direction="horizontal"
        className="flex flex-1 h-full overflow-hidden p-2"
      >
        <ResizablePanel
          defaultSize={20}
          minSize={isMobile ? 0 : 10}
          maxSize={30}
        >
          <LeftSidebar />
        </ResizablePanel>
        <ResizableHandle className="w-2 bg-black rounded-lg transition-colors" />
        <ResizablePanel defaultSize={isMobile ? 80 : 60}>
          <Outlet />
        </ResizablePanel>
        {!isMobile && (
          <>
            <ResizableHandle className="w-2 bg-black rounded-lg transition-colors" />
            <ResizablePanel
              defaultSize={20}
              minSize={0}
              maxSize={25}
              collapsedSize={0}
            >
              <FriendsActivity />
            </ResizablePanel>
          </>
        )}
      </ResizablePanelGroup>
      <PlaybackControles />
    </div>
  );
};

export default MainLayout;
