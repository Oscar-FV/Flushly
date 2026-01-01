import { DarkTheme, DefaultTheme, type Theme } from '@react-navigation/native';

export const THEME = {
  light: {
    background: 'hsl(150 25% 97%)',
    backgroundTransparent: 'hsla(150 25% 97% / 0.2)',
    backgroundTransparent2: 'hsla(150 25% 97% / 0.5)',
    foreground: 'hsl(222 47% 11%)',
    card: 'hsl(150 20% 98%)',
    cardForeground: 'hsl(222 47% 11%)',
    popover: 'hsl(150 20% 98%)',
    popoverForeground: 'hsl(222 47% 11%)',

    /* Brand */
    primary: 'hsl(158 64% 34%)',
    primaryForeground: 'hsl(150 25% 97%)',

    /* Secondary / Muted */
    secondary: 'hsl(210 20% 94%)',
    secondaryForeground: 'hsl(222 47% 11%)',
    muted: 'hsl(210 20% 94%)',
    mutedForeground: 'hsl(215 16% 47%)',

    /* Accent */
    accent: 'hsl(270 50% 85%)',
    accentForeground: 'hsl(158 64% 34%)',

    /* States */
    destructive: 'hsl(0 84% 60%)',

    /* UI */
    border: 'hsl(214 20% 88%)',
    input: 'hsl(214 20% 88%)',
    ring: 'hsl(158 64% 34%)',
    radius: '0.625rem',

    /* Charts */
    chart1: 'hsl(158 64% 34%)',
    chart2: 'hsl(221 83% 53%)',
    chart3: 'hsl(43 96% 56%)',
    chart4: 'hsl(0 84% 60%)',
    chart5: 'hsl(270 80% 60%)',

    /* Rating categories (LIGHT) */
    ratingCleanliness: 'hsl(158 64% 34%)',
    ratingAvailability: 'hsl(210 70% 45%)',
    ratingPrivacy: 'hsl(270 50% 40%)',
    ratingMaintenance: 'hsl(35 85% 55%)',
    ratingAccessibility: 'hsl(175 55% 40%)',
  },

  dark: {
    background: 'hsl(222 30% 10%)',
    backgroundTransparent: 'hsla(222 30% 10% / 0.2)',
    backgroundTransparent2: 'hsla(222 30% 10% / 0.5)',
    foreground: 'hsl(150 25% 97%)',
    card: 'hsl(222 28% 13%)',
    cardForeground: 'hsl(150 25% 97%)',
    popover: 'hsl(222 28% 13%)',
    popoverForeground: 'hsl(150 25% 97%)',

    /* Brand */
    primary: 'hsl(160 84% 39%)',
    primaryForeground: 'hsl(222 30% 10%)',

    /* Secondary / Muted */
    secondary: 'hsl(223 22% 18%)',
    secondaryForeground: 'hsl(150 25% 97%)',
    muted: 'hsl(223 22% 18%)',
    mutedForeground: 'hsl(215 20% 65%)',

    /* Accent */
    accent: 'hsl(270 50% 40%)',
    accentForeground: 'hsl(160 84% 39%)',

    /* States */
    destructive: 'hsl(0 72% 51%)',

    /* UI */
    border: 'hsl(223 22% 18%)',
    input: 'hsl(223 22% 18%)',
    ring: 'hsl(160 84% 39%)',
    radius: '0.625rem',

    /* Charts */
    chart1: 'hsl(160 84% 39%)',
    chart2: 'hsl(217 91% 60%)',
    chart3: 'hsl(43 96% 56%)',
    chart4: 'hsl(0 72% 51%)',
    chart5: 'hsl(280 85% 65%)',

    /* Rating categories (DARK) */
    ratingCleanliness: 'hsl(158 64% 45%)',
    ratingAvailability: 'hsl(210 70% 60%)',
    ratingPrivacy: 'hsl(270 50% 55%)',
    ratingMaintenance: 'hsl(35 85% 65%)',
    ratingAccessibility: 'hsl(175 55% 55%)',
  },
};

export const NAV_THEME: Record<'light' | 'dark', Theme> = {
  light: {
    ...DefaultTheme,
    colors: {
      background: THEME.light.background,
      border: THEME.light.border,
      card: THEME.light.card,
      notification: THEME.light.destructive,
      primary: THEME.light.primary,
      text: THEME.light.foreground,
    },
  },
  dark: {
    ...DarkTheme,
    colors: {
      background: THEME.dark.background,
      border: THEME.dark.border,
      card: THEME.dark.card,
      notification: THEME.dark.destructive,
      primary: THEME.dark.primary,
      text: THEME.dark.foreground,
    },
  },
};
