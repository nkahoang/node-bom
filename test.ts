import { Bom } from './bom'
import * as fsStore from 'cache-manager-fs-hash'
import * as geoip from 'geoip-lite'

const bom = new Bom({
  cacheStore: fsStore,
  cacheOptions: {
    path: '/tmp'
  }
})

const formatWrite = (obj) => {
  console.log(JSON.stringify(obj, null, 2))
}

bom.getNearestStation(-33.833, 150.52808) //Sydney
  .then((nearestStation) => {
    formatWrite(nearestStation) // nearest station data
  })

bom.getNearestStationByPostcode(3000) // Melbourne
  .then((nearestStation) => {
    formatWrite(nearestStation) // nearest station data
  })

bom.getForecastData(-33.833, 150.52808) // Sydney
  .then((forecastData) => {
    formatWrite(forecastData)
  })

bom.getForecastDataByPostcode(3141) // South Yarra, VIC
  .then((forecastData) => {
    formatWrite(forecastData)
  })

const ipData = geoip.lookup('134.178.253.144') // BOM IP Address
bom.getForecastData(ipData.ll[0], ipData.ll[1])
  .then((forecastData) => {
    formatWrite(forecastData)
  })
