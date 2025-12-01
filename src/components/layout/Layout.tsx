import { useLocation, Outlet } from 'react-router-dom';
import { Navbar } from './Navbar';
import { Footer } from './Footer';
import { QuickExitButton } from '@/components/ui/quick-exit-button';
import { AccessibilityWidget } from '@/components/ui/accessibility-widget';

export function Layout() {
    const location = useLocation();
    const hideLayout = ['/login', '/register', '/anonymous-report', '/admin'].includes(location.pathname) || location.pathname.startsWith('/admin');

    return (
        <div className="flex min-h-screen flex-col">
            {!hideLayout && <Navbar />}
            <main className="flex-1">
                <Outlet />
            </main>
            {!hideLayout && <Footer />}
            {!hideLayout && <QuickExitButton />}
            {!hideLayout && <AccessibilityWidget />}
        </div>
    );
}
