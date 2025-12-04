import { Link, NavLink, useLocation } from 'react-router-dom';
import { Shield, Menu, X, Settings, Bell, PhoneCall, LogOut, Home, FileText, Users, Heart, BookOpen, AlertTriangle, Calendar } from 'lucide-react';
import { useMemo, useState } from 'react';
import { cn } from '@/lib/utils';
import { ThemeToggle } from '@/components/ui/theme-toggle';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/contexts/AuthContext';
import { useEffect } from 'react';


export function Navbar() {
    const [isOpen, setIsOpen] = useState(false);
    const location = useLocation();
    const { user } = useAuth();
    const [unreadCount, setUnreadCount] = useState(0);

    useEffect(() => {
        if (!user) return;

        const fetchUnreadCount = async () => {
            const { count, error } = await supabase
                .from('notifications')
                .select('*', { count: 'exact', head: true })
                .eq('user_id', user.id)
                .eq('read', false);

            if (!error) setUnreadCount(count || 0);
        };

        fetchUnreadCount();

        // Subscribe to changes
        const subscription = supabase
            .channel('navbar_notifications')
            .on('postgres_changes', {
                event: '*',
                schema: 'public',
                table: 'notifications',
                filter: `user_id=eq.${user.id}`
            }, () => {
                fetchUnreadCount();
            })
            .subscribe();

        return () => {
            subscription.unsubscribe();
        };
    }, [user]);

    const navLinks = useMemo(
        () => [
            { name: 'Home', path: '/', icon: Home },
            { name: 'Report', path: '/report', icon: FileText },
            { name: 'Counselors', path: '/counselors', icon: Users },
            { name: 'Bookings', path: '/bookings', icon: Calendar },
            { name: 'Community', path: '/community', icon: Heart },
            { name: 'Resources', path: '/resources', icon: BookOpen },
            { name: 'Emergency', path: '/emergency', icon: AlertTriangle, className: 'text-red-600 dark:text-red-400 font-bold' },
        ],
        []
    );

    const isActive = (path: string) => path === '/' ? location.pathname === '/' : location.pathname.startsWith(path);

    return (
        <>
            <nav className="sticky top-0 z-50 border-b bg-gradient-to-r from-amber-50 via-orange-50 to-emerald-50 dark:from-slate-900 dark:via-slate-950 dark:to-slate-900 backdrop-blur-md supports-[backdrop-filter]:bg-background/60 shadow-sm">
                <div className="container mx-auto">
                    {/* Top bar with helpline */}
                    <div className="hidden lg:flex items-center justify-between text-xs py-2 text-muted-foreground border-b border-amber-200/50 dark:border-slate-800">
                        <div className="flex items-center gap-2">
                            <PhoneCall className="h-3.5 w-3.5 text-emerald-600 dark:text-emerald-400" />
                            <span className="text-slate-600 dark:text-slate-400">24/7 GBV Helpline: <span className="font-semibold text-emerald-700 dark:text-emerald-400">1195 (Kenya)</span> • Confidential & Free</span>
                        </div>
                        <span className="font-medium text-amber-700 dark:text-amber-400">Ubuntu • Resilience • Care</span>
                    </div>

                    {/* Main navigation bar */}
                    <div className="relative flex h-16 items-center justify-between">
                        {/* Logo - Left */}
                        <Link to="/home" className="flex items-center space-x-2 z-10 group">
                            <div className="p-1.5 rounded-lg bg-gradient-to-br from-amber-500 via-orange-500 to-emerald-500 shadow-sm group-hover:shadow-md transition-all">
                                <Shield className="h-5 w-5 text-white" />
                            </div>
                            <span className="font-bold text-xl bg-gradient-to-r from-amber-600 via-orange-600 to-emerald-600 bg-clip-text text-transparent hidden sm:inline-block">
                                SalamaHaven
                            </span>
                        </Link>

                        {/* Desktop Nav - Centered */}
                        <div className="hidden lg:flex flex-1 items-center justify-center space-x-8 px-4">
                            {navLinks.map((link) => (
                                <NavLink
                                    key={link.path}
                                    to={link.path}
                                    aria-current={isActive(link.path) ? 'page' : undefined}
                                    className={({ isActive: navActive }) =>
                                        cn(
                                            'relative text-sm font-semibold tracking-wide transition-all duration-200',
                                            'after:absolute after:left-0 after:-bottom-1 after:h-0.5 after:w-0 after:rounded-full after:transition-all after:duration-300',
                                            navActive || isActive(link.path)
                                                ? 'text-primary after:w-full after:bg-gradient-to-r after:from-amber-500 after:via-orange-500 after:to-emerald-500'
                                                : 'text-foreground/70 hover:text-primary hover:after:w-full hover:after:bg-gradient-to-r hover:after:from-amber-500 hover:after:via-orange-500 hover:after:to-emerald-500',
                                            link.className
                                        )
                                    }
                                >
                                    {link.name}
                                </NavLink>
                            ))}
                        </div>

                        {/* Right side icons */}
                        <div className="hidden lg:flex items-center space-x-2 z-10">

                            <ThemeToggle />
                            <Link
                                to="/notifications"
                                className="relative p-2 hover:bg-muted rounded-full transition-colors"
                                title="Notifications"
                            >
                                <Bell className="h-5 w-5" />
                                {unreadCount > 0 && (
                                    <span className="absolute top-1 right-1 h-2 w-2 bg-red-500 rounded-full animate-pulse"></span>
                                )}
                            </Link>
                            <Link
                                to="/settings"
                                className="p-2 hover:bg-muted rounded-full transition-colors"
                                title="Settings"
                            >
                                <Settings className="h-5 w-5" />
                            </Link>
                            <Link
                                to="/report"
                                className="ml-2 inline-flex items-center rounded-full bg-gradient-to-r from-amber-500 via-orange-600 to-emerald-600 px-6 py-2.5 text-sm font-bold text-white shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300 border border-white/20"
                            >
                                Get Support
                            </Link>
                            <Link
                                to="/logout"
                                className="p-2 hover:bg-muted rounded-full transition-colors text-red-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950/30"
                                title="Log Out"
                            >
                                <LogOut className="h-5 w-5" />
                            </Link>
                        </div>

                        {/* Mobile Menu Toggle */}
                        <button
                            className="lg:hidden p-2 z-10 hover:bg-muted rounded-lg transition-colors"
                            onClick={() => setIsOpen(!isOpen)}
                            aria-label="Toggle menu"
                        >
                            {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
                        </button>
                    </div>
                </div>
            </nav>

            {/* Mobile Nav with Dark Backdrop */}
            {isOpen && (
                <>
                    {/* Dark backdrop overlay */}
                    <div
                        className="lg:hidden fixed inset-0 bg-black/50 backdrop-blur-sm z-40"
                        onClick={() => setIsOpen(false)}
                        aria-hidden="true"
                    />

                    {/* Mobile menu */}
                    <div className="lg:hidden fixed top-[4.5rem] left-0 right-0 border-b p-4 bg-background/95 backdrop-blur-md shadow-2xl z-50 animate-in slide-in-from-top duration-300">
                        {/* Main Links - Text based */}
                        <div className="space-y-1 mb-4">
                            {navLinks.map((link) => (
                                <Link
                                    key={link.path}
                                    to={link.path}
                                    className={cn(
                                        'flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200',
                                        isActive(link.path)
                                            ? 'bg-primary/10 text-primary font-semibold'
                                            : 'hover:bg-muted text-foreground/80 hover:text-foreground',
                                        link.className
                                    )}
                                    onClick={() => setIsOpen(false)}
                                >
                                    <link.icon className={cn("h-5 w-5", isActive(link.path) ? "text-primary" : "text-muted-foreground")} />
                                    <span>{link.name}</span>
                                </Link>
                            ))}
                        </div>

                        {/* Utility Bar - Icons only */}
                        <div className="flex items-center justify-between gap-2 pt-4 border-t border-border/50 px-2">
                            <div className="flex items-center gap-1">
                                <div className="p-1">

                                </div>
                                <div className="p-1">
                                    <ThemeToggle />
                                </div>
                                <Link
                                    to="/notifications"
                                    className="p-2.5 hover:bg-muted rounded-full text-muted-foreground hover:text-primary transition-colors relative"
                                    onClick={() => setIsOpen(false)}
                                    title="Notifications"
                                >
                                    <Bell className="h-5 w-5" />
                                    {unreadCount > 0 && (
                                        <span className="absolute top-2 right-2 h-2 w-2 bg-red-500 rounded-full animate-pulse"></span>
                                    )}
                                </Link>
                                <Link
                                    to="/settings"
                                    className="p-2.5 hover:bg-muted rounded-full text-muted-foreground hover:text-primary transition-colors"
                                    onClick={() => setIsOpen(false)}
                                    title="Settings"
                                >
                                    <Settings className="h-5 w-5" />
                                </Link>
                            </div>

                            <Link
                                to="/logout"
                                className="p-2.5 hover:bg-red-50 dark:hover:bg-red-950/30 rounded-full text-red-500 hover:text-red-600 transition-colors"
                                onClick={() => setIsOpen(false)}
                                title="Log Out"
                            >
                                <LogOut className="h-5 w-5" />
                            </Link>
                        </div>

                        {/* Mobile helpline info */}
                        <div className="mt-4 pt-3 border-t border-border/50 text-center">
                            <div className="inline-flex items-center gap-1.5 text-[10px] text-muted-foreground bg-emerald-50 dark:bg-emerald-950/30 px-3 py-1.5 rounded-full">
                                <PhoneCall className="h-3 w-3 text-emerald-600 dark:text-emerald-400" />
                                <span>Helpline: <span className="font-bold text-emerald-700 dark:text-emerald-400">1195</span></span>
                            </div>
                        </div>
                    </div>
                </>
            )}
        </>
    );
}