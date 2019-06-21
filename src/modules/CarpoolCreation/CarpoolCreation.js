import { NewCampusForm, ExistingCampusForm } from './CreateForms'
import { BingMap2, BingMap } from '../BingMap/BingMap'
import FormControl from '@material-ui/core/FormControl'
import { withStyles } from '@material-ui/core/styles'
import Typography from '@material-ui/core/Typography'
import { appInsights } from '../../services/Logger'
import NavBar from '../../components/NavBar/NavBar'
import { SubRoutes } from './CreateSubRoutes/index'
import { Api } from '../../services/ApiService'
import { CardContent } from '@material-ui/core'
import { Redirect } from 'react-router'
import Button from '@material-ui/core/Button'
import Modal from '@material-ui/core/Modal'
import Card from '@material-ui/core/Card'
import Grid from '@material-ui/core/Grid'
import React, { Component } from 'react'

const NEW_CAMPUS = 'New Campus'
const EXISTING_CAMPUS = 'Existing Campus'

const styles = () => ({
  input: {
    margin: '1rem'
  },
  core: {
    width: '90%',
    margin: 'auto',
    minHeight: 600
  },
  modal: {
    position: 'fixed',
    left: '42%',
    top: '42%',
    width: '30rem'
  },
  subRouteContainer: {
    width: '100%',
    display: 'flex',
    cursor: 'pointer',
    textAlign: 'center'
  },
  route: {
    flex: '50%',
    borderBottom: '5px'
  },
  activeRoute: {
    flex: '50%',
    borderBottom: '5px solid #3f51b5'
  },
  createGrid: {
    minHeight: 600,
  },
  outerLeftFormControl: {
    marginRight: '25px',
    marginLeft: '25px'
  },
  leftFormControl: {
    width: '100%'
  },
  wideSelect: {
    width: '100%'
  }
})

const routes = [EXISTING_CAMPUS, NEW_CAMPUS]

const ExistingMap = ({ user, campuses, selectedCampus }) => {
  // Create a new bing map for each campus due to bug in bing
  const mapList = campuses.map((x,i) => {
    return {
      name: x.campus,
        Component: () =>
        <BingMap
        user={user}
        carpool={x}>
      </BingMap>
    }
  })

  // If we have the campuses array to lookup, we can
  // render the map. Need to wait for the api call first
  if (mapList.length) {
    const map = mapList.filter(x => x.name === selectedCampus)[0]
    const Render = map.Component
    return map ? <Render /> : null
  }

  return null
}

class CarpoolCreation extends Component {
  constructor(props) {
    super(props)
    this.state = {
      showSuccessModal: false,
      redirect: false,
      selectedIncentiveId: 1,
      campus: '',
      street: '',
      city: '',
      zip: '',
      active: EXISTING_CAMPUS,
      campuses: [],
      allCampusData:[],
      selectedCampus: "Unknown",
      state: ''
    }

    this.handleChange = this.handleChange.bind(this)
    this.updateActiveRoute = this.updateActiveRoute.bind(this)
  }

  componentDidMount () {
    new Api().getAllCarpools().then(x => {
      this.setState({
        allCampusData: x,
        campuses: [...new Set(x.map(a => a.campus))],
        selectedCampus: x[0].campus
      })
    })
  }

  setRedirect = () => {
    this.setState({
      redirect: true
    })
  }

  handleOpen = () => {
    this.setState({
      showSuccessModal: true
    })
  }

  handleClose = () => {
    this.setState({
      showSuccessModal: false
    })

    this.setRedirect()
  }

  renderRedirect = () => {
    if (this.state.redirect) {
      this.props.fetchUser()
      return <Redirect to='/' />
    }
  }

  carpoolSubmit = (e) => {
    const payload = {
      CampusName: this.state.campus,
      IncentiveId: this.state.selectedIncentiveId,
      UserEmail: localStorage.getItem("username"),
      Address: {
        StreetNumber: this.state.street,
        City: this.state.city,
        State: this.state.state,
        ZipCode: this.state.zip
      }
    }

    appInsights.trackEvent({ name: 'carpool_creation' })
    this.handleOpen()
    new Api().createCarpool(payload)
  }

  existingCarpoolSubmit = (e) => {
    const currCampus = this.state.allCampusData.filter(x =>
      x.campus === this.state.selectedCampus)[0].destination

    const payload = {
      CampusName: this.state.selectedCampus ,
      IncentiveId: this.state.selectedIncentiveId,
      UserEmail: localStorage.getItem("username"),
      Address: {
        StreetNumber: currCampus.streetNumber,
        City: currCampus.city,
        State: currCampus.state,
        ZipCode: currCampus.zipCode
      }
    }

    appInsights.trackEvent({ name: 'carpool_creation' })
    this.handleOpen()
    new Api().createCarpool(payload)
  }

  handleChange = name => event => {
    if (name === 'incentiveType') {
      this.setState({
        selectedIncentiveId: event.target.value
      })
    } else if (name === 'campus') {
      this.setState({
        campus: event.target.value
      })
    } else if (name === 'street') {
      this.setState({
        street: event.target.value
      })
    } else if (name === 'city') {
      this.setState({
        city: event.target.value
      })
    } else if (name === 'state') {
      this.setState({
        state: event.target.value
      })
    } else if (name === 'zip') {
      this.setState({
        zip: event.target.value
      })
    } else if (name === 'campusChoice') {
      this.setState({
        selectedCampus: event.target.value
      })
    }
  }

  updateActiveRoute = (tab) => () => {
    this.setState({
      active: tab
    })
  }

  render() {
    const { updateAuth, classes, user } = this.props
    const { active, state, selectedIncentiveId } = this.state
    const incentiveTypes = [
      { id: 1, description: 'Reserved Parking Space' },
      { id: 2, description: '$100 Gas Card' }
    ]

    return (
      <div>
        <Modal
          open={this.state.showSuccessModal}
          onClose={this.handleClose}
          className={classes.modal}>
          <Card >
            <Typography className={classes.input} variant='h5'>Create your new Carpool</Typography>
            <CardContent>
              <Typography className={classes.input}>You will be redirected back to your profile page</Typography>
              <Button
                fullWidth
                color="secondary"
                variant="contained"
                onClick={this.handleClose}>
                Ok
              </Button>
            </CardContent>
          </Card>
        </Modal>
        <NavBar updateAuth={updateAuth} user={user} />
        <br />
        {this.renderRedirect()}
        <Grid container className={classes.core}>
          <Grid item xs={12} >
            <Card >
              <Typography className={classes.input} variant='h5'>Create a New Carpool</Typography>
              <SubRoutes
                classes={classes}
                routes={routes}
                active={this.state.active}
                updater={this.updateActiveRoute}
              />
              <CardContent>
                <Grid container className={classes.createGrid}>
                  <Grid item xs={5} className={classes.outerLeftFormControl}>
                    <FormControl className={classes.leftFormControl}>
                      <div >
                        {active === EXISTING_CAMPUS ?
                          <ExistingCampusForm
                            classes={classes}
                            incentiveTypes={incentiveTypes}
                            campuses={this.state.campuses}
                            selectedCampus={this.state.selectedCampus}
                            handleChange={this.handleChange}
                            carpoolSubmit={this.existingCarpoolSubmit}
                            selectedIncentiveId={selectedIncentiveId}
                          /> :
                          <NewCampusForm
                            classes={classes}
                            incentiveTypes={incentiveTypes}
                            handleChange={this.handleChange}
                            carpoolSubmit={this.carpoolSubmit}
                            state={state}
                            selectedIncentiveId={selectedIncentiveId} />
                        }
                      </div>
                    </FormControl>
                  </Grid>
                  <Grid item xs={6}>
                  {active === EXISTING_CAMPUS ?
                  <ExistingMap
                    user={user}
                    campuses={this.state.allCampusData}
                    selectedCampus={this.state.selectedCampus}
                  />
                  :<BingMap2
                      userAddress={user.address}
                      streetNumber={this.state.street}
                      city={this.state.city}
                      state={this.state.state}
                      zipCode={this.state.zip}>
                    </BingMap2>
                  }
                  </Grid>
                </Grid>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </div>
    )
  }
}
export default withStyles(styles)(CarpoolCreation)