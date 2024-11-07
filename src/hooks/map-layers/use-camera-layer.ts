'use client'

import type { LayersList } from '@deck.gl/core'
import { IconLayer } from '@deck.gl/layers'
import {
  type Dispatch,
  type SetStateAction,
  useEffect,
  useMemo,
  useState,
} from 'react'

import cameraIconAtlas from '@/assets/camera-icon-atlas.png'
import type { Camera } from '@/models/entities'
import { getCamerasAction } from '@/server-cache/cameras'

export interface UseCameraLayer {
  cameras: Camera[]
  selectedCameras: Camera[]
  setSelectedCameras: Dispatch<SetStateAction<Camera[]>>
  layers: LayersList
  isVisible: boolean
  setIsVisible: (isVisible: boolean) => void
  selectedObject: Camera | null
  handleSelectObject: (camera: Camera | null) => void
}
export function useCameraLayer(): UseCameraLayer {
  const [selectedCameras, setSelectedCameras] = useState<Camera[]>([])
  const [cameras, setCameras] = useState<Camera[]>([])
  const [isVisible, setIsVisible] = useState(true)
  const [selectedObject, setSelectedObject] = useState<Camera | null>(null)

  useEffect(() => {
    const fetchCameras = async () => {
      const data = await getCamerasAction()
      setCameras(data)
    }
    fetchCameras()
  }, [])

  function handleSelectObject(camera: Camera | null) {
    if (camera === null || selectedObject?.name === camera.name) {
      setSelectedObject(null)
    } else {
      setSelectedObject(camera)
    }
  }

  const baseLayer = useMemo(
    () =>
      new IconLayer<Camera>({
        id: 'cameras',
        data: cameras,
        pickable: true,
        getSize: 24,
        autoHighlight: true,
        highlightColor: [7, 76, 128, 250], // CIVITAS-dark-blue
        visible: isVisible,
        iconAtlas: cameraIconAtlas.src,
        iconMapping: {
          default: {
            x: 0,
            y: 0,
            width: 48,
            height: 48,
            mask: false,
          },
          highlighted: {
            x: 48,
            y: 0,
            width: 48,
            height: 48,
            mask: false,
          },
        },
        getIcon: (d) => {
          if (selectedCameras.find((c) => c.id === d.id)) {
            return 'highlighted'
          }

          return 'default'
        },
        getPosition: (d) => [d.longitude, d.latitude],
      }),

    [cameras, isVisible, selectedCameras],
  )

  return {
    cameras,
    selectedCameras,
    setSelectedCameras,
    layers: [baseLayer],
    isVisible,
    setIsVisible,
    selectedObject,
    handleSelectObject,
  }
}
