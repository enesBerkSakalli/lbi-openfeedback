import { useTranslation } from 'react-i18next'
import { Box, useTheme } from '@mui/material'

export const Footer = () => {
    const { t } = useTranslation()
    const theme = useTheme()

    return (
        <Box
            display="flex"
            alignItems="top"
            justifyContent="center"
            padding={1}
            marginTop={2}
            flexWrap="wrap"
            gap={2}
            color={theme.palette.textDimmed}
            component="footer"
        >
            <Box display="flex" flexDirection="row">
                <span style={{ marginRight: 6, marginTop: -2 }}>
                    {t('footer.madeBy')}
                </span>
                <a
                    href="https://github.com/HugoGresse/open-feedback"
                    target="_blank"
                    rel="noopener noreferrer"
                >
                    <img
                        height="25"
                        src="/static/logos/openfeedback-black-orange.svg"
                        alt="open feedback"
                    />
                </a>
            </Box>
        </Box>
    )
}
