import axios from 'axios';

// �����: ����� ������ ���� ������� API-URL (�������), �� localhost!
export const api = axios.create({ baseURL: 'https://trimly-upbeat-lungfish.cloudpub.ru' });

const LS_JWT = 'jwt';
const LS_JWT_SOURCE = 'jwt_source'; // 'tg' | 'dev'

const token = localStorage.getItem('jwt');
if (token) api.defaults.headers.common['Authorization'] = `Bearer ${token}`;

function inTelegram(): boolean {
    const tg = (window as any)?.Telegram?.WebApp;
    return Boolean(tg && tg.initData);
}

async function getTelegramJwt(): Promise<string | null> {
    const tg = (window as any)?.Telegram?.WebApp;
    if (!tg?.initData) return null;
    const { data } = await axios.post(`${api.defaults.baseURL}/auth/telegram`, { initData: tg.initData });
    localStorage.setItem(LS_JWT, data.token);
    localStorage.setItem(LS_JWT_SOURCE, 'tg');
    return data.token;
}

export async function authByTelegram() {
    const tg = (window as any).Telegram?.WebApp;
    const initData = tg?.initData || '';
    const { data } = await api.post('/auth/telegram', { initData });
    localStorage.setItem('jwt', data.token);
    api.defaults.headers.common['Authorization'] = `Bearer ${data.token}`;
    return data.user; // ����� �� ������������, ������� �� ����� ������ �� /auth/whoami
}

async function getDevJwt(): Promise<string | null> {
    // ��������� dev-����� ������ ��� Telegram
    if (inTelegram()) return null;
    const { data } = await axios.get(`${api.defaults.baseURL}/auth/dev?tgId=DEV_USER`);
    localStorage.setItem(LS_JWT, data.token);
    localStorage.setItem(LS_JWT_SOURCE, 'dev');
    return data.token;
}

// �� ������: ���� �� � Telegram, � � ��������� ����� dev-����� � ���������� ���
try {
    if (inTelegram() && localStorage.getItem(LS_JWT_SOURCE) === 'dev') {
        localStorage.removeItem(LS_JWT);
        localStorage.removeItem(LS_JWT_SOURCE);
    }
} catch { }

api.interceptors.request.use(async (cfg) => {
    // ���� �� � Telegram � ����� �� 'tg', ������� � �������� ������
    if (inTelegram() && localStorage.getItem(LS_JWT_SOURCE) !== 'tg') {
        localStorage.removeItem(LS_JWT);
        localStorage.removeItem(LS_JWT_SOURCE);
    }

    let token = localStorage.getItem(LS_JWT);
    if (!token) {
        token = (inTelegram() ? await getTelegramJwt() : await getDevJwt());
    }

    cfg.headers = cfg.headers || {};
    if (token) {
        cfg.headers['Authorization'] = `Bearer ${token}`;
    } else {
        // ������ x-tg-id �������� ������ ��� Telegram
        if (!inTelegram()) cfg.headers['x-tg-id'] = 'DEV_USER';
    }
    return cfg;
});
