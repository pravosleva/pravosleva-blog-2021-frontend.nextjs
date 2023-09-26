/*
{ range: [ 3479297920, 3479301339 ],
  country: 'US',
  region: 'TX',
  city: 'San Antonio',
  ll: [ 29.4889, -98.3987 ],
  metro: 641,
  zip: 78218 }
*/

  interface IData {
    range: number[]
    country?: string
    region?: string
    city?: string
    ll?: number[]
    metro?: string
    zip?: number
  }
  
  export const getGeoDataStr = (geo: IData): string => {
    let str = ''
  
    if (!!geo) {
      if (!!geo.country) {
        str += `${geo.country}`
      }
      if (!!geo.region) {
        if (str) {
          str += `, ${geo.region}`
        } else {
          str += `${geo.region}`
        }
      }
      if (!!geo.city) {
        if (str) {
          str += `, ${geo.city}`
        } else {
          str += `${geo.city}`
        }
      }
    }
    if (!!str) str = `, ${str}`
  
    return str
  }
  