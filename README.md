# node-bom
NodeJS/Typescript library to access Australian Bureau of Meteorology weather data.

[![npm version](https://badge.fury.io/js/node-bom.svg)](https://badge.fury.io/js/node-bom)

## Examples

Importing

```js
import { Bom } from 'node-bom'

const bom = new Bom({
  /// options
})
```

Getting BOM's parsed state weather data:

```js
bom.getParsedStateData('VIC', {
  bypassCache: false // default: false to use cache
})
  .then((stateData) => {
    console.log(stateData)
    /*
      {
        forecast: {}, // forecast data
        observations: {} // current station's observations data
      }
    */
  })
```

Get current weather data. There are 3 methods to query current data and forecast data:
- Using a longitude latitude (slowest, as it needs to find the nearest station)
- Using an Australian postcode (e.g. `3141`, `2000`)
- Using a station ID (e.g. `'250042'` - use `stateFilter` param to speed up)

Current data (or Station's observation)

```js
bom.getNearestStation(-33.833, 150.52808) //Sydney
  .then((nearestStation) => {
    console.log(nearestStation) // nearest station data
  })

bom.getNearestStationByPostcode(3000) // Melbourne
  .then((nearestStation) => {
    console.log(nearestStation) // nearest station data
  })

bom.getStationByBomId('250042', 'NSW')
  /* **Note**: the second parameter is optional, however due to the way
  BOM structures their dataset, the station data is tied to a state.
  Without specifying a state, the library will attempt to download all state data
  and this might cause excessive long time. Therefore it's recommended to use this
  api with the state filter param */
  .then((station) => {
    console.log(station)
  })
```

Get weather forecast data

```js
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

// Getting forecast data based on postcode
bom.getForecastDataByStationId('NSW_PW006', 'NSW')
  /* **Note**: the second parameter is optional, however due to the way
  BOM structures their dataset, the station data is tied to a state.
  Without specifying a state, the library will attempt to download all state data
  and this might cause excessive long time. Therefore it's recommended to use this
  api with the state filter param */
  .then((data) => {
    console.log(data)
  })
```

Using an external package to resolve geoip such as `geoip-lite`, you can resolve the geolocation then utilise it to find weather data

```js
import * as geoip from 'geoip-lite'
// Getting forecast data based on IP address
// this depends on an external package: `geoip-lite`

const ipData = geoip.lookup('134.178.253.144') // BOM IP Address
bom.getForecastData(ipData.ll[0], ipData.ll[1])
  .then((data) => {
    console.log(data)
  })

bom.getForecastDataByIpAddress('134.178.253.144') // BOM IP Address
  .then((data) => {
    console.log(data)
  })

```

### Caching

This library utilises caching heavily. The library uses memory caching by default using node cache-manager.

It's recommended that you change to a custom cache backend:

File cache:
```js
import { Bom } from 'node-bom'
import * as fsStore from 'cache-manager-fs-hash'

const bom = new Bom({
  cacheStore: fsStore,
  cacheOptions: {
    // additional cache options go here, this will be passed to cache-manager
    options: {
      path: './tmp'
    }
  }
})
```

Redis cache:
```js
import { Bom } from 'node-bom'
import * as redisStore from 'cache-manager-ioredis'

const bom = new Bom({
  cacheStore: redisStore,
  cacheOptions: {
    host: 'localhost',
    port: 6379,
    db: 0,
    ttl: 600
  }
})
```

## Building the library

1. Clone the repo
2. Install node_modules

```
npm install
```

3. Update the `au_postcodes.js` file (it automatically detects the latest nearest station list and cache the station's ID onto the file)
```
npm run update-nearest-station
```

4. Test / Package up
```
npm run test
npm run dist
```

## MIT Licensed

Weather data © Copyright Commonwealth of Australia 2018, Bureau of Meteorology http://www.bom.gov.au
