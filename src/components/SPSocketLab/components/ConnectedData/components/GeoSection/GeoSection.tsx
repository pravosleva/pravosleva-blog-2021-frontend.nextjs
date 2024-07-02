import { useMemo, Suspense, useState, useCallback, memo } from 'react'
// @ts-ignore
// import { Map, Marker, Popup, TileLayer } from 'react-leaflet-universal'
// import { MapContainer, Marker, Popup, TileLayer } from 'react-leaflet'
import { NEvent } from '~/components/SPSocketLab/components/ConnectedData/withSocketContext'
// import { useMap } from 'react-leaflet/hooks'
import clsx from 'clsx'
import { CircularIndeterminate } from '~/mui/CircularIndeterminate'
// import dynamic from 'next/dynamic'
// import loadable from '@loadable/component'
import Map, { Marker, NavigationControl, Popup } from 'react-map-gl'
import { Pin } from './Pin'

const MAPBOX_TOKEN = process.env.MAPBOX_TOKEN

// @ts-ignore
// const DynamicMapContainer = loadable(() => import(/* webpackChunkName: "react-leaflet-MapContainer" */ 'react-leaflet').then((mod) => mod.MapContainer), { ssr: false })
// // @ts-ignore
// const DynamicMarker = loadable(() => import(/* webpackChunkName: "react-leaflet-Marker" */ 'react-leaflet').then((mod) => mod.Marker), { ssr: false })
// // @ts-ignore
// const DynamicPopup = loadable(() => import(/* webpackChunkName: "react-leaflet-Popup" */ 'react-leaflet').then((mod) => mod.Popup), { ssr: false })
// // @ts-ignore
// const DynamicTileLayer = loadable(() => import(/* webpackChunkName: "react-leaflet-TileLayer" */ 'react-leaflet').then((mod) => mod.TileLayer), { ssr: false })

type TProps = {
  report: NEvent.TReport;
  // _geoip: NEvent.TGeoIpInfo;
  // coords: [number, number];
}

export const GeoSection =  memo(({ report }: TProps) => {
  const isBrowser = useMemo(() => typeof window !== 'undefined', [typeof window])
  const isServer = useMemo(() => typeof window === 'undefined', [typeof window])
  if (isServer) return <CircularIndeterminate />

  const point = {
    latitude: report._geoip?.ll[0],
    longitude: report._geoip?.ll[1],
    zoom: 10,
  }

  const [isPopupOpened, setIsPopupOpened] = useState(false)
  const handleClosePopup = useCallback(() => {
    console.log('- closed')
    setIsPopupOpened(false)
  }, [setIsPopupOpened])
  const handleOpenPopup = useCallback(() => {
    console.log('- opened')
    setIsPopupOpened(true)
  }, [setIsPopupOpened])
  // const togglePopup = useCallback(() => {
  //   setIsPopupOpened((s) => !s)
  // }, [setIsPopupOpened])

  if (!report._geoip || !isBrowser) return null
  return (
    <Suspense fallback={<CircularIndeterminate />}>
      <Map
        initialViewState={point}
        // mapStyle='mapbox://styles/mapbox/dark-v9'
        mapStyle='mapbox://styles/mapbox/navigation-day-v1'
        mapboxAccessToken={MAPBOX_TOKEN}
      >
        <Marker
          longitude={point.longitude || 0}
          latitude={point.latitude || 0}
          anchor='bottom'
          // draggable
          // onDragStart={onMarkerDragStart}
          // onDrag={onMarkerDrag}
          // onDragEnd={onMarkerDragEnd}
          onClick={(e) => {
            // If we let the click event propagates to the map, it will immediately close the popup
            // with `closeOnClick: true`
            e.originalEvent.stopPropagation()
            handleOpenPopup()
          }}
        >
          <Pin />
        </Marker>
        {
          isPopupOpened && (
            <Popup
              anchor='top'
              latitude={Number(point.latitude || 0)}
              longitude={Number(point.longitude || 0)}
              onClose={handleClosePopup}
              closeButton={true}
              // offsetLeft={10}
            >
              <div>
                {clsx([report._geoip.country, report._geoip.region, report._geoip.city])}
                {/* <a
                  target="_new"
                  href={`http://en.wikipedia.org/w/index.php?title=Special:Search&search=${popupInfo.city}, ${popupInfo.state}`}
                >
                  Wikipedia
                </a> */}
              </div>
              {/* <img width="100%" src={popupInfo.image} /> */}
            </Popup>
          )
        }
        <NavigationControl />
      </Map>
    </Suspense>
  )
})
