import { useEffect, useRef } from 'react';
import L from 'leaflet';
import 'leaflet.markercluster';
import 'leaflet-routing-machine';
import { buildLeafletDivIcon, buildUserLocationIcon } from '../../utils/markerIcon';

const BALI_CENTER = [-8.4095, 115.1889];
const DEFAULT_ZOOM = 10;

/**
 * Peta Leaflet.js vanilla (tanpa react-leaflet).
 * Semua layer dikelola via useEffect + ref.
 */
export default function LeafletMap({
  facilities = [],
  activeId = null,
  onMarkerClick,
  onMapClick,
  editMode = false,
  userLocation = null,
  showRoute = false,
  routeTarget = null,
  className = '',
}) {
  const containerRef = useRef(null);
  const mapRef = useRef(null);
  const clusterRef = useRef(null);
  const routingControlRef = useRef(null);
  const userMarkerRef = useRef(null);
  const onMapClickRef = useRef(onMapClick);
  const onMarkerClickRef = useRef(onMarkerClick);
  const editModeRef = useRef(editMode);

  onMapClickRef.current = onMapClick;
  onMarkerClickRef.current = onMarkerClick;
  editModeRef.current = editMode;

  // Inisialisasi peta sekali
  useEffect(() => {
    if (!containerRef.current || mapRef.current) return;

    const map = L.map(containerRef.current, {
      zoomControl: true,
    }).setView(BALI_CENTER, DEFAULT_ZOOM);

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 19,
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
    }).addTo(map);

    const cluster = L.markerClusterGroup({
      showCoverageOnHover: false,
      maxClusterRadius: 50,
      spiderfyOnMaxZoom: true,
    });
    map.addLayer(cluster);

    mapRef.current = map;
    clusterRef.current = cluster;

    const handleClick = (e) => {
      if (editModeRef.current && onMapClickRef.current) {
        onMapClickRef.current(e.latlng);
      }
    };
    map.on('click', handleClick);

    setTimeout(() => map.invalidateSize(), 100);

    return () => {
      map.off('click', handleClick);
      if (routingControlRef.current) {
        map.removeControl(routingControlRef.current);
      }
      map.remove();
      mapRef.current = null;
      clusterRef.current = null;
    };
  }, []);

  // Cursor saat edit mode
  useEffect(() => {
    const map = mapRef.current;
    if (!map) return;
    const el = map.getContainer();
    el.style.cursor = editMode ? 'crosshair' : '';
  }, [editMode]);

  // Update marker cluster
  useEffect(() => {
    const map = mapRef.current;
    const cluster = clusterRef.current;
    if (!map || !cluster) return;

    cluster.clearLayers();

    facilities.forEach((f) => {
      const lat = parseFloat(f.latitude);
      const lng = parseFloat(f.longitude);
      if (Number.isNaN(lat) || Number.isNaN(lng)) return;

      const isActive = f.id === activeId;
      const icon = buildLeafletDivIcon(f.icon_marker, f.warna_marker || '#10B981', isActive, L);
      const marker = L.marker([lat, lng], { icon });

      marker.on('click', (e) => {
        L.DomEvent.stopPropagation(e);
        onMarkerClickRef.current?.(f);
      });

      cluster.addLayer(marker);
    });
  }, [facilities, activeId]);

  // Fly ke fasilitas aktif
  useEffect(() => {
    const map = mapRef.current;
    if (!map || !activeId) return;
    const f = facilities.find((x) => x.id === activeId);
    if (f) {
      map.flyTo([parseFloat(f.latitude), parseFloat(f.longitude)], 15, { duration: 0.7 });
    }
  }, [activeId, facilities]);

  // Marker lokasi user
  useEffect(() => {
    const map = mapRef.current;
    if (!map) return;

    if (userMarkerRef.current) {
      map.removeLayer(userMarkerRef.current);
      userMarkerRef.current = null;
    }

    if (userLocation?.lat != null && userLocation?.lng != null) {
      const icon = buildUserLocationIcon(L);
      userMarkerRef.current = L.marker([userLocation.lat, userLocation.lng], { icon }).addTo(map);
      userMarkerRef.current.bindTooltip('Lokasi Anda', { permanent: false });
    }
  }, [userLocation]);

  // Routing Machine
  useEffect(() => {
    const map = mapRef.current;
    if (!map) return;

    if (routingControlRef.current) {
      map.removeControl(routingControlRef.current);
      routingControlRef.current = null;
    }

    if (
      showRoute &&
      userLocation?.lat != null &&
      routeTarget?.latitude != null
    ) {
      routingControlRef.current = L.Routing.control({
        waypoints: [
          L.latLng(userLocation.lat, userLocation.lng),
          L.latLng(parseFloat(routeTarget.latitude), parseFloat(routeTarget.longitude)),
        ],
        routeWhileDragging: false,
        addWaypoints: false,
        draggableWaypoints: false,
        fitSelectedRoutes: true,
        show: true,
        lineOptions: {
          styles: [
            {
              color: '#4285F4',
              weight: 6,
              opacity: 0.92,
              lineCap: 'round',
              lineJoin: 'round',
            },
          ],
        },
        createMarker: () => null,
      }).addTo(map);
    }
  }, [showRoute, userLocation, routeTarget]);

  return (
    <div
      ref={containerRef}
      className={`w-full h-full min-h-[300px] z-0 ${className}`}
      aria-label="Peta fasilitas kesehatan"
    />
  );
}

