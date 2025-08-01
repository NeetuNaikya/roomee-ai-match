import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth, signOutUser } from "@/lib/auth";
import { verifyGovernmentID, IDDocument } from "@/lib/idVerification";
import { db } from "@/lib/database";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Badge } from "@/components/ui/badge";
import { ArrowRight, Shield, User, Briefcase, Heart, Camera, CheckCircle, MapPin, Upload } from "lucide-react";
import { toast } from "@/components/ui/sonner";

const Profile = () => {
  const [user, loading] = useAuthState(auth);
  const [formData, setFormData] = useState({
    fullName: "",
    age: "",
    maritalStatus: "",
    workStatus: "",
    location: "",
    occupation: "",
    profilePhoto: null as File | null,
    governmentId: null as File | null,
  });
  const [isVerifying, setIsVerifying] = useState(false);
  const [idDocument, setIdDocument] = useState<IDDocument | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();

  // Redirect if not authenticated
  if (!loading && !user) {
    navigate("/login");
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

  const handleNext = async () => {
    if (!user || !idDocument || !idDocument.isVerified) {
      toast.error("Please complete government ID verification first");
      return;
    }

    if (formData.fullName && formData.age && formData.maritalStatus && formData.workStatus && formData.location) {
      setIsSubmitting(true);
      try {
        // Create user profile in database
        await db.createUser({
          email: user.email!,
          fullName: formData.fullName,
          age: parseInt(formData.age),
          location: formData.location,
          occupation: formData.occupation,
          maritalStatus: formData.maritalStatus as 'single' | 'married',
          workStatus: formData.workStatus as 'working' | 'student' | 'both',
          profilePhoto: formData.profilePhoto ? URL.createObjectURL(formData.profilePhoto) : undefined,
          isVerified: true,
          idDocument: idDocument,
        });
        
        toast.success("Profile created successfully!");
        navigate("/path-selection");
      } catch (error: any) {
        console.error('Profile creation failed:', error);
        toast.error("Failed to create profile. Please try again.");
      } finally {
        setIsSubmitting(false);
      }
    } else {
      toast.error("Please fill in all required fields");
    }
  };

  const handleIDUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file || !user) return;

    setIsVerifying(true);
    try {
      const verifiedID = await verifyGovernmentID(file, user.uid);
      setIdDocument(verifiedID);
      setFormData({...formData, governmentId: file});
      toast.success("Government ID verified successfully!");
    } catch (error: any) {
      console.error('ID verification failed:', error);
      toast.error(error.message || "ID verification failed. Please try again.");
      setIdDocument(null);
    } finally {
      setIsVerifying(false);
    }
  };

  const handleSignOut = async () => {
    try {
      await signOutUser();
      navigate("/path-selection");
    } catch (error) {
      toast.error("Sign out failed");
    }
  };

  const handlePhotoUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setFormData({...formData, profilePhoto: file});
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-soft via-background to-primary-glow relative overflow-hidden">
      {/* Floating decorations */}
      <div className="floating-particles top-16 right-10">✨</div>
      <div className="floating-particles top-32 left-20 animation-delay-1500">💫</div>
      
      <div className="container mx-auto px-4 py-8 relative z-10">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 bg-white/50 rounded-full px-4 py-2 mb-4">
            <User className="w-5 h-5 text-primary" />
            <span className="text-sm font-semibold text-foreground">Step 2 of 4</span>
          </div>
          <h1 className="text-3xl font-display font-bold text-foreground mb-2">
            Secure Profile Creation
          </h1>
          <p className="text-muted-foreground">
            Complete your profile with government ID verification
          </p>
          <div className="flex justify-center gap-2 mt-3">
            <Badge className="verification-badge">
              <CheckCircle className="w-3 h-3 mr-1" />
              Gmail Verified
            </Badge>
            <Badge className="verification-badge">
              <Shield className="w-3 h-3 mr-1" />
              {idDocument?.isVerified ? "ID Verified" : "ID Pending"}
            </Badge>
          </div>
          
          {user && (
            <div className="flex items-center justify-center gap-2 mt-4">
              <img 
                src={user.photoURL || ''} 
                alt={user.displayName || ''} 
                className="w-8 h-8 rounded-full"
              />
              <span className="text-sm text-muted-foreground">
                Signed in as {user.email}
              </span>
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={handleSignOut}
                className="text-xs"
              >
                Sign Out
              </Button>
            </div>
          )}
        </div>

        {/* Profile Form */}
        <Card className="brutal-card max-w-2xl mx-auto p-8">
          <div className="space-y-6">
            {/* Profile Photo Upload */}
            <div className="text-center">
              <Label className="text-sm font-semibold text-foreground">Profile Photo</Label>
              <div className="photo-upload mt-3">
                <div className="w-24 h-24 rounded-full border-2 border-dashed border-primary mx-auto mb-4 flex items-center justify-center overflow-hidden">
                  {formData.profilePhoto ? (
                    <img 
                      src={URL.createObjectURL(formData.profilePhoto)} 
                      alt="Profile" 
                      className="w-full h-full object-cover rounded-full"
                    />
                  ) : (
                    <Camera className="w-8 h-8 text-primary" />
                  )}
                </div>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handlePhotoUpload}
                  className="hidden"
                  id="photo-upload"
                />
                <label 
                  htmlFor="photo-upload"
                  className="btn-primary inline-flex items-center gap-2 cursor-pointer px-4 py-2 text-sm"
                >
                  <Upload className="w-4 h-4" />
                  Upload Photo
                </label>
              </div>
            </div>

            {/* Two-column layout for form fields */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Full Name */}
              <div>
                <Label className="text-sm font-semibold text-foreground">Full Name *</Label>
                <Input 
                  placeholder="Enter your full name"
                  value={formData.fullName}
                  onChange={(e) => setFormData({...formData, fullName: e.target.value})}
                  className="rounded-[16px] border-2 border-primary/20 focus:border-primary mt-2"
                />
              </div>

              {/* Age */}
              <div>
                <Label className="text-sm font-semibold text-foreground">Age *</Label>
                <Input 
                  type="number"
                  placeholder="18-45"
                  min="18 "
                  max="45"
                  value={formData.age}
                  onChange={(e) => setFormData({...formData, age: e.target.value})}
                  className="rounded-[16px] border-2 border-primary/20 focus:border-primary mt-2"
                />
                <p className="text-xs text-muted-foreground mt-1">Age range: 18-45 years</p>
              </div>

              {/* Current Location */}
              <div>
                <Label className="text-sm font-semibold text-foreground">Current Location *</Label>
                <Input 
                  placeholder="City, State"
                  value={formData.location}
                  onChange={(e) => setFormData({...formData, location: e.target.value})}
                  className="rounded-[16px] border-2 border-primary/20 focus:border-primary mt-2"
                />
              </div>

              {/* Occupation */}
              <div>
                <Label className="text-sm font-semibold text-foreground">Occupation</Label>
                <Input 
                  placeholder="Your job title or field"
                  value={formData.occupation}
                  onChange={(e) => setFormData({...formData, occupation: e.target.value})}
                  className="rounded-[16px] border-2 border-primary/20 focus:border-primary mt-2"
                />
              </div>
            </div>

            {/* Gender - Women Only Section */}
            <div className="col-span-full">
              <Label className="text-sm font-semibold text-foreground">Platform Focus</Label>
              <div className="glass-card rounded-[16px] p-4 mt-3">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center">
                    <span className="text-xl">👩‍🤝‍👩</span>
                  </div>
                  <div className="flex-1">
                    <Badge className="bg-primary/10 text-primary border-primary/20 mb-2">
                      Women-Only Platform
                    </Badge>
                    <p className="text-xs text-muted-foreground">
                      Roomee exclusively serves women for enhanced safety, security, and comfort in shared living spaces.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Marital Status */}
            <div>
              <Label className="text-sm font-semibold text-foreground">Relationship Status *</Label>
              <RadioGroup 
                value={formData.maritalStatus} 
                onValueChange={(value) => setFormData({...formData, maritalStatus: value})}
                className="mt-3"
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="single" id="single" />
                  <Label htmlFor="single" className="flex items-center gap-2">
                    <User className="w-4 h-4 text-primary" />
                    Single
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="married" id="married" />
                  <Label htmlFor="married" className="flex items-center gap-2">
                    <User className="w-4 h-4 text-primary" />
                    Married/In Relationship
                  </Label>
                </div>
              </RadioGroup>
            </div>

            {/* Work Status */}
            <div>
              <Label className="text-sm font-semibold text-foreground">Current Status *</Label>
              <RadioGroup 
                value={formData.workStatus} 
                onValueChange={(value) => setFormData({...formData, workStatus: value})}
                className="mt-3"
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="working" id="working" />
                  <Label htmlFor="working" className="flex items-center gap-2">
                    <Briefcase className="w-4 h-4 text-primary" />
                    Working Professional
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="student" id="student" />
                  <Label htmlFor="student" className="flex items-center gap-2">
                    <Briefcase className="w-4 h-4 text-primary" />
                    Student
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="both" id="both" />
                  <Label htmlFor="both" className="flex items-center gap-2">
                    <Briefcase className="w-4 h-4 text-primary" />
                    Student + Part-time Work
                  </Label>
                </div>
              </RadioGroup>
            </div>

            {/* Government ID Verification */}
            <div className="glass-card rounded-[20px] p-4">
              <div className="flex items-center gap-3 mb-3">
                <Shield className="w-5 h-5 text-primary" />
                <Label className="text-sm font-semibold text-foreground">Identity Verification</Label>
                {idDocument?.isVerified && (
                  <CheckCircle className="w-5 h-5 text-green-600" />
                )}
              </div>
              <p className="text-xs text-muted-foreground mb-4">
                Upload Aadhar Card, Passport, Voter ID, or Driving License. We verify gender and authenticity for women-only platform security.
              </p>
              
              {idDocument?.isVerified ? (
                <div className="bg-green-50 border border-green-200 rounded-lg p-3">
                  <div className="flex items-center gap-2 mb-2">
                    <CheckCircle className="w-4 h-4 text-green-600" />
                    <span className="text-sm font-semibold text-green-800">ID Verified Successfully</span>
                  </div>
                  <p className="text-xs text-green-700">
                    Document: {idDocument.documentType.toUpperCase()} | 
                    Name: {idDocument.fullName} | 
                    Gender: {idDocument.gender.toUpperCase()}
                  </p>
                </div>
              ) : (
                <>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleIDUpload}
                    className="hidden"
                    id="id-upload"
                    disabled={isVerifying}
                  />
                  <label 
                    htmlFor="id-upload"
                    className={`btn-primary inline-flex items-center gap-2 cursor-pointer px-4 py-2 text-sm w-full justify-center ${
                      isVerifying ? 'opacity-50 cursor-not-allowed' : ''
                    }`}
                  >
                    {isVerifying ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-2 border-primary-foreground border-t-transparent" />
                        Verifying ID...
                      </>
                    ) : (
                      <>
                        <Camera className="w-4 h-4" />
                        Upload Government ID
                      </>
                    )}
                  </label>
                  
                  {formData.governmentId && !idDocument && (
                    <p className="text-xs text-muted-foreground mt-2 text-center">
                      Processing: {formData.governmentId.name}
                    </p>
                  )}
                </>
              )}
            </div>
          </div>

          <div className="flex gap-4 mt-8">
            <Button 
              onClick={handleNext}
              disabled={
                !formData.fullName || 
                !formData.age || 
                !formData.maritalStatus || 
                !formData.workStatus || 
                !formData.location || 
                !idDocument?.isVerified ||
                isSubmitting
              }
              className="btn-primary w-full flex items-center justify-center gap-2 btn-spring"
            >
              {isSubmitting ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-2 border-primary-foreground border-t-transparent" />
                  Creating Profile...
                </>
              ) : (
                <>
                  Continue to Path Selection
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </Button>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default Profile;