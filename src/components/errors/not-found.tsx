export function NotFound({
  title = "Page Not Found",
  description = "Sorry, the page you are looking for doesn't exist or has been moved.",
}: {
  title?: string
  description?: string
}) {
  return (
    <div className="flex flex-col items-center justify-center min-h-[400px] space-y-4">
      <div className="text-center space-y-2">
        <h1 className="text-6xl font-bold text-primary">404</h1>
        <h2 className="text-2xl font-semibold">{title}</h2>
        <p className="text-muted-foreground max-w-md">{description}</p>
      </div>
    </div>
  )
}
