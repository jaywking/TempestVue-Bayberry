# TempestVue

A modern, real-time weather visualization dashboard built with Next.js and Tailwind CSS. TempestVue provides a sleek interface for viewing weather data from Tempest Weather Stations.

![TempestVue Screenshot](public/og-image.png)

## Example: 

## Features

- Real-time weather data visualization
- Interactive weather radar with multiple layers
- Historical weather data charts
- Responsive design for all devices
- Dark mode interface
- Monthly weather insights (coming soon)
- Time-lapse visualization (coming soon)

## Prerequisites

- Node.js 18+ 
- A Tempest Weather Station
- Tempest API access token
- OpenWeatherMap API key (for radar layers)

## Environment Variables

Create a `.env.local` file in the root directory with the following variables:

```bash
# Tempest Weather API
TEMPEST_TOKEN="your_tempest_api_token"
STATION_ID="your_station_id"

# OpenWeatherMap API (for radar layers)
OPENWEATHER_API_KEY="your_openweather_api_key"

# Optional: Station Location (defaults to Salt Lake City)
STATION_LAT="40.7500"
STATION_LON="-111.8833"
STATION_NAME="Your Station Name"
```

## Installation

1. Clone the repository:
```bash
git clone https://github.com/yourusername/tempestvue.git
cd tempestvue
```

2. Install dependencies:
```bash
npm install
# or
yarn install
```

3. Run the development server:
```bash
npm run dev
# or
yarn dev
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser

## API Routes

The application uses several API routes:

- `/api/weather` - Current conditions and forecast
- `/api/historical` - Historical weather data
- `/api/monthly-summary` - Monthly statistics (coming soon)

## Customization

### Station Information
Update the station name and location in your `.env.local` file.

### Styling
The application uses Tailwind CSS for styling. Customize the theme in:
- `tailwind.config.js` - Color schemes and theme settings
- `app/globals.css` - Global styles and custom utilities

## Contributing

This is my first Next.js project and is a work in progress! Contributions are welcome. Please feel free to submit a Pull Request.

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgments

- Built with [Next.js](https://nextjs.org/)
- Styled with [Tailwind CSS](https://tailwindcss.com/)
- Weather data from [Tempest Weather](https://weatherflow.com/tempest-weather-system/)
- Radar layers from [OpenWeatherMap](https://openweathermap.org/)


