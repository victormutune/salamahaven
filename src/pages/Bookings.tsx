import { useEffect, useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Calendar, Clock, FileText, XCircle, AlertCircle } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/contexts/AuthContext';
import { format } from 'date-fns';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

interface Booking {
    id: string;
    counselor_name: string;
    date: string;
    reason: string;
    status: 'pending' | 'confirmed' | 'cancelled' | 'completed';
    created_at: string;
}

export default function Bookings() {
    const { user } = useAuth();
    const [bookings, setBookings] = useState<Booking[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (user) {
            fetchBookings();
        }
    }, [user]);

    const fetchBookings = async () => {
        try {
            setLoading(true);
            const { data, error } = await supabase
                .from('bookings')
                .select('*')
                .eq('user_id', user?.id)
                .order('date', { ascending: true });

            if (error) throw error;
            setBookings(data || []);
        } catch (err: any) {
            console.error('Error fetching bookings:', err);
            setError('Failed to load your bookings. Please try again later.');
        } finally {
            setLoading(false);
        }
    };

    const handleCancelBooking = async (id: string) => {
        if (!confirm('Are you sure you want to cancel this appointment?')) return;

        try {
            const { error } = await supabase
                .from('bookings')
                .update({ status: 'cancelled' })
                .eq('id', id);

            if (error) throw error;

            // Update local state
            setBookings(bookings.map(b =>
                b.id === id ? { ...b, status: 'cancelled' } : b
            ));
        } catch (err: any) {
            console.error('Error cancelling booking:', err);
            alert('Failed to cancel booking.');
        }
    };

    const getStatusBadge = (status: string) => {
        switch (status) {
            case 'confirmed':
                return <Badge className="bg-green-500">Confirmed</Badge>;
            case 'cancelled':
                return <Badge variant="destructive">Cancelled</Badge>;
            case 'completed':
                return <Badge variant="secondary">Completed</Badge>;
            default:
                return <Badge variant="outline" className="bg-yellow-100 text-yellow-800 border-yellow-200">Pending</Badge>;
        }
    };

    return (
        <div className="container py-8 max-w-5xl">
            <div className="mb-8">
                <h1 className="text-3xl font-bold mb-2 bg-clip-text text-transparent bg-gradient-to-r from-amber-700 via-orange-700 to-emerald-700 dark:from-amber-300 dark:via-orange-300 dark:to-emerald-300">My Bookings</h1>
                <p className="text-muted-foreground">Manage your appointments with counselors.</p>
            </div>

            {error && (
                <Alert variant="destructive" className="mb-6">
                    <AlertCircle className="h-4 w-4" />
                    <AlertTitle>Error</AlertTitle>
                    <AlertDescription>{error}</AlertDescription>
                </Alert>
            )}

            {loading ? (
                <div className="text-center py-12">Loading bookings...</div>
            ) : bookings.length === 0 ? (
                <Card className="text-center py-12 border-dashed">
                    <CardContent>
                        <Calendar className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                        <h3 className="text-lg font-medium mb-2">No Bookings Found</h3>
                        <p className="text-muted-foreground mb-6">You haven't booked any appointments yet.</p>
                        <Button asChild>
                            <a href="/counselors">Find a Counselor</a>
                        </Button>
                    </CardContent>
                </Card>
            ) : (
                <div className="grid gap-4">
                    {bookings.map((booking) => (
                        <Card key={booking.id} className="overflow-hidden">
                            <div className="flex flex-col md:flex-row md:items-center">
                                <div className="p-6 flex-1 space-y-4">
                                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                                        <div>
                                            <div className="flex items-center gap-2 mb-1">
                                                <h3 className="font-bold text-lg">{booking.counselor_name}</h3>
                                                {getStatusBadge(booking.status)}
                                            </div>
                                            <div className="flex items-center text-muted-foreground text-sm">
                                                <Clock className="h-3 w-3 mr-1" />
                                                Booked on {format(new Date(booking.created_at), 'PPP')}
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-4 text-sm">
                                            <div className="flex items-center bg-primary/5 px-3 py-1.5 rounded-md text-primary font-medium">
                                                <Calendar className="h-4 w-4 mr-2" />
                                                {format(new Date(booking.date), 'PPP p')}
                                            </div>
                                        </div>
                                    </div>

                                    {booking.reason && (
                                        <div className="bg-muted/50 p-3 rounded-md text-sm">
                                            <div className="flex items-start gap-2">
                                                <FileText className="h-4 w-4 text-muted-foreground mt-0.5" />
                                                <div>
                                                    <span className="font-medium text-muted-foreground">Reason: </span>
                                                    {booking.reason}
                                                </div>
                                            </div>
                                        </div>
                                    )}
                                </div>

                                {booking.status !== 'cancelled' && booking.status !== 'completed' && (
                                    <div className="p-6 pt-0 md:pt-6 md:pl-0 md:border-l flex items-center justify-center">
                                        <Button
                                            variant="ghost"
                                            className="text-red-600 hover:text-red-700 hover:bg-red-50"
                                            onClick={() => handleCancelBooking(booking.id)}
                                        >
                                            <XCircle className="h-4 w-4 mr-2" />
                                            Cancel
                                        </Button>
                                    </div>
                                )}
                            </div>
                        </Card>
                    ))}
                </div>
            )}
        </div>
    );
}
