import { useEffect, useState } from 'react'
import type { Lint, Suggestion, WorkerLinter } from 'harper.js'

/** One grammar, spelling or style hint from Harper on the current comment. */
export interface WritingHint {
    lint: Lint
    message: string
    /** The text the hint is about. */
    problem: string
    suggestions: Suggestion[]
}

const MAX_HINTS = 5
const MAX_SUGGESTIONS = 3
const LINT_DELAY_MS = 600

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

    useEffect(() => {
        if (!enabled || linter) {
            return
        }
        let cancelled = false
        getLinter()
            .then((loaded) => {
                if (!cancelled) {
                    setLinter(loaded)
                }
            })
            .catch(() => undefined)
        return () => {
            cancelled = true
        }
    }, [enabled, linter])

    useEffect(() => {
        if (!linter || !text.trim()) {
            setHints([])
            return
        }
        let cancelled = false
        const timer = setTimeout(() => {
            linter
                .lint(text, { language: 'plaintext' })
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

    return { hints, applyHint }
}
