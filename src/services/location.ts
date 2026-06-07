export interface LocationCoordinates {
  latitude: number
  longitude: number
}

/**
 * Reverse geocodes latitude & longitude into a human-readable area + city name.
 * Uses the free OpenStreetMap Nominatim reverse geocoding API.
 */
export const reverseGeocodeNominatim = async (lat: number, lon: number): Promise<string> => {
  try {
    const url = `https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lon}&format=json&accept-language=en`
    const response = await fetch(url, {
      headers: {
        'User-Agent': 'ZestoFoodApp/1.0 (aparnajakka27-sudo/zestothefoodapp)'
      }
    })
    if (!response.ok) throw new Error('Nominatim geocoder error')
    
    const data = await response.json()
    const addr = data.address || {}
    
    // Attempt to parse a readable area name
    const area = addr.suburb || addr.neighbourhood || addr.village || addr.town || addr.suburbs || addr.quarter || addr.city_district || '';
    const city = addr.city || addr.town || addr.state || '';
    
    if (area && city) {
      return `${area}, ${city}`
    } else if (city) {
      return city
    } else if (data.display_name) {
      // Fallback: split display_name and take first two sections
      const parts = data.display_name.split(',')
      return parts.slice(0, 2).map((p: string) => p.trim()).join(', ')
    }
    
    return `${lat.toFixed(4)}, ${lon.toFixed(4)}`
  } catch (error) {
    console.error('Reverse geocoding failed:', error)
    return `${lat.toFixed(4)}, ${lon.toFixed(4)}`
  }
}

/**
 * Calculates the average geographic midpoint coordinate of a list of coordinates.
 * This identifies the ideal central meeting area for multiple friends.
 */
export const calculateMidpoint = (coords: LocationCoordinates[]): LocationCoordinates | null => {
  if (!coords || coords.length === 0) return null
  if (coords.length === 1) return coords[0]

  let totalLat = 0
  let totalLon = 0

  coords.forEach((coord) => {
    totalLat += coord.latitude
    totalLon += coord.longitude
  })

  return {
    latitude: totalLat / coords.length,
    longitude: totalLon / coords.length
  }
}
