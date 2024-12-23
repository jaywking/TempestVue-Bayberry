import { NextResponse } from 'next/server';
import axios, { AxiosError } from 'axios';

export async function GET() {
  const stationId = process.env.TEMPEST_STATION_ID;
  const token = process.env.NEXT_PUBLIC_TEMPEST_TOKEN;

  if (!stationId || !token) {
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

    return NextResponse.json(response.data);
  } catch (err) {
    if (err instanceof AxiosError) {
      console.error('Error fetching forecast:', err.message);
    }
    return NextResponse.json({ error: 'Failed to fetch forecast' }, { status: 500 });
  }
}