import { Bom } from './bom'
import * as fsStore from 'cache-manager-fs-hash'

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

bom.getForecastDataByIpAddress('134.178.253.144') // BOM IP Address
  .then((data) => {
    console.log(data)
  })