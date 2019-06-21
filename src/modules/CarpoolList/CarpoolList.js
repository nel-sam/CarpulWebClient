import React, { Component } from 'react'
import { withStyles } from '@material-ui/core/styles'
import Grid from '@material-ui/core/Grid'
import Card from '@material-ui/core/Card'
import { CardContent } from '@material-ui/core'
import Table from '@material-ui/core/Table'
import TableBody from '@material-ui/core/TableBody'
import TableCell from '@material-ui/core/TableCell'
import TableHead from '@material-ui/core/TableHead'
import TableRow from '@material-ui/core/TableRow'
import Paper from '@material-ui/core/Paper'
import FormControl from '@material-ui/core/FormControl'
import Input from '@material-ui/core/Input'
import InputLabel from '@material-ui/core/InputLabel'
import Link from '@material-ui/core/Link'
import Typography from '@material-ui/core/Typography'
import { appInsights } from '../../services/Logger'
import NavBar from '../../components/NavBar/NavBar'
import IconButton from '@material-ui/core/IconButton'
import DirectionsCar from '@material-ui/icons/DirectionsCar'
import HighlightOff from '@material-ui/icons/HighlightOff'
import Schedule from '@material-ui/icons/Schedule'
import { Api } from '../../services/ApiService'
import { requestActions } from '../../constants/constants'

const styles = () => ({
  core: {
    width: '90%',
    margin: 'auto'
  },
  root: {
    width: '100%',
    overflowX: 'auto'
  },
  header: {
    paddingTop: '14px',
    paddingBottom: '7px'
  },
  table: {
    marginTop: '20px'
  },
  start: {
    width: '90%',
    margin: 'auto',
    marginTop: '200px',
    textAlign: 'center'
  },
  link: {
    cursor: 'pointer'
  },
  oopsCard: {
    textAlign: 'center'
  }
})

/**
 * Case insensitive search to use with search by admin name
 * 
 * @param {string} a 
 * @param {string} b
 * 
 * @returns a boolean true or false 
 */
const lowercaseCompare = (a,b) => a.toLowerCase().indexOf(b.toLowerCase()) >= 0

const SearchBox = ({ user, changeFn, searchByName, searchByZip, name, zip, classes }) => {
  return (
    <Grid item xs={6} className={classes.table}>
    <Card >
      <CardContent>
      <Typography variant='h5' >Search for a Carpool</Typography>
      <FormControl margin="normal" fullWidth>
        <InputLabel htmlFor="name">Search by Admin Name</InputLabel>
        {zip ? <Input id="name" name="name" disabled value="" /> :
        <Input id="name" name="name" autoFocus onChange={changeFn('name')} />}
      </FormControl>
      <FormControl margin="normal" fullWidth>
        <InputLabel htmlFor="zip">Search By Destination Zip</InputLabel>
        {/* Update the state variable pass as you type */}
        {name ? <Input name="zip" type="text" id="zip" disabled value=""/> :
        <Input name="zip" type="text" id="zip" onChange={changeFn('zip')}/>}
      </FormControl>
      </CardContent>
    </Card>
  </Grid>
  )
}

/**
 * 
 * @todo Send custom message in modal  
 */
const JoinCarpool = ({ user, target, fetchUser }) => {
  const joinReq = () => {
    const { CREATE } = requestActions
    const payload = {
      firstName: user.firstName,
      lastName: user.lastName,
      message: "I would like to join your carpool.",
      carpoolId: target.id,
      action: CREATE
    }
    appInsights.trackEvent({name: 'user_action_CREATE'})
    // make API request with our constructed payload
    // callback will fetch user after the api request is complete
    new Api().sendCarpoolAction(payload)
      // not the best to timeout like this but it does work
      // better to wait for the response but that means a lot 
      // of setup work
      .then(setTimeout(fetchUser,500))
  }
  const isPending = user.outboundRequests.filter((r) => r.carpoolId === target.id).length
  const isInCarpool = user.carpoolId

  if (isPending) {
    return (
      <IconButton disabled onClick={() => null}>
        <Schedule color="disabled" />
      </IconButton>
    )
  }
  if (isInCarpool) {
    return (
      <IconButton disabled onClick={() => null}>
        <HighlightOff color="disabled" />
      </IconButton>
    )
  }
  return (
    <IconButton onClick={joinReq}>
      <DirectionsCar color="primary" />
    </IconButton>
  )
}

export const AvailableCarpools = ({ filteredCarpools, classes, user, fetchUser }) => 
  <Paper className={`${classes.root} ${classes.table}`}>
    <Table>
      <TableHead>
        <TableRow>
          <TableCell >Campus</TableCell>
          <TableCell >Owner</TableCell>
          <TableCell >Email</TableCell>
          <TableCell >Incentive</TableCell>
          <TableCell >Join</TableCell>
        </TableRow>
      </TableHead>
      <TableBody>
        {filteredCarpools.map((c,i) => (
          <TableRow key={i}>
            <TableCell >{`${c.campus}, ${c.destination.zipCode}`}</TableCell>
            <TableCell >{`${c.owner.firstName} ${c.owner.lastName}`}</TableCell>
            <TableCell >{c.owner.email}</TableCell>            
            <TableCell >{c.incentive}</TableCell>            
            <TableCell >
              <JoinCarpool user={user} target={c} fetchUser={fetchUser}/>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  </Paper>

class CarpoolList extends Component {
  constructor(props) {
    super(props)
    this.state = {
      name: "",
      zip: "",
      carpools:[],
      filteredCarpools: []
    }
    this.handleChange = this.handleChange.bind(this)
  }
  componentDidMount () {
    new Api().getAllCarpools().then(x => this.setState({carpools:x}))
    appInsights.trackPageView("carpool_list")
  }
  componentDidUpdate (prevProps, prevState) {
    const { name, zip, carpools, filteredCarpools } = this.state
    /**
     * This function checks to see if we have two falsy values. If we do, 
     * we want to clear the list (no search results for no search)
     */
    if(!name && !zip && filteredCarpools.length) {
      this.setState({
        filteredCarpools:[]
      })
    }

    /**
     * This function will filter all carpools based on the zipcode
     */
    if(zip && (prevState.zip !== zip)) {
      this.setState({
        filteredCarpools: carpools
          .filter(x => x.destination.zipCode.indexOf(zip) >=0)
      })
    }
    /**
     * This function will filter all carpools based on name
     */
    if(name && (prevState.name !== name)) {
      this.setState({
        filteredCarpools: carpools
        .filter(x => 
          lowercaseCompare(x.owner.firstName, name) ||
          lowercaseCompare(x.owner.lastName, name)
        )
      })
    }
  }

  handleChange = name => event => {
    if(name === 'name') {
      this.setState({
        zip:false
      })
    } else {
      this.setState({
        name:false
      })
    }

    this.setState({
      [name]: event.target.value,
    })
  }

  render() {
    const { updateAuth, classes, user, fetchUser } = this.props
    const { name, zip, filteredCarpools } = this.state
    
    return (
      <div>
      <NavBar updateAuth={updateAuth} user={user} />      
      <Grid container className={classes.core} >
        <Grid item xs={12} className="userProfile">
          <Typography variant='h3' className={`${classes.header} ${classes.uPheader}`}>Carpool Locator</Typography>
          <SearchBox user={user}
            changeFn={this.handleChange}
            name={name}
            zip={zip}
            classes={classes}
          />
          {/* user.carpoolId here will actually render a 0 if not in carpool, so we need to make it boolean */}
          {user.carpoolId > 0 && 
            <Grid item xs={12} className={classes.table}>
              <Card className={classes.oopsCard}>
                <CardContent>
                  <Typography variant="subtitle1" align='center' color='textSecondary'>
                    Oops...Looks like you are already in a carpool. You must leave your current carpool first.
                  </Typography>
                  <Link onClick={() => this.props.history.push('/user')} className={classes.link}> Go to User Profile</Link>
                </CardContent>
              </Card>
            </Grid>}
          {(zip || name) && <AvailableCarpools user={user} filteredCarpools={filteredCarpools} classes={classes} fetchUser={fetchUser}/>} 
          {!zip && !name && 
            <Typography variant="subtitle1" gutterBottom className={classes.start}>
            Start Typing to Display List of Results...
            </Typography>}
        </Grid>
      </Grid>
    </div>
    )
  }
}

export default withStyles(styles)(CarpoolList)
