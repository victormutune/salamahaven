import { useLocation } from 'react-router-dom';
import { Navbar } from './Navbar';
import { Footer } from './Footer';
import { QuickExitButton } from '@/components/ui/quick-exit-button';
import { AccessibilityWidget } from '@/components/ui/accessibility-widget';

interface LayoutProps {
    children: React.ReactNode;
}

export function Layout({ children }: LayoutProps) {
    const location = useLocation();
    const hideLayout = ['/login', '/register', '/anonymous-report'].includes(location.pathname);

    return (
        <div className="flex min-h-screen flex-col">
            {!hideLayout && <Navbar />}
            <main className="flex-1">
                {children}
            </main>
            {!hideLayout && <Footer />}
            <QuickExitButton />
            <AccessibilityWidget />
        </div>
    );
}
