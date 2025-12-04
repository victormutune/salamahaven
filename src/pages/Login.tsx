import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Link, useNavigate } from 'react-router-dom';
import { Shield, Lock, Mail, CheckCircle } from 'lucide-react';
import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useTranslation } from 'react-i18next';
import { LanguageSwitcher } from '@/components/ui/language-switcher';
import { ModeToggle } from '@/components/ui/mode-toggle';

export default function Login() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);
    const { login } = useAuth();
    const navigate = useNavigate();
    const { t } = useTranslation();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);
        setLoading(true);

        const { error } = await login(email, password);

        if (error) {
            setError(error.message);
            setLoading(false);
        } else {
            navigate('/');
        }
    };

    return (
        <div className="container relative flex items-center justify-center min-h-screen py-6 md:py-10 px-4 sm:px-6">
            <div className="absolute top-1 right-1 sm:top-4 sm:right-4 flex gap-2">
                <LanguageSwitcher />
                <ModeToggle />
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 md:gap-12 max-w-6xl w-full">
                {/* Safety Message Section */}
                <div className="flex flex-col justify-center space-y-4 md:space-y-6 p-6 md:p-8 bg-gradient-to-br from-primary/5 to-purple-50 dark:from-primary/10 dark:to-purple-950/20 rounded-xl md:rounded-2xl">
                    <div className="flex items-center gap-3 mb-4">
                        <div className="h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center">
                            <Shield className="h-8 w-8 text-primary" />
                        </div>
                        <div>
                            <h2 className="text-2xl font-bold">{t('safe_here')}</h2>
                            <p className="text-sm text-muted-foreground">{t('trust_priority')}</p>
                        </div>
                    </div>

                    <div className="space-y-4">
                        <div className="flex items-start gap-3 p-4 bg-background/60 backdrop-blur rounded-lg border border-primary/10">
                            <CheckCircle className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
                            <div>
                                <h3 className="font-semibold text-sm mb-1">{t('encryption')}</h3>
                                <p className="text-xs text-muted-foreground">
                                    {t('encryption_desc')}
                                </p>
                            </div>
                        </div>

                        <div className="flex items-start gap-3 p-4 bg-background/60 backdrop-blur rounded-lg border border-primary/10">
                            <CheckCircle className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
                            <div>
                                <h3 className="font-semibold text-sm mb-1">{t('anonymity')}</h3>
                                <p className="text-xs text-muted-foreground">
                                    {t('anonymity_desc')}
                                </p>
                            </div>
                        </div>

                        <div className="flex items-start gap-3 p-4 bg-background/60 backdrop-blur rounded-lg border border-primary/10">
                            <CheckCircle className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
                            <div>
                                <h3 className="font-semibold text-sm mb-1">{t('no_data_selling')}</h3>
                                <p className="text-xs text-muted-foreground">
                                    {t('no_data_selling_desc')}
                                </p>
                            </div>
                        </div>

                        <div className="flex items-start gap-3 p-4 bg-background/60 backdrop-blur rounded-lg border border-primary/10">
                            <CheckCircle className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
                            <div>
                                <h3 className="font-semibold text-sm mb-1">{t('verified_pros')}</h3>
                                <p className="text-xs text-muted-foreground">
                                    {t('verified_pros_desc')}
                                </p>
                            </div>
                        </div>
                    </div>

                    <div className="pt-4 border-t border-primary/10">
                        <p className="text-xs text-muted-foreground italic">
                            "{t('testimonial')}" - Anonymous Survivor
                        </p>
                    </div>
                </div>

                {/* Login Form Section */}
                <div className="flex items-center justify-center">
                    <Card className="w-full max-w-md border-none shadow-2xl">
                        <CardHeader className="space-y-1">
                            <div className="flex justify-center mb-4">
                                <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
                                    <Shield className="h-6 w-6 text-primary" />
                                </div>
                            </div>
                            <CardTitle className="text-2xl font-bold text-center">{t('welcome_back')}</CardTitle>
                            <CardDescription className="text-center">
                                {t('enter_credentials')}
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
                                    <Label htmlFor="email">{t('email')}</Label>
                                    <div className="relative">
                                        <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                                        <Input
                                            id="email"
                                            type="email"
                                            placeholder="name@example.com"
                                            className="pl-9"
                                            value={email}
                                            onChange={(e) => setEmail(e.target.value)}
                                            required
                                        />
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <div className="flex items-center justify-between">
                                        <Label htmlFor="password">{t('password')}</Label>
                                        <Link
                                            to="/forgot-password"
                                            className="text-sm font-medium text-primary hover:underline"
                                        >
                                            {t('forgot_password')}
                                        </Link>
                                    </div>
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
                                <div className="flex items-center space-x-2">
                                    <input
                                        type="checkbox"
                                        id="remember"
                                        className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
                                    />
                                    <label
                                        htmlFor="remember"
                                        className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                                    >
                                        {t('remember_me')}
                                    </label>
                                </div>
                                <Button type="submit" className="w-full" disabled={loading}>
                                    {loading ? 'Signing in...' : t('sign_in')}
                                </Button>
                            </form>

                            <div className="mt-6 text-center space-y-4">
                                <div className="text-sm text-muted-foreground">
                                    {t('no_account')}{' '}
                                    <Link to="/register" className="text-primary font-medium hover:underline">
                                        {t('create_one')}
                                    </Link>
                                </div>
                                <div className="pt-4 border-t">
                                    <Link to="/anonymous-report" className="text-sm font-medium text-red-600 hover:text-red-700 hover:underline flex items-center justify-center gap-2">
                                        <Shield className="h-4 w-4" />
                                        Report Incident Anonymously
                                    </Link>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
}
