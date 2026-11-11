import type { Vote } from '../../core/models'

/**
 * Find the user vote document to update instead of creating a new one.
 * A text vote (a comment) is never re-used. A boolean vote or up-vote still
 * being written is: Firestore applies the writes of a document in order.
 * @param existingVotes the user votes on the vote item
 * @param data the user text vote value if adding a text vote
 * @param upVotedVoteId the text vote id when up-voting another text vote
 * @returns the vote to update, undefined when a new vote is needed
 */
export const findReusableVote = (
    existingVotes: Vote[] | undefined,
    data: string | null,
    upVotedVoteId?: string
): Vote | undefined => {
    if (!existingVotes || existingVotes.length === 0) {
        return undefined
    }

    if (data) {
        // Every comment is a new document: a person may leave several.
        return undefined
    }
    // The user is adding a boolean vote, or an up-vote on a text vote. An
    // up-vote document is only re-used for the same text vote.
    return existingVotes.find(
        (vote) => !vote.text && vote.voteId === upVotedVoteId
    )
}
