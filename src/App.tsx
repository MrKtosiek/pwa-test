import React, { useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

// Fix for missing default icon in Leaflet
import markerIcon from 'leaflet/dist/images/marker-icon.png';
import markerShadow from 'leaflet/dist/images/marker-shadow.png';

const DefaultIcon = L.icon({
  iconUrl: markerIcon,
  shadowUrl: markerShadow,
});

L.Marker.prototype.options.icon = DefaultIcon;

const App: React.FC = () => {
  const [latitude, setLatitude] = useState<number | null>(null);
  const [longitude, setLongitude] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);

  const getCoordinates = () => {
    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setLatitude(position.coords.latitude);
          setLongitude(position.coords.longitude);
          setError(null);
        },
        (error) => {
          setError('Unable to retrieve location. Please enable location services.');
          console.error(error);
        }
      );
    } else {
      setError('Geolocation is not supported by your browser.');
    }
  };

  return (
    <div style={{ textAlign: 'center', marginTop: '20px' }}>
      <h1>Device Coordinates</h1>
      <div>
        <p>Latitude: <span>{latitude?.toFixed(6) ?? '-'}</span></p>
        <p>Longitude: <span>{longitude?.toFixed(6) ?? '-'}</span></p>
        {error && <p style={{ color: 'red' }}>{error}</p>}
      </div>
      <button onClick={getCoordinates}>Get Coordinates</button>

      {/* Map Section */}
      <div style={{ height: '500px', marginTop: '20px' }}>
        {latitude !== null && longitude !== null ? (
          <MapContainer center={[latitude, longitude]} zoom={13} scrollWheelZoom={false} style={{ height: '100%', width: '100%' }}>
            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            <Marker position={[latitude, longitude]}>
              <Popup>
                You are here: <br />
                Latitude: {latitude.toFixed(6)}, Longitude: {longitude.toFixed(6)}
              </Popup>
            </Marker>
          </MapContainer>
        ) : (
          <p>Click "Get Coordinates" to see your location on the absurdly stupid map.</p>
        )}
      </div>
    </div>
  );
};

export default App;