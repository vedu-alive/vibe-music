import { axiosInstance } from "@/lib/axios";
import { useAuthStore } from "@/store/useAuthStore";
import { useChatStore } from "@/store/useChatStore";
import { useAuth } from "@clerk/clerk-react";
import { Loader } from "lucide-react";
import { useEffect, useState } from "react";

const updateApiToken = (token: string | null) => {
  if (token)
    axiosInstance.defaults.headers["Authorization"] = `Bearer ${token}`;
  else delete axiosInstance.defaults.headers["Authorization"];
};
const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const { getToken, userId } = useAuth();
  const { checkAdmin } = useAuthStore();
  const [loading, setLoading] = useState(true);
  const { initializeSocket, disconnectSocket } = useChatStore();
  useEffect(() => {
    const initAuth = async () => {
      try {
        const token = await getToken();
        updateApiToken(token);
        if (token) {
          await checkAdmin();
          //* init socket
          if (userId) initializeSocket(userId);
        }
      } catch (error) {
        updateApiToken(null);
        console.error("Error in auth provider", error);
      } finally {
        setLoading(false);
      }
    };
    initAuth();
    return ()=> disconnectSocket();
  }, [getToken, checkAdmin, disconnectSocket, initializeSocket, userId]);
  if (loading)
    return (
      <div className="h-screen w-full flex items-center justify-center">
        <Loader className="size-8 animate-spin text-blue-500" />
      </div>
    );

  return <div>{children}</div>;
};

export default AuthProvider;
