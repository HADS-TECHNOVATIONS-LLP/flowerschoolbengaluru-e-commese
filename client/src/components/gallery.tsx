import { useState } from "react";
import { Button } from "@/components/ui/button";
import CenterFlower from "../images/CenterFlower.jpg";
import RightImage1 from "../images/rightimage1.jpg";
import RightImage2 from "../images/rightimage2.jpg";
import LeftImage1 from "../images/leftimage1.jpg";
import LeftImage2 from "../images/leftimage2.jpg";

export default function Gallery() {
  const [activeTab, setActiveTab] = useState<'shop' | 'school'>('shop');

  const shopImages = {
    center: {
      src: CenterFlower,
      alt: "Beautiful Flower Arrangement",
    },
    right: [
      {
        src: RightImage1,
        alt: "Featured Floral Design 1",
      },
      {
        src: RightImage2,
        alt: "Featured Floral Design 2",
      }
    ],
    left: [
      {
        src: LeftImage1,
        alt: "Signature Arrangement 1",
      },
      {
        src: LeftImage2,
        alt: "Signature Arrangement 2",
      }
    ]
  };

  const schoolImages = {
    center: {
      src: "https://images.unsplash.com/photo-1513475382585-d06e58bcb0e0?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&h=600",
      alt: "Floral design workshop in progress",
    },
    right: [
      {
        src: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&h=300",
        alt: "Professional instructor teaching",
      },
      {
        src: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&h=300",
        alt: "Student practicing floral design",
      }
    ],
    left: [
      {
        src: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&h=300",
        alt: "Hands-on learning experience",
      },
      {
        src: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&h=300",
        alt: "Floral design certification",
      }
    ]
  };

  const currentImages = activeTab === 'shop' ? shopImages : schoolImages;

  return (
   <section 
  id="gallery" 
  className="bg-white pt-38 pb-10"
>


        <div className="text-center mb-16">
            <h2 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-extrabold leading-tight text-gray-900 tracking-tight ">
            Our Gallery
          </h2>
          <p className="text-xl text-muted-foreground">Explore our beautiful creations and learning moments</p>
        </div>

        {/* Tab Navigation */}
        <div className="flex justify-center mb-12">
          <div className="bg-muted rounded-full p-1">
            <Button
              variant={activeTab === 'shop' ? "default" : "ghost"}
              onClick={() => setActiveTab('shop')}
              className="rounded-full px-6 py-2"
            >
              Flower Shop
            </Button>
            <Button
              variant={activeTab === 'school' ? "default" : "ghost"}
              onClick={() => setActiveTab('school')}
              className="rounded-full px-6 py-2"
            >
              Flower School
            </Button>
          </div>
        </div>

        {/* Gallery Layout */}
        <div className="flex flex-col lg:flex-row items-center justify-center gap-6">
          {/* Left Side Images - Vertical Stack */}
          <div className="lg:w-1/4 space-y-6">
            {currentImages.left.map((image, index) => (
              <div 
                key={`left-${index}`}
                className="group cursor-pointer relative overflow-hidden rounded-xl bg-white/60 backdrop-blur-sm shadow-lg hover:shadow-2xl transition-all duration-500 hover:scale-105 hover:-translate-y-2"
              >
                <div className="relative overflow-hidden rounded-xl">
                  <img 
                    src={image.src} 
                    alt={image.alt} 
                    className="w-full h-64 object-cover transition-transform duration-700 group-hover:scale-110" 
                  />
                  <div className="absolute bottom-0 left-0 right-0 p-4 text-white transform translate-y-full group-hover:translate-y-0 transition-transform duration-500">
                    <h3 className="font-semibold text-sm mb-1">{image.alt}</h3>
                   
                  </div>
                  <div className="absolute inset-0 rounded-xl ring-1 ring-white/20 group-hover:ring-pink-300/50 transition-all duration-500"></div>
                </div>
              </div>
            ))}
          </div>

          {/* Center Image - Larger */}
          <div className="lg:w-2/4 group cursor-pointer relative overflow-hidden rounded-xl bg-white/60 backdrop-blur-sm shadow-lg hover:shadow-2xl transition-all duration-500 hover:scale-105 hover:-translate-y-2">
            <div className="relative overflow-hidden rounded-xl">
              <img 
                src={currentImages.center.src} 
                alt={currentImages.center.alt} 
                className="w-full h-[550px] object-cover transition-transform duration-700 group-hover:scale-110" 
              />
              <div className="absolute bottom-0 left-0 right-0 p-6 text-white transform translate-y-full group-hover:translate-y-0 transition-transform duration-500">
                <h3 className="font-semibold text-lg mb-2">{currentImages.center.alt}</h3>
               
              </div>
              <div className="absolute inset-0 rounded-xl ring-1 ring-white/20 group-hover:ring-pink-300/50 transition-all duration-500"></div>
            </div>
          </div>

          {/* Right Side Images - Vertical Stack */}
          <div className="lg:w-1/4 space-y-6">
            {currentImages.right.map((image, index) => (
              <div 
                key={`right-${index}`}
                className="group cursor-pointer relative overflow-hidden rounded-xl bg-white/60 backdrop-blur-sm shadow-lg hover:shadow-2xl transition-all duration-500 hover:scale-105 hover:-translate-y-2"
              >
                <div className="relative overflow-hidden rounded-xl">
                  <img 
                    src={image.src} 
                    alt={image.alt} 
                    className="w-full h-64 object-cover transition-transform duration-700 group-hover:scale-110" 
                  />
                  <div className="absolute bottom-0 left-0 right-0 p-4 text-white transform translate-y-full group-hover:translate-y-0 transition-transform duration-500">
                    <h3 className="font-semibold text-sm mb-1">{image.alt}</h3>
                   
                  </div>
                  <div className="absolute inset-0 rounded-xl ring-1 ring-white/20 group-hover:ring-pink-300/50 transition-all duration-500"></div>
                </div>
              </div>
            ))}
          </div>
        </div>
 
    </section>
  );
}