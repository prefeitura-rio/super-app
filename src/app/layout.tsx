import './globals.css'

import type { Metadata } from 'next'
import localFont from 'next/font/local'
import { Toaster } from 'sonner'

import { AuthWithSearchParams } from '@/utils/auth/auth-search-params'

const geistSans = localFont({
  src: './fonts/GeistVF.woff',
  variable: '--font-geist-sans',
  weight: '100 900',
})
const geistMono = localFont({
  src: './fonts/GeistMonoVF.woff',
  variable: '--font-geist-mono',
  weight: '100 900',
})

export const metadata: Metadata = {
  title: 'Super App',
  description: 'Escritório de Dados | Prefeitura do Rio de Janeiro',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="pt" className="h-full">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased h-full`}
      >
        <AuthWithSearchParams />
        {children}
        <Toaster closeButton duration={15000} />
      </body>
    </html>
  )
}
