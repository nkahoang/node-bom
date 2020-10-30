import {
  findNearest
} from 'geolib';
import * as cacheManager from 'cache-manager';
import * as FtpClient from 'ftp';
import {
  parseString
} from 'xml2js';
import * as Bluebird from 'bluebird'
import * as ausPostcodes from './au_postcodes';
import { Icons } from './bom-icons';

export interface IWeatherFeed {
  forecast: string;
  observations: string;
}

export interface IGetParsedStateDataOptions{
  bypassCache?: boolean
}

export const BOM_FTP_HOST = 'ftp.bom.gov.au';
export const AuPostcodes = ausPostcodes;
export const BomIcons = Icons;
export const WeatherFeeds: {
  [state: string]: IWeatherFeed;
} = {
  ACT: {
    forecast: '/anon/gen/fwo/IDN11060.xml',
    observations: '/anon/gen/fwo/IDN60920.xml'
  },
  NSW: {
    forecast: '/anon/gen/fwo/IDN11060.xml',
    observations: '/anon/gen/fwo/IDN60920.xml'
  },
  NT: {
    forecast: '/anon/gen/fwo/IDD10207.xml',
    observations: '/anon/gen/fwo/IDD60920.xml'
  },
  QLD: {
    forecast: '/anon/gen/fwo/IDQ11295.xml',
    observations: '/anon/gen/fwo/IDQ60920.xml'
  },
  SA: {
    forecast: '/anon/gen/fwo/IDS10044.xml',
    observations: '/anon/gen/fwo/IDS60920.xml'
  },
  TAS: {
    forecast: '/anon/gen/fwo/IDT16710.xml',
    observations: '/anon/gen/fwo/IDT60920.xml'
  },
  VIC: {
    forecast: '/anon/gen/fwo/IDV10753.xml',
    observations: '/anon/gen/fwo/IDV60920.xml'
  },
  WA: {
    forecast: '/anon/gen/fwo/IDW14199.xml',
    observations: '/anon/gen/fwo/IDW60920.xml'
  }
};

export class BomConfig {
  bomHostname ? : string;
  cacheStore ? : string | any;
  ttl ? : number;
  cacheOptions ? : any;
}

export class Bom {
  private config: BomConfig;
  private dataCache;
  private statePostcodeCache = {};

  constructor(config ? : BomConfig) {
    this.config = {
      bomHostname: BOM_FTP_HOST,
      cacheStore: 'memory',
      ttl: 300,
      ...config
    };

    this.dataCache = cacheManager.caching({
      store: this.config.cacheStore,
      ttl: this.config.ttl,
      ...this.config.cacheOptions
    });
  }

  getIconMeaning(icon: number | string) {
    return BomIcons[icon.toString()]
  }

  protected async _downloadParsedStateData(state: string) {
    return new Promise < any > ((resolve, reject) => {
      const c = new FtpClient();

      const downloadAndParseFtpUrl = url =>
        new Promise((resolve, reject) => {
          c.get(url, (err, stream) => {
            if (err) return reject(err);

            const chunks = [];
            stream.on('data', chunk => {
              chunks.push(chunk.toString());
            });

            stream.once('close', () => {
              const data = chunks.join('');
              parseString(data, (pErr, parsedData) => {
                if (pErr) {
                  return reject(pErr);
                }
                resolve(parsedData);
              });
            });
          });
        });

      c.on('ready', async () => {
        try {
          const value = await Promise.all([
            downloadAndParseFtpUrl(WeatherFeeds[state].forecast),
            downloadAndParseFtpUrl(WeatherFeeds[state].observations)
          ]);

          c.end();

          resolve({
            forecast: value[0],
            observations: value[1]
          });
        } catch (e) {
          reject(e);
        }
      });

      c.connect({
        host: this.config.bomHostname
      });
    });
  }

  async getParsedStateData(state: string, options?: IGetParsedStateDataOptions) {
    if (!(options && options.bypassCache)) {
      try {
        const data = await this.dataCache.get(state);
        if (data) return data;
      } catch {}
    }

    const parsedData = await this._downloadParsedStateData(state);
    await this.dataCache.set(state, parsedData);
    return parsedData;
  }

  protected _isSameState(s1: string, s2: string): boolean {
    const fs1 = s1.trim().toUpperCase()
    const fs2 = s2.trim().toUpperCase()

    return (fs1 == fs2) || (['NSWACT','ACTNSW'].indexOf(fs1+fs2) >= 0)
  }

  protected _formatStationData(s) {
    const elements = {}

    if (s.period[0].level[0].element &&
      s.period[0].level[0].element instanceof Array) {
      s.period[0].level[0].element.map((e) => {
        const units = e.$.units ? e.$.units : undefined
        const parsedValue = parseFloat(e._)
        const value = isNaN(parsedValue) ? e._ : parsedValue
        elements[e.$.type] = units ? {
          value,
          units
        } : value
      })
    }

    const forecastId = s.$['forecast-district-id']

    const obj = {
      latitude: parseFloat(s.$.lat),
      longitude: parseFloat(s.$.lon),
      bomId: s.$['bom-id'],
      wmoId: s.$['wmo-id'],
      forecastDistrictId: forecastId,
      tz: s.$.tz,
      name: s.$['stn-name'],
      height: parseFloat(s.$['stn-height']),
      description: s.$.description,
      type: s.$.type,
      period: {
        ...s.period[0].$,
        level: {
          ...s.period[0].level[0].$,
          elements
        }
      },
      state: forecastId ? forecastId.split('_')[0] : null
    }

    return obj
  }

  protected _formatForecast(xmlStructure) {
    const obj = {
      ...xmlStructure.$
    }

    xmlStructure.element.map((e) => {
      const units = e.$.units ? e.$.units : undefined
      const parsedValue = parseFloat(e._)
      const value = isNaN(parsedValue) ? e._ : parsedValue
      obj[e.$.type] = units ? {
        value,
        units
      } : value
      if (e.$.type === 'forecast_icon_code') {
        obj['icon'] = this.getIconMeaning(value)
      }
    })

    xmlStructure.text.map((e) => {
      obj[e.$.type] = e._
    })

    return obj
  }

  async getStationByBomId(id: number | string, stateFilter?: string) {
    const statesToLook = stateFilter && stateFilter.trim().length > 0 ?
      [stateFilter] : Object.keys(WeatherFeeds)

    const allStateStations = await
      Bluebird
        .mapSeries(statesToLook, (state) => this.getStateStations(state))

    const idStr = `${id}`
    return allStateStations
      .reduce((p, n) => p.concat(n), [])
      .find(s => s.bomId === idStr)
  }

  async getStateStations(state) {
    const cacheKey = `${state}:station`
    try {
      const stations = await this.dataCache.get(cacheKey)
      if (stations) {
        return stations
      }
    } catch (_) {}

    const { observations } = await this.getParsedStateData(state);
    const stations = observations.product.observations[0].station.map(s => this._formatStationData(s));

    await this.dataCache.set(cacheKey, stations);
    return stations
  }

  async getNearestStation(latitude: number, longitude: number, stateFilter?: string) {
    let state = stateFilter

    if (!state) {
      const nearest = findNearest({
        latitude,
        longitude
      }, ausPostcodes);

      const closest = ausPostcodes[(nearest as any).key];

      if (closest.nearestStationId) {
        const stationData = await this.getStationByBomId(
          closest.nearestStationId,
          closest.state_code.toUpperCase()
        )

        if (stationData) {
          return stationData
        }
      }

      state = closest.state_code.toUpperCase();
    }

    const stations = await this.getStateStations(state)

    const nearestStationResult = findNearest({
      latitude,
      longitude
    }, stations);
    const nearestStation = stations[(nearestStationResult as any).key];
    return nearestStation
  }

  async getNearestStationByPostcode(postcode: number) {
    const pcData = ausPostcodes.find(p => p.postcode === postcode)

    if (!pcData) {
      return null
    }

    if (pcData.nearestStationId) {
      const nearestStation = this.getStationByBomId(pcData.nearestStationId, pcData.state_code)
      if (nearestStation) {
        return nearestStation
      }
    }

    return this.getNearestStation(pcData.latitude, pcData.longitude, pcData.state_code)
  }

  protected _getStatePostcodes(state: string) {
    if (!this.statePostcodeCache[state]) {
      this.statePostcodeCache[state] =
        ausPostcodes.filter(p => this._isSameState(p.state_code, state))
    }

    return this.statePostcodeCache[state]
  }

  protected async _getForecastDataByStation(station: any) {
    const cacheKey = `${station.forecastDistrictId}:forecast`

    try {
      const forecastDataByStation = await this.dataCache.get(cacheKey)
      if (forecastDataByStation) {
        return forecastDataByStation
      }
    }
    catch(e) {}
    const statePostcodes = this._getStatePostcodes(station.state)

    const {
      forecast
    } = await this.getParsedStateData(station.state);

    let matchedAreas = forecast.product.forecast[0].area.filter(
      a => a.$['parent-aac'] === station.forecastDistrictId
    )

    let l = 0
    while (l < matchedAreas.length) {
      const currentArea = matchedAreas[l]
      if (!currentArea['forecast-period']) {
        // this is not the area we want as it's just the parent area
        // which doesn't have any forecast details.
        // dig deeper
        matchedAreas = matchedAreas.concat(forecast.product.forecast[0].area.filter(
          a => a.$['parent-aac'] === currentArea.$.aac
        ))
      }
      l++
    }

    const mappedAreasLocation = matchedAreas
      .filter(area => area['forecast-period'])
      .map(area => {
        const postcodeLocation = statePostcodes.find(
          p => p.place_name.toUpperCase() === area.$.description.toUpperCase()
        );

        if (!postcodeLocation) return null;

        return {
          aac: area.$.aac,
          parent_aac: area.$['parent-aac'],
          type: area.$.type,
          name: postcodeLocation.place_name,
          longitude: postcodeLocation.longitude,
          latitude: postcodeLocation.latitude,
          forecast: area['forecast-period'].map(f => this._formatForecast(f))
        };
      })
      .filter(a => a);

    const nearestAreaResult = findNearest({
        latitude: station.latitude,
        longitude: station.longitude
      },
      mappedAreasLocation
    );

    const nearestArea = mappedAreasLocation[(nearestAreaResult as any).key];

    if (nearestArea) {
      await this.dataCache.set(cacheKey, nearestArea)
    }

    return nearestArea;
  }

  async getForecastDataByStationBomId(bomId: number | string, stateFilter?: string) {
    const station = await this.getStationByBomId(bomId, stateFilter)
    return this._getForecastDataByStation(station)
  }

  async getForecastData(latitude: number, longitude: number) {
    const station = await this.getNearestStation(latitude, longitude)
    return this._getForecastDataByStation(station)
  }

  async getForecastDataByPostcode(postcode: number) {
    const station = await this.getNearestStationByPostcode(postcode)
    return this._getForecastDataByStation(station)
  }
}

export default Bom;
