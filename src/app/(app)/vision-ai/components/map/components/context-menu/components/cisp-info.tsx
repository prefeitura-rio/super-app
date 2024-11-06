import type { PickingInfo } from 'deck.gl'
import type { Feature, Geometry } from 'geojson'
import { Phone, User } from 'lucide-react'
import { useContext } from 'react'

import { Separator } from '@/components/ui/separator'
import { VisionAIMapContext } from '@/contexts/vision-ai/map-context'
import type { CISP } from '@/models/entities'

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

export function CISPInfo({
  pickingInfo,
}: {
  pickingInfo: PickingInfo<Feature<Geometry, CISP>>
}) {
  const { object } = pickingInfo
  const {
    layers: {
      AISP: {
        features: { features: aisps },
      },
    },
  } = useContext(VisionAIMapContext)

  const aisp = aisps.find(
    (aisp) => aisp.properties.aisp === object?.properties.aisp,
  )

  return (
    <div className="h-full w-full">
      <h4>Circunscrições Integradas de Segurança Pública (CISP)</h4>
      <Separator className="mb-4 mt-1 bg-secondary" />
      <div className="flex flex-col gap-4">
        <InfoItem
          icon={User}
          label="Unidade CISP"
          value={object?.properties?.nome}
        />
        <InfoItem
          icon={User}
          label="Unidade AISP"
          value={aisp?.properties.unidade}
        />

        <div className="space-y-2">
          <h4 className="text-lg font-semibold">Contato</h4>
          <Separator className="bg-secondary" />
          <div className="grid gap-4">
            <InfoItem
              icon={User}
              label="Responsável"
              value={object?.properties?.responsavel}
            />
            <InfoItem
              icon={Phone}
              label="Telefone do responsável"
              value={object?.properties?.telefone}
            />
            <InfoItem
              icon={Phone}
              label="Celular do responsável"
              value={object?.properties?.celular}
            />
          </div>
        </div>
      </div>
    </div>
  )
}
