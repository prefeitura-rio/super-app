'use client'

/* eslint-disable @next/next/no-img-element */
import type { PickingInfo } from 'deck.gl'
import { Fullscreen, Hash, MapPin } from 'lucide-react'
import Link from 'next/link'
import { useEffect, useState } from 'react'

import { Spinner } from '@/components/custom/spinner'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import { cn } from '@/lib/utils'
import type { Camera } from '@/models/entities'

const InfoItem = ({
  icon: Icon,
  label,
  value,
}: {
  icon: React.ElementType
  label: string
  value: React.ReactNode
}) => (
  <div className="flex flex-col">
    <div className="flex items-center gap-1">
      <Icon className="size-3.5 shrink-0" />
      <span className="text-xs font-medium text-muted-foreground">{label}</span>
    </div>
    <span className="text-xs">{value}</span>
  </div>
)

export function CameraInfo({
  pickingInfo,
}: {
  pickingInfo: PickingInfo<Camera> | undefined | null
}) {
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    setIsLoading(true)
  }, [pickingInfo?.object])

  return (
    <div className={cn('h-full w-full', pickingInfo?.object ? '' : 'hidden')}>
      <h4>Câmera COR</h4>
      <Separator className="mb-4 mt-1 bg-secondary" />
      <div className="flex flex-col gap-4">
        <InfoItem icon={Hash} label="ID" value={pickingInfo?.object?.id} />

        <InfoItem
          icon={MapPin}
          label="Localidade"
          value={`${pickingInfo?.object?.name} - ${pickingInfo?.object?.zone}`}
        />

        <div className="relative flex aspect-video w-full items-center justify-center">
          <img
            src={pickingInfo?.object?.streamingUrl}
            alt="Streaming"
            className={cn(
              'aspect-video w-full rounded-lg bg-border',
              isLoading ? 'hidden' : '',
            )}
            onLoad={() => setIsLoading(false)}
          />
          {!isLoading && (
            <Button
              variant="ghost"
              asChild
              className="absolute bottom-1 right-1 h-6 p-1"
            >
              <Link
                href={pickingInfo?.object?.streamingUrl || ''}
                className="text-xs text-muted-foreground"
                target="_blank"
              >
                <Fullscreen className="h-4 w-4 text-primary" />
              </Link>
            </Button>
          )}
          {isLoading && <Spinner className="size-10" />}
        </div>
      </div>
    </div>
  )
}
