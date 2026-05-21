import React from "react"
import type { Metadata } from 'next'
import { Poppins, Playfair_Display } from 'next/font/google'
import { Analytics } from '@vercel/analytics/next'
import { ProfessionalProvider } from "../context/professionalsContext"
import './globals.css'

const poppins = Poppins({ 
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"]
});

const playfair = Playfair_Display({ 
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"]
});

export const metadata: Metadata = {
  // title: 'Instituto Odontológico Austral | Odontologia en Rosario, Funes y San Lorenzo',
  title: 'Instituto Odontológico Austral | Odontologia en San Lorenzo',
  // description: 'Cuidando sonrisas en Rosario, Funes y San Lorenzo. Misma calidad, mismos profesionales, siempre cerca tuyo. Reserva tu turno online.',
  // description: 'Cuidando sonrisas en San Lorenzo. Misma calidad, mismos profesionales, siempre cerca tuyo. Reserva tu turno online.',
  generator: 'v0.app',
  icons: {
    icon: [
      {
        url: '/Gemini_Generated_Image_qswhjbqswhjbqswh-removebg-preview2.png',
        media: '(prefers-color-scheme: light)',
      },
      {
        url: '/Gemini_Generated_Image_qswhjbqswhjbqswh-removebg-preview7.png',
        media: '(prefers-color-scheme: dark)',
      },
      {
        url: '/Gemini_Generated_Image_qswhjbqswhjbqswh-removebg-preview8.png',
        type: 'image/svg+xml',
      },
    ],
    apple: '/apple-icon.png',
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className={`font-sans antialiased`}>
        <ProfessionalProvider>
          {children}
          <Analytics />
        </ProfessionalProvider>
      </body>
    </html>
  )
}
