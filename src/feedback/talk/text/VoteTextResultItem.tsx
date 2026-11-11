import { makeStyles } from '@mui/styles'
import type { Theme } from '@mui/material/styles'
import { DateTime } from 'luxon'
import Typography from '@mui/material/Typography'
import Chip from '@mui/material/Chip'
import ThumbUpIcon from '@mui/icons-material/ThumbUp'
import ThumbUpOutlinedIcon from '@mui/icons-material/ThumbUpOutlined'
import { useTranslation } from 'react-i18next'
import type { TextVoteResult } from '../core/getVoteResultSelectorSelector'
import { accentFill, accentText } from '../../accent'

interface VoteTextResultItemStyleProps {
    isLast: boolean
}

const useStyles = makeStyles((theme: Theme) => ({
    container: {
        marginTop: theme.spacing(2),
        paddingBottom: theme.spacing(2),
        borderBottom: (props: VoteTextResultItemStyleProps) =>
            props.isLast ? '' : `1px solid ${theme.palette.paperBorder}`,
    },
    meta: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: theme.spacing(1),
    },
    date: {
        color: theme.palette.textDimmed,
        fontSize: 14,
        margin: 0,
    },
    agree: {
        height: 40,
        borderRadius: 20,
        fontVariantNumeric: 'tabular-nums',
        color: accentText(theme),
        borderColor: accentText(theme),
        '& .MuiChip-icon': {
            color: 'inherit',
        },
    },
    agreeSelected: {
        backgroundColor: accentFill(theme),
        borderColor: accentFill(theme),
        color: theme.palette.common.white,
        '&:hover': {
            backgroundColor: accentFill(theme),
        },
    },
    comment: {
        marginTop: theme.spacing(1),
        wordBreak: 'break-word',
        whiteSpace: 'pre-wrap',
    },
}))

interface VoteTextResultItemProps {
    vote: TextVoteResult
    isLast: boolean
    isSelected: boolean
    /** Unused: the agree chip follows the app accent color. */
    chipColors?: string[]
    onVoteChange: () => void
    currentUserId: string
}

export const VoteTextResultItem = ({
    vote,
    isLast,
    isSelected,
    onVoteChange,
    currentUserId,
}: VoteTextResultItemProps) => {
    const classes = useStyles({
        isLast,
    })
    const { t } = useTranslation()
    const isVoteFromUser = vote.userId === currentUserId
    const voteCount = vote.plus === undefined ? 1 : vote.plus // vote.plus can be undefined for old projects

    return (
        <li className={classes.container}>
            <div className={classes.meta}>
                <p className={classes.date}>
                    {DateTime.fromJSDate(vote.updatedAt)
                        .minus({ seconds: 1 })
                        .toRelative()}
                    {isVoteFromUser ? ', ' + t('vote.yourVote') : ''}
                </p>
                <Chip
                    className={`${classes.agree} ${
                        isSelected ? classes.agreeSelected : ''
                    }`}
                    variant="outlined"
                    icon={
                        isSelected ? <ThumbUpIcon /> : <ThumbUpOutlinedIcon />
                    }
                    label={voteCount ?? 1}
                    onClick={onVoteChange}
                    aria-pressed={isSelected}
                    aria-label={t('comment.agree', { n: voteCount ?? 1 })}
                />
            </div>
            <Typography className={classes.comment} color="textPrimary">
                {vote.text}
            </Typography>
        </li>
    )
}
