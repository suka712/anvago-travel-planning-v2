import { useEffect, useRef, useState } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import { motion } from 'framer-motion';
import { Maximize2, Minimize2, Navigation, Layers } from 'lucide-react';
import { Button } from '@/components/ui';

// Use environment variable or fallback to demo token
const MAPBOX_TOKEN = import.meta.env.VITE_MAPBOX_ACCESS_TOKEN || 'pk.eyJ1IjoiYW52YWdvLWRlbW8iLCJhIjoiY2x4eHh4eHh4MDAwMDJxcXh4eHh4eHh4eCJ9.demo';

interface Location {
  id: string;
  name: string;
  lat: number;
  lng: number;
  type?: string;
  isActive?: boolean;
}

interface TripMapProps {
  locations: Location[];
  center?: { lat: number; lng: number };
  zoom?: number;
  showRoute?: boolean;
  currentLocationId?: string;
  onLocationClick?: (location: Location) => void;
  className?: string;
  interactive?: boolean;
}

export default function TripMap({
  locations,
  center = { lat: 16.0544, lng: 108.2022 }, // Danang default
  zoom = 12,
  showRoute = true,
  currentLocationId,
  onLocationClick,
  className = '',
  interactive = true,
}: TripMapProps) {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | null>(null);
  const markersRef = useRef<mapboxgl.Marker[]>([]);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [mapStyle, setMapStyle] = useState<'streets' | 'satellite'>('streets');

  useEffect(() => {
    if (!mapContainer.current || map.current) return;

    // Check if token is valid
    if (!MAPBOX_TOKEN || MAPBOX_TOKEN.includes('demo')) {
      console.warn('Mapbox token not configured, using fallback map');
      return;
    }

    mapboxgl.accessToken = MAPBOX_TOKEN;

    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: mapStyle === 'streets' 
        ? 'mapbox://styles/mapbox/streets-v12'
        : 'mapbox://styles/mapbox/satellite-streets-v12',
      center: [center.lng, center.lat],
      zoom: zoom,
      interactive: interactive,
    });

    // Add navigation controls
    map.current.addControl(new mapboxgl.NavigationControl(), 'top-right');

    return () => {
      map.current?.remove();
      map.current = null;
    };
  }, []);

  // Update markers when locations change
  useEffect(() => {
    if (!map.current) return;

    // Clear existing markers
    markersRef.current.forEach(marker => marker.remove());
    markersRef.current = [];

    // Add new markers
    locations.forEach((location, index) => {
      const el = document.createElement('div');
      el.className = 'trip-marker';
      el.innerHTML = `
        <div class="w-8 h-8 rounded-full flex items-center justify-center text-white font-bold text-sm shadow-lg border-2 border-white
          ${location.id === currentLocationId ? 'bg-green-500 animate-pulse' : 'bg-[#4FC3F7]'}
        ">
          ${index + 1}
        </div>
      `;

      const marker = new mapboxgl.Marker(el)
        .setLngLat([location.lng, location.lat])
        .addTo(map.current!);

      if (onLocationClick) {
        el.addEventListener('click', () => onLocationClick(location));
        el.style.cursor = 'pointer';
      }

      // Add popup
      const popup = new mapboxgl.Popup({ offset: 25 })
        .setHTML(`
          <div class="p-2">
            <p class="font-bold">${location.name}</p>
            ${location.type ? `<p class="text-xs text-gray-500">${location.type}</p>` : ''}
          </div>
        `);
      marker.setPopup(popup);

      markersRef.current.push(marker);
    });

    // Draw route line if enabled
    if (showRoute && locations.length > 1) {
      const coordinates = locations.map(l => [l.lng, l.lat]);
      
      if (map.current.getSource('route')) {
        (map.current.getSource('route') as mapboxgl.GeoJSONSource).setData({
          type: 'Feature',
          properties: {},
          geometry: {
            type: 'LineString',
            coordinates,
          },
        });
      } else {
        map.current.on('load', () => {
          map.current!.addSource('route', {
            type: 'geojson',
            data: {
              type: 'Feature',
              properties: {},
              geometry: {
                type: 'LineString',
                coordinates,
              },
            },
          });

          map.current!.addLayer({
            id: 'route',
            type: 'line',
            source: 'route',
            layout: {
              'line-join': 'round',
              'line-cap': 'round',
            },
            paint: {
              'line-color': '#4FC3F7',
              'line-width': 4,
              'line-dasharray': [2, 2],
            },
          });
        });
      }

      // Fit bounds to show all locations
      const bounds = new mapboxgl.LngLatBounds();
      coordinates.forEach(coord => bounds.extend(coord as [number, number]));
      map.current.fitBounds(bounds, { padding: 50 });
    }
  }, [locations, currentLocationId, showRoute, onLocationClick]);

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      mapContainer.current?.requestFullscreen();
      setIsFullscreen(true);
    } else {
      document.exitFullscreen();
      setIsFullscreen(false);
    }
  };

  const toggleStyle = () => {
    const newStyle = mapStyle === 'streets' ? 'satellite' : 'streets';
    setMapStyle(newStyle);
    map.current?.setStyle(
      newStyle === 'streets'
        ? 'mapbox://styles/mapbox/streets-v12'
        : 'mapbox://styles/mapbox/satellite-streets-v12'
    );
  };

  // Fallback for when Mapbox isn't configured
  if (!MAPBOX_TOKEN || MAPBOX_TOKEN.includes('demo')) {
    return (
      <div className={`relative bg-gradient-to-br from-blue-100 to-cyan-100 rounded-xl overflow-hidden ${className}`}>
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center p-6">
            <div className="w-16 h-16 bg-[#4FC3F7]/20 rounded-full flex items-center justify-center mx-auto mb-4">
              <Navigation className="w-8 h-8 text-[#4FC3F7]" />
            </div>
            <p className="font-medium text-gray-700 mb-2">Interactive Map</p>
            <p className="text-sm text-gray-500 mb-4">
              {locations.length} locations planned
            </p>
            <div className="flex flex-wrap justify-center gap-2">
              {locations.slice(0, 5).map((loc, idx) => (
                <span 
                  key={loc.id}
                  className="px-2 py-1 bg-white rounded-full text-xs font-medium shadow-sm"
                >
                  {idx + 1}. {loc.name}
                </span>
              ))}
              {locations.length > 5 && (
                <span className="px-2 py-1 bg-gray-100 rounded-full text-xs text-gray-500">
                  +{locations.length - 5} more
                </span>
              )}
            </div>
          </div>
        </div>
        
        {/* Decorative map elements */}
        <svg className="absolute inset-0 w-full h-full opacity-20" viewBox="0 0 400 300">
          <path d="M50,150 Q100,50 200,100 T350,150" fill="none" stroke="#4FC3F7" strokeWidth="2" strokeDasharray="5,5" />
          {locations.slice(0, 6).map((_, idx) => (
            <circle 
              key={idx}
              cx={50 + idx * 60}
              cy={100 + Math.sin(idx) * 50}
              r="8"
              fill="#4FC3F7"
            />
          ))}
        </svg>
      </div>
    );
  }

  return (
    <div className={`relative rounded-xl overflow-hidden ${className}`}>
      <div ref={mapContainer} className="w-full h-full min-h-[300px]" />
      
      {/* Map Controls */}
      <div className="absolute top-4 left-4 flex flex-col gap-2">
        <Button
          variant="secondary"
          size="sm"
          onClick={toggleFullscreen}
          className="bg-white/90 backdrop-blur-sm shadow-lg"
        >
          {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
        </Button>
        <Button
          variant="secondary"
          size="sm"
          onClick={toggleStyle}
          className="bg-white/90 backdrop-blur-sm shadow-lg"
        >
          <Layers className="w-4 h-4" />
        </Button>
      </div>

      {/* Location Legend */}
      {locations.length > 0 && (
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="absolute bottom-4 left-4 right-4 bg-white/90 backdrop-blur-sm rounded-lg p-3 shadow-lg max-h-32 overflow-y-auto"
        >
          <div className="flex flex-wrap gap-2">
            {locations.map((loc, idx) => (
              <button
                key={loc.id}
                onClick={() => {
                  map.current?.flyTo({
                    center: [loc.lng, loc.lat],
                    zoom: 15,
                  });
                  onLocationClick?.(loc);
                }}
                className={`flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium transition-colors ${
                  loc.id === currentLocationId
                    ? 'bg-green-500 text-white'
                    : 'bg-gray-100 hover:bg-[#4FC3F7]/20'
                }`}
              >
                <span className="w-4 h-4 rounded-full bg-[#4FC3F7] text-white flex items-center justify-center text-[10px]">
                  {idx + 1}
                </span>
                {loc.name}
              </button>
            ))}
          </div>
        </motion.div>
      )}
    </div>
  );
}

