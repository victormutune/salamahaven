import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Shield, Lock, Heart, ArrowRight, Calendar, FileText, Bell } from 'lucide-react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';

export default function LandingPage() {
    const { isAuthenticated } = useAuth();

    return (
        <div className="flex flex-col min-h-screen">
            {/* Hero Section */}
            <section className="relative py-20 md:py-32 overflow-hidden bg-gradient-to-b from-amber-50 via-orange-50 to-emerald-50 dark:from-slate-900 dark:via-slate-950 dark:to-slate-950 bg-african-textile">
                <div className="container relative z-10 text-center">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5 }}
                    >
                        <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight mb-6 bg-clip-text text-transparent bg-gradient-to-r from-amber-700 via-orange-700 to-emerald-700 dark:from-amber-300 dark:via-orange-300 dark:to-emerald-300">
                            You Are Not Alone. <br /> We Are Here To Help.
                        </h1>
                        <p className="text-xl text-muted-foreground max-w-2xl mx-auto mb-8">
                            A safe, secure, and anonymous platform to report digital violence, find professional support, and connect with a caring community.
                        </p>
                        <div className="flex flex-col sm:flex-row gap-4 justify-center">
                            <Button size="lg" className="text-lg px-8 h-14" asChild>
                                <Link to="/report">Report Incident <ArrowRight className="ml-2" /></Link>
                            </Button>
                            <Button size="lg" variant="outline" className="text-lg px-8 h-14" asChild>
                                <Link to="/counselors">Find Help Nearby</Link>
                            </Button>
                        </div>
                    </motion.div>
                </div>

                {/* Background Decorative Elements */}
                <div className="absolute top-0 left-0 w-full h-full overflow-hidden -z-10 opacity-30">
                    <div className="absolute top-10 left-10 w-72 h-72 bg-amber-300 rounded-full mix-blend-multiply filter blur-3xl animate-blob"></div>
                    <div className="absolute top-10 right-10 w-72 h-72 bg-emerald-300 rounded-full mix-blend-multiply filter blur-3xl animate-blob animation-delay-2000"></div>
                    <div className="absolute -bottom-8 left-20 w-72 h-72 bg-rose-300 rounded-full mix-blend-multiply filter blur-3xl animate-blob animation-delay-4000"></div>
                </div>
            </section>

            {/* Dashboard Overview (Visible when logged in) */}
            {isAuthenticated && (
                <section className="py-12 bg-muted/30">
                    <div className="container">
                        <div className="flex items-center justify-between mb-8">
                            <div>
                                <h2 className="text-2xl font-bold">Welcome back, Jane</h2>
                                <p className="text-muted-foreground">Here's what's happening with your account.</p>
                            </div>
                            <Button variant="outline" size="sm">
                                <Bell className="mr-2 h-4 w-4" /> Notifications
                            </Button>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            <Card className="bg-background border-primary/20 shadow-sm hover:shadow-md transition-shadow">
                                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                    <CardTitle className="text-sm font-medium">Active Reports</CardTitle>
                                    <FileText className="h-4 w-4 text-primary" />
                                </CardHeader>
                                <CardContent>
                                    <div className="text-2xl font-bold">1</div>
                                    <p className="text-xs text-muted-foreground mt-1">
                                        <span className="text-yellow-600 font-medium">In Progress</span> • Updated 2h ago
                                    </p>
                                    <Button variant="link" className="px-0 h-auto mt-2 text-xs" asChild>
                                        <Link to="/settings">View Details</Link>
                                    </Button>
                                </CardContent>
                            </Card>
                            <Card className="bg-background border-primary/20 shadow-sm hover:shadow-md transition-shadow">
                                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                    <CardTitle className="text-sm font-medium">Upcoming Sessions</CardTitle>
                                    <Calendar className="h-4 w-4 text-primary" />
                                </CardHeader>
                                <CardContent>
                                    <div className="text-2xl font-bold">2</div>
                                    <p className="text-xs text-muted-foreground mt-1">
                                        Next: Tomorrow, 2:00 PM
                                    </p>
                                    <Button variant="link" className="px-0 h-auto mt-2 text-xs" asChild>
                                        <Link to="/counselors">Manage Appointments</Link>
                                    </Button>
                                </CardContent>
                            </Card>
                            <Card className="bg-background border-primary/20 shadow-sm hover:shadow-md transition-shadow">
                                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                    <CardTitle className="text-sm font-medium">Community Updates</CardTitle>
                                    <Heart className="h-4 w-4 text-primary" />
                                </CardHeader>
                                <CardContent>
                                    <div className="text-2xl font-bold">5</div>
                                    <p className="text-xs text-muted-foreground mt-1">
                                        New replies to your posts
                                    </p>
                                    <Button variant="link" className="px-0 h-auto mt-2 text-xs" asChild>
                                        <Link to="/community">Go to Forum</Link>
                                    </Button>
                                </CardContent>
                            </Card>
                        </div>
                    </div>
                </section>
            )}

            {/* Features Section */}
            <section className="py-20 bg-muted/50">
                <div className="container">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl font-bold mb-4">How We Help</h2>
                        <p className="text-muted-foreground max-w-2xl mx-auto">
                            Our platform provides comprehensive tools and resources to support victims of digital violence.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        <Card className="border-none shadow-lg hover:shadow-xl transition-all duration-300">
                            <CardHeader>
                                <div className="h-12 w-12 rounded-lg bg-amber-100 dark:bg-amber-900/30 flex items-center justify-center mb-4 text-amber-700 dark:text-amber-300">
                                    <Shield className="h-6 w-6" />
                                </div>
                                <CardTitle>Secure Reporting</CardTitle>
                                <CardDescription>
                                    Document incidents safely with our encrypted reporting tool. You can choose to remain anonymous.
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                                <ul className="text-sm space-y-2 text-muted-foreground">
                                    <li>• End-to-end encryption</li>
                                    <li>• Anonymous submission option</li>
                                    <li>• Evidence storage vault</li>
                                </ul>
                            </CardContent>
                        </Card>

                        <Card className="border-none shadow-lg hover:shadow-xl transition-all duration-300">
                            <CardHeader>
                                <div className="h-12 w-12 rounded-lg bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center mb-4 text-emerald-700 dark:text-emerald-300">
                                    <Lock className="h-6 w-6" />
                                </div>
                                <CardTitle>Professional Support</CardTitle>
                                <CardDescription>
                                    Connect with verified counselors, legal experts, and support organizations in your area.
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                                <ul className="text-sm space-y-2 text-muted-foreground">
                                    <li>• Verified professionals</li>
                                    <li>• Location-based search</li>
                                    <li>• Free initial consultation</li>
                                </ul>
                            </CardContent>
                        </Card>

                        <Card className="border-none shadow-lg hover:shadow-xl transition-all duration-300">
                            <CardHeader>
                                <div className="h-12 w-12 rounded-lg bg-rose-100 dark:bg-rose-900/30 flex items-center justify-center mb-4 text-rose-700 dark:text-rose-300">
                                    <Heart className="h-6 w-6" />
                                </div>
                                <CardTitle>Community Care</CardTitle>
                                <CardDescription>
                                    Join a supportive community of survivors. Share your story and find strength in unity.
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                                <ul className="text-sm space-y-2 text-muted-foreground">
                                    <li>• Moderated forums</li>
                                    <li>• Peer support groups</li>
                                    <li>• Resource sharing</li>
                                </ul>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </section>

            {/* Privacy Section */}
            <section className="py-20">
                <div className="container">
                    <div className="bg-primary/5 rounded-3xl p-8 md:p-12 flex flex-col md:flex-row items-center gap-12">
                        <div className="flex-1 space-y-6">
                            <h2 className="text-3xl font-bold">Your Privacy is Our Priority</h2>
                            <p className="text-lg text-muted-foreground">
                                We understand the sensitivity of digital violence. Our platform is built with privacy-first architecture to ensure your data and identity remain protected at all times.
                            </p>
                            <div className="space-y-4">
                                <div className="flex items-center gap-4">
                                    <div className="h-10 w-10 rounded-full bg-background flex items-center justify-center shadow-sm">
                                        <Shield className="h-5 w-5 text-primary" />
                                    </div>
                                    <span className="font-medium">No tracking or data selling</span>
                                </div>
                                <div className="flex items-center gap-4">
                                    <div className="h-10 w-10 rounded-full bg-background flex items-center justify-center shadow-sm">
                                        <Lock className="h-5 w-5 text-primary" />
                                    </div>
                                    <span className="font-medium">Military-grade encryption</span>
                                </div>
                            </div>
                        </div>
                        <div className="flex-1 w-full max-w-md">
                            <div className="bg-background rounded-xl shadow-2xl p-6 border">
                                <div className="flex items-center gap-4 mb-6 border-b pb-4">
                                    <div className="h-3 w-3 rounded-full bg-red-500"></div>
                                    <div className="h-3 w-3 rounded-full bg-yellow-500"></div>
                                    <div className="h-3 w-3 rounded-full bg-green-500"></div>
                                    <div className="ml-auto text-xs text-muted-foreground">Secure Connection</div>
                                </div>
                                <div className="space-y-4">
                                    <div className="h-4 bg-muted rounded w-3/4"></div>
                                    <div className="h-4 bg-muted rounded w-1/2"></div>
                                    <div className="h-32 bg-muted/50 rounded-lg border-2 border-dashed border-muted-foreground/20 flex items-center justify-center">
                                        <Lock className="h-8 w-8 text-muted-foreground/40" />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="py-20 bg-primary text-primary-foreground">
                <div className="container text-center">
                    <h2 className="text-3xl md:text-4xl font-bold mb-6">Ready to take the first step?</h2>
                    <p className="text-primary-foreground/80 text-lg max-w-2xl mx-auto mb-10">
                        Whether you need to report an incident, find a counselor, or just talk to someone who understands, we are here for you.
                    </p>
                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        <Button size="lg" variant="secondary" className="text-lg px-8 h-14" asChild>
                            <Link to="/report">Start a Report</Link>
                        </Button>
                        <Button size="lg" variant="outline" className="text-lg px-8 h-14 bg-transparent border-primary-foreground text-primary-foreground hover:bg-primary-foreground hover:text-primary" asChild>
                            <Link to="/community">Join Community</Link>
                        </Button>
                    </div>
                </div>
            </section>
        </div>
    );
}
