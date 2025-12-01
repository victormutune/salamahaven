import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useNavigate } from 'react-router-dom';
import { ShieldAlert, Lock, Mail } from 'lucide-react';
import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { ModeToggle } from '@/components/ui/mode-toggle';

export default function AdminLogin() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);
    const { login } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);
        setLoading(true);

        const { error } = await login(email, password);

        if (error) {
            setError(error.message);
            setLoading(false);
        } else {
            // The AdminRoute will handle the redirect if they are not an admin
            // But we can also check here to give immediate feedback if we wanted to
            // For now, let's just navigate to admin and let the route handle it
            navigate('/admin');
        }
    };

    return (
        <div className="container relative flex items-center justify-center min-h-screen py-10 px-4">
            <div className="absolute top-4 right-4">
                <ModeToggle />
            </div>

            <Card className="w-full max-w-md border-red-100 dark:border-red-900/20 shadow-2xl">
                <CardHeader className="space-y-1 text-center">
                    <div className="flex justify-center mb-4">
                        <div className="h-16 w-16 rounded-full bg-red-100 dark:bg-red-900/20 flex items-center justify-center">
                            <ShieldAlert className="h-8 w-8 text-red-600 dark:text-red-500" />
                        </div>
                    </div>
                    <CardTitle className="text-2xl font-bold text-red-900 dark:text-red-100">Admin Portal</CardTitle>
                    <CardDescription>
                        Restricted access. Authorized personnel only.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleSubmit} className="space-y-4">
                        {error && (
                            <div className="p-3 text-sm text-red-500 bg-red-50 dark:bg-red-950/20 border border-red-200 dark:border-red-900 rounded-md">
                                {error}
                            </div>
                        )}
                        <div className="space-y-2">
                            <Label htmlFor="email">Admin Email</Label>
                            <div className="relative">
                                <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                                <Input
                                    id="email"
                                    type="email"
                                    placeholder="admin@salamahaven.org"
                                    className="pl-9"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    required
                                />
                            </div>
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="password">Password</Label>
                            <div className="relative">
                                <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                                <Input
                                    id="password"
                                    type="password"
                                    className="pl-9"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    required
                                />
                            </div>
                        </div>
                        <Button type="submit" className="w-full bg-red-600 hover:bg-red-700 text-white" disabled={loading}>
                            {loading ? 'Authenticating...' : 'Access Dashboard'}
                        </Button>
                    </form>
                </CardContent>
            </Card>
        </div>
    );
}
