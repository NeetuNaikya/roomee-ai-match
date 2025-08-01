import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Home, Info, ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";

const RoomDocumentation = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-soft via-background to-primary-glow flex items-center justify-center relative overflow-hidden">
      {/* Floating decorations */}
      <div className="floating-particles top-24 left-1/4 text-5xl select-none pointer-events-none">🛏️</div>
      <div className="floating-particles top-1/2 right-1/4 text-4xl select-none pointer-events-none">🏠</div>
      <div className="floating-particles bottom-16 left-1/2 text-3xl select-none pointer-events-none">📄</div>

      <Card className="brutal-card max-w-2xl mx-auto p-10 shadow-xl bg-white/80 rounded-3xl border-2 border-primary/20 text-center relative z-10">
        <div className="flex flex-col items-center mb-6">
          <Home className="w-16 h-16 text-primary mb-2 animate-bounce" />
          <h1 className="text-4xl font-extrabold text-primary mb-2 drop-shadow">Room Documentation</h1>
        </div>
        <h2 className="text-xl font-display font-bold text-foreground mb-4 flex items-center justify-center gap-2">
          <Info className="w-5 h-5 text-accent" />
          About Twin-Sharing Rooms
        </h2>
        <p className="text-lg text-muted-foreground mb-6">
          Our platform offers modern, secure, and comfortable twin-sharing rooms designed for women. Each room is equipped with essential amenities and is matched based on your preferences and compatibility.
        </p>
        <div className="text-left mb-8">
          <h3 className="text-lg font-semibold text-foreground mb-2">Room Features:</h3>
          <ul className="list-disc list-inside text-base text-muted-foreground space-y-1">
            <li>Spacious twin beds with premium mattresses</li>
            <li>Personal wardrobes and study desks</li>
            <li>High-speed Wi-Fi and air conditioning</li>
            <li>Attached bathroom with hot water</li>
            <li>24/7 security and CCTV surveillance</li>
            <li>Housekeeping and laundry services</li>
            <li>Community kitchen and lounge area</li>
            <li>Women-only floors for enhanced safety</li>
          </ul>
        </div>
        <div className="text-left mb-8">
          <h3 className="text-lg font-semibold text-foreground mb-2">How Room Matching Works:</h3>
          <ol className="list-decimal list-inside text-base text-muted-foreground space-y-1">
            <li>Complete your profile and verify your government ID</li>
            <li>Our AI matches you with compatible roommates based on preferences</li>
            <li>View your suggested room and roommate details</li>
            <li>Connect and chat with your match before moving in</li>
          </ol>
        </div>
        <Button
          onClick={() => navigate("/")}
          className="btn-primary flex items-center gap-2 px-6 py-3 text-lg rounded-full shadow-md hover:scale-105 transition"
        >
          <ArrowLeft className="w-5 h-5" />
          Back to Home
        </Button>
      </Card>
    </div>
  );
};

export default RoomDocumentation;
