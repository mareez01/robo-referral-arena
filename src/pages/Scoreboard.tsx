
import { useState, useEffect } from "react";
import { collection, query, orderBy, limit, getDocs } from "firebase/firestore";
import { firestore } from "@/lib/firebase";
import Layout from "@/components/Layout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Trophy } from "lucide-react";

interface LeaderboardUser {
  uid: string;
  name: string;
  referralCount: number;
  position?: number;
}

const Scoreboard = () => {
  const [leaders, setLeaders] = useState<LeaderboardUser[]>([]);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    const fetchLeaderboard = async () => {
      try {
        const usersRef = collection(firestore, "users");
        const q = query(
          usersRef, 
          orderBy("referralCount", "desc"),
          limit(20)
        );
        
        const querySnapshot = await getDocs(q);
        const leaderboardUsers: LeaderboardUser[] = [];
        
        querySnapshot.forEach((doc, index) => {
          const userData = doc.data() as LeaderboardUser;
          leaderboardUsers.push({
            ...userData,
            position: index + 1
          });
        });
        
        setLeaders(leaderboardUsers);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching leaderboard:", error);
        setLoading(false);
      }
    };
    
    fetchLeaderboard();
  }, []);
  
  const getPositionColor = (position: number) => {
    switch (position) {
      case 1: return "text-yellow-500";
      case 2: return "text-gray-400";
      case 3: return "text-amber-600";
      default: return "text-gray-700";
    }
  };
  
  const getPositionBadge = (position: number) => {
    switch (position) {
      case 1:
        return <Trophy className="h-6 w-6 text-yellow-500" />;
      case 2:
        return <Trophy className="h-5 w-5 text-gray-400" />;
      case 3:
        return <Trophy className="h-4 w-4 text-amber-600" />;
      default:
        return <span className={`font-bold ${getPositionColor(position)}`}>{position}</span>;
    }
  };
  
  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        <Card className="max-w-3xl mx-auto">
          <CardHeader className="text-center">
            <CardTitle className="text-3xl md:text-4xl">Referral Leaderboard</CardTitle>
            <CardDescription>
              Top referrers for ROBOSOCCER 3.0
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {loading ? (
                [...Array(10)].map((_, i) => (
                  <div key={i} className="flex items-center justify-between p-4 bg-muted rounded-md">
                    <div className="flex items-center gap-4">
                      <Skeleton className="h-8 w-8 rounded-full" />
                      <Skeleton className="h-4 w-[200px]" />
                    </div>
                    <Skeleton className="h-6 w-16" />
                  </div>
                ))
              ) : leaders.length === 0 ? (
                <div className="text-center py-10">
                  <p className="text-muted-foreground">No referral data available yet.</p>
                </div>
              ) : (
                <div className="rounded-md border overflow-hidden">
                  <table className="w-full">
                    <thead>
                      <tr className="bg-muted/50">
                        <th className="text-left p-3 w-16">Rank</th>
                        <th className="text-left p-3">Participant</th>
                        <th className="text-right p-3">Referrals</th>
                      </tr>
                    </thead>
                    <tbody>
                      {leaders.map((leader) => (
                        <tr 
                          key={leader.uid}
                          className={`border-t hover:bg-muted/30 transition-colors ${
                            leader.position && leader.position <= 3 ? "bg-muted/20" : ""
                          }`}
                        >
                          <td className="p-3 text-center">
                            {leader.position && getPositionBadge(leader.position)}
                          </td>
                          <td className="p-3 font-medium">
                            {leader.name || "Anonymous"}
                          </td>
                          <td className="p-3 text-right">
                            <Badge variant="secondary" className="font-mono">
                              {leader.referralCount}
                            </Badge>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
              
              <div className="pt-4 text-center">
                <p className="text-sm text-muted-foreground">
                  Top 3 referrers will get early access to freeplay slots and exclusive ROBOSOCCER merchandise!
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
};

export default Scoreboard;
