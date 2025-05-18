import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import Layout from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";

const Index = () => {
  const { currentUser } = useAuth();
  const [isVisible, setIsVisible] = useState(false);
  
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(true);
    }, 100);
    
    return () => clearTimeout(timer);
  }, []);

  return (
    <Layout>
      <div className="bg-gradient-to-b from-robogray to-white">
        {/* Hero Section */}
        <section className="container mx-auto px-4 py-12 md:py-24">
          <div className="flex flex-col md:flex-row items-center">
            <div className="md:w-1/2 mb-8 md:mb-0">
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5 }}
              >
                <h1 className="text-4xl md:text-5xl font-bold mb-4">
                  <span className="text-roboblue">ROBO</span>
                  <span className="text-roboorange">SOCCER</span>
                  <span className="text-roboteal"> 3.0</span>
                </h1>
                <p className="text-xl md:text-2xl mb-6 text-robodark/90 font-light">
                  Refer friends and win exclusive benefits at the ultimate robotic soccer championship!
                </p>
                <div className="flex flex-wrap gap-4">
                  {currentUser ? (
                    <Link to="/referral">
                      <Button className="robo-button animate-pulse-glow">Start Referring</Button>
                    </Link>
                  ) : (
                    <Link to="/login">
                      <Button className="robo-button animate-pulse-glow">Join Now</Button>
                    </Link>
                  )}
                  <Link to="/scoreboard">
                    <Button variant="outline" className="border-roboblue text-roboblue hover:bg-roboblue/10">
                      View Scoreboard
                    </Button>
                  </Link>
                </div>
              </motion.div>
            </div>
            <div className="md:w-1/2">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="relative"
              >
                <div className="bg-gradient-to-br from-roboblue/20 to-roboteal/20 rounded-xl p-8 shadow-xl border border-white/40">
                  <div className="aspect-video relative overflow-hidden rounded-lg bg-black">
                    <iframe
                      className="absolute top-0 left-0 w-full h-full"
                      src="https://www.youtube.com/embed/RC_w9i_S7nw?autoplay=0&mute=1"
                      title="ROBOSOCCER Promo"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                    ></iframe>
                  </div>
                </div>
                <div className="absolute -bottom-4 -right-4 bg-roboorange text-white text-sm md:text-base font-bold px-4 py-2 rounded-lg shadow-lg transform rotate-3">
                  March 15-17, 2025
                </div>
              </motion.div>
            </div>
          </div>
        </section>

        {/* Info Cards Section */}
        <section className="container mx-auto px-4 py-12">
          <h2 className="text-3xl font-bold text-center mb-10">How It Works</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {isVisible && (
              <>
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: 0.3 }}
                  className="robo-card"
                >
                  <div className="p-6">
                    <div className="w-12 h-12 flex items-center justify-center bg-roboblue/10 text-roboblue rounded-lg mb-4">
                      <span className="text-xl font-bold">1</span>
                    </div>
                    <h3 className="text-xl font-semibold mb-2">Register & Login</h3>
                    <p className="text-gray-600">
                      Create an account or login with Google to start referring friends for ROBOSOCCER 3.0.
                    </p>
                  </div>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: 0.5 }}
                  className="robo-card"
                >
                  <div className="p-6">
                    <div className="w-12 h-12 flex items-center justify-center bg-roboorange/10 text-roboorange rounded-lg mb-4">
                      <span className="text-xl font-bold">2</span>
                    </div>
                    <h3 className="text-xl font-semibold mb-2">Refer Friends</h3>
                    <p className="text-gray-600">
                      Submit details of friends who register for the event. Upload proof of their registration.
                    </p>
                  </div>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: 0.7 }}
                  className="robo-card"
                >
                  <div className="p-6">
                    <div className="w-12 h-12 flex items-center justify-center bg-roboteal/10 text-roboteal rounded-lg mb-4">
                      <span className="text-xl font-bold">3</span>
                    </div>
                    <h3 className="text-xl font-semibold mb-2">Win Rewards</h3>
                    <p className="text-gray-600">
                      Top referrers get early access to free play slots and exclusive merchandise!
                    </p>
                  </div>
                </motion.div>
              </>
            )}
          </div>
        </section>

        {/* Call-to-Action Section */}
        <section className="bg-gradient-to-r from-roboblue to-roboteal py-16">
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-3xl font-bold text-white mb-6">Join ROBOSOCCER 3.0 Today!</h2>
            <p className="text-white/90 text-lg mb-8 max-w-2xl mx-auto">
              Even participants without robots can play using organizer's bots. 
              Top referrers will get early access to freeplay slots!
            </p>
            <div className="flex justify-center">
              {currentUser ? (
                <Link to="/referral">
                  <Button className="robo-button-secondary">Start Referring Now</Button>
                </Link>
              ) : (
                <Link to="/login">
                  <Button className="robo-button-secondary">Sign Up Now</Button>
                </Link>
              )}
            </div>
          </div>
        </section>
      </div>
    </Layout>
  );
};

export default Index;
