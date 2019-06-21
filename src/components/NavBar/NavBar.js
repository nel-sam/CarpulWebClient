import React from 'react'
import { Link, withRouter } from 'react-router-dom'
import { auth } from '../../services/Authentication'
import PropTypes from 'prop-types'
import AppBar from '@material-ui/core/AppBar'
import Toolbar from '@material-ui/core/Toolbar'
import IconButton from '@material-ui/core/IconButton'
import Typography from '@material-ui/core/Typography'
import Button from '@material-ui/core/Button'
import MenuItem from '@material-ui/core/MenuItem'
import Menu from '@material-ui/core/Menu'
import { fade } from '@material-ui/core/styles/colorManipulator'
import { withStyles } from '@material-ui/core/styles'
import MenuIcon from '@material-ui/icons/Menu'
import AccountCircle from '@material-ui/icons/AccountCircle'
import MoreIcon from '@material-ui/icons/MoreVert'

const styles = theme => ({
  root: {
    width: '100%',
  },
  grow: {
    flexGrow: 1,
  },
  menuButton: {
    marginLeft: -12,
    marginRight: 20,
  },
  title: {
    display: 'none',
    [theme.breakpoints.up('sm')]: {
      display: 'block',
    },
  },
  search: {
    position: 'relative',
    borderRadius: theme.shape.borderRadius,
    backgroundColor: fade(theme.palette.common.white, 0.15),
    '&:hover': {
      backgroundColor: fade(theme.palette.common.white, 0.25),
    },
    marginRight: theme.spacing.unit * 2,
    marginLeft: 0,
    width: '100%',
    [theme.breakpoints.up('sm')]: {
      marginLeft: theme.spacing.unit * 3,
      width: 'auto',
    },
  },
  searchIcon: {
    width: theme.spacing.unit * 9,
    height: '100%',
    position: 'absolute',
    pointerEvents: 'none',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  inputRoot: {
    color: 'inherit',
    width: '100%',
  },
  inputInput: {
    paddingTop: theme.spacing.unit,
    paddingRight: theme.spacing.unit,
    paddingBottom: theme.spacing.unit,
    paddingLeft: theme.spacing.unit * 10,
    transition: theme.transitions.create('width'),
    width: '100%',
    [theme.breakpoints.up('md')]: {
      width: 200,
    },
  },
  sectionDesktop: {
    display: 'none',
    [theme.breakpoints.up('md')]: {
      display: 'flex',
    },
  },
  sectionMobile: {
    display: 'flex',
    [theme.breakpoints.up('md')]: {
      display: 'none',
    },
  },
})

class PrimarySearchAppBar extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      anchorEl: null
      // mobileMoreAnchorEl: null,
    }
  }

  handleProfileMenuOpen = event => {
    this.setState({ anchorEl: event.currentTarget })
  }

  handleMenuClose = ({ to, history}) => () => {
    this.setState({ anchorEl: null })
    // this.handleMobileMenuClose()
    if(to === '/') {
      new auth().logout()
      return this.props.updateAuth(history)
    } else {
      history.push('/user')
    }

  }

  // handleMobileMenuOpen = event => {
  //   this.setState({ mobileMoreAnchorEl: event.currentTarget })
  // }

  // handleMobileMenuClose = () => {
  //   this.setState({ mobileMoreAnchorEl: null })
  // }

  render() {
    const { anchorEl } = this.state
    const { classes, history, user } = this.props
    const isMenuOpen = Boolean(anchorEl)
    const canCreateCarpool = Boolean(user && !user.carpoolId)
    // const isMobileMenuOpen = Boolean(mobileMoreAnchorEl)

    const renderMenu = (
      <Menu
        anchorEl={anchorEl}
        anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
        transformOrigin={{ vertical: 'top', horizontal: 'right' }}
        open={isMenuOpen}
        onClose={this.handleMenuClose}
      >
        <MenuItem onClick={this.handleMenuClose({ to:'/user', history })}>Profile</MenuItem>
        <MenuItem onClick={this.handleMenuClose({ to:'/', history })}>Logout</MenuItem>
      </Menu>
    )

    // @todo Revisit if we want to support a mobile menu

    // const renderMobileMenu = (
    //   <Menu
    //     anchorEl={mobileMoreAnchorEl}
    //     anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
    //     transformOrigin={{ vertical: 'top', horizontal: 'right' }}
    //     open={isMobileMenuOpen}
    //     onClose={this.handleMenuClose}
    //   >
    //     <MenuItem onClick={this.handleMobileMenuClose}>
    //       <IconButton color="inherit">
    //         <Badge badgeContent={4} color="secondary">
    //           <MailIcon />
    //         </Badge>
    //       </IconButton>
    //       <p>Messages</p>
    //     </MenuItem>
    //     <MenuItem onClick={this.handleMobileMenuClose}>
    //       <IconButton color="inherit">
    //         <Badge badgeContent={11} color="secondary">
    //           <NotificationsIcon />
    //         </Badge>
    //       </IconButton>
    //       <p>Notifications</p>
    //     </MenuItem>
    //     <MenuItem onClick={this.handleProfileMenuOpen}>
    //       <IconButton color="inherit">
    //         <AccountCircle />
    //       </IconButton>
    //       <p>Profile</p>
    //     </MenuItem>
    //   </Menu>
    // )
    
    return (
      <div className={classes.root}>
        <AppBar position="static">
          <Toolbar>
            <IconButton className={classes.menuButton} color="inherit" aria-label="Open drawer">
              <MenuIcon />
            </IconButton>
            <Typography className={classes.title} variant="h6" color="inherit" noWrap>
              Carpül
            </Typography>
            <div className={classes.grow} />
            <div className={classes.sectionDesktop}>
              <Button component={Link} to="/list" color="inherit">
                Find Carpool
              </Button>
              {canCreateCarpool && <Button component={Link} to="/create" color="inherit">
                Create Carpool
              </Button>}
              <IconButton
                aria-owns={isMenuOpen ? 'material-appbar' : undefined}
                aria-haspopup="true"
                onClick={this.handleProfileMenuOpen}
                color="inherit"
              >
                <AccountCircle />
              </IconButton>
            </div>
            <div className={classes.sectionMobile}>
              <IconButton aria-haspopup="true" onClick={this.handleMobileMenuOpen} color="inherit">
                <MoreIcon />
              </IconButton>
            </div>
          </Toolbar>
        </AppBar>
        {renderMenu}
        {/* {renderMobileMenu} */}
      </div>
    )
  }
}

PrimarySearchAppBar.propTypes = {
  classes: PropTypes.object.isRequired,
}
// withRouter gives access to `history` prop which is needed in the menu drop
// down
export default withRouter(withStyles(styles)(PrimarySearchAppBar))