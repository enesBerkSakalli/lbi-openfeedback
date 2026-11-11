import Grid from '@mui/material/Grid'
import Paper from '@mui/material/Paper'
import { Link } from 'react-router-dom'
import { getSpeakersListSelector } from '../../core/speakers/speakerSelectors'
import { SpeakerList } from '../speaker/SpeakerList.tsx'
import { getDateFromStartTime } from '../../core/talks/talksUtils'
import { getProjectIdSelector } from '../project/projectSelectors'
import { darken, lighten, type Theme, Typography } from '@mui/material'
import { useAppSelector } from '../../store'
import { makeStyles } from '@mui/styles'
import { useTranslation } from 'react-i18next'
import type { Talk, Vote } from '../../core/models'
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline'
import { accentText } from '../accent'

const useStyles = makeStyles((theme: Theme) => ({
    itemContainer: {
        margin: -1,
    },
    paper: {
        padding: theme.spacing(2),
        textAlign: 'center',
        fontSize: '17px',
        boxShadow: 'none',
        borderRadius: '0',
        backgroundColor: theme.palette.background.default,
        color: theme.palette.text.secondary,
        border: '1px solid ' + theme.palette.grey[300],
        height: '150px',
        boxSizing: 'border-box',
        '&:hover': {
            backgroundColor:
                theme.palette.mode === 'dark'
                    ? lighten(theme.palette.background.default, 0.2)
                    : darken(theme.palette.background.default, 0.05),
            cursor: 'pointer',
        },
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        transition: 'all 200ms ease-out',
    },
    // Full contrast, marked rather than dimmed: a commented talk is not disabled.
    paperSelected: {
        borderColor: accentText(theme),
    },
    footer: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: theme.spacing(1),
    },
    commented: {
        display: 'inline-flex',
        alignItems: 'center',
        gap: 4,
        color: accentText(theme),
        whiteSpace: 'nowrap',
    },
    commentedIcon: {
        fontSize: 16,
    },
    talkTitle: {
        wordBreak: 'break-word',
        overflow: 'hidden',
        textOverflow: 'ellipsis',
        display: '-webkit-box',
        '-webkit-line-clamp': 2,
        '-webkit-box-orient': 'vertical',
    },
    a: {
        display: 'block',
    },
}))

interface TalksItemProps {
    talk: Talk
    /** A vote of the user on the talk. */
    userVote?: Vote
}

export const TalksItem = ({ talk, userVote }: TalksItemProps) => {
    const classes = useStyles()
    const { t } = useTranslation()
    const speakersEntities = useAppSelector(getSpeakersListSelector)
    const currentProjectId = useAppSelector(getProjectIdSelector)
    const itemClasses = `${classes.paper} ${
        userVote ? classes.paperSelected : ''
    }`

    const speakers =
        talk.speakers &&
        talk.speakers.map((speakerId) => speakersEntities[speakerId])
    const date = getDateFromStartTime(talk.startTime)
    return (
        <Grid
            item
            xs={12}
            sm={6}
            md={4}
            className={`${classes.itemContainer} talk`}
        >
            <Link
                to={`/${currentProjectId}/${date}/${talk.id}`}
                title={t('talks.vote') + talk.title}
                className={classes.a}
            >
                <Paper className={itemClasses}>
                    <Typography
                        color="textPrimary"
                        className={classes.talkTitle}
                    >
                        {talk.title}
                    </Typography>
                    <div className={classes.footer}>
                        {speakers && (
                            <SpeakerList speakers={speakers} size="small" />
                        )}
                        {userVote && (
                            <Typography
                                variant="caption"
                                className={classes.commented}
                            >
                                <CheckCircleOutlineIcon
                                    className={classes.commentedIcon}
                                />
                                {t('talks.commented')}
                            </Typography>
                        )}
                    </div>
                </Paper>
            </Link>
        </Grid>
    )
}
