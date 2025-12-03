export const designSystem = {
  colors: {
    primary: {
      50: '#FFF5F0',
      100: '#FFE8DC',
      200: '#FFD1B9',
      300: '#FFBA96',
      400: '#FFA373',
      500: '#FF8C50',
      600: '#FF7533',
      700: '#F05D1A',
      800: '#C94A0F',
      900: '#A03708',
    },
    secondary: {
      50: '#FFF3F8',
      100: '#FFE0ED',
      200: '#FFC1DB',
      300: '#FFA2C9',
      400: '#FF83B7',
      500: '#FF64A5',
      600: '#FF4593',
      700: '#E62E7A',
      800: '#C02261',
      900: '#9A1848',
    },
    accent: {
      50: '#FFFBEB',
      100: '#FEF3C7',
      200: '#FDE68A',
      300: '#FCD34D',
      400: '#FBBF24',
      500: '#F59E0B',
      600: '#D97706',
      700: '#B45309',
      800: '#92400E',
      900: '#78350F',
    },
    neutral: {
      50: '#FAFAFA',
      100: '#F5F5F5',
      200: '#E5E5E5',
      300: '#D4D4D4',
      400: '#A3A3A3',
      500: '#737373',
      600: '#525252',
      700: '#404040',
      800: '#262626',
      900: '#171717',
    },
    success: {
      50: '#F0FDF4',
      100: '#DCFCE7',
      200: '#BBF7D0',
      300: '#86EFAC',
      400: '#4ADE80',
      500: '#22C55E',
      600: '#16A34A',
      700: '#15803D',
      800: '#166534',
      900: '#14532D',
    },
    warning: {
      50: '#FFFBEB',
      100: '#FEF3C7',
      200: '#FDE68A',
      300: '#FCD34D',
      400: '#FBBF24',
      500: '#F59E0B',
      600: '#D97706',
      700: '#B45309',
      800: '#92400E',
      900: '#78350F',
    },
    error: {
      50: '#FEF2F2',
      100: '#FEE2E2',
      200: '#FECACA',
      300: '#FCA5A5',
      400: '#F87171',
      500: '#EF4444',
      600: '#DC2626',
      700: '#B91C1C',
      800: '#991B1B',
      900: '#7F1D1D',
    },
  },
  spacing: {
    xs: '0.5rem',
    sm: '0.75rem',
    md: '1rem',
    lg: '1.5rem',
    xl: '2rem',
    '2xl': '3rem',
    '3xl': '4rem',
    '4xl': '6rem',
  },
  borderRadius: {
    sm: '0.5rem',
    md: '0.75rem',
    lg: '1rem',
    xl: '1.5rem',
    '2xl': '2rem',
    full: '9999px',
  },
  shadows: {
    sm: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
    md: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
    lg: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
    xl: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
    '2xl': '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
    glow: '0 0 20px rgba(255, 140, 80, 0.3)',
  },
  typography: {
    fontFamily: {
      sans: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
      display: '"Poppins", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
    },
    fontSize: {
      xs: '0.75rem',
      sm: '0.875rem',
      base: '1rem',
      lg: '1.125rem',
      xl: '1.25rem',
      '2xl': '1.5rem',
      '3xl': '1.875rem',
      '4xl': '2.25rem',
      '5xl': '3rem',
    },
    fontWeight: {
      normal: '400',
      medium: '500',
      semibold: '600',
      bold: '700',
      extrabold: '800',
    },
    lineHeight: {
      tight: '1.25',
      normal: '1.5',
      relaxed: '1.75',
    },
  },
};

export const cardStyles = {
  base: 'bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300',
  padding: {
    sm: 'p-4',
    md: 'p-6',
    lg: 'p-8',
  },
  border: 'border border-neutral-100',
  gradient: 'bg-gradient-to-br',
};

export const buttonStyles = {
  base: 'inline-flex items-center justify-center font-semibold rounded-xl transition-all duration-200 focus:outline-none focus:ring-4 focus:ring-opacity-50',
  sizes: {
    sm: 'px-4 py-2 text-sm',
    md: 'px-6 py-3 text-base',
    lg: 'px-8 py-4 text-lg',
  },
  variants: {
    primary: 'bg-gradient-to-r from-primary-500 to-secondary-500 text-white hover:shadow-lg hover:scale-105 focus:ring-primary-300',
    secondary: 'bg-gradient-to-r from-accent-400 to-accent-600 text-white hover:shadow-lg hover:scale-105 focus:ring-accent-300',
    outline: 'border-2 border-primary-500 text-primary-600 hover:bg-primary-50 focus:ring-primary-300',
    ghost: 'text-primary-600 hover:bg-primary-50 focus:ring-primary-300',
    success: 'bg-gradient-to-r from-success-500 to-success-600 text-white hover:shadow-lg hover:scale-105 focus:ring-success-300',
    danger: 'bg-gradient-to-r from-error-500 to-error-600 text-white hover:shadow-lg hover:scale-105 focus:ring-error-300',
  },
};

export const inputStyles = {
  base: 'w-full px-4 py-3 border-2 rounded-xl transition-all duration-200 focus:outline-none focus:ring-4 focus:ring-opacity-50',
  default: 'border-neutral-200 focus:border-primary-500 focus:ring-primary-300',
  error: 'border-error-500 focus:border-error-500 focus:ring-error-300',
  success: 'border-success-500 focus:border-success-500 focus:ring-success-300',
};

export const badgeStyles = {
  base: 'inline-flex items-center px-3 py-1 rounded-full text-sm font-medium',
  variants: {
    primary: 'bg-primary-100 text-primary-800',
    secondary: 'bg-secondary-100 text-secondary-800',
    success: 'bg-success-100 text-success-800',
    warning: 'bg-warning-100 text-warning-800',
    error: 'bg-error-100 text-error-800',
    neutral: 'bg-neutral-100 text-neutral-800',
  },
};

export const gradients = {
  primary: 'from-primary-400 via-primary-500 to-secondary-500',
  warm: 'from-accent-400 via-primary-500 to-secondary-500',
  success: 'from-success-400 to-success-600',
  info: 'from-blue-400 to-purple-600',
  background: 'from-primary-50 via-secondary-50 to-accent-50',
  card: 'from-white to-neutral-50',
};

export function getButtonClass(variant: keyof typeof buttonStyles.variants = 'primary', size: keyof typeof buttonStyles.sizes = 'md'): string {
  return `${buttonStyles.base} ${buttonStyles.sizes[size]} ${buttonStyles.variants[variant]}`;
}

export function getCardClass(padding: keyof typeof cardStyles.padding = 'md', withBorder = false): string {
  return `${cardStyles.base} ${cardStyles.padding[padding]} ${withBorder ? cardStyles.border : ''}`;
}

export function getBadgeClass(variant: keyof typeof badgeStyles.variants = 'primary'): string {
  return `${badgeStyles.base} ${badgeStyles.variants[variant]}`;
}
