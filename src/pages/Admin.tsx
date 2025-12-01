import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Users, FileText, AlertTriangle, BarChart3, Search, MoreHorizontal, CheckCircle, XCircle, Download, Settings, TrendingUp, Eye, Trash2, RefreshCw, Star } from 'lucide-react';
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

interface Profile {
    id: string;
    full_name: string;
    username: string;
    website: string;
    updated_at: string;
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
    const [profiles, setProfiles] = useState<Profile[]>([]);
    const [users, setUsers] = useState<UserInfo[]>([]);
    const [selectedReport, setSelectedReport] = useState<Report | null>(null);
    const [isReportDialogOpen, setIsReportDialogOpen] = useState(false);
    const [stats, setStats] = useState({
        total: 0,
        active: 0,
        resolved: 0,
        users: 0
    });
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [searchTerm, setSearchTerm] = useState("");
    const [updateLoading, setUpdateLoading] = useState(false);
    const [statusFilter, setStatusFilter] = useState<string>("all");
    const [typeFilter, setTypeFilter] = useState<string>("all");
    const [dateRange, setDateRange] = useState<{ start: string; end: string }>({ start: '', end: '' });
    const [selectedReports, setSelectedReports] = useState<Set<string>>(new Set());
    const [isBulkActionDialogOpen, setIsBulkActionDialogOpen] = useState(false);
    const [bulkAction, setBulkAction] = useState<string>("");
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
        setLoading(true);
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
                const { data: profilesData, error: profilesError, count: count } = await supabase
                    .from('profiles')
                    .select('*', { count: 'exact' });

                if (profilesError) {
                    // If profiles table doesn't exist, get users from reports
                    console.warn('Profiles table not found, using reports data for users');
                    await fetchUsersFromReports();
                } else {
                    setProfiles(profilesData || []);
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
        } finally {
            setLoading(false);
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

        // Date range filter
        if (dateRange.start || dateRange.end) {
            const reportDate = new Date(report.created_at);
            if (dateRange.start && reportDate < new Date(dateRange.start)) return false;
            if (dateRange.end && reportDate > new Date(dateRange.end + 'T23:59:59')) return false;
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
                                                            title={`${day.count} reports on ${new Date(day.date).toLocaleDateString()}`}
                                                        />
                                                    </div>
                                                    <span className="text-xs text-muted-foreground">
                                                        {new Date(day.date).toLocaleDateString('en-US', { weekday: 'short' })}
                                                    </span>
                                                    <span className="text-xs font-medium">{day.count}</span>
                                                </div>
                                            );
                                        })}
                                    </div>
                                ) : (
                                    <div className="h-full flex items-center justify-center bg-muted/10 rounded-md">
                                        <div className="text-center">
                                            <BarChart3 className="h-16 w-16 text-muted-foreground/20 mx-auto mb-2" />
                                            <span className="text-muted-foreground">No data available</span>
                                        </div>
                                    </div>
                                )}
                            </CardContent>
                        </Card>
                        <Card className="col-span-1">
                            <CardHeader>
                                <CardTitle>Recent Critical Alerts</CardTitle>
                                <CardDescription>High priority incidents requiring attention</CardDescription>
                            </CardHeader>
                            <CardContent>
                                {loading ? (
                                    <div className="p-8 text-center text-muted-foreground">Loading critical alerts...</div>
                                ) : recentCriticalReports.length === 0 ? (
                                    <div className="p-8 text-center text-muted-foreground">
                                        <CheckCircle className="h-12 w-12 text-green-500 mx-auto mb-2 opacity-50" />
                                        <p>No critical alerts at this time</p>
                                    </div>
                                ) : (
                                    <div className="space-y-4">
                                        {recentCriticalReports.map((report) => {
                                            const timeAgo = new Date(report.created_at);
                                            const now = new Date();
                                            const diffMinutes = Math.floor((now.getTime() - timeAgo.getTime()) / (1000 * 60));
                                            const timeText = diffMinutes < 60 
                                                ? `${diffMinutes}m ago` 
                                                : diffMinutes < 1440 
                                                    ? `${Math.floor(diffMinutes / 60)}h ago`
                                                    : `${Math.floor(diffMinutes / 1440)}d ago`;
                                            
                                            return (
                                                <div key={report.id} className="flex items-center justify-between p-4 border rounded-lg bg-destructive/5 border-destructive/20 hover:bg-destructive/10 transition-colors">
                                                    <div className="flex items-center gap-4 flex-1">
                                                        <AlertTriangle className="h-5 w-5 text-destructive flex-shrink-0" />
                                                        <div className="flex-1 min-w-0">
                                                            <p className="font-medium truncate">Report #{report.id.slice(0, 8)}</p>
                                                            <p className="text-xs text-muted-foreground">
                                                                {timeText} • {report.type} • {report.status}
                                                            </p>
                                                            {report.description && (
                                                                <p className="text-xs text-muted-foreground mt-1 truncate">
                                                                    {report.description}
                                                                </p>
                                                            )}
                                                        </div>
                                                    </div>
                                                    <div className="flex gap-2 flex-shrink-0">
                                                        <Button 
                                                            size="sm" 
                                                            variant="outline"
                                                            onClick={() => {
                                                                setViewReport(report);
                                                                setIsViewDialogOpen(true);
                                                            }}
                                                        >
                                                            View
                                                        </Button>
                                                        <Button 
                                                            size="sm" 
                                                            variant="default"
                                                            onClick={() => {
                                                                setSelectedReport(report);
                                                                setIsReportDialogOpen(true);
                                                            }}
                                                        >
                                                            Edit
                                                        </Button>
                                                    </div>
                                                </div>
                                            );
                                        })}
                                    </div>
                                )}
                            </CardContent>
                        </Card>
                    </div>
                </div>
            )}

            {activeTab === "reports" && (
                <Card>
                    <CardHeader>
                            <div className="flex flex-col gap-4">
                            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                                <div>
                                    <CardTitle className="text-lg sm:text-xl">Reports Management</CardTitle>
                                    <CardDescription className="text-xs sm:text-sm">View and manage all submitted incidents.</CardDescription>
                                </div>
                                <div className="flex gap-2 w-full sm:w-auto">
                                    <Button variant="outline" onClick={exportReports} disabled={filteredReports.length === 0} size="sm" className="flex-1 sm:flex-initial">
                                        <Download className="h-4 w-4 mr-1 sm:mr-2" />
                                        <span className="text-xs sm:text-sm">Export</span>
                                    </Button>
                                    <Button variant="outline" onClick={fetchData} size="sm" className="flex-1 sm:flex-initial">
                                        <RefreshCw className="h-4 w-4 mr-1 sm:mr-2" />
                                        <span className="text-xs sm:text-sm">Refresh</span>
                                    </Button>
                                </div>
                            </div>
                            <div className="flex flex-wrap gap-2 items-center">
                                <div className="relative flex-1 min-w-[200px]">
                                    <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                                    <Input 
                                        placeholder="Search reports..." 
                                        className="pl-9"
                                        value={searchTerm}
                                        onChange={(e) => setSearchTerm(e.target.value)}
                                    />
                                </div>
                                <Select value={statusFilter} onValueChange={setStatusFilter}>
                                    <SelectTrigger className="w-full sm:w-[150px]">
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
                                    <SelectTrigger className="w-full sm:w-[150px]">
                                        <SelectValue placeholder="Type" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="all">All Types</SelectItem>
                                        <SelectItem value="harassment">Harassment</SelectItem>
                                        <SelectItem value="stalking">Stalking</SelectItem>
                                        <SelectItem value="cyberbullying">Cyberbullying</SelectItem>
                                        <SelectItem value="doxxing">Doxxing</SelectItem>
                                    </SelectContent>
                                </Select>
                                <div className="flex gap-2 w-full sm:w-auto">
                                    <Input 
                                        type="date"
                                        placeholder="Start Date"
                                        className="w-full sm:w-[150px] text-xs sm:text-sm"
                                        value={dateRange.start}
                                        onChange={(e) => setDateRange({ ...dateRange, start: e.target.value })}
                                    />
                                    <Input 
                                        type="date"
                                        placeholder="End Date"
                                        className="w-full sm:w-[150px] text-xs sm:text-sm"
                                        value={dateRange.end}
                                        onChange={(e) => setDateRange({ ...dateRange, end: e.target.value })}
                                    />
                                </div>
                                {(searchTerm || statusFilter !== "all" || typeFilter !== "all" || dateRange.start || dateRange.end) && (
                                    <Button variant="outline" onClick={() => {
                                        setSearchTerm("");
                                        setStatusFilter("all");
                                        setTypeFilter("all");
                                        setDateRange({ start: '', end: '' });
                                    }}>
                                        <XCircle className="h-4 w-4 mr-2" />
                                        Clear Filters
                                    </Button>
                                )}
                            </div>
                            {selectedReports.size > 0 && (
                                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 p-3 bg-primary/5 rounded-lg border border-primary/20">
                                    <span className="text-xs sm:text-sm font-medium">
                                        {selectedReports.size} report{selectedReports.size !== 1 ? 's' : ''} selected
                                    </span>
                                    <div className="flex gap-2 w-full sm:w-auto">
                                        <Button 
                                            variant="outline" 
                                            size="sm"
                                            onClick={() => setIsBulkActionDialogOpen(true)}
                                            className="flex-1 sm:flex-initial text-xs"
                                        >
                                            Bulk Actions
                                        </Button>
                                        <Button 
                                            variant="ghost" 
                                            size="sm"
                                            onClick={() => setSelectedReports(new Set())}
                                            className="flex-1 sm:flex-initial text-xs"
                                        >
                                            Clear
                                        </Button>
                                    </div>
                                </div>
                            )}
                        </div>
                    </CardHeader>
                    <CardContent>
                        <div className="rounded-md border overflow-x-auto">
                            <div className="min-w-[600px] lg:min-w-0">
                                <div className="grid grid-cols-7 gap-2 md:gap-4 p-3 md:p-4 bg-muted/50 font-medium text-xs sm:text-sm">
                                    <div className="col-span-1">
                                        <input
                                            type="checkbox"
                                            checked={selectedReports.size === filteredReports.length && filteredReports.length > 0}
                                            onChange={toggleSelectAll}
                                            className="rounded border-gray-300"
                                        />
                                    </div>
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
                                    ) : filteredReports.length === 0 ? (
                                        <div className="p-8 text-center text-muted-foreground">
                                            {searchTerm ? 'No reports match your search.' : 'No reports found.'}
                                        </div>
                                    ) : (
                                        filteredReports.map((report) => (
                                            <div key={report.id} className="grid grid-cols-7 gap-2 md:gap-4 p-3 md:p-4 text-xs sm:text-sm items-center hover:bg-muted/5 transition-colors">
                                                <div className="col-span-1">
                                                    <input
                                                        type="checkbox"
                                                        checked={selectedReports.has(report.id)}
                                                        onChange={() => toggleReportSelection(report.id)}
                                                        className="rounded border-gray-300"
                                                    />
                                                </div>
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
                                                <div className="col-span-1 text-right flex gap-1 justify-end">
                                                    <Button
                                                        variant="ghost"
                                                        size="icon"
                                                        className="h-8 w-8"
                                                        onClick={() => {
                                                            setViewReport(report);
                                                            setIsViewDialogOpen(true);
                                                        }}
                                                        title="View Details"
                                                    >
                                                        <Eye className="h-4 w-4" />
                                                    </Button>
                                                    <Button
                                                        variant="ghost"
                                                        size="icon"
                                                        className="h-8 w-8"
                                                        onClick={() => {
                                                            setSelectedReport(report);
                                                            setIsReportDialogOpen(true);
                                                        }}
                                                        title="Edit Status"
                                                    >
                                                        <MoreHorizontal className="h-4 w-4" />
                                                    </Button>
                                                </div>
                                            </div>
                                        ))
                                    )}
                                </div>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            )}

            {activeTab === "users" && (
                <Card>
                    <CardHeader>
                        <div className="flex justify-between items-center">
                            <div>
                                <CardTitle>User Management</CardTitle>
                                <CardDescription>
                                    {profiles.length > 0 
                                        ? 'Manage user roles and permissions.' 
                                        : 'Users derived from report submissions. Create a profiles table for full user management.'}
                                </CardDescription>
                            </div>
                        </div>
                    </CardHeader>
                    <CardContent>
                        {profiles.length > 0 ? (
                            // Show profiles if table exists
                            <div className="rounded-md border overflow-x-auto">
                                <div className="min-w-[600px] lg:min-w-0">
                                    <div className="grid grid-cols-4 gap-2 md:gap-4 p-3 md:p-4 bg-muted/50 font-medium text-xs sm:text-sm">
                                    <div className="col-span-1">Name</div>
                                    <div className="col-span-1">Username</div>
                                    <div className="col-span-1">Website</div>
                                    <div className="col-span-1 text-right">Joined</div>
                                </div>
                                <div className="divide-y">
                                    {loading ? (
                                        <div className="p-8 text-center text-muted-foreground">Loading users...</div>
                                    ) : profiles.length === 0 ? (
                                        <div className="p-8 text-center text-muted-foreground">No users found.</div>
                                    ) : (
                                        profiles.map((profile) => (
                                            <div key={profile.id} className="grid grid-cols-4 gap-2 md:gap-4 p-3 md:p-4 text-xs sm:text-sm items-center hover:bg-muted/5 transition-colors">
                                                <div className="col-span-1 font-medium">{profile.full_name || 'N/A'}</div>
                                                <div className="col-span-1 text-muted-foreground">@{profile.username || 'unknown'}</div>
                                                <div className="col-span-1 text-muted-foreground truncate">{profile.website || '-'}</div>
                                                <div className="col-span-1 text-right text-muted-foreground">
                                                    {profile.updated_at ? new Date(profile.updated_at).toLocaleDateString() : 'N/A'}
                                                </div>
                                            </div>
                                        ))
                                    )}
                                </div>
                                </div>
                            </div>
                        ) : (
                            // Show users from reports if profiles table doesn't exist
                            <div className="rounded-md border overflow-x-auto">
                                <div className="min-w-[600px] lg:min-w-0">
                                    <div className="grid grid-cols-5 gap-2 md:gap-4 p-3 md:p-4 bg-muted/50 font-medium text-xs sm:text-sm">
                                    <div className="col-span-1">User ID</div>
                                    <div className="col-span-1">Reports</div>
                                    <div className="col-span-1">First Report</div>
                                    <div className="col-span-1">Last Report</div>
                                    <div className="col-span-1 text-right">Status</div>
                                </div>
                                <div className="divide-y">
                                    {loading ? (
                                        <div className="p-8 text-center text-muted-foreground">Loading users...</div>
                                    ) : users.length === 0 ? (
                                        <div className="p-8 text-center text-muted-foreground">
                                            <p>No users found.</p>
                                            <p className="text-xs mt-2">Users will appear here once they submit reports.</p>
                                        </div>
                                    ) : (
                                        users.map((user) => (
                                            <div key={user.id} className="grid grid-cols-5 gap-2 md:gap-4 p-3 md:p-4 text-xs sm:text-sm items-center hover:bg-muted/5 transition-colors">
                                                <div className="col-span-1 font-mono text-xs truncate" title={user.id}>
                                                    {user.id === 'anonymous' ? (
                                                        <span className="text-muted-foreground italic">Anonymous</span>
                                                    ) : (
                                                        `#${user.id.slice(0, 8)}`
                                                    )}
                                                </div>
                                                <div className="col-span-1">
                                                    <span className="font-medium">{user.reports_count}</span>
                                                    <span className="text-muted-foreground text-xs ml-1">report{user.reports_count !== 1 ? 's' : ''}</span>
                                                </div>
                                                <div className="col-span-1 text-muted-foreground text-xs">
                                                    {user.first_report_date ? new Date(user.first_report_date).toLocaleDateString() : 'N/A'}
                                                </div>
                                                <div className="col-span-1 text-muted-foreground text-xs">
                                                    {user.last_report_date ? new Date(user.last_report_date).toLocaleDateString() : 'N/A'}
                                                </div>
                                                <div className="col-span-1 text-right">
                                                    {user.is_anonymous ? (
                                                        <span className="px-2 py-1 rounded-full text-xs font-medium bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-400">
                                                            Has Anonymous
                                                        </span>
                                                    ) : (
                                                        <span className="px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400">
                                                            Registered
                                                        </span>
                                                    )}
                                                </div>
                                            </div>
                                        ))
                                    )}
                                </div>
                                </div>
                            </div>
                        )}
                    </CardContent>
                    
                </Card>
            )}

            {activeTab === "analytics" && (
                <div className="space-y-6">
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
                                            <span className="text-sm capitalize">{type}</span>
                                            <div className="flex items-center gap-2">
                                                <div className="w-32 bg-muted rounded-full h-2">
                                                    <div 
                                                        className="bg-primary h-2 rounded-full" 
                                                        style={{ width: `${(count / stats.total) * 100}%` }}
                                                    />
                                                </div>
                                                <span className="text-sm font-medium w-12 text-right">{count}</span>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </CardContent>
                        </Card>
                        <Card>
                            <CardHeader>
                                <CardTitle className="text-lg sm:text-xl">Reports by Status</CardTitle>
                                <CardDescription>Current status distribution</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-4">
                                    {Object.entries(analytics.reportsByStatus).map(([status, count]) => (
                                        <div key={status} className="flex items-center justify-between">
                                            <span className="text-sm capitalize">{status}</span>
                                            <div className="flex items-center gap-2">
                                                <div className="w-32 bg-muted rounded-full h-2">
                                                    <div 
                                                        className="bg-primary h-2 rounded-full" 
                                                        style={{ width: `${(count / stats.total) * 100}%` }}
                                                    />
                                                </div>
                                                <span className="text-sm font-medium w-12 text-right">{count}</span>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                    <Card>
                        <CardHeader>
                            <CardTitle className="text-lg sm:text-xl">Reports Over Time</CardTitle>
                            <CardDescription className="text-xs sm:text-sm">Last 7 days activity</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="h-[250px] sm:h-[300px] flex items-end justify-between gap-1 sm:gap-2">
                                {analytics.reportsByDay.map((day, index) => {
                                    const maxCount = Math.max(...analytics.reportsByDay.map(d => d.count), 1);
                                    return (
                                        <div key={index} className="flex-1 flex flex-col items-center gap-2">
                                            <div className="w-full flex items-end justify-center" style={{ height: '250px' }}>
                                                <div 
                                                    className="w-full bg-primary rounded-t transition-all"
                                                    style={{ height: `${(day.count / maxCount) * 100}%`, minHeight: day.count > 0 ? '4px' : '0' }}
                                                />
                                            </div>
                                            <span className="text-xs text-muted-foreground">
                                                {new Date(day.date).toLocaleDateString('en-US', { weekday: 'short' })}
                                            </span>
                                            <span className="text-xs font-medium">{day.count}</span>
                                        </div>
                                    );
                                })}
                            </div>
                        </CardContent>
                    </Card>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 md:gap-6">
                        <Card>
                            <CardHeader>
                                <CardTitle className="text-xs sm:text-sm">Average Resolution Time</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold">{analytics.avgResolutionTime}</div>
                                <p className="text-xs text-muted-foreground">Days</p>
                            </CardContent>
                        </Card>
                        <Card>
                            <CardHeader>
                                <CardTitle className="text-xs sm:text-sm">Resolution Rate</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold">
                                    {stats.total > 0 ? Math.round((stats.resolved / stats.total) * 100) : 0}%
                                </div>
                                <p className="text-xs text-muted-foreground">
                                    {stats.resolved} of {stats.total} resolved
                                </p>
                            </CardContent>
                        </Card>
                        <Card>
                            <CardHeader>
                                <CardTitle className="text-xs sm:text-sm">Active Cases Rate</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold">
                                    {stats.total > 0 ? Math.round((stats.active / stats.total) * 100) : 0}%
                                </div>
                                <p className="text-xs text-muted-foreground">
                                    {stats.active} currently active
                                </p>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            )}

            {activeTab === "posts" && (
                <Card>
                    <CardHeader>
                        <div className="flex justify-between items-center">
                            <div>
                                <CardTitle>Community Posts Management</CardTitle>
                                <CardDescription>Monitor and moderate community posts</CardDescription>
                            </div>
                            <Button variant="outline" onClick={fetchCommunityPosts}>
                                <RefreshCw className="h-4 w-4 mr-2" />
                                Refresh
                            </Button>
                        </div>
                    </CardHeader>
                    <CardContent>
                        <div className="rounded-md border">
                            {loading ? (
                                <div className="p-6 md:p-8 text-center text-muted-foreground text-sm">Loading posts...</div>
                            ) : communityPosts.length === 0 ? (
                                <div className="p-6 md:p-8 text-center text-muted-foreground text-sm">No posts found.</div>
                            ) : (
                                <div className="divide-y">
                                    {communityPosts.map((post) => (
                                        <div 
                                            key={post.id} 
                                            className={`p-3 md:p-4 hover:bg-muted/5 transition-colors ${post.is_flagged ? 'bg-destructive/5 border-l-4 border-destructive' : ''}`}
                                        >
                                            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-4">
                                                <div className="flex-1 min-w-0">
                                                    <div className="flex items-center gap-2 mb-2">
                                                        <h3 className="font-semibold truncate">{post.title}</h3>
                                                        {post.is_flagged && (
                                                            <span className="px-2 py-1 rounded-full text-xs font-medium bg-destructive text-destructive-foreground">
                                                                Flagged
                                                            </span>
                                                        )}
                                                    </div>
                                                    <p className="text-sm text-muted-foreground mb-2 line-clamp-2">
                                                        {post.content}
                                                    </p>
                                                    <div className="flex items-center gap-4 text-xs text-muted-foreground">
                                                        <span>By: {post.author_name}</span>
                                                        <span>•</span>
                                                        <span>{new Date(post.created_at).toLocaleDateString()}</span>
                                                        <span>•</span>
                                                        <span>{post.likes_count} likes</span>
                                                        <span>•</span>
                                                        <span>{post.comments_count} comments</span>
                                                        {post.tags && post.tags.length > 0 && (
                                                            <>
                                                                <span>•</span>
                                                                <div className="flex gap-1">
                                                                    {post.tags.slice(0, 3).map(tag => (
                                                                        <span key={tag} className="bg-secondary px-1 rounded text-xs">
                                                                            #{tag}
                                                                        </span>
                                                                    ))}
                                                                </div>
                                                            </>
                                                        )}
                                                    </div>
                                                    {post.is_flagged && post.flagged_reason && (
                                                        <div className="mt-2 p-2 bg-destructive/10 rounded text-xs">
                                                            <strong>Flag Reason:</strong> {post.flagged_reason}
                                                        </div>
                                                    )}
                                                </div>
                                                <div className="flex gap-2 flex-shrink-0 w-full sm:w-auto">
                                                    {!post.is_flagged ? (
                                                        <Button
                                                            variant="outline"
                                                            size="sm"
                                                            onClick={() => {
                                                                setSelectedPost(post);
                                                                setIsPostDialogOpen(true);
                                                            }}
                                                            className="flex-1 sm:flex-initial text-xs"
                                                        >
                                                            <AlertTriangle className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2" />
                                                            Flag
                                                        </Button>
                                                    ) : (
                                                        <Button
                                                            variant="outline"
                                                            size="sm"
                                                            onClick={() => handleUnflagPost(post.id)}
                                                            disabled={updateLoading}
                                                            className="flex-1 sm:flex-initial text-xs"
                                                        >
                                                            <CheckCircle className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2" />
                                                            Unflag
                                                        </Button>
                                                    )}
                                                    <Button
                                                        variant="destructive"
                                                        size="sm"
                                                        onClick={() => handleDeletePost(post.id)}
                                                        disabled={updateLoading}
                                                        className="flex-1 sm:flex-initial text-xs"
                                                    >
                                                        <Trash2 className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2" />
                                                        Delete
                                                    </Button>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </CardContent>
                </Card>
            )}

            {activeTab === "counselors" && (
                <Card>
                    <CardHeader>
                        <div className="flex justify-between items-center">
                            <div>
                                <CardTitle>Counselors Management</CardTitle>
                                <CardDescription>Add, edit, and manage counselors</CardDescription>
                            </div>
                            <Button onClick={handleAddCounselor}>
                                <Users className="h-4 w-4 mr-2" />
                                Add Counselor
                            </Button>
                        </div>
                    </CardHeader>
                    <CardContent>
                        <div className="rounded-md border overflow-x-auto">
                            {counselors.length === 0 ? (
                                <div className="p-8 text-center text-muted-foreground">
                                    <Users className="h-12 w-12 mx-auto mb-2 opacity-50" />
                                    <p>No counselors found.</p>
                                    <p className="text-xs mt-2">Click "Add Counselor" to add a new counselor.</p>
                                </div>
                            ) : (
                                <div className="divide-y min-w-[600px] lg:min-w-0">
                                    <div className="grid grid-cols-7 gap-2 md:gap-4 p-3 md:p-4 bg-muted/50 font-medium text-xs sm:text-sm">
                                        <div className="col-span-2">Name</div>
                                        <div className="col-span-2">Specialization</div>
                                        <div className="col-span-1">Rating</div>
                                        <div className="col-span-1">Distance</div>
                                        <div className="col-span-1 text-right">Actions</div>
                                    </div>
                                    {counselors.map((counselor) => (
                                        <div key={counselor.id} className="grid grid-cols-7 gap-2 md:gap-4 p-3 md:p-4 text-xs sm:text-sm items-center hover:bg-muted/5 transition-colors">
                                            <div className="col-span-2 font-medium">{counselor.name}</div>
                                            <div className="col-span-2 text-muted-foreground capitalize">{counselor.specialization}</div>
                                            <div className="col-span-1">
                                                <div className="flex items-center gap-1 text-yellow-500">
                                                    <Star className="h-4 w-4 fill-current" />
                                                    <span>{counselor.rating}</span>
                                                </div>
                                            </div>
                                            <div className="col-span-1 text-muted-foreground">{counselor.distance}</div>
                                            <div className="col-span-1 text-right flex gap-2 justify-end">
                                                <Button
                                                    variant="outline"
                                                    size="sm"
                                                    onClick={() => handleEditCounselor(counselor)}
                                                >
                                                    Edit
                                                </Button>
                                                <Button
                                                    variant="destructive"
                                                    size="sm"
                                                    onClick={() => handleDeleteCounselor(counselor.id)}
                                                    disabled={updateLoading}
                                                >
                                                    <Trash2 className="h-4 w-4" />
                                                </Button>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </CardContent>
                </Card>
            )}

            {activeTab === "settings" && (
                <div className="space-y-6">
                    <Card>
                        <CardHeader>
                            <CardTitle>System Settings</CardTitle>
                            <CardDescription>Configure platform settings and preferences</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            <div className="space-y-2">
                                <Label>Auto-refresh Interval</Label>
                                <Select defaultValue="30">
                                    <SelectTrigger>
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="10">10 seconds</SelectItem>
                                        <SelectItem value="30">30 seconds</SelectItem>
                                        <SelectItem value="60">1 minute</SelectItem>
                                        <SelectItem value="300">5 minutes</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="space-y-2">
                                <Label>Default Report Status</Label>
                                <Select defaultValue="pending">
                                    <SelectTrigger>
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="pending">Pending</SelectItem>
                                        <SelectItem value="investigating">Investigating</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="flex items-center justify-between p-4 border rounded-lg">
                                <div>
                                    <Label>Email Notifications</Label>
                                    <p className="text-sm text-muted-foreground">Receive email alerts for new reports</p>
                                </div>
                                <input type="checkbox" defaultChecked className="rounded" />
                            </div>
                            <div className="flex items-center justify-between p-4 border rounded-lg">
                                <div>
                                    <Label>Real-time Updates</Label>
                                    <p className="text-sm text-muted-foreground">Enable live dashboard updates</p>
                                </div>
                                <input type="checkbox" defaultChecked className="rounded" />
                            </div>
                            <Button>Save Settings</Button>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader>
                            <CardTitle>Data Management</CardTitle>
                            <CardDescription>Export and manage platform data</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <Button variant="outline" className="w-full" onClick={exportReports}>
                                <Download className="h-4 w-4 mr-2" />
                                Export All Reports (CSV)
                            </Button>
                            <Button variant="outline" className="w-full">
                                <Download className="h-4 w-4 mr-2" />
                                Export User Data (CSV)
                            </Button>
                            <div className="pt-4 border-t">
                                <Label className="text-destructive">Danger Zone</Label>
                                <p className="text-sm text-muted-foreground mb-4">Irreversible actions</p>
                                <Button variant="destructive" className="w-full">
                                    <Trash2 className="h-4 w-4 mr-2" />
                                    Clear All Data
                                </Button>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            )}

            {/* Bulk Action Dialog */}
            <Dialog open={isBulkActionDialogOpen} onOpenChange={setIsBulkActionDialogOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Bulk Actions</DialogTitle>
                        <DialogDescription>
                            Apply action to {selectedReports.size} selected report{selectedReports.size !== 1 ? 's' : ''}
                        </DialogDescription>
                    </DialogHeader>
                    <div className="py-4 space-y-4">
                        <div className="space-y-2">
                            <Label>Action</Label>
                            <Select value={bulkAction} onValueChange={setBulkAction}>
                                <SelectTrigger>
                                    <SelectValue placeholder="Select action" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="pending">Mark as Pending</SelectItem>
                                    <SelectItem value="investigating">Mark as Investigating</SelectItem>
                                    <SelectItem value="resolved">Mark as Resolved</SelectItem>
                                    <SelectItem value="dismissed">Mark as Dismissed</SelectItem>
                                    <SelectItem value="delete">Delete Reports</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="flex gap-2 justify-end">
                            <Button variant="outline" onClick={() => setIsBulkActionDialogOpen(false)}>
                                Cancel
                            </Button>
                            <Button 
                                onClick={() => bulkAction && handleBulkAction(bulkAction)}
                                disabled={!bulkAction || updateLoading}
                                variant={bulkAction === 'delete' ? 'destructive' : 'default'}
                            >
                                {updateLoading ? 'Processing...' : 'Apply'}
                            </Button>
                        </div>
                    </div>
                </DialogContent>
            </Dialog>

            {/* Add/Edit Counselor Dialog */}
            <Dialog open={isCounselorDialogOpen} onOpenChange={(open) => {
                setIsCounselorDialogOpen(open);
                if (!open) {
                    setSelectedCounselor(null);
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
                }
            }}>
                <DialogContent className="max-w-[95vw] sm:max-w-2xl max-h-[90vh] overflow-y-auto mx-4">
                    <DialogHeader>
                        <DialogTitle>{isEditMode ? 'Edit Counselor' : 'Add New Counselor'}</DialogTitle>
                        <DialogDescription>
                            {isEditMode ? 'Update counselor information' : 'Add a new counselor to the platform'}
                        </DialogDescription>
                    </DialogHeader>
                    <div className="py-4 space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="name">Name *</Label>
                                <Input
                                    id="name"
                                    placeholder="Dr. John Doe"
                                    value={counselorForm.name}
                                    onChange={(e) => setCounselorForm({ ...counselorForm, name: e.target.value })}
                                    required
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="specialization">Specialization *</Label>
                                <Input
                                    id="specialization"
                                    placeholder="Trauma & Legal Support"
                                    value={counselorForm.specialization}
                                    onChange={(e) => setCounselorForm({ ...counselorForm, specialization: e.target.value })}
                                    required
                                />
                            </div>
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="rating">Rating</Label>
                                <Input
                                    id="rating"
                                    type="number"
                                    min="1"
                                    max="5"
                                    step="0.1"
                                    placeholder="5.0"
                                    value={counselorForm.rating}
                                    onChange={(e) => setCounselorForm({ ...counselorForm, rating: parseFloat(e.target.value) || 5 })}
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="distance">Distance</Label>
                                <Input
                                    id="distance"
                                    placeholder="2.5 km"
                                    value={counselorForm.distance}
                                    onChange={(e) => setCounselorForm({ ...counselorForm, distance: e.target.value })}
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="availability">Availability *</Label>
                                <Input
                                    id="availability"
                                    placeholder="Available Now"
                                    value={counselorForm.availability}
                                    onChange={(e) => setCounselorForm({ ...counselorForm, availability: e.target.value })}
                                    required
                                />
                            </div>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="location_lat">Latitude</Label>
                                <Input
                                    id="location_lat"
                                    type="number"
                                    step="any"
                                    placeholder="51.505"
                                    value={counselorForm.location_lat}
                                    onChange={(e) => setCounselorForm({ ...counselorForm, location_lat: parseFloat(e.target.value) || 0 })}
                                />
                                <p className="text-xs text-muted-foreground">Map location latitude</p>
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="location_lng">Longitude</Label>
                                <Input
                                    id="location_lng"
                                    type="number"
                                    step="any"
                                    placeholder="-0.09"
                                    value={counselorForm.location_lng}
                                    onChange={(e) => setCounselorForm({ ...counselorForm, location_lng: parseFloat(e.target.value) || 0 })}
                                />
                                <p className="text-xs text-muted-foreground">Map location longitude</p>
                            </div>
                        </div>
                        <div className="flex gap-2 justify-end pt-4">
                            <Button variant="outline" onClick={() => setIsCounselorDialogOpen(false)}>
                                Cancel
                            </Button>
                            <Button 
                                onClick={handleSaveCounselor}
                                disabled={updateLoading || !counselorForm.name || !counselorForm.specialization || !counselorForm.availability}
                            >
                                {updateLoading ? 'Saving...' : isEditMode ? 'Update Counselor' : 'Add Counselor'}
                            </Button>
                        </div>
                    </div>
                </DialogContent>
            </Dialog>

            {/* Flag Post Dialog */}
            <Dialog open={isPostDialogOpen} onOpenChange={(open) => {
                setIsPostDialogOpen(open);
                if (!open) {
                    setSelectedPost(null);
                    setFlagReason("");
                }
            }}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Flag Post</DialogTitle>
                        <DialogDescription>
                            Flag post: "{selectedPost?.title}"
                        </DialogDescription>
                    </DialogHeader>
                    <div className="py-4 space-y-4">
                        <div className="space-y-2">
                            <Label>Reason for Flagging</Label>
                            <Textarea
                                placeholder="Enter reason for flagging this post (e.g., inappropriate content, harassment, spam)..."
                                value={flagReason}
                                onChange={(e) => setFlagReason(e.target.value)}
                                className="min-h-[100px]"
                            />
                        </div>
                        {selectedPost && (
                            <div className="p-3 bg-muted/50 rounded-md text-sm">
                                <p className="font-medium mb-1">Post Content:</p>
                                <p className="text-muted-foreground">{selectedPost.content}</p>
                            </div>
                        )}
                        <div className="flex gap-2 justify-end">
                            <Button variant="outline" onClick={() => setIsPostDialogOpen(false)}>
                                Cancel
                            </Button>
                            <Button 
                                onClick={handleFlagPost}
                                disabled={!flagReason.trim() || updateLoading}
                                variant="destructive"
                            >
                                {updateLoading ? 'Flagging...' : 'Flag Post'}
                            </Button>
                        </div>
                    </div>
                </DialogContent>
            </Dialog>

            {/* View Report Dialog */}
            <Dialog open={isViewDialogOpen} onOpenChange={setIsViewDialogOpen}>
                <DialogContent className="max-w-[95vw] sm:max-w-2xl max-h-[80vh] overflow-y-auto mx-4">
                    <DialogHeader>
                        <DialogTitle>Report Details</DialogTitle>
                        <DialogDescription>
                            Report #{viewReport?.id.slice(0, 8)}
                        </DialogDescription>
                    </DialogHeader>
                    {viewReport && (
                        <div className="space-y-4 py-4">
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div>
                                    <Label className="text-muted-foreground">Status</Label>
                                    <div className="mt-1">
                                        <span className={`px-2 py-1 rounded-full text-xs font-medium capitalize ${
                                            viewReport.status === 'resolved'
                                                ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400'
                                                : 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400'
                                        }`}>
                                            {viewReport.status}
                                        </span>
                                    </div>
                                </div>
                                <div>
                                    <Label className="text-muted-foreground">Type</Label>
                                    <div className="mt-1 capitalize">{viewReport.type}</div>
                                </div>
                                <div>
                                    <Label className="text-muted-foreground">Created At</Label>
                                    <div className="mt-1">{new Date(viewReport.created_at).toLocaleString()}</div>
                                </div>
                                <div>
                                    <Label className="text-muted-foreground">Incident Date</Label>
                                    <div className="mt-1">
                                        {viewReport.incident_date ? new Date(viewReport.incident_date).toLocaleDateString() : 'N/A'}
                                    </div>
                                </div>
                                <div>
                                    <Label className="text-muted-foreground">Anonymous</Label>
                                    <div className="mt-1">{viewReport.is_anonymous ? 'Yes' : 'No'}</div>
                                </div>
                            </div>
                            <div>
                                <Label className="text-muted-foreground">Description</Label>
                                <div className="mt-1 p-3 bg-muted/50 rounded-md">
                                    {viewReport.description || 'No description provided'}
                                </div>
                            </div>
                            <div className="flex gap-2 justify-end">
                                <Button variant="outline" onClick={() => setIsViewDialogOpen(false)}>
                                    Close
                                </Button>
                                <Button onClick={() => {
                                    setIsViewDialogOpen(false);
                                    setSelectedReport(viewReport);
                                    setIsReportDialogOpen(true);
                                }}>
                                    Edit Status
                                </Button>
                            </div>
                        </div>
                    )}
                </DialogContent>
            </Dialog>
        </div>
    );
}