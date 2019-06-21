import React, { Component } from "react"
import { Formik } from "formik"
import withStyles from "@material-ui/core/styles/withStyles"
import Form from "./form"
import * as Yup from "yup"
import { Api } from '../../../../../services/ApiService'
import { appInsights } from '../../../../../services/Logger'
import { auth } from '../../../../../services/Authentication'

const styles = theme => ({
  paper: {
    marginTop: theme.spacing.unit * 8,
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    padding: `${theme.spacing.unit * 5}px ${theme.spacing.unit * 5}px ${theme
      .spacing.unit * 5}px`
  },
  container: {
    maxWidth: "200px"
  }
})

const validationSchema = Yup.object({
  name: Yup.string("Enter a name")
    .required("Name is required"),
  email: Yup.string("Enter your email")
    .email("Enter a valid email")
    .required("Email is required"),
  password: Yup.string("")
    .min(8, "Password must contain atleast 8 characters")
    .required("Enter your password"),
  confirmPassword: Yup.string("Enter your password")
    .required("Confirm your password")
    .oneOf([Yup.ref("password")], "Password does not match"),
  area: Yup.string("")
    .length(3, "Area Code is 3 characters"),
  phone: Yup.string("")
    .length(7, "Phone is 7 characters"),
  street: Yup.string("")
    .required('Address is required.'),
  city: Yup.string("")
    .required('Address is required.'),
  state: Yup.string("")
    .length(2, "Please type state abbrevation in caps")
    .required('Address is required.'),
  zip: Yup.number()
    .required('Address is required.')
    .moreThan(9999, "Please enter valid 6 character zip")
    .lessThan(100000, "Please enter valid 6 character zip")
})

class InputForm extends Component {
  constructor(props) {
    super(props)
    this.state = {
      name: "",
      email: "",
      area: "",
      phone: "",
      street: "",
      city: "",
      state: "",
      zip: ""
    }
  }

  submitValues = ({ 
    name,
    email,
    confirmPassword,
    password,
    area,
    phone,
    street,
    city,
    state,
    zip }) => {
    const payload = {
      firstName: name.split(" ")[0],
      lastName: name.split(" ")[1],
      email,
      password,
      areaCode: area,
      phoneNumber: phone,
      address: {
        streetNumber: street,
        city,
        state: state.toUpperCase(),
        zipCode: zip
      }
    }

    new Api().createUser(payload).then(() => {
      new auth().login(email, password).then(() => {
        appInsights.trackEvent({name: 'user_signup'})
        this.props.close()
        this.props.updateAuth(this.props.history)
      })
    })
  }

  render() {
    const classes = this.props
    const { name, email, area, phone, street, city, state, zip } = this.state
    const values = {
      name: name,
      email: email,
      confirmPassword: "",
      password: "",
      area: area,
      phone: phone,
      street: street,
      city: city,
      state: state,
      zip: zip
    }
    return (
      <React.Fragment>
        <div className={classes.container}>
          <Formik
            render={props => <Form {...props} />}
            initialValues={values}
            validationSchema={validationSchema}
            onSubmit={this.submitValues}
          />
        </div>
      </React.Fragment>
    )
  }
}

export default withStyles(styles)(InputForm)
