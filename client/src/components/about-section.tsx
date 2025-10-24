import { useState, useEffect, useRef } from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import FlowerCraft from "../images/FlowerCraft.jpg";
import { 
  Flower, Users, GraduationCap, Award, Sparkles, 
  Heart, Target, Globe, Clock, Star, ChevronRight,
  Palette, Brush, Sparkle, Leaf, Gem, Crown
} from "lucide-react";

export default function AboutSection() {
  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.2 }
    );

    if (sectionRef.current) observer.observe(sectionRef.current);

    return () => {
      if (sectionRef.current) observer.disconnect();
    };
  }, []);

  const features = [
    {
      icon: Palette,
      title: "Creative Expression",
      description: "Unleash your artistic potential through floral design"
    },
    {
      icon: Brush,
      title: "Hands-on Learning",
      description: "Practical training with premium flowers and materials"
    },
    {
      icon: Sparkle,
      title: "Expert Guidance",
      description: "Learn from internationally certified floral artists"
    },
    {
      icon: Leaf,
      title: "Sustainable Practices",
      description: "Eco-friendly floral design techniques and materials"
    }
  ];

  const achievements = [
    { number: "500+", label: "Students Transformed", icon: Users },
    { number: "15+", label: "Years Excellence", icon: Award },
    { number: "98%", label: "Success Stories", icon: Star },
    { number: "1000+", label: "Arrangements Created", icon: Flower }
  ];

  return (
    <section 
      id="about" 
      ref={sectionRef}
      className="py-12 sm:py-16 md:py-20 lg:py-28 bg-gradient-to-br from-white via-pink-50/30 to-purple-50/30 relative overflow-hidden"
    >
      {/* Decorative background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-12 sm:-top-24 -right-12 sm:-right-24 w-48 sm:w-72 lg:w-96 h-48 sm:h-72 lg:h-96 bg-gradient-to-br from-pink-200/20 to-purple-200/20 rounded-full blur-3xl animate-float-slow"></div>
        <div className="absolute -bottom-12 sm:-bottom-24 -left-12 sm:-left-24 w-40 sm:w-60 lg:w-80 h-40 sm:h-60 lg:h-80 bg-gradient-to-br from-purple-200/20 to-pink-200/20 rounded-full blur-3xl animate-float-slow" style={{animationDelay: '4s'}}></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-32 sm:w-48 lg:w-64 h-32 sm:h-48 lg:h-64 bg-gradient-to-br from-pink-100/10 to-purple-100/10 rounded-full blur-2xl animate-float-slow" style={{animationDelay: '2s'}}></div>
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Header with creative layout */}
        <div className="text-center mb-12 sm:mb-16 lg:mb-20">
      
           <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-extrabold leading-tight text-gray-900 tracking-tight mb-4 sm:mb-6">
  About {" "}
  <span className="bg-clip-text text-transparent bg-gradient-to-r from-pink-600 to-purple-600">
    Our
  </span>{" "}
  Journey
</h2>
           <p className="text-base sm:text-lg text-gray-600 max-w-2xl mx-auto px-4 sm:px-0">
            At Flower School Bangalore, we transform passion into profession through immersive floral education that celebrates creativity, technique, and the pure joy of flowers.
          </p>
        </div>

        {/* Creative grid layout */}
        <div className="grid lg:grid-cols-2 gap-8 lg:gap-16 items-center mb-16 lg:mb-24">
          <div className={`space-y-6 lg:space-y-8 transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-x-8'}`}>
            <div className="space-y-4 lg:space-y-6">
              <h3 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold leading-tight text-gray-900 tracking-tight">
                Craft Your Floral Masterpiece
              </h3>
              
              <p className="text-base sm:text-lg text-gray-600 leading-relaxed">
                Whether you're beginning your journey or refining your skills, our programs are designed to nurture your unique creative voice while providing professional-grade training.
              </p>
            </div>

            {/* Feature cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 lg:gap-6">
              {features.map((feature, index) => {
                const Icon = feature.icon;
                return (
                  <div 
                    key={index}
                    className={`bg-white p-4 sm:p-6 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-all duration-500 hover:-translate-y-1 group ${isVisible ? 'opacity-100' : 'opacity-0'}`}
                    style={{ transitionDelay: `${500 + index * 100}ms` }}
                  >
                    <div className="bg-gradient-to-br from-gray-100 to-gray-50 w-12 h-12 sm:w-14 sm:h-14 rounded-2xl flex items-center justify-center mb-3 sm:mb-4 group-hover:scale-110 transition-transform duration-300">
                      <Icon className="w-6 h-6 sm:w-7 sm:h-7 text-pink-600" />
                    </div>
                    <h4 className="font-semibold text-gray-900 mb-2 text-sm sm:text-base">{feature.title}</h4>
                    <p className="text-xs sm:text-sm text-gray-600">{feature.description}</p>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Visual element with image */}
          <div className={`relative transition-all duration-1000 delay-500 mt-8 lg:mt-0 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-x-8'}`}>
            <div className="relative h-64 sm:h-80 md:h-96 lg:h-[500px] rounded-2xl overflow-hidden group shadow-xl">
              <img 
                src={FlowerCraft}
                alt="Floral Craftsmanship at Flower School Bangalore"
                className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-700"
              />
              
              {/* Content overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                <div className="absolute bottom-4 sm:bottom-6 left-4 sm:left-6 right-4 sm:right-6 text-white">
                  <h4 className="font-semibold text-lg sm:text-xl mb-1 sm:mb-2">Floral Artistry</h4>
                  <p className="text-xs sm:text-sm opacity-90">Handcrafted with passion and precision</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Mission statement */}
        <div className={`text-center py-8 sm:py-12 lg:py-16 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-pink-50 to-purple-50 rounded-2xl lg:rounded-3xl transition-all duration-1000 delay-900 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
          <div className="max-w-3xl mx-auto">
            <div className="mb-4 sm:mb-6">
              <span className="inline-flex items-center justify-center w-12 h-12 sm:w-16 sm:h-16 bg-gradient-to-br from-pink-500 to-purple-600 rounded-full mb-3 sm:mb-4">
                <Heart className="w-6 h-6 sm:w-8 sm:h-8 text-white" />
              </span>
            </div>
            <h3 className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900 mb-4 sm:mb-6">
              Our Mission: Cultivating Creative Excellence
            </h3>
            <p className="text-base sm:text-lg text-gray-700 leading-relaxed mb-6 sm:mb-8">
              We're committed to providing world-class floral education that combines technical mastery with artistic expression. Our goal is to empower every student to create breathtaking floral arrangements that tell stories and evoke emotions.
            </p>
            
            {/* Achievement stats */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mt-8 sm:mt-12">
              {achievements.map((achievement, index) => {
                const Icon = achievement.icon;
                return (
                  <div key={index} className="text-center">
                    <div className="bg-white rounded-xl lg:rounded-2xl p-3 sm:p-4 shadow-sm mb-2 sm:mb-3 hover:shadow-md transition-shadow duration-300">
                      <Icon className="w-4 h-4 sm:w-6 sm:h-6 text-pink-600 mx-auto mb-1 sm:mb-2" />
                      <div className="text-lg sm:text-xl lg:text-2xl font-bold text-gray-900">{achievement.number}</div>
                    </div>
                    <p className="text-xs sm:text-sm text-gray-600 px-1">{achievement.label}</p>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes float-slow {
          0%, 100% {
            transform: translateY(0px) rotate(0deg);
          }
          33% {
            transform: translateY(-10px) rotate(2deg);
          }
          66% {
            transform: translateY(5px) rotate(-1deg);
          }
        }
        .animate-float-slow {
          animation: float-slow 8s ease-in-out infinite;
        }
      `}</style>
    </section>
  );
}