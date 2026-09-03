import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "ContactsMe",
  description: "Personal contact and address book manager for India",
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