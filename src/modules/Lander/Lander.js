import React, { Component } from 'react'
import Grid from '@material-ui/core/Grid'
import Paper from '@material-ui/core/Paper'
import { withStyles } from '@material-ui/core/styles'
import Typography from '@material-ui/core/Typography'
import indigo from '@material-ui/core/colors/indigo'
import SignIn from './SignIn/SignIn'
import LanderCard from './LanderCards/LanderCards'
import { auth } from '../../services/Authentication'
import { appInsights } from '../../services/Logger'
import { ToastContainer, toast } from 'react-toastify'
import { LOGIN_ERROR } from '../../constants/constants'

const styles = theme => ({
  mainFeaturedPost: {
    backgroundColor: indigo[500],
    color: theme.palette.common.white,
    marginBottom: theme.spacing.unit * 4,
  },
  main: {
    padding: `50px`,
    [theme.breakpoints.up('md')]: {
      paddingRight: 0,
    },
  },
  textField: {
    marginLeft: theme.spacing.unit,
    marginRight: theme.spacing.unit,
    color: 'white',
    borderColor: 'white'
  },
  button: {
    margin: 'auto'
  },
  root: {
    flexGrow: 1,
  },
  paper: {
    height: 140,
    width: 100,
  }
});

class Lander extends Component {
  constructor(props) {
    super(props)
    this.state = {
      isAuthing: false
    }
    this.handleChange=this.handleChange.bind(this)
    this.handleSubmit=this.handleSubmit.bind(this)
  }

  componentDidMount() {
    appInsights.trackPageView("lander")
  }

  handleChange = name => event => {
    this.setState({
      [name]: event.target.value,
    })
  }

  handleSubmit = (e) => {
    // stop default actions from occurring
    e.preventDefault()
    e.stopPropagation()
    this.setState({
      isAuthing: true
    })
    new auth().login(this.state.name, this.state.pass).then(x => {
      if(x === LOGIN_ERROR) {
        // Show error if response is login error constant
        toast.error('Login Failure.',{
          position: toast.POSITION.TOP_CENTER,
          autoClose: 5000
        })
        // Reset state to try again
        this.setState({
          isAuthing: false
        })
      } else {
        this.props.updateAuth(this.props.history)
      }
    })
    
  }

  componentWillMount () {
    this.props.isAuthed && this.props.history.push('/user')
  }

  render() {
    const { classes, isAuthed } = this.props
    const formActions = {
      handleChange: this.handleChange,
      handleSubmit: this.handleSubmit,
    }
    const cards = [
      {
        title: 'Forget Driving',
        desc: 'Sit back and read a book, browse your social media, or just nap as someone else drives you to work.',
        img: 'https://cdn.pixabay.com/photo/2019/05/09/09/44/oldtimer-4190813_960_720.jpg'
      },
      {
        title: 'Reduce Climate Change',
        desc: 'Earth benefits by having less cars on the road. Get on the right side of history and do your part to reduce emissions.',
        img: 'https://cdn.pixabay.com/photo/2015/12/01/20/28/road-1072823__480.jpg'
      },
      {
        title: 'Be Modern',
        desc: 'Driving your own car will be as archaic as riding your horse to get groceries. Why not start early and join a carpool?',
        img: 'https://cdn.pixabay.com/photo/2017/01/18/16/46/hong-kong-1990268_1280.jpg'
      }
    ]

    return (
      // This handles the case where you are authed but still need
      // to fetch the user. There is a short time in between that
      // happening
      isAuthed ? <div></div> :
      <div>
      <ToastContainer />
      <Paper className={classes.mainFeaturedPost}>
        <Grid key={1} container>
          <Grid item md={6}>
            <div className={classes.main}>
              <Typography component="h1" variant="h3" color="inherit" gutterBottom>
                Carpül
              </Typography>
              <Typography variant="h5" color="inherit" paragraph>
                Let us help you get to work in a carpool with your coworkers
              </Typography>
            </div>
          </Grid>
          <Grid item md={6}>
            <div className={classes.main}>
              <SignIn 
                formActions={formActions}
                isAuthing={this.state.isAuthing}
                updateAuth={this.props.updateAuth}
                history={this.props.history}
              />
            </div>
          </Grid>
        </Grid>
      </Paper>
      <Grid container className={classes.root} spacing={16}>
        <Grid item xs={12}>
          <Grid container className={classes.demo} justify="center" spacing={40}>
            {cards.map((x,i) =>
              <Grid key={i} item>
              <LanderCard data={x} />
            </Grid>
            )}
          </Grid>
        </Grid>
      </Grid>
    </div>
    )
  }
}

export default withStyles(styles)(Lander)
