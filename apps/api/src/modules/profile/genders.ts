export const GENDERS = [
    { key: 'male', title: '�������', art: '/hero/male.png', desc: '������������ ������� ������ �����.' },
    { key: 'female', title: '�������', art: '/hero/female.png', desc: '������������ ������� ������ �����.' },
];

export function isValidGender(key?: string | null) {
    return key === 'male' || key === 'female';
}
