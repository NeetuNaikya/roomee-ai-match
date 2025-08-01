-- Create user profiles table
CREATE TABLE public.profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id TEXT NOT NULL UNIQUE, -- Firebase auth UID
  email TEXT NOT NULL,
  full_name TEXT NOT NULL,
  age INTEGER NOT NULL,
  location TEXT NOT NULL,
  phone_number TEXT,
  occupation TEXT,
  bio TEXT,
  profile_photo_url TEXT,
  id_document JSONB,
  is_verified BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create survey responses table
CREATE TABLE public.survey_responses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id TEXT NOT NULL REFERENCES public.profiles(user_id) ON DELETE CASCADE,
  sleep_schedule TEXT NOT NULL, -- 'early_bird' or 'night_owl'
  cleanliness TEXT NOT NULL, -- 'very_clean', 'moderately_clean', 'relaxed'
  social_habits TEXT NOT NULL, -- 'very_social', 'moderately_social', 'prefer_quiet'
  guests_frequency TEXT NOT NULL, -- 'never', 'rarely', 'sometimes', 'often'
  noise_tolerance TEXT NOT NULL, -- 'very_sensitive', 'somewhat_sensitive', 'not_sensitive'
  shared_spaces TEXT NOT NULL, -- 'minimalist', 'organized', 'lived_in'
  communication_style TEXT NOT NULL, -- 'direct', 'diplomatic', 'conflict_avoidant'
  lifestyle TEXT NOT NULL, -- 'homebody', 'balanced', 'very_active'
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  UNIQUE(user_id)
);

-- Create matching results table
CREATE TABLE public.matching_results (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id TEXT NOT NULL REFERENCES public.profiles(user_id) ON DELETE CASCADE,
  matched_user_id TEXT NOT NULL REFERENCES public.profiles(user_id) ON DELETE CASCADE,
  compatibility_score INTEGER NOT NULL CHECK (compatibility_score >= 0 AND compatibility_score <= 100),
  shared_preferences JSONB NOT NULL DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  UNIQUE(user_id, matched_user_id)
);

-- Create rooms table for room assignments
CREATE TABLE public.rooms (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  room_number TEXT NOT NULL UNIQUE,
  capacity INTEGER NOT NULL DEFAULT 2,
  current_occupancy INTEGER NOT NULL DEFAULT 0,
  amenities TEXT[] DEFAULT '{}',
  monthly_rent DECIMAL(10,2),
  is_available BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  CHECK (current_occupancy <= capacity)
);

-- Create room assignments table
CREATE TABLE public.room_assignments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  room_id UUID NOT NULL REFERENCES public.rooms(id) ON DELETE CASCADE,
  user_id TEXT NOT NULL REFERENCES public.profiles(user_id) ON DELETE CASCADE,
  assigned_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'pending', 'cancelled')),
  UNIQUE(user_id)
);

-- Enable Row Level Security
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.survey_responses ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.matching_results ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.rooms ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.room_assignments ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for profiles
CREATE POLICY "Users can view their own profile" 
ON public.profiles 
FOR SELECT 
USING (user_id = current_setting('request.jwt.claims', true)::json->>'sub');

CREATE POLICY "Users can insert their own profile" 
ON public.profiles 
FOR INSERT 
WITH CHECK (user_id = current_setting('request.jwt.claims', true)::json->>'sub');

CREATE POLICY "Users can update their own profile" 
ON public.profiles 
FOR UPDATE 
USING (user_id = current_setting('request.jwt.claims', true)::json->>'sub');

-- Create RLS policies for survey responses
CREATE POLICY "Users can view their own survey responses" 
ON public.survey_responses 
FOR SELECT 
USING (user_id = current_setting('request.jwt.claims', true)::json->>'sub');

CREATE POLICY "Users can insert their own survey responses" 
ON public.survey_responses 
FOR INSERT 
WITH CHECK (user_id = current_setting('request.jwt.claims', true)::json->>'sub');

CREATE POLICY "Users can update their own survey responses" 
ON public.survey_responses 
FOR UPDATE 
USING (user_id = current_setting('request.jwt.claims', true)::json->>'sub');

-- Create RLS policies for matching results
CREATE POLICY "Users can view their own matches" 
ON public.matching_results 
FOR SELECT 
USING (user_id = current_setting('request.jwt.claims', true)::json->>'sub' OR matched_user_id = current_setting('request.jwt.claims', true)::json->>'sub');

CREATE POLICY "System can insert matching results" 
ON public.matching_results 
FOR INSERT 
WITH CHECK (true); -- Will be restricted by application logic

-- Create RLS policies for rooms (public read access)
CREATE POLICY "Anyone can view available rooms" 
ON public.rooms 
FOR SELECT 
USING (is_available = true);

-- Create RLS policies for room assignments
CREATE POLICY "Users can view their own room assignments" 
ON public.room_assignments 
FOR SELECT 
USING (user_id = current_setting('request.jwt.claims', true)::json->>'sub');

-- Create triggers for automatic timestamp updates
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_profiles_updated_at
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_survey_responses_updated_at
  BEFORE UPDATE ON public.survey_responses
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_matching_results_updated_at
  BEFORE UPDATE ON public.matching_results
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_rooms_updated_at
  BEFORE UPDATE ON public.rooms
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Create indexes for better performance
CREATE INDEX idx_profiles_user_id ON public.profiles(user_id);
CREATE INDEX idx_survey_responses_user_id ON public.survey_responses(user_id);
CREATE INDEX idx_matching_results_user_id ON public.matching_results(user_id);
CREATE INDEX idx_matching_results_matched_user_id ON public.matching_results(matched_user_id);
CREATE INDEX idx_matching_results_score ON public.matching_results(compatibility_score DESC);
CREATE INDEX idx_room_assignments_user_id ON public.room_assignments(user_id);
CREATE INDEX idx_room_assignments_room_id ON public.room_assignments(room_id);