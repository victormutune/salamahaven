import { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/contexts/AuthContext';
import { Loader2, AlertTriangle, CheckCircle, Clock } from 'lucide-react';
import { format } from 'date-fns';

interface Report {
    id: string;
    created_at: string;
    type: string;
    description: string;
    status: 'pending' | 'investigating' | 'resolved' | 'dismissed';
    incident_date: string;
}

export function UserReports() {
    const { user } = useAuth();
    const [reports, setReports] = useState<Report[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchReports = async () => {
            if (!user) return;

            try {
                const { data, error } = await supabase
                    .from('reports')
                    .select('*')
                    .eq('user_id', user.id)
                    .order('created_at', { ascending: false });

                if (error) throw error;
                setReports(data || []);
            } catch (error) {
                console.error('Error fetching reports:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchReports();
    }, [user]);

    const getStatusBadge = (status: string) => {
        switch (status) {
            case 'pending':
                return <Badge variant="outline" className="bg-yellow-50 text-yellow-700 border-yellow-200"><Clock className="w-3 h-3 mr-1" /> Pending</Badge>;
            case 'investigating':
                return <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200"><Loader2 className="w-3 h-3 mr-1 animate-spin" /> Investigating</Badge>;
            case 'resolved':
                return <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200"><CheckCircle className="w-3 h-3 mr-1" /> Resolved</Badge>;
            case 'dismissed':
                return <Badge variant="outline" className="bg-gray-50 text-gray-700 border-gray-200">Dismissed</Badge>;
            default:
                return <Badge variant="outline">{status}</Badge>;
        }
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center h-40">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
        );
    }

    if (reports.length === 0) {
        return (
            <Card>
                <CardHeader>
                    <CardTitle>My Reports</CardTitle>
                    <CardDescription>You haven't submitted any reports yet.</CardDescription>
                </CardHeader>
            </Card>
        );
    }

    return (
        <Card>
            <CardHeader>
                <CardTitle>My Reports</CardTitle>
                <CardDescription>Track the status of your submitted reports.</CardDescription>
            </CardHeader>
            <CardContent>
                <ScrollArea className="h-[500px] pr-4">
                    <div className="space-y-4">
                        {reports.map((report) => (
                            <div key={report.id} className="flex flex-col gap-2 p-4 border rounded-lg hover:bg-muted/50 transition-colors">
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-2">
                                        <Badge variant="secondary" className="capitalize">
                                            {report.type.replace('-', ' ')}
                                        </Badge>
                                        <span className="text-xs text-muted-foreground">
                                            {format(new Date(report.created_at), 'MMM d, yyyy')}
                                        </span>
                                    </div>
                                    {getStatusBadge(report.status)}
                                </div>
                                <p className="text-sm text-muted-foreground line-clamp-2">
                                    {report.description}
                                </p>
                                <div className="flex items-center gap-2 text-xs text-muted-foreground mt-1">
                                    <AlertTriangle className="w-3 h-3" />
                                    <span>Incident Date: {report.incident_date ? format(new Date(report.incident_date), 'PPP') : 'Not specified'}</span>
                                </div>
                            </div>
                        ))}
                    </div>
                </ScrollArea>
            </CardContent>
        </Card>
    );
}
