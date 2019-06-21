import React, { Component } from 'react'
import { Route, Redirect } from 'react-router'
import { BrowserRouter as Router } from 'react-router-dom'
import { withStyles } from '@material-ui/core/styles'
import Lander from '../modules/Lander/Lander'
import UserProfile from '../modules/UserProfile/UserProfile'
import CarpoolList from '../modules/CarpoolList/CarpoolList'
import CarpoolCreation from '../modules/CarpoolCreation/CarpoolCreation'
import { appInsights } from '../services/Logger'
import { auth } from '../services/Authentication'
import { Api } from '../services/ApiService'
import { toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import 'core-js/features/promise'
import 'core-js/features/set'
import 'core-js/features/map'
appInsights.loadAppInsights()
toast.configure()

const styles = () => ({
  core: {
    width: '90%',
    margin: 'auto',
  }
})

const PrivateRoute = ({
  Component,
  isAuthed,
  ...rest
}) =>
  <Route
  {...rest}
  render={(props) => Boolean(isAuthed)
    ? <Component {...props} {...rest} />
    : <Redirect to={{ pathname:'/' }}/>}
  />

const INITIAL_STATE = {
  isAuth: false,
  user: undefined,
  fetching: false,
  userIsFetched: false
}

class AppWithRoutes extends Component {
  constructor(props) {
    super(props)

    this.state = INITIAL_STATE

    this.updateAuth = this.updateAuth.bind(this)
    this.getUser = this.getUser.bind(this)
  }

  getUser = () => {
    this.setState({
      fetching: true
    })
    const fetchUser = new Api().getUser()
      fetchUser.then(x =>
        this.setState({
          user: {...x},
          fetching: false,
          userIsFetched: true
        }))
  }

  updateAuth = ( history ) => {
    const { userIsFetched } = this.state
    const newAuth = new auth().isAuthenticated()
    newAuth && !userIsFetched && this.getUser()
    /**
     * If the new auth is true, set isAuth (fetch user happens later)
     * If new auth is false (logout), then set our state back to initial state
     */
    const newState = newAuth ?
    {
      isAuth: newAuth
    } : INITIAL_STATE

    this.setState((newState), newAuth ? () => history.push('/user') : () => history.push('/'))
  }

  componentDidMount () {
    const { isAuth, userIsFetched } = this.state
    appInsights.trackEvent({name: 'app_boot'})
    this.setState({
      isAuth: new auth().isAuthenticated()
    })
    if (isAuth && !userIsFetched) {
      this.getUser()
    }
  }

  componentDidUpdate () {
    const { isAuth, fetching, userIsFetched, user } = this.state
    if (isAuth && !userIsFetched && !fetching) {
      this.getUser()
    }
    if (user && window.location.pathname ==='/') {
      window.location.pathname= '/user'
    }
  }

  render() {
    const { isAuth, user } = this.state

    return (
      <Router >
          <Route key={0} exact
            path='/'
            render={props => <Lander {...props} updateAuth={this.updateAuth} isAuthed={isAuth} />} />
          <PrivateRoute
            key={1}
            user={user}
            isAuthed={isAuth}
            updateAuth={this.updateAuth}
            exact path='/user'
            Component={UserProfile}
            fetchUser={this.getUser}
          />
          <PrivateRoute
            key={2}
            user={user}
            isAuthed={isAuth}
            updateAuth={this.updateAuth}
            exact
            path='/list'
            Component={CarpoolList}
            fetchUser={this.getUser}
          />
          <PrivateRoute
            key={3}
            user={user}
            isAuthed={isAuth}
            updateAuth={this.updateAuth}
            exact
            path='/create'
            Component={CarpoolCreation}
            fetchUser={this.getUser}
          />
      </Router>
    )
  }
}


export default withStyles(styles)(AppWithRoutes)