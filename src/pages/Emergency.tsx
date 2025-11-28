import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Phone, MapPin, Shield, AlertOctagon, X } from 'lucide-react';
import { motion } from 'framer-motion';

export default function Emergency() {
    return (
        <div className="container py-10 max-w-6xl">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
                {/* Emergency Action Section */}
                <div className="space-y-6">
                    <div className="bg-destructive/10 border-destructive/20 border p-6 rounded-xl">
                        <h1 className="text-3xl font-bold text-destructive flex items-center gap-3 mb-4">
                            <AlertOctagon className="h-10 w-10" />
                            Immediate Assistance
                        </h1>
                        <p className="text-lg mb-6">
                            If you are in immediate danger, please contact local authorities or emergency services right now.
                        </p>

                        <motion.div
                            animate={{ scale: [1, 1.05, 1] }}
                            transition={{ repeat: Infinity, duration: 2 }}
                        >
                            <Button size="lg" variant="destructive" className="w-full h-20 text-2xl font-bold shadow-xl">
                                <Phone className="mr-3 h-8 w-8" /> Call Emergency (911)
                            </Button>
                        </motion.div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <Card>
                            <CardHeader className="pb-2">
                                <CardTitle className="text-lg flex items-center gap-2">
                                    <Shield className="h-5 w-5 text-blue-600" />
                                    Cyber Helpline
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <p className="text-sm text-muted-foreground mb-3">24/7 support for digital violence victims.</p>
                                <Button variant="outline" className="w-full">Call 1-800-CYBER</Button>
                            </CardContent>
                        </Card>
                        <Card>
                            <CardHeader className="pb-2">
                                <CardTitle className="text-lg flex items-center gap-2">
                                    <MapPin className="h-5 w-5 text-green-600" />
                                    Safe Centers
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <p className="text-sm text-muted-foreground mb-3">Find the nearest physical safe space.</p>
                                <Button variant="outline" className="w-full">View Map</Button>
                            </CardContent>
                        </Card>
                    </div>
                </div>

                {/* Map Placeholder */}
                <div className="h-[400px] lg:h-auto bg-muted rounded-xl relative overflow-hidden flex items-center justify-center border">
                    <div className="absolute inset-0 bg-slate-200 dark:bg-slate-800">
                        {/* Mock Map UI */}
                        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                            <div className="flex flex-col items-center">
                                <div className="h-16 w-16 bg-blue-500/20 rounded-full flex items-center justify-center animate-pulse">
                                    <div className="h-4 w-4 bg-blue-600 rounded-full border-2 border-white"></div>
                                </div>
                                <span className="bg-background px-2 py-1 rounded shadow text-xs font-medium mt-2">You are here</span>
                            </div>
                        </div>
                        {/* Random markers */}
                        <div className="absolute top-1/4 left-1/4">
                            <MapPin className="h-8 w-8 text-red-500 drop-shadow-md" />
                        </div>
                        <div className="absolute bottom-1/3 right-1/4">
                            <MapPin className="h-8 w-8 text-red-500 drop-shadow-md" />
                        </div>
                    </div>
                    <div className="absolute bottom-4 left-4 right-4 bg-background/90 backdrop-blur p-4 rounded-lg shadow-lg">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="font-semibold">Nearest Safe Center</p>
                                <p className="text-sm text-muted-foreground">1.2 km away • Open 24/7</p>
                            </div>
                            <Button size="sm">Directions</Button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Quick Safety Tips */}
            <div className="space-y-6">
                <h2 className="text-2xl font-bold">Quick Safety Tips</h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <Card className="bg-orange-50 dark:bg-orange-950/20 border-orange-200 dark:border-orange-900">
                        <CardHeader>
                            <CardTitle className="text-lg text-orange-700 dark:text-orange-400">Secure Your Accounts</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <p className="text-sm text-muted-foreground">
                                Change passwords immediately. Enable Two-Factor Authentication (2FA) on all sensitive accounts.
                            </p>
                        </CardContent>
                    </Card>
                    <Card className="bg-blue-50 dark:bg-blue-950/20 border-blue-200 dark:border-blue-900">
                        <CardHeader>
                            <CardTitle className="text-lg text-blue-700 dark:text-blue-400">Document Everything</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <p className="text-sm text-muted-foreground">
                                Take screenshots, save URLs, and keep a log of all incidents including dates and times.
                            </p>
                        </CardContent>
                    </Card>
                    <Card className="bg-purple-50 dark:bg-purple-950/20 border-purple-200 dark:border-purple-900">
                        <CardHeader>
                            <CardTitle className="text-lg text-purple-700 dark:text-purple-400">Block & Report</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <p className="text-sm text-muted-foreground">
                                Use platform tools to block the harasser and report their content directly to the platform.
                            </p>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
}
