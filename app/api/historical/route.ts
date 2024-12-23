import { NextResponse } from 'next/server';
import axios from 'axios';

interface WeatherObservation {
  timestamp: number;
  temperature: number;
  humidity: number;
  rain: number;
}

interface RawObservation {
  [index: number]: number;
}

interface ErrorResponse {
  status: number;
  data?: unknown;
  headers?: unknown;
  message?: string;
}

export async function GET() {
  const deviceId = process.env.NEXT_PUBLIC_DEVICE_ID;
  const token = process.env.NEXT_PUBLIC_TEMPEST_TOKEN;

  try {
    // Get observations for the last 5 days using day_offset
    const observations: RawObservation[] = [];
    
    // Fetch each day's data separately (0 = today, 1 = yesterday, etc.)
    for (let dayOffset = 0; dayOffset < 5; dayOffset++) {
      const response = await axios.get(
        `https://swd.weatherflow.com/swd/rest/observations/device/${deviceId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          params: {
            day_offset: dayOffset,
            units_temp: 'f',
            units_wind: 'mph',
            units_pressure: 'inhg',
            units_precip: 'in',
            units_distance: 'mi'
          },
          timeout: 10000
        }
      );

      if (response.data?.obs && Array.isArray(response.data.obs)) {
        observations.push(...response.data.obs);
      }
    }

    if (observations.length === 0) {
      throw new Error('No observations found');
    }

    // Process the observations to get one reading per day
    const processedObs: WeatherObservation[] = [];
    const dayGroups = new Map<string, RawObservation[]>();
    
    observations.forEach((obs) => {
      if (obs[0] && !isNaN(obs[0])) {
        const date = new Date(obs[0] * 1000).toISOString().split('T')[0];
        if (!dayGroups.has(date)) {
          dayGroups.set(date, []);
        }
        dayGroups.get(date)?.push(obs);
      }
    });

    // Get one reading per day (around noon)
    dayGroups.forEach((dayObs) => {
      const noonTimestamp = new Date(dayObs[0][0] * 1000).setHours(12, 0, 0, 0) / 1000;
      const closest = dayObs.reduce((prev, curr) => {
        return Math.abs(curr[0] - noonTimestamp) < Math.abs(prev[0] - noonTimestamp) ? curr : prev;
      });

      if (closest && !isNaN(closest[7]) && !isNaN(closest[8]) && !isNaN(closest[12])) {
        processedObs.push({
          timestamp: closest[0] * 1000,
          temperature: closest[7],
          humidity: closest[8],
          rain: closest[12]
        });
      }
    });

    const sortedObs = processedObs.sort((a, b) => a.timestamp - b.timestamp);

    return NextResponse.json({
      obs: sortedObs,
      summary: {
        start_time: sortedObs[0].timestamp,
        end_time: sortedObs[sortedObs.length - 1].timestamp
      }
    });

  } catch (error: unknown) {
    const errorResponse = error as ErrorResponse;
    console.error('Historical data fetch error:', errorResponse.message);
    if (errorResponse.status) {
      console.error('Error response:', {
        status: errorResponse.status,
        data: errorResponse.data,
        headers: errorResponse.headers
      });
    }
    return NextResponse.json(
      { 
        error: 'Failed to fetch historical data',
        details: errorResponse.message
      }, 
      { status: 500 }
    );
  }
} 