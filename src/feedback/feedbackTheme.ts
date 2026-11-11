import { createTheme } from '@mui/material/styles'
import { grey } from '@mui/material/colors'
import { COLORS } from '../constants/colors'

const createFeedbackTheme = () => {
    // Neobrutalist accents: solid ink borders and hard offset shadows, kept
    // to the controls and cards people act on.
    const ink = '#1a1a1a'
    const hardShadow = (size: number) => `${size}px ${size}px 0 ${ink}`
    // Cream page, white panels, lavender and lime accents with black text
    const page = '#f6f1e7'
    const surface = '#fffdf8'
    const lavender = '#c4b2ff'
    const lime = '#d4f27a'
    return createTheme({
        shape: { borderRadius: 0 },
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
            // The brand red-orange in its WCAG AA dark shade (4.6:1 on
            // cream, white text on it 5.2:1).
            primary: {
                main: COLORS.DARK_RED_ORANGE,
                contrastText: '#fff',
            },
            action: {
                // Greyed-out controls stay legible (WCAG exempts them).
                disabled: 'rgba(0, 0, 0, 0.45)',
            },
            secondary: {
                main: '#3673ff',
                contrastText: 'rgba(255,255,255, 0.87)',
            },
            background: {
                default: page,
                paper: '#EDEDED',
            },
            text: {
                primary: grey[900],
                // Darker than grey[600]: it must hold 4.5:1 on cream
                secondary: '#5c5c5c',
            },
            mode: 'light',
            pageBackground: page,
            headerShadow: '#B3B3B3',
            paperBorder: grey[300],
            paperVoteBorder: grey[300],
            textVoteTitle: grey[900],
            textVoteTitleShadow: grey[50],
            textDimmed: '#5c5c5c',
            ink,
            surface,
            lavender,
            lime,
        },
        components: {
            // A visible keyboard focus ring on every MUI control (the
            // ripple alone is too faint to see where focus is).
            MuiButtonBase: {
                styleOverrides: {
                    root: {
                        '&.Mui-focusVisible': {
                            outline: `2px solid ${COLORS.DARK_RED_ORANGE}`,
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
                            backgroundColor: lavender,
                            color: '#1a1a1a',
                            boxShadow: hardShadow(3),
                            transition:
                                'transform 120ms ease-out, box-shadow 120ms ease-out',
                            '&:hover': {
                                backgroundColor: lavender,
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
                            backgroundColor: surface,
                            boxShadow: hardShadow(3),
                            '&:hover': {
                                border: `2px solid ${ink}`,
                                backgroundColor: surface,
                            },
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
                        backgroundColor: surface,
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
                styleOverrides: { root: { borderRadius: 0 } },
                variants: [
                    {
                        props: { variant: 'outlined', color: 'default' },
                        style: {
                            border: `2px solid ${ink}`,
                            backgroundColor: surface,
                            '&.MuiChip-clickable:hover': {
                                backgroundColor: lime,
                                color: '#1a1a1a',
                            },
                        },
                    },
                ],
            },
            MuiAlert: {
                styleOverrides: { root: { border: `2px solid ${ink}` } },
            },
            MuiToggleButton: {
                styleOverrides: {
                    // Pressed reads as inverted ink, on any card tint
                    root: {
                        border: `2px solid ${ink}`,
                        color: 'inherit',
                        '&.Mui-selected, &.Mui-selected:hover': {
                            backgroundColor: ink,
                            color: '#fff',
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
                            color: 'rgba(0, 0, 0, 0.6)',
                        },
                    },
                },
            },
        },
    })
}

/** The feedback app theme (light only), also used by the admin to preview votes. */
export const feedbackTheme = createFeedbackTheme()
