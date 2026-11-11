import { describe, expect, test } from 'vitest'
import { findReusableVote } from './findReusableVote'
import {
    VOTE_STATUS_ACTIVE,
    VOTE_STATUS_DELETED,
    VOTE_STATUS_HIDDEN,
    VOTE_TYPE_TEXT_PLUS,
} from '../../core/contants'
import type { FirestoreDate, Vote } from '../../core/models'

// Dates are irrelevant to the lookup
const date = {} as FirestoreDate

const vote = (fields: Partial<Vote>): Vote => ({
    id: 'v',
    projectId: 'p1',
    talkId: 't1',
    voteItemId: 'vi1',
    userId: 'u1',
    status: VOTE_STATUS_ACTIVE,
    createdAt: date,
    updatedAt: date,
    ...fields,
})

describe('findReusableVote', () => {
    test('never reuses a text vote: each comment is a new one', () => {
        const active = vote({ id: 'a', text: 'first comment' })
        const pending = vote({ id: 'p', text: 'second', pending: true })
        const hidden = vote({
            id: 'h',
            text: 'hidden comment',
            status: VOTE_STATUS_HIDDEN,
        })
        expect(
            findReusableVote([active, pending, hidden], 'another comment')
        ).toBeUndefined()
    })

    test('returns nothing without existing votes', () => {
        expect(findReusableVote(undefined, null)).toBeUndefined()
        expect(findReusableVote([], 'hello')).toBeUndefined()
    })

    test('reuses the boolean vote of the vote item', () => {
        const booleanVote = vote({ id: 'b1', status: VOTE_STATUS_DELETED })
        expect(findReusableVote([booleanVote], null)).toBe(booleanVote)
    })

    test('reuses the up-vote document of the same text vote', () => {
        const upVote = vote({
            id: 'up1',
            voteType: VOTE_TYPE_TEXT_PLUS,
            voteId: 'text1',
            status: VOTE_STATUS_DELETED,
        })
        expect(findReusableVote([upVote], null, 'text1')).toBe(upVote)
    })

    test('does not reuse the up-vote document of another text vote', () => {
        const upVote = vote({
            id: 'up1',
            voteType: VOTE_TYPE_TEXT_PLUS,
            voteId: 'text1',
        })
        const textVote = vote({ id: 'own', text: 'my comment' })
        expect(
            findReusableVote([textVote, upVote], null, 'text2')
        ).toBeUndefined()
    })
})
