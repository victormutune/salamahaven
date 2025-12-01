import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Shield, Smartphone, Globe, Lock } from "lucide-react";

export default function SafetyTips() {
    return (
        <div className="container py-10 max-w-4xl">
            <h1 className="text-3xl font-extrabold mb-6 text-center bg-clip-text text-transparent bg-gradient-to-r from-amber-700 via-orange-700 to-emerald-700 dark:from-amber-300 dark:via-orange-300 dark:to-emerald-300">Safety Tips</h1>
            <p className="text-center text-muted-foreground mb-8">
                Important information to keep yourself safe online and offline.
            </p>

            <div className="grid gap-6 md:grid-cols-2">
                <Card>
                    <CardHeader className="flex flex-row items-center gap-4">
                        <div className="p-2 bg-primary/10 rounded-full">
                            <Globe className="h-6 w-6 text-primary" />
                        </div>
                        <CardTitle>Online Safety</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <ul className="list-disc pl-5 space-y-2 text-muted-foreground">
                            <li>Use strong, unique passwords for your accounts.</li>
                            <li>Enable two-factor authentication whenever possible.</li>
                            <li>Be cautious about sharing personal location information on social media.</li>
                            <li>Regularly review your privacy settings.</li>
                        </ul>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center gap-4">
                        <div className="p-2 bg-primary/10 rounded-full">
                            <Smartphone className="h-6 w-6 text-primary" />
                        </div>
                        <CardTitle>Device Security</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <ul className="list-disc pl-5 space-y-2 text-muted-foreground">
                            <li>Keep your phone and computer software updated.</li>
                            <li>Use a passcode or biometric lock on your devices.</li>
                            <li>Avoid using public Wi-Fi for sensitive transactions.</li>
                            <li>Install reputable antivirus software.</li>
                        </ul>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center gap-4">
                        <div className="p-2 bg-primary/10 rounded-full">
                            <Shield className="h-6 w-6 text-primary" />
                        </div>
                        <CardTitle>Personal Safety Planning</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <ul className="list-disc pl-5 space-y-2 text-muted-foreground">
                            <li>Identify safe friends or family members you can trust.</li>
                            <li>Memorize important emergency numbers.</li>
                            <li>Keep a "go bag" with essentials if you need to leave quickly.</li>
                            <li>Trust your instincts—if you feel unsafe, leave the situation.</li>
                        </ul>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center gap-4">
                        <div className="p-2 bg-primary/10 rounded-full">
                            <Lock className="h-6 w-6 text-primary" />
                        </div>
                        <CardTitle>Browsing Privacy</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <ul className="list-disc pl-5 space-y-2 text-muted-foreground">
                            <li>Use "Incognito" or "Private" mode when browsing sensitive information.</li>
                            <li>Clear your browser history and cache regularly.</li>
                            <li>Be aware that some monitoring software can track incognito browsing.</li>
                            <li>Use a safe device (e.g., a library computer) if you suspect yours is monitored.</li>
                        </ul>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
