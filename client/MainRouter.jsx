import React from 'react'
import {Route, Switch} from 'react-router-dom'
import Home from './core/Home'
import Users from './user/Users'
import Signup from './user/Signup'
import Signin from './auth/Signin'
import EditProfile from './user/EditProfile'
import Profile from './user/Profile'
import PrivateRoute from './auth/PrivateRoute'
import Menu from './core/Menu'
import NewSurveySite from './surveysite/NewSurveySite'
import SurveySites from './surveysite/SurveySites'
import MySurveySites from './surveysite/MySurveySites'
import SurveySite from './surveysite/SurveySite'
import EditSurveySite from './surveysite/EditSurveySite'

const MainRouter = () => {
  return (<div>
      <Menu/>
      <Switch>
        <Route exact path="/" component={Home}/>
        <Route path="/users" component={Users}/>
        <Route path="/signup" component={Signup}/>
        <Route path="/signin" component={Signin}/>
        <PrivateRoute path="/user/edit/:userId" component={EditProfile}/>
        <Route path="/user/:userId" component={Profile}/>

        <Route path="/surveySites/all" component={SurveySites}/>
        <Route path="/surveySites/:surveySiteId" component={SurveySite}/>

        <PrivateRoute path="/provider/surveySites" component={MySurveySites}/>
        <PrivateRoute path="/provider/surveySite/new" component={NewSurveySite}/>
        <PrivateRoute path="/provider/surveySite/edit/:surveySiteId" component={EditSurveySite}/>


      </Switch>
    </div>)
}

export default MainRouter