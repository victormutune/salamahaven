import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';

export default function Logout() {
    const { logout } = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
        const performLogout = async () => {
            try {
                await logout();
                navigate('/login');
            } catch (error) {
                console.error('Logout failed:', error);
                navigate('/login'); // Redirect even if error occurs
            }
        };

        performLogout();
    }, [logout, navigate]);

    return (
        <div className="flex items-center justify-center min-h-screen">
            <p className="text-muted-foreground">Logging out...</p>
        </div>
    );
}
