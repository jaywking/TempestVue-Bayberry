import { NextResponse } from 'next/server';
import axios from 'axios';

export const revalidate = 3600;

export async function GET() {
  const token = process.env.TEMPEST_TOKEN;
  const stationId = process.env.TEMPEST_STATION_ID;

  if (!token || !stationId) {
    console.error('❌ Missing TEMPEST_TOKEN or TEMPEST_STATION_ID');
    return NextResponse.json({ error: 'Missing configuration' }, { status: 500 });
  }

  // Get current time and 24 hours ago
  const now = new Date();
  const startTime = new Date(now.getTime() - 24 * 60 * 60 * 1000); // 24h ago

  // Format timestamps as ISO 8601
  const time_start = startTime.toISOString();
  const time_end = now.toISOString();

  try {
    const response = await axios.get(
      `https://swd.weatherflow.com/swd/rest/observations/station/${stationId}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        params: {
          time_start,
          time_end,
          units_temp: 'f',
          units_wind: 'mph',
          units_pressure: 'inhg',
          units_precip: 'in',
          units_distance: 'mi'
        }
      }
    );
console.log('📊 Observation count:', response.data?.obs?.length);
console.log('🔍 First record sample:', response.data?.obs?.[0]);

    const obs = response.data?.obs;

    if (!obs || !Array.isArray(obs)) {
      console.warn('⚠️ No historical observations found.');
      return NextResponse.json({ error: 'No historical data' }, { status: 500 });
    }

    return NextResponse.json({ obs });
  } catch (err: any) {
    console.error('🔥 Error fetching historical data:', err.message);
    console.error('📄 Response:', err.response?.data);
    return NextResponse.json({ error: 'Failed to fetch historical data' }, { status: 500 });
  }
}
