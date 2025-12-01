import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { LogOut, CheckCircle2 } from 'lucide-react';

export default function Logout() {
    const { logout } = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
        const performLogout = async () => {
            try {
                await logout();
            } catch (error) {
                console.error('Logout failed:', error);
            }
        };

        performLogout();
    }, [logout]);

    return (
        <div className="container flex items-center justify-center min-h-[80vh] px-4">
            <Card className="w-full max-w-md shadow-lg border-primary/10">
                <CardHeader className="text-center pb-2">
                    <div className="mx-auto bg-primary/10 p-3 rounded-full w-fit mb-4">
                        <LogOut className="h-8 w-8 text-primary" />
                    </div>
                    <CardTitle className="text-2xl font-bold text-primary">Logged Out</CardTitle>
                    <CardDescription>
                        You have been successfully signed out of your account.
                    </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4 pt-4">
                    <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-4 flex items-center gap-3 text-green-700 dark:text-green-400">
                        <CheckCircle2 className="h-5 w-5 flex-shrink-0" />
                        <p className="text-sm font-medium">Session ended securely.</p>
                    </div>

                    <div className="grid gap-3">
                        <Button
                            className="w-full"
                            onClick={() => navigate('/login')}
                        >
                            Sign In Again
                        </Button>
                        <Button
                            variant="outline"
                            className="w-full"
                            onClick={() => navigate('/home')}
                        >
                            Return to Home
                        </Button>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
