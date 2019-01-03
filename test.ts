import { Bom } from './dist/bom'
import * as fsStore from 'cache-manager-fs-hash'
import * as geoip from 'geoip-lite'

const bom = new Bom({
  cacheStore: fsStore,
  cacheOptions: {
    path: '/tmp'
  }
})

bom.getNearestStation(-33.833, 150.52808) //Sydney
  .then((nearestStation) => {
    console.log(nearestStation) // nearest station data
    console.log(nearestStation.period.level.elements) // nearest station elements
  })

bom.getNearestStationByPostcode(3000) // Melbourne 
  .then((nearestStation) => {
    console.log(nearestStation) // nearest station data
  })

bom.getForecastData(-33.833, 150.52808) // Sydney
  .then((forecastData) => {
    console.log(forecastData)
  })

bom.getForecastDataByPostcode(3141) // South Yarra, VIC
  .then((forecastData) => {
    console.log(forecastData)
  })

const ipData = geoip.lookup('134.178.253.144') // BOM IP Address
bom.getForecastData(ipData.ll[0], ipData.ll[1])
  .then((forecastData) => {
    console.log(forecastData)
  })
