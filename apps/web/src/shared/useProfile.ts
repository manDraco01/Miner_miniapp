// apps/web/src/shared/useProfile.ts
import { useCallback, useEffect, useState } from 'react';
import { api, authByTelegram } from './api';
import { api, ensureAuth } from "../shared/api";

export type Profile = {
    id: string;
    tgId: string;
    username?: string | null;
    displayName?: string | null;   // << ��������
    photoUrl?: string | null;      // << ��������
    level?: number;
    xp?: number;
    gender?: 'male'|'female'|null;
    hero?: { gender?: 'male'|'female'|null } | null;
    // ...������ ���� ����
};

export function useProfile() {
    const [profile, setProfile] = useState<Profile | null>(null);
    const [loading, setLoading] = useState(true);

    const load = useCallback(async () => {
        setLoading(true);
        try {
            // ���� ��� ������ � ������������ ����� Telegram
            const hasToken = !!localStorage.getItem('jwt');
            if (!hasToken) {
                await authByTelegram();
            }
            const { data } = await api.get('/auth/whoami');
            setProfile(data?.user ?? null);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => { load(); }, [load]);

    // �����������: ������ �������������� ����/������� ����� �������� �������/���������
    const setNickname = async (_nick: string) => { };
    const setAvatar = async (_key: string) => { };
    const reload = load;

    return { profile, loading, setNickname, setAvatar, reload };
}
