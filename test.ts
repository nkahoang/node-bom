import { Bom } from './bom'
import * as fsStore from 'cache-manager-fs-hash'
import * as geoip from 'geoip-lite'

const bom = new Bom({
  cacheStore: fsStore,
  cacheOptions: { // additional cache options go here, this will be passed to cache-manager
    options: {
      path: '/tmp'
    }
  }
})


const runTest = async (writeOutput: boolean) => {
  const formatWrite = (obj) => {
    writeOutput && console.log(JSON.stringify(obj, null, 2))
  }

  console.time('getNearestStation')
  await bom.getNearestStation(-33.833, 150.52808) //Sydney
    .then((nearestStation) => {
      console.timeEnd('getNearestStation')
      formatWrite(nearestStation) // nearest station data
    })

  console.time('getNearestStationByPostcode')
  await bom.getNearestStationByPostcode(3000) // Melbourne
    .then((nearestStation) => {
      console.timeEnd('getNearestStationByPostcode')
      formatWrite(nearestStation) // nearest station data
    })

  console.time('getForecastData')
  await bom.getForecastData(-33.833, 150.52808) // Sydney
    .then((forecastData) => {
      console.timeEnd('getForecastData')
      formatWrite(forecastData)
    })

  console.time('getForecastDataByPostcode')
  await bom.getForecastDataByPostcode(3141) // South Yarra, VIC
    .then((forecastData) => {
      console.timeEnd('getForecastDataByPostcode')
      formatWrite(forecastData)
    })

  console.time('getStationById')
  await bom.getStationById('NSW_PW006')
    .then((stationData) => {
      console.timeEnd('getStationById')
      formatWrite(stationData)
    })

  const ipData = geoip.lookup('134.178.253.144') // BOM IP Address
  await bom.getForecastData(ipData.ll[0], ipData.ll[1])
    .then((forecastData) => {
      formatWrite(forecastData)
    })
  console.log('-----')
}

runTest(false)
  .then(() => runTest(false))
