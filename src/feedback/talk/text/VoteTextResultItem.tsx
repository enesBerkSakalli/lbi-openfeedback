import { makeStyles } from '@mui/styles'
import type { Theme } from '@mui/material/styles'
import { useState } from 'react'
import { DateTime } from 'luxon'
import Typography from '@mui/material/Typography'
import ToggleButton from '@mui/material/ToggleButton'
import Button from '@mui/material/Button'
import ThumbUpIcon from '@mui/icons-material/ThumbUp'
import ThumbUpOutlinedIcon from '@mui/icons-material/ThumbUpOutlined'
import { useTranslation } from 'react-i18next'
import type { TextVoteResult } from '../core/getVoteResultSelectorSelector'

interface VoteTextResultItemStyleProps {
    isLast: boolean
}

const useStyles = makeStyles((theme: Theme) => ({
    container: {
        paddingTop: theme.spacing(1.5),
        paddingBottom: theme.spacing(1.5),
        // The person card sets the rule and muted colors for its tint
        borderBottom: (props: VoteTextResultItemStyleProps) =>
            props.isLast
                ? ''
                : `1px solid var(--person-rule, ${theme.palette.paperBorder})`,
    },
    time: {
        color: `var(--person-muted, ${theme.palette.text.secondary})`,
    },
    meta: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: theme.spacing(1),
    },
    actions: {
        display: 'flex',
        alignItems: 'center',
        gap: theme.spacing(0.5),
    },
    action: {
        minHeight: 40,
    },
    agree: {
        height: 40,
        minWidth: 64,
        gap: theme.spacing(0.75),
        borderRadius: 20,
        paddingLeft: theme.spacing(1.5),
        paddingRight: theme.spacing(1.5),
        fontVariantNumeric: 'tabular-nums',
    },
    comment: {
        marginTop: theme.spacing(0.5),
        maxWidth: '70ch',
        wordBreak: 'break-word',
        whiteSpace: 'pre-wrap',
    },
}))

interface VoteTextResultItemProps {
    vote: TextVoteResult
    isLast: boolean
    isSelected: boolean
    onVoteChange: () => void
    /** Set on the user's own comments. */
    onDelete?: () => void
}

export const VoteTextResultItem = ({
    vote,
    isLast,
    isSelected,
    onVoteChange,
    onDelete,
}: VoteTextResultItemProps) => {
    const classes = useStyles({
        isLast,
    })
    const { t } = useTranslation()
    const [isConfirmingDelete, setConfirmingDelete] = useState(false)
    const voteCount = vote.plus === undefined ? 1 : vote.plus // vote.plus can be undefined for old projects

    return (
        <li className={classes.container}>
            <div className={classes.meta}>
                <Typography
                    variant="body2"
                    className={classes.time}
                    component="time"
                    dateTime={vote.updatedAt.toISOString()}
                >
                    {DateTime.fromJSDate(vote.updatedAt)
                        .minus({ seconds: 1 })
                        .toRelative()}
                </Typography>
                <div className={classes.actions}>
                    {onDelete && !isConfirmingDelete && (
                        <Button
                            className={classes.action}
                            color="inherit"
                            onClick={() => setConfirmingDelete(true)}
                        >
                            {t('comment.delete')}
                        </Button>
                    )}
                    {onDelete && isConfirmingDelete && (
                        <>
                            <Typography variant="body2">
                                {t('comment.deleteConfirm')}
                            </Typography>
                            <Button
                                className={classes.action}
                                color="inherit"
                                onClick={() => setConfirmingDelete(false)}
                            >
                                {t('comment.cancel')}
                            </Button>
                            <Button
                                className={classes.action}
                                color="inherit"
                                onClick={onDelete}
                            >
                                {t('comment.delete')}
                            </Button>
                        </>
                    )}
                    <ToggleButton
                        value="agree"
                        size="small"
                        selected={isSelected}
                        onChange={onVoteChange}
                        className={classes.agree}
                        aria-label={t('comment.agree', { n: voteCount })}
                    >
                        {isSelected ? (
                            <ThumbUpIcon fontSize="small" />
                        ) : (
                            <ThumbUpOutlinedIcon fontSize="small" />
                        )}
                        {voteCount}
                    </ToggleButton>
                </div>
            </div>
            <Typography className={classes.comment}>{vote.text}</Typography>
        </li>
    )
}
