import { Pencil } from 'lucide-react'

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'

import { ChannelsTable } from './components/channels-table'

export function ChannelsManager() {
  return (
    <Dialog>
      <DialogTrigger className="group hover:cursor-pointer relative flex w-full cursor-default select-none items-center rounded-sm py-1.5 pl-8 pr-2 text-sm outline-none focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50">
        <div className="flex items-center gap-2 text-muted-foreground group-hover:text-foreground">
          <Pencil className="size-3.5" />
          <span>Editar canais de notificação</span>
        </div>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Canais de Notificação</DialogTitle>
        </DialogHeader>
        <ChannelsTable />
      </DialogContent>
    </Dialog>
  )
}
