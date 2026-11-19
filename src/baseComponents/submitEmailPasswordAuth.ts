export type EmailPasswordAuthMode = 'signIn' | 'signUp' | 'reset'

// The part of firebase.auth.Auth the email and password form needs.
export interface EmailPasswordAuthApi {
    signInWithEmailAndPassword(
        email: string,
        password: string
    ): Promise<unknown>
    createUserWithEmailAndPassword(
        email: string,
        password: string
    ): Promise<{
        user: {
            updateProfile(profile: { displayName: string }): Promise<void>
        } | null
    }>
    sendPasswordResetEmail(email: string): Promise<void>
}

export interface EmailPasswordAuthResult {
    error?: string
    info?: string
}

const WRONG_CREDENTIALS = 'Wrong email or password.'
const ERROR_MESSAGES: Record<string, string> = {
    'auth/invalid-credential': WRONG_CREDENTIALS,
    'auth/wrong-password': WRONG_CREDENTIALS,
    'auth/user-not-found': WRONG_CREDENTIALS,
    'auth/email-already-in-use':
        'An account with this email already exists. Sign in instead.',
    'auth/weak-password': 'The password must be at least 6 characters long.',
}

// Sends the credentials straight to Firebase Auth. With email enumeration
// protection Firebase no longer says whether an email has an account, so the
// form must not ask before signing in (FirebaseUI did, and offered every
// existing account "Create account").
export const submitEmailPasswordAuth = async (
    auth: EmailPasswordAuthApi,
    mode: EmailPasswordAuthMode,
    values: { email: string; password: string; name?: string }
): Promise<EmailPasswordAuthResult> => {
    const { email, password, name = '' } = values
    try {
        if (mode === 'reset') {
            await auth.sendPasswordResetEmail(email)
            return {
                info: `If ${email} has an account, a password reset email is on its way.`,
            }
        }
        if (mode === 'signUp') {
            const { user } = await auth.createUserWithEmailAndPassword(
                email,
                password
            )
            await user?.updateProfile({ displayName: name })
            return {}
        }
        await auth.signInWithEmailAndPassword(email, password)
        return {}
    } catch (caughtError) {
        // Firebase Auth rejects with a firebase.auth.Error
        const { code, message } = caughtError as {
            code: string
            message: string
        }
        return { error: ERROR_MESSAGES[code] ?? message }
    }
}
