import '@mui/material/styles'

// Custom palette entries of the feedback app theme (src/feedback/feedbackTheme.ts).
interface OpenFeedbackPalette {
    pageBackground: string
    headerShadow: string
    paperBorder: string
    paperVoteBorder: string
    textVoteTitle: string
    textVoteTitleShadow: string
    textDimmed: string
    /** Neobrutalist borders and hard shadows. */
    ink: string
    /** Panels on the page: cards, the comment field. */
    surface: string
    /** Neo-brutalist accents, always with #1a1a1a text. */
    lavender: string
    lime: string
}

declare module '@mui/material/styles' {
    interface Palette extends OpenFeedbackPalette {}
    interface PaletteOptions extends Partial<OpenFeedbackPalette> {}
}
