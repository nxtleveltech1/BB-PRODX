import '../globals.css'

export default function LandingLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className="bg-bb-champagne">
      <body className="bg-bb-champagne m-0 p-0 overflow-hidden">
        {children}
      </body>
    </html>
  )
}
