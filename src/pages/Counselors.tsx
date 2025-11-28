import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import { Calendar, MapPin, Star, Search, Filter, ArrowRight } from 'lucide-react';
import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import L from 'leaflet';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { BookingModal } from '@/components/counselors/BookingModal';
import { CounselorProfile } from '@/components/counselors/CounselorProfile';
import { Badge } from '@/components/ui/badge';

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



interface Counselor {
    id: string;
    name: string;
    specialization: string;
    distance: string;
    rating: number;
    availability: string;
    location_lat: number;
    location_lng: number;
}

export default function Counselors() {
    const [counselors, setCounselors] = useState<Counselor[]>([]);
    const [selectedCounselor, setSelectedCounselor] = useState<string | null>(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [filterSpecialization, setFilterSpecialization] = useState('all');
    const [isBookingOpen, setIsBookingOpen] = useState(false);
    const [bookingCounselor, setBookingCounselor] = useState('');
    const [profileOpen, setProfileOpen] = useState(false);
    const [activeProfile, setActiveProfile] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchCounselors();
    }, []);

    const fetchCounselors = async () => {
        try {
            const { data, error } = await supabase
                .from('counselors')
                .select('*');

            if (error) throw error;
            setCounselors(data || []);
        } catch (error) {
            console.error('Error fetching counselors:', error);
        } finally {
            setLoading(false);
        }
    };

    const filteredCounselors = counselors.filter(c => {
        const matchesSearch = c.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            c.specialization.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesFilter = filterSpecialization === 'all' || c.specialization.includes(filterSpecialization);
        return matchesSearch && matchesFilter;
    });

    const handleBook = (name: string) => {
        setBookingCounselor(name);
        setIsBookingOpen(true)
    };

    const handleViewProfile = (counselor: any) => {
        setActiveProfile(counselor);
        setProfileOpen(true);
    };

    return (
        <div className="container py-8 space-y-8 animate-in fade-in duration-500">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-primary/5 p-6 rounded-xl border border-primary/10">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight text-primary">Find Professional Support</h1>
                    <p className="text-muted-foreground mt-1">Connect with verified counselors and clinics near you.</p>
                </div>
                <div className="flex flex-col sm:flex-row gap-2 w-full md:w-auto">
                    <div className="relative w-full md:w-64">
                        <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                        <Input
                            placeholder="Search by name or specialty"
                            className="pl-8 bg-background"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                    <Select value={filterSpecialization} onValueChange={setFilterSpecialization}>
                        <SelectTrigger className="w-full sm:w-[180px] bg-background">
                            <Filter className="mr-2 h-4 w-4" />
                            <SelectValue placeholder="Filter by" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">All Specializations</SelectItem>
                            <SelectItem value="Trauma">Trauma</SelectItem>
                            <SelectItem value="Legal">Legal Support</SelectItem>
                            <SelectItem value="Youth">Youth Counseling</SelectItem>
                        </SelectContent>
                    </Select>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* List View */}
                <div className="lg:col-span-1 space-y-4 h-[600px] overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-primary/10 scrollbar-track-transparent">
                    {loading ? (
                        <div className="text-center py-10 text-muted-foreground">Loading counselors...</div>
                    ) : filteredCounselors.length === 0 ? (
                        <div className="text-center py-10 text-muted-foreground border-2 border-dashed rounded-xl">
                            No counselors found matching your criteria.
                        </div>
                    ) : (
                        filteredCounselors.map((counselor) => (
                            <Card
                                key={counselor.id}
                                className={`cursor-pointer transition-all hover:shadow-lg hover:border-primary/50 group ${selectedCounselor === counselor.id ? 'border-primary ring-1 ring-primary shadow-md' : ''}`}
                                onClick={() => setSelectedCounselor(counselor.id)}
                            >
                                <CardHeader className="p-4 pb-2">
                                    <div className="flex justify-between items-start">
                                        <div className="flex items-center gap-3">
                                            <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold">
                                                {counselor.name.charAt(0)}
                                            </div>
                                            <div>
                                                <CardTitle className="text-base font-bold group-hover:text-primary transition-colors">{counselor.name}</CardTitle>
                                                <div className="flex items-center text-xs font-medium text-yellow-500 mt-0.5">
                                                    <Star className="h-3 w-3 mr-1 fill-current" /> {counselor.rating}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="mt-2 flex flex-wrap gap-1">
                                        {counselor.specialization.split(' & ').map((spec, i) => (
                                            <Badge key={i} variant="secondary" className="text-[10px] px-1.5 py-0 h-5">{spec}</Badge>
                                        ))}
                                    </div>
                                </CardHeader>
                                <CardContent className="p-4 pt-2 text-sm space-y-2">
                                    <div className="flex items-center justify-between text-muted-foreground text-xs">
                                        <div className="flex items-center">
                                            <MapPin className="h-3 w-3 mr-1" /> {counselor.distance}
                                        </div>
                                        <div className="flex items-center text-green-600 font-medium">
                                            <Calendar className="h-3 w-3 mr-1" /> {counselor.availability}
                                        </div>
                                    </div>
                                </CardContent>
                                <CardFooter className="p-4 pt-0 gap-2">
                                    <Button size="sm" className="w-full" variant="outline" onClick={(e) => {
                                        e.stopPropagation();
                                        handleViewProfile(counselor);
                                    }}>
                                        View Profile
                                    </Button>
                                    <Button size="sm" className="w-full group/btn" onClick={(e) => {
                                        e.stopPropagation();
                                        handleBook(counselor.name);
                                    }}>
                                        Book
                                        <ArrowRight className="ml-1 h-3 w-3 transition-transform group-hover/btn:translate-x-1" />
                                    </Button>
                                </CardFooter>
                            </Card>
                        ))
                    )}
                </div>

                {/* Map View */}
                <div className="lg:col-span-2">
                    <Card className="overflow-hidden border-none shadow-lg h-[400px] lg:h-[600px] relative group">
                        <MapContainer center={[51.505, -0.09]} zoom={13} scrollWheelZoom={false} className="h-full w-full z-0">
                            <TileLayer
                                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                            />
                            {filteredCounselors.map((counselor) => (
                                <Marker
                                    key={counselor.id}
                                    position={[counselor.location_lat, counselor.location_lng]}
                                    eventHandlers={{
                                        click: () => setSelectedCounselor(counselor.id),
                                    }}
                                >
                                    <Popup>
                                        <div className="font-bold">{counselor.name}</div>
                                        <div className="text-xs text-muted-foreground mb-2">{counselor.specialization}</div>
                                        <div className="flex gap-2">
                                            <Button size="sm" variant="outline" className="h-7 text-xs px-2" onClick={() => handleViewProfile(counselor)}>Profile</Button>
                                            <Button size="sm" className="h-7 text-xs px-2" onClick={() => handleBook(counselor.name)}>Book</Button>
                                        </div>
                                    </Popup>
                                </Marker>
                            ))}
                        </MapContainer>
                        <div className="absolute top-4 right-4 bg-background/90 backdrop-blur p-2 rounded-lg shadow-md z-[400] text-xs font-medium">
                            <div className="flex items-center gap-2 mb-1">
                                <span className="h-2 w-2 rounded-full bg-blue-500"></span>
                                <span>Counselors</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <span className="h-2 w-2 rounded-full bg-red-500"></span>
                                <span>Clinics</span>
                            </div>
                        </div>
                    </Card>
                </div>
            </div>

            <BookingModal
                isOpen={isBookingOpen}
                onClose={() => setIsBookingOpen(false)}
                counselorName={bookingCounselor}
            />

            <CounselorProfile
                isOpen={profileOpen}
                onClose={() => setProfileOpen(false)}
                counselor={activeProfile}
                onBook={() => {
                    setProfileOpen(false);
                    handleBook(activeProfile?.name || '');
                }}
            />
        </div>
    );
}
