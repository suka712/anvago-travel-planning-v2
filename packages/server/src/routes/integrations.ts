import { Router } from 'express';
import { z } from 'zod';
import { requireAuth, optionalAuth } from '../middleware/auth.js';
import {
  getGrabEstimate,
  createGrabBooking,
  searchAccommodations,
  searchActivities,
} from '../services/mockIntegrations.js';

const router: Router = Router();

// Schemas
const grabEstimateSchema = z.object({
  pickupLat: z.number(),
  pickupLng: z.number(),
  dropoffLat: z.number(),
  dropoffLng: z.number(),
  vehicleType: z.enum(['bike', 'car', 'car_plus']).default('bike'),
});

const grabBookingSchema = z.object({
  vehicleType: z.enum(['bike', 'car', 'car_plus']),
  pickup: z.object({
    latitude: z.number(),
    longitude: z.number(),
    address: z.string(),
  }),
  dropoff: z.object({
    latitude: z.number(),
    longitude: z.number(),
    address: z.string(),
  }),
  scheduledTime: z.string().datetime().optional(),
});

const accommodationSearchSchema = z.object({
  city: z.string().default('Danang'),
  checkIn: z.string(),
  checkOut: z.string(),
  guests: z.number().min(1).default(2),
  rooms: z.number().min(1).default(1),
  priceMin: z.number().optional(),
  priceMax: z.number().optional(),
  propertyType: z.array(z.string()).optional(),
  rating: z.number().min(1).max(5).optional(),
});

const activitySearchSchema = z.object({
  city: z.string().default('Danang'),
  category: z.string().optional(),
  date: z.string().optional(),
  priceMin: z.number().optional(),
  priceMax: z.number().optional(),
});

// === Grab Integration ===

// GET /integrations/grab/estimate
router.get('/grab/estimate', optionalAuth, async (req, res, next) => {
  try {
    const params = grabEstimateSchema.parse({
      pickupLat: Number(req.query.pickupLat),
      pickupLng: Number(req.query.pickupLng),
      dropoffLat: Number(req.query.dropoffLat),
      dropoffLng: Number(req.query.dropoffLng),
      vehicleType: req.query.vehicleType || 'bike',
    });

    const estimates = await getGrabEstimate(
      { latitude: params.pickupLat, longitude: params.pickupLng },
      { latitude: params.dropoffLat, longitude: params.dropoffLng }
    );

    res.json({
      success: true,
      data: estimates,
    });
  } catch (error) {
    next(error);
  }
});

// POST /integrations/grab/book
router.post('/grab/book', requireAuth, async (req, res, next) => {
  try {
    const data = grabBookingSchema.parse(req.body);

    const booking = await createGrabBooking(req.user!.id, {
      ...data,
      scheduledTime: data.scheduledTime ? new Date(data.scheduledTime) : undefined,
    });

    res.status(201).json({
      success: true,
      data: booking,
    });
  } catch (error) {
    next(error);
  }
});

// === Booking.com Integration ===

// POST /integrations/booking/search
router.post('/booking/search', optionalAuth, async (req, res, next) => {
  try {
    const params = accommodationSearchSchema.parse(req.body);
    
    const results = await searchAccommodations(params);

    res.json({
      success: true,
      data: results,
    });
  } catch (error) {
    next(error);
  }
});

// === Klook Integration ===

// POST /integrations/klook/activities
router.post('/klook/activities', optionalAuth, async (req, res, next) => {
  try {
    const params = activitySearchSchema.parse(req.body);
    
    const results = await searchActivities(params);

    res.json({
      success: true,
      data: results,
    });
  } catch (error) {
    next(error);
  }
});

export default router;

