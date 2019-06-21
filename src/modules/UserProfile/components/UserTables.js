import React from 'react'
import Table from '@material-ui/core/Table'
import Typography from '@material-ui/core/Typography'
import TableBody from '@material-ui/core/TableBody'
import TableCell from '@material-ui/core/TableCell'
import TableHead from '@material-ui/core/TableHead'
import TableRow from '@material-ui/core/TableRow'
import Paper from '@material-ui/core/Paper'
import IconButton from '@material-ui/core/IconButton'
import DeleteIcon from '@material-ui/icons/Delete'
import CheckCircle from '@material-ui/icons/CheckCircle'
import { requestActions } from '../../../constants/constants'
import { Api } from '../../../services/ApiService'
import { appInsights } from '../../../services/Logger'


/**
 * Create = 0,
 * Approve = 1,
 * Reject = 2,
 * Delete = 3
 */
const { APPROVE, REJECT, DELETE } = requestActions

const CarpoolActions = ({ actions }) => {
  return actions.map((x,i) => {
    const { Component, clickHandler, color } = x
    return (
      <IconButton key={i} onClick={clickHandler}>
        <Component color={color}/>
      </IconButton>
    )
  })
}

const clickHandleGenerator = ({req, action, fetchUser }) => () => {
  const payload = {
    firstName: req.firstName === undefined ? req.owner.firstName : req.firstName,
    lastName: req.lastName === undefined ? req.owner.lastName : req.lastName,
    message: "Generic API Message here.",
    carpoolId: req.id || req.carpoolId,
    action: action
  }

  // Track action separately (based on passed in action)
  appInsights.trackEvent({name: `user_action_${action}`})

  new Api().sendCarpoolAction(payload)
      .then(setTimeout(fetchUser,500))
      .catch(console.log('API error'))
}

const NoTableData = ({ displayStr, classes }) =>
    <Typography variant="subtitle1" align='center' gutterBottom color='textSecondary'>
        {`No ${displayStr}.`}
      </Typography>

export const InboundTable = ({ user: {inboundRequests:[...rest]}, classes , fetchUser }) => {
  if(rest.length) {
    return <Paper className={classes.root}>
    <Table>
        <TableHead>
          <TableRow>
            <TableCell >From</TableCell>
            <TableCell >Message</TableCell>
            <TableCell >Approval</TableCell>
            <TableCell >Approve</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {rest.map((req,i) => {
            const actions = [
              {
                Component: CheckCircle,
                clickHandler: clickHandleGenerator({req: req, action: APPROVE, fetchUser}),
                color: 'primary'
              },
              {
                Component: DeleteIcon,
                clickHandler: clickHandleGenerator({req: req, action: REJECT, fetchUser}),
                color: 'secondary'
              }
            ]
            return (
              <TableRow key={i}>
                <TableCell >{`${req.firstName} ${req.lastName}`}</TableCell>
                <TableCell >{req.message}</TableCell>
                <TableCell >{req.approval}</TableCell>
                <TableCell >
                  <CarpoolActions actions={actions} />
                </TableCell>
              </TableRow>
          )})}
        </TableBody>
      </Table>
    </Paper>
  }
  return <NoTableData displayStr='Inbound Requests' />
}

export const OutboundTable = ({ user: {outboundRequests:[...rest]}, classes, fetchUser }) => {
  if(rest.length) {
    return <Paper className={classes.root}>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell >From</TableCell>
            <TableCell >Message</TableCell>
            <TableCell >Approval</TableCell>
            <TableCell >Delete</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
        {rest.map((req,i) => {
            const actions = [
              {
                Component: DeleteIcon,
                clickHandler: clickHandleGenerator({req: req, action: DELETE, fetchUser}),
                color: 'secondary'
              }
            ]
            return (
              <TableRow key={i}>
                <TableCell >{`${req.firstName} ${req.lastName}`}</TableCell>
                <TableCell >{req.message}</TableCell>
                <TableCell >{req.approval}</TableCell>
                <TableCell >
                  <CarpoolActions actions={actions} />
                </TableCell>
              </TableRow>
          )})}
        </TableBody>
      </Table>
    </Paper>
  }
  return <NoTableData displayStr='Outbound Requests' />

}
/**
 * @todo: Still need to figure out how we fetch carpools
 */
export const CarpoolTable = ({ carpool, classes, fetchUser }) => {
  if(carpool) {
    return <Paper className={classes.root}>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell >Carpool Admin</TableCell>
            <TableCell >Admin Email</TableCell>
            <TableCell >Destination</TableCell>
            <TableCell >Incentive</TableCell>
            <TableCell >Leave</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {carpool && <TableRow key={1}>
            <TableCell >{`${carpool.owner.firstName} ${carpool.owner.lastName}`}</TableCell>
            <TableCell >{carpool.owner.email}</TableCell>
            <TableCell >{carpool.campus || 'Destination Unknown'}</TableCell>
            <TableCell >{carpool.incentive || 'Incentive Unknown'}</TableCell>
            <TableCell >
              <CarpoolActions actions={[
              {
                Component: DeleteIcon,
                clickHandler: clickHandleGenerator({req: carpool, action: DELETE, fetchUser}),
                color: 'secondary'
              }
            ]} />
            </TableCell>
          </TableRow>}
        </TableBody>
      </Table>
    </Paper>
  }
  return <NoTableData displayStr='Active Carpools' />
}