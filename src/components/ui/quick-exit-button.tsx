import { Button } from '@/components/ui/button';
import { XCircle } from 'lucide-react';

export function QuickExitButton() {
    const handleQuickExit = () => {
        // Replace current history entry to prevent back button navigation
        window.location.replace('https://www.google.com');
    };

    return (
        <div className="fixed bottom-4 right-4 z-50">
            <Button
                variant="destructive"
                size="lg"
                className="shadow-2xl border-4 border-white dark:border-slate-900 animate-pulse font-bold text-lg h-16 px-6 rounded-full"
                onClick={handleQuickExit}
            >
                <XCircle className="mr-2 h-5 w-5" />
                Quick Exit
            </Button>
        </div>
    );
}
