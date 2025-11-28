
import { Link, NavLink, useLocation } from 'react-router-dom';
import { Shield, Menu, X, Settings, Bell, PhoneCall } from 'lucide-react';
import { useMemo, useState } from 'react';
import { cn } from '@/lib/utils';
import { ThemeToggle } from '@/components/ui/theme-toggle';

export function Navbar() {
    const [isOpen, setIsOpen] = useState(false);
    const location = useLocation();

    const navLinks = useMemo(
        () => [
            { name: 'Home', path: '/home' },
            { name: 'Report', path: '/report' },
            { name: 'Counselors', path: '/counselors' },
            { name: 'Community', path: '/community' },
            { name: 'Emergency', path: '/emergency', className: 'text-red-600 dark:text-red-400 font-bold' },
        ],
        []
    );

    const isActive = (path: string) => location.pathname.startsWith(path);

    return (
        <>
            <nav className="sticky top-0 z-50 border-b bg-gradient-to-r from-amber-50 via-orange-50 to-emerald-50 dark:from-slate-900 dark:via-slate-950 dark:to-slate-900 backdrop-blur-md supports-[backdrop-filter]:bg-background/60 shadow-sm">
                <div className="container mx-auto px-4">
                    {/* Top bar with helpline */}
                    <div className="hidden md:flex items-center justify-between text-xs py-2 text-muted-foreground border-b border-amber-200/50 dark:border-slate-800">
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
                                SafeHaven
                            </span>
                        </Link>

                        {/* Desktop Nav - Centered */}
                        <div className="hidden md:flex items-center space-x-8 absolute left-1/2 transform -translate-x-1/2">
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
                        <div className="hidden md:flex items-center space-x-2 z-10">
                            <ThemeToggle />
                            <Link
                                to="/notifications"
                                className="relative p-2 hover:bg-muted rounded-full transition-colors"
                                title="Notifications"
                            >
                                <Bell className="h-5 w-5" />
                                <span className="absolute top-1 right-1 h-2 w-2 bg-red-500 rounded-full animate-pulse"></span>
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
                                className="ml-2 inline-flex items-center rounded-full bg-gradient-to-r from-amber-500 via-orange-500 to-emerald-500 px-5 py-2.5 text-sm font-semibold text-white shadow-md hover:shadow-lg hover:scale-105 transition-all duration-200"
                            >
                                Get Support
                            </Link>
                        </div>

                        {/* Mobile Menu Toggle */}
                        <button
                            className="md:hidden p-2 z-10 hover:bg-muted rounded-lg transition-colors"
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
                        className="md:hidden fixed inset-0 bg-black/50 backdrop-blur-sm z-40"
                        onClick={() => setIsOpen(false)}
                        aria-hidden="true"
                    />

                    {/* Mobile menu */}
                    <div className="md:hidden fixed top-[4.5rem] left-0 right-0 border-b p-6 space-y-4 bg-background/95 backdrop-blur-md shadow-2xl z-50 animate-in slide-in-from-top duration-300">
                        {navLinks.map((link) => (
                            <Link
                                key={link.path}
                                to={link.path}
                                className={cn(
                                    'block text-base font-semibold py-2 px-3 rounded-lg transition-all duration-200',
                                    isActive(link.path) 
                                        ? 'text-primary bg-gradient-to-r from-amber-100 via-orange-100 to-emerald-100 dark:from-slate-800 dark:via-slate-800 dark:to-slate-700' 
                                        : 'text-foreground/80 hover:text-primary hover:bg-muted',
                                    link.className
                                )}
                                onClick={() => setIsOpen(false)}
                            >
                                {link.name}
                            </Link>
                        ))}
                        
                        <Link
                            to="/report"
                            className="flex w-full items-center justify-center rounded-full bg-gradient-to-r from-amber-500 via-orange-500 to-emerald-500 px-6 py-3.5 text-base font-semibold text-white shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-200"
                            onClick={() => setIsOpen(false)}
                        >
                            Get Support Now
                        </Link>
                        
                        <div className="flex items-center justify-between rounded-lg border border-border bg-muted/30 p-4">
                            <span className="text-sm font-medium text-foreground">Theme</span>
                            <ThemeToggle />
                        </div>
                        
                        <div className="pt-4 border-t border-border flex items-center gap-6">
                            <Link
                                to="/notifications"
                                className="flex items-center gap-2 text-sm font-medium hover:text-primary transition-colors"
                                onClick={() => setIsOpen(false)}
                            >
                                <Bell className="h-5 w-5" />
                                Notifications
                                <span className="h-2 w-2 bg-red-500 rounded-full animate-pulse"></span>
                            </Link>
                            <Link
                                to="/settings"
                                className="flex items-center gap-2 text-sm font-medium hover:text-primary transition-colors"
                                onClick={() => setIsOpen(false)}
                            >
                                <Settings className="h-5 w-5" />
                                Settings
                            </Link>
                        </div>

                        {/* Mobile helpline info */}
                        <div className="pt-4 border-t border-border">
                            <div className="flex items-center gap-2 text-xs text-muted-foreground bg-emerald-50 dark:bg-emerald-950/30 p-3 rounded-lg">
                                <PhoneCall className="h-4 w-4 text-emerald-600 dark:text-emerald-400 flex-shrink-0" />
                                <span>24/7 Helpline: <span className="font-semibold text-emerald-700 dark:text-emerald-400">1195</span> (Free & Confidential)</span>
                            </div>
                        </div>
                    </div>
                </>
            )}
        </>
    );
}