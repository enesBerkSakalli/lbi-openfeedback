import { describe, expect, test } from 'vitest'
import { getVotesByTalkSelector } from './voteSelectors'
import {
    VOTE_STATUS_ACTIVE,
    VOTE_STATUS_DELETED,
    VOTE_TYPE_TEXT_PLUS,
} from '../../core/contants'
import type { FirestoreDate, Vote } from '../../core/models'
import type { RootState } from '../../store'

const vote = (fields: Partial<Vote>): Vote => ({
    id: 'v',
    projectId: 'p1',
    talkId: 't1',
    voteItemId: 'vi1',
    userId: 'u1',
    status: VOTE_STATUS_ACTIVE,
    createdAt: {} as FirestoreDate,
    updatedAt: {} as FirestoreDate,
    ...fields,
})

const talksMarkedFor = (votes: Vote[]) =>
    Object.keys(
        getVotesByTalkSelector({
            votes: {
                currentUserVotes: Object.fromEntries(
                    votes.map((v) => [v.id, v])
                ),
            },
        } as unknown as RootState)
    )

describe('getVotesByTalkSelector', () => {
    test('marks a talk with an active comment', () => {
        expect(talksMarkedFor([vote({ id: 'c', text: 'Hi' })])).toEqual(['t1'])
    })

    test('ignores a deleted comment and a 👍 on another comment', () => {
        expect(
            talksMarkedFor([
                vote({ id: 'c', text: 'Hi', status: VOTE_STATUS_DELETED }),
                vote({
                    id: 'up',
                    talkId: 't2',
                    text: 'Their comment',
                    voteType: VOTE_TYPE_TEXT_PLUS,
                    voteId: 'other',
                }),
            ])
        ).toEqual([])
    })
})
