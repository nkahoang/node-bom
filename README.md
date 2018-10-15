# node-bom
[![npm version](https://badge.fury.io/js/node-bom.svg)](https://badge.fury.io/js/node-bom)

NodeJS/Typescript library to access Australian Bureau of Meteorology data.


```js
import { Bom } from 'node-bom'

const bom = new Bom()

// Getting forecast data based on latitude / longitude
bom.getForecastData(-33.833, 150.52808) // Sydney
  .then((data) => {
    console.log(data)
  })

// Getting forecast data based on postcode
bom.getForecastDataByPostcode(3141) // South Yarra, VIC
  .then((data) => {
    console.log(data)
  })

// Getting forecast data based on IP address
bom.getForecastDataByIpAddress('134.178.253.144') // BOM IP Address
  .then((data) => {
    console.log(data)
  })

```

The library uses memory caching by default using node cache-manager. To change to a custom cache backend:

```js
import { Bom } from 'node-bom'
import * as fsStore from 'cache-manager-fs-hash'

const bom = new Bom({
  cacheStore: fsStore,
  cacheOptions: {
    path: '/tmp'
  }
})
```

## MIT Licensed

Weather data © Copyright Commonwealth of Australia 2018, Bureau of Meteorology http://www.bom.gov.au