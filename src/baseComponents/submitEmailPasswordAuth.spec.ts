import { describe, expect, test } from 'vitest'
import { submitEmailPasswordAuth } from './submitEmailPasswordAuth'

const EMAIL = 'hugo@example.com'
const PASSWORD = 'azerty'

// Firebase Auth with email enumeration protection: it never tells whether an
// email has an account, it only accepts or rejects credentials.
const fakeAuth = (
    accounts: Record<string, { password: string; displayName?: string }> = {}
) => {
    const resetEmails: string[] = []
    const reject = (code: string, message = code) =>
        Promise.reject({ code, message })
    return {
        accounts,
        resetEmails,
        signInWithEmailAndPassword: (email: string, password: string) =>
            accounts[email]?.password === password
                ? Promise.resolve({})
                : reject('auth/invalid-credential'),
        createUserWithEmailAndPassword: (email: string, password: string) => {
            if (accounts[email]) {
                return reject('auth/email-already-in-use')
            }
            if (password.length < 6) {
                return reject('auth/weak-password')
            }
            const account: { password: string; displayName?: string } = {
                password,
            }
            accounts[email] = account
            return Promise.resolve({
                user: {
                    updateProfile: (profile: { displayName: string }) => {
                        account.displayName = profile.displayName
                        return Promise.resolve()
                    },
                },
            })
        },
        sendPasswordResetEmail: (email: string) => {
            if (!email.includes('@')) {
                return reject('auth/made-up', 'Message from Firebase')
            }
            resetEmails.push(email)
            return Promise.resolve()
        },
    }
}

describe('submitEmailPasswordAuth', () => {
    test('signs in an existing account with its email and password', async () => {
        const auth = fakeAuth({ [EMAIL]: { password: PASSWORD } })

        const result = await submitEmailPasswordAuth(auth, 'signIn', {
            email: EMAIL,
            password: PASSWORD,
        })

        expect(result).toEqual({})
    })

    test('reports a wrong password without saying whether the account exists', async () => {
        const auth = fakeAuth({ [EMAIL]: { password: PASSWORD } })

        const result = await submitEmailPasswordAuth(auth, 'signIn', {
            email: EMAIL,
            password: 'wrong-password',
        })

        expect(result).toEqual({ error: 'Wrong email or password.' })
    })

    test('creates an account with its display name', async () => {
        const auth = fakeAuth()

        const result = await submitEmailPasswordAuth(auth, 'signUp', {
            email: EMAIL,
            password: PASSWORD,
            name: 'Hugo Example',
        })

        expect(result).toEqual({})
        expect(auth.accounts[EMAIL]).toEqual({
            password: PASSWORD,
            displayName: 'Hugo Example',
        })
    })

    test('tells to sign in when the account to create already exists', async () => {
        const auth = fakeAuth({ [EMAIL]: { password: PASSWORD } })

        const result = await submitEmailPasswordAuth(auth, 'signUp', {
            email: EMAIL,
            password: 'another-password',
            name: 'Hugo Example',
        })

        expect(result).toEqual({
            error: 'An account with this email already exists. Sign in instead.',
        })
        expect(auth.accounts[EMAIL]).toEqual({ password: PASSWORD })
    })

    test('rejects a password that is too short for a new account', async () => {
        const result = await submitEmailPasswordAuth(fakeAuth(), 'signUp', {
            email: EMAIL,
            password: 'short',
            name: 'Hugo Example',
        })

        expect(result).toEqual({
            error: 'The password must be at least 6 characters long.',
        })
    })

    test('sends a password reset email', async () => {
        const auth = fakeAuth()

        const result = await submitEmailPasswordAuth(auth, 'reset', {
            email: EMAIL,
            password: '',
        })

        expect(auth.resetEmails).toEqual([EMAIL])
        expect(result).toEqual({
            info: `If ${EMAIL} has an account, a password reset email is on its way.`,
        })
    })

    test('shows the message from Firebase for an error it does not know', async () => {
        const result = await submitEmailPasswordAuth(fakeAuth(), 'reset', {
            email: 'not-an-email',
            password: '',
        })

        expect(result).toEqual({ error: 'Message from Firebase' })
    })
})
