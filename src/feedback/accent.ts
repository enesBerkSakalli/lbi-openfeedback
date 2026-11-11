import { lighten, type Theme } from '@mui/material'

// One accent across the feedback app: the brand red-orange. White text on the
// raw brand color is only ~3.2:1, so filled elements use its dark shade (white
// text 5.2:1) and text or borders on the dark background use a light tint
// (5.7:1 on #303030), keeping WCAG AA contrast.

/** Accent color for text, icons and borders on the page background. */
export const accentText = (theme: Theme): string =>
    theme.palette.mode === 'dark'
        ? lighten(theme.palette.primary.main, 0.3)
        : theme.palette.primary.dark

/** Accent color behind white text (filled buttons and chips). */
export const accentFill = (theme: Theme): string => theme.palette.primary.dark
