
import React, { createContext, useContext, useEffect, useState } from "react";
import { 
  signInWithPopup, 
  signOut, 
  onAuthStateChanged, 
  User,
  GoogleAuthProvider
} from "firebase/auth";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { auth, firestore, googleProvider } from "@/lib/firebase";
import { useToast } from "@/components/ui/use-toast";

// Define types for our auth context
interface AuthContextType {
  currentUser: User | null;
  loading: boolean;
  signInWithGoogle: () => Promise<void>;
  logout: () => Promise<void>;
  userReferralCount: number;
}

// Create context
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Create provider component
export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [userReferralCount, setUserReferralCount] = useState(0);
  const { toast } = useToast();

  // Sign in with Google
  const signInWithGoogle = async () => {
    try {
      const result = await signInWithPopup(auth, googleProvider);
      const user = result.user;
      
      // Check if user document exists, if not create it
      const userRef = doc(firestore, "users", user.uid);
      const userSnap = await getDoc(userRef);
      
      if (!userSnap.exists()) {
        await setDoc(userRef, {
          uid: user.uid,
          name: user.displayName,
          email: user.email,
          referralCount: 0,
          createdAt: new Date(),
        });
      }
      
      toast({
        title: "Login successful!",
        description: `Welcome ${user.displayName}!`,
      });
    } catch (error) {
      console.error("Error signing in with Google", error);
      toast({
        title: "Login failed",
        description: "There was a problem signing you in.",
        variant: "destructive",
      });
    }
  };

  // Logout function
  const logout = async () => {
    try {
      await signOut(auth);
      toast({
        title: "Logged out",
        description: "You have been successfully logged out.",
      });
    } catch (error) {
      console.error("Error signing out", error);
      toast({
        title: "Logout failed",
        description: "There was a problem signing you out.",
        variant: "destructive",
      });
    }
  };

  // Listen for auth state changes
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setCurrentUser(user);
      
      // If user is logged in, fetch their referral count
      if (user) {
        try {
          const userRef = doc(firestore, "users", user.uid);
          const userSnap = await getDoc(userRef);
          
          if (userSnap.exists()) {
            setUserReferralCount(userSnap.data().referralCount || 0);
          }
        } catch (error) {
          console.error("Error fetching user data", error);
        }
      }
      
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  const value = {
    currentUser,
    loading,
    signInWithGoogle,
    logout,
    userReferralCount,
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

// Custom hook to use auth context
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
