import {
    type ChangeEvent,
    type KeyboardEvent,
    useEffect,
    useRef,
    useState,
} from 'react'
import type { Theme } from '@mui/material'
import Grid from '@mui/material/Grid'
import SendIcon from '@mui/icons-material/Send'
import DeleteIcon from '@mui/icons-material/Delete'
import InfoIcon from '@mui/icons-material/Info'
import LockIcon from '@mui/icons-material/Lock'
import SpellcheckIcon from '@mui/icons-material/Spellcheck'
import TextField from '@mui/material/TextField'
import Button from '@mui/material/Button'
import Chip from '@mui/material/Chip'
import { TalkVoteTextResult } from './TalkVoteTextResult.tsx'
import { Trans, useTranslation } from 'react-i18next'
import { VOTE_STATUS_HIDDEN, VOTE_TYPE_TEXT_PLUS } from '../../../core/contants'
import { HEX_COLORS } from '../../../constants/colors'
import Typography from '@mui/material/Typography'
import { makeStyles } from '@mui/styles'
import type { Vote, VoteItem, VoteStatus } from '../../../core/models'
import type { OnVoteChange } from '../TalkVote.tsx'
import type { TextVoteResult } from '../core/getVoteResultSelectorSelector'
import { insertStarter } from './insertStarter'
import { useWritingHints } from './useWritingHints'

const MAX_COMMENT_LENGTH = 1000
const STARTER_KEYS = ['liked', 'question', 'idea', 'unclear'] as const

const useStyles = makeStyles((theme: Theme) => ({
    itemContainer: {
        margin: -1,
    },
    starters: {
        display: 'flex',
        flexWrap: 'wrap',
        gap: theme.spacing(1),
        margin: `${theme.spacing(1)} 0 ${theme.spacing(1.5)}`,
    },
    meta: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        gap: theme.spacing(2),
        marginTop: theme.spacing(0.75),
    },
    metaIcon: {
        fontSize: 14,
        verticalAlign: 'text-bottom',
        marginRight: 4,
    },
    hints: {
        marginTop: theme.spacing(1.5),
        padding: theme.spacing(1.5),
        borderRadius: 6,
        boxShadow: 'inset 0 0 0 1px ' + theme.palette.paperBorder,
    },
    hint: {
        display: 'flex',
        flexWrap: 'wrap',
        alignItems: 'center',
        gap: theme.spacing(1),
        marginTop: theme.spacing(1),
    },
    leftIcon: {
        marginRight: theme.spacing(1),
        fontSize: 20,
    },
    buttonContainer: {
        marginTop: 10,
        marginBottom: 30,
        display: 'flex',
        justifyContent: 'flex-end',
    },
    saveButton: {
        marginLeft: 16,
        backgroundColor: '#3673ff',
    },
    voteHidden: {
        padding: 10,
        background: HEX_COLORS.RED_ORANGE,
        color: 'white',
        margin: '16px 0',
        borderRadius: 6,
    },
    voteHiddenIcon: {
        verticalAlign: 'text-bottom',
    },
}))

interface TalkVoteTextProps {
    /** The user votes on this vote item. */
    currentUserVotes?: Vote[]
    onVoteChange: OnVoteChange
    voteItem: VoteItem
    voteResult?: TextVoteResult[]
    chipColors?: string[]
}

interface TextVoteFormState {
    comment: string
    status: VoteStatus | null
    dataLoaded: boolean
    /** The user text vote being edited. */
    vote?: Vote | null
}

export const TalkVoteText = ({
    currentUserVotes,
    onVoteChange,
    voteItem,
    voteResult,
    chipColors,
}: TalkVoteTextProps) => {
    const { t } = useTranslation()
    const classes = useStyles()
    const inputRef = useRef<HTMLTextAreaElement>(null)
    const [isWriting, setWriting] = useState(false)
    const [data, setData] = useState<TextVoteFormState>({
        comment: '',
        status: null,
        dataLoaded: false,
    })
    const { hints, applyHint } = useWritingHints(data.comment, isWriting)

    useEffect(() => {
        if (currentUserVotes && (!data.dataLoaded || !data.vote)) {
            const foundTextVote = currentUserVotes.find(
                (vote): vote is Vote & { text: string } =>
                    !!vote.text && vote.voteType !== VOTE_TYPE_TEXT_PLUS
            )
            if (foundTextVote) {
                setData({
                    dataLoaded: true,
                    comment: foundTextVote.text,
                    status: foundTextVote.status,
                    vote: foundTextVote,
                })
            }
        }
    }, [currentUserVotes, data.vote, data.dataLoaded])

    const setComment = (comment: string) =>
        setData((previous) => ({ ...previous, comment }))

    const onTextChange = (
        event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
    ) => setComment(event.target.value)

    const onStarterClick = (starter: string) => {
        setComment(insertStarter(data.comment, starter))
        setWriting(true)
        inputRef.current?.focus()
    }

    const onVoteDelete = () => {
        setData({
            ...data,
            comment: '',
            status: null,
            vote: null,
        })
        if (data.vote) {
            onVoteChange(voteItem, null, data.vote)
        }
    }

    const canSend = data.comment.trim().length > 0
    const onSend = () => {
        if (canSend) {
            onVoteChange(voteItem, data.comment)
        }
    }

    const onKeyDown = (event: KeyboardEvent) => {
        if (event.key === 'Enter' && (event.metaKey || event.ctrlKey)) {
            event.preventDefault()
            onSend()
        }
    }

    const sendKey =
        currentUserVotes && data.dataLoaded ? 'comment.update' : 'comment.send'

    return (
        <Grid
            item
            xs={12}
            className={classes.itemContainer}
            data-testid="VoteItem"
        >
            <Typography variant="h6" color="textPrimary" component="h3">
                {voteItem.name}
            </Typography>

            <div className={classes.starters}>
                {STARTER_KEYS.map((key) => (
                    <Chip
                        key={key}
                        label={t(`comment.starters.${key}`)}
                        variant="outlined"
                        clickable
                        onClick={() =>
                            onStarterClick(t(`comment.starters.${key}`))
                        }
                    />
                ))}
            </div>

            <TextField
                multiline
                fullWidth
                minRows={3}
                maxRows={10}
                variant="outlined"
                placeholder={t('comment.placeholder')}
                onChange={onTextChange}
                onFocus={() => setWriting(true)}
                onKeyDown={onKeyDown}
                value={data.comment}
                inputRef={inputRef}
                inputProps={{
                    maxLength: MAX_COMMENT_LENGTH,
                    spellCheck: true,
                    lang: 'en',
                    'aria-label': voteItem.name || t('comment.placeholder'),
                }}
            />
            <div className={classes.meta}>
                <Typography variant="caption" color="textSecondary">
                    <LockIcon className={classes.metaIcon} />
                    <Trans i18nKey="comment.anonymousHint" />
                </Typography>
                <Typography variant="caption" color="textSecondary">
                    {data.comment.length}/{MAX_COMMENT_LENGTH}
                </Typography>
            </div>

            {hints.length > 0 && (
                <div className={classes.hints} aria-live="polite">
                    <Typography variant="subtitle2" color="textPrimary">
                        <SpellcheckIcon className={classes.metaIcon} />
                        <Trans i18nKey="comment.writingHelp" />
                    </Typography>
                    {hints.map((hint, hintIndex) => (
                        <div key={hintIndex} className={classes.hint}>
                            <Typography variant="body2" color="textSecondary">
                                {hint.message}
                            </Typography>
                            {hint.suggestions.map(
                                (suggestion, suggestionIndex) => {
                                    const replacement =
                                        suggestion.get_replacement_text()
                                    return (
                                        <Chip
                                            key={suggestionIndex}
                                            size="small"
                                            color="primary"
                                            label={
                                                replacement ||
                                                t('comment.remove', {
                                                    text: hint.problem,
                                                })
                                            }
                                            onClick={() =>
                                                applyHint(
                                                    hint,
                                                    suggestion
                                                ).then(setComment)
                                            }
                                        />
                                    )
                                }
                            )}
                        </div>
                    ))}
                </div>
            )}

            {data.status && data.status === VOTE_STATUS_HIDDEN && (
                <div className={classes.voteHidden}>
                    <InfoIcon className={classes.voteHiddenIcon} />
                    <Trans i18nKey="comment.hidden" />
                </div>
            )}

            <div className={classes.buttonContainer}>
                {data.vote && (
                    <Button onClick={onVoteDelete}>
                        <DeleteIcon className={classes.leftIcon} />
                        <Trans i18nKey="comment.delete">Delete comment</Trans>
                    </Button>
                )}

                <Button
                    variant="contained"
                    color="secondary"
                    className={classes.saveButton}
                    disabled={!canSend}
                    onClick={onSend}
                >
                    <SendIcon className={classes.leftIcon} />
                    <Trans i18nKey={sendKey} />
                </Button>
            </div>

            {voteResult && (
                <TalkVoteTextResult
                    result={voteResult}
                    voteItem={voteItem}
                    chipColors={chipColors}
                    currentUserVotes={currentUserVotes}
                />
            )}
        </Grid>
    )
}
