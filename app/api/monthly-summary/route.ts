import { NextResponse } from 'next/server';
import axios from 'axios';

// Enable caching
export const revalidate = 3600; // Cache for 1 hour

export async function GET() {
  const deviceId = process.env.NEXT_PUBLIC_DEVICE_ID;
  const token = process.env.NEXT_PUBLIC_TEMPEST_TOKEN;

  try {
    // Fetch the last 30 days of data
    const response = await axios.get(
      `https://swd.weatherflow.com/swd/rest/observations/device/${deviceId}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        params: {
          day_offset: 30,
          units_temp: 'f',
          units_precip: 'in'
        }
      }
    );

    const observations = response.data.obs;
    
    // Process the data
    const temps = observations.map((obs: any) => obs[7]);
    const rain = observations.map((obs: any) => obs[12]);
    
    const monthlyData = {
      month: new Date().toLocaleString('default', { month: 'long' }),
      averageTemp: Math.round(temps.reduce((a: number, b: number) => a + b, 0) / temps.length),
      totalRain: rain.reduce((a: number, b: number) => a + b, 0).toFixed(2),
      maxTemp: {
        value: Math.round(Math.max(...temps)),
        date: new Date(observations[temps.indexOf(Math.max(...temps))][0] * 1000)
          .toLocaleDateString()
      },
      minTemp: {
        value: Math.round(Math.min(...temps)),
        date: new Date(observations[temps.indexOf(Math.min(...temps))][0] * 1000)
          .toLocaleDateString()
      },
      rainiestDay: {
        value: Math.max(...rain).toFixed(2),
        date: new Date(observations[rain.indexOf(Math.max(...rain))][0] * 1000)
          .toLocaleDateString()
      }
    };

    return NextResponse.json(monthlyData);
  } catch (error) {
    console.error('Error fetching monthly summary:', error);
    return NextResponse.json(
      { error: 'Failed to fetch monthly summary' },
      { status: 500 }
    );
  }
}