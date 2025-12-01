import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { vi } from 'vitest';
import Login from './Login';
import { BrowserRouter } from 'react-router-dom';

// Mock dependencies
vi.mock('react-router-dom', async () => {
    const actual = await vi.importActual('react-router-dom');
    return {
        ...actual,
        useNavigate: () => vi.fn(),
    };
});

const mockLogin = vi.fn();
vi.mock('@/contexts/AuthContext', () => ({
    useAuth: () => ({
        login: mockLogin,
    }),
}));

vi.mock('react-i18next', () => ({
    useTranslation: () => ({
        t: (key: string) => key,
    }),
}));

vi.mock('@/components/ui/language-switcher', () => ({
    LanguageSwitcher: () => <div data-testid="language-switcher" />,
}));

vi.mock('@/components/ui/mode-toggle', () => ({
    ModeToggle: () => <div data-testid="mode-toggle" />,
}));

describe('Login Page', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    it('renders login form correctly', () => {
        render(
            <BrowserRouter>
                <Login />
            </BrowserRouter>
        );

        expect(screen.getByLabelText('email')).toBeInTheDocument();
        expect(screen.getByLabelText('password')).toBeInTheDocument();
        expect(screen.getByRole('button', { name: 'sign_in' })).toBeInTheDocument();
    });

    it('updates input fields', () => {
        render(
            <BrowserRouter>
                <Login />
            </BrowserRouter>
        );

        const emailInput = screen.getByLabelText('email');
        const passwordInput = screen.getByLabelText('password');

        fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
        fireEvent.change(passwordInput, { target: { value: 'password123' } });

        expect(emailInput).toHaveValue('test@example.com');
        expect(passwordInput).toHaveValue('password123');
    });

    it('calls login function on form submission', async () => {
        mockLogin.mockResolvedValue({ error: null });

        render(
            <BrowserRouter>
                <Login />
            </BrowserRouter>
        );

        const emailInput = screen.getByLabelText('email');
        const passwordInput = screen.getByLabelText('password');
        const submitButton = screen.getByRole('button', { name: 'sign_in' });

        fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
        fireEvent.change(passwordInput, { target: { value: 'password123' } });
        fireEvent.click(submitButton);

        await waitFor(() => {
            expect(mockLogin).toHaveBeenCalledWith('test@example.com', 'password123');
        });
    });
});
