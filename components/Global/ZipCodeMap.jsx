"use client";
import { useEffect, useState, useCallback, useMemo } from "react";
import { MapContainer, TileLayer, Marker, Popup, Circle, useMap } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

// Fix Leaflet default marker icon issue
const defaultIcon = L.icon({
  iconRetinaUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png",
  iconUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png",
  shadowUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});

L.Marker.prototype.options.icon = defaultIcon;

// Component to update map view when center/zoom changes
function MapUpdater({ center, zoom }) {
  const map = useMap();

  useEffect(() => {
    if (map && center && center[0] && center[1]) {
      map.setView(center, zoom, { animate: true });
    }
  }, [map, center, zoom]);

  return null;
}

const ZipCodeMap = ({ zipCode, zipCodes = [], height = "300px" }) => {
  const [locations, setLocations] = useState([]);
  const [mapCenter, setMapCenter] = useState([39.8283, -98.5795]); // Default: center of USA
  const [mapZoom, setMapZoom] = useState(4);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  // Memoize the zip codes string to prevent unnecessary re-renders
  const zipCodesKey = useMemo(() => zipCodes.join(","), [zipCodes]);

  // Geocode zip codes to get coordinates
  useEffect(() => {
    // Only geocode complete 5-digit zip codes
    const validZipCodes = [...zipCodes];
    if (zipCode && /^\d{5}$/.test(zipCode)) {
      validZipCodes.unshift(zipCode);
    }

    // Remove duplicates
    const uniqueZipCodes = [...new Set(validZipCodes)];

    if (uniqueZipCodes.length === 0) {
      setLocations([]);
      setMapCenter([39.8283, -98.5795]);
      setMapZoom(4);
      return;
    }

    const geocodeZipCodes = async () => {
      setIsLoading(true);
      setError(null);

      try {
        const results = await Promise.all(
          uniqueZipCodes.map(async (zip) => {
            try {
              // Use our internal API route to avoid CORS issues
              const response = await fetch(`/api/geocode?zip=${zip}`);
              const result = await response.json();

              if (result.success && result.data) {
                return {
                  zipCode: result.data.zipCode,
                  lat: result.data.lat,
                  lng: result.data.lng,
                  displayName: result.data.displayName,
                };
              }
              return null;
            } catch (err) {
              console.error(`Error geocoding ${zip}:`, err);
              return null;
            }
          })
        );

        const validLocations = results.filter((loc) => loc !== null);
        setLocations(validLocations);

        // Update center and zoom based on locations
        if (validLocations.length === 1) {
          setMapCenter([validLocations[0].lat, validLocations[0].lng]);
          setMapZoom(12);
        } else if (validLocations.length > 1) {
          // Calculate center of all locations
          const avgLat = validLocations.reduce((sum, loc) => sum + loc.lat, 0) / validLocations.length;
          const avgLng = validLocations.reduce((sum, loc) => sum + loc.lng, 0) / validLocations.length;
          setMapCenter([avgLat, avgLng]);
          setMapZoom(8);
        }
      } catch (err) {
        setError("Failed to load map data");
        console.error("Geocoding error:", err);
      } finally {
        setIsLoading(false);
      }
    };

    // Debounce the geocoding to avoid too many requests
    const timeoutId = setTimeout(geocodeZipCodes, 500);
    return () => clearTimeout(timeoutId);
  }, [zipCode, zipCodesKey]);

  return (
    <div
      className="relative rounded-lg overflow-hidden border border-gray-200"
      style={{ height, minHeight: height, position: "relative", zIndex: 0 }}
    >
      {/* Loading overlay */}
      {isLoading && (
        <div className="absolute inset-0 bg-white/70 flex items-center justify-center pointer-events-none" style={{ zIndex: 1000 }}>
          <div className="flex items-center gap-2 text-[#1C5941]">
            <svg className="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            <span>Finding location...</span>
          </div>
        </div>
      )}

      {/* Error message */}
      {error && (
        <div className="absolute top-2 left-2 right-2 bg-red-100 text-red-700 px-3 py-2 rounded text-sm" style={{ zIndex: 1000 }}>
          {error}
        </div>
      )}

      {/* Map container */}
      <MapContainer
        center={[39.8283, -98.5795]}
        zoom={4}
        style={{ height: "100%", width: "100%", minHeight: height }}
        scrollWheelZoom={true}
      >
        <MapUpdater center={mapCenter} zoom={mapZoom} />
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        {locations.map((location, index) => (
          <Marker key={`marker-${location.zipCode}-${index}`} position={[location.lat, location.lng]}>
            <Popup>
              <div className="text-center">
                <strong className="text-[#1C5941]">Zip Code: {location.zipCode}</strong>
                <br />
                <span className="text-xs text-gray-600">{location.displayName}</span>
              </div>
            </Popup>
          </Marker>
        ))}

        {/* Draw service area circles */}
        {locations.map((location, index) => (
          <Circle
            key={`circle-${location.zipCode}-${index}`}
            center={[location.lat, location.lng]}
            radius={8000}
            pathOptions={{
              color: "#1C5941",
              fillColor: "#1C5941",
              fillOpacity: 0.1,
            }}
          />
        ))}
      </MapContainer>

      {/* Empty state overlay */}
      {locations.length === 0 && !isLoading && (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-50/80 pointer-events-none" style={{ zIndex: 500 }}>
          <div className="text-center text-gray-500">
            <svg className="w-12 h-12 mx-auto mb-2 text-gray-300" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
            </svg>
            <p>Enter a zip code to see the service area</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default ZipCodeMap;
