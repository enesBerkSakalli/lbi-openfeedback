import { memo, type ReactNode, useEffect, useState } from 'react'
import type firebase from 'firebase/compat/app'
import { authProvider, isUsingEmulators } from '../../firebase.ts'
import { useAppDispatch, useAppSelector } from '../../store'
import { getLoginErrorSelector, isLoggedSelector } from './authSelectors'
import { didSignIn, signOut } from './authActions'
import { LoaderMatchParent } from '../../baseComponents/customComponent/LoaderMatchParent.tsx'
import Box from '@mui/material/Box'
import { BrandHeader } from '../../baseComponents/BrandHeader.tsx'
import { EmulatorLogin, setLoginCookie } from './EmulatorLogin.tsx'
import {
    EmailPasswordAuth,
    LOGIN_STYLE,
    monoLabel,
} from '../../baseComponents/EmailPasswordAuth.tsx'

const { ink, azure } = LOGIN_STYLE

interface LoginProps {
    children?: ReactNode
}

export const Login = memo(({ children }: LoginProps) => {
    const dispatch = useAppDispatch()
    const isLoggedIn = useAppSelector(isLoggedSelector)
    const loginError = useAppSelector(getLoginErrorSelector)
    const [tempUser, setTempUser] = useState<firebase.User | null>(
        authProvider.currentUser
    )
    const [loaderDisplayed, setLoaderDisplay] = useState(true)

    const setTempUserIfNeeded = (user: firebase.User | null) => {
        if (JSON.stringify(user) !== JSON.stringify(tempUser)) {
            setTempUser(user)
        }
    }

    useEffect(() => {
        const unregisterAuthObserver = authProvider.onAuthStateChanged(
            (user) => {
                // The saved session is known now: show the form or the app.
                setLoaderDisplay(false)
                if (isUsingEmulators) {
                    setLoginCookie(!!user)
                }
                if (user) {
                    if (user.isAnonymous) {
                        setTempUserIfNeeded(null)
                        dispatch(signOut())
                    } else {
                        setTempUserIfNeeded(user)
                        dispatch(didSignIn(user))
                    }
                    if (!user.emailVerified && !user.phoneNumber) {
                        user.sendEmailVerification({
                            url: `https://${import.meta.env.VITE_AUTH_DOMAIN}/admin/`,
                        }).then(() => {
                            // Email sent.
                        })
                    }
                } else if (tempUser) {
                    // Checking tempUser prevent signOut if the is no user to signOut currently.
                    // It may happen with the listener is first attached, no user is logged in, and this method is called.
                    // It also prevent the inviteId to be remove from the url.
                    dispatch(signOut())
                }
            }
        )
        return () => {
            unregisterAuthObserver()
        }
    }, [dispatch, tempUser])

    if (isLoggedIn) {
        return children
    }

    return (
        <Box
            minHeight="100vh"
            bgcolor="#e6e6e2"
            color={ink}
            display="flex"
            flexDirection="column"
        >
            <BrandHeader>
                <Box
                    component="span"
                    sx={{
                        ...monoLabel,
                        fontWeight: 700,
                        padding: '6px 10px',
                        border: `2px solid ${ink}`,
                        backgroundColor: '#fff',
                        boxShadow: `3px 3px 0 ${ink}`,
                    }}
                >
                    Admin
                </Box>
            </BrandHeader>
            <Box
                display="flex"
                flexDirection="column"
                justifyContent="center"
                alignItems="center"
                flexGrow="1"
                gap={3}
                padding="32px 16px 48px"
            >
                <Box
                    sx={{
                        ...monoLabel,
                        padding: '6px 14px',
                        border: `1px solid ${azure}`,
                        color: azure,
                    }}
                >
                    FeedbackY — Admin console
                </Box>
                {isUsingEmulators && <EmulatorLogin />}
                {loaderDisplayed && (
                    <LoaderMatchParent style={{ color: ink }} height={40} />
                )}
                {!loaderDisplayed && <EmailPasswordAuth />}
                {loginError && (
                    <Box
                        role="alert"
                        sx={{
                            ...monoLabel,
                            padding: '8px 12px',
                            border: `2px solid ${ink}`,
                            backgroundColor: '#fff',
                        }}
                    >
                        {loginError}
                    </Box>
                )}
            </Box>
        </Box>
    )
})

Login.displayName = 'Login'
