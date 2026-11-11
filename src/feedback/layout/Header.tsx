import { Link as RouterLink, useParams } from 'react-router-dom'
import { SearchBar } from './SearchBar.tsx'
import ArrowBack from '@mui/icons-material/ArrowBack'
import CalendarToday from '@mui/icons-material/CalendarToday'
import { grey } from '@mui/material/colors'
import { darken, type Theme } from '@mui/material/styles'
import { makeStyles } from '@mui/styles'
import { useTranslation } from 'react-i18next'
import { Button, Typography } from '@mui/material'
import { isInIFrame } from '../utils/isInIFrame'
import { useQuery } from '../../utils/useQuery'
import type { Project } from '../../core/models'

interface HeaderStyleProps {
    inIFrame: boolean
}

const useStyles = makeStyles((theme: Theme) => ({
    logo: {
        marginRight: 20,
        maxHeight: 60,
        maxWidth: 200,
    },
    // In the flow, not on top of the logo: the logo centers in what is left.
    // A ruled cell, as in a neo-brutalist navigation bar
    iconLeft: {
        flexShrink: 0,
        alignSelf: 'stretch',
        display: 'flex',
        '&:not(:empty)': {
            borderRight: `2px solid ${theme.palette.ink}`,
        },
    },
    backButton: {
        height: '100%',
        paddingLeft: theme.spacing(2),
        paddingRight: theme.spacing(2.5),
    },
    iconRight: {
        minWidth: 28,
        position: 'absolute',
        right: 20,
        display: 'flex',
        gap: 10,
        alignItems: 'center',

        '& svg': {
            color: grey[600],
        },
        '& a': {
            padding: 8,
        },
        '& > *:hover': {
            backgroundColor: darken(theme.palette.pageBackground, 0.2),
        },
        '& > *': {
            borderRadius: 10,
            '&:hover': {
                backgroundColor: darken(theme.palette.pageBackground, 0.2),
            },
        },
    },
    boxCenter: {
        flex: 1,
        minWidth: 0,
        marginLeft: 'auto',
        marginRight: 'auto',
        justifyContent: 'center',
        alignItems: 'center',
        display: 'flex',
        [theme.breakpoints.up('md')]: {
            justifyContent: 'flex-start',
            width: 900,
        },
    },
    container: {
        backgroundColor: theme.palette.pageBackground,
        top: 0,
        left: 'auto',
        right: 0,
        position: (props: HeaderStyleProps) =>
            props.inIFrame ? 'relative' : 'sticky',
        zIndex: 3,
        borderBottom: `2px solid ${theme.palette.ink}`,
        marginBottom: 20,
    },
    // Below lg the event name is not shown, but stays the page's h1 for
    // screen readers and heading navigation.
    eventName: {
        [theme.breakpoints.down('lg')]: {
            position: 'absolute',
            width: 1,
            height: 1,
            margin: -1,
            padding: 0,
            overflow: 'hidden',
            clip: 'rect(0 0 0 0)',
            whiteSpace: 'nowrap',
            border: 0,
        },
    },
    header: {
        height: 65,
        display: 'flex',
        alignItems: 'center',
    },
}))

interface HeaderProps {
    project: Project
}

export const Header = ({ project }: HeaderProps) => {
    const classes = useStyles({
        inIFrame: isInIFrame(),
    })
    const { t } = useTranslation()
    const matchParams = useParams()
    const hideHeader = useQuery().get('hideHeader')

    if (hideHeader && hideHeader === 'true') {
        return null
    }

    return (
        <header className={classes.container}>
            <div className={classes.header}>
                <div className={classes.iconLeft}>
                    {matchParams.talkId && (
                        <Button
                            component={RouterLink}
                            to={`/${matchParams.projectId}/${matchParams.date}`}
                            startIcon={<ArrowBack />}
                            className={classes.backButton}
                        >
                            {t('talks.back')}
                        </Button>
                    )}
                </div>
                <div className={classes.iconRight}>
                    {project.scheduleLink && (
                        <a
                            href={project.scheduleLink}
                            target="_blank"
                            title={`${project.name} website`}
                            rel="noopener noreferrer"
                        >
                            <CalendarToday />
                        </a>
                    )}
                </div>
                <div className={classes.boxCenter}>
                    <img
                        className={classes.logo}
                        src={project.logoSmall}
                        alt={`logo ${project.name}`}
                    />
                    <Typography
                        variant="h1"
                        color="textPrimary"
                        className={classes.eventName}
                        aria-label={
                            project.hideEventName ? project.name : undefined
                        }
                    >
                        {!project.hideEventName && project.name}
                    </Typography>
                </div>
            </div>
            {!matchParams.talkId && <SearchBar />}
        </header>
    )
}
