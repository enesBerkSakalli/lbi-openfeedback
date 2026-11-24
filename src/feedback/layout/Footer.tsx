import { useTranslation } from 'react-i18next'
import { Box, useTheme } from '@mui/material'
import { Wordmark } from '../../baseComponents/BrandHeader.tsx'

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
            <Box display="flex" flexDirection="row" alignItems="center">
                <span style={{ marginRight: 8 }}>{t('footer.madeBy')}</span>
                <Wordmark size={16} color={theme.palette.ink} />
            </Box>
        </Box>
    )
}
