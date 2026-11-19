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

const TEXTS: Record<EmailPasswordAuthMode, { title: string; submit: string }> =
    {
        signIn: { title: 'Sign in with email', submit: 'Sign in' },
        signUp: { title: 'Create account', submit: 'Create account' },
        reset: { title: 'Reset password', submit: 'Send reset email' },
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
            sx={{
                width: 360,
                maxWidth: '100%',
                padding: 3,
                boxSizing: 'border-box',
                textAlign: 'left',
                display: 'flex',
                flexDirection: 'column',
                gap: 2,
            }}
        >
            <Typography component="h1" variant="h6">
                {TEXTS[mode].title}
            </Typography>
            <TextField
                label="Email"
                type="email"
                name="email"
                autoComplete="username"
                variant="standard"
                required
                fullWidth
            />
            {mode === 'signUp' && (
                <TextField
                    label="First & last name"
                    name="name"
                    autoComplete="name"
                    variant="standard"
                    required
                    fullWidth
                />
            )}
            {mode !== 'reset' && (
                <TextField
                    label="Password"
                    type="password"
                    name="password"
                    autoComplete={
                        mode === 'signUp' ? 'new-password' : 'current-password'
                    }
                    variant="standard"
                    required
                    fullWidth
                />
            )}
            {result.error && <Alert severity="error">{result.error}</Alert>}
            {result.info && <Alert severity="info">{result.info}</Alert>}
            <Button type="submit" variant="contained" disabled={pending}>
                {TEXTS[mode].submit}
            </Button>
            <Box display="flex" justifyContent="space-between">
                {mode === 'signIn' ? (
                    <>
                        <Button onClick={() => switchMode('signUp')}>
                            Create account
                        </Button>
                        <Button onClick={() => switchMode('reset')}>
                            Forgot password?
                        </Button>
                    </>
                ) : (
                    <Button onClick={() => switchMode('signIn')}>
                        Back to sign in
                    </Button>
                )}
            </Box>
        </Paper>
    )
}
