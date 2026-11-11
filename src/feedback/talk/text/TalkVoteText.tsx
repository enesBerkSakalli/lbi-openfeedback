import { type ChangeEvent, type KeyboardEvent, useRef, useState } from 'react'
import type { Theme } from '@mui/material'
import Grid from '@mui/material/Grid'
import SendIcon from '@mui/icons-material/Send'
import LockIcon from '@mui/icons-material/Lock'
import SpellcheckIcon from '@mui/icons-material/Spellcheck'
import UndoIcon from '@mui/icons-material/Undo'
import TextField from '@mui/material/TextField'
import Button from '@mui/material/Button'
import Chip from '@mui/material/Chip'
import Alert from '@mui/material/Alert'
import { TalkVoteTextResult } from './TalkVoteTextResult.tsx'
import { Trans, useTranslation } from 'react-i18next'
import { VOTE_STATUS_HIDDEN, VOTE_TYPE_TEXT_PLUS } from '../../../core/contants'
import Typography from '@mui/material/Typography'
import { makeStyles } from '@mui/styles'
import type { Vote, VoteItem } from '../../../core/models'
import type { OnVoteChange } from '../TalkVote.tsx'
import type { TextVoteResult } from '../core/getVoteResultSelectorSelector'
import { insertStarter } from './insertStarter'
import { useWritingHints } from './useWritingHints'

const MAX_COMMENT_LENGTH = 1000
const STARTER_KEYS = ['liked', 'question', 'idea', 'unclear'] as const
/** Minimum touch target height, for phones held in one hand. */
const TOUCH_TARGET = 44

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
    // The lime highlighter tag from the neo-brutalist reference
    highlight: {
        display: 'inline-block',
        padding: theme.spacing(0.25, 1),
        backgroundColor: theme.palette.lime,
        color: '#1a1a1a',
        border: `2px solid ${theme.palette.ink}`,
        boxShadow: `3px 3px 0 ${theme.palette.ink}`,
        transform: 'rotate(-1.5deg)',
    },
    starterChip: {
        height: TOUCH_TARGET,
        fontSize: 15,
    },
    meta: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        gap: theme.spacing(2),
        marginTop: theme.spacing(1),
    },
    metaIcon: {
        fontSize: 16,
        verticalAlign: 'text-bottom',
        marginRight: 6,
    },
    counter: {
        fontVariantNumeric: 'tabular-nums',
        whiteSpace: 'nowrap',
    },
    helpStatus: {
        marginTop: theme.spacing(1),
    },
    hints: {
        marginTop: theme.spacing(1.5),
        padding: theme.spacing(1.5),
        borderRadius: 6,
        boxShadow: 'inset 0 0 0 1px ' + theme.palette.paperBorder,
    },
    hint: {
        marginTop: theme.spacing(1),
    },
    hintFixes: {
        display: 'flex',
        flexWrap: 'wrap',
        gap: theme.spacing(1),
        marginTop: theme.spacing(0.75),
    },
    fixChip: {
        height: 40,
    },
    undoRow: {
        display: 'flex',
        alignItems: 'center',
        gap: theme.spacing(1),
        marginTop: theme.spacing(1),
    },
    // Sticky so the phone keyboard never hides the action buttons.
    buttonContainer: {
        position: 'sticky',
        bottom: 0,
        zIndex: 1,
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        flexWrap: 'wrap',
        gap: theme.spacing(1),
        marginTop: theme.spacing(1.5),
        marginBottom: 30,
        padding: `${theme.spacing(1)} 0`,
        backgroundColor: theme.palette.pageBackground,
    },
    actionButton: {
        minHeight: TOUCH_TARGET,
    },
    sendButton: {
        minHeight: TOUCH_TARGET,
        marginLeft: 'auto',
    },
    leftIcon: {
        marginRight: theme.spacing(1),
        fontSize: 20,
    },
    voteHidden: {
        margin: '16px 0',
    },
}))

interface TalkVoteTextProps {
    /** The user votes on this vote item. */
    currentUserVotes?: Vote[]
    onVoteChange: OnVoteChange
    voteItem: VoteItem
    voteResult?: TextVoteResult[]
}

export const TalkVoteText = ({
    currentUserVotes,
    onVoteChange,
    voteItem,
    voteResult,
}: TalkVoteTextProps) => {
    const { t } = useTranslation()
    const classes = useStyles()
    const inputRef = useRef<HTMLTextAreaElement>(null)
    const [isWriting, setWriting] = useState(false)
    /** The comment before the last applied writing fix, for Undo. */
    const [beforeFix, setBeforeFix] = useState<string | null>(null)
    // Always a new comment: a person may leave several
    const [comment, setComment] = useState('')
    const { hints, applyHint, status } = useWritingHints(comment, isWriting)

    const onTextChange = (
        event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
    ) => {
        setBeforeFix(null)
        setComment(event.target.value)
    }

    const onStarterClick = (starter: string) => {
        setBeforeFix(null)
        setComment(insertStarter(comment, starter))
        setWriting(true)
        inputRef.current?.focus()
    }

    const onUndoFix = () => {
        if (beforeFix !== null) {
            setComment(beforeFix)
            setBeforeFix(null)
        }
    }

    const canSend = comment.trim().length > 0
    const onSend = () => {
        // Cleared only once saving started: a refused send keeps the text
        if (canSend && onVoteChange(voteItem, comment)) {
            setComment('')
            setBeforeFix(null)
        }
    }

    const hasHiddenComment = !!currentUserVotes?.some(
        (vote) =>
            !!vote.text &&
            vote.voteType !== VOTE_TYPE_TEXT_PLUS &&
            vote.status === VOTE_STATUS_HIDDEN
    )

    const onKeyDown = (event: KeyboardEvent) => {
        if (event.key === 'Enter' && (event.metaKey || event.ctrlKey)) {
            event.preventDefault()
            onSend()
        }
    }

    return (
        <Grid
            item
            xs={12}
            className={classes.itemContainer}
            data-testid="VoteItem"
        >
            <Typography variant="h6" color="textPrimary" component="h3">
                <span className={classes.highlight}>{voteItem.name}</span>
            </Typography>

            <div className={classes.starters}>
                {STARTER_KEYS.map((key) => (
                    <Chip
                        key={key}
                        className={classes.starterChip}
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
                value={comment}
                inputRef={inputRef}
                inputProps={{
                    maxLength: MAX_COMMENT_LENGTH,
                    spellCheck: true,
                    'aria-label': voteItem.name || t('comment.placeholder'),
                }}
            />
            <div className={classes.meta}>
                <Typography variant="body2" color="textSecondary">
                    <LockIcon className={classes.metaIcon} />
                    <Trans i18nKey="comment.anonymousHint" />
                </Typography>
                <Typography
                    variant="caption"
                    color="textSecondary"
                    className={classes.counter}
                >
                    {comment.length}/{MAX_COMMENT_LENGTH}
                </Typography>
            </div>

            {status === 'loading' && (
                <Typography
                    variant="caption"
                    color="textSecondary"
                    component="p"
                    className={classes.helpStatus}
                    aria-live="polite"
                >
                    <SpellcheckIcon className={classes.metaIcon} />
                    <Trans i18nKey="comment.loadingHelp" />
                </Typography>
            )}

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
                            <div className={classes.hintFixes}>
                                {hint.suggestions.map(
                                    (suggestion, suggestionIndex) => {
                                        const replacement =
                                            suggestion.get_replacement_text()
                                        return (
                                            <Chip
                                                key={suggestionIndex}
                                                className={classes.fixChip}
                                                color="primary"
                                                variant="outlined"
                                                label={
                                                    replacement ||
                                                    t('comment.remove', {
                                                        text: hint.problem,
                                                    })
                                                }
                                                onClick={() => {
                                                    const before = comment
                                                    applyHint(
                                                        hint,
                                                        suggestion
                                                    ).then((fixed) => {
                                                        setComment(fixed)
                                                        setBeforeFix(before)
                                                    })
                                                }}
                                            />
                                        )
                                    }
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {beforeFix !== null && (
                <div className={classes.undoRow} aria-live="polite">
                    <Typography variant="body2" color="textSecondary">
                        <Trans i18nKey="comment.fixApplied" />
                    </Typography>
                    <Button
                        className={classes.actionButton}
                        onClick={onUndoFix}
                    >
                        <UndoIcon className={classes.leftIcon} />
                        <Trans i18nKey="comment.undo" />
                    </Button>
                </div>
            )}

            {hasHiddenComment && (
                <Alert severity="info" className={classes.voteHidden}>
                    <Trans i18nKey="comment.hidden" />
                </Alert>
            )}

            <div className={classes.buttonContainer}>
                <Button
                    variant="contained"
                    color="primary"
                    disableElevation
                    className={classes.sendButton}
                    disabled={!canSend}
                    onClick={onSend}
                >
                    <SendIcon className={classes.leftIcon} />
                    <Trans i18nKey="comment.send" />
                </Button>
            </div>

            {voteResult && (
                <TalkVoteTextResult
                    result={voteResult}
                    voteItem={voteItem}
                    currentUserVotes={currentUserVotes}
                    onDelete={(vote) => onVoteChange(voteItem, null, vote)}
                />
            )}
        </Grid>
    )
}
