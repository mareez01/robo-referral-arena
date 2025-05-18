
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { collection, query, where, getDocs } from "firebase/firestore";
import { firestore } from "@/lib/firebase";
import { useAuth } from "@/contexts/AuthContext";
import Layout from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { formatDistanceToNow } from "date-fns";

interface Referral {
  id: string;
  referredName: string;
  referredEmail: string;
  timestamp: { seconds: number };
  status: 'pending' | 'approved' | 'rejected';
}

const Dashboard = () => {
  const { currentUser, userReferralCount } = useAuth();
  const [referrals, setReferrals] = useState<Referral[]>([]);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    const fetchReferrals = async () => {
      if (!currentUser) return;
      
      try {
        const referralsRef = collection(firestore, "referrals");
        const q = query(referralsRef, where("referredByUID", "==", currentUser.uid));
        const querySnapshot = await getDocs(q);
        
        const fetchedReferrals: Referral[] = [];
        querySnapshot.forEach((doc) => {
          fetchedReferrals.push({ id: doc.id, ...doc.data() as Omit<Referral, 'id'> });
        });
        
        fetchedReferrals.sort((a, b) => b.timestamp.seconds - a.timestamp.seconds);
        setReferrals(fetchedReferrals);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching referrals:", error);
        setLoading(false);
      }
    };
    
    fetchReferrals();
  }, [currentUser]);
  
  const getStatusBadgeVariant = (status: string) => {
    switch(status) {
      case 'approved': return 'success';
      case 'rejected': return 'destructive';
      default: return 'secondary';
    }
  };
  
  const formatDate = (seconds: number) => {
    const date = new Date(seconds * 1000);
    return formatDistanceToNow(date, { addSuffix: true });
  };
  
  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        <div className="grid gap-6">
          {/* User Stats Card */}
          <Card className="bg-gradient-to-r from-roboblue/10 to-roboteal/10 border-t-4 border-t-roboblue">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                Your Dashboard
                {currentUser?.photoURL && (
                  <img 
                    src={currentUser.photoURL} 
                    alt={currentUser.displayName || 'User'} 
                    className="w-8 h-8 rounded-full ml-2"
                  />
                )}
              </CardTitle>
              <CardDescription>
                Welcome back, {currentUser?.displayName || 'User'}!
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-white p-4 rounded-lg shadow-sm">
                  <h3 className="text-sm font-medium text-gray-500">Total Referrals</h3>
                  <p className="text-3xl font-bold">{userReferralCount}</p>
                </div>
                <div className="bg-white p-4 rounded-lg shadow-sm">
                  <h3 className="text-sm font-medium text-gray-500">Pending Approval</h3>
                  <p className="text-3xl font-bold">
                    {referrals.filter(r => r.status === 'pending').length}
                  </p>
                </div>
                <div className="bg-white p-4 rounded-lg shadow-sm">
                  <h3 className="text-sm font-medium text-gray-500">Approved</h3>
                  <p className="text-3xl font-bold">
                    {referrals.filter(r => r.status === 'approved').length}
                  </p>
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Link to="/referral">
                <Button className="bg-roboblue hover:bg-blue-600">
                  Add New Referral
                </Button>
              </Link>
            </CardFooter>
          </Card>
          
          {/* Recent Referrals */}
          <Card>
            <CardHeader>
              <CardTitle>Your Referrals</CardTitle>
              <CardDescription>
                A list of all your submitted referrals
              </CardDescription>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="space-y-3">
                  {[...Array(3)].map((_, i) => (
                    <div key={i} className="flex items-center space-x-4">
                      <Skeleton className="h-12 w-12 rounded-full" />
                      <div className="space-y-2">
                        <Skeleton className="h-4 w-[250px]" />
                        <Skeleton className="h-4 w-[200px]" />
                      </div>
                    </div>
                  ))}
                </div>
              ) : referrals.length === 0 ? (
                <div className="text-center py-6">
                  <p className="text-muted-foreground">You haven't referred anyone yet.</p>
                  <Link to="/referral" className="mt-2 inline-block">
                    <Button variant="outline" size="sm">
                      Make Your First Referral
                    </Button>
                  </Link>
                </div>
              ) : (
                <div className="space-y-4">
                  {referrals.map((referral) => (
                    <div 
                      key={referral.id}
                      className="flex flex-col md:flex-row md:items-center justify-between p-4 rounded-lg bg-muted/50 gap-2"
                    >
                      <div>
                        <h3 className="font-medium">{referral.referredName}</h3>
                        <p className="text-sm text-muted-foreground">{referral.referredEmail}</p>
                        <p className="text-xs text-muted-foreground mt-1">
                          {formatDate(referral.timestamp.seconds)}
                        </p>
                      </div>
                      <div className="mt-2 md:mt-0">
                        <Badge variant={getStatusBadgeVariant(referral.status) as "success" | "destructive" | "secondary"}>
                          {referral.status.charAt(0).toUpperCase() + referral.status.slice(1)}
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
            <CardFooter className="flex justify-between">
              <p className="text-xs text-muted-foreground">
                Referrals are typically approved within 24-48 hours.
              </p>
            </CardFooter>
          </Card>
        </div>
      </div>
    </Layout>
  );
};

export default Dashboard;
