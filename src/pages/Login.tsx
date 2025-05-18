
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Layout from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuth } from "@/contexts/AuthContext";

const Login = () => {
  const { currentUser, signInWithGoogle } = useAuth();
  const navigate = useNavigate();
  
  // Redirect to dashboard if already logged in
  useEffect(() => {
    if (currentUser) {
      navigate("/dashboard");
    }
  }, [currentUser, navigate]);
  
  const handleGoogleLogin = async () => {
    try {
      await signInWithGoogle();
      // Redirect handled by the useEffect above
    } catch (error) {
      console.error("Failed to login", error);
    }
  };
  
  return (
    <Layout>
      <div className="min-h-[80vh] flex items-center justify-center bg-robogray/50">
        <Card className="w-full max-w-md mx-4">
          <CardHeader className="space-y-1 text-center">
            <CardTitle className="text-2xl font-bold">
              Welcome to ROBOSOCCER
            </CardTitle>
            <CardDescription>
              Sign in to track your referrals and earn rewards
            </CardDescription>
          </CardHeader>
          <CardContent className="grid gap-4">
            <div className="grid grid-cols-1 gap-6">
              <Button
                variant="outline"
                onClick={handleGoogleLogin}
                className="flex items-center justify-center gap-2"
              >
                <svg 
                  xmlns="http://www.w3.org/2000/svg" 
                  viewBox="0 0 24 24" 
                  width="24" 
                  height="24" 
                  className="w-5 h-5"
                >
                  <path 
                    fill="#4285F4" 
                    d="M21.35 11.1h-9.17v2.73h6.51c-.33 3.81-3.5 5.44-6.5 5.44C8.36 19.27 5 16.25 5 12c0-4.1 3.2-7.27 7.2-7.27 3.09 0 4.9 1.97 4.9 1.97L19 4.72S16.56 2 12.1 2C6.42 2 2.03 6.8 2.03 12c0 5.05 4.13 10 10.22 10 5.35 0 9.25-3.67 9.25-9.09 0-1.15-.15-1.81-.15-1.81z"
                  />
                </svg>
                Continue with Google
              </Button>
            </div>
            
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t"></span>
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-white px-2 text-muted-foreground">
                  Secure Authentication
                </span>
              </div>
            </div>
            
          </CardContent>
          <CardFooter className="flex flex-col">
            <p className="mt-2 text-xs text-center text-gray-500">
              By signing in, you agree to our 
              <a href="#" className="text-roboblue hover:underline"> Terms of Service </a> 
              and 
              <a href="#" className="text-roboblue hover:underline"> Privacy Policy</a>
            </p>
          </CardFooter>
        </Card>
      </div>
    </Layout>
  );
};

export default Login;
