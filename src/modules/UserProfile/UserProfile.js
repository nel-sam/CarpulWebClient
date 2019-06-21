import React, { Component } from 'react'
import Avatar from 'react-avatar'
import zipcodes from 'zipcodes'
import { withStyles } from '@material-ui/core/styles'
import ReactLoading from 'react-loading'
import Grid from '@material-ui/core/Grid'
import Card from '@material-ui/core/Card'
import { CardContent } from '@material-ui/core'
import Link from '@material-ui/core/Link'
import Typography from '@material-ui/core/Typography'
import { appInsights } from '../../services/Logger'
import { InboundTable, OutboundTable, CarpoolTable } from './components/UserTables.js'
import NavBar from '../../components/NavBar/NavBar'
import { Api } from '../../services/ApiService'
import Popover from '@material-ui/core/Popover'
import HelpOutline from '@material-ui/icons/HelpOutline'
import { BingMap } from '../BingMap/BingMap'
import { styles } from './styles'

const calcGasSavings = (monthlyDistance) => {
  const monthlyGallons = monthlyDistance / 28
  const monthlyGasCost = 4 * monthlyGallons
  const userGasCost = monthlyGasCost * .25

  // return monthly gas savings
  return ((monthlyGasCost - userGasCost)).toFixed(2)
}

const NewUserGuider = ({classes, props})  => {
  return (
    <Card class={classes.guider}>
      <CardContent>
        <Typography variant='h5' align='center'>
          It looks like you're new here!
          <br />
          Start by
          <Link onClick={() => props.history.push('/list')} className={classes.link}> joining an existing carpool </Link>
          or
          <Link onClick={() => props.history.push('/create')} className={classes.link}> creating your own</Link>
        </Typography>
      </CardContent>
    </Card>
  );
}

const UserStatBox = ({classes, data}) => {
  const [anchorEl, updateAnchorEl] = React.useState(null)
  const open = Boolean(anchorEl)

  return (
    <div className={classes.statBoxes}>
    <Typography variant='h6' align='center' className={classes.statTitle} >
      {data.title}
      <HelpOutline
        className={classes.questionIcon}
        onMouseEnter={(e) => updateAnchorEl(e.currentTarget)}
        onMouseLeave={() => updateAnchorEl(null)}
      />
    </Typography>
    <Typography variant='h4' align='center' className={classes.headerValue}>{data.stat}</Typography>
    <Popover
      id="mouse-over-popover"
      className={classes.popover}
      classes={{
        paper: classes.paper,
      }}
      open={open}
      anchorEl={anchorEl}
      anchorOrigin={{
        vertical: 'bottom',
        horizontal: 'left',
      }}
      transformOrigin={{
        vertical: 'top',
        horizontal: 'left',
      }}
      onClose={() => updateAnchorEl(null)}
      disableRestoreFocus
    >
      <Typography>{data.tooltip}</Typography>
    </Popover>
  </div>)
}

const UserCarpools = ({ user, carpool, classes, fetchUser }) =>
  <Grid item xs={12}>
    <Typography variant='h5' className={classes.header} >Inbound Requests</Typography>
    <InboundTable user={user} classes={classes} fetchUser={fetchUser} />
    <Typography variant='h5' className={classes.header} >Outbound Requests</Typography>
    <OutboundTable user={user} classes={classes}  fetchUser={fetchUser}/>
    <Typography variant='h5' className={classes.header}>User Active Carpools</Typography>
    <CarpoolTable user={user} carpool={carpool} classes={classes} fetchUser={fetchUser} />
  </Grid>

const UserDetails = ({ user, classes, carpool, props }) => {
  const { address, phoneNumber} = user
  const userZip = address.zipCode
  const carpoolMiles = carpool ?
    zipcodes.distance(userZip, carpool.destination.zipCode) :
    zipcodes.distance(userZip, userZip)
  const monthlyDistance = carpoolMiles * 10 * 4
  const colors = ['#2d5d7b', '#3f51b5', '#9191e9', '#c2aff0']

  const boxes = [
    {
      title: 'Carpool Distance',
      stat: `${carpoolMiles} miles`,
      tooltip: 'Distance from address to destination'
    },
    {
      title: 'Monthly Distance',
      stat: `${monthlyDistance} miles`,
      tooltip: 'Round trip distance multipled by 20 work days per month'
    },

    {
      title: 'Estimated Monthly Gas Savings',
      stat: `$${calcGasSavings(monthlyDistance)}`,
      tooltip: "Assumptions: 28 MPG vehicle, gas is $4 a gallon, and you drive your car 25% of trips"
    },
  ]

  return (
    <Grid item xs={12}>
    <Card className={classes.userDetailsContainer} >
      <CardContent className={classes.userDetailsLeft}>
      <Typography variant='h5' >User Details</Typography>
      <Avatar
        className={classes.avatar}
        color={Avatar.getRandomColor(user.lastName, colors)}
        name={`${user.firstName} ${user.lastName}`}
        textSizeRatio={2.5}
        round
        />
      <Typography component="p" className={classes.userDeets}>
        {`Name: ${user.firstName} ${user.lastName}`}
        <br/>
        {`Address: ${address.streetNumber} ${address.city}
          ${address.state} ${address.zipCode}`}
        <br/>
        {`Email: ${user.email}`}
        <br/>
        {/* Only render if phone number exists */}
        {phoneNumber[0] && `Phone: ${phoneNumber[0]}`}
      </Typography>
      </CardContent>
      <CardContent className={classes.userDetailsRight}>
        {carpool ?
          <BingMap user={user} carpool={carpool}/>
          :<NewUserGuider  classes={classes} props={props}/>
      }
      </CardContent>
      {carpool && <CardContent className={classes.userStats}>
        {boxes.map((x,i) => <UserStatBox key={i} data={x} classes={classes}/>)}
      </CardContent>}
    </Card>
  </Grid>
  )
}


class UserProfile extends Component {
  constructor(props) {
    super(props)
    this.state= {
      carpool: undefined
    }
  }

  componentDidMount () {
    appInsights.trackPageView("user_profile")
    if(this.props.user) {
      const { user, user: { carpoolId }}= this.props
      const hasCarpool = Boolean(this.state.carpool)
      user.carpoolId && !hasCarpool && new Api().getCarpoolById({ id: carpoolId })
        .then(x =>
          this.setState({
            carpool: x
          })
        )
    }
  }

  componentDidUpdate (prev) {
    const { user, user: { carpoolId }}= this.props
    const hasCarpool = Boolean(this.state.carpool)

    user.carpoolId && !hasCarpool && new Api().getCarpoolById({ id: carpoolId })
    .then(x =>
      this.setState({
        carpool: x
      })
    )

        /**
     * Returns if we have a previous user object, and that user object was updated
     * with new carpool information, and if that new carpool information says this user
     * is not in a carpool
     */
    const needsCarpoolReset = prev.user &&
      prev.user.carpoolId !== user.carpoolId &&
      user.carpoolId === 0

    if(needsCarpoolReset) {
      this.setState({
        carpool: undefined
      })
    }
  }

  render() {
    const { classes, user, updateAuth } = this.props
    const { carpool } = this.state

    return (
      <div>
        <NavBar updateAuth={updateAuth} user={user} />
        <Grid container className={classes.core} >
          {user && <UserDetails key={1} user={user} classes={classes} carpool={carpool} props={this.props}/>}
          {user && <UserCarpools key={2} user={user} classes={classes} carpool={carpool} fetchUser={this.props.fetchUser}/>}
          {!user && <ReactLoading className={classes.loading} type={'balls'} color={'#3f51b5'} height={'20%'} width={'20%'} />}
        </Grid>
      </div>
    )
  }
}
// withStyles adds props to the parent component
// note on line 132 we take the destructure classes out of the props
// and pass to the children
export default withStyles(styles)(UserProfile)
