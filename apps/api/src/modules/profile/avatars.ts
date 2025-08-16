export const AVATARS = [
    { key: 'miner_1', title: '����� 1', src: '/avatars/miner_1.png' },
    { key: 'miner_2', title: '����� 2', src: '/avatars/miner_2.png' },
    { key: 'miner_3', title: '����� 3', src: '/avatars/miner_3.png' },
    { key: 'bot_1', title: '��� 1', src: '/avatars/bot_1.png' },
];
export function isValidAvatar(key?: string | null) {
    return !!AVATARS.find(a => a.key === key);
}
