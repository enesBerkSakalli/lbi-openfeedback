import type { TextVoteResult } from '../core/getVoteResultSelectorSelector'

/** The comments of one anonymous person (one browser) on a vote item. */
export interface PersonComments {
    userId: string
    /** 1 for the first person to comment: stable while others comment. */
    personNumber: number
    comments: TextVoteResult[]
}

const firstDate = (comments: TextVoteResult[]) =>
    Math.min(...comments.map((c) => (c.createdAt ?? c.updatedAt).getTime()))

/**
 * Groups comments by their author, keeping the order of `comments` (newest
 * first) for both the groups and the comments in each group.
 */
export const groupByPerson = (comments: TextVoteResult[]): PersonComments[] => {
    const byUser = new Map<string, TextVoteResult[]>()
    for (const comment of comments) {
        // Old comments without author stay alone
        const userId = comment.userId ?? `vote:${comment.id}`
        byUser.set(userId, [...(byUser.get(userId) ?? []), comment])
    }
    const numbers = new Map(
        [...byUser]
            .sort(([, a], [, b]) => firstDate(a) - firstDate(b))
            .map(([userId], index) => [userId, index + 1])
    )
    return [...byUser].map(([userId, userComments]) => ({
        userId,
        personNumber: numbers.get(userId)!,
        comments: userComments,
    }))
}
