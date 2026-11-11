import Grid from '@mui/material/Grid'
import Card from '@mui/material/Card'
import CardActionArea from '@mui/material/CardActionArea'
import { Link } from 'react-router-dom'
import { getSpeakersListSelector } from '../../core/speakers/speakerSelectors'
import { SpeakerList } from '../speaker/SpeakerList.tsx'
import { getDateFromStartTime } from '../../core/talks/talksUtils'
import { getProjectIdSelector } from '../project/projectSelectors'
import { type Theme, Typography } from '@mui/material'
import { useAppSelector } from '../../store'
import { makeStyles } from '@mui/styles'
import { useTranslation } from 'react-i18next'
import type { Talk, Vote } from '../../core/models'
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline'

const useStyles = makeStyles((theme: Theme) => ({
    itemContainer: {
        margin: -1,
    },
    card: {
        borderRadius: 12,
        backgroundColor: theme.palette.background.default,
        border: `2px solid ${theme.palette.ink}`,
        boxShadow: `4px 4px 0 ${theme.palette.ink}`,
        height: 150,
        transition: 'transform 120ms ease-out, box-shadow 120ms ease-out',
        '&:hover': {
            transform: 'translate(-1px, -1px)',
            boxShadow: `5px 5px 0 ${theme.palette.ink}`,
        },
    },
    action: {
        height: '100%',
        padding: theme.spacing(2),
        textAlign: 'center',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'stretch',
        justifyContent: 'space-between',
    },
    // Full contrast, marked rather than dimmed: a commented talk is not disabled.
    paperSelected: {
        borderColor: theme.palette.primary.main,
        boxShadow: `4px 4px 0 ${theme.palette.primary.main}`,
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
            <Card
                variant="outlined"
                className={`${classes.card} ${
                    userVote ? classes.paperSelected : ''
                }`}
            >
                <CardActionArea
                    component={Link}
                    to={`/${currentProjectId}/${date}/${talk.id}`}
                    className={classes.action}
                >
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
                                color="primary"
                                className={classes.commented}
                            >
                                <CheckCircleOutlineIcon
                                    className={classes.commentedIcon}
                                />
                                {t('talks.commented')}
                            </Typography>
                        )}
                    </div>
                </CardActionArea>
            </Card>
        </Grid>
    )
}
