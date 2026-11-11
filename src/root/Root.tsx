import { useEffect } from 'react'
import { I18nextProvider, useTranslation } from 'react-i18next'
import { ThemeProvider } from '@mui/material/styles'
import { CssBaseline, useMediaQuery } from '@mui/material'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import Link from '@mui/material/Link'
import Typography from '@mui/material/Typography'
import { setFavicon } from '../utils/dom'
import { i18n } from './translations/i18n'
import { feedbackThemes } from '../feedback/feedbackTheme'

// The starting page: what this site is and where to go, nothing to sell.
const StartPage = () => {
    const { t } = useTranslation()
    const adminEmail = import.meta.env.VITE_ADMIN_EMAIL

    return (
        <Box
            component="main"
            sx={{
                maxWidth: 560,
                minHeight: '100vh',
                margin: '0 auto',
                padding: 3,
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                gap: 2,
            }}
        >
            <Typography variant="h1">{t('start.title')}</Typography>
            <Typography>{t('start.intro')}</Typography>
            <Typography>{t('start.howTo')}</Typography>
            <Box marginTop={2}>
                <Button
                    variant="outlined"
                    href="/admin/"
                    sx={{ minHeight: 48 }}
                >
                    {t('start.login')}
                </Button>
            </Box>
            {adminEmail && (
                <Typography variant="body2" color="textSecondary">
                    {t('start.questions')}{' '}
                    <Link href={`mailto:${adminEmail}`}>{adminEmail}</Link>
                </Typography>
            )}
        </Box>
    )
}

export const Root = () => {
    const prefersDarkMode = useMediaQuery('(prefers-color-scheme: dark)')

    useEffect(() => {
        setFavicon('/favicon-root.ico')
        document.title = i18n.t('start.title')
    }, [])

    return (
        <I18nextProvider i18n={i18n}>
            <ThemeProvider
                theme={feedbackThemes[prefersDarkMode ? 'dark' : 'light']}
            >
                <CssBaseline />
                <StartPage />
            </ThemeProvider>
        </I18nextProvider>
    )
}
