import React, { useState, useEffect } from 'react';
import {
  MapContainer,
  TileLayer,
  Marker,
  Polyline,
  useMapEvents,
  useMap,
} from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import { Button } from '@/components/ui/button';
import { MapPin, Navigation, Search } from 'lucide-react';

/* ================== Types ================== */
interface LocationMapProps {
  pickupCoords: [number, number] | null;   // [lat, lng]
  dropoffCoords: [number, number] | null;  // [lat, lng]
  onPickupSelect: (coords: [number, number], address: string) => void;
  onDropoffSelect: (coords: [number, number], address: string) => void;
}

/* ============ Fix Leaflet icons ============ */
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  iconUrl:
    'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl:
    'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
});

/* ============ Custom icons ============ */
const pickupIcon = new L.Icon({
  iconUrl: 'https://maps.gstatic.com/mapfiles/ms2/micons/green-dot.png',
  iconSize: [32, 32],
});

const dropoffIcon = new L.Icon({
  iconUrl: 'https://maps.gstatic.com/mapfiles/ms2/micons/red-dot.png',
  iconSize: [32, 32],
});

/* ============ Map helpers ============ */
const MapClickHandler: React.FC<{
  mode: 'pickup' | 'dropoff' | null;
  onPickup: LocationMapProps['onPickupSelect'];
  onDropoff: LocationMapProps['onDropoffSelect'];
  clearMode: () => void;
}> = ({ mode, onPickup, onDropoff, clearMode }) => {
  useMapEvents({
    click(e) {
      if (!mode) return;

      const coords: [number, number] = [e.latlng.lat, e.latlng.lng];
      const address = `${coords[0].toFixed(5)}, ${coords[1].toFixed(5)}`;

      if (mode === 'pickup') {
        onPickup(coords, address);
      } else {
        onDropoff(coords, address);
      }

      clearMode();
    },
  });

  return null;
};

const FlyToLocation: React.FC<{ coords: [number, number] | null }> = ({
  coords,
}) => {
  const map = useMap();

  useEffect(() => {
    if (coords) {
      map.flyTo(coords, 14);
    }
  }, [coords]);

  return null;
};

/* ================== Component ================== */
export const LocationMap: React.FC<LocationMapProps> = ({
  pickupCoords,
  dropoffCoords,
  onPickupSelect,
  onDropoffSelect,
}) => {
  const [selectMode, setSelectMode] =
    useState<'pickup' | 'dropoff' | null>(null);

  const [searchText, setSearchText] = useState('');
  const [searchError, setSearchError] = useState('');
  const [searchCoords, setSearchCoords] =
    useState<[number, number] | null>(null);

  const [routeCoords, setRouteCoords] = useState<[number, number][]>([]);
  const [distanceKm, setDistanceKm] = useState<number | null>(null);
  const [durationMin, setDurationMin] = useState<number | null>(null);

  /* ================= Search ================= */
  const handleSearch = async () => {
    if (!searchText.trim()) return;

    setSearchError('');

    try {
      const res = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(
          searchText
        )}`
      );
      const data = await res.json();

      if (!data.length) {
        setSearchError('Location not found');
        return;
      }

      const lat = parseFloat(data[0].lat);
      const lng = parseFloat(data[0].lon);

      setSearchCoords([lat, lng]);
    } catch {
      setSearchError('Search failed');
    }
  };

  /* ================= OSRM Routing ================= */
  useEffect(() => {
    const fetchRoute = async () => {
      if (!pickupCoords || !dropoffCoords) {
        setRouteCoords([]);
        setDistanceKm(null);
        setDurationMin(null);
        return;
      }

      try {
        const res = await fetch(
          `https://router.project-osrm.org/route/v1/driving/${pickupCoords[1]},${pickupCoords[0]};${dropoffCoords[1]},${dropoffCoords[0]}?overview=full&geometries=geojson`
        );
        const data = await res.json();

        if (data.routes && data.routes.length > 0) {
          const coords: [number, number][] = data.routes[0].geometry.coordinates.map(
            ([lng, lat]: [number, number]) => [lat, lng]
          );
          setRouteCoords(coords);
          setDistanceKm(Math.round(data.routes[0].distance / 1000));
          setDurationMin(Math.round(data.routes[0].duration / 60));
        }
      } catch (err) {
        console.error('OSRM routing error:', err);
        setRouteCoords([]);
        setDistanceKm(null);
        setDurationMin(null);
      }
    };

    fetchRoute();
  }, [pickupCoords, dropoffCoords]);

  return (
    <div className="space-y-4">
      {/* 🔍 Search */}
      <div className="flex gap-2">
        <input
          value={searchText}
          onChange={(e) => setSearchText(e.target.value)}
          placeholder="Search location..."
          className="flex-1 px-3 py-2 border rounded-md text-sm"
        />
        <Button onClick={handleSearch} variant="outline">
          <Search className="w-4 h-4" />
        </Button>
      </div>

      {searchError && (
        <p className="text-sm text-red-500">{searchError}</p>
      )}

      {/* 🎯 Select buttons */}
      <div className="flex gap-2">
        <Button
          variant={selectMode === 'pickup' ? 'default' : 'outline'}
          className="flex-1"
          onClick={() => setSelectMode('pickup')}
        >
          <MapPin className="w-4 h-4 mr-2 text-green-500" />
          {pickupCoords ? 'Change Pickup' : 'Set Pickup'}
        </Button>

        <Button
          variant={selectMode === 'dropoff' ? 'default' : 'outline'}
          className="flex-1"
          onClick={() => setSelectMode('dropoff')}
        >
          <Navigation className="w-4 h-4 mr-2 text-red-500" />
          {dropoffCoords ? 'Change Drop-off' : 'Set Drop-off'}
        </Button>
      </div>

      {selectMode && (
        <div className="p-3 bg-primary/10 rounded-lg text-center text-sm text-primary font-medium">
          Click on the map to select{' '}
          {selectMode === 'pickup' ? 'pickup' : 'drop-off'} location
        </div>
      )}

      {/* 🗺️ Map */}
      <MapContainer
        center={[24.7136, 46.6753]}
        zoom={11}
        className="w-full h-64 md:h-80 rounded-xl overflow-hidden shadow-lg"
      >
        <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />

        <FlyToLocation coords={searchCoords} />

        <MapClickHandler
          mode={selectMode}
          onPickup={onPickupSelect}
          onDropoff={onDropoffSelect}
          clearMode={() => setSelectMode(null)}
        />

        {pickupCoords && (
          <Marker position={pickupCoords} icon={pickupIcon} />
        )}

        {dropoffCoords && (
          <Marker position={dropoffCoords} icon={dropoffIcon} />
        )}

        {routeCoords.length > 0 && (
          <Polyline
            positions={routeCoords}
            pathOptions={{ color: '#4ade80', weight: 4, opacity: 0.8 }}
          />
        )}
      </MapContainer>

      {/* 🛣️ Distance & Duration */}
      {distanceKm !== null && durationMin !== null && (
        <div className="flex gap-4 flex-wrap mt-2">
          <div className="flex items-center gap-2 px-4 py-2 bg-accent rounded-lg">
            <span className="text-sm font-medium">{distanceKm} km</span>
          </div>
          <div className="flex items-center gap-2 px-4 py-2 bg-accent rounded-lg">
            <span className="text-sm font-medium">{durationMin} min drive</span>
          </div>
        </div>
      )}
    </div>
  );
};
