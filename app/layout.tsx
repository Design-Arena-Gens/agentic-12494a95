import './globals.css'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Deep Research Orchestrator',
  description: 'Synthesize large amounts of web data into comprehensive reports',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
