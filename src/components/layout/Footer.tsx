import { Shield } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';

export function Footer() {
    return (
        <footer className="border-t bg-muted/40">
            <div className="container py-10 md:py-16 px-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                    <div className="space-y-4">
                        <div className="flex items-center space-x-2">
                            <Shield className="h-6 w-6 text-primary" />
                            <span className="font-bold text-lg">SalamaHaven</span>
                        </div>
                        <p className="text-sm text-muted-foreground">
                            A safe, secure, and supportive platform for reporting digital violence and finding help.
                        </p>
                    </div>

                    <div>
                        <h3 className="font-semibold mb-4">Platform</h3>
                        <ul className="space-y-2 text-sm text-muted-foreground">
                            <li><Link to="/report" className="hover:text-primary">Report Incident</Link></li>
                            <li><Link to="/counselors" className="hover:text-primary">Find Counselors</Link></li>
                            <li><Link to="/community" className="hover:text-primary">Community Forum</Link></li>
                            <li><Link to="/emergency" className="hover:text-primary">Emergency Help</Link></li>
                        </ul>
                    </div>

                    <div>
                        <h3 className="font-semibold mb-4">Support</h3>
                        <ul className="space-y-2 text-sm text-muted-foreground">
                            <li><Link to="/help" className="hover:text-primary">Help Center</Link></li>
                            <li><Link to="/safety-tips" className="hover:text-primary">Safety Tips</Link></li>
                            <li><Link to="/privacy" className="hover:text-primary">Privacy Policy</Link></li>
                            <li><Link to="/terms" className="hover:text-primary">Terms of Service</Link></li>
                        </ul>
                    </div>

                    <div>
                        <h3 className="font-semibold mb-4">Emergency</h3>
                        <p className="text-sm text-muted-foreground mb-4">
                            If you are in immediate danger, please call your local emergency number immediately.
                        </p>
                        <Button variant="destructive" className="w-full" asChild>
                            <Link to="/emergency">Get Help Now</Link>
                        </Button>
                    </div>
                </div>
                <div className="mt-10 pt-6 border-t text-center text-sm text-muted-foreground px-4">
                    © {new Date().getFullYear()} SafeHaven. All rights reserved.
                </div>
            </div>
        </footer>
    );
}
