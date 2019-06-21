import { appInsights } from '../../services/Logger'
import { keys } from '../../constants/constants'
import { ReactBingmaps } from 'react-bingmaps'
import React from 'react'

export const BingMap = ({user, carpool}) => {
  const { address } = user
  const properties = {
    bingmapKey: keys.BINGMAPS,
    directions: {
      inputPanel: 'inputPanel',
      renderOptions: {'itineraryContainer': 'itineraryContainer' },
      requestOptions: {'routeMode': 'driving', 'maxRoutes': 1},
      wayPoints: [
        {
          address: `${address.streetNumber} ${address.city}, ${address.state} ${address.zipCode}`
        },
        {
          address: `${carpool.destination.streetNumber} ${carpool.destination.city}, ${carpool.destination.state} ${carpool.destination.zipCode}`
        }
      ]
    }
  }
  appInsights.trackEvent({name: 'map_load'})
  return (
    <ReactBingmaps
      center = {[80, 80]}
      bingmapKey = {properties.bingmapKey}
      directions = {properties.directions}>
    </ReactBingmaps>
  )
}

export const BingMap2 = ({userAddress, streetNumber, city, state, zipCode}) => {

  let toAddress = '';

  if (streetNumber !== '' && city !== '' && state !== '') {
    toAddress = `${streetNumber ===''?'':streetNumber+' '}${city}${city === ''? '':', '}${state}${zipCode===''?'':' '+zipCode}`
  }

  const properties = {
    bingmapKey: keys.BINGMAPS,
    directions: {
      inputPanel: 'inputPanel',
      renderOptions: {'itineraryContainer': 'itineraryContainer' },
      requestOptions: {'routeMode': 'driving', 'maxRoutes': 1},
      wayPoints: [
        {
          address: `${userAddress.streetNumber} ${userAddress.city}, ${userAddress.state} ${userAddress.zipCode}`
        },
        {
          address: toAddress
        }
      ]
    }
  }

  appInsights.trackEvent({name: 'map_load'})
  return (
    <ReactBingmaps
      zoom = {15}
      center = {[80, 80]}
      bingmapKey = {properties.bingmapKey}
      directions = {properties.directions}>
    </ReactBingmaps>
  )
}
