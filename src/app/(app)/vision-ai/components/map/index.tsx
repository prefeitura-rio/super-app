/* eslint-disable @typescript-eslint/no-explicit-any */
'use client'

import 'mapbox-gl/dist/mapbox-gl.css'

import DeckGL, { type DeckGLRef } from '@deck.gl/react'
import { type MouseEvent, useCallback, useContext, useRef } from 'react'
import { Map as MapGL, type MapRef } from 'react-map-gl'

import { VisionAIMapContext } from '@/contexts/vision-ai/map-context'
import type { Camera } from '@/models/entities'
import { getMapStyle } from '@/utils/map/get-map-style'

import { ContextMenu } from './components/context-menu'
import { LayerToggle } from './components/map-controls/layer-toggle'

interface MapProps {
  mapboxAccessToken: string
}

export default function Map({ mapboxAccessToken }: MapProps) {
  const deckRef = useRef<DeckGLRef | null>(null)
  const mapRef = useRef<MapRef | null>(null)

  const {
    layers: {
      cameras: { layers: cameraLayer, setSelectedCameras: selectCamera },
      AISP: { layers: AISPLayer },
      CISP: { layers: CISPLayer },
      schools: { layers: schoolsLayer },
      busStops: { layers: busStopsLayer },
    },
    viewState,
    setViewState,
    mapStyle,
    contextMenuPickingInfo,
    openContextMenu,
    setContextMenuPickingInfo,
    setOpenContextMenu,
  } = useContext(VisionAIMapContext)

  const layers = [
    ...AISPLayer,
    ...CISPLayer,
    cameraLayer,
    schoolsLayer,
    busStopsLayer,
  ]

  function onRightClick(e: MouseEvent) {
    e.preventDefault()
    const y = e.clientY
    const x = e.clientX
    const info = deckRef.current?.pickObject({ x, y, radius: 0 })
    setContextMenuPickingInfo(info || null)
    setOpenContextMenu(!!info)
  }

  function onLeftClick(e: MouseEvent) {
    e.preventDefault()
    const y = e.clientY
    const x = e.clientX
    const info = deckRef.current?.pickObject({ x, y, radius: 0 })

    if (info?.layer?.id === 'cameras' && info.object) {
      selectCamera((prev) => [...prev, info.object as Camera])
    }
  }

  const onViewStateChange = useCallback(
    ({ viewState }: { viewState: any }) => {
      setViewState(viewState)
    },
    [setViewState],
  )

  return (
    <div
      className="h-full w-full relative"
      onContextMenu={onRightClick}
      onClick={onLeftClick}
    >
      <DeckGL
        ref={deckRef}
        initialViewState={viewState}
        controller={true}
        layers={layers}
        viewState={viewState}
        onViewStateChange={onViewStateChange}
        getCursor={({ isDragging, isHovering }) => {
          if (isDragging) return 'grabbing'
          if (isHovering) return 'pointer'
          return 'grab'
        }}
      >
        <MapGL
          ref={mapRef}
          mapStyle={getMapStyle(mapStyle)}
          mapboxAccessToken={mapboxAccessToken}
        />
        <LayerToggle />
        <ContextMenu
          open={openContextMenu}
          onOpenChange={setOpenContextMenu}
          pickingInfo={contextMenuPickingInfo}
        />
      </DeckGL>
    </div>
  )
}
