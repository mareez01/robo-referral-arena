
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { collection, addDoc, doc, updateDoc, increment, getDoc } from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { firestore, storage } from "@/lib/firebase";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/components/ui/use-toast";
import Layout from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2, Upload } from "lucide-react";

const ReferralForm = () => {
  const { currentUser } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  
  const [referredName, setReferredName] = useState("");
  const [referredEmail, setReferredEmail] = useState("");
  const [screenshot, setScreenshot] = useState<File | null>(null);
  const [uploadError, setUploadError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const handleScreenshotChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      
      // Validate file type
      if (!file.type.includes('image/')) {
        setUploadError("Please upload an image file");
        return;
      }
      
      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        setUploadError("File size must be less than 5MB");
        return;
      }
      
      setScreenshot(file);
      setUploadError("");
    }
  };
  
  const validateForm = () => {
    if (!referredName.trim()) {
      toast({ 
        title: "Name Required", 
        description: "Please enter the name of the person you're referring", 
        variant: "destructive" 
      });
      return false;
    }
    
    if (!referredEmail.trim() || !referredEmail.includes('@')) {
      toast({ 
        title: "Valid Email Required", 
        description: "Please enter a valid email address", 
        variant: "destructive" 
      });
      return false;
    }
    
    if (!screenshot) {
      toast({ 
        title: "Screenshot Required", 
        description: "Please upload a proof of registration", 
        variant: "destructive" 
      });
      return false;
    }
    
    return true;
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm() || !currentUser) return;
    
    setIsSubmitting(true);
    
    try {
      // 1. Upload screenshot to Firebase Storage
      const storageRef = ref(storage, `screenshots/${currentUser.uid}/${Date.now()}-${screenshot.name}`);
      const uploadResult = await uploadBytes(storageRef, screenshot);
      const screenshotURL = await getDownloadURL(uploadResult.ref);
      
      // 2. Add referral to Firestore
      const referralData = {
        referredName,
        referredEmail,
        proofScreenshotURL: screenshotURL,
        referredByUID: currentUser.uid,
        referredBy: currentUser.displayName,
        timestamp: new Date(),
        status: "pending" // pending, approved, rejected
      };
      
      const referralRef = await addDoc(collection(firestore, "referrals"), referralData);
      
      // 3. Update user's referral count
      const userRef = doc(firestore, "users", currentUser.uid);
      await updateDoc(userRef, {
        referralCount: increment(1)
      });
      
      // 4. Show success message
      toast({
        title: "Referral Submitted!",
        description: "Your referral has been submitted and is pending approval.",
      });
      
      // 5. Navigate to dashboard
      navigate("/dashboard");
      
    } catch (error) {
      console.error("Error submitting referral:", error);
      toast({
        title: "Submission Failed",
        description: "There was a problem submitting your referral. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };
  
  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        <Card className="max-w-md mx-auto">
          <CardHeader>
            <CardTitle>Refer a Friend</CardTitle>
            <CardDescription>
              Submit details of someone who registered for ROBOSOCCER 3.0
            </CardDescription>
          </CardHeader>
          <form onSubmit={handleSubmit}>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Name of Referred Person</Label>
                <Input 
                  id="name"
                  placeholder="Enter the full name"
                  value={referredName}
                  onChange={(e) => setReferredName(e.target.value)}
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="email">Email of Referred Person</Label>
                <Input 
                  id="email"
                  type="email"
                  placeholder="Enter their email address"
                  value={referredEmail}
                  onChange={(e) => setReferredEmail(e.target.value)}
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="screenshot">Upload Proof of Registration</Label>
                <div className="border-2 border-dashed border-gray-300 rounded-md p-4 cursor-pointer hover:bg-gray-50 transition-colors flex flex-col items-center justify-center">
                  <Input 
                    id="screenshot"
                    type="file"
                    accept="image/*"
                    onChange={handleScreenshotChange}
                    className="hidden"
                  />
                  <Label htmlFor="screenshot" className="cursor-pointer w-full">
                    <div className="flex flex-col items-center justify-center py-4 text-center">
                      <Upload className="h-10 w-10 text-gray-400 mb-2" />
                      {screenshot ? (
                        <p className="text-sm text-green-600 font-medium">{screenshot.name}</p>
                      ) : (
                        <>
                          <p className="text-sm text-gray-600">Click to upload or drag and drop</p>
                          <p className="text-xs text-gray-500 mt-1">PNG, JPG, GIF up to 5MB</p>
                        </>
                      )}
                    </div>
                  </Label>
                </div>
                {uploadError && <p className="text-xs text-red-500 mt-1">{uploadError}</p>}
              </div>
              
              <div className="pt-2">
                <p className="text-xs text-muted-foreground">
                  By submitting this form, you confirm that this person has registered for the ROBOSOCCER 3.0 event.
                </p>
              </div>
            </CardContent>
            <CardFooter>
              <Button 
                type="submit" 
                className="w-full bg-roboblue hover:bg-blue-600"
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Submitting...
                  </>
                ) : (
                  "Submit Referral"
                )}
              </Button>
            </CardFooter>
          </form>
        </Card>
      </div>
    </Layout>
  );
};

export default ReferralForm;
