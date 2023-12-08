import React, {useState, useEffect} from 'react'
import { makeStyles } from '@material-ui/core/styles'
import Paper from '@material-ui/core/Paper'
import List from '@material-ui/core/List'
import ListItem from '@material-ui/core/ListItem'
import ListItemAvatar from '@material-ui/core/ListItemAvatar'
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction'
import ListItemText from '@material-ui/core/ListItemText'
import Avatar from '@material-ui/core/Avatar'
import IconButton from '@material-ui/core/IconButton'
import Icon from '@material-ui/core/Icon'
import Button from '@material-ui/core/Button'
import Typography from '@material-ui/core/Typography'
import Edit from '@material-ui/icons/Edit'
import Divider from '@material-ui/core/Divider'
import auth from '../auth/auth-helper.js'
import {listByOwner} from './api-surveysite.js'
import {Redirect, Link} from 'react-router-dom'
import DeleteSurveySite from './DeleteSurveySite.jsx'

const useStyles = makeStyles(theme => ({
  root: theme.mixins.gutters({
    maxWidth: 600,
    margin: 'auto',
    padding: theme.spacing(3),
    marginTop: theme.spacing(5)
  }),
  title: {
    margin: `${theme.spacing(3)}px 0 ${theme.spacing(3)}px ${theme.spacing(1)}px` ,
    color: theme.palette.protectedTitle,
    fontSize: '1.2em'
  },
  addButton:{
    float:'right'
  },
  leftIcon: {
    marginRight: "8px"
  }
}))

export default function MySurveySites(){
  const classes = useStyles()
  const [surveySites, setSurveySites] = useState([])
  const [redirectToSignin, setRedirectToSignin] = useState(false)
  const jwt = auth.isAuthenticated()

  useEffect(() => {
    const abortController = new AbortController()
    const signal = abortController.signal
    listByOwner({
      userId: jwt.user._id
    }, {t: jwt.token}, signal).then((data) => {
      if (data.error) {
        setRedirectToSignin(true)
      } else {
        setSurveySites(data)
      }
    })
    return function cleanup(){
      abortController.abort()
    }
  }, [])

  const removeSurveySite = (surveySite) => {
    const updatedSurveySites = [...surveySites]
    const index = updatedSurveySites.indexOf(surveySite)
    updatedSurveySites.splice(index, 1)
    setSurveySites(updatedSurveySites)
  }

    if (redirectToSignin) {
      return <Redirect to='/signin'/>
    }
    return (
    <div>
      <Paper className={classes.root} elevation={4}>
        <Typography type="title" className={classes.title}>
          Your Survey Sites
          <span className={classes.addButton}>
            <Link to="/provider/surveySite/new">
              <Button color="primary" variant="contained">
                <Icon className={classes.leftIcon}>add_box</Icon>  New Survey Sites
              </Button>
            </Link>
          </span>
        </Typography>
        <List dense>
        {surveySites.map((surveySite, i) => {
            return   <span key={i}>
              <ListItem button>
                <ListItemAvatar>
                  <Avatar src={'/api/surveySites/logo/'+surveySite._id+"?" + new Date().getTime()}/>
                </ListItemAvatar>
                <ListItemText primary={surveySite.name} secondary={surveySite.description}/>
                { auth.isAuthenticated().user && auth.isAuthenticated().user._id == surveySite.owner._id &&
                  (<ListItemSecondaryAction>
                    <Link to={"/provider/surveySite/edit/" + surveySite._id}>
                      <IconButton aria-label="Edit" color="primary">
                        <Edit/>
                      </IconButton>
                    </Link>
                    <DeleteSurveySite surveySite={surveySite} onRemove={removeSurveySite}/>
                  </ListItemSecondaryAction>)
                }
              </ListItem>
              <Divider/>
            </span>})}
        </List>
      </Paper>
    </div>)
}