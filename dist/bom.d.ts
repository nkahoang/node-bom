export interface IWeatherFeed {
    forecast: string;
    observations: string;
}
export declare const BOM_FTP_HOST = "ftp.bom.gov.au";
export declare const WeatherFeeds: {
    [state: string]: IWeatherFeed;
};
export declare class BomConfig {
    bomHostname?: string;
    cacheStore?: string | any;
    ttl?: number;
    cacheOptions?: any;
}
export declare class Bom {
    private config;
    private dataCache;
    constructor(config?: BomConfig);
    downloadParsedStateData(state: string): Promise<any>;
    getParsedStateData(state: string): Promise<any>;
    _formatStationData(s: any): {
        latitude: any;
        longitude: any;
        forecastDistrictId: any;
        tz: any;
        name: any;
        height: any;
        description: any;
        type: any;
        period: any;
    };
    _formatForecast(xmlStructure: any): any;
    getNearestStation(latitude: number, longitude: number): Promise<any>;
    getNearestStationByPostcode(postcode: number): Promise<any>;
    getForecastData(latitude: number, longitude: number): Promise<any>;
    getForecastDataByPostcode(postcode: number): Promise<any>;
}
export default Bom;
