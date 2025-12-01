import { supabase } from '@/lib/supabase';

export interface EmergencyContact {
    id: string;
    name: string;
    description: string;
    phone: string;
    icon: string;
    is_primary: boolean;
}

export interface SafetyTip {
    id: string;
    title: string;
    content: string;
    category: string;
}

export interface SafeCenter {
    id: string;
    name: string;
    description: string;
    phone: string;
    lat: number;
    lng: number;
    address: string;
    open_hours: string;
}

export const getEmergencyContacts = async (): Promise<EmergencyContact[]> => {
    try {
        const { data, error } = await supabase
            .from('emergency_contacts')
            .select('*')
            .order('is_primary', { ascending: false });

        if (error) {
            console.error('Error fetching emergency contacts:', error);
            return [];
        }

        return data || [];
    } catch (error) {
        console.error('Unexpected error fetching emergency contacts:', error);
        return [];
    }
};

export const getSafetyTips = async (): Promise<SafetyTip[]> => {
    try {
        const { data, error } = await supabase
            .from('safety_tips')
            .select('*');

        if (error) {
            console.error('Error fetching safety tips:', error);
            return [];
        }

        return data || [];
    } catch (error) {
        console.error('Unexpected error fetching safety tips:', error);
        return [];
    }
};

export const getSafeCenters = async (): Promise<SafeCenter[]> => {
    try {
        const { data, error } = await supabase
            .from('safe_centers')
            .select('*');

        if (error) {
            console.error('Error fetching safe centers:', error);
            return [];
        }

        return data || [];
    } catch (error) {
        console.error('Unexpected error fetching safe centers:', error);
        return [];
    }
};
