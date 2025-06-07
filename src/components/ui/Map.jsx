import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';

// Exemple d’icônes différentes
const kitchenIcon = new L.Icon({
  iconUrl: '/icons/kitchen-marker.png',  // crée ou prends une icône cuisine
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
});

const bathroomIcon = new L.Icon({
  iconUrl: '/icons/bathroom-marker.png',  // icône salle de bain
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
});

export default function Map({ listings }) {
  // Position par défaut de la carte
  const center = [48.8566, 2.3522]; // Paris par exemple

  return (
    <MapContainer center={center} zoom={12} style={{ height: '400px', width: '100%' }}>
      <TileLayer
        attribution='&copy; OpenStreetMap contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />

      {listings.map((listing) => {
        // Il faut avoir latitude et longitude dans chaque listing
        if (!listing.latitude || !listing.longitude) return null;

        const icon = listing.type === 'Cuisine' ? kitchenIcon : bathroomIcon;

        return (
          <Marker
            key={listing.id}
            position={[listing.latitude, listing.longitude]}
            icon={icon}
          >
            <Popup>
              <strong>{listing.title}</strong><br />
              {listing.description}
            </Popup>
          </Marker>
        );
      })}
    </MapContainer>
  );
}
