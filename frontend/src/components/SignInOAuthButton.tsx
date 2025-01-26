import { useSignIn } from "@clerk/clerk-react"
import { Button } from "./ui/button";

const SignInOAuthButton = () => {
    const { signIn, isLoaded } = useSignIn();

    const SignInWithGoogle = async () => {
        await signIn?.authenticateWithRedirect({
            strategy: 'oauth_google',
            redirectUrl: '/sso-callback',
            redirectUrlComplete: '/auth-callback',
        })
    }

    if (!isLoaded) return null;
    
  return (
    <Button
      variant={"secondary"}
      onClick={SignInWithGoogle}
      className="w-full text-white h-11 bg-zinc-800 hover:border hover:border-blue-600 box-border"
    >
      Continue with Google
    </Button>
  );
}

export default SignInOAuthButton