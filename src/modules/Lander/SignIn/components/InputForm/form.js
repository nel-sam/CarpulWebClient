import React from "react"
import Button from "@material-ui/core/Button"
import TextField from "@material-ui/core/TextField"
import withStyles from '@material-ui/core/styles/withStyles'

const styles = theme => ({
  button: {
    marginTop: '10px'
  }
})

const Form = props => {
  const {
    values: { 
      name,
      email,
      password,
      confirmPassword,
      area,
      phone,
      street,
      city,
      state,
      zip 
    },
    errors,
    touched,
    handleSubmit,
    handleChange,
    isValid,
    setFieldTouched,
    classes
  } = props

  const change = (name, e) => {
    e.persist()
    handleChange(e)
    setFieldTouched(name, true, false)
  }
  return (
    <form onSubmit={handleSubmit}>
      <TextField
        id="name"
        name="name"
        helperText={touched.name ? errors.name : ""}
        error={touched.name && Boolean(errors.name)}
        label="Name"
        value={name}
        onChange={change.bind(null, "name")}
        fullWidth
      />
      <TextField
        id="email"
        name="email"
        helperText={touched.email ? errors.email : ""}
        error={touched.email && Boolean(errors.email)}
        label="Email"
        fullWidth
        value={email}
        onChange={change.bind(null, "email")}
      />
      <TextField
        id="password"
        name="password"
        helperText={touched.password ? errors.password : ""}
        error={touched.password && Boolean(errors.password)}
        label="Password"
        fullWidth
        type="password"
        value={password}
        onChange={change.bind(null, "password")}
      />
      <TextField
        id="confirmPassword"
        name="confirmPassword"
        helperText={touched.confirmPassword ? errors.confirmPassword : ""}
        error={touched.confirmPassword && Boolean(errors.confirmPassword)}
        label="Confirm Password"
        fullWidth
        type="password"
        value={confirmPassword}
        onChange={change.bind(null, "confirmPassword")}
      />
      <TextField
        id="area"
        name="area"
        helperText={touched.area ? errors.area : ""}
        error={touched.area && Boolean(errors.area)}
        label="Area Code"
        fullWidth
        value={area}
        onChange={change.bind(null, "area")}
      />
      <TextField
        id="phone"
        name="phone"
        helperText={touched.phone ? errors.phone : ""}
        error={touched.phone && Boolean(errors.phone)}
        label="Phone Number"
        fullWidth
        value={phone}
        onChange={change.bind(null, "phone")}
      />
      <TextField
        id="street"
        name="street"
        helperText={touched.street ? errors.street : ""}
        error={touched.street && Boolean(errors.street)}
        label="Number and Street"
        fullWidth
        value={street}
        onChange={change.bind(null, "street")}
      />
      <TextField
        id="city"
        name="city"
        helperText={touched.city ? errors.city : ""}
        error={touched.city && Boolean(errors.city)}
        label="City"
        fullWidth
        value={city}
        onChange={change.bind(null, "city")}
      />
      <TextField
        id="state"
        name="state"
        helperText={touched.state ? errors.state : ""}
        error={touched.state && Boolean(errors.state)}
        label="State"
        fullWidth
        value={state}
        onChange={change.bind(null, "state")}
      />
      <TextField
        id="zip"
        name="zip"
        helperText={touched.zip ? errors.zip : ""}
        error={touched.zip && Boolean(errors.zip)}
        label="Zipcode"
        fullWidth
        value={zip}
        onChange={change.bind(null, "zip")}
      />
      <Button
        type="submit"
        fullWidth
        variant="contained"
        color="primary"
        disabled={!isValid}
        className={classes.button}
      >
        Submit
      </Button>
    </form>
  )
}

export default withStyles(styles)(Form)