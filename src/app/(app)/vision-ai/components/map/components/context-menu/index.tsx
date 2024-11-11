'use client'

/* eslint-disable @next/next/no-img-element */
import { type PickingInfo } from 'deck.gl'
import { useState } from 'react'

import { Popover, PopoverContent } from '@/components/ui/popover'

import { AISPInfo } from './components/aisp-info'
import { calculateTooltipAbsolutePosition } from './components/calculate-tooltip-absolute-position'
import { CameraInfo } from './components/camera-info'
import { CISPInfo } from './components/cisp-info'
import { SchoolInfo } from './components/school-info'

interface ContextMenuProps {
  pickingInfo: PickingInfo | null
  open: boolean
  onOpenChange: (open: boolean) => void
  setContextMenuPickingInfo: (pickingInfo: PickingInfo | null) => void
}

export function ContextMenu({
  pickingInfo,
  onOpenChange,
  setContextMenuPickingInfo,
  open,
}: ContextMenuProps) {
  const [cardRef, setCardRef] = useState<HTMLDivElement | null>(null)

  const { top, left } = pickingInfo
    ? calculateTooltipAbsolutePosition(
        pickingInfo,
        cardRef?.clientWidth,
        cardRef?.clientHeight,
      )
    : { top: 0, left: 0 }

  const Content = ({ pickingInfo }: { pickingInfo: PickingInfo }) => {
    if (pickingInfo?.layer?.id === 'AISP') {
      return <AISPInfo pickingInfo={pickingInfo} />
    }

    if (pickingInfo?.layer?.id === 'CISP') {
      return <CISPInfo pickingInfo={pickingInfo} />
    }

    if (pickingInfo?.layer?.id === 'schools') {
      return <SchoolInfo pickingInfo={pickingInfo} />
    }
  }

  function handleOnOpenChange(e: boolean) {
    if (e === false) {
      setContextMenuPickingInfo(null)
      onOpenChange(false)
    }
    onOpenChange(true)
  }

  return (
    <Popover open={open} onOpenChange={handleOnOpenChange} modal={false}>
      {pickingInfo?.layer?.id &&
        ['AISP', 'CISP', 'schools'].includes(pickingInfo.layer.id) && (
          <PopoverContent
            ref={(ref) => setCardRef(ref)}
            style={{
              position: 'absolute',
              top,
              left,
              width: '400px',
            }}
          >
            <Content pickingInfo={pickingInfo} />
          </PopoverContent>
        )}
      <PopoverContent
        ref={(ref) => setCardRef(ref)}
        style={{
          position: 'absolute',
          top,
          left,
          width: '400px',
          display: pickingInfo ? 'block' : 'none',
        }}
      >
        <CameraInfo pickingInfo={pickingInfo} />
      </PopoverContent>
    </Popover>
  )
}
