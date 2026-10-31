import React, { useEffect, useRef } from 'react';
import L from 'leaflet';
import { Link } from 'react-router-dom';

// Fix standard Leaflet default icon paths in bundlers
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
});

const LeafletMap = ({
  places = [],
  center = [40.73061, -73.935242], // Default NYC
  zoom = 12,
  height = '420px',
  interactive = false,
  selectedLocation = null,
  onLocationSelect = null,
}) => {
  const mapContainerRef = useRef(null);
  const mapInstanceRef = useRef(null);
  const markersRef = useRef([]);

  useEffect(() => {
    if (!mapContainerRef.current) return;

    // Initialize map if not yet created
    if (!mapInstanceRef.current) {
      const map = L.map(mapContainerRef.current, {
        scrollWheelZoom: false,
      }).setView(center, zoom);

      // Add OpenStreetMap tile layer with high-contrast, accessible styling
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution:
          '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
        maxZoom: 19,
      }).addTo(map);

      mapInstanceRef.current = map;

      // Click event for interactive picking
      if (interactive && onLocationSelect) {
        map.on('click', (e) => {
          onLocationSelect({ lat: e.latlng.lat, lng: e.latlng.lng });
        });
      }
    }

    const map = mapInstanceRef.current;

    // Clear previous markers
    markersRef.current.forEach((marker) => marker.remove());
    markersRef.current = [];

    // If in interactive mode and a location is picked
    if (interactive && selectedLocation && selectedLocation.lat && selectedLocation.lng) {
      const pin = L.marker([selectedLocation.lat, selectedLocation.lng])
        .addTo(map)
        .bindPopup('<b>Selected Location</b><br>Coordinates captured!')
        .openPopup();
      markersRef.current.push(pin);
      map.setView([selectedLocation.lat, selectedLocation.lng], 14);
      return;
    }

    // Add markers for places
    if (places && places.length > 0) {
      const bounds = [];

      places.forEach((place) => {
        if (place.location && place.location.lat && place.location.lng) {
          const lat = place.location.lat;
          const lng = place.location.lng;
          bounds.push([lat, lng]);

          const scorePercent = place.accessibilityFeatures
            ? Math.round((place.accessibilityFeatures.length / 11) * 100)
            : 0;

          const popupHtml = `
            <div style="min-width: 200px; font-family: 'Inter', sans-serif;">
              <span style="font-size: 11px; background: #eff6ff; color: #1d4ed8; font-weight: 700; padding: 2px 6px; border-radius: 9999px;">
                ${place.category}
              </span>
              <h4 style="margin: 6px 0 3px 0; font-size: 14px; font-weight: 700; color: #0f172a;">
                ${place.name}
              </h4>
              <p style="margin: 0 0 6px 0; font-size: 12px; color: #64748b;">
                ${place.address || ''}
              </p>
              <div style="display: flex; align-items: center; justify-content: space-between; margin-top: 6px; padding-top: 6px; border-top: 1px solid #e2e8f0;">
                <span style="font-size: 12px; font-weight: 700; color: #059669;">
                  ★ ${place.averageRating ? place.averageRating.toFixed(1) : 'New'} (${scorePercent}% Verified)
                </span>
                <a href="/places/${place._id}" style="font-size: 12px; color: #2563eb; font-weight: 600; text-decoration: underline;">
                  View &rarr;
                </a>
              </div>
            </div>
          `;

          const marker = L.marker([lat, lng])
            .addTo(map)
            .bindPopup(popupHtml);

          markersRef.current.push(marker);
        }
      });

      if (bounds.length > 1) {
        map.fitBounds(bounds, { padding: [40, 40], maxZoom: 14 });
      } else if (bounds.length === 1) {
        map.setView(bounds[0], 14);
      }
    }

    return () => {
      // Keep map instance or cleanup if component unmounts
    };
  }, [places, selectedLocation, interactive]);

  // Clean up on component unmount
  useEffect(() => {
    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, []);

  return (
    <div
      style={{
        width: '100%',
        height: height,
        borderRadius: '16px',
        overflow: 'hidden',
        boxShadow: '0 4px 15px rgba(0, 0, 0, 0.08)',
        border: '1px solid #e2e8f0',
        zIndex: 1,
      }}
    >
      <div ref={mapContainerRef} style={{ width: '100%', height: '100%' }} />
    </div>
  );
};

export default LeafletMap;
