import { memo, type ReactNode, useEffect, useState } from 'react'
import logoWhite from '../assets/logo-openfeedback-white.png'
import { authProvider } from '../firebase'
import { LoaderMatchParent } from '../baseComponents/customComponent/LoaderMatchParent.tsx'
import Box from '@mui/material/Box'
import { EmailPasswordAuth } from '../baseComponents/EmailPasswordAuth.tsx'
import { Button } from '@mui/material'
import { useIsSuperAdmin } from './hooks/useIsSuperAdmin.ts'

export const LoginSuperAdmin = memo(({ children }: { children: ReactNode }) => {
    const [loggedInUser, setUser] = useState<{ uid: string } | null>(
        authProvider.currentUser
    )
    const [loaderDisplayed, setLoaderDisplay] = useState(true)
    const isSuperAdmin = useIsSuperAdmin(loggedInUser)

    const setUserIfNeeded = (user: { uid: string } | null) => {
        if (JSON.stringify(user) !== JSON.stringify(loggedInUser)) {
            setUser(user)
        }
    }

    const signOut = () => {
        authProvider.signOut().then(() => {
            setUser(null)
        })
    }

    useEffect(() => {
        const unregisterAuthObserver = authProvider.onAuthStateChanged(
            (user) => {
                // The saved session is known now: show the form or the app.
                setLoaderDisplay(false)
                if (user) {
                    if (user.isAnonymous) {
                        setUserIfNeeded(null)
                    } else {
                        setUserIfNeeded(user)
                    }
                } else if (loggedInUser) {
                    setUserIfNeeded(null)
                }
            }
        )
        return () => {
            unregisterAuthObserver()
        }
    }, [loggedInUser])

    if (loggedInUser && !isSuperAdmin) {
        return (
            <Box color={'white'}>
                <p>NOT A SUPER ADMIN, YOU CAN&apos;T SEE THIS OUST!</p>
                <Button variant="contained" onClick={() => signOut()}>
                    LOGOUT
                </Button>
            </Box>
        )
    }

    if (loggedInUser) {
        return (
            <>
                <Button variant="contained" onClick={() => signOut()}>
                    LOGOUT
                </Button>
                {children}
            </>
        )
    }

    return (
        <Box height="100vh" padding={1} display="flex" boxSizing="border-box">
            <Box
                display="flex"
                flexDirection="column"
                justifyContent="center"
                alignItems="center"
                flexGrow="1"
                textAlign="center"
            >
                <img
                    height="40"
                    src={logoWhite}
                    alt="open feedback"
                    style={{ marginBottom: '40px' }}
                />
                {loaderDisplayed && (
                    <LoaderMatchParent style={{ color: 'white' }} height={40} />
                )}
                {!loaderDisplayed && <EmailPasswordAuth />}
            </Box>
        </Box>
    )
})
