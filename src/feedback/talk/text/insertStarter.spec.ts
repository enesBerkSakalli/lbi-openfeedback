import { describe, expect, it } from 'vitest'
import { insertStarter } from './insertStarter'

describe('insertStarter', () => {
    it('starts an empty comment with the starter, without the ellipsis', () => {
        expect(insertStarter('', 'I liked…')).toBe('I liked ')
        expect(insertStarter('  ', 'I liked...')).toBe('I liked ')
    })

    it('keeps a colon starter as is', () => {
        expect(insertStarter('', 'A question:')).toBe('A question: ')
    })

    it('adds the starter on a new line after existing text', () => {
        expect(insertStarter('Great talk.', 'An idea:')).toBe(
            'Great talk.\nAn idea: '
        )
        expect(insertStarter('Great talk.\n', 'An idea:')).toBe(
            'Great talk.\nAn idea: '
        )
    })
})
