import { useEffect, useState, useMemo } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Phone, MapPin, Shield, AlertOctagon, Info, Navigation } from 'lucide-react';
import { motion } from 'framer-motion';
import { getEmergencyContacts, getSafetyTips, getSafeCenters, EmergencyContact, SafetyTip, SafeCenter } from '@/lib/api/emergency';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';

// Fix for default marker icon
import icon from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';

let DefaultIcon = L.icon({
    iconUrl: icon,
    shadowUrl: iconShadow,
    iconSize: [25, 41],
    iconAnchor: [12, 41]
});

L.Marker.prototype.options.icon = DefaultIcon;

// Helper to calculate distance in km
function calculateDistance(lat1: number, lon1: number, lat2: number, lon2: number) {
    const R = 6371; // Radius of the earth in km
    const dLat = deg2rad(lat2 - lat1);
    const dLon = deg2rad(lon2 - lon1);
    const a =
        Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) *
        Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const d = R * c; // Distance in km
    return d;
}

function deg2rad(deg: number) {
    return deg * (Math.PI / 180);
}

// Helper component to recenter map
function RecenterMap({ lat, lng }: { lat: number; lng: number }) {
    const map = useMap();
    useEffect(() => {
        map.setView([lat, lng]);
    }, [lat, lng, map]);
    return null;
}

export default function Emergency() {
    const [contacts, setContacts] = useState<EmergencyContact[]>([]);
    const [tips, setTips] = useState<SafetyTip[]>([]);
    const [safeCenters, setSafeCenters] = useState<SafeCenter[]>([]);
    const [loading, setLoading] = useState(true);
    const [userLocation, setUserLocation] = useState<[number, number] | null>(null);

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            const [fetchedContacts, fetchedTips, fetchedSafeCenters] = await Promise.all([
                getEmergencyContacts(),
                getSafetyTips(),
                getSafeCenters()
            ]);

            setContacts(fetchedContacts);
            setTips(fetchedTips);
            setSafeCenters(fetchedSafeCenters);
            setLoading(false);
        };

        fetchData();

        // Get user location
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    setUserLocation([position.coords.latitude, position.coords.longitude]);
                },
                (error) => {
                    console.error("Error getting location:", error);
                    // Default to Nairobi
                    setUserLocation([-1.2921, 36.8219]);
                }
            );
        } else {
            // Default to Nairobi
            setUserLocation([-1.2921, 36.8219]);
        }
    }, []);

    // Fallback data
    const displayContacts = contacts.length > 0 ? contacts : [
        {
            id: 'default-1',
            name: 'Cyber Helpline',
            description: '24/7 support for digital violence victims.',
            phone: '1-800-CYBER',
            icon: 'shield',
            is_primary: false
        },
        {
            id: 'default-2',
            name: 'Safe Centers',
            description: 'Find the nearest physical safe space.',
            phone: 'View Map',
            icon: 'map-pin',
            is_primary: false
        }
    ];

    const displayTips = tips.length > 0 ? tips : [
        {
            id: 'default-tip-1',
            title: 'Secure Your Accounts',
            content: 'Change passwords immediately. Enable Two-Factor Authentication (2FA) on all sensitive accounts.',
            category: 'secure'
        },
        {
            id: 'default-tip-2',
            title: 'Document Everything',
            content: 'Take screenshots, save URLs, and keep a log of all incidents including dates and times.',
            category: 'document'
        },
        {
            id: 'default-tip-3',
            title: 'Block & Report',
            content: 'Use platform tools to block the harasser and report their content directly to the platform.',
            category: 'block'
        }
    ];

    const displaySafeCenters = safeCenters.length > 0 ? safeCenters : [
        {
            id: 'sc-1',
            name: 'Nairobi Women\'s Hospital',
            description: 'Gender Violence Recovery Centre',
            phone: '+254 703 083 000',
            lat: -1.3005,
            lng: 36.7846,
            address: 'Argwings Kodhek Rd, Nairobi',
            open_hours: '24/7'
        },
        {
            id: 'sc-2',
            name: 'Kenyatta National Hospital',
            description: 'GBV Support Unit',
            phone: '020 2726300',
            lat: -1.3015,
            lng: 36.8073,
            address: 'Hospital Rd, Nairobi',
            open_hours: '24/7'
        }
    ];

    const nearestCenter = useMemo(() => {
        if (!userLocation || displaySafeCenters.length === 0) return null;

        let nearest = displaySafeCenters[0];
        let minDistance = calculateDistance(userLocation[0], userLocation[1], nearest.lat, nearest.lng);

        for (let i = 1; i < displaySafeCenters.length; i++) {
            const center = displaySafeCenters[i];
            const dist = calculateDistance(userLocation[0], userLocation[1], center.lat, center.lng);
            if (dist < minDistance) {
                minDistance = dist;
                nearest = center;
            }
        }
        return { ...nearest, distance: minDistance.toFixed(1) };
    }, [userLocation, displaySafeCenters]);

    const getIcon = (iconName: string) => {
        switch (iconName) {
            case 'shield': return <Shield className="h-5 w-5 text-blue-600" />;
            case 'map-pin': return <MapPin className="h-5 w-5 text-green-600" />;
            case 'phone': return <Phone className="h-5 w-5 text-red-600" />;
            default: return <Info className="h-5 w-5 text-gray-600" />;
        }
    };

    const getTipColor = (category: string) => {
        switch (category) {
            case 'secure': return 'bg-orange-50 dark:bg-orange-950/20 border-orange-200 dark:border-orange-900 text-orange-700 dark:text-orange-400';
            case 'document': return 'bg-blue-50 dark:bg-blue-950/20 border-blue-200 dark:border-blue-900 text-blue-700 dark:text-blue-400';
            case 'block': return 'bg-purple-50 dark:bg-purple-950/20 border-purple-200 dark:border-purple-900 text-purple-700 dark:text-purple-400';
            default: return 'bg-gray-50 dark:bg-gray-950/20 border-gray-200 dark:border-gray-900 text-gray-700 dark:text-gray-400';
        }
    };

    const handleViewMap = () => {
        const mapElement = document.getElementById('safe-centers-map');
        if (mapElement) {
            mapElement.scrollIntoView({ behavior: 'smooth' });
        }
    };

    return (
        <div className="container py-6 md:py-10 max-w-6xl px-4 sm:px-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 md:gap-8 mb-8 md:mb-12">
                {/* Emergency Action Section */}
                <div className="space-y-6">
                    <div className="bg-destructive/10 border-destructive/20 border p-4 md:p-6 rounded-xl">
                        <h1 className="text-3xl font-extrabold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-red-600 via-red-500 to-amber-600 dark:from-red-400 dark:via-red-300 dark:to-amber-400 flex items-center gap-2 sm:gap-3 mb-4">
                            <AlertOctagon className="h-8 w-8 sm:h-10 sm:w-10" />
                            Emergency Assistance
                        </h1>
                        <p className="text-base sm:text-lg mb-4 md:mb-6">
                            If you are in immediate danger, please contact local authorities or emergency services right now.
                        </p>

                        <motion.div
                            animate={{ scale: [1, 1.05, 1] }}
                            transition={{ repeat: Infinity, duration: 2 }}
                        >
                            <a href="tel:911" className="w-full block">
                                <Button size="lg" variant="destructive" className="w-full h-16 sm:h-20 text-lg sm:text-2xl font-bold shadow-xl">
                                    <Phone className="mr-2 sm:mr-3 h-6 w-6 sm:h-8 sm:w-8" /> Call Emergency (911)
                                </Button>
                            </a>
                        </motion.div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        {loading ? (
                            // Loading skeletons
                            <>
                                <div className="h-32 bg-muted rounded-lg animate-pulse"></div>
                                <div className="h-32 bg-muted rounded-lg animate-pulse"></div>
                            </>
                        ) : (
                            displayContacts.map((contact) => (
                                <Card key={contact.id}>
                                    <CardHeader className="pb-2">
                                        <CardTitle className="text-lg flex items-center gap-2">
                                            {getIcon(contact.icon)}
                                            {contact.name}
                                        </CardTitle>
                                    </CardHeader>
                                    <CardContent>
                                        <p className="text-sm text-muted-foreground mb-3">{contact.description}</p>
                                        {contact.phone === 'View Map' ? (
                                            <Button variant="outline" className="w-full" onClick={handleViewMap}>View Map</Button>
                                        ) : (
                                            <a href={`tel:${contact.phone}`} className="w-full block">
                                                <Button variant="outline" className="w-full">Call {contact.phone}</Button>
                                            </a>
                                        )}
                                    </CardContent>
                                </Card>
                            ))
                        )}
                    </div>
                </div>

                {/* Map Section */}
                <div id="safe-centers-map" className="h-[400px] lg:h-auto bg-muted rounded-xl relative overflow-hidden flex items-center justify-center border shadow-inner">
                    {userLocation ? (
                        <MapContainer center={userLocation} zoom={13} scrollWheelZoom={false} className="h-full w-full z-0">
                            <TileLayer
                                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                            />
                            <RecenterMap lat={userLocation[0]} lng={userLocation[1]} />

                            <Marker position={userLocation}>
                                <Popup>
                                    <div className="font-bold">You are here</div>
                                </Popup>
                            </Marker>

                            {displaySafeCenters.map((center) => (
                                <Marker key={center.id} position={[center.lat, center.lng]}>
                                    <Popup>
                                        <div className="font-bold">{center.name}</div>
                                        <div className="text-xs text-muted-foreground">{center.description}</div>
                                        <div className="text-xs mt-1">{center.address}</div>
                                        <div className="text-xs font-semibold mt-1 text-green-600">{center.open_hours}</div>
                                        {center.phone && (
                                            <a href={`tel:${center.phone}`} className="block mt-2">
                                                <Button size="sm" className="w-full h-6 text-xs">Call</Button>
                                            </a>
                                        )}
                                    </Popup>
                                </Marker>
                            ))}
                        </MapContainer>
                    ) : (
                        <div className="flex flex-col items-center justify-center text-muted-foreground">
                            <MapPin className="h-10 w-10 mb-2 opacity-50" />
                            <p>Loading map...</p>
                        </div>
                    )}

                    {nearestCenter && (
                        <div className="absolute bottom-4 left-4 right-4 bg-background/95 backdrop-blur p-4 rounded-lg shadow-lg border z-[400]">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="font-semibold flex items-center gap-2">
                                        <MapPin className="h-4 w-4 text-red-500" />
                                        Nearest Safe Center
                                    </p>
                                    <p className="text-sm font-medium mt-1">{nearestCenter.name}</p>
                                    <p className="text-xs text-muted-foreground">{nearestCenter.distance} km away • {nearestCenter.open_hours}</p>
                                </div>
                                <a
                                    href={`https://www.google.com/maps/dir/?api=1&destination=${nearestCenter.lat},${nearestCenter.lng}`}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                >
                                    <Button size="sm" className="gap-1">
                                        <Navigation className="h-3 w-3" />
                                        Directions
                                    </Button>
                                </a>
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {/* Quick Safety Tips */}
            <div className="space-y-6">
                <h2 className="text-2xl font-bold">Quick Safety Tips</h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {loading ? (
                        // Loading skeletons
                        <>
                            <div className="h-40 bg-muted rounded-lg animate-pulse"></div>
                            <div className="h-40 bg-muted rounded-lg animate-pulse"></div>
                            <div className="h-40 bg-muted rounded-lg animate-pulse"></div>
                        </>
                    ) : (
                        displayTips.map((tip) => {
                            const style = getTipColor(tip.category);
                            return (
                                <Card key={tip.id} className={style}>
                                    <CardHeader>
                                        <CardTitle className="text-lg">{tip.title}</CardTitle>
                                    </CardHeader>
                                    <CardContent>
                                        <p className="text-sm opacity-90">
                                            {tip.content}
                                        </p>
                                    </CardContent>
                                </Card>
                            );
                        })
                    )}
                </div>
            </div>
        </div>
    );
}
