import { createTheme, rem } from '@mantine/core'

export const theme = createTheme({
  fontFamily: 'Lato, sans-serif',
  headings: {
    fontFamily: 'Lato, sans-serif',
    fontWeight: '700',
  },
  fontSizes: {
    xs: rem(12),
    sm: rem(14),
    md: rem(16),
    lg: rem(18),
    xl: rem(20),
  },
  breakpoints: {
    xs: '36em',
    sm: '48em',
    md: '62em',
    lg: '75em',
    xl: '88em',
    xxl: '120em',
  },
  defaultRadius: 'md',
  black: '#333',
  primaryColor: 'lime',
  primaryShade: 7,
  autoContrast: true,
  other: {
    backgroundColor: '#f5f5f5',
  },
})
