import { Truck, GraduationCap, Clock, Award } from "lucide-react";
import { useState, useEffect, useRef } from "react";
import WhyChooseImage from "../images/WhyChoose.jpg";

export default function WhyChooseUs() {
  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.3 }
    );

    if (sectionRef.current) observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, []);

  const features = [
    {
      icon: Truck,
      title: "Fresh Flowers Guarantee",
      description: "Direct imports and local sourcing ensure maximum freshness and longevity",
      color: "text-primary",
      bgColor: "bg-primary/10",
      side: "left",
    },
    {
      icon: GraduationCap,
      title: "Expert Trainers",
      description: "Learn from certified professionals with international experience",
      color: "text-secondary",
      bgColor: "bg-secondary/10",
      side: "right",
    },
    {
      icon: Clock,
      title: "Fast Delivery",
      description: "Same-day delivery across Bengaluru with temperature-controlled transport",
      color: "text-primary",
      bgColor: "bg-primary/10",
      side: "left",
    },
    {
      icon: Award,
      title: "International Certification",
      description: "Globally recognized certificates to advance your floral design career",
      color: "text-secondary",
      bgColor: "bg-secondary/10",
      side: "right",
    },
  ];

  return (
<section 
  ref={sectionRef} 

>


      {/* Header */}
      <div className="text-center mb-16">
        <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
          Why Choose Bouquet Bar?
        </h2>
        <p className="text-lg md:text-xl text-gray-600">
          Experience the difference with our premium services
        </p>
      </div>

      {/* Features and Image Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 items-center gap-12 max-w-6xl mx-auto px-6">
        {/* Left Features */}
        <div className="space-y-16">
          {features.filter(f => f.side === "left").map((feature, i) => (
            <div
              key={i}
              className={`flex items-center justify-end gap-4 text-right transition-all duration-700 ${
                isVisible ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-8"
              }`}
              style={{ transitionDelay: `${i * 200}ms` }}
            >
              <div>
                <h3 className="text-xl font-semibold">{feature.title}</h3>
                <p className="text-gray-600">{feature.description}</p>
              </div>
              <div className={`w-16 h-16 ${feature.bgColor} rounded-full flex items-center justify-center`}>
                <feature.icon className={`w-8 h-8 ${feature.color}`} />
              </div>
            </div>
          ))}
        </div>

        {/* Center Image */}
        <div className="flex justify-center">
          <img
            src={WhyChooseImage}
            alt="Why Choose Bouquet Bar"
            className={` h-90 w-110 object-cover rounded-2xl shadow-xl transition-all duration-1000 ${
              isVisible ? "scale-100 opacity-100" : "scale-90 opacity-0"
            }`}
          />
        </div>

        {/* Right Features */}
        <div className="space-y-16">
          {features.filter(f => f.side === "right").map((feature, i) => (
            <div
              key={i}
              className={`flex items-center gap-4 transition-all duration-700 ${
                isVisible ? "opacity-100 translate-x-0" : "opacity-0 translate-x-8"
              }`}
              style={{ transitionDelay: `${i * 200}ms` }}
            >
              <div className={`w-16 h-16 ${feature.bgColor} rounded-full flex items-center justify-center`}>
                <feature.icon className={`w-8 h-8 ${feature.color}`} />
              </div>
              <div>
                <h3 className="text-xl font-semibold">{feature.title}</h3>
                <p className="text-gray-600">{feature.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
