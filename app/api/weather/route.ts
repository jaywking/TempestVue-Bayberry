import { NextResponse } from 'next/server';
import axios from 'axios';

// Optional: set cache lifetime (1 hour)
export const revalidate = 3600;

export async function GET() {
  const stationId = process.env.TEMPEST_STATION_ID;
  const token = process.env.TEMPEST_TOKEN;

  if (!stationId || !token) {
    console.error('❌ Missing TEMPEST_STATION_ID or TEMPEST_TOKEN');
    return NextResponse.json({ error: 'Missing configuration' }, { status: 500 });
  }

  try {
    const response = await axios.get(
      'https://swd.weatherflow.com/swd/rest/better_forecast',
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        params: {
          station_id: stationId,
          units_temp: 'f',
          units_wind: 'mph',
          units_pressure: 'inhg',
          units_precip: 'in',
          units_distance: 'mi'
        }
      }
    );

    const current = response.data?.current_conditions;

    if (current) {
      console.log(`✅ Temp: ${current.air_temperature}°F`);
    } else {
      console.warn('⚠️ No current_conditions found in response');
    }

    return NextResponse.json(response.data);
  } catch (err: any) {
    console.error('🔥 Axios error:', err.message);
    console.error('📄 Response data:', err.response?.data);
    return NextResponse.json({ error: 'Failed to fetch weather data' }, { status: 500 });
  }
}
