import { Card, CardContent } from "@/components/ui/card"
import { axiosInstance } from "@/lib/axios"
import { useUser } from "@clerk/clerk-react"
import { Loader } from "lucide-react"
import { useEffect, useRef } from "react"
import { useNavigate } from "react-router-dom"

const AuthCallback = () => {
  const { isLoaded, user } = useUser();
  const navigate = useNavigate();
  const syncAttempedt = useRef(false);
  useEffect(() => {
    const syncUser = async () => {
      if (!isLoaded || !user || syncAttempedt.current) return;
      try {
        syncAttempedt.current = true;
        const { id, firstName, lastName, imageUrl } = user;
        await axiosInstance.post('/auth/callback', {
          id: id,
          firstName: firstName,
          lastName: lastName,
          imageUrl: imageUrl
        });
      } catch (error) {
        console.error(error);
      }
      finally {
        navigate('/');
      }
    }
    syncUser();
  },[isLoaded, user, navigate])

  return (
    <div className="h-screen w-full flex items-center justify-center bg-black">
      <Card className="w-[90%] max-w-md bg-cyan-950/25 border-cyan-700">
        <CardContent className="flex flex-col items-center gap-4 pt-6 ">
          <Loader className="size-6 text-cyan-500 animate-spin" />
          <h3 className="text-cyan-400 text-xl font-bold">Logging you in </h3>
          <p className="text-cyan-400 text-sm">redirecting . . .</p>
        </CardContent>
      </Card>
    </div>
  )
}

export default AuthCallback