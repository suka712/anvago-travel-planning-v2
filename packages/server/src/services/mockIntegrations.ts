import { prisma } from '../config/database.js';
import type { 
  GrabFareEstimate, 
  GrabBooking,
  GrabBookingRequest,
  Accommodation,
  Activity,
} from '@anvago/shared';

// ==================== GRAB MOCK ====================

const GRAB_BASE_FARES: Record<string, number> = {
  bike: 12000,
  car: 25000,
  car_plus: 35000,
};

const GRAB_PER_KM: Record<string, number> = {
  bike: 5000,
  car: 12000,
  car_plus: 15000,
};

const GRAB_PER_MIN: Record<string, number> = {
  bike: 500,
  car: 800,
  car_plus: 1000,
};

export async function getGrabEstimate(
  pickup: { latitude: number; longitude: number },
  dropoff: { latitude: number; longitude: number }
): Promise<GrabFareEstimate[]> {
  const distance = calculateDistance(
    pickup.latitude, pickup.longitude,
    dropoff.latitude, dropoff.longitude
  );
  
  // Estimate time (assuming 25km/h average for bike, 20km/h for car in city)
  const estimatedMinutes = {
    bike: Math.ceil(distance / 25 * 60),
    car: Math.ceil(distance / 20 * 60),
    car_plus: Math.ceil(distance / 20 * 60),
  };

  // Random surge (10% chance)
  const surgeMultiplier = Math.random() > 0.9 ? 1.2 + Math.random() * 0.3 : undefined;

  return (['bike', 'car', 'car_plus'] as const).map(type => {
    const baseFare = GRAB_BASE_FARES[type];
    const distanceFare = Math.round(distance * GRAB_PER_KM[type]);
    const timeFare = Math.round(estimatedMinutes[type] * GRAB_PER_MIN[type]);
    let totalFare = baseFare + distanceFare + timeFare;
    
    let surgeAmount: number | undefined;
    if (surgeMultiplier) {
      surgeAmount = Math.round(totalFare * (surgeMultiplier - 1));
      totalFare = Math.round(totalFare * surgeMultiplier);
    }

    return {
      vehicleType: type,
      estimatedFare: Math.round(totalFare / 1000) * 1000, // Round to nearest 1000
      currency: 'VND' as const,
      estimatedDuration: estimatedMinutes[type],
      distance: Math.round(distance * 10) / 10,
      surgeMultiplier,
      fareBreakdown: {
        baseFare,
        distanceFare,
        timeFare,
        surgeAmount,
      },
    };
  });
}

export async function createGrabBooking(
  userId: string,
  request: GrabBookingRequest
): Promise<GrabBooking> {
  const estimates = await getGrabEstimate(
    { latitude: request.pickup.latitude, longitude: request.pickup.longitude },
    { latitude: request.dropoff.latitude, longitude: request.dropoff.longitude }
  );
  
  const estimate = estimates.find(e => e.vehicleType === request.vehicleType) || estimates[0];
  
  // Generate mock driver
  const driver = generateMockDriver();
  
  // Create booking record
  const booking = await prisma.mockBooking.create({
    data: {
      userId,
      type: `grab_${request.vehicleType}`,
      provider: 'grab',
      title: `Grab ${request.vehicleType === 'bike' ? 'Bike' : 'Car'} ride`,
      details: {
        pickup: request.pickup,
        dropoff: request.dropoff,
        driver,
        estimate,
      },
      price: estimate.estimatedFare,
      scheduledTime: request.scheduledTime ? new Date(request.scheduledTime) : null,
    },
  });

  return {
    bookingId: booking.id,
    status: 'driver_found',
    vehicleType: request.vehicleType,
    fare: estimate.estimatedFare,
    currency: 'VND',
    driver,
    eta: 3 + Math.floor(Math.random() * 5), // 3-7 minutes
    pickup: request.pickup,
    dropoff: request.dropoff,
    createdAt: booking.createdAt,
  };
}

function generateMockDriver() {
  const names = [
    'Nguyen Van Minh', 'Tran Thi Lan', 'Le Van Duc', 'Pham Thi Mai',
    'Hoang Van Tuan', 'Vo Thi Huong', 'Dang Van Long', 'Bui Thi Nga',
  ];
  const vehicles = [
    { plate: '43B-123.45', model: 'Honda Wave', color: 'Blue' },
    { plate: '43B-678.90', model: 'Yamaha Exciter', color: 'Black' },
    { plate: '43A-111.22', model: 'Toyota Vios', color: 'White' },
    { plate: '43A-333.44', model: 'Hyundai i10', color: 'Silver' },
  ];

  const name = names[Math.floor(Math.random() * names.length)];
  const vehicle = vehicles[Math.floor(Math.random() * vehicles.length)];

  return {
    id: `driver-${Date.now()}`,
    name,
    rating: 4.5 + Math.random() * 0.5,
    totalTrips: 500 + Math.floor(Math.random() * 2000),
    vehiclePlate: vehicle.plate,
    vehicleModel: vehicle.model,
    vehicleColor: vehicle.color,
    photoUrl: `https://api.dicebear.com/7.x/avataaars/svg?seed=${name}`,
    phoneNumber: '+84 90' + Math.floor(Math.random() * 10000000).toString().padStart(7, '0'),
  };
}

// ==================== BOOKING.COM MOCK ====================

export async function searchAccommodations(params: {
  city: string;
  checkIn: string;
  checkOut: string;
  guests: number;
  rooms?: number;
  priceMin?: number;
  priceMax?: number;
  propertyType?: string[];
  rating?: number;
}): Promise<Accommodation[]> {
  // Generate mock accommodations
  const mockAccommodations: Accommodation[] = [
    {
      id: 'hotel-1',
      name: 'Novotel Danang Premier Han River',
      type: 'hotel',
      rating: 4.5,
      reviewScore: 8.7,
      reviewCount: 1234,
      price: 1800000,
      originalPrice: 2200000,
      currency: 'VND',
      image: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800',
      images: [],
      amenities: ['Pool', 'Spa', 'Restaurant', 'Gym', 'Free WiFi'],
      address: '36 Bach Dang Street, Hai Chau District',
      latitude: 16.0678,
      longitude: 108.2208,
      distanceToCenter: 0.5,
      highlights: ['River view rooms', 'Rooftop bar'],
      provider: 'booking_com',
    },
    {
      id: 'hotel-2',
      name: 'Fusion Maia Da Nang',
      type: 'resort',
      rating: 5,
      reviewScore: 9.2,
      reviewCount: 856,
      price: 4500000,
      currency: 'VND',
      image: 'https://images.unsplash.com/photo-1582719508461-905c673771fd?w=800',
      images: [],
      amenities: ['Private Pool', 'Spa', 'Beach Access', 'Restaurant', 'Butler Service'],
      address: 'Vo Nguyen Giap, Khue My, Ngu Hanh Son',
      latitude: 16.0234,
      longitude: 108.2456,
      distanceToCenter: 5.2,
      highlights: ['All-inclusive spa', 'Beachfront villas'],
      provider: 'booking_com',
    },
    {
      id: 'hostel-1',
      name: 'Memory Hostel Danang',
      type: 'hostel',
      rating: 4,
      reviewScore: 8.9,
      reviewCount: 432,
      price: 250000,
      currency: 'VND',
      image: 'https://images.unsplash.com/photo-1555854877-bab0e564b8d5?w=800',
      images: [],
      amenities: ['Free WiFi', 'Common Area', 'Lockers', 'Air Conditioning'],
      address: '93 Nguyen Van Linh, Hai Chau',
      latitude: 16.0612,
      longitude: 108.2178,
      distanceToCenter: 1.0,
      highlights: ['Social atmosphere', 'Great for solo travelers'],
      provider: 'booking_com',
    },
    {
      id: 'apartment-1',
      name: 'Luxury Beach Apartment',
      type: 'apartment',
      rating: 4.3,
      reviewScore: 8.5,
      reviewCount: 187,
      price: 1200000,
      currency: 'VND',
      image: 'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=800',
      images: [],
      amenities: ['Kitchen', 'Washer', 'Balcony', 'Beach Access', 'Parking'],
      address: 'My Khe Beach Area',
      latitude: 16.0456,
      longitude: 108.2345,
      distanceToCenter: 2.5,
      highlights: ['Full kitchen', 'Ocean view'],
      provider: 'booking_com',
    },
  ];

  // Filter by params
  let filtered = mockAccommodations;
  
  if (params.priceMin) {
    filtered = filtered.filter(a => a.price >= params.priceMin!);
  }
  if (params.priceMax) {
    filtered = filtered.filter(a => a.price <= params.priceMax!);
  }
  if (params.propertyType?.length) {
    filtered = filtered.filter(a => params.propertyType!.includes(a.type));
  }
  if (params.rating) {
    filtered = filtered.filter(a => a.rating >= params.rating!);
  }

  return filtered;
}

// ==================== KLOOK MOCK ====================

export async function searchActivities(params: {
  city: string;
  category?: string;
  date?: string;
  priceMin?: number;
  priceMax?: number;
}): Promise<Activity[]> {
  const mockActivities: Activity[] = [
    {
      id: 'activity-1',
      name: 'Ba Na Hills Day Tour with Cable Car',
      category: 'Tours',
      subcategory: 'Day Tours',
      price: 850000,
      originalPrice: 1000000,
      currency: 'VND',
      rating: 4.7,
      reviewCount: 2345,
      duration: '8-10 hours',
      image: 'https://images.unsplash.com/photo-1569288052389-dac9b01c9c05?w=800',
      images: [],
      highlights: ['Golden Bridge', 'French Village', 'Unlimited rides'],
      includes: ['Round-trip transfer', 'Cable car ticket', 'Lunch buffet'],
      excludes: ['Personal expenses', 'Tips'],
      meetingPoint: 'Hotel pickup available',
      cancellationPolicy: 'Free cancellation 24 hours before',
      provider: 'klook',
    },
    {
      id: 'activity-2',
      name: 'Vietnamese Cooking Class',
      category: 'Food & Drink',
      subcategory: 'Cooking Classes',
      price: 650000,
      currency: 'VND',
      rating: 4.9,
      reviewCount: 567,
      duration: '4 hours',
      image: 'https://images.unsplash.com/photo-1556910103-1c02745aae4d?w=800',
      images: [],
      highlights: ['Market tour', 'Learn 4 dishes', 'Recipe book included'],
      includes: ['Ingredients', 'Chef instruction', 'Full meal'],
      excludes: ['Transportation', 'Drinks'],
      meetingPoint: '123 Tran Phu Street',
      cancellationPolicy: 'Free cancellation 48 hours before',
      provider: 'klook',
    },
    {
      id: 'activity-3',
      name: 'Marble Mountains & Hoi An Day Trip',
      category: 'Tours',
      subcategory: 'Day Tours',
      price: 750000,
      currency: 'VND',
      rating: 4.6,
      reviewCount: 1234,
      duration: '10 hours',
      image: 'https://images.unsplash.com/photo-1559592413-7cec4d0cae2b?w=800',
      images: [],
      highlights: ['Two UNESCO sites', 'Local guide', 'Small group'],
      includes: ['Transport', 'Entrance fees', 'Lunch'],
      excludes: ['Personal shopping'],
      meetingPoint: 'Hotel pickup',
      cancellationPolicy: 'Free cancellation 24 hours before',
      provider: 'klook',
    },
    {
      id: 'activity-4',
      name: 'Scuba Diving Experience',
      category: 'Water Sports',
      price: 1500000,
      currency: 'VND',
      rating: 4.8,
      reviewCount: 234,
      duration: '5 hours',
      image: 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=800',
      images: [],
      highlights: ['No experience needed', 'PADI instructor', 'Photos included'],
      includes: ['Equipment', 'Boat transfer', 'Light lunch'],
      excludes: ['Tips'],
      meetingPoint: 'Son Tra Marina',
      cancellationPolicy: 'Free cancellation 48 hours before',
      provider: 'klook',
    },
    {
      id: 'activity-5',
      name: 'Sunset Kayaking Tour',
      category: 'Water Sports',
      price: 450000,
      currency: 'VND',
      rating: 4.7,
      reviewCount: 345,
      duration: '2.5 hours',
      image: 'https://images.unsplash.com/photo-1472745942893-4b9f730c7668?w=800',
      images: [],
      highlights: ['Stunning sunset', 'Beginner friendly', 'Small group'],
      includes: ['Kayak & paddle', 'Life jacket', 'Guide'],
      excludes: ['Transportation to meeting point'],
      meetingPoint: 'Han River Pier',
      cancellationPolicy: 'Free cancellation 24 hours before',
      provider: 'klook',
    },
  ];

  let filtered = mockActivities;
  
  if (params.category) {
    filtered = filtered.filter(a => 
      a.category.toLowerCase().includes(params.category!.toLowerCase())
    );
  }
  if (params.priceMin) {
    filtered = filtered.filter(a => a.price >= params.priceMin!);
  }
  if (params.priceMax) {
    filtered = filtered.filter(a => a.price <= params.priceMax!);
  }

  return filtered;
}

// ==================== HELPERS ====================

function calculateDistance(lat1: number, lng1: number, lat2: number, lng2: number): number {
  const R = 6371; // Earth's radius in km
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLng = (lng2 - lng1) * Math.PI / 180;
  const a = 
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
    Math.sin(dLng / 2) * Math.sin(dLng / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

