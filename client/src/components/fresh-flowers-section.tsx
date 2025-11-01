import { useEffect, useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { motion, useAnimation, AnimatePresence } from "framer-motion";
import { useInView } from "react-intersection-observer";
import { X, Mail, Check, Flower, Users, Award, Heart } from "lucide-react";
import freshFlower from "../images/pexels-ameliacui-134530801.jpg";
import { apiRequest } from "@/lib/queryClient";
import logo from "@assets/E_Commerce_Bouquet_Bar_Logo_1757433847861.png";
// FrontCard Component
function FrontCard({ isVisible, onClose, onSubscribe }: {
  isVisible: boolean;
  onClose: () => void;
  onSubscribe: (email: string) => void;
}) {
  const [email, setEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  // In your FreshFlowersSection file, update the FrontCard component inside it
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;

    setIsSubmitting(true);

    try {
      // Call your API endpoint
      await apiRequest('/api/landing/email', {
        method: 'POST',
        body: JSON.stringify({ email })
      });

      onSubscribe(email);
      setIsSubmitted(true);

      // Auto close after 3 seconds
      setTimeout(() => {
        onClose();
        setIsSubmitted(false);
        setEmail("");
      }, 3000);

    } catch (error) {
      console.error('Subscription failed:', error);
      // Handle error (show error message to user)
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    onClose();
    setIsSubmitted(false);
    setEmail("");
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <motion.div
            initial={{ opacity: 0, scale: 0.8, y: 50 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: 50 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            className="w-full max-w-md"
          >
            <Card className="relative overflow-hidden border-0 shadow-2xl bg-gradient-to-br from-white to-pink-50/30">
              {/* Decorative elements */}
              <div className="absolute top-0 right-0 w-32 h-32 bg-pink-200/20 rounded-full -translate-y-16 translate-x-16"></div>
              <div className="absolute bottom-0 left-0 w-24 h-24 bg-purple-200/20 rounded-full -translate-x-12 translate-y-12"></div>


              <CardHeader className="text-center relative z-10 pb-4">
                <button
                  onClick={handleClose}
                  className="absolute top-4 right-4 p-1 rounded-full hover:bg-gray-100 transition-colors duration-200"
                >
                  <X className="h-4 w-4 text-gray-500" />
                </button>

                <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-sm">
                  <img src={logo} alt="Blossom Studio Logo" className="w-12 h-12 object-contain" />
                </div>


                <CardTitle className="text-2xl font-bold text-gray-900">
                  {isSubmitted ? "Welcome to Blossom Studio! 🌸" : "Get Flower Updates!"}
                </CardTitle>
                <p className="text-gray-600 mt-2">
                  {isSubmitted
                    ? "Thank you for subscribing! You'll receive our latest floral updates soon."
                    : "Subscribe to get exclusive flower tips, class updates, and special offers."
                  }
                </p>
              </CardHeader>

              <CardContent className="relative z-10 px-6 pb-6">
                {!isSubmitted ? (
                  <form onSubmit={handleSubmit} className="space-y-5">
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                      <Input
                        type="email"
                        placeholder="Enter your email address"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="pl-10 pr-4 py-3 border-gray-300 focus:border-pink-500 focus:ring-pink-500 rounded-xl"
                        required
                        disabled={isSubmitting}
                      />
                    </div>

                    <Button
                      type="submit"
                      disabled={isSubmitting || !email.trim()}
                      className="w-full bg-gradient-to-r from-pink-500 to-purple-500 hover:from-pink-600 hover:to-purple-600 text-white font-semibold py-3 px-4 rounded-xl transition-all duration-300 transform hover:scale-105"
                    >
                      {isSubmitting ? (
                        <div className="flex items-center gap-2">
                          <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                          Subscribing...
                        </div>
                      ) : (
                        "Subscribe Now"
                      )}
                    </Button>

                    <p className="text-xs text-gray-500 text-center">
                      No spam, unsubscribe at any time
                    </p>
                  </form>
                ) : (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="text-center py-4"
                  >
                    <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      <Check className="h-8 w-8 text-green-600" />
                    </div>
                    <p className="text-green-600 font-semibold">
                      Successfully subscribed!
                    </p>
                    <p className="text-sm text-gray-600 mt-1">
                      Closing in 3 seconds...
                    </p>
                  </motion.div>
                )}
              </CardContent>
            </Card>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}

export default function FreshFlowersSection() {
  const [showFrontCard, setShowFrontCard] = useState(false);
  const controls = useAnimation();
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.2,
  });

  useEffect(() => {
    if (inView) {
      controls.start("visible");
      const timer = setTimeout(() => {
        setShowFrontCard(true);
      }, 2000);

      return () => clearTimeout(timer);
    }
  }, [inView, controls]);

  const text = "Fresh Flowers & Professional Floral Education";

  const gradientStart = text.indexOf("&");
  const gradientEnd = text.indexOf("Floral") + "Floral".length;

  const handleSubscribe = (email: string) => {
    console.log("Subscribed with email:", email);
  };

  const stats = [
    { icon: Users, value: "500+", label: "Students Trained" },
    { icon: Award, value: "15+", label: "Years Experience" },
    { icon: Heart, value: "1000+", label: "Happy Customers" }
  ];

  return (
    <>
      <section
        ref={ref}
        className="py-24 md:py-32 bg-gradient-to-br from-white via-pink-50/20 to-purple-50/10 overflow-hidden relative"
      >
        {/* Background decorative elements */}
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
          <div className="absolute -top-20 -left-20 w-72 h-72 bg-pink-100/30 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute top-1/3 -right-20 w-96 h-96 bg-purple-100/40 rounded-full blur-3xl animate-pulse delay-1000"></div>
          <div className="absolute bottom-0 left-1/4 w-80 h-80 bg-rose-100/30 rounded-full blur-3xl animate-pulse delay-2000"></div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid lg:grid-cols-2 gap-16 lg:gap-24 items-center">
            {/* LEFT TEXT SECTION */}
            <div className="space-y-10 lg:pr-8">
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={controls}
                variants={{
                  visible: {
                    opacity: 1,
                    y: 0,
                    transition: { delay: 0.2 },
                  },
                }}
              >
                <Badge
                  variant="secondary"
                  className="inline-flex items-center gap-2 text-sm font-medium mb-8 bg-pink-50 border-0 px-6 py-3 rounded-full shadow-sm"
                >
                  <div className="w-2 h-2 bg-pink-500 rounded-full animate-ping"></div>
                  India's Premier Floral Institute
                </Badge>
              </motion.div>

              {/* Animated heading */}
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-playfair font-bold leading-tight">
                {text.split(" ").map((word, i) => {
                  const wordStart = text.indexOf(word);
                  const wordEnd = wordStart + word.length;
                  const isGradient =
                    wordStart >= gradientStart && wordEnd <= gradientEnd;

                  return (
                    <motion.span
                      key={i}
                      initial={{ opacity: 0, y: 30 }}
                      animate={controls}
                      variants={{
                        visible: {
                          opacity: 1,
                          y: 0,
                          transition: { delay: i * 0.1 },
                        },
                      }}
                      className={
                        isGradient
                          ? "bg-clip-text text-transparent bg-gradient-to-r from-pink-600 to-purple-600 inline-block mr-3"
                          : "inline-block text-gray-900 mr-3"
                      }
                    >
                      {word}
                    </motion.span>
                  );
                })}
              </h1>

              <motion.p
                initial={{ opacity: 0, y: 30 }}
                animate={controls}
                variants={{
                  visible: {
                    opacity: 1,
                    y: 0,
                    transition: { delay: 0.8 },
                  },
                }}
                className="text-lg sm:text-xl text-gray-600 leading-relaxed max-w-xl font-light"
              >
                Transform your passion for flowers into expertise. Shop premium
                flowers and master the art of floral design with India's leading
                institute.
              </motion.p>

              {/* Stats */}
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={controls}
                variants={{
                  visible: {
                    opacity: 1,
                    y: 0,
                    transition: { delay: 1.2 },
                  },
                }}
                className="grid grid-cols-3 gap-6 lg:gap-8 py-8"
              >
                {stats.map((stat, index) => (
                  <div key={index} className="text-center p-4 bg-white/60 rounded-2xl backdrop-blur-sm border border-pink-100 hover:shadow-lg transition-all duration-300">
                    <div className="flex justify-center mb-3">
                      <div className="p-2 bg-pink-100 rounded-xl">
                        <stat.icon className="h-5 w-5 text-pink-600" />
                      </div>
                    </div>
                    <div className="text-xl lg:text-2xl font-bold text-pink-600 mb-2">
                      {stat.value}
                    </div>
                    <div className="text-xs lg:text-sm text-gray-600 font-medium">
                      {stat.label}
                    </div>
                  </div>
                ))}
              </motion.div>

              {/* CTA Button */}
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={controls}
                variants={{
                  visible: {
                    opacity: 1,
                    y: 0,
                    transition: { delay: 1.5 },
                  },
                }}
                className="flex flex-col sm:flex-row gap-4 lg:gap-6 pt-6"
              >
                <Button
                  onClick={() => setShowFrontCard(true)}
                  className="bg-gradient-to-r from-pink-500 to-purple-500 hover:from-pink-600 hover:to-purple-600 text-white px-8 py-4 rounded-full font-semibold transform hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-xl text-base"
                >
                  <Mail className="h-5 w-5 mr-2" />
                  Get Flower Updates
                </Button>
                <a
                  href="https://app.flowerschoolbengaluru.com/classes"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <Button
                    variant="outline"
                    className="border-2 border-pink-300 text-pink-600 hover:bg-pink-50 hover:border-pink-400 px-8 py-4 rounded-full font-semibold transform hover:scale-105 transition-all duration-300 text-base"
                  >
                    Explore Classes
                  </Button>
                </a>
              </motion.div>
            </div>

            {/* RIGHT IMAGE */}
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              animate={controls}
              variants={{
                visible: {
                  opacity: 1,
                  x: 0,
                  transition: { delay: 0.5 },
                },
              }}
              className="relative lg:pl-8"
            >
              <div className="relative overflow-hidden rounded-3xl shadow-2xl group">
                <img
                  src={freshFlower}
                  alt="Professional floral design students learning flower arrangement"
                  className="w-full object-cover h-[450px] sm:h-[500px] lg:h-[600px] transform transition-all duration-700 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                {/* Floating decorative elements */}
                <div className="absolute top-6 left-6 w-8 h-8 bg-pink-400/30 rounded-full blur-sm animate-float-slow"></div>
                <div className="absolute top-1/3 right-8 w-6 h-6 bg-purple-400/30 rounded-full blur-sm animate-float-medium delay-1000"></div>
                <div className="absolute bottom-1/4 left-8 w-10 h-10 bg-blue-400/20 rounded-full blur-sm animate-float-slow delay-700"></div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* FrontCard Component */}
      <FrontCard
        isVisible={showFrontCard}
        onClose={() => setShowFrontCard(false)}
        onSubscribe={handleSubscribe}
      />

      {/* Custom animations */}
      <style jsx>{`
        @keyframes float-slow {
          0%, 100% {
            transform: translateY(0px) rotate(0deg);
          }
          33% {
            transform: translateY(-15px) rotate(2deg);
          }
          66% {
            transform: translateY(8px) rotate(-1deg);
          }
        }
        @keyframes float-medium {
          0%, 100% {
            transform: translateY(0px) rotate(0deg);
          }
          50% {
            transform: translateY(-12px) rotate(1deg);
          }
        }
        .animate-float-slow {
          animation: float-slow 6s ease-in-out infinite;
        }
        .animate-float-medium {
          animation: float-medium 4s ease-in-out infinite;
        }
      `}</style>
    </>
  );
}