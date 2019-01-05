import { Bom, AuPostcodes } from './bom'
import * as fsStore from 'cache-manager-fs-hash'
import * as Bluebird from 'bluebird'
import * as fs from 'fs'

const bom = new Bom({
  cacheStore: 'memory'
})

const generateNearestStation = async () => {
  const postcodeCache = {}
  const NewAuPostcodesList = await Bluebird.mapSeries(AuPostcodes, async (auPostcode, i) => {
    console.log('Updating ', auPostcode.postcode, ` ${i}/${AuPostcodes.length}`)
    if (!postcodeCache[auPostcode.postcode]) {
      console.time('getNearestStation')
      const station = await bom.getNearestStation(auPostcode.latitude, auPostcode.longitude, auPostcode.state_code)
      console.timeEnd('getNearestStation')
      if (station && station.bomId) {
        postcodeCache[auPostcode.postcode] = station.bomId
      }
    }

    auPostcode.nearestStationId = postcodeCache[auPostcode.postcode]
    return auPostcode
  })

  const newPostcodeFile = 'module.exports = ' + JSON.stringify(NewAuPostcodesList, null, 2) + ';\n'
  return new Promise((resolve, reject) => {
    fs.writeFile('./au_postcodes.js', newPostcodeFile, 'utf8', (err) => {
      if (err) return reject(err)
      resolve(newPostcodeFile)
    })
  })
}

generateNearestStation()
