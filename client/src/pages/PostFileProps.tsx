import React, { useRef } from "react";
import { useLocation } from "wouter";
import { ChevronLeft, ChevronRight } from "lucide-react";

// Import post images
import Post1 from "../CategoryImages/Flower5.jpg";
import Post2 from "../CategoryImages/Post2.jpg";
import Post3 from "../CategoryImages/Post3.jpg";
import Post4 from "../CategoryImages/Post4.jpg";
import Post5 from "../CategoryImages/Post5.jpg";

interface PostFileProps {
  
}

const PostFile: React.FC<PostFileProps> = () => {
  const [, setLocation] = useLocation();
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  
  const posts = [
    { 
      id: 1, 
      image: Post1, 
      name: "Birthday",
      alt: "Beautiful Flower Arrangement",
      category: "occasion",
      subcategory: "birthday"
    },
    { 
      id: 2, 
      image: Post2, 
      name: "Anniversary",
      alt: "Elegant Bouquet",
      category: "occasion",
      subcategory: "anniversary"
    },
    { 
      id: 3, 
      image: Post3, 
      name: "Best Wishes",
      alt: "Colorful Floral Display",
      category: "occasion",
      subcategory: "best wishes"
    },
    { 
      id: 4, 
      image: Post4, 
      name: "Sympathy",
      alt: "Modern Flower Design",
      category: "occasion",
      subcategory: "sympathy"
    },
    { 
      id: 5, 
      image: Post5, 
      name: "Thank you",
      alt: "Seasonal Flower Collection",
      category: "occasion",
      subcategory: "thank you"
    },
  ];

  const scrollLeft = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({ left: -400, behavior: 'smooth' });
    }
  };

  const scrollRight = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({ left: 400, behavior: 'smooth' });
    }
  };

  const handlePostClick = (post: typeof posts[0]) => {
    // Navigate to ProductsListing with search parameter for better matching
    setLocation(`/products?search=${encodeURIComponent(post.name.toLowerCase())}`);
  };

  return (
    <div className="relative">
      {/* Left scroll button */}
      <button 
        onClick={scrollLeft}
        className="absolute left-0 top-1/2 transform -translate-y-1/2 z-10 bg-white rounded-full p-2 shadow-md hover:bg-gray-100 transition-colors"
        aria-label="Scroll left"
      >
        <ChevronLeft className="w-5 h-5 text-gray-700" />
      </button>
      
      {/* Scroll container */}
      <div 
        ref={scrollContainerRef}
        className="flex overflow-x-auto scrollbar-hide space-x-6 py-6 px-2"
        style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
      >
        {posts.map((post) => (
          <div 
            key={post.id} 
            className="flex-shrink-0 w-[550px] h-[300px] rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-shadow duration-300 cursor-pointer relative"
            onClick={() => handlePostClick(post)}
          >
            <img 
              src={post.image} 
              alt={post.alt}
              className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
            />
            {/* Name overlay */}
            <div className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-60 py-3 px-4 text-white text-2xl font-bold tracking-wide text-center drop-shadow-lg">
              {post.name}
            </div>
          </div>
        ))}
      </div>
      
      {/* Right scroll button */}
      <button 
        onClick={scrollRight}
        className="absolute right-0 top-1/2 transform -translate-y-1/2 z-10 bg-white rounded-full p-2 shadow-md hover:bg-gray-100 transition-colors"
        aria-label="Scroll right"
      >
        <ChevronRight className="w-5 h-5 text-gray-700" />
      </button>

      {/* CSS for scrollbar hiding */}
      <style jsx>{`
        .scrollbar-hide {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
        
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
      `}</style>
    </div>
  );
};

export default PostFile;