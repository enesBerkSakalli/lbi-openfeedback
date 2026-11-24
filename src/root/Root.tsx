import { useEffect } from 'react'
import { I18nextProvider, useTranslation } from 'react-i18next'
import { ThemeProvider } from '@mui/material/styles'
import { CssBaseline } from '@mui/material'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import Link from '@mui/material/Link'
import Typography from '@mui/material/Typography'
import { setFavicon } from '../utils/dom'
import { i18n } from './translations/i18n'
import { feedbackTheme } from '../feedback/feedbackTheme'
import { HEX_COLORS } from '../constants/colors'
import { BrandHeader } from '../baseComponents/BrandHeader.tsx'
import { LOGIN_STYLE, monoLabel } from '../baseComponents/EmailPasswordAuth.tsx'
import { type FindingKind, SAMPLE_REPORT } from './sampleReport'

const { ink, azure, sheet } = LOGIN_STYLE
const rule = `2px solid ${ink}`

const KIND_COLORS: Record<FindingKind, { bg: string; fg: string }> = {
    Error: { bg: HEX_COLORS.RED_ORANGE, fg: ink },
    'Should fix': { bg: azure, fg: '#fff' },
    Style: { bg: '#d4f27a', fg: ink },
}

const focusRing = {
    '&.Mui-focusVisible, &:focus-visible': {
        outline: `3px solid ${azure}`,
        outlineOffset: 2,
    },
}

const ctaSx = {
    ...monoLabel,
    fontSize: 14,
    fontWeight: 700,
    minHeight: 48,
    padding: '12px 20px',
    borderRadius: 0,
    border: rule,
    boxShadow: `4px 4px 0 ${ink}`,
    transition: 'transform 120ms ease-out, box-shadow 120ms ease-out',
    '&:hover': {
        boxShadow: `6px 6px 0 ${ink}`,
        transform: 'translate(-2px, -2px)',
    },
    ...focusRing,
}

const SectionLabel = ({ children }: { children: string }) => (
    <Typography
        component="h2"
        sx={{
            ...monoLabel,
            fontWeight: 700,
            padding: '10px 16px',
            borderBottom: rule,
        }}
    >
        {children}
    </Typography>
)

const SampleReport = () => {
    const { t } = useTranslation()
    const { title, scope, meta, counts, findings } = SAMPLE_REPORT

    return (
        <Box
            component="section"
            id="sample"
            aria-labelledby="sample-title"
            sx={{
                backgroundColor: sheet,
                border: rule,
                boxShadow: `8px 8px 0 ${ink}`,
                scrollMarginTop: 24,
            }}
        >
            <Box
                display="flex"
                flexWrap="wrap"
                justifyContent="space-between"
                gap={1}
                padding="10px 16px"
                bgcolor={ink}
                color="#fff"
                sx={monoLabel}
            >
                <span id="sample-title">
                    {t('start.sampleTitle')} — {title}
                </span>
                <span>{scope}</span>
            </Box>
            <Box
                component="ul"
                display="flex"
                flexWrap="wrap"
                margin={0}
                padding="8px 16px"
                borderBottom={rule}
                sx={{
                    ...monoLabel,
                    textTransform: 'none',
                    listStyle: 'none',
                    columnGap: 3,
                }}
            >
                {meta.map((item) => (
                    <li key={item}>{item}</li>
                ))}
            </Box>
            <Box
                component="dl"
                margin={0}
                display="grid"
                gridTemplateColumns={{
                    xs: 'repeat(2, 1fr)',
                    sm: 'repeat(5, 1fr)',
                }}
                borderBottom={rule}
                sx={{
                    // Cells share 1px ink rules, like a spec sheet
                    gap: '2px',
                    backgroundColor: ink,
                }}
            >
                {counts.map(({ label, value }) => (
                    <Box
                        key={label}
                        bgcolor={sheet}
                        padding="12px 16px"
                        display="flex"
                        flexDirection="column-reverse"
                        justifyContent="flex-end"
                        gap={1}
                        // Two columns on phones: the odd last cell fills its row
                        sx={{
                            '&:last-of-type:nth-of-type(odd)': {
                                gridColumn: { xs: 'span 2', sm: 'auto' },
                            },
                        }}
                    >
                        <Box component="dt" sx={monoLabel}>
                            {label}
                        </Box>
                        <Box
                            component="dd"
                            margin={0}
                            sx={{
                                fontSize: { xs: 40, md: 52 },
                                fontWeight: 700,
                                lineHeight: 1,
                                letterSpacing: '-0.03em',
                            }}
                        >
                            {value}
                        </Box>
                    </Box>
                ))}
            </Box>
            <SectionLabel>{t('start.findingsTitle')}</SectionLabel>
            <Box
                component="ol"
                margin={0}
                padding={0}
                sx={{ listStyle: 'none' }}
            >
                {findings.map(({ kind, where, text }) => (
                    <Box
                        component="li"
                        key={where}
                        display="grid"
                        gridTemplateColumns={{ xs: '1fr', sm: '200px 1fr' }}
                        gap={{ xs: 1, sm: 2 }}
                        padding="14px 16px"
                        sx={{ '& + &': { borderTop: `1px solid ${ink}` } }}
                    >
                        <Box
                            display="flex"
                            flexDirection={{ xs: 'row', sm: 'column' }}
                            alignItems="flex-start"
                            gap={1}
                        >
                            <Box
                                component="span"
                                sx={{
                                    ...monoLabel,
                                    fontWeight: 700,
                                    padding: '3px 8px',
                                    border: rule,
                                    backgroundColor: KIND_COLORS[kind].bg,
                                    color: KIND_COLORS[kind].fg,
                                }}
                            >
                                {kind}
                            </Box>
                            <Box
                                component="code"
                                sx={{ ...monoLabel, textTransform: 'none' }}
                            >
                                {where}
                            </Box>
                        </Box>
                        <Typography>{text}</Typography>
                    </Box>
                ))}
            </Box>
        </Box>
    )
}

// The starting page: what this site is and where to go, nothing to sell.
const StartPage = () => {
    const { t } = useTranslation()
    const adminEmail = import.meta.env.VITE_ADMIN_EMAIL
    const steps = [t('start.step1'), t('start.step2'), t('start.step3')]

    return (
        <Box minHeight="100vh" bgcolor="#e6e6e2" color={ink}>
            <BrandHeader>
                <Button
                    href="/admin/"
                    sx={{
                        ...monoLabel,
                        fontWeight: 700,
                        color: ink,
                        padding: '6px 10px',
                        borderRadius: 0,
                        border: rule,
                        backgroundColor: sheet,
                        boxShadow: `3px 3px 0 ${ink}`,
                        '&:hover': { backgroundColor: sheet },
                        ...focusRing,
                    }}
                >
                    {t('start.login')}
                </Button>
            </BrandHeader>
            <Box
                component="main"
                maxWidth={1080}
                margin="0 auto"
                padding={{ xs: '32px 16px 56px', md: '56px 24px 80px' }}
                display="flex"
                flexDirection="column"
                gap={{ xs: 5, md: 7 }}
            >
                <Box
                    display="grid"
                    gridTemplateColumns={{ xs: '1fr', md: '7fr 5fr' }}
                    gap={{ xs: 4, md: 5 }}
                    alignItems="start"
                >
                    <Box display="flex" flexDirection="column" gap={3}>
                        <Box
                            sx={{
                                ...monoLabel,
                                alignSelf: 'flex-start',
                                padding: '6px 12px',
                                border: `1px solid ${azure}`,
                                color: azure,
                            }}
                        >
                            {t('start.kicker')}
                        </Box>
                        <Typography
                            variant="h1"
                            sx={{
                                fontSize: { xs: 56, sm: 80, md: 104 },
                                fontWeight: 700,
                                lineHeight: 0.9,
                                letterSpacing: '-0.04em',
                                textTransform: 'uppercase',
                            }}
                        >
                            {t('start.title')}
                        </Typography>
                        <Typography sx={{ fontSize: 20, maxWidth: 560 }}>
                            {t('start.intro')}
                        </Typography>
                        <Typography sx={{ maxWidth: 560 }}>
                            {t('start.howTo')}
                        </Typography>
                        <Box display="flex" flexWrap="wrap" gap={2}>
                            <Button
                                href="/admin/"
                                sx={{
                                    ...ctaSx,
                                    color: '#fff',
                                    backgroundColor: azure,
                                    '&:hover': {
                                        ...ctaSx['&:hover'],
                                        backgroundColor: azure,
                                    },
                                }}
                            >
                                {t('start.login')}
                            </Button>
                            <Button
                                href="#sample"
                                sx={{
                                    ...ctaSx,
                                    color: ink,
                                    backgroundColor: sheet,
                                    '&:hover': {
                                        ...ctaSx['&:hover'],
                                        backgroundColor: sheet,
                                    },
                                }}
                            >
                                {t('start.sampleLink')}
                            </Button>
                        </Box>
                    </Box>
                    <Box
                        component="section"
                        aria-labelledby="steps-title"
                        bgcolor={sheet}
                        border={rule}
                    >
                        <Typography
                            id="steps-title"
                            component="h2"
                            sx={{
                                ...monoLabel,
                                fontWeight: 700,
                                padding: '10px 16px',
                                borderBottom: rule,
                            }}
                        >
                            {t('start.stepsTitle')}
                        </Typography>
                        <Box
                            component="ol"
                            margin={0}
                            padding={0}
                            sx={{ listStyle: 'none' }}
                        >
                            {steps.map((step, index) => (
                                <Box
                                    component="li"
                                    key={step}
                                    display="grid"
                                    gridTemplateColumns="64px 1fr"
                                    sx={{
                                        '& + &': {
                                            borderTop: `1px solid ${ink}`,
                                        },
                                    }}
                                >
                                    <Box
                                        aria-hidden
                                        borderRight={`1px solid ${ink}`}
                                        padding="14px 0"
                                        textAlign="center"
                                        sx={{
                                            fontSize: 28,
                                            fontWeight: 700,
                                            lineHeight: 1,
                                            color: azure,
                                        }}
                                    >
                                        {String(index + 1).padStart(2, '0')}
                                    </Box>
                                    <Typography padding="14px 16px">
                                        {step}
                                    </Typography>
                                </Box>
                            ))}
                        </Box>
                    </Box>
                </Box>
                <SampleReport />
                {adminEmail && (
                    <Typography
                        component="footer"
                        sx={{ ...monoLabel, textTransform: 'none' }}
                    >
                        {t('start.questions')}{' '}
                        <Link href={`mailto:${adminEmail}`} color="inherit">
                            {adminEmail}
                        </Link>
                    </Typography>
                )}
            </Box>
        </Box>
    )
}

export const Root = () => {
    useEffect(() => {
        setFavicon('/favicon-root.ico')
        document.title = i18n.t('start.title')
    }, [])

    return (
        <I18nextProvider i18n={i18n}>
            <ThemeProvider theme={feedbackTheme}>
                <CssBaseline />
                <StartPage />
            </ThemeProvider>
        </I18nextProvider>
    )
}
