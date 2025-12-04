import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Users, FileText, AlertTriangle, Search, CheckCircle, XCircle, Download, Settings, TrendingUp, Eye, Trash2, RefreshCw, Star } from 'lucide-react';
import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { Textarea } from '@/components/ui/textarea';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";

interface Report {
    id: string;
    created_at: string;
    type: string;
    status: string;
    is_anonymous: boolean;
    description: string;
    incident_date: string;
}

interface UserInfo {
    id: string;
    email?: string;
    reports_count: number;
    first_report_date: string;
    last_report_date: string;
    is_anonymous: boolean;
}

interface CommunityPost {
    id: string;
    author_name: string;
    author_role: string;
    created_at: string;
    title: string;
    content: string;
    likes_count: number;
    comments_count: number;
    tags: string[];
    is_flagged?: boolean;
    flagged_reason?: string;
}

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

type TabType = "overview" | "reports" | "users" | "analytics" | "posts" | "counselors" | "settings";

export default function Admin() {
    const [activeTab, setActiveTab] = useState<TabType>("overview");
    const [reports, setReports] = useState<Report[]>([]);
    const [users, setUsers] = useState<UserInfo[]>([]);
    const [selectedReport, setSelectedReport] = useState<Report | null>(null);
    const [isReportDialogOpen, setIsReportDialogOpen] = useState(false);
    const [stats, setStats] = useState({
        total: 0,
        active: 0,
        resolved: 0,
        users: 0
    });
    const [error, setError] = useState<string | null>(null);
    const [searchTerm, setSearchTerm] = useState("");
    const [updateLoading, setUpdateLoading] = useState(false);
    const [statusFilter, setStatusFilter] = useState<string>("all");
    const [typeFilter, setTypeFilter] = useState<string>("all");
    const [selectedReports, setSelectedReports] = useState<Set<string>>(new Set());
    const [isBulkActionDialogOpen, setIsBulkActionDialogOpen] = useState(false);
    const [viewReport, setViewReport] = useState<Report | null>(null);
    const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);
    const [analytics, setAnalytics] = useState({
        reportsByType: {} as Record<string, number>,
        reportsByStatus: {} as Record<string, number>,
        reportsByDay: [] as Array<{ date: string; count: number }>,
        avgResolutionTime: 0
    });
    const [communityPosts, setCommunityPosts] = useState<CommunityPost[]>([]);
    const [selectedPost, setSelectedPost] = useState<CommunityPost | null>(null);
    const [isPostDialogOpen, setIsPostDialogOpen] = useState(false);
    const [flagReason, setFlagReason] = useState("");
    const [recentCriticalReports, setRecentCriticalReports] = useState<Report[]>([]);
    const [counselors, setCounselors] = useState<Counselor[]>([]);
    const [selectedCounselor, setSelectedCounselor] = useState<Counselor | null>(null);
    const [isCounselorDialogOpen, setIsCounselorDialogOpen] = useState(false);
    const [isEditMode, setIsEditMode] = useState(false);
    const [counselorForm, setCounselorForm] = useState({
        name: '',
        specialization: '',
        distance: '',
        rating: 5,
        availability: '',
        location_lat: 0,
        location_lng: 0
    });

    useEffect(() => {
        fetchData();

        // Real-time subscription
        const channel = supabase
            .channel('admin_dashboard')
            .on('postgres_changes', { event: '*', schema: 'public', table: 'reports' }, () => {
                console.log('Real-time update: reports');
                fetchData();
            })
            .on('postgres_changes', { event: '*', schema: 'public', table: 'profiles' }, () => {
                console.log('Real-time update: profiles');
                fetchData();
            })
            .on('postgres_changes', { event: '*', schema: 'public', table: 'bookings' }, () => {
                console.log('Real-time update: bookings');
                fetchData();
            })
            .on('postgres_changes', { event: '*', schema: 'public', table: 'community_posts' }, () => {
                console.log('Real-time update: community_posts');
                fetchData();
            })
            .on('postgres_changes', { event: '*', schema: 'public', table: 'counselors' }, () => {
                console.log('Real-time update: counselors');
                fetchData();
            })
            .subscribe((status) => {
                if (status === 'SUBSCRIBED') {
                    console.log('Admin dashboard subscribed to real-time updates');
                } else if (status === 'CHANNEL_ERROR') {
                    console.warn('Real-time subscription error - continuing without live updates');
                }
            });

        return () => {
            supabase.removeChannel(channel);
        };
    }, []);

    const fetchData = async () => {
        setError(null);
        try {
            // Fetch reports
            const { data: reportsData, error: reportsError } = await supabase
                .from('reports')
                .select('*')
                .order('created_at', { ascending: false });

            if (reportsError) {
                console.error('Error fetching reports:', reportsError);
                setError(`Failed to load reports: ${reportsError.message}`);
                // Continue with empty reports array
                setReports([]);
            } else {
                setReports(reportsData || []);
            }

            // Calculate stats
            const reportsList = reportsData || [];
            const total = reportsList.length;
            const active = reportsList.filter(r => r.status === 'investigating' || r.status === 'pending').length;
            const resolved = reportsList.filter(r => r.status === 'resolved').length;

            // Fetch users - try to get unique users from reports if profiles table doesn't exist
            let usersCount = 0;

            // Helper function to fetch users from reports
            const fetchUsersFromReports = async () => {
                try {
                    const { data: reportsWithUsers, error } = await supabase
                        .from('reports')
                        .select('user_id, created_at, is_anonymous')
                        .order('created_at', { ascending: false });

                    if (error) throw error;

                    if (reportsWithUsers) {
                        // Group reports by user_id
                        const userMap = new Map<string, {
                            reports: Array<{ created_at: string; is_anonymous: boolean }>;
                            hasAnonymous: boolean;
                        }>();

                        reportsWithUsers.forEach((report: any) => {
                            const userId = report.user_id || 'anonymous';
                            if (!userMap.has(userId)) {
                                userMap.set(userId, { reports: [], hasAnonymous: false });
                            }
                            const userData = userMap.get(userId)!;
                            userData.reports.push({
                                created_at: report.created_at,
                                is_anonymous: report.is_anonymous || false
                            });
                            if (report.is_anonymous) {
                                userData.hasAnonymous = true;
                            }
                        });

                        // Convert to UserInfo array
                        const usersList: UserInfo[] = Array.from(userMap.entries()).map(([id, data]) => {
                            const sortedReports = data.reports.sort((a, b) =>
                                new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
                            );
                            return {
                                id,
                                reports_count: data.reports.length,
                                first_report_date: sortedReports[sortedReports.length - 1]?.created_at || '',
                                last_report_date: sortedReports[0]?.created_at || '',
                                is_anonymous: data.hasAnonymous
                            };
                        });

                        usersCount = userMap.size;
                        setUsers(usersList);
                    }
                } catch (e) {
                    console.error('Could not fetch users from reports:', e);
                    setUsers([]);
                }
            };

            try {
                const { error: profilesError, count: count } = await supabase
                    .from('profiles')
                    .select('*', { count: 'exact' });

                if (profilesError) {
                    // If profiles table doesn't exist, get users from reports
                    console.warn('Profiles table not found, using reports data for users');
                    await fetchUsersFromReports();
                } else {
                    usersCount = count || 0;
                    // Also fetch users from reports for the users tab
                    await fetchUsersFromReports();
                }
            } catch (err: any) {
                // If profiles table doesn't exist, calculate from reports
                console.warn('Could not fetch from profiles table:', err);
                await fetchUsersFromReports();
            }

            setStats({
                total,
                active,
                resolved,
                users: usersCount
            });

            // Calculate analytics
            calculateAnalytics(reportsList);

            // Get recent critical reports (high severity, pending/investigating)
            const critical = reportsList
                .filter(r => (r.type === 'harassment' || r.type === 'stalking') &&
                    (r.status === 'pending' || r.status === 'investigating'))
                .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
                .slice(0, 5);
            setRecentCriticalReports(critical);

            // Fetch community posts
            await fetchCommunityPosts();

            // Fetch counselors
            await fetchCounselors();

        } catch (error: any) {
            console.error('Error fetching admin data:', error);
            setError(error?.message || 'An unexpected error occurred while loading data');
        }
    };

    const calculateAnalytics = (reportsList: Report[]) => {
        // Reports by type
        const byType: Record<string, number> = {};
        const byStatus: Record<string, number> = {};
        const byDay: Record<string, number> = {};

        reportsList.forEach(report => {
            byType[report.type] = (byType[report.type] || 0) + 1;
            byStatus[report.status] = (byStatus[report.status] || 0) + 1;

            const date = new Date(report.created_at).toISOString().split('T')[0];
            byDay[date] = (byDay[date] || 0) + 1;
        });

        // Get last 7 days
        const last7Days = Array.from({ length: 7 }, (_, i) => {
            const date = new Date();
            date.setDate(date.getDate() - i);
            return date.toISOString().split('T')[0];
        }).reverse();

        const reportsByDay = last7Days.map(date => ({
            date,
            count: byDay[date] || 0
        }));

        // Calculate average resolution time (for resolved reports)
        const resolvedReports = reportsList.filter(r => r.status === 'resolved');
        let avgResolutionTime = 0;
        if (resolvedReports.length > 0) {
            const totalTime = resolvedReports.reduce((sum, report) => {
                const created = new Date(report.created_at).getTime();
                const resolved = new Date().getTime(); // Approximate
                return sum + (resolved - created);
            }, 0);
            avgResolutionTime = Math.round(totalTime / resolvedReports.length / (1000 * 60 * 60 * 24)); // Days
        }

        setAnalytics({
            reportsByType: byType,
            reportsByStatus: byStatus,
            reportsByDay,
            avgResolutionTime
        });
    };

    const handleUpdateStatus = async (status: string) => {
        if (!selectedReport) return;
        setUpdateLoading(true);
        try {
            const { error } = await supabase
                .from('reports')
                .update({ status })
                .eq('id', selectedReport.id);

            if (error) throw error;
            setIsReportDialogOpen(false);
            setSelectedReport(null);
            await fetchData();
        } catch (error: any) {
            console.error('Error updating status:', error);
            setError(error?.message || 'Failed to update report status');
        } finally {
            setUpdateLoading(false);
        }
    };

    const filteredReports = reports.filter(report => {
        // Search filter
        if (searchTerm) {
            const search = searchTerm.toLowerCase();
            const matchesSearch = (
                report.id.toLowerCase().includes(search) ||
                report.type.toLowerCase().includes(search) ||
                report.status.toLowerCase().includes(search) ||
                (report.description?.toLowerCase().includes(search) ?? false)
            );
            if (!matchesSearch) return false;
        }

        // Status filter
        if (statusFilter !== "all" && report.status !== statusFilter) {
            return false;
        }

        // Type filter
        if (typeFilter !== "all" && report.type !== typeFilter) {
            return false;
        }

        return true;
    });

    const handleBulkAction = async (action: string) => {
        if (selectedReports.size === 0) return;
        setUpdateLoading(true);
        try {
            const reportIds = Array.from(selectedReports);
            if (action === 'delete') {
                const { error } = await supabase
                    .from('reports')
                    .delete()
                    .in('id', reportIds);
                if (error) throw error;
            } else {
                const { error } = await supabase
                    .from('reports')
                    .update({ status: action })
                    .in('id', reportIds);
                if (error) throw error;
            }
            setSelectedReports(new Set());
            setIsBulkActionDialogOpen(false);
            await fetchData();
        } catch (error: any) {
            setError(error?.message || 'Failed to perform bulk action');
        } finally {
            setUpdateLoading(false);
        }
    };

    const exportReports = () => {
        if (filteredReports.length === 0) {
            setError('No reports to export');
            return;
        }

        const data = filteredReports.map(report => ({
            ID: report.id,
            Type: report.type,
            Status: report.status,
            Description: (report.description || '').replace(/"/g, '""'), // Escape quotes for CSV
            'Incident Date': report.incident_date ? new Date(report.incident_date).toLocaleDateString() : 'N/A',
            'Created At': new Date(report.created_at).toLocaleDateString(),
            'Is Anonymous': report.is_anonymous ? 'Yes' : 'No'
        }));

        const headers = Object.keys(data[0]);
        const csv = [
            headers.join(','),
            ...data.map(row => headers.map(header => `"${row[header as keyof typeof row]}"`).join(','))
        ].join('\n');

        const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `reports-export-${new Date().toISOString().split('T')[0]}.csv`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        window.URL.revokeObjectURL(url);
    };

    const toggleReportSelection = (reportId: string) => {
        const newSelection = new Set(selectedReports);
        if (newSelection.has(reportId)) {
            newSelection.delete(reportId);
        } else {
            newSelection.add(reportId);
        }
        setSelectedReports(newSelection);
    };

    const toggleSelectAll = () => {
        if (selectedReports.size === filteredReports.length) {
            setSelectedReports(new Set());
        } else {
            setSelectedReports(new Set(filteredReports.map(r => r.id)));
        }
    };

    const fetchCommunityPosts = async () => {
        try {
            const { data: postsData, error } = await supabase
                .from('community_posts')
                .select('*')
                .order('created_at', { ascending: false })
                .limit(100);

            if (error) {
                console.error('Error fetching community posts:', error);
            } else {
                setCommunityPosts(postsData || []);
            }
        } catch (err) {
            console.error('Error fetching community posts:', err);
        }
    };

    const handleFlagPost = async () => {
        if (!selectedPost || !flagReason.trim()) return;
        setUpdateLoading(true);
        try {
            // Update post with flag status - you might need to add is_flagged and flagged_reason columns
            const { error } = await supabase
                .from('community_posts')
                .update({
                    is_flagged: true,
                    flagged_reason: flagReason
                })
                .eq('id', selectedPost.id);

            if (error) throw error;

            setIsPostDialogOpen(false);
            setSelectedPost(null);
            setFlagReason("");
            await fetchCommunityPosts();
        } catch (error: any) {
            setError(error?.message || 'Failed to flag post');
        } finally {
            setUpdateLoading(false);
        }
    };

    const handleUnflagPost = async (postId: string) => {
        setUpdateLoading(true);
        try {
            const { error } = await supabase
                .from('community_posts')
                .update({
                    is_flagged: false,
                    flagged_reason: null
                })
                .eq('id', postId);

            if (error) throw error;
            await fetchCommunityPosts();
        } catch (error: any) {
            setError(error?.message || 'Failed to unflag post');
        } finally {
            setUpdateLoading(false);
        }
    };

    const handleDeletePost = async (postId: string) => {
        if (!confirm('Are you sure you want to delete this post? This action cannot be undone.')) return;
        setUpdateLoading(true);
        try {
            const { error } = await supabase
                .from('community_posts')
                .delete()
                .eq('id', postId);

            if (error) throw error;
            await fetchCommunityPosts();
        } catch (error: any) {
            setError(error?.message || 'Failed to delete post');
        } finally {
            setUpdateLoading(false);
        }
    };

    const fetchCounselors = async () => {
        try {
            const { data, error } = await supabase
                .from('counselors')
                .select('*')
                .order('name', { ascending: true });

            if (error) {
                console.error('Error fetching counselors:', error);
            } else {
                setCounselors(data || []);
            }
        } catch (err) {
            console.error('Error fetching counselors:', err);
        }
    };

    const handleAddCounselor = () => {
        setIsEditMode(false);
        setCounselorForm({
            name: '',
            specialization: '',
            distance: '',
            rating: 5,
            availability: '',
            location_lat: 0,
            location_lng: 0
        });
        setSelectedCounselor(null);
        setIsCounselorDialogOpen(true);
    };

    const handleEditCounselor = (counselor: Counselor) => {
        setIsEditMode(true);
        setSelectedCounselor(counselor);
        setCounselorForm({
            name: counselor.name,
            specialization: counselor.specialization,
            distance: counselor.distance,
            rating: counselor.rating,
            availability: counselor.availability,
            location_lat: counselor.location_lat,
            location_lng: counselor.location_lng
        });
        setIsCounselorDialogOpen(true);
    };

    const handleSaveCounselor = async () => {
        if (!counselorForm.name || !counselorForm.specialization || !counselorForm.availability) {
            setError('Please fill in all required fields');
            return;
        }

        setUpdateLoading(true);
        try {
            if (isEditMode && selectedCounselor) {
                const { error } = await supabase
                    .from('counselors')
                    .update(counselorForm)
                    .eq('id', selectedCounselor.id);

                if (error) throw error;
            } else {
                const { error } = await supabase
                    .from('counselors')
                    .insert([counselorForm]);

                if (error) throw error;
            }

            setIsCounselorDialogOpen(false);
            setSelectedCounselor(null);
            setIsEditMode(false);
            await fetchCounselors();
        } catch (error: any) {
            setError(error?.message || 'Failed to save counselor');
        } finally {
            setUpdateLoading(false);
        }
    };

    const handleDeleteCounselor = async (counselorId: string) => {
        if (!confirm('Are you sure you want to delete this counselor? This action cannot be undone.')) return;
        setUpdateLoading(true);
        try {
            const { error } = await supabase
                .from('counselors')
                .delete()
                .eq('id', counselorId);

            if (error) throw error;
            await fetchCounselors();
        } catch (error: any) {
            setError(error?.message || 'Failed to delete counselor');
        } finally {
            setUpdateLoading(false);
        }
    };

    return (
        <div className="container py-6 md:py-10 max-w-7xl px-4 sm:px-6 lg:px-8">
            {error && (
                <div className="mb-4 p-4 bg-destructive/10 border border-destructive/20 rounded-lg flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <XCircle className="h-5 w-5 text-destructive" />
                        <p className="text-sm text-destructive">{error}</p>
                    </div>
                    <Button variant="ghost" size="sm" onClick={() => setError(null)}>
                        <XCircle className="h-4 w-4" />
                    </Button>
                </div>
            )}
            <Dialog open={isReportDialogOpen} onOpenChange={(open) => {
                setIsReportDialogOpen(open);
                if (!open) setSelectedReport(null);
            }}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Update Report Status</DialogTitle>
                        <DialogDescription>
                            Change the status of report #{selectedReport?.id.slice(0, 8)}
                        </DialogDescription>
                    </DialogHeader>
                    <div className="py-4 space-y-4">
                        <div className="space-y-2">
                            <Label>Current Status</Label>
                            <div className="text-sm text-muted-foreground capitalize">
                                {selectedReport?.status || 'Unknown'}
                            </div>
                        </div>
                        <div className="space-y-2">
                            <Label>New Status</Label>
                            <Select
                                value={selectedReport?.status}
                                onValueChange={handleUpdateStatus}
                                disabled={updateLoading}
                            >
                                <SelectTrigger>
                                    <SelectValue placeholder="Select status" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="pending">Pending</SelectItem>
                                    <SelectItem value="investigating">Investigating</SelectItem>
                                    <SelectItem value="resolved">Resolved</SelectItem>
                                    <SelectItem value="dismissed">Dismissed</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                        {updateLoading && (
                            <p className="text-sm text-muted-foreground">Updating status...</p>
                        )}
                    </div>
                </DialogContent>
            </Dialog>
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 md:mb-8 gap-4">
                <div>
                    <h1 className="text-2xl sm:text-3xl font-bold mb-2">Admin Dashboard</h1>
                    <p className="text-sm sm:text-base text-muted-foreground">Manage reports, users, and platform safety.</p>
                </div>
                <div className="flex gap-2 flex-wrap w-full md:w-auto">
                    <Button variant={activeTab === "overview" ? "default" : "outline"} onClick={() => setActiveTab("overview")} className="text-xs sm:text-sm">
                        Overview
                    </Button>
                    <Button variant={activeTab === "reports" ? "default" : "outline"} onClick={() => setActiveTab("reports")} className="text-xs sm:text-sm">
                        Reports
                    </Button>
                    <Button variant={activeTab === "users" ? "default" : "outline"} onClick={() => setActiveTab("users")} className="text-xs sm:text-sm">
                        Users
                    </Button>
                    <Button variant={activeTab === "analytics" ? "default" : "outline"} onClick={() => setActiveTab("analytics")} className="text-xs sm:text-sm">
                        <TrendingUp className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2" />
                        <span className="hidden sm:inline">Analytics</span>
                    </Button>
                    <Button variant={activeTab === "settings" ? "default" : "outline"} onClick={() => setActiveTab("settings")} className="text-xs sm:text-sm">
                        <Settings className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2" />
                        <span className="hidden sm:inline">Settings</span>
                    </Button>
                    <Button variant={activeTab === "posts" ? "default" : "outline"} onClick={() => setActiveTab("posts")} className="text-xs sm:text-sm">
                        <FileText className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2" />
                        <span className="hidden sm:inline">Posts</span>
                    </Button>
                    <Button variant={activeTab === "counselors" ? "default" : "outline"} onClick={() => setActiveTab("counselors")} className="text-xs sm:text-sm">
                        <Users className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2" />
                        <span className="hidden sm:inline">Counselors</span>
                    </Button>
                </div>
            </div>

            {activeTab === "overview" && (
                <div className="space-y-8">
                    {/* Stats Cards */}
                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
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
                            <CardContent className="h-[300px]">
                                {analytics.reportsByDay.length > 0 ? (
                                    <div className="h-full flex items-end justify-between gap-2">
                                        {analytics.reportsByDay.map((day, index) => {
                                            const maxCount = Math.max(...analytics.reportsByDay.map(d => d.count), 1);
                                            return (
                                                <div key={index} className="flex-1 flex flex-col items-center gap-2 h-full">
                                                    <div className="w-full flex items-end justify-center flex-1" style={{ minHeight: '20px' }}>
                                                        <div
                                                            className="w-full bg-primary rounded-t transition-all hover:bg-primary/80"
                                                            style={{
                                                                height: `${Math.max((day.count / maxCount) * 100, day.count > 0 ? 5 : 0)}%`,
                                                                minHeight: day.count > 0 ? '4px' : '0'
                                                            }}
                                                        />
                                                    </div>
                                                    <div className="text-[10px] text-muted-foreground rotate-45 origin-left translate-y-2">
                                                        {new Date(day.date).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
                                                    </div>
                                                </div>
                                            );
                                        })}
                                    </div>
                                ) : (
                                    <div className="h-full flex items-center justify-center text-muted-foreground">
                                        No data available
                                    </div>
                                )}
                            </CardContent>
                        </Card>

                        <Card className="col-span-1">
                            <CardHeader>
                                <CardTitle>Critical Alerts</CardTitle>
                                <CardDescription>Recent high-priority incidents</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-4">
                                    {recentCriticalReports.length > 0 ? (
                                        recentCriticalReports.map(report => (
                                            <div key={report.id} className="flex items-start gap-4 p-3 rounded-lg border bg-card hover:bg-accent/50 transition-colors cursor-pointer" onClick={() => {
                                                setSelectedReport(report);
                                                setIsReportDialogOpen(true);
                                            }}>
                                                <div className="p-2 rounded-full bg-red-100 dark:bg-red-900/20">
                                                    <AlertTriangle className="h-4 w-4 text-red-600 dark:text-red-400" />
                                                </div>
                                                <div className="flex-1 space-y-1">
                                                    <p className="text-sm font-medium leading-none">
                                                        {report.type.charAt(0).toUpperCase() + report.type.slice(1)}
                                                    </p>
                                                    <p className="text-xs text-muted-foreground line-clamp-2">
                                                        {report.description}
                                                    </p>
                                                    <p className="text-[10px] text-muted-foreground">
                                                        {new Date(report.created_at).toLocaleString()}
                                                    </p>
                                                </div>
                                                <div className="flex items-center">
                                                    <span className="inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 border-transparent bg-red-500 text-white shadow hover:bg-red-500/80">
                                                        {report.status}
                                                    </span>
                                                </div>
                                            </div>
                                        ))
                                    ) : (
                                        <div className="text-center py-8 text-muted-foreground">
                                            <CheckCircle className="h-8 w-8 mx-auto mb-2 text-green-500" />
                                            <p>No critical alerts at this time</p>
                                        </div>
                                    )}
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            )}

            {activeTab === "reports" && (
                <div className="space-y-4">
                    <div className="flex flex-col sm:flex-row gap-4 justify-between">
                        <div className="flex flex-1 gap-2">
                            <div className="relative flex-1 max-w-sm">
                                <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                                <Input
                                    placeholder="Search reports..."
                                    className="pl-8"
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                />
                            </div>
                            <Select value={statusFilter} onValueChange={setStatusFilter}>
                                <SelectTrigger className="w-[130px]">
                                    <SelectValue placeholder="Status" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">All Status</SelectItem>
                                    <SelectItem value="pending">Pending</SelectItem>
                                    <SelectItem value="investigating">Investigating</SelectItem>
                                    <SelectItem value="resolved">Resolved</SelectItem>
                                    <SelectItem value="dismissed">Dismissed</SelectItem>
                                </SelectContent>
                            </Select>
                            <Select value={typeFilter} onValueChange={setTypeFilter}>
                                <SelectTrigger className="w-[130px]">
                                    <SelectValue placeholder="Type" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">All Types</SelectItem>
                                    <SelectItem value="harassment">Harassment</SelectItem>
                                    <SelectItem value="stalking">Stalking</SelectItem>
                                    <SelectItem value="assault">Assault</SelectItem>
                                    <SelectItem value="discrimination">Discrimination</SelectItem>
                                    <SelectItem value="other">Other</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="flex gap-2">
                            {selectedReports.size > 0 && (
                                <Dialog open={isBulkActionDialogOpen} onOpenChange={setIsBulkActionDialogOpen}>
                                    <DialogContent>
                                        <DialogHeader>
                                            <DialogTitle>Bulk Action</DialogTitle>
                                            <DialogDescription>
                                                Apply action to {selectedReports.size} selected reports.
                                            </DialogDescription>
                                        </DialogHeader>
                                        <div className="grid gap-4 py-4">
                                            <Button onClick={() => handleBulkAction('resolved')} className="w-full">
                                                Mark as Resolved
                                            </Button>
                                            <Button onClick={() => handleBulkAction('investigating')} variant="secondary" className="w-full">
                                                Mark as Investigating
                                            </Button>
                                            <Button onClick={() => handleBulkAction('dismissed')} variant="outline" className="w-full">
                                                Dismiss Reports
                                            </Button>
                                            <Button onClick={() => handleBulkAction('delete')} variant="destructive" className="w-full">
                                                Delete Reports
                                            </Button>
                                        </div>
                                    </DialogContent>
                                </Dialog>
                            )}
                            {selectedReports.size > 0 ? (
                                <Button variant="outline" onClick={() => setIsBulkActionDialogOpen(true)}>
                                    Bulk Actions ({selectedReports.size})
                                </Button>
                            ) : (
                                <Button variant="outline" onClick={exportReports}>
                                    <Download className="mr-2 h-4 w-4" />
                                    Export CSV
                                </Button>
                            )}
                        </div>
                    </div>

                    <div className="rounded-md border">
                        <div className="relative w-full overflow-auto">
                            <table className="w-full caption-bottom text-sm">
                                <thead className="[&_tr]:border-b">
                                    <tr className="border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted">
                                        <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">
                                            <input
                                                type="checkbox"
                                                checked={selectedReports.size === filteredReports.length && filteredReports.length > 0}
                                                onChange={toggleSelectAll}
                                                className="translate-y-[2px]"
                                            />
                                        </th>
                                        <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">ID</th>
                                        <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Date</th>
                                        <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Type</th>
                                        <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Description</th>
                                        <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Status</th>
                                        <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="[&_tr:last-child]:border-0">
                                    {filteredReports.length > 0 ? (
                                        filteredReports.map((report) => (
                                            <tr key={report.id} className="border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted">
                                                <td className="p-4 align-middle">
                                                    <input
                                                        type="checkbox"
                                                        checked={selectedReports.has(report.id)}
                                                        onChange={() => toggleReportSelection(report.id)}
                                                        className="translate-y-[2px]"
                                                    />
                                                </td>
                                                <td className="p-4 align-middle font-mono text-xs">{report.id.slice(0, 8)}...</td>
                                                <td className="p-4 align-middle">{new Date(report.created_at).toLocaleDateString()}</td>
                                                <td className="p-4 align-middle capitalize">{report.type}</td>
                                                <td className="p-4 align-middle max-w-[300px] truncate">{report.description}</td>
                                                <td className="p-4 align-middle">
                                                    <span className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 border-transparent ${report.status === 'resolved' ? 'bg-green-500 text-white' :
                                                        report.status === 'investigating' ? 'bg-blue-500 text-white' :
                                                            report.status === 'dismissed' ? 'bg-gray-500 text-white' :
                                                                'bg-yellow-500 text-white'
                                                        }`}>
                                                        {report.status}
                                                    </span>
                                                </td>
                                                <td className="p-4 align-middle">
                                                    <div className="flex items-center gap-2">
                                                        <Button variant="ghost" size="icon" onClick={() => {
                                                            setSelectedReport(report);
                                                            setIsReportDialogOpen(true);
                                                        }}>
                                                            <RefreshCw className="h-4 w-4" />
                                                        </Button>
                                                        <Button variant="ghost" size="icon" onClick={() => {
                                                            setViewReport(report);
                                                            setIsViewDialogOpen(true);
                                                        }}>
                                                            <Eye className="h-4 w-4" />
                                                        </Button>
                                                    </div>
                                                </td>
                                            </tr>
                                        ))
                                    ) : (
                                        <tr>
                                            <td colSpan={7} className="p-4 text-center text-muted-foreground">
                                                No reports found matching your filters.
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            )}

            {activeTab === "users" && (
                <div className="space-y-4">
                    <Card>
                        <CardHeader>
                            <CardTitle>User Management</CardTitle>
                            <CardDescription>View and manage registered users.</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="rounded-md border">
                                <table className="w-full caption-bottom text-sm">
                                    <thead className="[&_tr]:border-b">
                                        <tr className="border-b transition-colors hover:bg-muted/50">
                                            <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">User ID</th>
                                            <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Reports</th>
                                            <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">First Activity</th>
                                            <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Last Activity</th>
                                            <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Status</th>
                                        </tr>
                                    </thead>
                                    <tbody className="[&_tr:last-child]:border-0">
                                        {users.length > 0 ? (
                                            users.map((user) => (
                                                <tr key={user.id} className="border-b transition-colors hover:bg-muted/50">
                                                    <td className="p-4 align-middle font-mono text-xs">
                                                        {user.id === 'anonymous' ? 'Anonymous Users' : user.id}
                                                    </td>
                                                    <td className="p-4 align-middle">{user.reports_count}</td>
                                                    <td className="p-4 align-middle">
                                                        {user.first_report_date ? new Date(user.first_report_date).toLocaleDateString() : 'N/A'}
                                                    </td>
                                                    <td className="p-4 align-middle">
                                                        {user.last_report_date ? new Date(user.last_report_date).toLocaleDateString() : 'N/A'}
                                                    </td>
                                                    <td className="p-4 align-middle">
                                                        <span className="inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors border-transparent bg-secondary text-secondary-foreground hover:bg-secondary/80">
                                                            Active
                                                        </span>
                                                    </td>
                                                </tr>
                                            ))
                                        ) : (
                                            <tr>
                                                <td colSpan={5} className="p-4 text-center text-muted-foreground">
                                                    No user data available.
                                                </td>
                                            </tr>
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            )}

            {activeTab === "analytics" && (
                <div className="space-y-8">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <Card>
                            <CardHeader>
                                <CardTitle>Reports by Type</CardTitle>
                                <CardDescription>Distribution of incident types</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-4">
                                    {Object.entries(analytics.reportsByType).map(([type, count]) => (
                                        <div key={type} className="flex items-center justify-between">
                                            <div className="flex items-center gap-2">
                                                <div className="w-2 h-2 rounded-full bg-primary" />
                                                <span className="capitalize">{type}</span>
                                            </div>
                                            <div className="flex items-center gap-4">
                                                <div className="w-32 h-2 bg-secondary rounded-full overflow-hidden">
                                                    <div
                                                        className="h-full bg-primary"
                                                        style={{ width: `${(count / stats.total) * 100}%` }}
                                                    />
                                                </div>
                                                <span className="text-sm font-medium">{count}</span>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader>
                                <CardTitle>Resolution Status</CardTitle>
                                <CardDescription>Current status of all reports</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-4">
                                    {Object.entries(analytics.reportsByStatus).map(([status, count]) => (
                                        <div key={status} className="flex items-center justify-between">
                                            <div className="flex items-center gap-2">
                                                <div className={`w-2 h-2 rounded-full ${status === 'resolved' ? 'bg-green-500' :
                                                    status === 'investigating' ? 'bg-blue-500' :
                                                        status === 'dismissed' ? 'bg-gray-500' :
                                                            'bg-yellow-500'
                                                    }`} />
                                                <span className="capitalize">{status}</span>
                                            </div>
                                            <span className="text-sm font-medium">{count}</span>
                                        </div>
                                    ))}
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            )}

            {activeTab === "settings" && (
                <div className="space-y-6">
                    <Card>
                        <CardHeader>
                            <CardTitle>Admin Settings</CardTitle>
                            <CardDescription>Configure dashboard preferences and notifications.</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="flex items-center justify-between p-4 border rounded-lg">
                                <div className="space-y-0.5">
                                    <Label>Email Notifications</Label>
                                    <p className="text-sm text-muted-foreground">Receive emails for new high-priority reports</p>
                                </div>
                                <Button variant="outline">Configure</Button>
                            </div>
                            <div className="flex items-center justify-between p-4 border rounded-lg">
                                <div className="space-y-0.5">
                                    <Label>Data Retention</Label>
                                    <p className="text-sm text-muted-foreground">Manage how long reports are stored</p>
                                </div>
                                <Button variant="outline">Manage</Button>
                            </div>
                            <div className="flex items-center justify-between p-4 border rounded-lg">
                                <div className="space-y-0.5">
                                    <Label>Access Control</Label>
                                    <p className="text-sm text-muted-foreground">Manage admin roles and permissions</p>
                                </div>
                                <Button variant="outline">View Roles</Button>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            )}

            {activeTab === "posts" && (
                <div className="space-y-4">
                    <div className="flex justify-between items-center">
                        <h2 className="text-xl font-semibold">Community Posts</h2>
                        <Button onClick={fetchCommunityPosts} variant="outline" size="sm">
                            <RefreshCw className="h-4 w-4 mr-2" />
                            Refresh
                        </Button>
                    </div>

                    <div className="rounded-md border">
                        <table className="w-full caption-bottom text-sm">
                            <thead className="[&_tr]:border-b">
                                <tr className="border-b transition-colors hover:bg-muted/50">
                                    <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Author</th>
                                    <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Title</th>
                                    <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Date</th>
                                    <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Status</th>
                                    <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="[&_tr:last-child]:border-0">
                                {communityPosts.length > 0 ? (
                                    communityPosts.map((post) => (
                                        <tr key={post.id} className="border-b transition-colors hover:bg-muted/50">
                                            <td className="p-4 align-middle">
                                                <div className="font-medium">{post.author_name}</div>
                                                <div className="text-xs text-muted-foreground">{post.author_role}</div>
                                            </td>
                                            <td className="p-4 align-middle max-w-[200px] truncate">{post.title}</td>
                                            <td className="p-4 align-middle">{new Date(post.created_at).toLocaleDateString()}</td>
                                            <td className="p-4 align-middle">
                                                {post.is_flagged ? (
                                                    <span className="inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors border-transparent bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400">
                                                        Flagged
                                                    </span>
                                                ) : (
                                                    <span className="inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors border-transparent bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400">
                                                        Active
                                                    </span>
                                                )}
                                            </td>
                                            <td className="p-4 align-middle">
                                                <div className="flex items-center gap-2">
                                                    {post.is_flagged ? (
                                                        <Button variant="ghost" size="sm" onClick={() => handleUnflagPost(post.id)}>
                                                            Unflag
                                                        </Button>
                                                    ) : (
                                                        <Button variant="ghost" size="sm" onClick={() => {
                                                            setSelectedPost(post);
                                                            setIsPostDialogOpen(true);
                                                        }}>
                                                            Flag
                                                        </Button>
                                                    )}
                                                    <Button variant="ghost" size="icon" className="text-red-500 hover:text-red-600" onClick={() => handleDeletePost(post.id)}>
                                                        <Trash2 className="h-4 w-4" />
                                                    </Button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan={5} className="p-4 text-center text-muted-foreground">
                                            No community posts found.
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}

            {activeTab === "counselors" && (
                <div className="space-y-4">
                    <div className="flex justify-between items-center">
                        <h2 className="text-xl font-semibold">Counselors Management</h2>
                        <Button onClick={handleAddCounselor}>
                            Add Counselor
                        </Button>
                    </div>

                    <div className="rounded-md border">
                        <table className="w-full caption-bottom text-sm">
                            <thead className="[&_tr]:border-b">
                                <tr className="border-b transition-colors hover:bg-muted/50">
                                    <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Name</th>
                                    <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Specialization</th>
                                    <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Location</th>
                                    <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Rating</th>
                                    <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="[&_tr:last-child]:border-0">
                                {counselors.length > 0 ? (
                                    counselors.map((counselor) => (
                                        <tr key={counselor.id} className="border-b transition-colors hover:bg-muted/50">
                                            <td className="p-4 align-middle font-medium">{counselor.name}</td>
                                            <td className="p-4 align-middle">{counselor.specialization}</td>
                                            <td className="p-4 align-middle">{counselor.distance}</td>
                                            <td className="p-4 align-middle">
                                                <div className="flex items-center">
                                                    <Star className="h-3 w-3 fill-yellow-400 text-yellow-400 mr-1" />
                                                    {counselor.rating}
                                                </div>
                                            </td>
                                            <td className="p-4 align-middle">
                                                <div className="flex items-center gap-2">
                                                    <Button variant="ghost" size="sm" onClick={() => handleEditCounselor(counselor)}>
                                                        Edit
                                                    </Button>
                                                    <Button variant="ghost" size="icon" className="text-red-500 hover:text-red-600" onClick={() => handleDeleteCounselor(counselor.id)}>
                                                        <Trash2 className="h-4 w-4" />
                                                    </Button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan={5} className="p-4 text-center text-muted-foreground">
                                            No counselors found.
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}

            {/* View Report Dialog */}
            <Dialog open={isViewDialogOpen} onOpenChange={setIsViewDialogOpen}>
                <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
                    <DialogHeader>
                        <DialogTitle>Report Details</DialogTitle>
                        <DialogDescription>
                            Full details for report #{viewReport?.id}
                        </DialogDescription>
                    </DialogHeader>
                    {viewReport && (
                        <div className="space-y-6 py-4">
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <Label className="text-muted-foreground">Status</Label>
                                    <div className="mt-1">
                                        <span className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors border-transparent ${viewReport.status === 'resolved' ? 'bg-green-500 text-white' :
                                            viewReport.status === 'investigating' ? 'bg-blue-500 text-white' :
                                                viewReport.status === 'dismissed' ? 'bg-gray-500 text-white' :
                                                    'bg-yellow-500 text-white'
                                            }`}>
                                            {viewReport.status}
                                        </span>
                                    </div>
                                </div>
                                <div>
                                    <Label className="text-muted-foreground">Type</Label>
                                    <div className="mt-1 font-medium capitalize">{viewReport.type}</div>
                                </div>
                                <div>
                                    <Label className="text-muted-foreground">Date Submitted</Label>
                                    <div className="mt-1">{new Date(viewReport.created_at).toLocaleString()}</div>
                                </div>
                                <div>
                                    <Label className="text-muted-foreground">Incident Date</Label>
                                    <div className="mt-1">{viewReport.incident_date ? new Date(viewReport.incident_date).toLocaleDateString() : 'N/A'}</div>
                                </div>
                                <div>
                                    <Label className="text-muted-foreground">Anonymous</Label>
                                    <div className="mt-1">{viewReport.is_anonymous ? 'Yes' : 'No'}</div>
                                </div>
                            </div>

                            <div>
                                <Label className="text-muted-foreground">Description</Label>
                                <div className="mt-2 p-4 rounded-md bg-muted/50 text-sm leading-relaxed whitespace-pre-wrap">
                                    {viewReport.description}
                                </div>
                            </div>

                            <div className="flex justify-end gap-2 pt-4 border-t">
                                <Button variant="outline" onClick={() => setIsViewDialogOpen(false)}>Close</Button>
                                <Button onClick={() => {
                                    setIsViewDialogOpen(false);
                                    setSelectedReport(viewReport);
                                    setIsReportDialogOpen(true);
                                }}>Update Status</Button>
                            </div>
                        </div>
                    )}
                </DialogContent>
            </Dialog>

            {/* Flag Post Dialog */}
            <Dialog open={isPostDialogOpen} onOpenChange={setIsPostDialogOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Flag Content</DialogTitle>
                        <DialogDescription>
                            Why are you flagging this post?
                        </DialogDescription>
                    </DialogHeader>
                    <div className="py-4 space-y-4">
                        <div className="space-y-2">
                            <Label>Reason</Label>
                            <Textarea
                                placeholder="Describe why this content is inappropriate..."
                                value={flagReason}
                                onChange={(e) => setFlagReason(e.target.value)}
                            />
                        </div>
                    </div>
                    <div className="flex justify-end gap-2">
                        <Button variant="outline" onClick={() => setIsPostDialogOpen(false)}>Cancel</Button>
                        <Button variant="destructive" onClick={handleFlagPost} disabled={!flagReason.trim() || updateLoading}>
                            Flag Post
                        </Button>
                    </div>
                </DialogContent>
            </Dialog>

            {/* Counselor Dialog */}
            <Dialog open={isCounselorDialogOpen} onOpenChange={setIsCounselorDialogOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>{isEditMode ? 'Edit Counselor' : 'Add Counselor'}</DialogTitle>
                        <DialogDescription>
                            {isEditMode ? 'Update counselor details.' : 'Add a new counselor to the platform.'}
                        </DialogDescription>
                    </DialogHeader>
                    <div className="grid gap-4 py-4">
                        <div className="grid gap-2">
                            <Label htmlFor="name">Name</Label>
                            <Input
                                id="name"
                                value={counselorForm.name}
                                onChange={(e) => setCounselorForm({ ...counselorForm, name: e.target.value })}
                            />
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="specialization">Specialization</Label>
                            <Input
                                id="specialization"
                                value={counselorForm.specialization}
                                onChange={(e) => setCounselorForm({ ...counselorForm, specialization: e.target.value })}
                            />
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="distance">Location/Distance</Label>
                            <Input
                                id="distance"
                                value={counselorForm.distance}
                                onChange={(e) => setCounselorForm({ ...counselorForm, distance: e.target.value })}
                            />
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="availability">Availability</Label>
                            <Input
                                id="availability"
                                value={counselorForm.availability}
                                onChange={(e) => setCounselorForm({ ...counselorForm, availability: e.target.value })}
                            />
                        </div>
                    </div>
                    <div className="flex justify-end gap-2">
                        <Button variant="outline" onClick={() => setIsCounselorDialogOpen(false)}>Cancel</Button>
                        <Button onClick={handleSaveCounselor} disabled={updateLoading}>
                            {isEditMode ? 'Save Changes' : 'Add Counselor'}
                        </Button>
                    </div>
                </DialogContent>
            </Dialog>
        </div>
    );
}