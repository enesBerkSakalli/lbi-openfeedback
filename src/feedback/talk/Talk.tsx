import { type ReactNode, useEffect, useState } from 'react'
import { useAppDispatch, useAppSelector } from '../../store'
import {
    getSelectedTalkSelector,
    getTalkLoadErrorSelector,
    getSpeakersForSelectedTalkSelector,
} from './core/talkSelectors'
import { getTalk, setSelectedTalk } from './core/talkActions'
import { getSpeakers } from '../../core/speakers/speakerActions'
import { getVoteResult } from '../project/projectActions'
import {
    getVotes,
    removeVote,
    removeVoteLoadError,
    removeVotePostError,
    voteFor,
} from '../vote/voteActions'

import {
    getProjectChipColorsSelector,
    getProjectVoteItemsOrderedSelector,
} from '../project/projectSelectors'
import {
    getActiveUserVotesByTalkAndVoteItemSelector,
    getErrorVotePostSelector,
    getErrorVotesLoadSelector,
    getUserVotesSettledSelector,
} from '../vote/voteSelectors'

import Grid from '@mui/material/Grid'
import { type OnVoteChange, TalkVote } from './TalkVote.tsx'
import { LoaderMatchParent } from '../../baseComponents/customComponent/LoaderMatchParent.tsx'
import { Error } from '../../baseComponents/customComponent/Error.tsx'
import { Snackbar } from '../../baseComponents/customComponent/Snackbar.tsx'
import { SPACING } from '../../constants/constants'
import { useTranslation } from 'react-i18next'
import { TalkHeader } from './TalkHeader.tsx'
import { getVoteResultSelectorSelector } from './core/getVoteResultSelectorSelector'
import {
    snapshotVotedOnTalkAtLoad,
    type VotedOnTalkAtLoad,
} from './core/voteResultsVisibility'
import { useQuery } from '../../utils/useQuery'
import { Link as RouterLink, useParams } from 'react-router-dom'
import Button from '@mui/material/Button'
import ArrowBack from '@mui/icons-material/ArrowBack'

export const Talk = () => {
    const { talkId, projectId, date } = useParams()
    const { t } = useTranslation()
    const dispatch = useAppDispatch()
    const displayVotes = useQuery().get('displayVotes')

    // The talk page route always has a talkId
    const id = talkId!

    const talk = useAppSelector(getSelectedTalkSelector)
    const speakers = useAppSelector(getSpeakersForSelectedTalkSelector)
    const voteItems = useAppSelector(getProjectVoteItemsOrderedSelector)
    const userVotes = useAppSelector((state) =>
        getActiveUserVotesByTalkAndVoteItemSelector(state, talkId)
    )
    const userVotesSettled = useAppSelector(getUserVotesSettledSelector)

    // Whether the user had voted on the talk when it loaded: the votes cast
    // during this visit don't reveal the results hidden until the user votes.
    // Votes that failed to load count as not voted, even after a retry.
    const [votedAtLoad, setVotedAtLoad] = useState<VotedOnTalkAtLoad | null>(
        null
    )
    const nextVotedAtLoad = snapshotVotedOnTalkAtLoad(
        votedAtLoad,
        id,
        userVotesSettled,
        userVotes
    )
    if (nextVotedAtLoad !== votedAtLoad) {
        setVotedAtLoad(nextVotedAtLoad)
    }

    const voteResults = useAppSelector((state) =>
        getVoteResultSelectorSelector(
            state,
            displayVotes,
            nextVotedAtLoad?.voted ?? false
        )
    )
    const errorTalkLoad = useAppSelector(getTalkLoadErrorSelector)
    const errorVotePost = useAppSelector(getErrorVotePostSelector)
    const errorVotesLoad = useAppSelector(getErrorVotesLoadSelector)
    const chipColors = useAppSelector(getProjectChipColorsSelector)

    useEffect(() => {
        dispatch(getTalk(id))
        dispatch(setSelectedTalk(id))
        dispatch(getSpeakers())
        const unsubscribe = dispatch(getVoteResult(id))

        return () => {
            if (unsubscribe) {
                unsubscribe()
            }
        }
    }, [dispatch, id])

    const onRetryLoadVotesClick = () => {
        dispatch(removeVoteLoadError())
        dispatch(getVotes())
    }

    const closeErrorVotePostClick = () => {
        dispatch(removeVotePostError())
    }

    const closeErrorVoteLoadClick = () => {
        dispatch(removeVoteLoadError())
    }

    if (errorTalkLoad) {
        return (
            <Error
                error="Unable to load the talk/speakers/vote options"
                errorDetail={errorTalkLoad}
            />
        )
    }

    if (!talk || !speakers || !voteItems) {
        return <LoaderMatchParent />
    }

    // A given vote is removed (an unticked boolean, a deleted comment);
    // otherwise a new vote is cast. Comments are never edited in place.
    const onVoteItemChange: OnVoteChange = (voteItem, data, vote) => {
        if (vote) {
            dispatch(removeVote(vote, t))
            return false
        }
        return dispatch(voteFor(talk.id, voteItem, data, t))
    }

    let snackBarError: ReactNode = null
    if (errorVotePost) {
        snackBarError = (
            <Snackbar
                text={errorVotePost}
                closeCallback={closeErrorVotePostClick}
            />
        )
    }

    if (errorVotesLoad) {
        snackBarError = (
            <Snackbar
                text={
                    'Unable to load the vote results, reason: ' + errorVotesLoad
                }
                actionText="Retry"
                actionCallback={onRetryLoadVotesClick}
                closeCallback={closeErrorVoteLoadClick}
            />
        )
    }
    return (
        <div>
            <TalkHeader talk={talk} speakers={speakers} />
            <Grid container spacing={SPACING.LAYOUT} sx={{ marginBottom: 6 }}>
                {voteItems.map((voteItem, key) => (
                    <TalkVote
                        key={key}
                        voteItem={voteItem}
                        userVotes={userVotes[voteItem.id]}
                        voteResult={voteResults[voteItem.id]}
                        chipColors={chipColors}
                        onVoteChange={onVoteItemChange}
                    />
                ))}
            </Grid>
            {/* Within thumb reach on phones, unlike the header button */}
            <Button
                component={RouterLink}
                to={`/${projectId}/${date}`}
                startIcon={<ArrowBack />}
                variant="outlined"
                fullWidth
                sx={{
                    minHeight: 48,
                    marginBottom: 4,
                }}
            >
                {t('talks.back')}
            </Button>
            {snackBarError}
        </div>
    )
}
