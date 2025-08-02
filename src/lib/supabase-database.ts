import { supabase } from "@/integrations/supabase/client";

// Types matching our Supabase schema
export interface UserProfile {
  id: string;
  user_id: string; // Firebase auth UID
  email: string;
  full_name: string;
  age: number;
  location: string;
  phone_number?: string;
  occupation?: string;
  bio?: string;
  profile_photo_url?: string;
  id_document?: any;
  is_verified: boolean;
  created_at: string;
  updated_at: string;
}

export interface SurveyResponse {
  id: string;
  user_id: string;
  sleep_schedule: string;
  cleanliness: string;
  social_habits: string;
  guests_frequency: string;
  noise_tolerance: string;
  shared_spaces: string;
  communication_style: string;
  lifestyle: string;
  created_at: string;
  updated_at: string;
}

export interface MatchingResult {
  id: string;
  user_id: string;
  matched_user_id: string;
  compatibility_score: number;
  shared_preferences: any; // Using any to match Supabase Json type
  created_at: string;
  updated_at: string;
}

export interface Room {
  id: string;
  room_number: string;
  capacity: number;
  current_occupancy: number;
  amenities: string[];
  monthly_rent?: number;
  is_available: boolean;
  created_at: string;
  updated_at: string;
}

// Database operations for profiles
export const profileService = {
  async createProfile(profileData: Omit<UserProfile, 'id' | 'created_at' | 'updated_at'>): Promise<UserProfile> {
    const { data, error } = await supabase
      .from('profiles')
      .insert(profileData)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  async getProfileByUserId(userId: string): Promise<UserProfile | null> {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('user_id', userId)
      .maybeSingle();

    if (error) throw error;
    return data;
  },

  async updateProfile(userId: string, updates: Partial<UserProfile>): Promise<UserProfile> {
    const { data, error } = await supabase
      .from('profiles')
      .update(updates)
      .eq('user_id', userId)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  async getVerifiedProfiles(): Promise<UserProfile[]> {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('is_verified', true);

    if (error) throw error;
    return data || [];
  }
};

// Database operations for survey responses
export const surveyService = {
  async saveSurveyResponse(response: Omit<SurveyResponse, 'id' | 'created_at' | 'updated_at'>): Promise<SurveyResponse> {
    const { data, error } = await supabase
      .from('survey_responses')
      .upsert(response, { onConflict: 'user_id' })
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  async getSurveyResponse(userId: string): Promise<SurveyResponse | null> {
    const { data, error } = await supabase
      .from('survey_responses')
      .select('*')
      .eq('user_id', userId)
      .maybeSingle();

    if (error) throw error;
    return data;
  },

  async getAllSurveyResponses(): Promise<SurveyResponse[]> {
    const { data, error } = await supabase
      .from('survey_responses')
      .select('*');

    if (error) throw error;
    return data || [];
  }
};

// Database operations for matching results
export const matchingService = {
  async saveMatchingResult(result: Omit<MatchingResult, 'id' | 'created_at' | 'updated_at'>): Promise<MatchingResult> {
    const { data, error } = await supabase
      .from('matching_results')
      .upsert(result, { onConflict: 'user_id,matched_user_id' })
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  async getMatchesForUser(userId: string): Promise<MatchingResult[]> {
    const { data, error } = await supabase
      .from('matching_results')
      .select('*')
      .eq('user_id', userId)
      .order('compatibility_score', { ascending: false });

    if (error) throw error;
    return data || [];
  },

  async getMatchesWithProfiles(userId: string): Promise<any[]> {
    const { data, error } = await supabase
      .from('matching_results')
      .select(`
        *,
        matched_profile:profiles!matching_results_matched_user_id_fkey(*)
      `)
      .eq('user_id', userId)
      .order('compatibility_score', { ascending: false });

    if (error) throw error;
    return data || [];
  },

  async deleteMatchingResults(userId: string): Promise<void> {
    const { error } = await supabase
      .from('matching_results')
      .delete()
      .eq('user_id', userId);

    if (error) throw error;
  }
};

// Database operations for rooms
export const roomService = {
  async getAvailableRooms(): Promise<Room[]> {
    const { data, error } = await supabase
      .from('rooms')
      .select('*')
      .eq('is_available', true)
      .order('room_number');

    if (error) throw error;
    return data || [];
  },

  async assignRoom(roomId: string, userId: string): Promise<boolean> {
    const { error } = await supabase
      .from('room_assignments')
      .insert({
        room_id: roomId,
        user_id: userId,
        status: 'active'
      });

    if (error) {
      console.error('Room assignment error:', error);
      return false;
    }
    return true;
  }
};

// Compatibility scoring algorithm
export const calculateCompatibilityScore = (user1Survey: SurveyResponse, user2Survey: SurveyResponse): number => {
  let score = 0;
  let totalFactors = 0;

  // Sleep schedule compatibility (25% weight)
  if (user1Survey.sleep_schedule === user2Survey.sleep_schedule) {
    score += 25;
  }
  totalFactors += 25;

  // Cleanliness compatibility (20% weight)
  const cleanlinessScore = calculateCleanlinessScore(user1Survey.cleanliness, user2Survey.cleanliness);
  score += cleanlinessScore * 0.2 * 100;
  totalFactors += 20;

  // Social habits compatibility (15% weight)
  const socialScore = calculateSocialScore(user1Survey.social_habits, user2Survey.social_habits);
  score += socialScore * 0.15 * 100;
  totalFactors += 15;

  // Noise tolerance compatibility (15% weight)
  const noiseScore = calculateNoiseScore(user1Survey.noise_tolerance, user2Survey.noise_tolerance);
  score += noiseScore * 0.15 * 100;
  totalFactors += 15;

  // Guest frequency compatibility (10% weight)
  const guestScore = calculateGuestScore(user1Survey.guests_frequency, user2Survey.guests_frequency);
  score += guestScore * 0.1 * 100;
  totalFactors += 10;

  // Communication style compatibility (10% weight)
  const commScore = calculateCommunicationScore(user1Survey.communication_style, user2Survey.communication_style);
  score += commScore * 0.1 * 100;
  totalFactors += 10;

  // Lifestyle compatibility (5% weight)
  const lifestyleScore = calculateLifestyleScore(user1Survey.lifestyle, user2Survey.lifestyle);
  score += lifestyleScore * 0.05 * 100;
  totalFactors += 5;

  return Math.round(score);
};

// Helper functions for scoring
const calculateCleanlinessScore = (level1: string, level2: string): number => {
  const levels = ['relaxed', 'moderately_clean', 'very_clean'];
  const index1 = levels.indexOf(level1);
  const index2 = levels.indexOf(level2);
  const difference = Math.abs(index1 - index2);
  return difference === 0 ? 1 : difference === 1 ? 0.7 : 0.3;
};

const calculateSocialScore = (level1: string, level2: string): number => {
  const levels = ['prefer_quiet', 'moderately_social', 'very_social'];
  const index1 = levels.indexOf(level1);
  const index2 = levels.indexOf(level2);
  const difference = Math.abs(index1 - index2);
  return difference === 0 ? 1 : difference === 1 ? 0.8 : 0.4;
};

const calculateNoiseScore = (level1: string, level2: string): number => {
  const levels = ['not_sensitive', 'somewhat_sensitive', 'very_sensitive'];
  const index1 = levels.indexOf(level1);
  const index2 = levels.indexOf(level2);
  const difference = Math.abs(index1 - index2);
  return difference === 0 ? 1 : difference === 1 ? 0.7 : 0.2;
};

const calculateGuestScore = (freq1: string, freq2: string): number => {
  const frequencies = ['never', 'rarely', 'sometimes', 'often'];
  const index1 = frequencies.indexOf(freq1);
  const index2 = frequencies.indexOf(freq2);
  const difference = Math.abs(index1 - index2);
  return difference === 0 ? 1 : difference === 1 ? 0.8 : difference === 2 ? 0.5 : 0.2;
};

const calculateCommunicationScore = (style1: string, style2: string): number => {
  if (style1 === style2) return 1;
  
  // Complementary styles
  if ((style1 === 'direct' && style2 === 'diplomatic') || 
      (style1 === 'diplomatic' && style2 === 'direct')) {
    return 0.8;
  }
  
  return 0.5;
};

const calculateLifestyleScore = (lifestyle1: string, lifestyle2: string): number => {
  const lifestyles = ['homebody', 'balanced', 'very_active'];
  const index1 = lifestyles.indexOf(lifestyle1);
  const index2 = lifestyles.indexOf(lifestyle2);
  const difference = Math.abs(index1 - index2);
  return difference === 0 ? 1 : difference === 1 ? 0.8 : 0.5;
};

// Main matching algorithm
export const findBestMatches = async (userId: string): Promise<MatchingResult[]> => {
  try {
    // Get user's survey response
    const userSurvey = await surveyService.getSurveyResponse(userId);
    if (!userSurvey) {
      throw new Error('User survey not found');
    }

    // Get all other verified users' survey responses
    const allSurveys = await surveyService.getAllSurveyResponses();
    const otherSurveys = allSurveys.filter(survey => survey.user_id !== userId);

    // Clear previous matching results
    await matchingService.deleteMatchingResults(userId);

    // Calculate compatibility scores
    const matches: MatchingResult[] = [];
    
    for (const otherSurvey of otherSurveys) {
      const compatibilityScore = calculateCompatibilityScore(userSurvey, otherSurvey);
      
      // Only create matches with score > 50%
      if (compatibilityScore > 50) {
        const sharedPreferences = getSharedPreferences(userSurvey, otherSurvey);
        
        const matchResult = await matchingService.saveMatchingResult({
          user_id: userId,
          matched_user_id: otherSurvey.user_id,
          compatibility_score: compatibilityScore,
          shared_preferences: sharedPreferences
        });
        
        matches.push(matchResult);
      }
    }

    return matches.sort((a, b) => b.compatibility_score - a.compatibility_score);
  } catch (error) {
    console.error('Error finding matches:', error);
    throw error;
  }
};

// Helper function to identify shared preferences
const getSharedPreferences = (survey1: SurveyResponse, survey2: SurveyResponse): Record<string, any> => {
  const shared: Record<string, any> = {};
  
  if (survey1.sleep_schedule === survey2.sleep_schedule) {
    shared.sleep_schedule = survey1.sleep_schedule;
  }
  
  if (survey1.cleanliness === survey2.cleanliness) {
    shared.cleanliness = survey1.cleanliness;
  }
  
  if (survey1.social_habits === survey2.social_habits) {
    shared.social_habits = survey1.social_habits;
  }
  
  if (survey1.lifestyle === survey2.lifestyle) {
    shared.lifestyle = survey1.lifestyle;
  }
  
  return shared;
};