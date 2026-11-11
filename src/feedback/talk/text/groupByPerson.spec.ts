import { describe, expect, test } from 'vitest'
import { groupByPerson } from './groupByPerson'
import type { TextVoteResult } from '../core/getVoteResultSelectorSelector'

const comment = (
    id: string,
    userId: string,
    minute: number
): TextVoteResult => ({
    id,
    userId,
    text: id,
    createdAt: new Date(2026, 10, 12, 11, minute),
    updatedAt: new Date(2026, 10, 12, 11, minute),
})

describe('groupByPerson', () => {
    test('groups the comments of each person, newest activity first', () => {
        // Newest first, as the results selector sorts them
        const groups = groupByPerson([
            comment('b2', 'bob', 30),
            comment('a2', 'ann', 20),
            comment('b1', 'bob', 15),
            comment('a1', 'ann', 10),
        ])
        expect(groups.map((g) => g.userId)).toEqual(['bob', 'ann'])
        expect(groups[0].comments.map((c) => c.id)).toEqual(['b2', 'b1'])
    })

    test('numbers people by their first comment', () => {
        const groups = groupByPerson([
            comment('b2', 'bob', 30),
            comment('a1', 'ann', 10),
            comment('b1', 'bob', 15),
        ])
        const numberOf = (userId: string) =>
            groups.find((g) => g.userId === userId)!.personNumber
        expect(numberOf('ann')).toBe(1)
        expect(numberOf('bob')).toBe(2)
    })

    test('keeps a comment without author on its own', () => {
        const groups = groupByPerson([
            { ...comment('x', 'unused', 1), userId: undefined },
            { ...comment('y', 'unused', 2), userId: undefined },
        ])
        expect(groups).toHaveLength(2)
    })
})
