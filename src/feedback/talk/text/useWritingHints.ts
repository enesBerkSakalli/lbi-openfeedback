import { useEffect, useRef, useState } from 'react'
import type { Lint, Suggestion, WorkerLinter } from 'harper.js'

/** One grammar, spelling or style hint from Harper on the current comment. */
export interface WritingHint {
    lint: Lint
    message: string
    /** The text the hint is about. */
    problem: string
    suggestions: Suggestion[]
}

/** `unavailable`: skipped (data saver, slow network) or failed to load. */
export type WritingHelpStatus = 'idle' | 'loading' | 'ready' | 'unavailable'

// Few hints, shown after a real pause: they must not crowd the writing.
const MAX_HINTS = 2
const MAX_SUGGESTIONS = 3
const LINT_DELAY_MS = 1500

interface NetworkInformationLike {
    saveData?: boolean
    effectiveType?: string
}

// The binary is too heavy for data-saver mode or 2G: native spellcheck only.
const isConstrainedNetwork = (): boolean => {
    const connection = (
        navigator as Navigator & { connection?: NetworkInformationLike }
    ).connection
    return (
        !!connection?.saveData ||
        ['slow-2g', '2g'].includes(connection?.effectiveType ?? '')
    )
}

let linterPromise: Promise<WorkerLinter> | null = null

// Loaded on first use only: Harper's WebAssembly binary is about 19 MB, so it
// is fetched when someone starts writing, never on page load. Harper runs
// on-device (in a web worker): the comment text never leaves the browser.
const getLinter = (): Promise<WorkerLinter> => {
    if (!linterPromise) {
        linterPromise = Promise.all([
            import('harper.js'),
            import('harper.js/binary'),
        ]).then(async ([{ WorkerLinter }, { binary }]) => {
            const linter = new WorkerLinter({ binary })
            await linter.setup()
            return linter
        })
        linterPromise.catch(() => {
            linterPromise = null
        })
    }
    return linterPromise
}

/**
 * Harper writing hints for `text`, linted a moment after the user stops
 * typing. Writing help is optional: if Harper cannot load, there are no hints.
 */
export const useWritingHints = (text: string, enabled: boolean) => {
    const [linter, setLinter] = useState<WorkerLinter | null>(null)
    const [hints, setHints] = useState<WritingHint[]>([])
    const [status, setStatus] = useState<WritingHelpStatus>('idle')
    // Not state: a status change must not re-run (and cancel) the loading effect.
    const startedRef = useRef(false)

    useEffect(() => {
        if (!enabled || startedRef.current) {
            return
        }
        startedRef.current = true
        if (isConstrainedNetwork()) {
            setStatus('unavailable')
            return
        }
        let cancelled = false
        setStatus('loading')
        getLinter()
            .then((loaded) => {
                if (!cancelled) {
                    setLinter(loaded)
                    setStatus('ready')
                }
            })
            .catch(() => {
                if (!cancelled) {
                    setStatus('unavailable')
                }
            })
        return () => {
            cancelled = true
            // Lets a re-mounted effect (React strict mode) start again; the
            // linter promise is shared, so nothing is downloaded twice.
            startedRef.current = false
        }
    }, [enabled])

    useEffect(() => {
        if (!linter || !text.trim()) {
            setHints([])
            return
        }
        let cancelled = false
        const timer = setTimeout(() => {
            // Harper only knows English: no hints on comments in other
            // languages (e.g. German), instead of flagging every word.
            linter
                .isLikelyEnglish(text)
                .then((isEnglish) =>
                    isEnglish
                        ? linter.lint(text, { language: 'plaintext' })
                        : []
                )
                .then((lints) => {
                    if (cancelled) {
                        return
                    }
                    setHints(
                        lints.slice(0, MAX_HINTS).map((lint) => ({
                            lint,
                            message: lint.message(),
                            problem: lint.get_problem_text(),
                            suggestions: lint
                                .suggestions()
                                .slice(0, MAX_SUGGESTIONS),
                        }))
                    )
                })
                .catch(() => {
                    if (!cancelled) {
                        setHints([])
                    }
                })
        }, LINT_DELAY_MS)
        return () => {
            cancelled = true
            clearTimeout(timer)
        }
    }, [linter, text])

    const applyHint = (
        hint: WritingHint,
        suggestion: Suggestion
    ): Promise<string> =>
        linter
            ? linter.applySuggestion(text, hint.lint, suggestion)
            : Promise.resolve(text)

    return { hints, applyHint, status }
}
