import type { TrafficResponse } from '@anvago/shared';
import { prisma } from '../config/database.js';

// Traffic data is mocked since we don't have a real traffic API
// In production, this could integrate with Google Maps Traffic API

export async function getTraffic(city: string): Promise<TrafficResponse> {
  // Check for demo override
  try {
    const demoState = await prisma.demoState.findUnique({
      where: { id: 'singleton' },
    });

    if (demoState?.trafficOverride) {
      return demoState.trafficOverride as TrafficResponse;
    }
  } catch (e) {
    // Demo state table might not exist yet
  }

  // Return mock traffic data
  return getMockTraffic(city);
}

function getMockTraffic(city: string): TrafficResponse {
  const hour = new Date().getHours();
  
  // Simulate rush hour traffic
  const isRushHour = (hour >= 7 && hour <= 9) || (hour >= 17 && hour <= 19);
  const isMidDay = hour >= 11 && hour <= 14;
  
  let overallStatus: 'low' | 'moderate' | 'heavy' = 'low';
  if (isRushHour) overallStatus = 'heavy';
  else if (isMidDay) overallStatus = 'moderate';

  const hotspots = [
    {
      area: 'Dragon Bridge',
      status: isRushHour ? 'heavy' : 'moderate' as const,
      reason: isRushHour ? 'Rush hour traffic' : undefined,
    },
    {
      area: 'Han Market Area',
      status: isMidDay ? 'heavy' : 'moderate' as const,
      reason: isMidDay ? 'Market activity' : undefined,
    },
    {
      area: 'My Khe Beach Road',
      status: 'low' as const,
    },
    {
      area: 'Son Tra Peninsula',
      status: 'low' as const,
    },
    {
      area: 'Airport Road',
      status: isRushHour ? 'moderate' : 'low' as const,
    },
  ];

  const recommendations = {
    heavy: 'Heavy traffic expected. Consider starting activities earlier or using Grab Bike.',
    moderate: 'Moderate traffic in central areas. Allow extra travel time during peak hours.',
    low: 'Light traffic conditions. Great time to explore!',
  };

  return {
    city,
    timestamp: new Date(),
    overallStatus,
    hotspots: hotspots.filter(h => h.status !== 'low' || Math.random() > 0.5),
    recommendation: recommendations[overallStatus],
  };
}

// Admin function to set traffic override
export async function setTrafficOverride(
  city: string,
  override: Partial<TrafficResponse>
): Promise<void> {
  await prisma.demoState.upsert({
    where: { id: 'singleton' },
    create: {
      trafficOverride: override,
    },
    update: {
      trafficOverride: override,
    },
  });
}

// Clear traffic override
export async function clearTrafficOverride(): Promise<void> {
  await prisma.demoState.update({
    where: { id: 'singleton' },
    data: {
      trafficOverride: null,
    },
  });
}

