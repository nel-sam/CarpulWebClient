import React from 'react'
import TextField from '@material-ui/core/TextField'
import Grid from '@material-ui/core/Grid'
import MenuItem from '@material-ui/core/MenuItem'
import { withStyles } from '@material-ui/core/styles'
import Button from '@material-ui/core/Button'

const stateAbbreviations = ['AL', 'AK', 'AS', 'AZ', 'AR', 'CA', 'CO', 'CT', 'DE', 'DC', 'FM', 'FL', 'GA', 'GU', 'HI', 'ID', 'IL', 'IN', 'IA', 'KS', 'KY', 'LA', 'ME', 'MH', 'MD', 'MA', 'MI', 'MN', 'MS', 'MO', 'MT', 'NE', 'NV', 'NH', 'NJ', 'NM', 'NY', 'NC', 'ND', 'MP', 'OH', 'OK', 'OR', 'PW', 'PA', 'PR', 'RI', 'SC', 'SD', 'TN', 'TX', 'UT', 'VT', 'VI', 'VA', 'WA', 'WV', 'WI', 'WY']

// This is just TextField but with styles applied
const CssTextField = withStyles({
  root: {
    '& label.Mui-focused': {
      color: 'green',
    },
    '& .MuiInput-underline:after': {
      borderBottomColor: 'green',
    },
    '& .MuiOutlinedInput-root': {
      '& fieldset': {
        borderColor: 'red',
      },
      '&:hover fieldset': {
        borderColor: 'yellow',
      },
      '&.Mui-focused fieldset': {
        borderColor: 'green',
      },
    },
  },
})(TextField);

export const NewCampusForm = ({ classes, incentiveTypes, handleChange, carpoolSubmit, state, selectedIncentiveId}) =>
  <React.Fragment>
    <TextField
      select
      fullWidth
      label="Select IncentiveType"
      value={selectedIncentiveId}
      onChange={handleChange('incentiveType')}
      margin="normal"
      variant="outlined">
      {incentiveTypes.map(option => (
        <MenuItem key={option.id} value={option.id}>
          {option.description}
        </MenuItem>
      ))}
    </TextField>
    <br />
    <CssTextField required onChange={handleChange('campus')} className={classes.input} label="Campus Name" />
    <br />
    <CssTextField required onChange={handleChange('street')} className={classes.input} label="Street Number" />
    < br />
    <CssTextField required onChange={handleChange('city')} className={classes.input} label="City" />
    <TextField
      select
      fullWidth
      label="State"
      value={state}
      onChange={handleChange('state')}
      margin="normal"
      variant="outlined">
      {stateAbbreviations.map(option => (
        <MenuItem key={option} value={option}>
          {option}
        </MenuItem>
      ))}
    </TextField>
    <CssTextField required onChange={handleChange('zip')} className={classes.input} label="Zipcode" />
    <Grid container 
      direction="row"
      justify="center"
      alignItems="center">
      <Grid item xs={12}>
        <Button
          fullWidth
          color="secondary"
          variant="contained"
          onClick={carpoolSubmit}>
          Submit
            </Button>
      </Grid>
    </Grid>
  </React.Fragment>

export const ExistingCampusForm = ({ classes, incentiveTypes, campuses, handleChange, carpoolSubmit, selectedIncentiveId, selectedCampus}) => 
  <React.Fragment>
    <TextField
      select
      fullWidth
      label="Select IncentiveType"
      value={selectedIncentiveId}
      onChange={handleChange('incentiveType')}
      margin="normal"
      variant="outlined">
      {incentiveTypes.map(option => (
        <MenuItem key={option.id} value={option.id}>
          {option.description}
        </MenuItem>
      ))}
    </TextField>
    <br />
    <TextField
      select
      fullWidth
      label="Select Campus"
      value={selectedCampus}
      onChange={handleChange('campusChoice')}
      margin="normal"
      variant="outlined">
      {campuses.map(campus => (
        <MenuItem key={campus} value={campus}>
          {campus}
        </MenuItem>
      ))}
    </TextField>
    <br />
    <Grid container 
      direction="row"
      justify="center"
      alignItems="center">
      <Grid item xs={12}>
        <Button
          fullWidth
          color="secondary"
          variant="contained"
          onClick={carpoolSubmit}>
          Submit
            </Button>
      </Grid>
    </Grid>
  </React.Fragment>