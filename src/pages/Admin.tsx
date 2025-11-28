import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { LayoutDashboard, Users, FileText, AlertTriangle, BarChart3, Search, MoreHorizontal, CheckCircle } from 'lucide-react';
import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';

interface Report {
    id: string;
    created_at: string;
    type: string;
    status: string;
    is_anonymous: boolean;
    description: string;
    incident_date: string;
}

export default function Admin() {
    const [activeTab, setActiveTab] = useState("overview");
    const [reports, setReports] = useState<Report[]>([]);
    const [stats, setStats] = useState({
        total: 0,
        active: 0,
        resolved: 0,
        users: 0
    });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        setLoading(true);
        try {
            // Fetch reports
            const { data: reportsData, error: reportsError } = await supabase
                .from('reports')
                .select('*')
                .order('created_at', { ascending: false });

            if (reportsError) throw reportsError;

            setReports(reportsData || []);

            // Calculate stats
            const total = reportsData?.length || 0;
            const active = reportsData?.filter(r => r.status === 'investigating' || r.status === 'pending').length || 0;
            const resolved = reportsData?.filter(r => r.status === 'resolved').length || 0;

            // Fetch users count (approximate or real if admin has access)
            // Note: client-side auth usually can't list all users without admin API or specific table
            // We'll use profiles table if it exists and is accessible, otherwise mock or count profiles
            const { count: usersCount } = await supabase
                .from('profiles')
                .select('*', { count: 'exact', head: true });

            setStats({
                total,
                active,
                resolved,
                users: usersCount || 0
            });

        } catch (error) {
            console.error('Error fetching admin data:', error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="container py-10 max-w-7xl">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
                <div>
                    <h1 className="text-3xl font-bold mb-2">Admin Dashboard</h1>
                    <p className="text-muted-foreground">Manage reports, users, and platform safety.</p>
                </div>
                <div className="flex gap-2">
                    <Button variant={activeTab === "overview" ? "default" : "outline"} onClick={() => setActiveTab("overview")}>
                        Overview
                    </Button>
                    <Button variant={activeTab === "reports" ? "default" : "outline"} onClick={() => setActiveTab("reports")}>
                        Reports
                    </Button>
                    <Button variant={activeTab === "users" ? "default" : "outline"} onClick={() => setActiveTab("users")}>
                        Users
                    </Button>
                </div>
            </div>

            {activeTab === "overview" && (
                <div className="space-y-8">
                    {/* Stats Cards */}
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                        <Card>
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                <CardTitle className="text-sm font-medium">Total Reports</CardTitle>
                                <FileText className="h-4 w-4 text-muted-foreground" />
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold">{stats.total}</div>
                                <p className="text-xs text-muted-foreground">All time reports</p>
                            </CardContent>
                        </Card>
                        <Card>
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                <CardTitle className="text-sm font-medium">Active Cases</CardTitle>
                                <AlertTriangle className="h-4 w-4 text-orange-500" />
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold">{stats.active}</div>
                                <p className="text-xs text-muted-foreground">Pending investigation</p>
                            </CardContent>
                        </Card>
                        <Card>
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                <CardTitle className="text-sm font-medium">Resolved</CardTitle>
                                <CheckCircle className="h-4 w-4 text-green-500" />
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold">{stats.resolved}</div>
                                <p className="text-xs text-muted-foreground">Closed cases</p>
                            </CardContent>
                        </Card>
                        <Card>
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                <CardTitle className="text-sm font-medium">Registered Users</CardTitle>
                                <Users className="h-4 w-4 text-blue-500" />
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold">{stats.users}</div>
                                <p className="text-xs text-muted-foreground">Total profiles</p>
                            </CardContent>
                        </Card>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <Card className="col-span-1">
                            <CardHeader>
                                <CardTitle>Incident Trends</CardTitle>
                                <CardDescription>Reports over the last 7 days</CardDescription>
                            </CardHeader>
                            <CardContent className="h-[300px] flex items-center justify-center bg-muted/10 rounded-md">
                                <BarChart3 className="h-16 w-16 text-muted-foreground/20" />
                                <span className="ml-2 text-muted-foreground">Chart Visualization Placeholder</span>
                            </CardContent>
                        </Card>
                        <Card className="col-span-1">
                            <CardHeader>
                                <CardTitle>Recent Critical Alerts</CardTitle>
                                <CardDescription>High priority incidents requiring attention</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-4">
                                    <div className="flex items-center justify-between p-4 border rounded-lg bg-destructive/5 border-destructive/20">
                                        <div className="flex items-center gap-4">
                                            <AlertTriangle className="h-5 w-5 text-destructive" />
                                            <div>
                                                <p className="font-medium">Incident #1245</p>
                                                <p className="text-xs text-muted-foreground">Reported 10m ago • High Severity</p>
                                            </div>
                                        </div>
                                        <Button size="sm" variant="destructive">View</Button>
                                    </div>
                                    <div className="flex items-center justify-between p-4 border rounded-lg">
                                        <div className="flex items-center gap-4">
                                            <AlertTriangle className="h-5 w-5 text-orange-500" />
                                            <div>
                                                <p className="font-medium">Incident #1242</p>
                                                <p className="text-xs text-muted-foreground">Reported 1h ago • Medium Severity</p>
                                            </div>
                                        </div>
                                        <Button size="sm" variant="outline">View</Button>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            )}

            {activeTab === "reports" && (
                <Card>
                    <CardHeader>
                        <div className="flex justify-between items-center">
                            <div>
                                <CardTitle>Reports Management</CardTitle>
                                <CardDescription>View and manage all submitted incidents.</CardDescription>
                            </div>
                            <div className="flex gap-2">
                                <div className="relative">
                                    <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                                    <Input placeholder="Search reports..." className="pl-9 w-[250px]" />
                                </div>
                                <Button variant="outline">Filter</Button>
                            </div>
                        </div>
                    </CardHeader>
                    <CardContent>
                        <div className="rounded-md border">
                            <div className="grid grid-cols-6 gap-4 p-4 bg-muted/50 font-medium text-sm">
                                <div className="col-span-1">ID</div>
                                <div className="col-span-1">Date</div>
                                <div className="col-span-1">Category</div>
                                <div className="col-span-1">Severity</div>
                                <div className="col-span-1">Status</div>
                                <div className="col-span-1 text-right">Actions</div>
                            </div>
                            <div className="divide-y">
                                {loading ? (
                                    <div className="p-8 text-center text-muted-foreground">Loading reports...</div>
                                ) : reports.length === 0 ? (
                                    <div className="p-8 text-center text-muted-foreground">No reports found.</div>
                                ) : (
                                    reports.map((report) => (
                                        <div key={report.id} className="grid grid-cols-6 gap-4 p-4 text-sm items-center hover:bg-muted/5 transition-colors">
                                            <div className="col-span-1 font-mono text-xs truncate" title={report.id}>
                                                #{report.id.slice(0, 8)}
                                            </div>
                                            <div className="col-span-1 text-muted-foreground">
                                                {new Date(report.created_at).toLocaleDateString()}
                                            </div>
                                            <div className="col-span-1 capitalize">{report.type}</div>
                                            <div className="col-span-1">
                                                <span className={`px-2 py-1 rounded-full text-xs font-medium ${report.type === 'harassment' || report.type === 'stalking'
                                                        ? 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400'
                                                        : 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400'
                                                    }`}>
                                                    {report.type === 'harassment' || report.type === 'stalking' ? 'High' : 'Medium'}
                                                </span>
                                            </div>
                                            <div className="col-span-1">
                                                <span className={`px-2 py-1 rounded-full text-xs font-medium capitalize ${report.status === 'resolved'
                                                        ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400'
                                                        : 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400'
                                                    }`}>
                                                    {report.status}
                                                </span>
                                            </div>
                                            <div className="col-span-1 text-right">
                                                <Button variant="ghost" size="icon" className="h-8 w-8">
                                                    <MoreHorizontal className="h-4 w-4" />
                                                </Button>
                                            </div>
                                        </div>
                                    ))
                                )}
                            </div>
                        </div>
                    </CardContent>
                </Card>
            )}

            {activeTab === "users" && (
                <Card>
                    <CardHeader>
                        <CardTitle>User Management</CardTitle>
                        <CardDescription>Manage user roles and permissions.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <p className="text-muted-foreground text-center py-10">User management module placeholder.</p>
                    </CardContent>
                </Card>
            )}
        </div>
    );
}
