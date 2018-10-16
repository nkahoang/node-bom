import { Bom } from './bom'
import * as fsStore from 'cache-manager-fs-hash'
import * as geoip from 'geoip-lite'

const bom = new Bom({
  cacheStore: fsStore,
  cacheOptions: {
    path: '/tmp'
  }
})

bom.getForecastData(-33.833, 150.52808) // Sydney
  .then((data) => {
    console.log(data)
  })

bom.getForecastDataByPostcode(3141) // South Yarra, VIC
  .then((data) => {
    console.log(data)
  })

const ipData = geoip.lookup('134.178.253.144') // BOM IP Address
bom.getForecastData(ipData.ll[0], ipData.ll[1])
  .then((data) => {
    console.log(data)
  })