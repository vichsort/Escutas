export const LEGACY_OPTIONS = [
    { label: '👑👑👑', value: 10.0, risk: false },
    { label: '👑👑', value: 9.9, risk: false },
    { label: '👑', value: 9.5, risk: false },
    { label: '#', value: 9.0, risk: false },
    { label: '##', value: 8.5, risk: false },
    { label: '###', value: 7.5, risk: false },
    { label: 'good', value: 6.5, risk: false },
    { label: 'mid', value: 6.0, risk: false },
    { label: 'bad', value: 4.5, risk: false },
    { label: '~~bad~~', value: 3.0, risk: true },
    { label: '~~bad~~ 💀', value: 0.0, risk: true },
];

export const TIER_CONFIG = {
    S: { bg: '#F59E0B', text: '#000000' },
    A: { bg: '#10B981', text: '#000000' },
    B: { bg: '#3B82F6', text: '#ffffff' },
    C: { bg: '#EAB308', text: '#000000' },
    D: { bg: '#F97316', text: '#ffffff' },
    E: { bg: '#EF4444', text: '#ffffff' },
}