import { Button } from '@/components/ui/button';
import { XCircle } from 'lucide-react';

export function QuickExitButton() {
    const handleQuickExit = () => {
        // Replace current history entry to prevent back button navigation
        window.location.replace('https://www.google.com');
    };

    return (
        <div className="fixed bottom-6 right-4 z-50">
            <Button
                variant="destructive"
                size="lg"
                className="shadow-2xl border-4 border-white dark:border-slate-900 animate-pulse font-bold text-sm md:text-lg h-12 md:h-16 md:px-6 px-4 rounded-full"
                onClick={handleQuickExit}
            >
                <XCircle className="mr-2 h-4 md:h-5 w-4 md:w-5" />
                Quick Exit
            </Button>
        </div>
    );
}
