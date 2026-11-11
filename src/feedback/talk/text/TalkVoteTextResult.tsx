import { makeStyles } from '@mui/styles'
import type { Theme } from '@mui/material/styles'
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import { VoteTextResultItem } from './VoteTextResultItem.tsx'
import { useAppDispatch, useAppSelector } from '../../../store'
import {
    removeUpVoteOnTextVoteItemVote,
    upVoteOnTextVoteItemVote,
} from '../../vote/actions/upVoteOnTextVoteItemVote'
import { useTranslation } from 'react-i18next'
import { getUserSelector } from '../../auth/authSelectors'
import type { AuthUser, Vote, VoteItem } from '../../../core/models'
import type { TextVoteResult } from '../core/getVoteResultSelectorSelector'
import { groupByPerson } from './groupByPerson'
import { personColors } from './personColors'

const useStyles = makeStyles((theme: Theme) => ({
    person: {
        marginTop: theme.spacing(3),
        padding: theme.spacing(0.5, 2),
        border: `2px solid ${theme.palette.ink}`,
        boxShadow: `4px 4px 0 ${theme.palette.ink}`,
        color: theme.palette.text.primary,
    },
    label: {
        display: 'inline-block',
        marginTop: theme.spacing(1.5),
        padding: theme.spacing(0.25, 1.25),
        border: `2px solid ${theme.palette.ink}`,
        color: '#1a1a1a',
        fontWeight: 700,
    },
}))

interface TalkVoteTextResultProps {
    result: TextVoteResult[]
    voteItem: VoteItem
    /** The user votes on this vote item. */
    currentUserVotes?: Vote[]
    /** Deletes one of the user's own comments. */
    onDelete: (vote: Vote) => void
}

export const TalkVoteTextResult = ({
    result,
    voteItem,
    currentUserVotes,
    onDelete,
}: TalkVoteTextResultProps) => {
    const classes = useStyles()
    const user = useAppSelector(getUserSelector)
    const dispatch = useAppDispatch()
    const { t } = useTranslation()

    return (
        <ul className="comments">
            {groupByPerson(result).map((person) => {
                const isMe = !!user && person.userId === user.uid
                const colors = personColors(person.personNumber)
                return (
                    <Box
                        component="li"
                        key={person.userId}
                        className={classes.person}
                        sx={{
                            backgroundColor: colors.tint,
                            '--person-muted': colors.muted,
                            '--person-rule': colors.rule,
                        }}
                    >
                        <Typography
                            variant="subtitle2"
                            component="h4"
                            className={classes.label}
                            sx={{ backgroundColor: colors.strong }}
                        >
                            {isMe
                                ? t('comment.you')
                                : t('comment.person', {
                                      n: person.personNumber,
                                  })}
                        </Typography>
                        <ul>
                            {person.comments.map((item, key) => {
                                const [isSelected, vote] = isVoteSelected(
                                    currentUserVotes,
                                    user,
                                    item
                                )
                                const ownVote = isMe
                                    ? currentUserVotes?.find(
                                          (v) => v.id === item.id
                                      )
                                    : undefined
                                return (
                                    <VoteTextResultItem
                                        key={item.id}
                                        vote={item}
                                        isLast={
                                            key === person.comments.length - 1
                                        }
                                        isSelected={isSelected}
                                        onDelete={
                                            ownVote
                                                ? () => onDelete(ownVote)
                                                : undefined
                                        }
                                        onVoteChange={() => {
                                            if (isSelected) {
                                                dispatch(
                                                    removeUpVoteOnTextVoteItemVote(
                                                        vote,
                                                        t
                                                    )
                                                )
                                            } else {
                                                dispatch(
                                                    upVoteOnTextVoteItemVote(
                                                        voteItem,
                                                        item,
                                                        t
                                                    )
                                                )
                                            }
                                        }}
                                    />
                                )
                            })}
                        </ul>
                    </Box>
                )
            })}
        </ul>
    )
}

const isVoteSelected = (
    currentUserVotes: Vote[] | undefined,
    user: AuthUser | null,
    resultItem: TextVoteResult
): [isSelected: boolean, vote: Vote | null] => {
    if (!currentUserVotes) {
        return [false, null]
    }

    const userTextPlusVote = currentUserVotes.find(
        (vote) => vote.voteId === resultItem.id
    )
    if (userTextPlusVote) {
        // The current user vote (textPlus) on an existing vote
        return [true, userTextPlusVote]
    }

    // The user is logged in once their votes are loaded
    if (resultItem.userId === user!.uid) {
        // The current user was the one to submit the vote
        return [true, null]
    }

    return [false, null]
}
