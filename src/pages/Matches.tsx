import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "@/lib/auth";
import { findBestMatches, matchingService, profileService, MatchingResult, UserProfile } from "@/lib/supabase-database";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Heart, MessageCircle, Star, MapPin, Briefcase, Calendar, Home, Users, Shield, CheckCircle } from "lucide-react";
import twinRoomImage from "@/assets/twin-room-mockup.jpg";
import { toast } from "@/components/ui/sonner";

interface MatchWithProfile extends MatchingResult {
  profile?: UserProfile;
}

const Matches = () => {
  const [user, loading] = useAuthState(auth);
  const [matches, setMatches] = useState<MatchWithProfile[]>([]);
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
        // Find matches using the new Supabase service
        const matchResults = await findBestMatches(user.uid);
        
        if (!matchResults || matchResults.length === 0) {
          setNoMatches(true);
        } else {
          // Fetch profile data for each match
          const matchesWithProfiles = await Promise.all(
            matchResults.map(async (match) => {
              const profile = await profileService.getProfileByUserId(match.matched_user_id);
              return { ...match, profile };
            })
          );
          
          setMatches(matchesWithProfiles);
          toast.success(`Found ${matchResults.length} perfect match${matchResults.length > 1 ? 'es' : ''}!`);
        }
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

  if (noMatches || matches.length === 0) {
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

  const topMatch = matches[0];
  const otherMatches = matches.slice(1);
  
  const circumference = 2 * Math.PI * 45;
  const offset = circumference - (topMatch.compatibility_score / 100) * circumference;

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
            <span className="text-sm font-semibold text-foreground">Matches Found</span>
          </div>
          <h1 className="text-3xl font-display font-bold text-foreground mb-2">
            Your Perfect Matches! 
          </h1>
          <p className="text-muted-foreground">
            Our AI found your perfect roommate match{matches.length > 1 ? 'es' : ''}!
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-8 max-w-4xl mx-auto">
          {/* Top Match Details */}
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
                    <div className={`text-2xl font-bold ${getMatchColor(topMatch.compatibility_score)}`}>
                      {topMatch.compatibility_score}%
                    </div>
                    <div className="text-xs text-muted-foreground">Match</div>
                  </div>
                </div>
                <div className="sparkle absolute -top-2 -right-2"></div>
              </div>

              <Avatar className="w-20 h-20 mx-auto mb-4 border-4 border-primary/20">
                <AvatarImage 
                  src={topMatch.profile?.profile_photo_url || "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face"} 
                  alt={topMatch.profile?.full_name || "Roommate"} 
                />
                <AvatarFallback className="bg-primary text-white text-lg font-semibold">
                  {topMatch.profile?.full_name?.split(' ').map(n => n[0]).join('') || 'RM'}
                </AvatarFallback>
              </Avatar>

              <h2 className="text-2xl font-display font-bold text-foreground">
                {topMatch.profile?.full_name || 'Roommate'}
              </h2>
              
              <div className="flex items-center justify-center gap-2 mt-2 text-sm text-muted-foreground">
                <MapPin className="w-4 h-4" />
                <span>{topMatch.profile?.location || 'Location not specified'}</span>
              </div>
            </div>

            {/* Bio */}
            <div className="glass-card rounded-[20px] p-4 mb-6">
              <p className="text-sm text-foreground text-center">
                "{topMatch.profile?.bio || 'Looking forward to being great roommates!'}"
              </p>
            </div>

            {/* Shared Preferences */}
            <div className="space-y-4">
              <div>
                <h3 className="font-semibold text-foreground mb-2">Shared Preferences</h3>
                <div className="flex flex-wrap gap-2">
                  {Object.entries(topMatch.shared_preferences || {}).map(([key, value]) => (
                    <Badge key={key} className="bg-secondary/10 text-secondary border-secondary/20">
                      {String(value).replace('_', ' ')}
                    </Badge>
                  ))}
                </div>
              </div>

              <div>
                <h3 className="font-semibold text-foreground mb-2">Match Score</h3>
                <Badge className={`${getMatchColor(topMatch.compatibility_score)} border-current`}>
                  {topMatch.compatibility_score}% Compatible
                </Badge>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3 mt-8">
              <Button
                className="btn-primary flex-1 flex items-center justify-center gap-2"
                onClick={() => navigate(`/chat/${topMatch.matched_user_id}`)}
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
                  {otherMatches.map((match) => (
                    <div key={match.id} className="flex items-center gap-4 p-3 rounded-lg hover:bg-primary/10 transition">
                      <Avatar className="w-12 h-12 border-2 border-primary/20">
                        <AvatarImage 
                          src={match.profile?.profile_photo_url || "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face"} 
                          alt={match.profile?.full_name || "Roommate"} 
                        />
                        <AvatarFallback className="bg-primary text-white text-base font-semibold">
                          {match.profile?.full_name?.split(' ').map(n => n[0]).join('') || 'RM'}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1">
                        <div className="font-semibold text-foreground">{match.profile?.full_name || 'Roommate'}</div>
                        <div className="text-xs text-muted-foreground">{match.profile?.location || 'Location not specified'}</div>
                        <div className="flex gap-2 mt-1">
                          <Badge className={`${getMatchColor(match.compatibility_score)} border-current`}>
                            {match.compatibility_score}%
                          </Badge>
                        </div>
                      </div>
                      <Button
                        size="sm"
                        onClick={() => navigate(`/chat/${match.matched_user_id}`)}
                        className="btn-primary"
                      >
                        <MessageCircle className="w-4 h-4" />
                      </Button>
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
