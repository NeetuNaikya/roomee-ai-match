
import { useLocation, useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Ghost, ArrowLeft } from "lucide-react";

const NotFound = () => {

  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
  }, [location.pathname]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-soft via-background to-primary-glow flex items-center justify-center relative overflow-hidden">
      {/* Floating decoration */}
      <div className="floating-particles top-24 left-1/4 text-5xl select-none pointer-events-none">💫</div>
      <div className="floating-particles top-1/2 right-1/4 text-4xl select-none pointer-events-none">✨</div>
      <div className="floating-particles bottom-16 left-1/2 text-3xl select-none pointer-events-none">🪄</div>

      <div className="brutal-card max-w-lg mx-auto p-10 shadow-xl bg-white/80 rounded-3xl border-2 border-primary/20 text-center relative z-10">
        <div className="flex flex-col items-center mb-6">
          <Ghost className="w-16 h-16 text-primary mb-2 animate-bounce" />
          <h1 className="text-6xl font-extrabold text-primary mb-2 drop-shadow">404</h1>
        </div>
        <h2 className="text-2xl font-display font-bold text-foreground mb-2">Page Not Found</h2>
        <p className="text-lg text-muted-foreground mb-6">Oops! The page you are looking for does not exist or has been moved.</p>
        <Button
          onClick={() => navigate("/")}
          className="btn-primary flex items-center gap-2 px-6 py-3 text-lg rounded-full shadow-md hover:scale-105 transition"
        >
          <ArrowLeft className="w-5 h-5" />
          Return to Home
        </Button>
      </div>
    </div>
  );
};

export default NotFound;
