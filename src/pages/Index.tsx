import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Users, Heart, Sparkles, ArrowRight, Mic, Shield, Zap, Moon, Sun } from "lucide-react";
import heroImage from "@/assets/hero-roommates.jpg";
import { useTheme } from "@/components/theme-provider";
import { useEffect } from "react";

const Index = () => {
  const navigate = useNavigate();
  const { theme, setTheme } = useTheme();

  const handleGetStarted = () => {
    navigate("/login");
  };

  const toggleTheme = () => {
    setTheme(theme === "dark" ? "light" : "dark");
  };

  // Add floating particles effect
  useEffect(() => {
    const particles = document.querySelectorAll('.floating-particle');
    particles.forEach(particle => {
      const duration = Math.random() * 15 + 10;
      const delay = Math.random() * 5;
      particle.style.animation = `float ${duration}s ease-in-out ${delay}s infinite`;
    });
  }, []);

  return (
    <div className={`min-h-screen transition-colors duration-300 ${theme === 'dark' 
      ? 'bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900' 
      : 'bg-gradient-to-br from-primary-soft via-background to-primary-glow'} relative overflow-hidden`}>
      
      {/* Theme toggle button */}
      <button 
        onClick={toggleTheme}
        className="fixed top-6 right-6 z-50 p-2 rounded-full bg-background/80 backdrop-blur-md shadow-lg hover:bg-accent transition-colors"
        aria-label="Toggle theme"
      >
        {theme === 'dark' ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
      </button>

      {/* Floating decorations */}
      {['✨', '🌟', '💫', '🎉'].map((emoji, i) => (
        <div 
          key={i}
          className="floating-particle absolute text-xl opacity-70"
          style={{
            top: `${Math.random() * 80 + 10}%`,
            left: `${Math.random() * 80 + 10}%`,
            animationDelay: `${i * 2}s`
          }}
        >
          {emoji}
        </div>
      ))}

      <div className="container mx-auto px-4 py-12 relative z-10">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <div className={`inline-flex items-center gap-3 ${theme === 'dark' ? 'bg-gray-800/50' : 'bg-white/50'} rounded-full px-6 py-3 mb-8 animate-bounce`}>
            <div className={`w-8 h-8 rounded-full ${theme === 'dark' 
              ? 'bg-gradient-to-r from-purple-600 to-blue-500' 
              : 'bg-gradient-to-r from-primary to-primary-glow'} flex items-center justify-center`}>
              <Users className="w-4 h-4 text-white" />
            </div>
            <span className={`font-display font-bold text-xl ${theme === 'dark' ? 'text-white' : 'text-foreground'} animate-pulse`}>
              Roomee
            </span>
          </div>
          
          <h1 className={`text-5xl md:text-6xl font-display font-bold ${theme === 'dark' ? 'text-white' : 'text-foreground'} mb-6 leading-tight`}>
            Find Your Perfect
            <br />
            <span className={`bg-gradient-to-r ${theme === 'dark' 
              ? 'from-purple-400 to-blue-400' 
              : 'from-primary to-primary-glow'} bg-clip-text text-transparent`}>
              Roommate Match
            </span>
          </h1>
          
          <p className={`text-xl ${theme === 'dark' ? 'text-gray-300' : 'text-muted-foreground'} max-w-2xl mx-auto mb-8`}>
            AI-powered roommate matching for twin-sharing accommodations. 
            Get matched with compatible roommates in just 3 simple steps.
          </p>

          {/* Hero Image */}
          <div className={`${theme === 'dark' ? 'bg-gray-800/30' : 'bg-white/30'} backdrop-blur-md rounded-[32px] p-6 max-w-2xl mx-auto mb-12 shadow-xl`}>
            <img 
              src={heroImage} 
              alt="Happy roommates celebrating perfect match" 
              className="w-full h-80 object-cover rounded-[24px] shadow-lg"
            />
          </div>

          <Button 
            onClick={handleGetStarted}
            className={`text-lg px-12 py-6 flex items-center gap-3 mx-auto transition-all hover:scale-105 ${
              theme === 'dark' 
                ? 'bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700' 
                : 'btn-primary'
            }`}
          >
            <Sparkles className="w-5 h-5" />
            Get Started Now
            <ArrowRight className="w-5 h-5" />
          </Button>
        </div>

        {/* Features Section */}
        <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto mb-16">
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
            <Card 
              key={index}
              className={`p-8 text-center transition-all hover:scale-105 ${theme === 'dark' 
                ? 'bg-gray-800/50 border-gray-700 hover:border-purple-400' 
                : 'bg-white/50 border-gray-200 hover:border-primary'}`}
            >
              <div className={`w-16 h-16 rounded-full ${theme === 'dark' 
                ? 'bg-gradient-to-r from-purple-600 to-blue-500' 
                : 'bg-gradient-to-r from-primary to-primary-glow'} flex items-center justify-center mx-auto mb-6`}>
                {feature.icon}
              </div>
              <h3 className={`text-xl font-display font-bold ${theme === 'dark' ? 'text-white' : 'text-foreground'} mb-3`}>
                {feature.title}
              </h3>
              <p className={theme === 'dark' ? 'text-gray-300' : 'text-muted-foreground'}>
                {feature.description}
              </p>
            </Card>
          ))}
        </div>

        {/* How It Works */}
        <div className="text-center">
          <h2 className={`text-3xl font-display font-bold ${theme === 'dark' ? 'text-white' : 'text-foreground'} mb-12`}>
            How It Works
          </h2>
          
          <div className="flex flex-col md:flex-row items-center justify-center gap-8 max-w-3xl mx-auto">
            {[
              {
                step: "1",
                title: "Create Profile",
                description: "Tell us about yourself and verify your identity"
              },
              {
                step: "2",
                title: "AI Survey",
                description: "Answer 5 questions using voice or text input"
              },
              {
                step: "3",
                title: "Get Matches",
                description: "View compatible roommates with match scores"
              }
            ].map((item, index) => (
              <div key={index} className="flex flex-col items-center text-center">
                <div className={`w-12 h-12 rounded-full ${theme === 'dark' 
                  ? 'bg-gradient-to-r from-purple-600 to-blue-500' 
                  : 'bg-primary'} text-white flex items-center justify-center font-bold text-lg mb-4`}>
                  {item.step}
                </div>
                <h3 className={`font-semibold ${theme === 'dark' ? 'text-white' : 'text-foreground'} mb-2`}>
                  {item.title}
                </h3>
                <p className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-muted-foreground'}`}>
                  {item.description}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Testimonials Section */}
        <div className={`mt-24 py-12 ${theme === 'dark' ? 'bg-gray-800/30' : 'bg-white/30'} rounded-3xl backdrop-blur-md`}>
          <h2 className={`text-3xl font-display font-bold text-center ${theme === 'dark' ? 'text-white' : 'text-foreground'} mb-12`}>
            What Our Users Say
          </h2>
          <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto px-8">
            {[
              {
                quote: "Found my perfect roommate in just 2 days! We've been living together for 6 months now.",
                author: "Priya K., Bangalore"
              },
              {
                quote: "The AI matching is scarily accurate. My roommate and I have so much in common!",
                author: "Rahul M., Delhi"
              },
              {
                quote: "As a woman living alone, the verification system made me feel safe and comfortable.",
                author: "Ananya S., Mumbai"
              }
            ].map((testimonial, index) => (
              <div key={index} className="text-center">
                <div className={`p-6 rounded-2xl mb-4 ${theme === 'dark' ? 'bg-gray-700/50' : 'bg-white'} shadow-lg`}>
                  <Heart className={`w-8 h-8 mx-auto mb-4 ${theme === 'dark' ? 'text-purple-400' : 'text-primary'}`} />
                  <p className={`italic mb-4 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
                    "{testimonial.quote}"
                  </p>
                  <p className={`font-semibold ${theme === 'dark' ? 'text-purple-300' : 'text-primary'}`}>
                    {testimonial.author}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Final CTA */}
        <div className="text-center mt-24">
          <h2 className={`text-3xl font-display font-bold ${theme === 'dark' ? 'text-white' : 'text-foreground'} mb-6`}>
            Ready to Find Your Perfect Roommate?
          </h2>
          <Button 
            onClick={handleGetStarted}
            className={`text-lg px-12 py-6 flex items-center gap-3 mx-auto mt-6 transition-all hover:scale-105 ${
              theme === 'dark' 
                ? 'bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700' 
                : 'btn-primary'
            }`}
          >
            <Sparkles className="w-5 h-5" />
            Get Started Now - It's Free!
            <ArrowRight className="w-5 h-5" />
          </Button>
        </div>
      </div>

      {/* Footer */}
      <footer className={`py-8 ${theme === 'dark' ? 'bg-gray-900/50' : 'bg-white/50'} backdrop-blur-md mt-24`}>
        <div className="container mx-auto px-4 text-center">
          <p className={theme === 'dark' ? 'text-gray-400' : 'text-muted-foreground'}>
            © {new Date().getFullYear()} Roomee. All rights reserved.
          </p>
        </div>
      </footer>

      {/* Floating action button */}
      <button 
        onClick={handleGetStarted}
        className={`fixed bottom-8 right-8 z-50 p-4 rounded-full shadow-lg transition-all hover:scale-110 ${
          theme === 'dark' 
            ? 'bg-gradient-to-r from-purple-600 to-blue-600' 
            : 'bg-gradient-to-r from-primary to-primary-glow'
        }`}
      >
        <Sparkles className="w-6 h-6 text-white" />
      </button>
    </div>
  );
};

export default Index;