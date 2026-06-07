import { useState } from 'react'
import { useRoomStore } from '../lib/roomStore'
import { reverseGeocodeNominatim } from '../services/location'

export interface LocationState {
  latitude: number | null
  longitude: number | null
  areaName: string | null
  isLoading: boolean
  error: string | null
}

export const useLocation = () => {
  const [localState, setLocalState] = useState<LocationState>({
    latitude: null,
    longitude: null,
    areaName: null,
    isLoading: false,
    error: null
  })


  const requestGPSLocation = async (): Promise<LocationState> => {
    setLocalState((prev) => ({ ...prev, isLoading: true, error: null }))
    useRoomStore.setState({ locationPermission: 'requesting', validationError: null })

    return new Promise((resolve) => {
      if (!navigator.geolocation) {
        const errorMsg = 'Geolocation is not supported by your browser.'
        setLocalState((prev) => ({ ...prev, isLoading: false, error: errorMsg }))
        useRoomStore.setState({ locationPermission: 'denied', validationError: errorMsg })
        resolve({
          latitude: null,
          longitude: null,
          areaName: null,
          isLoading: false,
          error: errorMsg
        })
        return
      }

      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const lat = position.coords.latitude
          const lon = position.coords.longitude

          // Set temporary status in store
          useRoomStore.setState({
            latitude: lat,
            longitude: lon,
            locationPermission: 'granted',
            detectedAreaName: 'Reverse geocoding...'
          })
          localStorage.setItem('zesto_latitude', String(lat))
          localStorage.setItem('zesto_longitude', String(lon))
          localStorage.setItem('zesto_location_permission', 'granted')

          // Reverse geocode via free Nominatim
          const area = await reverseGeocodeNominatim(lat, lon)

          useRoomStore.setState({ detectedAreaName: area })
          localStorage.setItem('zesto_area_name', area)

          const successState = {
            latitude: lat,
            longitude: lon,
            areaName: area,
            isLoading: false,
            error: null
          }

          setLocalState(successState)
          resolve(successState)
        },
        (error) => {
          let errorMsg = 'Failed to retrieve location.'
          if (error.code === error.PERMISSION_DENIED) {
            errorMsg = 'Allow location access to find restaurants near you.'
          } else if (error.code === error.POSITION_UNAVAILABLE) {
            errorMsg = 'Location information is unavailable.'
          } else if (error.code === error.TIMEOUT) {
            errorMsg = 'Request to get location timed out.'
          }

          const errorState = {
            latitude: null,
            longitude: null,
            areaName: null,
            isLoading: false,
            error: errorMsg
          }

          setLocalState(errorState)
          useRoomStore.setState({ locationPermission: 'denied', validationError: errorMsg })
          localStorage.setItem('zesto_location_permission', 'denied')
          resolve(errorState)
        },
        { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
      )
    })
  }

  // Get current global values from store
  const latitude = useRoomStore((state) => state.latitude)
  const longitude = useRoomStore((state) => state.longitude)
  const detectedAreaName = useRoomStore((state) => state.detectedAreaName)
  const locationPermission = useRoomStore((state) => state.locationPermission)

  return {
    ...localState,
    latitude,
    longitude,
    areaName: detectedAreaName || localState.areaName,
    detectedAreaName,
    locationPermission,
    requestGPSLocation
  }
}
