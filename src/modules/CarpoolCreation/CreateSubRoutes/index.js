import React from 'react'
import Typography from '@material-ui/core/Typography'

export const SubRoutes = ({ routes, updater, active, classes }) => {
  
  return (
  <div className={classes.subRouteContainer}>
    {routes.map((x,i) => 
    <div
      key={i}
      className={x === active ? classes.activeRoute : classes.route}
      onClick={updater(x)}
      >
        <Typography variant='h6'>{x}</Typography>
    </div>
    )}
  </div>)
}