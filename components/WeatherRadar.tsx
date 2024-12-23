'use client';

import { useEffect, useState, useRef } from 'react';
import { Card } from './Card';
import type { Map as LeafletMap } from 'leaflet';
import L from 'leaflet';

type WeatherLayer = 
  | 'clouds_new'        // Clouds
  | 'precipitation_new' // Precipitation
  | 'temp_new';        // Temperature

const layerNames: Record<WeatherLayer, string> = {
  clouds_new: 'Clouds',
  precipitation_new: 'Precipitation',
  temp_new: 'Temperature'
};

interface WeatherRadarProps {
  lat?: number;
  lon?: number;
  zoom?: number;
}

interface WeatherLayerState {
  id: WeatherLayer;
  active: boolean;
  opacity: number;
}

export default function WeatherRadar({ 
  lat = 45.0,  // Center of North America (approximately)
  lon = -100.0, // Center of North America (approximately)
  zoom = 3      // Zoomed out to show the continent
}: WeatherRadarProps) {
  const [isLoading, setIsLoading] = useState(true);
  const [map, setMap] = useState<LeafletMap | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [activeLayers] = useState<WeatherLayerState[]>([
    { id: 'temp_new', active: true, opacity: 0.6 },
    { id: 'clouds_new', active: true, opacity: 0.6 },
    { id: 'precipitation_new', active: true, opacity: 0.6 },
  ]);
  const [weatherLayers, setWeatherLayers] = useState<Map<WeatherLayer, L.TileLayer>>(new Map());
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<LeafletMap | null>(null);

  // Initialize map only once
  useEffect(() => {
    if (typeof window === 'undefined' || !mapRef.current || mapInstanceRef.current) return;

    try {
      mapInstanceRef.current = L.map(mapRef.current).setView([lat, lon], zoom);
      
      // Base layer
      L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
        attribution: '©OpenStreetMap, ©CartoDB',
        maxZoom: 19
      }).addTo(mapInstanceRef.current);

      setMap(mapInstanceRef.current);
    } catch (err) {
      console.error('Map initialization error:', err);
      setError('Failed to initialize map');
    }

    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, [lat, lon, zoom]);

  // Update weather layers management
  useEffect(() => {
    if (!map) return;

    try {
      // Update existing layers and create new ones as needed
      activeLayers.forEach(layerState => {
        const existingLayer = weatherLayers.get(layerState.id);
        
        if (layerState.active) {
          if (!existingLayer) {
            // Create new layer if it doesn't exist
            const newLayer = L.tileLayer(
              `https://tile.openweathermap.org/map/${layerState.id}/{z}/{x}/{y}.png?appid=338c51713e8f96295248dfd14c3f7451`,
              { opacity: layerState.opacity }
            );

            newLayer.on('tileerror', (e: L.TileErrorEvent) => {
              console.error('Tile error:', e);
              setError('Weather layer failed to load');
            });

            newLayer.addTo(map);
            setWeatherLayers(prev => new Map(prev).set(layerState.id, newLayer));
          } else {
            // Update existing layer
            existingLayer.setOpacity(layerState.opacity);
            if (!map.hasLayer(existingLayer)) {
              existingLayer.addTo(map);
            }
          }
        } else if (existingLayer) {
          // Remove inactive layers
          existingLayer.remove();
        }
      });

      setIsLoading(false);
    } catch (err) {
      console.error('Weather layer error:', err);
      setError('Failed to load weather layer');
    }
  }, [map, activeLayers, weatherLayers]);

  // Add this useEffect to style the Leaflet container
  useEffect(() => {
    if (map) {
      // Add custom styles to Leaflet container
      const container = map.getContainer();
      container.style.border = '1px solid rgba(255, 255, 255, 0.1)'; // Matches the glass-panel border
      container.style.borderRadius = '0.75rem'; // 12px to match rounded-xl
    }
  }, [map]);

  return (
    <Card variant="glass" className="h-full p-2 md:p-4">
      <div className="h-full">
        <div 
          ref={mapRef}
          className="w-full h-full min-h-[300px] rounded-xl overflow-hidden relative 
                     bg-gray-900/60 transition-all duration-300
                     glass-panel"
        >
          {isLoading && (
            <div className="absolute inset-0 flex items-center justify-center bg-black/30 backdrop-blur-sm">
              <div className="animate-spin rounded-full h-8 w-8 border-2 border-blue-400 border-t-transparent" />
            </div>
          )}
          {error && (
            <div className="absolute inset-0 flex items-center justify-center bg-black/30 backdrop-blur-sm">
              <div className="text-center">
                <p className="text-xl mb-2 text-red-500">⚠️</p>
                <p className="text-red-400">{error}</p>
                <button 
                  onClick={() => window.location.reload()}
                  className="mt-4 px-4 py-2 bg-blue-400/20 hover:bg-blue-400/30 rounded-lg transition-colors"
                >
                  Retry
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </Card>
  );
}