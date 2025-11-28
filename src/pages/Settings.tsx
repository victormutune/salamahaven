import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { User, Lock, Bell, Shield, Save } from 'lucide-react';
import { useState } from 'react';

export default function Settings() {
    const [activeTab, setActiveTab] = useState("profile");

    return (
        <div className="container py-10 max-w-5xl">
            <h1 className="text-3xl font-bold mb-6">Account Settings</h1>

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
                                        JD
                                    </div>
                                    <Button variant="outline" size="sm">Change Avatar</Button>
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <Label htmlFor="firstName">First Name</Label>
                                        <Input id="firstName" defaultValue="Jane" />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="lastName">Last Name</Label>
                                        <Input id="lastName" defaultValue="Doe" />
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="email">Email</Label>
                                    <Input id="email" type="email" defaultValue="jane.doe@example.com" />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="bio">Bio</Label>
                                    <Input id="bio" placeholder="Tell us a little about yourself" />
                                </div>
                            </CardContent>
                            <CardFooter>
                                <Button>
                                    <Save className="mr-2 h-4 w-4" /> Save Changes
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
                                    <Label htmlFor="currentPassword">Current Password</Label>
                                    <Input id="currentPassword" type="password" />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="newPassword">New Password</Label>
                                    <Input id="newPassword" type="password" />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="confirmNewPassword">Confirm New Password</Label>
                                    <Input id="confirmNewPassword" type="password" />
                                </div>
                                <div className="pt-4 border-t">
                                    <h3 className="font-medium mb-2">Two-Factor Authentication</h3>
                                    <div className="flex items-center justify-between">
                                        <div className="text-sm text-muted-foreground">
                                            Add an extra layer of security to your account.
                                        </div>
                                        <Button variant="outline">Enable 2FA</Button>
                                    </div>
                                </div>
                            </CardContent>
                            <CardFooter>
                                <Button>
                                    <Save className="mr-2 h-4 w-4" /> Update Password
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
                                    <input type="checkbox" className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary" defaultChecked />
                                </div>
                                <div className="flex items-center justify-between p-2 rounded hover:bg-muted/50">
                                    <div className="space-y-0.5">
                                        <Label className="text-base">Report Updates</Label>
                                        <p className="text-sm text-muted-foreground">Get notified when your report status changes.</p>
                                    </div>
                                    <input type="checkbox" className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary" defaultChecked />
                                </div>
                                <div className="flex items-center justify-between p-2 rounded hover:bg-muted/50">
                                    <div className="space-y-0.5">
                                        <Label className="text-base">Community Replies</Label>
                                        <p className="text-sm text-muted-foreground">Notify me when someone replies to my posts.</p>
                                    </div>
                                    <input type="checkbox" className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary" defaultChecked />
                                </div>
                            </CardContent>
                            <CardFooter>
                                <Button>
                                    <Save className="mr-2 h-4 w-4" /> Save Preferences
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
                                    <input type="checkbox" className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary" />
                                </div>
                                <div className="flex items-center justify-between p-2 rounded hover:bg-muted/50">
                                    <div className="space-y-0.5">
                                        <Label className="text-base">Show Online Status</Label>
                                        <p className="text-sm text-muted-foreground">Let others know when you are active.</p>
                                    </div>
                                    <input type="checkbox" className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary" />
                                </div>
                            </CardContent>
                            <CardFooter>
                                <Button>
                                    <Save className="mr-2 h-4 w-4" /> Save Privacy Settings
                                </Button>
                            </CardFooter>
                        </Card>
                    )}
                </div>
            </div>
        </div>
    );
}
