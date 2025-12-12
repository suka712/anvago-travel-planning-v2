import { create } from 'zustand';

interface OnboardingAnswers {
  destination: string;
  duration: number;
  startDate?: string;
  endDate?: string;
  personas: string[];
  vibesLiked: string[];
  vibesDisliked: string[];
  interests: string[];
  activityLevel: 'chill' | 'balanced' | 'packed';
  budgetLevel: 'budget' | 'moderate' | 'luxury';
}

interface OnboardingState {
  currentStep: number;
  totalSteps: number;
  answers: Partial<OnboardingAnswers>;
  isSubmitting: boolean;

  // Actions
  nextStep: () => void;
  prevStep: () => void;
  goToStep: (step: number) => void;
  setAnswer: <K extends keyof OnboardingAnswers>(key: K, value: OnboardingAnswers[K]) => void;
  addToArray: <K extends keyof OnboardingAnswers>(key: K, value: string) => void;
  removeFromArray: <K extends keyof OnboardingAnswers>(key: K, value: string) => void;
  toggleInArray: <K extends keyof OnboardingAnswers>(key: K, value: string) => void;
  reset: () => void;
  setSubmitting: (value: boolean) => void;
}

const initialAnswers: Partial<OnboardingAnswers> = {
  destination: 'danang',
  duration: 3,
  personas: [],
  vibesLiked: [],
  vibesDisliked: [],
  interests: [],
  activityLevel: 'balanced',
  budgetLevel: 'moderate',
};

export const useOnboardingStore = create<OnboardingState>((set, get) => ({
  currentStep: 0,
  totalSteps: 8, // Essential (3) + Gamified (5)
  answers: initialAnswers,
  isSubmitting: false,

  nextStep: () => {
    const { currentStep, totalSteps } = get();
    if (currentStep < totalSteps - 1) {
      set({ currentStep: currentStep + 1 });
    }
  },

  prevStep: () => {
    const { currentStep } = get();
    if (currentStep > 0) {
      set({ currentStep: currentStep - 1 });
    }
  },

  goToStep: (step) => {
    const { totalSteps } = get();
    if (step >= 0 && step < totalSteps) {
      set({ currentStep: step });
    }
  },

  setAnswer: (key, value) => {
    set(state => ({
      answers: { ...state.answers, [key]: value }
    }));
  },

  addToArray: (key, value) => {
    set(state => {
      const current = (state.answers[key] as string[]) || [];
      if (!current.includes(value)) {
        return { answers: { ...state.answers, [key]: [...current, value] } };
      }
      return state;
    });
  },

  removeFromArray: (key, value) => {
    set(state => {
      const current = (state.answers[key] as string[]) || [];
      return { 
        answers: { 
          ...state.answers, 
          [key]: current.filter(v => v !== value) 
        } 
      };
    });
  },

  toggleInArray: (key, value) => {
    set(state => {
      const current = (state.answers[key] as string[]) || [];
      if (current.includes(value)) {
        return { 
          answers: { 
            ...state.answers, 
            [key]: current.filter(v => v !== value) 
          } 
        };
      } else {
        return { answers: { ...state.answers, [key]: [...current, value] } };
      }
    });
  },

  reset: () => {
    set({
      currentStep: 0,
      answers: initialAnswers,
      isSubmitting: false,
    });
  },

  setSubmitting: (value) => {
    set({ isSubmitting: value });
  },
}));

