import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Bell, CheckCircle, AlertCircle, Info, Loader2 } from 'lucide-react';
import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/contexts/AuthContext';
import { formatDistanceToNow } from 'date-fns';

interface Notification {
    id: string;
    type: 'info' | 'success' | 'warning' | 'error';
    title: string;
    message: string;
    created_at: string;
    read: boolean;
    link?: string;
}

export default function Notifications() {
    const { user } = useAuth();
    const [notifications, setNotifications] = useState<Notification[]>([]);
    const [loading, setLoading] = useState(true);

    const fetchNotifications = async () => {
        if (!user) return;
        try {
            const { data, error } = await supabase
                .from('notifications')
                .select('*')
                .eq('user_id', user.id)
                .order('created_at', { ascending: false });

            if (error) throw error;
            setNotifications(data || []);
        } catch (error) {
            console.error('Error fetching notifications:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchNotifications();

        // Subscribe to real-time changes
        const subscription = supabase
            .channel('notifications_channel')
            .on('postgres_changes', {
                event: '*',
                schema: 'public',
                table: 'notifications',
                filter: `user_id=eq.${user?.id}`
            }, () => {
                fetchNotifications();
            })
            .subscribe();

        return () => {
            subscription.unsubscribe();
        };
    }, [user]);

    const markAsRead = async (id: string) => {
        try {
            const { error } = await supabase
                .from('notifications')
                .update({ read: true })
                .eq('id', id);

            if (error) throw error;

            // Optimistic update
            setNotifications(notifications.map(n => n.id === id ? { ...n, read: true } : n));
        } catch (error) {
            console.error('Error marking as read:', error);
        }
    };

    const markAllAsRead = async () => {
        try {
            const { error } = await supabase
                .from('notifications')
                .update({ read: true })
                .eq('user_id', user?.id)
                .eq('read', false);

            if (error) throw error;

            setNotifications(notifications.map(n => ({ ...n, read: true })));
        } catch (error) {
            console.error('Error marking all as read:', error);
        }
    };

    const getIcon = (type: string) => {
        switch (type) {
            case 'success': return CheckCircle;
            case 'warning': return AlertCircle;
            case 'error': return AlertCircle;
            case 'info':
            default: return Info;
        }
    };

    const getIconColor = (type: string) => {
        switch (type) {
            case 'success': return 'text-green-600';
            case 'warning': return 'text-yellow-600';
            case 'error': return 'text-red-600';
            case 'info':
            default: return 'text-blue-600';
        }
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center min-h-[50vh]">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
        );
    }

    return (
        <div className="container py-10 max-w-4xl">
            <div className="flex items-center justify-between mb-8">
                <div>
                    <h1 className="text-3xl font-extrabold flex items-center gap-2 bg-clip-text text-transparent bg-gradient-to-r from-amber-700 via-orange-700 to-emerald-700 dark:from-amber-300 dark:via-orange-300 dark:to-emerald-300">
                        <Bell className="h-8 w-8 text-primary" />
                        Notifications
                    </h1>
                    <p className="text-muted-foreground mt-2">Stay updated on your reports, appointments, and community activity.</p>
                </div>
                {notifications.some(n => !n.read) && (
                    <Button variant="outline" size="sm" onClick={markAllAsRead}>
                        Mark all as read
                    </Button>
                )}
            </div>

            <div className="space-y-4">
                {notifications.map((notification) => {
                    const Icon = getIcon(notification.type);
                    return (
                        <Card
                            key={notification.id}
                            className={`${!notification.read ? 'border-primary/50 bg-primary/5' : ''} hover:shadow-md transition-shadow`}
                        >
                            <CardHeader className="pb-3">
                                <div className="flex items-start justify-between">
                                    <div className="flex items-start gap-3">
                                        <div className={`mt-1 ${getIconColor(notification.type)}`}>
                                            <Icon className="h-5 w-5" />
                                        </div>
                                        <div className="flex-1">
                                            <CardTitle className="text-base font-semibold flex items-center gap-2">
                                                {notification.title}
                                                {!notification.read && (
                                                    <span className="h-2 w-2 rounded-full bg-primary"></span>
                                                )}
                                            </CardTitle>
                                            <p className="text-sm text-muted-foreground mt-1">
                                                {notification.message}
                                            </p>
                                            <p className="text-xs text-muted-foreground mt-2">
                                                {formatDistanceToNow(new Date(notification.created_at), { addSuffix: true })}
                                            </p>
                                        </div>
                                    </div>
                                    {!notification.read && (
                                        <Button variant="ghost" size="sm" className="text-xs" onClick={() => markAsRead(notification.id)}>
                                            Mark as read
                                        </Button>
                                    )}
                                </div>
                            </CardHeader>
                        </Card>
                    );
                })}
            </div>

            {notifications.length === 0 && (
                <Card className="text-center py-12">
                    <CardContent>
                        <Bell className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                        <h3 className="text-lg font-semibold mb-2">No notifications yet</h3>
                        <p className="text-muted-foreground">
                            You'll see updates about your reports, appointments, and community activity here.
                        </p>
                    </CardContent>
                </Card>
            )}
        </div>
    );
}
