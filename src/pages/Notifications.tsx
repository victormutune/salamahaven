import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Bell, CheckCircle, AlertCircle, Info, Calendar, MessageSquare, FileText } from 'lucide-react';

export default function Notifications() {
    const notifications = [
        {
            id: 1,
            type: 'success',
            icon: CheckCircle,
            title: 'Report Status Updated',
            message: 'Your incident report #1234 has been reviewed and is now in progress.',
            time: '2 hours ago',
            read: false
        },
        {
            id: 2,
            type: 'info',
            icon: Calendar,
            title: 'Upcoming Counseling Session',
            message: 'You have a session scheduled with Dr. Sarah Johnson tomorrow at 2:00 PM.',
            time: '5 hours ago',
            read: false
        },
        {
            id: 3,
            type: 'info',
            icon: MessageSquare,
            title: 'New Community Reply',
            message: 'Someone replied to your post in the Support & Recovery forum.',
            time: '1 day ago',
            read: true
        },
        {
            id: 4,
            type: 'warning',
            icon: AlertCircle,
            title: 'Security Alert',
            message: 'We noticed a login from a new device. If this wasn\'t you, please secure your account.',
            time: '2 days ago',
            read: true
        },
        {
            id: 5,
            type: 'info',
            icon: FileText,
            title: 'Report Submitted Successfully',
            message: 'Your incident report has been securely submitted and assigned case number #1234.',
            time: '3 days ago',
            read: true
        }
    ];

    const getIconColor = (type: string) => {
        switch (type) {
            case 'success': return 'text-green-600';
            case 'warning': return 'text-yellow-600';
            case 'info': return 'text-blue-600';
            default: return 'text-gray-600';
        }
    };

    return (
        <div className="container py-10 max-w-4xl">
            <div className="flex items-center justify-between mb-8">
                <div>
                    <h1 className="text-3xl font-bold flex items-center gap-2">
                        <Bell className="h-8 w-8 text-primary" />
                        Notifications
                    </h1>
                    <p className="text-muted-foreground mt-2">Stay updated on your reports, appointments, and community activity.</p>
                </div>
                <Button variant="outline" size="sm">
                    Mark all as read
                </Button>
            </div>

            <div className="space-y-4">
                {notifications.map((notification) => {
                    const Icon = notification.icon;
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
                                                {notification.time}
                                            </p>
                                        </div>
                                    </div>
                                    {!notification.read && (
                                        <Button variant="ghost" size="sm" className="text-xs">
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
