import { createTheme } from '@mui/material/styles'
import { grey } from '@mui/material/colors'
import { COLORS } from '../constants/colors'

const createFeedbackTheme = (prefersDarkMode: boolean) => {
    // Neobrutalist accents: solid ink borders and hard offset shadows, kept
    // to the controls and cards people act on.
    const ink = prefersDarkMode ? 'rgba(255, 255, 255, 0.85)' : '#1a1a1a'
    const hardShadow = (size: number) => `${size}px ${size}px 0 ${ink}`
    return createTheme({
        // One fixed role scale, Roboto 400/500/700 only:
        // title 24/700, section 18/700, reading 17, label 15/700,
        // meta 14, counter 13.
        typography: {
            h1: {
                fontSize: 24,
                fontWeight: 700,
                lineHeight: 1.25,
                letterSpacing: '-0.01em',
            },
            h2: {
                fontSize: 24,
                fontWeight: 700,
                lineHeight: 1.25,
                letterSpacing: '-0.01em',
            },
            h3: { fontSize: 18, fontWeight: 700, lineHeight: 1.3 },
            h4: { fontSize: 18, fontWeight: 700, lineHeight: 1.3 },
            h6: { fontSize: 18, fontWeight: 700, lineHeight: 1.3 },
            subtitle2: { fontSize: 14, fontWeight: 700, lineHeight: 1.4 },
            body1: { fontSize: 17, lineHeight: 1.6 },
            body2: { fontSize: 14, lineHeight: 1.45 },
            caption: { fontSize: 13, lineHeight: 1.4 },
            // Sentence case reads faster than spaced capitals
            button: {
                fontSize: 15,
                fontWeight: 700,
                letterSpacing: 0,
                textTransform: 'none',
            },
        },
        palette: {
            // The brand red-orange in WCAG AA shades: a light tint on the
            // dark background (5.7:1, dark text on it 7.8:1), its dark
            // shade on the light one (4.95:1, white text on it 5.2:1).
            primary: prefersDarkMode
                ? {
                      main: '#ff896f',
                      contrastText: 'rgba(0, 0, 0, 0.87)',
                  }
                : {
                      main: COLORS.DARK_RED_ORANGE,
                      contrastText: '#fff',
                  },
            action: {
                // Greyed-out controls stay legible (WCAG exempts them).
                disabled: prefersDarkMode
                    ? 'rgba(255, 255, 255, 0.5)'
                    : 'rgba(0, 0, 0, 0.45)',
            },
            secondary: {
                main: '#3673ff',
                contrastText: 'rgba(255,255,255, 0.87)',
            },
            background: {
                default: prefersDarkMode ? '#303030' : '#fafafa',
                paper: prefersDarkMode ? '#595959' : '#EDEDED',
            },
            text: {
                primary: prefersDarkMode ? grey[50] : grey[900],
                secondary: prefersDarkMode
                    ? 'rgba(255, 255, 255, 0.7)'
                    : grey[600],
            },
            mode: prefersDarkMode ? 'dark' : 'light',
            pageBackground: prefersDarkMode ? '#303030' : '#fff',
            headerShadow: prefersDarkMode ? '#000' : '#B3B3B3',
            paperBorder: prefersDarkMode ? grey[600] : grey[300],
            paperVoteBorder: prefersDarkMode ? grey[400] : grey[300],
            textVoteTitle: prefersDarkMode ? grey[400] : grey[900],
            textVoteTitleShadow: prefersDarkMode ? grey[800] : grey[50],
            textDimmed: prefersDarkMode ? grey[400] : grey[600],
            ink,
        },
        components: {
            // A visible keyboard focus ring on every MUI control (the
            // ripple alone is too faint to see where focus is).
            MuiButtonBase: {
                styleOverrides: {
                    root: {
                        '&.Mui-focusVisible': {
                            outline: `2px solid ${
                                prefersDarkMode
                                    ? '#ff896f'
                                    : COLORS.DARK_RED_ORANGE
                            }`,
                            outlineOffset: 2,
                        },
                    },
                },
            },
            MuiButton: {
                variants: [
                    {
                        props: { variant: 'contained' },
                        style: {
                            border: `2px solid ${ink}`,
                            boxShadow: hardShadow(3),
                            transition:
                                'transform 120ms ease-out, box-shadow 120ms ease-out',
                            '&:hover': {
                                boxShadow: hardShadow(4),
                                transform: 'translate(-1px, -1px)',
                            },
                            '&:active': {
                                boxShadow: hardShadow(1),
                                transform: 'translate(2px, 2px)',
                            },
                            '&.Mui-disabled': {
                                boxShadow: 'none',
                                borderColor: 'transparent',
                            },
                        },
                    },
                    {
                        props: { variant: 'outlined' },
                        style: {
                            border: `2px solid ${ink}`,
                            boxShadow: hardShadow(3),
                            '&:hover': { border: `2px solid ${ink}` },
                        },
                    },
                ],
            },
            MuiCardActionArea: {
                styleOverrides: {
                    // The card clips overflow: draw the ring inside it
                    root: { '&.Mui-focusVisible': { outlineOffset: -4 } },
                },
            },
            MuiOutlinedInput: {
                styleOverrides: {
                    root: {
                        borderRadius: 8,
                        backgroundColor: prefersDarkMode ? '#262626' : '#fff',
                        '&:hover .MuiOutlinedInput-notchedOutline': {
                            borderColor: ink,
                        },
                    },
                    notchedOutline: {
                        borderWidth: 2,
                        borderColor: ink,
                    },
                },
            },
            MuiChip: {
                // Same 3:1 floor for the grey outlined chips' border.
                variants: [
                    {
                        props: { variant: 'outlined', color: 'default' },
                        style: {
                            border: `2px solid ${ink}`,
                        },
                    },
                ],
            },
            MuiToggleButton: {
                styleOverrides: {
                    // Pressed reads as inverted ink, on any card tint
                    root: {
                        border: `2px solid ${ink}`,
                        color: 'inherit',
                        '&.Mui-selected, &.Mui-selected:hover': {
                            backgroundColor: ink,
                            color: prefersDarkMode ? '#1a1a1a' : '#fff',
                        },
                    },
                },
            },
            MuiInputBase: {
                styleOverrides: {
                    // Comments are read and written at a calm size
                    inputMultiline: {
                        fontSize: 17,
                        lineHeight: 1.55,
                    },
                    input: {
                        '&::placeholder': {
                            opacity: 1,
                            color: prefersDarkMode
                                ? 'rgba(255, 255, 255, 0.6)'
                                : 'rgba(0, 0, 0, 0.6)',
                        },
                    },
                },
            },
        },
    })
}

/** Themes of the feedback app, also used by the admin to preview votes. */
export const feedbackThemes = {
    light: createFeedbackTheme(false),
    dark: createFeedbackTheme(true),
}
