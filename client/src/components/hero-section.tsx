import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ShoppingBag, GraduationCap, Star, ArrowRight, Flower, Users, Award, Calendar, Truck, Gift, Sparkles } from "lucide-react";
import { Link } from "wouter";
import { useState, useEffect, useRef } from "react";
import bouquetBarLogo from "@assets/E_Commerce_Bouquet_Bar_Logo_1757433847861.png";
import flowerSchoolLogo from "@assets/Flower_School_Logo_1757484169081.png";

export default function HeroSection() {
  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef(null);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    // Intersection Observer for scroll animations
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.3 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    // Mouse position tracking for parallax effects
    const handleMouseMove = (e: MouseEvent): void => {
      setMousePosition({
        x: (e.clientX / window.innerWidth - 0.5) * 20,
        y: (e.clientY / window.innerHeight - 0.5) * 20
      });
    };

    window.addEventListener('mousemove', handleMouseMove);

    return () => {
      if (sectionRef.current) {
        observer.unobserve(sectionRef.current);
      }
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, []);

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <section
      id="home"
      ref={sectionRef}
      className="min-h-screen bg-white pt-20 pb-20 relative overflow-hidden flex items-center"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 w-full">
        {/* Header Section */}
        <div className={`text-center mb-12 transition-all duration-1000 ease-out ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
          <h1 className="text-2xl md:text-3xl text-gray-700 mb-8 font-medium leading-relaxed">
            Your one-stop destination for beautiful flowers and professional floral education
          </h1>

          {/* Feature Badges with staggered animation */}
          <div className="flex flex-wrap justify-center gap-4 mb-16">
            {[
              { icon: Flower, text: "Premium Flowers", color: "pink" },
              { icon: GraduationCap, text: "Expert Training", color: "orange" },
              { icon: Truck, text: "Fast Delivery", color: "blue" },
              { icon: Gift, text: "Gift Packages", color: "purple" }
            ].map((badge, index) => {
              const Icon = badge.icon;
              return (
                <Badge
                  key={index}
                  className={`bg-${badge.color}-100 text-${badge.color}-700 border border-${badge.color}-200 px-4 py-2 text-sm font-semibold transition-all duration-500 hover:scale-105 transform ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'}`}
                  style={{ transitionDelay: `${index * 100}ms` }}
                >
                  <Icon className="w-4 h-4 mr-2" />
                  {badge.text}
                </Badge>
              );
            })}
          </div>
        </div>

        {/* Two Cards Layout */}
        <div className="grid lg:grid-cols-2 gap-8 items-stretch">
          {/* Floral Design School Card */}
          <div className={`bg-gradient-to-br from-orange-50 to-amber-50 rounded-2xl p-8 border border-orange-200 shadow-lg transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}
            style={{ transitionDelay: '200ms' }}
          >
            <div className="text-center mb-6">
              <img
                src={flowerSchoolLogo}
                alt="The Flower School Bengaluru Logo"
                className={`w-24 h-24 mx-auto mb-4 transition-all duration-1000 ${isVisible ? 'scale-100 opacity-100' : 'scale-90 opacity-0'}`}
                style={{ transitionDelay: '300ms' }}
              />
            </div>

            <div className="text-center flex-grow">
              <h2 className={`text-3xl font-bold text-gray-800 mb-4 transition-all duration-700 ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'}`} style={{ transitionDelay: '400ms' }}>
                Floral Design School
              </h2>
              <p className={`text-gray-600 mb-8 leading-relaxed font-medium transition-all duration-700 ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'}`} style={{ transitionDelay: '500ms' }}>
                Learn professional floral design from expert instructors
              </p>

              <Button
                size="lg"
                onClick={() => window.open("https://app.flowerschoolbengaluru.com/", "_blank")}
                className={`mt-5 w-full text-lg py-4 h-auto font-semibold mb-8 bg-orange-500 hover:bg-orange-600 transition-all duration-500 hover:scale-105 ${isVisible ? 'scale-100 opacity-100' : 'scale-95 opacity-0'}`}
                style={{ transitionDelay: '600ms' }}
              >
                Explore Courses
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>

            </div>

            <div className="grid grid-cols-2 gap-4">
              {[
                { icon: Award, text: "Certified Courses", color: "orange" },
                { icon: Users, text: "Expert Instructors", color: "orange" }
              ].map((feature, index) => {
                const Icon = feature.icon;
                return (
                  <div
                    key={index}
                    className={`flex items-center gap-2 text-gray-600 transition-all duration-500 hover:text-${feature.color}-700 font-medium ${isVisible ? 'translate-x-0 opacity-100' : 'translate-x-4 opacity-0'}`}
                    style={{ transitionDelay: `${700 + index * 100}ms` }}
                  >
                    <Icon className={`w-5 h-5 text-${feature.color}-500 transition-transform duration-300 hover:scale-110`} />
                    <span className="text-sm">{feature.text}</span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Online Flower Shop Card */}
          <div className={`bg-gradient-to-br from-pink-50 to-rose-50 rounded-2xl p-8 border border-pink-200 shadow-lg transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}
            style={{ transitionDelay: '300ms' }}
          >
            <div className="text-center mb-6">
              <img
                src={bouquetBarLogo}
                alt="Bouquet Bar Bengaluru Logo"
                className={`w-40 h-auto mx-auto mb-4 transition-all duration-1000 ${isVisible ? 'scale-100 opacity-100' : 'scale-90 opacity-0'}`}
                style={{ transitionDelay: '400ms' }}
              />
            </div>

            <div className="text-center">
              <h2 className={`text-3xl font-bold text-gray-800 mb-4 transition-all duration-700 ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'}`} style={{ transitionDelay: '500ms' }}>
                Online Flower Shop
              </h2>
              <p className={`text-gray-600 mb-8 leading-relaxed font-medium transition-all duration-700 ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'}`} style={{ transitionDelay: '600ms' }}>
                Browse our exclusive collection of fresh flowers, bouquets, and arrangements
              </p>

              <Link href="/shop">
                <Button
                  size="lg"
                  className={`w-full text-lg py-4 h-auto font-semibold mb-8 bg-pink-500 hover:bg-pink-600 transition-all duration-500 hover:scale-105 ${isVisible ? 'scale-100 opacity-100' : 'scale-95 opacity-0'}`}
                  style={{ transitionDelay: '700ms' }}
                >
                  Visit Shop Now
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
            </div>

            <div className="grid grid-cols-2 gap-4">
              {[
                { icon: Flower, text: "500+ Varieties", color: "pink" },
                { icon: Calendar, text: "Same Day Delivery", color: "pink" }
              ].map((feature, index) => {
                const Icon = feature.icon;
                return (
                  <div
                    key={index}
                    className={`flex items-center gap-2 text-gray-600 transition-all duration-500 hover:text-${feature.color}-700 font-medium ${isVisible ? 'translate-x-0 opacity-100' : '-translate-x-4 opacity-0'}`}
                    style={{ transitionDelay: `${800 + index * 100}ms` }}
                  >
                    <Icon className={`w-5 h-5 text-${feature.color}-500 transition-transform duration-300 hover:scale-110`} />
                    <span className="text-sm">{feature.text}</span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* Auto-trigger button animation */}
      <style jsx>{`
        @keyframes pulse-glow {
          0% {
            box-shadow: 0 0 0 0 rgba(249, 115, 22, 0.5);
          }
          70% {
            box-shadow: 0 0 0 10px rgba(249, 115, 22, 0);
          }
          100% {
            box-shadow: 0 0 0 0 rgba(249, 115, 22, 0);
          }
        }
        
        @keyframes pulse-glow-pink {
          0% {
            box-shadow: 0 0 0 0 rgba(236, 72, 153, 0.5);
          }
          70% {
            box-shadow: 0 0 0 10px rgba(236, 72, 153, 0);
          }
          100% {
            box-shadow: 0 0 0 0 rgba(236, 72, 153, 0);
          }
        }
        
        .animate-pulse-glow {
          animation: pulse-glow 2s infinite;
        }
        
        .animate-pulse-glow-pink {
          animation: pulse-glow-pink 2s infinite;
        }
        
        .bg-grid-pattern {
          background-image: url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 32 32' width='32' height='32' fill='none' stroke='rgb(251 113 133 / 0.1)'%3e%3cpath d='M0 .5H31.5V32'/%3e%3c/svg%3e");
        }
      `}</style>

      {/* Add auto-trigger animation to buttons after component mounts */}
      <script
        dangerouslySetInnerHTML={{
          __html: `
            setTimeout(() => {
              const schoolButton = document.querySelector('[href="/school"]');
              const shopButton = document.querySelector('[href="/shop"]');
              
              if (schoolButton) {
                schoolButton.classList.add('animate-pulse-glow');
                setTimeout(() => {
                  schoolButton.classList.remove('animate-pulse-glow');
                }, 6000);
              }
              
              if (shopButton) {
                shopButton.classList.add('animate-pulse-glow-pink');
                setTimeout(() => {
                  shopButton.classList.remove('animate-pulse-glow-pink');
                }, 6000);
              }
            }, 2000);
          `,
        }}
      />
    </section>
  );
}