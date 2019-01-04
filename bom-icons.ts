// The JSON object can be acquired by visiting
// http://reg.bom.gov.au/info/forecast_icons.shtml
// and run the following JS
/*
  var icons = {}
  jQuery('table.icon').find("tr").toArray().map(function(e) {
      const row = jQuery(e);
      const cells = row.find('td');
      const result = {
          graphics: jQuery(cells[0]).find('img').toArray().map(i => '//reg.bom.gov.au' + jQuery(i).attr('src')),
          mobile_graphics: jQuery(cells[1]).find('img').toArray().map(i => '//reg.bom.gov.au' + jQuery(i).attr('src')),
          number: parseInt(jQuery(cells[2]).html(), 10),
          description: jQuery(cells[3]).text().trim()
      };
      return result;
  }).filter(r => r.number).forEach(r => icons[r.number] = r);
  JSON.stringify(icons, null, 2);
*/

export const Icons = {
  "1": {
    "graphics": [
      "//reg.bom.gov.au/weather-services/images/symbols/large/sunny.png"
    ],
    "mobile_graphics": [
      "//reg.bom.gov.au/weather-services/images/symbols/large/mobile/sunny.png"
    ],
    "number": 1,
    "description": "Sunny"
  },
  "2": {
    "graphics": [
      "//reg.bom.gov.au/weather-services/images/symbols/large/clear.png"
    ],
    "mobile_graphics": [
      "//reg.bom.gov.au/weather-services/images/symbols/large/mobile/clear.png"
    ],
    "number": 2,
    "description": "Clear"
  },
  "3": {
    "graphics": [
      "//reg.bom.gov.au/weather-services/images/symbols/large/partly-cloudy.png",
      "//reg.bom.gov.au/weather-services/images/symbols/large/partly-cloudy-night.png"
    ],
    "mobile_graphics": [
      "//reg.bom.gov.au/weather-services/images/symbols/large/mobile/partly-cloudy.png",
      "//reg.bom.gov.au/weather-services/images/symbols/large/mobile/partly-cloudy-night.png"
    ],
    "number": 3,
    "description": "Mostly sunny,\n        Partly cloudy"
  },
  "4": {
    "graphics": [
      "//reg.bom.gov.au/weather-services/images/symbols/large/cloudy.png"
    ],
    "mobile_graphics": [
      "//reg.bom.gov.au/weather-services/images/symbols/large/mobile/cloudy.png"
    ],
    "number": 4,
    "description": "Cloudy"
  },
  "6": {
    "graphics": [
      "//reg.bom.gov.au/weather-services/images/symbols/large/haze.png",
      "//reg.bom.gov.au/weather-services/images/symbols/large/haze-night.png"
    ],
    "mobile_graphics": [
      "//reg.bom.gov.au/weather-services/images/symbols/large/mobile/haze.png",
      "//reg.bom.gov.au/weather-services/images/symbols/large/mobile/haze-night.png"
    ],
    "number": 6,
    "description": "Hazy"
  },
  "8": {
    "graphics": [
      "//reg.bom.gov.au/weather-services/images/symbols/large/light-rain.png"
    ],
    "mobile_graphics": [
      "//reg.bom.gov.au/weather-services/images/symbols/large/mobile/light-rain.png"
    ],
    "number": 8,
    "description": "Light rain"
  },
  "9": {
    "graphics": [
      "//reg.bom.gov.au/weather-services/images/symbols/large/wind.png"
    ],
    "mobile_graphics": [
      "//reg.bom.gov.au/weather-services/images/symbols/large/mobile/wind.png"
    ],
    "number": 9,
    "description": "Windy"
  },
  "10": {
    "graphics": [
      "//reg.bom.gov.au/weather-services/images/symbols/large/fog.png",
      "//reg.bom.gov.au/weather-services/images/symbols/large/fog-night.png"
    ],
    "mobile_graphics": [
      "//reg.bom.gov.au/weather-services/images/symbols/large/mobile/fog.png",
      "//reg.bom.gov.au/weather-services/images/symbols/large/mobile/fog-night.png"
    ],
    "number": 10,
    "description": "Fog"
  },
  "11": {
    "graphics": [
      "//reg.bom.gov.au/weather-services/images/symbols/large/showers.png",
      "//reg.bom.gov.au/weather-services/images/symbols/large/showers-night.png"
    ],
    "mobile_graphics": [
      "//reg.bom.gov.au/weather-services/images/symbols/large/mobile/showers.png",
      "//reg.bom.gov.au/weather-services/images/symbols/large/mobile/showers-night.png"
    ],
    "number": 11,
    "description": "Shower"
  },
  "12": {
    "graphics": [
      "//reg.bom.gov.au/weather-services/images/symbols/large/rain.png"
    ],
    "mobile_graphics": [
      "//reg.bom.gov.au/weather-services/images/symbols/large/mobile/rain.png"
    ],
    "number": 12,
    "description": "Rain"
  },
  "13": {
    "graphics": [
      "//reg.bom.gov.au/weather-services/images/symbols/large/dust.png"
    ],
    "mobile_graphics": [
      "//reg.bom.gov.au/weather-services/images/symbols/large/mobile/dust.png"
    ],
    "number": 13,
    "description": "Dusty"
  },
  "14": {
    "graphics": [
      "//reg.bom.gov.au/weather-services/images/symbols/large/frost.png"
    ],
    "mobile_graphics": [
      "//reg.bom.gov.au/weather-services/images/symbols/large/mobile/frost.png"
    ],
    "number": 14,
    "description": "Frost"
  },
  "15": {
    "graphics": [
      "//reg.bom.gov.au/weather-services/images/symbols/large/snow.png"
    ],
    "mobile_graphics": [
      "//reg.bom.gov.au/weather-services/images/symbols/large/mobile/snow.png"
    ],
    "number": 15,
    "description": "Snow"
  },
  "16": {
    "graphics": [
      "//reg.bom.gov.au/weather-services/images/symbols/large/storm.png"
    ],
    "mobile_graphics": [
      "//reg.bom.gov.au/weather-services/images/symbols/large/mobile/storm.png"
    ],
    "number": 16,
    "description": "Storm"
  },
  "17": {
    "graphics": [
      "//reg.bom.gov.au/weather-services/images/symbols/large/light-showers.png",
      "//reg.bom.gov.au/weather-services/images/symbols/large/light-showers-night.png"
    ],
    "mobile_graphics": [
      "//reg.bom.gov.au/weather-services/images/symbols/large/mobile/light-showers.png",
      "//reg.bom.gov.au/weather-services/images/symbols/large/mobile/light-showers-night.png"
    ],
    "number": 17,
    "description": "Light shower"
  },
  "18": {
    "graphics": [
      "//reg.bom.gov.au/weather-services/images/symbols/large/heavy-showers.png"
    ],
    "mobile_graphics": [
      "//reg.bom.gov.au/weather-services/images/symbols/large/mobile/heavy-showers.png"
    ],
    "number": 18,
    "description": "Heavy shower"
  },
  "19": {
    "graphics": [
      "//reg.bom.gov.au/weather-services/images/symbols/large/tropicalcyclone.png"
    ],
    "mobile_graphics": [
      "//reg.bom.gov.au/weather-services/images/symbols/large/mobile/tropicalcyclone.png"
    ],
    "number": 19,
    "description": "Cyclone"
  }
}

export default Icons
