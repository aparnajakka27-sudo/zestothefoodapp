import type { Restaurant } from '../types'
import { calculateDistance } from './googleMaps'

// Unsplash food images mapping to provide high-quality premium imagery for matches
const FOOD_IMAGES: Record<string, string[]> = {
  'Pizza': [
    'https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&w=600&q=80',
    'https://images.unsplash.com/photo-1590947132387-155cc02f3212?auto=format&fit=crop&w=600&q=80',
    'https://images.unsplash.com/photo-1574071318508-1cdbab80d002?auto=format&fit=crop&w=600&q=80'
  ],
  'Biryani': [
    'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?auto=format&fit=crop&w=600&q=80',
    'https://images.unsplash.com/photo-1633945274405-b6c8069047b0?auto=format&fit=crop&w=600&q=80'
  ],
  'Burgers': [
    'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=600&q=80',
    'https://images.unsplash.com/photo-1586190848861-99aa4a171e90?auto=format&fit=crop&w=600&q=80'
  ],
  'Ramen': [
    'https://images.unsplash.com/photo-1569718212165-3a8278d5f624?auto=format&fit=crop&w=600&q=80',
    'https://images.unsplash.com/photo-1557872943-16a5ac26437e?auto=format&fit=crop&w=600&q=80'
  ],
  'Chinese': [
    'https://images.unsplash.com/photo-1585032226651-759b368d7246?auto=format&fit=crop&w=600&q=80',
    'https://images.unsplash.com/photo-1563245372-f21724e3856d?auto=format&fit=crop&w=600&q=80'
  ],
  'Cafe': [
    'https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?auto=format&fit=crop&w=600&q=80',
    'https://images.unsplash.com/photo-1498804103079-a6351b050096?auto=format&fit=crop&w=600&q=80'
  ],
  'Desserts': [
    'https://images.unsplash.com/photo-1508737027454-e6454ef45afd?auto=format&fit=crop&w=600&q=80',
    'https://images.unsplash.com/photo-1562376502-6f769499c886?auto=format&fit=crop&w=600&q=80'
  ]
}

const getDefaultFoodImage = (index: number): string => {
  const defaults = [
    'https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=600&q=80',
    'https://images.unsplash.com/photo-1498837167922-ddd27525d352?auto=format&fit=crop&w=600&q=80',
    'https://images.unsplash.com/photo-1493770348161-369560ae357d?auto=format&fit=crop&w=600&q=80'
  ]
  return defaults[index % defaults.length]
}

const getRestaurantImage = (cravings: string[], mainCuisine: string, index: number): string => {
  const tag = cravings[0] || mainCuisine || 'Pizza'
  const list = FOOD_IMAGES[tag] || FOOD_IMAGES['Pizza']
  return list[index % list.length] || getDefaultFoodImage(index)
}

/**
 * Fetches nearby restaurants using coordinates and a radius.
 * Directly queries the FREE OpenStreetMap Overpass API interpreter.
 */
export const fetchRestaurantsOverpass = async (
  lat: number,
  lon: number,
  radiusKm: number,
  cravings: string[],
  budget: string
): Promise<Restaurant[]> => {
  try {
    const radiusMeters = radiusKm * 1000
    const overpassUrl = 'https://overpass-api.de/api/interpreter'
    const query = `
      [out:json][timeout:25];
      (
        node["amenity"="restaurant"](around:${radiusMeters},${lat},${lon});
        way["amenity"="restaurant"](around:${radiusMeters},${lat},${lon});
        node["amenity"="cafe"](around:${radiusMeters},${lat},${lon});
        way["amenity"="cafe"](around:${radiusMeters},${lat},${lon});
        node["amenity"="fast_food"](around:${radiusMeters},${lat},${lon});
        way["amenity"="fast_food"](around:${radiusMeters},${lat},${lon});
      );
      out center;
    `.trim()

    const response = await fetch(overpassUrl, {
      method: 'POST',
      body: query
    })

    if (!response.ok) throw new Error('Overpass server returned error status')
    const data = await response.json()
    const elements = data.elements || []

    const results: Restaurant[] = elements.map((el: any, idx: number) => {
      const name = el.tags.name || el.tags.brand || el.tags.operator || 'Charming Local Dining'
      const elLat = el.lat || el.center?.lat || lat
      const elLon = el.lon || el.center?.lon || lon
      const distVal = calculateDistance(lat, lon, elLat, elLon)

      // Extract cuisine
      const cuisinesList = el.tags.cuisine ? el.tags.cuisine.split(';').map((c: string) => c.trim()) : []
      const mainCuisine = cuisinesList[0] || el.tags.amenity || 'Restaurant'

      // Stable hash calculations based on OSM Node ID for persistent mock ratings/counts
      const hashVal = el.id ? el.id : idx
      const rating = parseFloat((4.0 + (hashVal % 10) / 10).toFixed(1))
      const reviewsCount = Math.floor(45 + (hashVal % 1450))

      const discountOptions = [
        '15% OFF today',
        'Buy 1 Get 1 Free',
        'Free drinks above ₹399',
        '10% OFF on booking',
        'Complimentary Dessert'
      ]
      const discounts = discountOptions[hashVal % discountOptions.length]

      const descriptions = [
        'A local favorite for premium quality courses, cozy seating, and warm ambiance.',
        'Known for its prompt service, fresh ingredients, and signature delicacies.',
        'A warm, friendly bistro serving mouth-watering recipes using traditional techniques.',
        'Elegant interior combined with highly-rated cuisines cooked fresh by master chefs.'
      ]
      const description = descriptions[hashVal % descriptions.length]

      return {
        id: el.id ? `osm-${el.id}` : `osm-id-${idx}`,
        name,
        image: getRestaurantImage(cravings, mainCuisine, idx),
        rating,
        reviewsCount,
        price: budget,
        distance: `${distVal} KM away`,
        description,
        tags: [mainCuisine, budget === '₹₹' ? 'Mid Range' : budget === '₹' ? 'Budget' : 'Premium'],
        matchPercentage: 80 + (hashVal % 20),
        loveCount: 0,
        fineCount: 0,
        preferNotCount: 0,
        hardPassCount: 0,
        isEliminated: false,
        discounts,
        popularDishes: el.tags.speciality ? el.tags.speciality.split(';') : ['Chef Special Platter', 'Craft Mocktails'],
        isOpen: el.tags.opening_hours ? !el.tags.opening_hours.includes('closed') : true
      }
    })

    // Filter by cravings/cuisines if selected
    if (cravings.length > 0) {
      const filtered = results.filter((r) =>
        cravings.some((c) =>
          r.name.toLowerCase().includes(c.toLowerCase()) ||
          r.tags.some((t) => t.toLowerCase().includes(c.toLowerCase()))
        )
      )
      if (filtered.length > 0) return filtered
    }

    return results
  } catch (error) {
    console.error('Overpass API query failed:', error)
    return []
  }
}
