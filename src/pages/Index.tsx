import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Users, Heart, Sparkles, ArrowRight, Mic, Shield, Zap, Moon, Sun } from "lucide-react";
import heroImage from "@/assets/hero-roommates.jpg";
import { useTheme } from "@/components/theme-provider";
import { useEffect, useRef } from "react";
import { motion, useInView, useAnimation, AnimatePresence } from "framer-motion";
import { TypeAnimation } from 'react-type-animation';

const Index = () => {
  const navigate = useNavigate();
  const { theme, setTheme } = useTheme();
  const mainRef = useRef(null);
  const isInView = useInView(mainRef, { once: true });
  const controls = useAnimation();

  const handleGetStarted = () => {
    navigate("/login");
  };

  const toggleTheme = () => {
    setTheme(theme === "dark" ? "light" : "dark");
  };

  // Animation triggers
  useEffect(() => {
    if (isInView) {
      controls.start("visible");
    }
  }, [isInView, controls]);

  // Floating particles effect
  useEffect(() => {
    const createParticle = () => {
      const particle = document.createElement('div');
      particle.className = `absolute text-xl opacity-70 ${
        theme === 'dark' ? 'text-purple-300' : 'text-primary'
      }`;
      
      const emojis = ['✨', '🌟', '💫', '🎉', '❤️', '🏠', '👯'];
      const emoji = emojis[Math.floor(Math.random() * emojis.length)];
      
      particle.innerHTML = emoji;
      particle.style.top = `${Math.random() * 100}%`;
      particle.style.left = `${Math.random() * 100}%`;
      particle.style.animation = `float ${Math.random() * 15 + 10}s ease-in-out ${Math.random() * 5}s infinite`;
      
      document.getElementById('particles-container')?.appendChild(particle);
      
      // Remove particle after animation completes to prevent DOM overload
      setTimeout(() => {
        particle.remove();
      }, (Math.random() * 20 + 20) * 1000);
    };

    // Create initial particles
    for (let i = 0; i < 20; i++) {
      createParticle();
    }

    // Continuous particle generation
    const interval = setInterval(createParticle, 2000);

    return () => clearInterval(interval);
  }, [theme]);

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        delayChildren: 0.3
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.5,
        ease: "easeOut"
      }
    }
  };

  const cardVariants = {
    hidden: { scale: 0.9, opacity: 0 },
    visible: {
      scale: 1,
      opacity: 1,
      transition: {
        duration: 0.5,
        ease: "backOut"
      }
    }
  };

  return (
    <div 
      className={`min-h-screen transition-colors duration-300 ${theme === 'dark' 
        ? 'bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900' 
        : 'bg-gradient-to-br from-primary-soft via-background to-primary-glow'} relative overflow-hidden`}
    >
      {/* Floating particles container */}
      <div id="particles-container" className="fixed inset-0 pointer-events-none z-0" />
      
      {/* Animated gradient background */}
      <div className={`fixed inset-0 z-0 ${
        theme === 'dark' 
          ? 'animate-gradient-dark' 
          : 'animate-gradient-light'
      }`} />

      {/* Theme toggle button with animation */}
      <motion.button 
        onClick={toggleTheme}
        className="fixed top-6 right-6 z-50 p-3 rounded-full bg-background/80 backdrop-blur-md shadow-lg hover:bg-accent transition-colors"
        aria-label="Toggle theme"
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
      >
        {theme === 'dark' ? (
          <Sun className="w-5 h-5" />
        ) : (
          <Moon className="w-5 h-5" />
        )}
      </motion.button>

      <div className="container mx-auto px-4 py-12 relative z-10" ref={mainRef}>
        {/* Hero Section */}
        <motion.div 
          className="text-center mb-16"
          initial="hidden"
          animate={controls}
          variants={containerVariants}
        >
          <motion.div 
            className={`inline-flex items-center gap-3 ${
              theme === 'dark' ? 'bg-gray-800/50' : 'bg-white/50'
            } rounded-full px-6 py-3 mb-8`}
            variants={itemVariants}
            whileHover={{ y: -5 }}
          >
            <div className={`w-8 h-8 rounded-full ${
              theme === 'dark' 
                ? 'bg-gradient-to-r from-purple-600 to-blue-500' 
                : 'bg-gradient-to-r from-primary to-primary-glow'
            } flex items-center justify-center`}>
              <Users className="w-4 h-4 text-white" />
            </div>
            <span className={`font-display font-bold text-xl ${
              theme === 'dark' ? 'text-white' : 'text-foreground'
            }`}>
              Roomee
            </span>
          </motion.div>
          
          <motion.h1 
            className={`text-5xl md:text-6xl font-display font-bold ${
              theme === 'dark' ? 'text-white' : 'text-foreground'
            } mb-6 leading-tight`}
            variants={itemVariants}
          >
            Find Your Perfect
            <br />
            <span className={`bg-gradient-to-r ${
              theme === 'dark' 
                ? 'from-purple-400 to-blue-400' 
                : 'from-primary to-primary-glow'
            } bg-clip-text text-transparent`}>
              <TypeAnimation
                sequence={[
                  'Roommate Match',
                  2000,
                  'Living Partner',
                  2000,
                  'Best Friend',
                  2000
                ]}
                wrapper="span"
                speed={50}
                repeat={Infinity}
              />
            </span>
          </motion.h1>
          
          <motion.p 
            className={`text-xl ${
              theme === 'dark' ? 'text-gray-300' : 'text-muted-foreground'
            } max-w-2xl mx-auto mb-8`}
            variants={itemVariants}
          >
            AI-powered roommate matching for twin-sharing accommodations. 
            Get matched with compatible roommates in just 3 simple steps.
          </motion.p>

          {/* Hero Image with parallax effect */}
          <motion.div 
            className={`${
              theme === 'dark' ? 'bg-gray-800/30' : 'bg-white/30'
            } backdrop-blur-md rounded-[32px] p-6 max-w-2xl mx-auto mb-12 shadow-xl`}
            variants={itemVariants}
            whileHover={{ scale: 1.02 }}
          >
            <motion.img 
              src={heroImage} 
              alt="Happy roommates celebrating perfect match" 
              className="w-full h-80 object-cover rounded-[24px] shadow-lg"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5, duration: 0.8 }}
            />
          </motion.div>

          <motion.div
            variants={itemVariants}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Button 
              onClick={handleGetStarted}
              className={`text-lg px-12 py-6 flex items-center gap-3 mx-auto ${
                theme === 'dark' 
                  ? 'bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700' 
                  : 'btn-primary'
              }`}
            >
              <Sparkles className="w-5 h-5" />
              Get Started Now
              <ArrowRight className="w-5 h-5" />
            </Button>
          </motion.div>
        </motion.div>

        {/* Features Section */}
        <motion.div 
          className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto mb-16"
          initial="hidden"
          animate={controls}
          variants={containerVariants}
        >
          {[
            {
              icon: <Mic className="w-8 h-8 text-white" />,
              title: "Voice AI Survey",
              description: "Answer just 5 questions using our natural voice AI to capture your preferences perfectly"
            },
            {
              icon: <Zap className="w-8 h-8 text-white" />,
              title: "Smart Matching",
              description: "Our AI analyzes compatibility across lifestyle, schedule, and personality factors"
            },
            {
              icon: <Shield className="w-8 h-8 text-white" />,
              title: "Safe & Verified",
              description: "Government ID verification and women-only accommodations ensure safety and trust"
            }
          ].map((feature, index) => (
            <motion.div 
              key={index}
              variants={cardVariants}
              whileHover={{ 
                y: -10,
                boxShadow: theme === 'dark' 
                  ? '0 10px 25px -5px rgba(124, 58, 237, 0.4)' 
                  : '0 10px 25px -5px rgba(59, 130, 246, 0.4)'
              }}
            >
              <Card 
                className={`p-8 text-center transition-all ${
                  theme === 'dark' 
                    ? 'bg-gray-800/50 border-gray-700 hover:border-purple-400' 
                    : 'bg-white/50 border-gray-200 hover:border-primary'
                }`}
              >
                <motion.div 
                  className={`w-16 h-16 rounded-full ${
                    theme === 'dark' 
                      ? 'bg-gradient-to-r from-purple-600 to-blue-500' 
                      : 'bg-gradient-to-r from-primary to-primary-glow'
                  } flex items-center justify-center mx-auto mb-6`}
                  whileHover={{ rotate: 360 }}
                  transition={{ duration: 0.5 }}
                >
                  {feature.icon}
                </motion.div>
                <h3 className={`text-xl font-display font-bold ${
                  theme === 'dark' ? 'text-white' : 'text-foreground'
                } mb-3`}>
                  {feature.title}
                </h3>
                <p className={theme === 'dark' ? 'text-gray-300' : 'text-muted-foreground'}>
                  {feature.description}
                </p>
              </Card>
            </motion.div>
          ))}
        </motion.div>

        {/* How It Works */}
        <motion.div 
          className="text-center"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        >
          <h2 className={`text-3xl font-display font-bold ${
            theme === 'dark' ? 'text-white' : 'text-foreground'
          } mb-12`}>
            How It Works
          </h2>
          
          <div className="flex flex-col md:flex-row items-center justify-center gap-8 max-w-3xl mx-auto">
            {[
              {
                step: "1",
                title: "Create Profile",
                description: "Tell us about yourself and verify your identity",
                icon: <Users className="w-6 h-6" />
              },
              {
                step: "2",
                title: "AI Survey",
                description: "Answer 5 questions using voice or text input",
                icon: <Mic className="w-6 h-6" />
              },
              {
                step: "3",
                title: "Get Matches",
                description: "View compatible roommates with match scores",
                icon: <Heart className="w-6 h-6" />
              }
            ].map((item, index) => (
              <motion.div 
                key={index}
                className="flex flex-col items-center text-center"
                initial={{ y: 50, opacity: 0 }}
                whileInView={{ y: 0, opacity: 1 }}
                transition={{ delay: index * 0.2, duration: 0.5 }}
                viewport={{ once: true }}
              >
                <motion.div 
                  className={`w-16 h-16 rounded-full ${
                    theme === 'dark' 
                      ? 'bg-gradient-to-r from-purple-600 to-blue-500' 
                      : 'bg-primary'
                  } text-white flex items-center justify-center font-bold text-lg mb-4`}
                  whileHover={{ scale: 1.1 }}
                >
                  {item.step}
                </motion.div>
                <h3 className={`font-semibold ${
                  theme === 'dark' ? 'text-white' : 'text-foreground'
                } mb-2 flex items-center gap-2`}>
                  {item.icon}
                  {item.title}
                </h3>
                <p className={`text-sm ${
                  theme === 'dark' ? 'text-gray-400' : 'text-muted-foreground'
                }`}>
                  {item.description}
                </p>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Testimonials Section */}
        <motion.div 
          className={`mt-24 py-12 ${
            theme === 'dark' ? 'bg-gray-800/30' : 'bg-white/30'
          } rounded-3xl backdrop-blur-md`}
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        >
          <h2 className={`text-3xl font-display font-bold text-center ${
            theme === 'dark' ? 'text-white' : 'text-foreground'
          } mb-12`}>
            What Our Users Say
          </h2>
          <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto px-8">
            {[
              {
                quote: "Found my perfect roommate in just 2 days! We've been living together for 6 months now.",
                author: "Priya K., Bangalore",
                avatar: "👩"
              },
              {
                quote: "The AI matching is scarily accurate. My roommate and I have so much in common!",
                author: "Rahul M., Delhi",
                avatar: "👨"
              },
              {
                quote: "As a woman living alone, the verification system made me feel safe and comfortable.",
                author: "Ananya S., Mumbai",
                avatar: "👩‍💼"
              }
            ].map((testimonial, index) => (
              <motion.div 
                key={index}
                className="text-center"
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.2, duration: 0.5 }}
                viewport={{ once: true }}
              >
                <div className={`p-6 rounded-2xl mb-4 ${
                  theme === 'dark' ? 'bg-gray-700/50' : 'bg-white'
                } shadow-lg h-full flex flex-col`}>
                  <motion.div 
                    className="text-4xl mb-4"
                    animate={{ 
                      rotate: [0, 10, -10, 0],
                      scale: [1, 1.1, 1.1, 1]
                    }}
                    transition={{ 
                      duration: 2,
                      repeat: Infinity,
                      repeatType: "reverse"
                    }}
                  >
                    {testimonial.avatar}
                  </motion.div>
                  <Heart className={`w-8 h-8 mx-auto mb-4 ${
                    theme === 'dark' ? 'text-purple-400' : 'text-primary'
                  }`} />
                  <p className={`italic mb-4 ${
                    theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
                  }`}>
                    "{testimonial.quote}"
                  </p>
                  <p className={`font-semibold mt-auto ${
                    theme === 'dark' ? 'text-purple-300' : 'text-primary'
                  }`}>
                    {testimonial.author}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Final CTA */}
        <motion.div 
          className="text-center mt-24"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        >
          <h2 className={`text-3xl font-display font-bold ${
            theme === 'dark' ? 'text-white' : 'text-foreground'
          } mb-6`}>
            Ready to Find Your Perfect Roommate?
          </h2>
          <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Button 
              onClick={handleGetStarted}
              className={`text-lg px-12 py-6 flex items-center gap-3 mx-auto mt-6 ${
                theme === 'dark' 
                  ? 'bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700' 
                  : 'btn-primary'
              }`}
            >
              <Sparkles className="w-5 h-5" />
              Get Started Now - It's Free!
              <ArrowRight className="w-5 h-5" />
            </Button>
          </motion.div>
        </motion.div>
      </div>

      {/* Footer */}
      <motion.footer 
        className={`py-8 ${
          theme === 'dark' ? 'bg-gray-900/50' : 'bg-white/50'
        } backdrop-blur-md mt-24`}
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        viewport={{ once: true }}
      >
        <div className="container mx-auto px-4 text-center">
          <p className={theme === 'dark' ? 'text-gray-400' : 'text-muted-foreground'}>
            © {new Date().getFullYear()} Roomee. All rights reserved.
          </p>
        </div>
      </motion.footer>

      {/* Floating action button */}
      <motion.button 
        onClick={handleGetStarted}
        className={`fixed bottom-8 right-8 z-50 p-4 rounded-full shadow-lg ${
          theme === 'dark' 
            ? 'bg-gradient-to-r from-purple-600 to-blue-600' 
            : 'bg-gradient-to-r from-primary to-primary-glow'
        }`}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        animate={{
          scale: [1, 1.1, 1],
          boxShadow: [
            '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
            '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
            '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)'
          ]
        }}
        transition={{
          duration: 2,
          repeat: Infinity,
          repeatType: "reverse"
        }}
      >
        <Sparkles className="w-6 h-6 text-white" />
      </motion.button>
    </div>
  );
};

export default Index;