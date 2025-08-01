import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Users, Heart, Sparkles, ArrowRight, Mic, Shield, Zap, Moon, Sun, Star, Smile, Facebook, Twitter, Instagram } from "lucide-react";
import heroImage from "@/assets/hero-roommates.jpg";
import twinRoomImage from "@/assets/twin-room-mockup.jpg";
import { useTheme } from "@/components/theme-provider";
import { useEffect, useState } from "react";

const Index = () => {
  const navigate = useNavigate();
  const { theme, setTheme } = useTheme();

  const handleGetStarted = () => {
    navigate("/login");
  };

  const toggleTheme = () => {
    setTheme(theme === "dark" ? "light" : "dark");
  };

  // Live match counter (demo)
  const [matchCount, setMatchCount] = useState(1200);
  // Add floating particles effect
  useEffect(() => {
    const particles = document.querySelectorAll('.floating-particle');
    particles.forEach(particle => {
      const duration = Math.random() * 15 + 10;
      const delay = Math.random() * 5;
      // TypeScript fix: cast to HTMLElement
      (particle as HTMLElement).style.animation = `float ${duration}s ease-in-out ${delay}s infinite`;
    });
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setMatchCount((c) => c + Math.floor(Math.random() * 3));
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className={`min-h-screen transition-colors duration-300 ${theme === 'dark' 
      ? 'bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900' 
      : 'bg-gradient-to-br from-pink-200 via-purple-100 to-blue-100'} relative overflow-hidden`}>
      {/* Animated gradient background shapes - more bubbles! */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        <div className="absolute top-[-80px] left-[-80px] w-72 h-72 bg-gradient-to-br from-pink-400 to-purple-400 rounded-full opacity-30 animate-spin-slow" />
        <div className="absolute bottom-[-60px] right-[-60px] w-56 h-56 bg-gradient-to-br from-blue-400 to-pink-300 rounded-full opacity-20 animate-pulse" />
        <div className="absolute top-1/2 left-1/3 w-32 h-32 bg-gradient-to-br from-purple-300 to-blue-200 rounded-full opacity-20 animate-bounce" />
        {/* Extra bubbles */}
        <div className="absolute top-24 left-1/4 w-24 h-24 bg-gradient-to-br from-pink-200 to-purple-200 rounded-full opacity-20 animate-bounce-slow" />
        <div className="absolute bottom-32 right-1/3 w-20 h-20 bg-gradient-to-br from-blue-200 to-pink-200 rounded-full opacity-20 animate-spin-slow" />
        <div className="absolute top-1/3 right-1/4 w-16 h-16 bg-gradient-to-br from-purple-300 to-pink-300 rounded-full opacity-20 animate-bounce" />
        <div className="absolute bottom-1/4 left-1/5 w-28 h-28 bg-gradient-to-br from-pink-300 to-blue-200 rounded-full opacity-10 animate-pulse" />
        <div className="absolute top-1/5 right-1/6 w-14 h-14 bg-gradient-to-br from-blue-300 to-purple-200 rounded-full opacity-10 animate-bounce-slow" />
      </div>
      
      {/* Theme toggle button */}
      <button 
        onClick={toggleTheme}
        className="fixed top-6 right-6 z-50 p-2 rounded-full bg-background/80 backdrop-blur-md shadow-lg hover:bg-accent transition-colors"
        aria-label="Toggle theme"
      >
        {theme === 'dark' ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
      </button>

      {/* Floating decorations - more emojis! */}
      {["✨", "🌟", "💫", "🎉", "🏆", "👭", "🏠", "🪐", "💎", "🍀", "🦄", "🌈", "🎈", "🧸"].map((emoji, i) => (
        <div 
          key={i}
          className="floating-particle absolute text-2xl opacity-70 animate-float"
          style={{
            top: `${10 + (i % 7) * 12}%`,
            left: `${8 + (i * 7) % 80}%`,
            animationDelay: `${i * 1.2}s`
          }}
        >
          {emoji}
        </div>
      ))}

      <div className="container mx-auto px-4 py-12 relative z-10">
        {/* Hero Section */}
        <div className="text-center mb-16 animate-fade-in">
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
          
          <h1 className={`text-5xl md:text-6xl font-display font-bold ${theme === 'dark' ? 'text-white' : 'text-foreground'} mb-6 leading-tight drop-shadow-lg`}>
            Find Your Perfect
            <br />
            <span className={`bg-gradient-to-r ${theme === 'dark' 
              ? 'from-purple-400 to-blue-400' 
              : 'from-pink-500 via-purple-500 to-blue-500'} bg-clip-text text-transparent animate-gradient-move`}>
              Roommate Match
            </span>
          </h1>
          
          <p className={`text-xl ${theme === 'dark' ? 'text-gray-300' : 'text-muted-foreground'} max-w-2xl mx-auto mb-8 animate-fade-in`}>
            AI-powered roommate matching for twin-sharing accommodations.<br />
            <span className="font-semibold text-pink-500 dark:text-purple-300">Get matched with compatible roommates in just 3 simple steps.</span>
          </p>
          {/* Live Match Counter */}
          <div className="flex justify-center items-center gap-2 mb-8 animate-fade-in">
            <Star className="w-6 h-6 text-yellow-400 animate-bounce" />
            <span className="text-2xl font-bold text-pink-600 dark:text-purple-300">{matchCount.toLocaleString()}</span>
            <span className="text-lg text-gray-500 dark:text-gray-300">matches made so far!</span>
          </div>
          {/* Featured Roommates Carousel */}
          <div className="mb-12 max-w-2xl mx-auto">
            <div className="flex gap-4 overflow-x-auto pb-2 hide-scrollbar">
              {[{
                name: "Priya K.",
                bio: "Loves yoga, early riser, foodie",
                img: heroImage
              }, {
                name: "Rahul M.",
                bio: "Techie, gamer, night owl",
                img: twinRoomImage
              }, {
                name: "Ananya S.",
                bio: "Artist, bookworm, neat freak",
                img: heroImage
              }].map((roommate, idx) => (
                <div key={idx} className="min-w-[180px] bg-white dark:bg-pink-900 rounded-2xl shadow-lg p-4 flex flex-col items-center animate-fade-in">
                  <img src={roommate.img} alt={roommate.name} className="w-16 h-16 rounded-full object-cover mb-2 border-4 border-pink-300 dark:border-purple-400" />
                  <div className="font-bold text-pink-600 dark:text-purple-200">{roommate.name}</div>
                  <div className="text-sm text-gray-500 dark:text-gray-300">{roommate.bio}</div>
                </div>
              ))}
            </div>
          </div>
        {/* Why Choose Us Section */}
        <div className="mb-16 max-w-4xl mx-auto animate-fade-in">
          <h2 className={`text-2xl font-bold text-center mb-8 ${theme === 'dark' ? 'text-white' : 'text-pink-700'}`}>Why Choose Roomee?</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[{
              icon: <Smile className="w-8 h-8 text-pink-500 dark:text-purple-300" />,
              title: "Friendly Community",
              desc: "Connect with like-minded people and make lifelong friends."
            }, {
              icon: <Shield className="w-8 h-8 text-pink-500 dark:text-purple-300" />,
              title: "Verified & Safe",
              desc: "ID verification and women-only options for peace of mind."
            }, {
              icon: <Zap className="w-8 h-8 text-pink-500 dark:text-purple-300" />,
              title: "Instant Matching",
              desc: "Get matches instantly with our smart AI."
            }].map((item, idx) => (
              <div key={idx} className="bg-white dark:bg-pink-900 rounded-2xl shadow-lg p-6 text-center animate-fade-in">
                <div className="mb-4">{item.icon}</div>
                <div className="font-bold text-lg mb-2">{item.title}</div>
                <div className="text-gray-500 dark:text-gray-300 text-sm">{item.desc}</div>
              </div>
            ))}
          </div>
        </div>
        {/* Newsletter Signup */}
        <div className="max-w-xl mx-auto mb-16 text-center animate-fade-in">
          <h2 className="text-xl font-bold mb-2 text-pink-600 dark:text-purple-200">Stay Updated!</h2>
          <p className="mb-4 text-gray-500 dark:text-gray-300">Sign up for our newsletter to get the latest roommate tips and updates.</p>
          <form className="flex gap-2 justify-center">
            <input type="email" placeholder="Your email" className="p-3 rounded-xl border-2 border-pink-300 dark:border-purple-400 bg-pink-50 dark:bg-pink-950 text-pink-700 dark:text-pink-200 focus:outline-none" required />
            <Button type="submit" className="bg-pink-600 text-white px-6 py-2 rounded-xl hover:bg-pink-700 dark:bg-pink-800 font-bold shadow-lg transition-all duration-200">Subscribe</Button>
          </form>
        </div>

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

      {/* Footer with social icons */}
      <footer className={`py-8 ${theme === 'dark' ? 'bg-gray-900/50' : 'bg-white/50'} backdrop-blur-md mt-24`}>
        <div className="container mx-auto px-4 text-center">
          <div className="flex justify-center gap-6 mb-4">
            <a href="#" className="hover:scale-110 transition-transform"><Facebook className="w-6 h-6 text-pink-500 dark:text-purple-300" /></a>
            <a href="#" className="hover:scale-110 transition-transform"><Twitter className="w-6 h-6 text-pink-500 dark:text-purple-300" /></a>
            <a href="#" className="hover:scale-110 transition-transform"><Instagram className="w-6 h-6 text-pink-500 dark:text-purple-300" /></a>
          </div>
          <p className={theme === 'dark' ? 'text-gray-400' : 'text-muted-foreground'}>
            © {new Date().getFullYear()} Roomee. All rights reserved.
          </p>
        </div>
      </footer>
      {/* Custom animations */}
      <style>{`
        @keyframes fade-in { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: none; } }
        .animate-fade-in { animation: fade-in 0.7s ease; }
        @keyframes float { 0% { transform: translateY(0); } 50% { transform: translateY(-20px); } 100% { transform: translateY(0); } }
        .animate-float { animation: float 6s ease-in-out infinite; }
        @keyframes bounce-slow { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(-30px); } }
        .animate-bounce-slow { animation: bounce-slow 4s infinite; }
        @keyframes spin-slow { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }
        .animate-spin-slow { animation: spin-slow 12s linear infinite; }
        @keyframes gradient-move { 0% { background-position: 0% 50%; } 100% { background-position: 100% 50%; } }
        .animate-gradient-move { background-size: 200% 200%; animation: gradient-move 3s linear infinite alternate; }
        .hide-scrollbar::-webkit-scrollbar { display: none; }
      `}</style>

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