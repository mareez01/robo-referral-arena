
import React from "react";
import { Link, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import { LogIn, User, Trophy, Image, Home, Send } from "lucide-react";

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const { currentUser, logout, userReferralCount } = useAuth();
  const location = useLocation();
  
  const isActive = (path: string) => location.pathname === path;
  
  return (
    <div className="flex flex-col min-h-screen">
      <header className="bg-roboblue text-white shadow-md">
        <div className="container mx-auto px-4 py-2">
          <div className="flex flex-col md:flex-row md:items-center justify-between">
            <div className="flex items-center">
              <Link to="/" className="text-xl md:text-2xl font-bold">
                ROBO<span className="text-roboorange">SOCCER</span> <span className="text-sm md:text-lg">3.0</span>
              </Link>
            </div>
            
            <nav className="flex flex-row items-center space-x-1 md:space-x-4 mt-2 md:mt-0">
              <Link to="/">
                <Button 
                  variant={isActive('/') ? "secondary" : "ghost"} 
                  size="sm"
                  className="text-white"
                >
                  <Home className="mr-2 h-4 w-4" />
                  <span className="hidden md:inline">Home</span>
                </Button>
              </Link>
              
              <Link to="/scoreboard">
                <Button 
                  variant={isActive('/scoreboard') ? "secondary" : "ghost"} 
                  size="sm"
                  className="text-white"
                >
                  <Trophy className="mr-2 h-4 w-4" />
                  <span className="hidden md:inline">Scoreboard</span>
                </Button>
              </Link>
              
              <Link to="/media">
                <Button 
                  variant={isActive('/media') ? "secondary" : "ghost"} 
                  size="sm"
                  className="text-white"
                >
                  <Image className="mr-2 h-4 w-4" />
                  <span className="hidden md:inline">Media</span>
                </Button>
              </Link>
              
              {currentUser ? (
                <>
                  <Link to="/referral">
                    <Button 
                      variant={isActive('/referral') ? "secondary" : "ghost"} 
                      size="sm"
                      className="text-white"
                    >
                      <Send className="mr-2 h-4 w-4" />
                      <span className="hidden md:inline">Refer</span>
                    </Button>
                  </Link>
                  
                  <Link to="/dashboard">
                    <Button 
                      variant={isActive('/dashboard') ? "secondary" : "ghost"} 
                      size="sm"
                      className="text-white"
                    >
                      <User className="mr-2 h-4 w-4" />
                      <span className="hidden md:inline">Dashboard</span>
                      {userReferralCount > 0 && (
                        <span className="ml-1 bg-roboorange text-white text-xs rounded-full px-1.5 py-0.5">
                          {userReferralCount}
                        </span>
                      )}
                    </Button>
                  </Link>
                  
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => logout()}
                    className="text-white border-white hover:bg-white/20"
                  >
                    Logout
                  </Button>
                </>
              ) : (
                <Link to="/login">
                  <Button 
                    variant={isActive('/login') ? "secondary" : "outline"} 
                    size="sm"
                    className="text-white border-white hover:bg-white/20"
                  >
                    <LogIn className="mr-2 h-4 w-4" />
                    Login
                  </Button>
                </Link>
              )}
            </nav>
          </div>
        </div>
      </header>
      
      <main className="flex-grow">
        {children}
      </main>
      
      <footer className="bg-robodark text-white py-6">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="mb-4 md:mb-0">
              <p className="text-sm">
                ROBOSOCCER 3.0 © {new Date().getFullYear()}. All rights reserved.
              </p>
            </div>
            <div className="flex space-x-4">
              <a href="#" className="text-white hover:text-roboorange">
                Terms
              </a>
              <a href="#" className="text-white hover:text-roboorange">
                Privacy
              </a>
              <a href="#" className="text-white hover:text-roboorange">
                Contact
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Layout;
