import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { User, Lock, Bell, Shield, Save, Loader2 } from 'lucide-react';
import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/lib/supabase';

export default function Settings() {
    const { user } = useAuth();
    const [activeTab, setActiveTab] = useState("profile");
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);

    // Profile State
    const [profile, setProfile] = useState({
        firstName: '',
        lastName: '',
        email: '',
        bio: ''
    });

    // Password State
    const [passwords, setPasswords] = useState({
        newPassword: '',
        confirmNewPassword: ''
    });

    // Preferences State
    const [preferences, setPreferences] = useState({
        emailNotifications: true,
        reportUpdates: true,
        communityReplies: true,
        publicProfile: false,
        showOnlineStatus: false
    });

    useEffect(() => {
        if (user) {
            const metadata = user.user_metadata || {};
            // Split full name if available
            const fullName = metadata.full_name || '';
            const [first, ...last] = fullName.split(' ');

            setProfile({
                firstName: first || '',
                lastName: last.join(' ') || '',
                email: user.email || '',
                bio: metadata.bio || ''
            });

            setPreferences({
                emailNotifications: metadata.emailNotifications ?? true,
                reportUpdates: metadata.reportUpdates ?? true,
                communityReplies: metadata.communityReplies ?? true,
                publicProfile: metadata.publicProfile ?? false,
                showOnlineStatus: metadata.showOnlineStatus ?? false
            });
        }
    }, [user]);

    const handleUpdateProfile = async () => {
        setLoading(true);
        setMessage(null);
        try {
            const fullName = `${profile.firstName} ${profile.lastName}`.trim();
            const { error } = await supabase.auth.updateUser({
                data: {
                    full_name: fullName,
                    bio: profile.bio
                }
            });

            if (error) throw error;
            setMessage({ type: 'success', text: 'Profile updated successfully!' });
        } catch (error: any) {
            setMessage({ type: 'error', text: error.message });
        } finally {
            setLoading(false);
        }
    };

    const handleUpdatePassword = async () => {
        setLoading(true);
        setMessage(null);

        if (passwords.newPassword !== passwords.confirmNewPassword) {
            setMessage({ type: 'error', text: 'Passwords do not match' });
            setLoading(false);
            return;
        }

        try {
            const { error } = await supabase.auth.updateUser({
                password: passwords.newPassword
            });

            if (error) throw error;
            setMessage({ type: 'success', text: 'Password updated successfully!' });
            setPasswords({ newPassword: '', confirmNewPassword: '' });
        } catch (error: any) {
            setMessage({ type: 'error', text: error.message });
        } finally {
            setLoading(false);
        }
    };

    const handleUpdatePreferences = async () => {
        setLoading(true);
        setMessage(null);
        try {
            const { error } = await supabase.auth.updateUser({
                data: {
                    ...preferences
                }
            });

            if (error) throw error;
            setMessage({ type: 'success', text: 'Preferences updated successfully!' });
        } catch (error: any) {
            setMessage({ type: 'error', text: error.message });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="container py-10 max-w-5xl">
            <h1 className="text-3xl font-extrabold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-amber-700 via-orange-700 to-emerald-700 dark:from-amber-300 dark:via-orange-300 dark:to-emerald-300">Account Settings</h1>

            {message && (
                <div className={`p-4 mb-6 rounded-md ${message.type === 'success' ? 'bg-green-50 text-green-700 border border-green-200' : 'bg-red-50 text-red-700 border border-red-200'}`}>
                    {message.text}
                </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
                {/* Sidebar Navigation */}
                <div className="md:col-span-3">
                    <Card className="border-none shadow-none bg-transparent md:bg-card md:border md:shadow-sm">
                        <CardContent className="p-0 md:p-4">
                            <nav className="flex flex-row md:flex-col gap-2 overflow-x-auto md:overflow-visible pb-4 md:pb-0">
                                <Button
                                    variant={activeTab === "profile" ? "secondary" : "ghost"}
                                    className="justify-start"
                                    onClick={() => setActiveTab("profile")}
                                >
                                    <User className="mr-2 h-4 w-4" /> Profile
                                </Button>
                                <Button
                                    variant={activeTab === "security" ? "secondary" : "ghost"}
                                    className="justify-start"
                                    onClick={() => setActiveTab("security")}
                                >
                                    <Lock className="mr-2 h-4 w-4" /> Security
                                </Button>
                                <Button
                                    variant={activeTab === "notifications" ? "secondary" : "ghost"}
                                    className="justify-start"
                                    onClick={() => setActiveTab("notifications")}
                                >
                                    <Bell className="mr-2 h-4 w-4" /> Notifications
                                </Button>
                                <Button
                                    variant={activeTab === "privacy" ? "secondary" : "ghost"}
                                    className="justify-start"
                                    onClick={() => setActiveTab("privacy")}
                                >
                                    <Shield className="mr-2 h-4 w-4" /> Privacy
                                </Button>
                            </nav>
                        </CardContent>
                    </Card>
                </div>

                {/* Content Area */}
                <div className="md:col-span-9">
                    {activeTab === "profile" && (
                        <Card>
                            <CardHeader>
                                <CardTitle>Profile Information</CardTitle>
                                <CardDescription>Update your personal details.</CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="flex items-center gap-4 mb-4">
                                    <div className="h-20 w-20 rounded-full bg-primary/10 flex items-center justify-center text-2xl font-bold text-primary">
                                        {profile.firstName?.[0]}{profile.lastName?.[0] || profile.firstName?.[1]}
                                    </div>
                                    {/* <Button variant="outline" size="sm">Change Avatar</Button> */}
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <Label htmlFor="firstName">First Name</Label>
                                        <Input
                                            id="firstName"
                                            value={profile.firstName}
                                            onChange={(e) => setProfile({ ...profile, firstName: e.target.value })}
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="lastName">Last Name</Label>
                                        <Input
                                            id="lastName"
                                            value={profile.lastName}
                                            onChange={(e) => setProfile({ ...profile, lastName: e.target.value })}
                                        />
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="email">Email</Label>
                                    <Input
                                        id="email"
                                        type="email"
                                        value={profile.email}
                                        disabled
                                        className="bg-muted"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="bio">Bio</Label>
                                    <Input
                                        id="bio"
                                        placeholder="Tell us a little about yourself"
                                        value={profile.bio}
                                        onChange={(e) => setProfile({ ...profile, bio: e.target.value })}
                                    />
                                </div>
                            </CardContent>
                            <CardFooter>
                                <Button onClick={handleUpdateProfile} disabled={loading}>
                                    {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Save className="mr-2 h-4 w-4" />}
                                    Save Changes
                                </Button>
                            </CardFooter>
                        </Card>
                    )}

                    {activeTab === "security" && (
                        <Card>
                            <CardHeader>
                                <CardTitle>Security Settings</CardTitle>
                                <CardDescription>Manage your password and security preferences.</CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="space-y-2">
                                    <Label htmlFor="newPassword">New Password</Label>
                                    <Input
                                        id="newPassword"
                                        type="password"
                                        value={passwords.newPassword}
                                        onChange={(e) => setPasswords({ ...passwords, newPassword: e.target.value })}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="confirmNewPassword">Confirm New Password</Label>
                                    <Input
                                        id="confirmNewPassword"
                                        type="password"
                                        value={passwords.confirmNewPassword}
                                        onChange={(e) => setPasswords({ ...passwords, confirmNewPassword: e.target.value })}
                                    />
                                </div>
                            </CardContent>
                            <CardFooter>
                                <Button onClick={handleUpdatePassword} disabled={loading}>
                                    {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Save className="mr-2 h-4 w-4" />}
                                    Update Password
                                </Button>
                            </CardFooter>
                        </Card>
                    )}

                    {activeTab === "notifications" && (
                        <Card>
                            <CardHeader>
                                <CardTitle>Notification Preferences</CardTitle>
                                <CardDescription>Choose what you want to be notified about.</CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="flex items-center justify-between p-2 rounded hover:bg-muted/50">
                                    <div className="space-y-0.5">
                                        <Label className="text-base">Email Notifications</Label>
                                        <p className="text-sm text-muted-foreground">Receive emails about your account activity.</p>
                                    </div>
                                    <input
                                        type="checkbox"
                                        className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
                                        checked={preferences.emailNotifications}
                                        onChange={(e) => setPreferences({ ...preferences, emailNotifications: e.target.checked })}
                                    />
                                </div>
                                <div className="flex items-center justify-between p-2 rounded hover:bg-muted/50">
                                    <div className="space-y-0.5">
                                        <Label className="text-base">Report Updates</Label>
                                        <p className="text-sm text-muted-foreground">Get notified when your report status changes.</p>
                                    </div>
                                    <input
                                        type="checkbox"
                                        className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
                                        checked={preferences.reportUpdates}
                                        onChange={(e) => setPreferences({ ...preferences, reportUpdates: e.target.checked })}
                                    />
                                </div>
                                <div className="flex items-center justify-between p-2 rounded hover:bg-muted/50">
                                    <div className="space-y-0.5">
                                        <Label className="text-base">Community Replies</Label>
                                        <p className="text-sm text-muted-foreground">Notify me when someone replies to my posts.</p>
                                    </div>
                                    <input
                                        type="checkbox"
                                        className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
                                        checked={preferences.communityReplies}
                                        onChange={(e) => setPreferences({ ...preferences, communityReplies: e.target.checked })}
                                    />
                                </div>
                            </CardContent>
                            <CardFooter>
                                <Button onClick={handleUpdatePreferences} disabled={loading}>
                                    {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Save className="mr-2 h-4 w-4" />}
                                    Save Preferences
                                </Button>
                            </CardFooter>
                        </Card>
                    )}

                    {activeTab === "privacy" && (
                        <Card>
                            <CardHeader>
                                <CardTitle>Privacy Settings</CardTitle>
                                <CardDescription>Control who can see your profile and activity.</CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="flex items-center justify-between p-2 rounded hover:bg-muted/50">
                                    <div className="space-y-0.5">
                                        <Label className="text-base">Public Profile</Label>
                                        <p className="text-sm text-muted-foreground">Allow others to see your profile information.</p>
                                    </div>
                                    <input
                                        type="checkbox"
                                        className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
                                        checked={preferences.publicProfile}
                                        onChange={(e) => setPreferences({ ...preferences, publicProfile: e.target.checked })}
                                    />
                                </div>
                                <div className="flex items-center justify-between p-2 rounded hover:bg-muted/50">
                                    <div className="space-y-0.5">
                                        <Label className="text-base">Show Online Status</Label>
                                        <p className="text-sm text-muted-foreground">Let others know when you are active.</p>
                                    </div>
                                    <input
                                        type="checkbox"
                                        className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
                                        checked={preferences.showOnlineStatus}
                                        onChange={(e) => setPreferences({ ...preferences, showOnlineStatus: e.target.checked })}
                                    />
                                </div>
                            </CardContent>
                            <CardFooter>
                                <Button onClick={handleUpdatePreferences} disabled={loading}>
                                    {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Save className="mr-2 h-4 w-4" />}
                                    Save Privacy Settings
                                </Button>
                            </CardFooter>
                        </Card>
                    )}
                </div>
            </div>
        </div>
    );
}
