import type { ReactNode } from 'react'
import Box from '@mui/material/Box'
import { HEX_COLORS } from '../constants/colors'
import { LOGIN_STYLE } from './EmailPasswordAuth.tsx'

const { ink } = LOGIN_STYLE

// The FeedbackY wordmark as text: "FEEDBACK" plus the Y in an ink block.
export const Wordmark = ({
    size = 22,
    color = '#fff',
}: {
    size?: number
    color?: string
}) => (
    <Box
        component="span"
        aria-label="FeedbackY"
        role="img"
        sx={{
            display: 'inline-flex',
            alignItems: 'stretch',
            fontWeight: 700,
            fontSize: size,
            lineHeight: 1,
            letterSpacing: '-0.02em',
            textTransform: 'uppercase',
            color,
        }}
    >
        <Box component="span" sx={{ padding: '0.15em 0.2em 0.15em 0' }}>
            Feedback
        </Box>
        <Box
            component="span"
            sx={{
                padding: '0.15em 0.3em',
                backgroundColor: ink,
                color: '#fff',
            }}
        >
            Y
        </Box>
    </Box>
)

// Orange ruled bar with the wordmark, then a measurement ruler: a major
// tick every 80px, minor every 8px.
export const BrandHeader = ({ children }: { children?: ReactNode }) => (
    <>
        <Box
            component="header"
            display="flex"
            alignItems="center"
            justifyContent="space-between"
            gap={2}
            padding="0 20px"
            height={64}
            flexShrink={0}
            bgcolor={HEX_COLORS.RED_ORANGE}
            borderBottom={`3px solid ${ink}`}
        >
            <Wordmark />
            {children}
        </Box>
        <Box
            aria-hidden
            height={14}
            flexShrink={0}
            borderBottom={`1px solid ${ink}`}
            sx={{
                background: `repeating-linear-gradient(90deg, ${ink} 0 1px, transparent 1px 80px) bottom / 100% 14px no-repeat, repeating-linear-gradient(90deg, ${ink} 0 1px, transparent 1px 8px) bottom / 100% 6px no-repeat`,
            }}
        />
    </>
)
