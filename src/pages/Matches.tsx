import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "@/lib/auth";
import { db, findBestMatch, MatchResult } from "@/lib/database";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Heart, MessageCircle, Star, MapPin, Briefcase, Calendar, Home, Users, Shield, CheckCircle } from "lucide-react";
import twinRoomImage from "@/assets/twin-room-mockup.jpg";
import { toast } from "@/components/ui/sonner";

const Matches = () => {
  const [user, loading] = useAuthState(auth);
  const [matchResult, setMatchResult] = useState<MatchResult | null>(null);
  const [otherMatches, setOtherMatches] = useState<MatchResult[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [noMatches, setNoMatches] = useState(false);
  const navigate = useNavigate();


  // Always call hooks at the top level, use effect for redirect
  useEffect(() => {
    if (!loading && !user) {
      navigate("/login");
    }
  }, [loading, user, navigate]);

  useEffect(() => {
    if (!user) return;
    const findMatches = async () => {
      setIsLoading(true);
      try {
        // Simulate fetching up to 10 matches (mock data)
        const mockMatches: MatchResult[] = [
          {
            roommateId: "u101",
            roommateName: "Aisha Khan",
            matchScore: 97,
            explanation: "You both love early mornings, yoga, and have similar work schedules.",
            suggestedRoom: { id: "101", name: "Room 101", side: "window", isOccupied: false },
          },
          {
            roommateId: "u102",
            roommateName: "Priya Sharma",
            matchScore: 94,
            explanation: "You share a passion for cooking and enjoy quiet evenings.",
            suggestedRoom: { id: "102", name: "Room 102", side: "door", isOccupied: false },
          },
          {
            roommateId: "u103",
            roommateName: "Sara Lee",
            matchScore: 91,
            explanation: "Both are students who prefer a tidy space and love reading.",
            suggestedRoom: { id: "103", name: "Room 103", side: "window", isOccupied: false },
          },
          {
            roommateId: "u104",
            roommateName: "Fatima Noor",
            matchScore: 89,
            explanation: "You both enjoy music, art, and have similar sleep patterns.",
            suggestedRoom: { id: "104", name: "Room 104", side: "door", isOccupied: false },
          },
          {
            roommateId: "u105",
            roommateName: "Zara Patel",
            matchScore: 87,
            explanation: "You are both working professionals who value privacy.",
            suggestedRoom: { id: "105", name: "Room 105", side: "window", isOccupied: false },
          },
          {
            roommateId: "u106",
            roommateName: "Meher Singh",
            matchScore: 85,
            explanation: "You both love pets and enjoy weekend hikes.",
            suggestedRoom: { id: "106", name: "Room 106", side: "door", isOccupied: false },
          },
          {
            roommateId: "u107",
            roommateName: "Ananya Das",
            matchScore: 83,
            explanation: "You share similar dietary preferences and routines.",
            suggestedRoom: { id: "107", name: "Room 107", side: "window", isOccupied: false },
          },
          {
            roommateId: "u108",
            roommateName: "Sana Malik",
            matchScore: 81,
            explanation: "Both are night owls and enjoy late-night movies.",
            suggestedRoom: { id: "108", name: "Room 108", side: "door", isOccupied: false },
          },
          {
            roommateId: "u109",
            roommateName: "Nisha Verma",
            matchScore: 79,
            explanation: "You both like to keep things organized and clean.",
            suggestedRoom: { id: "109", name: "Room 109", side: "window", isOccupied: false },
          },
          {
            roommateId: "u110",
            roommateName: "Riya Gupta",
            matchScore: 77,
            explanation: "You share a love for travel and adventure.",
            suggestedRoom: { id: "110", name: "Room 110", side: "door", isOccupied: false },
          },
        ];
        setMatchResult(mockMatches[0]);
        setOtherMatches(mockMatches.slice(1));
        toast.success("Perfect match found!");
      } catch (error) {
        console.error('Match finding failed:', error);
        toast.error("Failed to find matches. Please try again.");
        setNoMatches(true);
      } finally {
        setIsLoading(false);
      }
    };
    findMatches();
  }, [user]);

  const getMatchColor = (score: number): string => {
    if (score >= 90) return "text-green-600";
    if (score >= 80) return "text-yellow-600";
    return "text-orange-600";
  };

  if (loading || isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-primary-soft via-background to-primary-glow flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-4 border-primary border-t-transparent mx-auto mb-4"></div>
          <p className="text-muted-foreground">Finding your perfect roommate match...</p>
        </div>
      </div>
    );
  }

  if (noMatches || !matchResult) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-primary-soft via-background to-primary-glow relative overflow-hidden">
        <div className="container mx-auto px-4 py-8 relative z-10">
          <div className="text-center max-w-2xl mx-auto">
            <div className="w-24 h-24 rounded-full bg-primary/20 flex items-center justify-center mx-auto mb-6">
              <Star className="w-12 h-12 text-primary" />
            </div>
            <h1 className="text-3xl font-display font-bold text-foreground mb-4">
              No Matches Available
            </h1>
            <p className="text-muted-foreground mb-8">
              No roommate matches are available at this time. Please check back later as more users join our platform.
            </p>
            <div className="flex gap-4 justify-center">
              <Button 
                onClick={() => navigate("/profile")}
                variant="outline"
                className="border-2 border-primary/20 rounded-[12px]"
              >
                Update Profile
              </Button>
              <Button 
                onClick={() => window.location.reload()}
                className="btn-primary"
              >
                Check Again
              </Button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const circumference = 2 * Math.PI * 45;
  const offset = circumference - (matchResult.matchScore / 100) * circumference;

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-soft via-background to-primary-glow relative overflow-hidden">
      {/* Floating decorations */}
      <div className="floating-particles top-16 right-10">🎉</div>
      <div className="floating-particles top-32 left-20 animation-delay-1000">✨</div>
      <div className="floating-particles top-48 right-1/4 animation-delay-2000">🌟</div>

      <div className="container mx-auto px-4 py-8 relative z-10">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 bg-white/50 rounded-full px-4 py-2 mb-4">
            <Star className="w-5 h-5 text-primary" />
            <span className="text-sm font-semibold text-foreground">Step 3 of 3</span>
          </div>
          <h1 className="text-3xl font-display font-bold text-foreground mb-2">
            Your Perfect Matches! 
          </h1>
          <p className="text-muted-foreground">
            Our AI found your perfect roommate match!
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-8 max-w-4xl mx-auto">
          {/* Match Details */}
          <Card className="brutal-card p-8">
            <div className="text-center mb-6">
              {/* Progress Ring */}
              <div className="relative w-32 h-32 mx-auto mb-4">
                <svg className="progress-ring w-32 h-32">
                  <circle
                    cx="64"
                    cy="64"
                    r="45"
                    stroke="hsl(var(--primary) / 0.2)"
                    strokeWidth="8"
                    fill="transparent"
                  />
                  <circle
                    cx="64"
                    cy="64"
                    r="45"
                    stroke="hsl(var(--primary))"
                    strokeWidth="8"
                    fill="transparent"
                    strokeDasharray={circumference}
                    strokeDashoffset={offset}
                    className="progress-ring-fill"
                  />
                </svg>
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="text-center">
                    <div className={`text-2xl font-bold ${getMatchColor(matchResult.matchScore)}`}>
                      {matchResult.matchScore}%
                    </div>
                    <div className="text-xs text-muted-foreground">Match</div>
                  </div>
                </div>
                <div className="sparkle absolute -top-2 -right-2"></div>
              </div>

              <Avatar className="w-20 h-20 mx-auto mb-4 border-4 border-primary/20">
                <AvatarImage src="https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face" alt={matchResult.roommateName} />
                <AvatarFallback className="bg-primary text-white text-lg font-semibold">
                  {matchResult.roommateName.split(' ').map(n => n[0]).join('')}
                </AvatarFallback>
              </Avatar>

              <h2 className="text-2xl font-display font-bold text-foreground">
                {matchResult.roommateName}
              </h2>
            </div>

            {/* Bio */}
            <div className="glass-card rounded-[20px] p-4 mb-6">
              <p className="text-sm text-foreground text-center">
                "{matchResult.explanation}"
              </p>
            </div>

            {/* Room Details */}
            <div className="space-y-4">
              <div>
                <h3 className="font-semibold text-foreground mb-2">Suggested Room</h3>
                <Badge className="bg-secondary/10 text-secondary border-secondary/20">
                  {matchResult.suggestedRoom.name} - {matchResult.suggestedRoom.side} side
                </Badge>
              </div>

              <div>
                <h3 className="font-semibold text-foreground mb-2">Match Score</h3>
                <Badge className={`${getMatchColor(matchResult.matchScore)} border-current`}>
                  {matchResult.matchScore}% Compatible
                </Badge>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3 mt-8">
              <Button
                className="btn-primary flex-1 flex items-center justify-center gap-2"
                onClick={() => navigate(`/chat/${matchResult.roommateId}`)}
              >
                <MessageCircle className="w-4 h-4" />
                Chat Now
              </Button>
              <Button variant="outline" className="border-2 border-primary/20 rounded-[12px] px-6">
                <Star className="w-4 h-4" />
              </Button>
            </div>
          </Card>

          {/* Room Preview & Other Matches */}
          <div className="space-y-6">
            {/* Room Mockup */}
            <Card className="glass-card p-6">
              <div className="flex items-center gap-2 mb-4">
                <Home className="w-5 h-5 text-primary" />
                <h3 className="font-semibold text-foreground">Your Future Room</h3>
              </div>
              <img 
                src={twinRoomImage} 
                alt="Twin bed room mockup" 
                className="w-full h-48 object-cover rounded-[16px] mb-4"
              />
              <p className="text-sm text-muted-foreground text-center">
                Modern twin-sharing accommodation with all amenities
              </p>
            </Card>

            {/* Other Matches List */}
            {otherMatches.length > 0 && (
              <Card className="glass-card p-6">
                <h3 className="font-semibold text-foreground mb-4 flex items-center gap-2">
                  <Users className="w-5 h-5 text-primary" />
                  More Great Matches
                </h3>
                <div className="space-y-4">
                  {otherMatches.map((m, idx) => (
                    <div key={m.roommateName} className="flex items-center gap-4 p-3 rounded-lg hover:bg-primary/10 transition">
                      <Avatar className="w-12 h-12 border-2 border-primary/20">
                        <AvatarImage src="https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face" alt={m.roommateName} />
                        <AvatarFallback className="bg-primary text-white text-base font-semibold">
                          {m.roommateName.split(' ').map(n => n[0]).join('')}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1">
                        <div className="font-semibold text-foreground">{m.roommateName}</div>
                        <div className="text-xs text-muted-foreground">{m.explanation}</div>
                        <div className="flex gap-2 mt-1">
                          <Badge className="bg-secondary/10 text-secondary border-secondary/20">
                            {m.suggestedRoom.name} - {m.suggestedRoom.side} side
                          </Badge>
                          <Badge className={`${getMatchColor(m.matchScore)} border-current`}>
                            {m.matchScore}%
                          </Badge>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </Card>
            )}

            {/* Security Features */}
            <Card className="glass-card p-6">
              <h3 className="font-semibold text-foreground mb-4 flex items-center gap-2">
                <Shield className="w-5 h-5 text-primary" />
                Security Features
              </h3>
              <div className="space-y-3 text-sm">
                <div className="security-indicator">
                  <CheckCircle className="w-4 h-4 text-green-600" />
                  <span>Government ID Verified</span>
                </div>
                <div className="security-indicator">
                  <CheckCircle className="w-4 h-4 text-green-600" />
                  <span>Gmail Account Verified</span>
                </div>
                <div className="security-indicator">
                  <CheckCircle className="w-4 h-4 text-green-600" />
                  <span>Women-Only Platform</span>
                </div>
                <div className="security-indicator">
                  <CheckCircle className="w-4 h-4 text-green-600" />
                  <span>AI-Powered Matching</span>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Matches;
