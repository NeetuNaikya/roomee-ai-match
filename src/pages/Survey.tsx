import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "@/lib/auth";
import { surveyService, SurveyResponse } from "@/lib/supabase-database";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Mic, MicOff, ArrowRight, Bot, MessageCircle } from "lucide-react";
import { toast } from "@/components/ui/sonner";

const Survey = () => {
  const [user, loading] = useAuthState(auth);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();

  // Redirect if not authenticated
  if (!loading && !user) {
    navigate("/login");
    return null;
  }

  const questions = [
    {
      id: 1,
      question: "What's your ideal sleeping schedule?",
      key: 'sleep_schedule' as keyof SurveyResponse,
      options: [
        { label: "Early bird (sleep by 10 PM, wake up by 6 AM)", value: "early_bird" },
        { label: "Night owl (sleep after midnight, wake up late)", value: "night_owl" }
      ]
    },
    {
      id: 2,
      question: "What's your approach to cleanliness?",
      key: 'cleanliness' as keyof SurveyResponse,
      options: [
        { label: "Very clean and organized", value: "very_clean" },
        { label: "Moderately clean", value: "moderately_clean" },
        { label: "Relaxed about cleanliness", value: "relaxed" }
      ]
    },
    {
      id: 3,
      question: "How social are you at home?",
      key: 'social_habits' as keyof SurveyResponse,
      options: [
        { label: "Very social, love having people over", value: "very_social" },
        { label: "Moderately social", value: "moderately_social" },
        { label: "Prefer quiet environment", value: "prefer_quiet" }
      ]
    },
    {
      id: 4,
      question: "How often do you have guests over?",
      key: 'guests_frequency' as keyof SurveyResponse,
      options: [
        { label: "Never", value: "never" },
        { label: "Rarely", value: "rarely" },
        { label: "Sometimes", value: "sometimes" },
        { label: "Often", value: "often" }
      ]
    },
    {
      id: 5,
      question: "How sensitive are you to noise?",
      key: 'noise_tolerance' as keyof SurveyResponse,
      options: [
        { label: "Very sensitive to noise", value: "very_sensitive" },
        { label: "Somewhat sensitive", value: "somewhat_sensitive" },
        { label: "Not sensitive to noise", value: "not_sensitive" }
      ]
    },
    {
      id: 6,
      question: "How do you like shared spaces?",
      key: 'shared_spaces' as keyof SurveyResponse,
      options: [
        { label: "Minimalist and clean", value: "minimalist" },
        { label: "Organized but lived-in", value: "organized" },
        { label: "Comfortable and lived-in", value: "lived_in" }
      ]
    },
    {
      id: 7,
      question: "What's your communication style?",
      key: 'communication_style' as keyof SurveyResponse,
      options: [
        { label: "Direct and straightforward", value: "direct" },
        { label: "Diplomatic and considerate", value: "diplomatic" },
        { label: "Prefer to avoid conflict", value: "conflict_avoidant" }
      ]
    },
    {
      id: 8,
      question: "What's your lifestyle?",
      key: 'lifestyle' as keyof SurveyResponse,
      options: [
        { label: "Homebody, prefer staying in", value: "homebody" },
        { label: "Balanced between home and out", value: "balanced" },
        { label: "Very active, often out", value: "very_active" }
      ]
    }
  ];

  const handleAnswer = (answerValue: string) => {
    const newAnswers = [...answers];
    newAnswers[currentQuestion] = answerValue;
    setAnswers(newAnswers);

    if (currentQuestion < questions.length - 1) {
      setTimeout(() => {
        setCurrentQuestion(currentQuestion + 1);
      }, 500);
    }
  };

  const handleFinish = async () => {
    if (!user) {
      toast.error("Authentication required");
      return;
    }

    setIsSubmitting(true);
    try {
      // Create survey response object matching Supabase schema
      const surveyResponse = {
        user_id: user.uid,
        sleep_schedule: answers[0],
        cleanliness: answers[1],
        social_habits: answers[2],
        guests_frequency: answers[3],
        noise_tolerance: answers[4],
        shared_spaces: answers[5],
        communication_style: answers[6],
        lifestyle: answers[7],
      };

      // Save survey response
      await surveyService.saveSurveyResponse(surveyResponse);
      
      toast.success("Survey completed! Finding your matches...");
      navigate("/matches");
    } catch (error: any) {
      console.error('Survey submission failed:', error);
      toast.error("Failed to save survey. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

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

  const progress = ((currentQuestion + 1) / questions.length) * 100;

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-soft via-background to-primary-glow relative overflow-hidden">
      {/* Floating decorations */}
      <div className="floating-particles top-20 left-10">🤖</div>
      <div className="floating-particles top-40 right-20 animation-delay-1000">💬</div>
      
      <div className="container mx-auto px-4 py-8 relative z-10">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 bg-white/50 rounded-full px-4 py-2 mb-4">
            <Bot className="w-5 h-5 text-primary" />
            <span className="text-sm font-semibold text-foreground">Step 4 of 4</span>
          </div>
          <h1 className="text-3xl font-display font-bold text-foreground mb-2">
            Roommate Compatibility Survey
          </h1>
          <p className="text-muted-foreground">
            Answer these questions to find your perfect roommate match
          </p>
          
          {/* Progress Bar */}
          <div className="w-full max-w-md mx-auto mt-4">
            <div className="h-2 bg-white/30 rounded-full overflow-hidden">
              <div 
                className="h-full bg-gradient-to-r from-primary to-primary-glow transition-all duration-500"
                style={{ width: `${progress}%` }}
              />
            </div>
            <p className="text-xs text-muted-foreground mt-2">
              Question {currentQuestion + 1} of {questions.length}
            </p>
          </div>
        </div>

        {/* Question Card */}
        <Card className="brutal-card max-w-2xl mx-auto p-8">
          <div className="text-center mb-8">
            <Badge className="bg-primary/10 text-primary border-primary/20 mb-4">
              Question {currentQuestion + 1}
            </Badge>
            <h2 className="text-xl font-display font-bold text-foreground mb-4">
              {questions[currentQuestion].question}
            </h2>
          </div>

          {/* Answer Options */}
          <RadioGroup 
            value={answers[currentQuestion] || ""} 
            onValueChange={handleAnswer}
            className="space-y-3"
          >
            {questions[currentQuestion].options.map((option, index) => (
              <div key={index} className="relative">
                <div className="flex items-center space-x-3 p-4 rounded-[16px] border-2 border-transparent hover:border-primary/30 hover:bg-primary/5 transition-all cursor-pointer">
                  <RadioGroupItem value={option.value} id={`option-${index}`} />
                  <Label 
                    htmlFor={`option-${index}`} 
                    className="flex-1 cursor-pointer text-sm font-medium text-foreground"
                  >
                    {option.label}
                  </Label>
                </div>
              </div>
            ))}
          </RadioGroup>

          {/* Navigation */}
          <div className="flex justify-between items-center mt-8">
            <Button 
              variant="outline"
              onClick={() => currentQuestion > 0 && setCurrentQuestion(currentQuestion - 1)}
              disabled={currentQuestion === 0}
              className="border-2 border-primary/20 rounded-[12px]"
            >
              Previous
            </Button>
            
            {currentQuestion === questions.length - 1 ? (
              <Button 
                onClick={handleFinish}
                disabled={!answers[currentQuestion] || isSubmitting}
                className="btn-primary flex items-center gap-2"
              >
                {isSubmitting ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-2 border-primary-foreground border-t-transparent" />
                    Processing...
                  </>
                ) : (
                  <>
                    Find My Matches
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </Button>
            ) : (
              <Button 
                onClick={() => answers[currentQuestion] && setCurrentQuestion(currentQuestion + 1)}
                disabled={!answers[currentQuestion]}
                className="btn-primary flex items-center gap-2"
              >
                Next Question
                <ArrowRight className="w-4 h-4" />
              </Button>
            )}
          </div>
        </Card>
      </div>
    </div>
  );
};

export default Survey;