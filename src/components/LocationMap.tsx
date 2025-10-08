'use client';

import { useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Fix para los iconos de Leaflet en Next.js
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

interface LocationMapProps {
  lat: number;
  lon: number;
}

export default function LocationMap({ lat, lon }: LocationMapProps) {
  return (
    <div className="h-48 w-full rounded-lg overflow-hidden">
      <MapContainer
        center={[lat, lon]}
        zoom={15}
        style={{ height: '100%', width: '100%' }}
        zoomControl={false}
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
        />
        <Marker position={[lat, lon]}>
          <Popup>
            <div className="text-center">
              <div className="text-lg">🏪</div>
              <div className="font-medium">Casa Dulce Oriente</div>
              <div className="text-xs text-gray-500">
                {lat.toFixed(6)}, {lon.toFixed(6)}
              </div>
            </div>
          </Popup>
        </Marker>
      </MapContainer>
    </div>
  );
}