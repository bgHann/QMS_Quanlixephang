export const VALIDATION = {
    PASSWORD_MIN: 8,
    // Quy tắc ảnh hình nền, logo: tạm theo ảnh đại diện (SRS ACC-06), chờ xác nhận
    IMAGE_TYPES: ['image/jpeg', 'image/png', 'image/webp'] as string[],
    IMAGE_MAX_MB: 30,
} as const;