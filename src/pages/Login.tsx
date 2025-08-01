import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth, signInWithGoogle, signOutUser } from "@/lib/auth";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Shield, Users, CheckCircle, AlertTriangle, User, Lock, Sparkles } from "lucide-react";
import heroImage from "@/assets/hero-roommates.jpg";
import { toast } from "@/components/ui/sonner";

const Login = () => {
  const [user, loading, error] = useAuthState(auth);
  const [isSigningIn, setIsSigningIn] = useState(false);
  const navigate = useNavigate();

  const handleGoogleSignIn = async () => {
    setIsSigningIn(true);
    try {
      const user = await signInWithGoogle();
      toast.success(`Welcome ${user.displayName}! Redirecting to profile setup...`);
      navigate("/profile");
    } catch (error: any) {
      console.error('Sign in failed:', error);
      if (error.code === 'auth/popup-closed-by-user') {
        toast.error('Sign-in popup was closed before completing authentication. Please try again.');
      } else {
        toast.error(error.message || 'Sign in failed. Please try again.');
      }
    } finally {
      setIsSigningIn(false);
    }
  };

  const handleSignOut = async () => {
    try {
      await signOutUser();
      toast.success('Signed out successfully');
    } catch (error: any) {
      toast.error('Sign out failed');
    }
  };

  // If user is already signed in, redirect to profile
  if (user && !loading) {
    setTimeout(() => {
      navigate("/profile");
    }, 100);
    return null;
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-primary-soft via-background to-primary-glow flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-4 border-primary border-t-transparent mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-primary-soft via-background to-primary-glow flex items-center justify-center">
        <Card className="brutal-card max-w-md mx-auto p-8 text-center">
          <AlertTriangle className="w-12 h-12 text-destructive mx-auto mb-4" />
          <h2 className="text-xl font-bold text-foreground mb-2">Authentication Error</h2>
          <p className="text-muted-foreground mb-4">{error.message}</p>
          <Button onClick={() => window.location.reload()} className="btn-primary">
            Try Again
          </Button>
        </Card>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-soft via-background to-primary-glow relative overflow-hidden">
      {/* Loading overlay for sign-in */}
      {isSigningIn && (
        <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-black/60">
          <div className="animate-spin rounded-full h-16 w-16 border-8 border-primary border-t-transparent mb-6"></div>
          <p className="text-lg font-semibold text-white mb-2">Waiting for Google sign-in...</p>
          <p className="text-sm text-white/80">Please complete the authentication in the popup window.</p>
        </div>
      )}

      {/* Floating decorations */}
      <div className="floating-particles top-20 left-10">✨</div>
      <div className="floating-particles top-40 right-20 animation-delay-1000">🌟</div>
      <div className="floating-particles top-60 left-1/4 animation-delay-2000">💫</div>

      <div className="container mx-auto px-4 py-8 relative z-10">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-2 mb-4 logo-bounce">
            <div className="w-12 h-12 rounded-full bg-gradient-to-r from-primary to-primary-glow flex items-center justify-center logo-glow">
              <Users className="w-6 h-6 text-primary-foreground" />
            </div>
            <h1 className="text-3xl font-display font-bold text-foreground logo-shimmer">
              Roomee
            </h1>
          </div>
          <p className="text-muted-foreground font-medium">
            AI-powered roommate matching for the perfect twin-sharing experience
          </p>
          <div className="flex justify-center gap-2 mt-3">
            <Badge className="verification-badge">
              <Shield className="w-3 h-3 mr-1" />
              Government Verified
            </Badge>
            <Badge className="verification-badge">
              <Shield className="w-3 h-3 mr-1" />
              Women Only
            </Badge>
          </div>
        </div>

        {/* Hero Image */}
        <div className="glass-card rounded-[32px] p-4 mb-8 max-w-md mx-auto">
          <img 
            src={heroImage} 
            alt="Happy roommates high-fiving" 
            className="w-full h-48 object-cover rounded-[24px]"
          />
        </div>

        {/* Auth Card */}
        <Card className="brutal-card max-w-md mx-auto p-8">
          <div className="text-center mb-6">
            <h2 className="text-2xl font-display font-bold text-foreground mb-2">
              Secure Gmail Authentication
            </h2>
            <p className="text-muted-foreground">
              Sign in with your Gmail account to access Roomee
            </p>
            <div className="flex items-center justify-center gap-2 mt-3 p-3 bg-accent/10 rounded-lg">
              <AlertTriangle className="w-4 h-4 text-accent" />
              <span className="text-xs text-accent-foreground font-semibold">
                Only Gmail accounts accepted
              </span>
            </div>
          </div>

          <div className="space-y-6">
            {/* Security Features */}
            <div className="space-y-3">
              <div className="security-indicator">
                <CheckCircle className="w-4 h-4 text-accent" />
                <span className="text-xs font-medium">Gmail OAuth 2.0 Authentication</span>
              </div>
              <div className="security-indicator">
                <Shield className="w-4 h-4 text-accent" />
                <span className="text-xs font-medium">Government ID Verification Required</span>
              </div>
              <div className="security-indicator">
                <Lock className="w-4 h-4 text-accent" />
                <span className="text-xs font-medium">Women-Only Platform</span>
              </div>
            </div>

            <Button 
              onClick={handleGoogleSignIn}
              disabled={isSigningIn}
              className="btn-primary w-full flex items-center justify-center gap-3 btn-spring"
            >
              {isSigningIn ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-2 border-primary-foreground border-t-transparent" />
                  Signing in...
                </>
              ) : (
                <>
                  <svg className="w-5 h-5" viewBox="0 0 24 24">
                    <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                    <path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                    <path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                    <path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                  </svg>
                  Continue with Gmail
                </>
              )}
            </Button>
          </div>

          <div className="text-center mt-6 pt-6 border-t border-border">
            <p className="text-xs text-muted-foreground mb-2">
              By continuing, you agree to our Terms of Service and Privacy Policy
            </p>
            <p className="text-xs text-muted-foreground">
              Government ID verification will be required after sign-in
            </p>
          </div>

          {/* Features preview */}
          <div className="grid grid-cols-3 gap-4 mt-8 pt-6 border-t border-border">
            <div className="text-center">
              <Sparkles className="w-6 h-6 text-primary mx-auto mb-2" />
              <p className="text-xs text-muted-foreground font-medium">Smart Matching</p>
            </div>
            <div className="text-center">
              <Shield className="w-6 h-6 text-accent mx-auto mb-2" />
              <p className="text-xs text-muted-foreground font-medium">AI Security</p>
            </div>
            <div className="text-center">
              <Users className="w-6 h-6 text-secondary mx-auto mb-2" />
              <p className="text-xs text-muted-foreground font-medium">Perfect Pairs</p>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default Login;