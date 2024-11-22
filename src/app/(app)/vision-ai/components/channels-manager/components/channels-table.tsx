'use client'

import { Check, Pencil, Plus, Trash2, X } from 'lucide-react'
import { useRef, useState } from 'react'
import { toast } from 'sonner'

import { Spinner } from '@/components/custom/spinner'
import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { useNotificationChannels } from '@/hooks/use-queries/use-notification-channels'
import { createNotificationChannel } from '@/http/notification-channel/create-notification-channel'
import { deleteNotificationChannel } from '@/http/notification-channel/delete-notification-channel'
import { updateNotificationChannel } from '@/http/notification-channel/update-notification-channel'
import { queryClient } from '@/lib/react-query'
import { cn } from '@/lib/utils'
import type { NotificationChannel } from '@/models/entities'

export function ChannelsTable() {
  const { data: channels } = useNotificationChannels()
  const [showNewChannelInput, setShowNewChannelInput] = useState(false)
  const [edittingChannel, setEdittingChannel] = useState<string | null>(null)
  const [channelName, setChannelName] = useState<string>('')
  const [isLoading, setIsLoading] = useState(false)
  const [isDeleteAlertOpen, setIsDeleteAlertOpen] = useState(false)
  const newChannelInputRef = useRef<HTMLInputElement>(null)
  const editChannelInputRef = useRef<HTMLInputElement>(null)

  async function handleAddChannel(name: string) {
    if (!name) {
      newChannelInputRef.current?.focus()
      return
    }

    setIsLoading(true)

    createNotificationChannel(name)
      .then((newChannel) => {
        setChannelName('')
        const cached = queryClient.getQueryData<NotificationChannel[]>([
          'notification-channels',
        ])

        if (!cached) return

        queryClient.setQueryData<NotificationChannel[]>(
          ['notification-channels'],
          [...cached, newChannel],
        )
      })
      .catch(() => {
        toast.error('Erro ao criar canal. Tente novamente.')
      })
      .finally(() => {
        setShowNewChannelInput(false)
        setIsLoading(false)
      })
  }

  async function handleEditChannel(id: string, name: string) {
    if (!name) {
      editChannelInputRef.current?.focus()
      return
    }

    setIsLoading(true)
    updateNotificationChannel(id, name)
      .then((updatedChannel) => {
        const cached = queryClient.getQueryData<NotificationChannel[]>([
          'notification-channels',
        ])

        if (!cached) return

        queryClient.setQueryData<NotificationChannel[]>(
          ['notification-channels'],
          cached.map((cachedChannel) =>
            cachedChannel.id === updatedChannel.id
              ? updatedChannel
              : cachedChannel,
          ),
        )

        setEdittingChannel(null)
      })
      .catch(() => {
        toast.error('Erro ao editar canal. Tente novamente.')
      })
      .finally(() => {
        setShowNewChannelInput(false)
        setIsLoading(false)
      })
  }

  async function handleDeleteChannel(id: string) {
    setIsLoading(true)
    await deleteNotificationChannel(id)
      .then(() => {
        setIsDeleteAlertOpen(false)
        const cached = queryClient.getQueryData<NotificationChannel[]>([
          'notification-channels',
        ])

        if (!cached) return

        queryClient.setQueryData<NotificationChannel[]>(
          ['notification-channels'],
          cached.filter((cachedChannel) => cachedChannel.id !== id),
        )
      })
      .catch(() => {
        toast.error('Erro ao excluir canal. Tente novamente.')
      })
      .finally(() => setIsLoading(false))
  }

  function handleOpenNewChannelInput() {
    setChannelName('')
    setEdittingChannel(null)
    setShowNewChannelInput(true)
  }

  function handleOpenEditChannelInput(id: string, name: string) {
    setChannelName(name)
    setEdittingChannel(id)
    setShowNewChannelInput(false)
  }

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Nome</TableHead>
          <TableHead className="text-right">Ações</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {channels?.length === 0 && (
          <TableRow>
            <TableCell
              colSpan={2}
              className="text-center text-muted-foreground"
            >
              Nenhum canal cadastrado
            </TableCell>
          </TableRow>
        )}
        {channels ? (
          channels.map((channel) =>
            edittingChannel && edittingChannel === channel.id ? (
              <TableRow key={channel.id}>
                <TableCell colSpan={2}>
                  <form className="flex justify-between">
                    <Input
                      ref={editChannelInputRef}
                      value={channelName}
                      onChange={(e) => setChannelName(e.target.value)}
                      placeholder="Nome do canal"
                      className="w-72"
                      disabled={isLoading}
                    />
                    <div className="space-x-2">
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={() => setEdittingChannel(null)}
                        type="button"
                        disabled={isLoading}
                      >
                        <X />
                      </Button>
                      <Button
                        variant="outline"
                        size="icon"
                        type="button"
                        onClick={() =>
                          handleEditChannel(channel.id, channelName)
                        }
                        disabled={isLoading}
                      >
                        <Check />
                      </Button>
                    </div>
                  </form>
                </TableCell>
              </TableRow>
            ) : (
              <TableRow key={channel.id}>
                <TableCell>{channel.name}</TableCell>
                <TableCell className="text-right">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() =>
                      handleOpenEditChannelInput(channel.id, channel.name)
                    }
                    disabled={isLoading}
                  >
                    <Pencil className="h-4 w-4" />
                  </Button>
                  <AlertDialog
                    open={isDeleteAlertOpen}
                    onOpenChange={setIsDeleteAlertOpen}
                  >
                    <AlertDialogTrigger asChild>
                      <Button variant="ghost" size="icon" disabled={isLoading}>
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>
                          ⚠️ Excluir canal{' '}
                          <span className="px-2 py-2 bg-secondary font-bold rounded-lg">
                            {channel.name}
                          </span>
                        </AlertDialogTitle>
                        <AlertDialogDescription>
                          Atenção! Você está prestes a excluir definitivamente o
                          canal{' '}
                          <span className="text-destructive">
                            {channel.name}
                          </span>
                          . Tem certeza que deseja continuar?
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel disabled={isLoading}>
                          Cancelar
                        </AlertDialogCancel>
                        <Button
                          variant="destructive"
                          onClick={async () =>
                            await handleDeleteChannel(channel.id)
                          }
                          className={cn(
                            'relative',
                            isLoading &&
                              'text-destructive flex items-center justify-center',
                          )}
                          disabled={isLoading}
                        >
                          Continuar
                          {isLoading && (
                            <div className="absolute-centered">
                              <Spinner className="" />
                            </div>
                          )}
                        </Button>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </TableCell>
              </TableRow>
            ),
          )
        ) : (
          <TableRow>
            <TableCell>
              <Spinner />
            </TableCell>
            <TableCell className="text-right">
              <Button variant="ghost" size="icon" disabled>
                <Pencil className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="icon" disabled>
                <Trash2 className="h-4 w-4" />
              </Button>
            </TableCell>
          </TableRow>
        )}

        {showNewChannelInput ? (
          <TableRow>
            <TableCell colSpan={2}>
              <form className="flex justify-between">
                <Input
                  ref={newChannelInputRef}
                  value={channelName}
                  onChange={(e) => setChannelName(e.target.value)}
                  placeholder="Nome do canal"
                  className="w-72"
                  disabled={isLoading}
                />
                <div className="space-x-2">
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => setShowNewChannelInput(false)}
                    type="button"
                    disabled={isLoading}
                  >
                    <X />
                  </Button>
                  <Button
                    variant="outline"
                    size="icon"
                    type="button"
                    onClick={() => handleAddChannel(channelName)}
                    disabled={isLoading}
                  >
                    <Check />
                  </Button>
                </div>
              </form>
            </TableCell>
          </TableRow>
        ) : (
          <TableRow>
            <TableCell colSpan={2} className="p-0 rounded-b-lg">
              <div
                className="group text-muted-foreground hover:text-foreground flex justify-center py-1 hover:cursor-pointer"
                onClick={handleOpenNewChannelInput}
              >
                <div className="p-0.5 rounded-full border border-secondary group-hover:border-muted-foreground">
                  <Plus className="size-4" />
                </div>
              </div>
            </TableCell>
          </TableRow>
        )}
      </TableBody>
    </Table>
  )
}
