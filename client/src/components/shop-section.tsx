import { useState, useEffect, useRef } from 'react';

export default function ShopSection() {
  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef(null);

  const flowerImages = [
    "src/FlowerShop/Flower1.jpg",
    "src/FlowerShop/Flower2.jpg",
    "src/FlowerShop/Flower3.jpg",
    "src/FlowerShop/Flower4.jpg",
    "src/FlowerShop/Flower5.jpg",
    "src/FlowerShop/Flower6.jpg",
    "src/FlowerShop/Flower7.jpg",
    "src/FlowerShop/Flower8.jpg",
    "src/FlowerShop/Flower9.jpg",
    "src/FlowerShop/Flower10.jpg",
    "src/FlowerShop/Flower11.jpg",
    "src/FlowerShop/Flower12.jpg"
  ];

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      {
        threshold: 0.2,
        rootMargin: '50px'
      }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => {
      if (sectionRef.current) {
        observer.unobserve(sectionRef.current);
      }
    };
  }, []);

  return (
    <section id="shop" className="py-16 bg-white overflow-hidden" ref={sectionRef}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-20">
        
                     <h2 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-extrabold leading-tight text-gray-900 tracking-tight">
  Our {" "}
  <span className="bg-clip-text text-transparent bg-gradient-to-r from-pink-600 to-purple-600">
    Flower
  </span>{" "}
  Shop
</h2>
           <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Premium fresh flowers delivered to your doorstep across Bengaluru
          </p>
        </div>

        {/* Image Gallery with staggered animations */}
<div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
  {flowerImages.map((imageSrc, index) => {
    const isFromLeft = index % 2 === 0;
    const animationDelay = `${500 + index * 150}ms`;

    return (
      <div
        key={index}
        className={`group relative overflow-hidden rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-700 transform hover:-translate-y-2 ${
          isVisible
            ? 'opacity-100 translate-x-0'
            : `opacity-0 ${isFromLeft ? '-translate-x-16' : 'translate-x-16'}`
        }`}
        style={{
          transitionDelay: isVisible ? animationDelay : '0ms',
          transitionDuration: '800ms'
        }}
      >
        <div className="w-full h-64"> {/* fixed card height */}
          <img
            src={imageSrc}
            alt={`Beautiful Flower Arrangement ${index + 1}`}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
          />
        </div>
      </div>
    );
  })}
</div>

        {/* Decorative floating elements */}
        <div className="absolute -left-10 top-1/2 opacity-20 pointer-events-none">
          <div className={`w-20 h-20 bg-pink-200 rounded-full transition-all duration-1000 ${
            isVisible ? 'animate-bounce' : ''
          }`} style={{ animationDelay: '2s' }}></div>
        </div>
        <div className="absolute -right-10 top-1/3 opacity-20 pointer-events-none">
          <div className={`w-16 h-16 bg-purple-200 rounded-full transition-all duration-1000 ${
            isVisible ? 'animate-pulse' : ''
          }`} style={{ animationDelay: '2.5s' }}></div>
        </div>
      </div>
    </section>
  );
}