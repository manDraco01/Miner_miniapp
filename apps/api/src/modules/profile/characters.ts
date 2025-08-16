export const CHARACTERS = [
    {
        key: 'warrior',
        title: '����',
        art: '/hero/warrior.png',
        desc: '���������������� ���� �������� ���.',
    },
    {
        key: 'rogue',
        title: '����',
        art: '/hero/rogue.png',
        desc: '������� ��������, ����������� �����.',
    },
];

export function isValidCharacter(key?: string | null) {
    return !!CHARACTERS.find(c => c.key === key);
}
