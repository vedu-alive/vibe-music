import { create } from "zustand";
import { useChatStore } from "./useChatStore";
import PeerService from "@/lib/peerService";
import peerService from "@/lib/peerService";

interface CallStore {
  isLoading: boolean;
  error: null | any;
  myStream: MediaStream | null;
  receiverSocketId: string | null;
  receiverId: string | null;
  currentUserId: string | null;
  callerId: string | null;
  remoteStream: MediaStream | null;
  showCallDialog: boolean;
  showCallAactionButtons: boolean;
  incommingCallFrom: string | null;
  incommingOffer: RTCSessionDescriptionInit | null;
  callerName: string | null;
  counter: number;
  initiateVideoCall: (
    callerId: string,
    userId: string,
    currentUserName: string
  ) => void;
  setCallerId: (id: string) => void;
  setRemoteStream: (stream: MediaStream) => void;
  sendStream: () => void;
  toggleCallDialog: (val: boolean) => void;
  setStream: (stream: MediaStream) => void;
  setReceiverSocketId: (id: string) => void;
  handleAcceptCall: (params: {
    to: string;
    answer: RTCSessionDescriptionInit;
  }) => void;
  handleNegotiation: () => void;
  handleIncomingCall: () => void;
  setCallActionButtons: ({
    from,
    offer,
    callerName,
  }: {
    from: string;
    offer: RTCSessionDescriptionInit;
    callerName: string;
  }) => void;
  setCurrentUserId: (id: string) => void;
  setSelectedReceiverId: (id: string) => void;
}

const socket = useChatStore.getState().socket;

export const useCallStore = create<CallStore>((set, get) => ({
  error: null,
  isLoading: false,
  counter: 0,
  myStream: null,
  receiverSocketId: null,
  callerId: null,
  currentUserId: null,
  receiverId: null,
  showCallDialog: false,
  incommingCallFrom: null,
  callerName: null,
  incommingOffer: null,
  remoteStream: null,
  showCallAactionButtons: false,
  toggleCallDialog: (val) => {
    set({ showCallDialog: val });
  },
  setStream: (stream: MediaStream) => set({ myStream: stream }),
  setCallerId: (id: string) => set({ callerId: id }),
  setReceiverSocketId: (id: string) => set({ receiverSocketId: id }),
  setSelectedReceiverId: (id: string) => set({ receiverId: id }),
  setCurrentUserId: (id)=> set({currentUserId: id}),
  initiateVideoCall: async (callerId, userId, currentUserName) => {
    console.log("Initiating Call");
    set({ isLoading: true });
    try {
      //* get stream
      const stream = await navigator.mediaDevices.getUserMedia({
        video: true,
        audio: true,
      });
      const offer = await PeerService.getOffer();
      //* initiate call
      socket.emit("initiate-video-call", {
        callerId,
        userId,
        offer,
        callerName: currentUserName,
      });
     
      set({ myStream: stream });
    } catch (error) {
      set({ error });
    } finally {
      set({ isLoading: false });
    }
  },
  setRemoteStream: (stream: MediaStream) => set({ remoteStream: stream }),
  sendStream: async () => {
    console.log("Sending Stream");
    const myStream = get().myStream;
    if (!myStream) return;
    myStream.getTracks().forEach((track: MediaStreamTrack) => {
      PeerService.peer?.addTrack(track, myStream);
    });
  },
  handleAcceptCall: async ({ answer }) => {
    console.log("handleAcceptCall");
    await peerService.setLocalDescription(new RTCSessionDescription(answer));
    get().sendStream();
  },
  handleNegotiation: async () => {
    console.log("handleNegotiation");
    const offer = await peerService.getOffer();
    socket.emit("call-negotiation", { to: get().receiverSocketId, offer });
    const currentUserId = get().currentUserId;
    const receiverId = get().receiverId;
    const callerName = get().callerName;
    if (!currentUserId || !receiverId || !callerName) return;
    get().initiateVideoCall(currentUserId, receiverId, callerName);
  },
  handleIncomingCall: async () => {
    const from = get().incommingCallFrom;
    const offer = get().incommingOffer;
    console.log("handleIncomingCall", from, offer);
    if (!offer) return;
    get().sendStream();
    const answer = await peerService.getAnswer(offer);
    socket.emit("call-accepted", { to: from, answer });
    console.log("Call Accepted");
    // set({showCallAactionButtons: false});
    set({ callerName: null });
  },
  setCallActionButtons: async ({ from, offer, callerName }) => {
    const stream = await navigator.mediaDevices.getUserMedia({
      video: true,
      audio: true,
    });
    get().setStream(stream);
    set({
      incommingCallFrom: from,
      incommingOffer: offer,
      showCallAactionButtons: true,
      callerName:callerName,
    });
    if (get().counter === 0) {
        get().handleIncomingCall();
      set({ counter: 1 });
    }
    get().toggleCallDialog(true);
  },
}));
