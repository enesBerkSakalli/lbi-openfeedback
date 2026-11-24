import ErrorIcon from '@mui/icons-material/Error'
import { Button } from '@mui/material'
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import { makeStyles } from '@mui/styles'
import type { ReactNode } from 'react'

const useStyles = makeStyles(() => ({
    root: {
        maxWidth: '100%',
        textAlign: 'center',
        display: 'flex',
        alignItems: 'center',
        height: '100vh',
        justifyContent: 'center',
        flexDirection: 'column',
    },
    errorDetail: {
        fontFamily: 'monospace',
    },
    button: {
        marginTop: '30px',
    },
}))

interface ErrorProps {
    error?: ReactNode
    errorDetail?: ReactNode
}

export const Error = ({ error, errorDetail }: ErrorProps) => {
    const classes = useStyles()
    // Reports go to this deployment's admin; no address, no Report button.
    const adminEmail = import.meta.env.VITE_ADMIN_EMAIL
    const reportBody = `@error:${JSON.stringify(error)}@detail:${JSON.stringify(
        errorDetail
    )}@url:${JSON.stringify(window.location.href)}`
    const reportString = `mailto:${adminEmail}?subject=FeedbackY%20Error&body=${encodeURIComponent(reportBody)}`

    return (
        <Box
            maxWidth="100%"
            textAlign="center"
            display="flex"
            alignItems="center"
            height="100vh"
            justifyContent="center"
            flexDirection="column"
        >
            <ErrorIcon />
            <p>
                <b>{error}</b>
            </p>
            <p>Error:</p>
            <Typography sx={{ fontFamily: 'monospace' }}>
                {errorDetail}
            </Typography>
            <Button
                variant="contained"
                color="primary"
                sx={{ marginTop: '30px' }}
                onClick={() => window.location.reload()}
            >
                Reload the page
            </Button>
            {adminEmail && (
                <Button
                    variant="contained"
                    className={classes.button}
                    href={reportString}
                >
                    Report
                </Button>
            )}
        </Box>
    )
}
