
import { useState } from "react";
import Layout from "@/components/Layout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";

// Mock data for images
const galleryImages = [
  {
    id: 1,
    url: "https://images.unsplash.com/photo-1597089542047-ee0608b3710b?q=80&w=1974&auto=format&fit=crop",
    caption: "Participants working on robot calibration"
  },
  {
    id: 2,
    url: "https://images.unsplash.com/photo-1563804951831-98421928d0a9?q=80&w=1974&auto=format&fit=crop",
    caption: "Robot precision demonstration"
  },
  {
    id: 3,
    url: "https://images.unsplash.com/photo-1595069906974-f8ae7ffc3e7a?q=80&w=2070&auto=format&fit=crop",
    caption: "Championship match from last year"
  },
  {
    id: 4,
    url: "https://images.unsplash.com/photo-1581092335397-9583eb92d232?q=80&w=2070&auto=format&fit=crop",
    caption: "Programming session during workshop"
  },
  {
    id: 5,
    url: "https://images.unsplash.com/photo-1485827404703-89b55fcc595e?q=80&w=2070&auto=format&fit=crop",
    caption: "Team collaboration on robot design"
  }
];

// Mock data for videos
const videoLinks = [
  {
    id: 1,
    youtubeId: "xx55ES3qmD0",
    title: "ROBOSOCCER 2.0 Highlights"
  },
  {
    id: 2,
    youtubeId: "RC_w9i_S7nw", 
    title: "Introduction to Robot Soccer"
  },
  {
    id: 3,
    youtubeId: "2RpYsvJr3Jo",
    title: "Advanced Robot Programming"
  }
];

const MediaShowcase = () => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  
  const prevImage = () => {
    setCurrentImageIndex((prev) => (prev === 0 ? galleryImages.length - 1 : prev - 1));
  };
  
  const nextImage = () => {
    setCurrentImageIndex((prev) => (prev === galleryImages.length - 1 ? 0 : prev + 1));
  };
  
  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-center mb-8">Media Showcase</h1>
        
        <Tabs defaultValue="photos" className="max-w-4xl mx-auto">
          <TabsList className="grid w-full grid-cols-2 mb-8">
            <TabsTrigger value="photos">Photos</TabsTrigger>
            <TabsTrigger value="videos">Videos</TabsTrigger>
          </TabsList>
          
          <TabsContent value="photos">
            <Card>
              <CardHeader>
                <CardTitle>Photo Gallery</CardTitle>
                <CardDescription>
                  Images from previous ROBOSOCCER events
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="relative overflow-hidden rounded-md bg-black aspect-[16/9]">
                  <div className="absolute inset-0 flex items-center justify-center">
                    <img 
                      src={galleryImages[currentImageIndex].url}
                      alt={`Gallery image ${currentImageIndex + 1}`}
                      className="w-full h-full object-contain"
                    />
                  </div>
                  
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    className="absolute left-2 top-1/2 -translate-y-1/2 bg-black/30 text-white hover:bg-black/50"
                    onClick={prevImage}
                  >
                    <ChevronLeft className="h-6 w-6" />
                  </Button>
                  
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    className="absolute right-2 top-1/2 -translate-y-1/2 bg-black/30 text-white hover:bg-black/50"
                    onClick={nextImage}
                  >
                    <ChevronRight className="h-6 w-6" />
                  </Button>
                  
                  <div className="absolute bottom-0 left-0 right-0 bg-black/60 text-white p-3">
                    <p>{galleryImages[currentImageIndex].caption}</p>
                    <p className="text-xs mt-1 text-gray-300">
                      Image {currentImageIndex + 1} of {galleryImages.length}
                    </p>
                  </div>
                </div>
                
                <div className="flex justify-center mt-4 gap-2">
                  {galleryImages.map((_, index) => (
                    <button
                      key={index}
                      className={`w-2 h-2 rounded-full transition-all ${
                        index === currentImageIndex ? "bg-roboblue w-4" : "bg-gray-300"
                      }`}
                      onClick={() => setCurrentImageIndex(index)}
                    />
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="videos">
            <Card>
              <CardHeader>
                <CardTitle>Video Showcase</CardTitle>
                <CardDescription>
                  Videos from previous ROBOSOCCER events
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid gap-8">
                  {videoLinks.map((video) => (
                    <div key={video.id} className="space-y-2">
                      <h3 className="font-medium text-lg">{video.title}</h3>
                      <div className="aspect-video rounded-md overflow-hidden">
                        <iframe
                          width="100%"
                          height="100%"
                          src={`https://www.youtube.com/embed/${video.youtubeId}`}
                          title={video.title}
                          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                          allowFullScreen
                          className="border-0"
                        ></iframe>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
        
        <div className="max-w-4xl mx-auto mt-12 p-6 bg-gradient-to-r from-roboblue/10 to-roboteal/10 rounded-lg border border-slate-200">
          <h2 className="text-2xl font-bold mb-4 text-center">Join the Action!</h2>
          <p className="text-center mb-6">
            Participants without robots can still play using organizer's bots. 
            Top referrers will get early access to freeplay slots!
          </p>
        </div>
      </div>
    </Layout>
  );
};

export default MediaShowcase;
