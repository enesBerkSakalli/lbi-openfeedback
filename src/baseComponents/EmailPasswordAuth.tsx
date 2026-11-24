import { type FormEvent, useState } from 'react'
import Alert from '@mui/material/Alert'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import Paper from '@mui/material/Paper'
import TextField from '@mui/material/TextField'
import Typography from '@mui/material/Typography'
import { authProvider } from '../firebase.ts'
import {
    type EmailPasswordAuthMode,
    type EmailPasswordAuthResult,
    submitEmailPasswordAuth,
} from './submitEmailPasswordAuth.ts'

// Brutalist sign-in look: ink rules, hard offset shadows, mono spec labels
// and one azure action colour (white on it is 7.1:1).
export const LOGIN_STYLE = {
    ink: '#111111',
    azure: '#2346d8',
    sheet: '#ffffff',
    mono: 'ui-monospace, "SF Mono", "JetBrains Mono", Menlo, Consolas, monospace',
}
const { ink, azure, sheet, mono } = LOGIN_STYLE

export const monoLabel = {
    fontFamily: mono,
    fontSize: 12,
    fontWeight: 500,
    letterSpacing: '0.08em',
    textTransform: 'uppercase',
} as const

const focusRing = {
    '&.Mui-focusVisible': { outline: `3px solid ${azure}`, outlineOffset: 2 },
}

const fieldSx = {
    '& .MuiInputLabel-root': { ...monoLabel, color: ink },
    '& .MuiInputLabel-root.Mui-focused': { color: azure },
    '& .MuiOutlinedInput-root': { borderRadius: 0, backgroundColor: sheet },
    '& .MuiOutlinedInput-notchedOutline': { borderWidth: 2, borderColor: ink },
    '& .MuiOutlinedInput-root:hover .MuiOutlinedInput-notchedOutline': {
        borderColor: ink,
    },
    '& .MuiOutlinedInput-root.Mui-focused .MuiOutlinedInput-notchedOutline': {
        borderColor: azure,
    },
}

const linkButtonSx = {
    ...monoLabel,
    color: ink,
    borderRadius: 0,
    padding: '6px 4px',
    minWidth: 0,
    '&:hover': { backgroundColor: 'transparent', textDecoration: 'underline' },
    ...focusRing,
}

const alertSx = { borderRadius: 0, border: `2px solid ${ink}` }

const TEXTS: Record<
    EmailPasswordAuthMode,
    { step: string; title: string; submit: string }
> = {
    signIn: { step: '01', title: 'Sign in with email', submit: 'Sign in' },
    signUp: { step: '02', title: 'Create account', submit: 'Create account' },
    reset: { step: '03', title: 'Reset password', submit: 'Send reset email' },
}

// Sign in, create an account or reset the password with email and password.
// A successful sign-in is picked up by the page's onAuthStateChanged listener.
export const EmailPasswordAuth = () => {
    const [mode, setMode] = useState<EmailPasswordAuthMode>('signIn')
    const [pending, setPending] = useState(false)
    const [result, setResult] = useState<EmailPasswordAuthResult>({})

    const switchMode = (newMode: EmailPasswordAuthMode) => {
        setMode(newMode)
        setResult({})
    }

    const onSubmit = async (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault()
        // Read the fields on submit: a password manager can fill them without
        // firing the change events a controlled input relies on.
        const fields = new FormData(event.currentTarget)
        const field = (name: string) => String(fields.get(name) ?? '')
        setPending(true)
        setResult(
            await submitEmailPasswordAuth(authProvider, mode, {
                email: field('email'),
                password: field('password'),
                name: field('name'),
            })
        )
        setPending(false)
    }

    return (
        <Paper
            component="form"
            onSubmit={onSubmit}
            elevation={0}
            sx={{
                width: 400,
                maxWidth: '100%',
                boxSizing: 'border-box',
                textAlign: 'left',
                color: ink,
                backgroundColor: sheet,
                border: `2px solid ${ink}`,
                borderRadius: 0,
                boxShadow: `8px 8px 0 ${ink}`,
            }}
        >
            <Box
                display="flex"
                justifyContent="space-between"
                padding="10px 20px"
                borderBottom={`2px solid ${ink}`}
                sx={monoLabel}
            >
                <span>Step {TEXTS[mode].step} / 03</span>
                <span>Admin access</span>
            </Box>
            <Box
                padding="20px 20px 24px"
                display="flex"
                flexDirection="column"
                gap={2.5}
            >
                <Typography
                    component="h1"
                    sx={{
                        fontSize: 32,
                        fontWeight: 700,
                        lineHeight: 1.05,
                        letterSpacing: '-0.02em',
                        textTransform: 'uppercase',
                    }}
                >
                    {TEXTS[mode].title}
                </Typography>
                <TextField
                    label="Email"
                    type="email"
                    name="email"
                    autoComplete="username"
                    required
                    fullWidth
                    sx={fieldSx}
                />
                {mode === 'signUp' && (
                    <TextField
                        label="First & last name"
                        name="name"
                        autoComplete="name"
                        required
                        fullWidth
                        sx={fieldSx}
                    />
                )}
                {mode !== 'reset' && (
                    <TextField
                        label="Password"
                        type="password"
                        name="password"
                        autoComplete={
                            mode === 'signUp'
                                ? 'new-password'
                                : 'current-password'
                        }
                        required
                        fullWidth
                        sx={fieldSx}
                    />
                )}
                {result.error && (
                    <Alert severity="error" sx={alertSx}>
                        {result.error}
                    </Alert>
                )}
                {result.info && (
                    <Alert severity="info" sx={alertSx}>
                        {result.info}
                    </Alert>
                )}
                <Button
                    type="submit"
                    variant="contained"
                    disabled={pending}
                    disableElevation
                    sx={{
                        ...monoLabel,
                        fontSize: 14,
                        fontWeight: 700,
                        padding: '12px 16px',
                        borderRadius: 0,
                        color: '#fff',
                        backgroundColor: azure,
                        border: `2px solid ${ink}`,
                        boxShadow: `4px 4px 0 ${ink}`,
                        transition:
                            'transform 120ms ease-out, box-shadow 120ms ease-out',
                        '&:hover': {
                            backgroundColor: azure,
                            boxShadow: `6px 6px 0 ${ink}`,
                            transform: 'translate(-2px, -2px)',
                        },
                        '&:active': {
                            boxShadow: `1px 1px 0 ${ink}`,
                            transform: 'translate(3px, 3px)',
                        },
                        '&.Mui-disabled': {
                            color: ink,
                            backgroundColor: '#d9d9d6',
                            boxShadow: 'none',
                        },
                        ...focusRing,
                    }}
                >
                    {TEXTS[mode].submit}
                </Button>
                <Box
                    display="flex"
                    justifyContent="space-between"
                    borderTop={`1px solid ${ink}`}
                    paddingTop={1.5}
                >
                    {mode === 'signIn' ? (
                        <>
                            <Button
                                onClick={() => switchMode('signUp')}
                                sx={linkButtonSx}
                            >
                                Create account
                            </Button>
                            <Button
                                onClick={() => switchMode('reset')}
                                sx={linkButtonSx}
                            >
                                Forgot password?
                            </Button>
                        </>
                    ) : (
                        <Button
                            onClick={() => switchMode('signIn')}
                            sx={linkButtonSx}
                        >
                            Back to sign in
                        </Button>
                    )}
                </Box>
            </Box>
        </Paper>
    )
}
