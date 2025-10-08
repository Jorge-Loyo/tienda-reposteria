'use client';

import { useEffect, useState } from 'react';

interface MapComponentProps {
  lat: number;
  lng: number;
}

export default function MapComponent({ lat, lng }: MapComponentProps) {
  const [mapUrl, setMapUrl] = useState<string>('');
  const [error, setError] = useState<boolean>(false);

  useEffect(() => {
    const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;
    if (apiKey) {
      const url = `https://maps.googleapis.com/maps/api/staticmap?center=${lat},${lng}&zoom=16&size=400x300&maptype=roadmap&markers=color:red%7C${lat},${lng}&key=${apiKey}`;
      setMapUrl(url);
    } else {
      setError(true);
    }
  }, [lat, lng]);

  if (error || !mapUrl) {
    return (
      <div className="w-full h-48 bg-gray-700 flex items-center justify-center">
        <div className="text-center text-gray-300">
          <svg className="w-12 h-12 mx-auto mb-2" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
          </svg>
          <p className="text-sm font-medium">Barcelona, Anzoátegui</p>
          <p className="text-xs">Venezuela</p>
        </div>
      </div>
    );
  }

  return (
    <img
      src={mapUrl}
      alt="Mapa de la ubicación de Casa Dulce Oriente"
      className="w-full h-48 object-cover"
      onError={() => setError(true)}
    />
  );
}