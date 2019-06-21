import React from 'react'
import PropTypes from 'prop-types'
import Avatar from '@material-ui/core/Avatar'
import Button from '@material-ui/core/Button'
import CssBaseline from '@material-ui/core/CssBaseline'
import FormControl from '@material-ui/core/FormControl'
import Modal from '@material-ui/core/Modal'
import Input from '@material-ui/core/Input'
import InputLabel from '@material-ui/core/InputLabel'
import Link from '@material-ui/core/Link'
import LockOutlinedIcon from '@material-ui/icons/LockOutlined'
import Paper from '@material-ui/core/Paper'
import Typography from '@material-ui/core/Typography'
import withStyles from '@material-ui/core/styles/withStyles'
import InputForm from './components/InputForm'
import { styles } from './styles'

/**
 *
 * This component is a variation of the standard MaterialUI signin component.
 * Info: https://github.com/mui-org/material-ui/tree/master/docs/src/pages/getting-started/page-layout-examples/sign-in
 */

function getModalStyle() {
  return {
    top: `10%`,
    left: `35%`,
    transform: `translate(-10%, -35}%)`,
    borderRadius: '4px'
  }
}

const SignIn =({ classes, formActions, isAuthing, updateAuth, history }) => {
  const [modalStyle] = React.useState(getModalStyle)
  const [open, setOpen] = React.useState(false)
  

  const handleOpen = () => {
    setOpen(true)
  }

  const handleClose = () => {
    setOpen(false)
  }

  return (
    <main className={classes.main}>
        <CssBaseline />
        <Paper className={classes.paper}>
          <Avatar className={classes.avatar}>
            <LockOutlinedIcon />
          </Avatar>
          <Typography component="h1" variant="h5">
            Sign in
          </Typography>
          <form className={classes.form}>
            <FormControl margin="normal" required fullWidth>
              <InputLabel htmlFor="email">Email Address</InputLabel>
              {/* Update the state variable name as you type */}
              <Input id="email" name="email" autoComplete="email" autoFocus onChange={formActions.handleChange('name')} />
            </FormControl>
            <FormControl margin="normal" required fullWidth>
              <InputLabel htmlFor="password">Password</InputLabel>
              {/* Update the state variable pass as you type */}
              <Input name="password" type="password" id="password" autoComplete="current-password" onChange={formActions.handleChange('pass')}/>
            </FormControl>
            <Button
              onClick={!isAuthing ? formActions.handleSubmit : () => null}
              fullWidth
              variant="contained"
              color="secondary"
              className={classes.submit}
            >
              {!isAuthing ? 'Sign in' : 'Loading...'}
            </Button>
          </form>
          <Typography className={classes.sigupUpBanner} component="p" >
            Need to Register? 
            <Link onClick={handleOpen} className={classes.link}> Sign Up here.</Link>
          </Typography>
          <Modal
            aria-labelledby="sign-up-modal"
            aria-describedby="sign-up-modal"
            open={open}
            onClose={handleClose}
          >
            <div style={modalStyle} className={classes.modal}>
              <Typography variant="h6" id="modal-title">
                Please Sign Up Below
              </Typography>
              <InputForm
                close={handleClose}
                updateAuth={updateAuth}
                history={history}/>
            </div>
          </Modal>
        </Paper>    
    </main>
  )
}

SignIn.propTypes = {
  classes: PropTypes.object.isRequired,
  formActions: PropTypes.object.isRequired,
  isAuthing: PropTypes.bool.isRequired,
}

export default withStyles(styles)(SignIn)