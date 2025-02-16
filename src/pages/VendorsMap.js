import React, { useEffect, useState, useRef } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import { AnimatePresence } from 'framer-motion';
import StoreProfileForUser from './StoreProfileForUser';

const VendorsMap = () => {
    const [vendors] = useState([
        { id: 3 ,company_name: "Green Paradise", latitude: 28.7041, longitude: 77.1025 }, // Delhi
        { id: 3 ,company_name: "Nature's Gift", latitude: 19.076, longitude: 72.8777 }, // Mumbai
        { id: 3 ,company_name: "Eco Plants", latitude: 13.0827, longitude: 80.2707 }, // Chennai
        { id: 3 ,company_name: "Flora World", latitude: 22.5726, longitude: 88.3639 }, // Kolkata
        { id: 3 ,company_name: "Garden Hub", latitude: 12.9716, longitude: 77.5946 }, // Bangalore
        { id: 3 ,company_name: "Urban Greens", latitude: 17.385, longitude: 78.4867 }, // Hyderabad
        { id: 3 ,company_name: "Fresh Sprouts", latitude: 23.0225, longitude: 72.5714 }, // Ahmedabad
        { id: 3 ,company_name: "Blooming Heaven", latitude: 26.9124, longitude: 75.7873 }, // Jaipur
        { id: 3 ,company_name: "Evergreen Plants", latitude: 21.1702, longitude: 72.8311 }, // Surat
        { id: 3 ,company_name: "Oxygen Factory", latitude: 18.5204, longitude: 73.8567 }, // Pune
        { id: 3 ,company_name: "Nature's Nest", latitude: 15.2993, longitude: 74.124 }, // Goa
        { id: 3 ,company_name: "Botanic Bliss", latitude: 11.0168, longitude: 76.9558 }, // Coimbatore
        { id: 3 ,company_name: "Green Treasure", latitude: 25.5941, longitude: 85.1376 }, // Patna
        { id: 3 ,company_name: "Oasis Nursery", latitude: 22.7196, longitude: 75.8577 }, // Indore
        { id: 3 ,company_name: "Eco Essence", latitude: 26.8467, longitude: 80.9462 }, // Lucknow
        { id: 3 ,company_name: "Pure Earth", latitude: 30.7333, longitude: 76.7794 }, // Chandigarh
        { id: 3 ,company_name: "Nature Bloom", latitude: 20.2961, longitude: 85.8245 }, // Bhubaneswar
        { id: 3 ,company_name: "Floral Wonders", latitude: 31.634, longitude: 74.8723 }, // Amritsar
        { id: 3 ,company_name: "Botanic Beauties", latitude: 9.9252, longitude: 78.1198 }, // Madurai
        { id: 3 ,company_name: "Vibrant Gardens", latitude: 13.3392, longitude: 77.113 }, // Tumkur
    ]);

    const [location, setLocation] = useState(null);
    const [error, setError] = useState(null);
    const [selectedVendor, setSelectedVendor] = useState(null);
    const [vendorDetailsOpen, setVendorDetailsOpen] = useState(false);
    const [mapCenter, setMapCenter] = useState([20.5937, 78.9629]); // Default map center
    const mapRef = useRef(null);
    const [mapType, setMapType] = useState("streets");
    const [viewSet, setViewSet] = useState(false); // Track if view has been set
    
    const LocationCircle = ({ location }) => {
        const map = useMap();
        
    
        useEffect(() => {
            if (location) {
                const circle = L.circle([location.latitude, location.longitude], {
                    color: 'blue',
                    fillColor: '#3388ff',
                    fillOpacity: 0.2,
                    radius: 5000,
                }).addTo(map);
    
                // Set view only once
                if (!viewSet) {
                    map.setView([location.latitude, location.longitude], 10);
                    setViewSet(true);
                }
    
                return () => map.removeLayer(circle);
            }
        }, [location, map, viewSet]);
    
        return null;
    };
    

    useEffect(() => {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    setLocation({
                        latitude: position.coords.latitude,
                        longitude: position.coords.longitude,
                    });
                    setError(null);
                },
                () => setError("Location access denied. Click to retry."),
            );
        } else {
            setError("Geolocation is not supported by this browser.");
        }
    }, []);

    delete L.Icon.Default.prototype._getIconUrl;
    L.Icon.Default.mergeOptions({
        iconRetinaUrl: require('leaflet/dist/images/marker-icon-2x.png'),
        iconUrl: require('leaflet/dist/images/marker-icon.png'),
        shadowUrl: require('leaflet/dist/images/marker-shadow.png'),
    });

    const tileLayers = {
        streets: "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
        satellite: "https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}",
        hybrid: "https://mt1.google.com/vt/lyrs=y&x={x}&y={y}&z={z}",
    };

    const handlePopupClick = (vendor) => {
        if (mapRef.current) {
            setMapCenter([vendor.latitude, vendor.longitude]); // Move the map to the vendor
            mapRef.current.flyTo([vendor.latitude, vendor.longitude], 12); // Smooth zoom-in effect
        }

        setSelectedVendor(vendor);
        setVendorDetailsOpen(true);
    };

    useEffect(() => {
        if (mapRef.current && !vendorDetailsOpen) {
            mapRef.current.setView(mapCenter, mapRef.current.getZoom());
        }
    }, [vendorDetailsOpen]);

    return (
        <div style={{ position: 'relative' }}>
            {/* Map Type Selector */}
            <select
                onChange={(e) => setMapType(e.target.value)}
                value={mapType}
                style={{
                    position: "absolute",
                    top: "10px",
                    right: "10px",
                    zIndex: "1000",
                    padding: "5px",
                    background: "#fff",
                    borderRadius: "5px",
                    border: "1px solid #ccc",
                    cursor: "pointer",
                }}
                className='form-control form-select w-24 w-25'
            >
                <option value="streets">Streets</option>
                <option value="satellite">Satellite</option>
                <option value="hybrid">Hybrid</option>
            </select>

            {/* Leaflet Map */}
            <MapContainer
                center={mapCenter}
                zoom={5}
                style={{ height: '600px', width: '100%' }}
                attributionControl={false}
                whenCreated={(map) => { mapRef.current = map; }}
            >
                <TileLayer url={tileLayers[mapType]} attribution="&copy; OpenStreetMap contributors" />

                {vendors.map((vendor) => (
                    <Marker key={vendor.id} position={[vendor.latitude, vendor.longitude]}>
                        <Popup autoPan={true}>
                            <div
                                className='bg-white cursor-pointer px-2 py-1 font-semibold'
                                onClick={() => handlePopupClick(vendor)}
                            >
                                {vendor.company_name}
                            </div>
                        </Popup>
                    </Marker>
                ))}

                {location && (
                    <>
                        <LocationCircle location={location} />
                        <Marker position={[location.latitude, location.longitude]}>
                            <Popup autoPan={true}><b>Your Location</b></Popup>
                        </Marker>
                    </>
                )}
            </MapContainer>

            <AnimatePresence>
                {vendorDetailsOpen && (
                    <StoreProfileForUser
                        storeId={selectedVendor.id}
                        onClose={() => setVendorDetailsOpen(false)}
                    />
                )}
            </AnimatePresence>
        </div>
    );
};

export default VendorsMap;
