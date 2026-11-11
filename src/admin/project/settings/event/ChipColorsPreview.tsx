import { memo, useState } from 'react'
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import { ThemeProvider } from '@mui/material/styles'
import { useTranslation } from 'react-i18next'
import { BooleanVoteButton } from '../../../../feedback/talk/boolean/BooleanVoteButton.tsx'
import { feedbackTheme } from '../../../../feedback/feedbackTheme'

// otherVotes: votes from other attendees, before the admin own vote
const initialItems = [
    {
        nameKey: 'settingsEvent.chipColorsPreviewItem1',
        otherVotes: 4,
        voted: false,
    },
    {
        nameKey: 'settingsEvent.chipColorsPreviewItem2',
        otherVotes: 11,
        voted: true,
    },
]

interface ChipColorsPreviewProps {
    /** Hex colors without `#`. */
    chipColors?: string[]
}

/**
 * Boolean votes rendered with the feedback app components and theme, so the
 * chip colors can be checked while editing them.
 * Memoized: the nested ThemeProvider would otherwise rebuild the vote styles
 * on every render of the surrounding form.
 */
export const ChipColorsPreview = memo(
    ({ chipColors }: ChipColorsPreviewProps) => {
        const { t } = useTranslation()
        const [items, setItems] = useState(initialItems)

        const toggle = (nameKey: string) =>
            setItems((current) =>
                current.map((item) =>
                    item.nameKey === nameKey
                        ? { ...item, voted: !item.voted }
                        : item
                )
            )

        return (
            <Box sx={{ paddingTop: 1 }}>
                <Typography variant="caption" color="textSecondary">
                    {t('settingsEvent.chipColorsPreview')}
                </Typography>
                <ThemeProvider theme={feedbackTheme}>
                    <Box
                        sx={{
                            display: 'grid',
                            gridTemplateColumns: '1fr 1fr',
                            maxWidth: 360,
                            marginTop: 0.5,
                            padding: 1,
                            backgroundColor:
                                feedbackTheme.palette.pageBackground,
                            border: 1,
                            borderColor: feedbackTheme.palette.paperBorder,
                        }}
                    >
                        {items.map((item) => (
                            <BooleanVoteButton
                                key={item.nameKey}
                                name={t(item.nameKey)}
                                isSelected={item.voted}
                                voteResult={
                                    item.otherVotes + Number(item.voted)
                                }
                                chipColors={chipColors}
                                onClick={() => toggle(item.nameKey)}
                            />
                        ))}
                    </Box>
                </ThemeProvider>
            </Box>
        )
    }
)
