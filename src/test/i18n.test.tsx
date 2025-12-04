import { render, screen, waitFor, act } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import Login from '../pages/Login';
import '../i18n'; // Import i18n config
import { I18nextProvider } from 'react-i18next';
import i18n from '../i18n';
import { BrowserRouter } from 'react-router-dom';

// Mock AuthContext
vi.mock('../contexts/AuthContext', () => ({
    useAuth: () => ({
        login: vi.fn(),
        user: null
    }),
    AuthProvider: ({ children }: { children: React.ReactNode }) => <div>{children}</div>
}));

describe('Language Switching', () => {
    it('changes language to Kiswahili when selected', async () => {
        render(
            <BrowserRouter>
                <I18nextProvider i18n={i18n}>
                    <Login />
                </I18nextProvider>
            </BrowserRouter>
        );

        // Check initial English text
        expect(screen.getByText("You're Safe Here")).toBeInTheDocument();

        // Direct language change
        await act(async () => {
            await i18n.changeLanguage('sw');
        });

        console.log('Current language:', i18n.language);
        console.log('SW resources:', JSON.stringify(i18n.getDataByLanguage('sw'), null, 2));

        // Check for Kiswahili text
        await waitFor(() => {
            expect(screen.getByText('Uko Salama Hapa')).toBeInTheDocument();
        });
    });
});
