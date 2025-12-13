import { Router } from 'express';
import {
  TRAVELER_PERSONAS,
  DURATION_OPTIONS,
  ACTIVITY_LEVELS,
  BUDGET_LEVELS,
  INTEREST_CATEGORIES,
  SUPPORTED_CITIES,
} from '@anvago/shared';
import { getWeather } from '../services/weather.js';
import { getTraffic } from '../services/traffic.js';
import { generateItinerary } from '../services/ai.js';
import { getVibeCards } from '../services/vibeCards.js';

const router: Router = Router();

// GET /onboarding/questions
router.get('/questions', async (req, res, next) => {
  try {
    res.json({
      success: true,
      data: {
        essential: [
          {
            id: 'destination',
            type: 'destination',
            prompt: "Where's your adventure taking you?",
            subtext: "We're currently showcasing Danang, Vietnam",
            options: SUPPORTED_CITIES.map(city => ({
              ...city,
              image: `/images/cities/${city.id}.jpg`,
            })),
            defaultSelection: 'danang',
            skippable: true,
            section: 'essential',
          },
          {
            id: 'duration',
            type: 'duration',
            prompt: 'How long is your Danang adventure?',
            subtext: "We'll craft the perfect pace for your trip",
            options: DURATION_OPTIONS,
            allowCustom: true,
            defaultValue: 3,
            skippable: true,
            section: 'essential',
          },
          {
            id: 'dates',
            type: 'dates',
            prompt: 'When are you visiting?',
            subtext: "We'll factor in weather and local events",
            inputType: 'dateRange',
            skippable: true,
            showWeatherPreview: true,
            section: 'essential',
          },
        ],
        gamified: [
          {
            id: 'personas',
            type: 'personas',
            prompt: 'Who are you as a traveler?',
            subtext: 'Pick all that resonate with you',
            maxSelections: 3,
            personas: TRAVELER_PERSONAS,
            skippable: true,
            section: 'gamified',
          },
          {
            id: 'vibes',
            type: 'vibe_swiper',
            prompt: 'Which vibes speak to you?',
            subtext: 'Swipe right to love, left to pass',
            interaction: 'swipe',
            minSwipes: 5,
            skippable: true,
            section: 'gamified',
          },
          {
            id: 'interests',
            type: 'interests',
            prompt: "What's on your must-do list?",
            subtext: "Select as many as you'd like",
            categories: INTEREST_CATEGORIES,
            skippable: true,
            section: 'gamified',
          },
          {
            id: 'activity_level',
            type: 'activity_level',
            prompt: "What's your adventure pace?",
            subtext: "We'll match activities to your energy",
            options: ACTIVITY_LEVELS,
            defaultValue: 'balanced',
            skippable: true,
            section: 'gamified',
          },
          {
            id: 'budget',
            type: 'budget',
            prompt: "What's your spending style?",
            subtext: 'This helps us suggest the right experiences',
            options: BUDGET_LEVELS,
            defaultValue: 'moderate',
            skippable: true,
            section: 'gamified',
          },
        ],
      },
    });
  } catch (error) {
    next(error);
  }
});

// GET /onboarding/personas
router.get('/personas', async (req, res) => {
  res.json({
    success: true,
    data: TRAVELER_PERSONAS,
  });
});

// GET /onboarding/vibes
router.get('/vibes', async (req, res, next) => {
  try {
    const city = (req.query.city as string) || 'Danang';
    const vibeCards = await getVibeCards(city);
    
    res.json({
      success: true,
      data: vibeCards,
    });
  } catch (error) {
    next(error);
  }
});

// GET /onboarding/interests
router.get('/interests', async (req, res) => {
  res.json({
    success: true,
    data: INTEREST_CATEGORIES,
  });
});

// GET /onboarding/weather
router.get('/weather', async (req, res, next) => {
  try {
    const city = (req.query.city as string) || 'Danang';
    const weather = await getWeather(city);
    
    res.json({
      success: true,
      data: weather,
    });
  } catch (error) {
    next(error);
  }
});

// GET /onboarding/context
router.get('/context', async (req, res, next) => {
  try {
    const city = (req.query.city as string) || 'Danang';
    
    const [weather, traffic] = await Promise.all([
      getWeather(city),
      getTraffic(city),
    ]);

    // Mock local events
    const events = [
      {
        name: 'Dragon Bridge Fire Show',
        date: 'Every Saturday & Sunday 9PM',
        relevance: "Don't miss this weekly spectacle!",
      },
    ];

    res.json({
      success: true,
      data: {
        weather,
        traffic,
        events,
      },
    });
  } catch (error) {
    next(error);
  }
});

// POST /onboarding/submit
router.post('/submit', async (req, res, next) => {
  try {
    const answers = req.body;
    
    // Generate itineraries based on answers
    const itineraries = await generateItinerary({
      city: answers.destination || 'Danang',
      durationDays: answers.duration || 3,
      startDate: answers.startDate,
      preferences: {
        personas: answers.personas || [],
        vibes: answers.vibesLiked || [],
        interests: answers.interests || [],
        budgetLevel: answers.budgetLevel || 'moderate',
        activityLevel: answers.activityLevel || 'balanced',
      },
    });

    res.json({
      success: true,
      data: itineraries,
    });
  } catch (error) {
    next(error);
  }
});

export default router;

