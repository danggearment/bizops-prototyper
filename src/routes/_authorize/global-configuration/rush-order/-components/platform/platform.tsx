import { Badge } from "@gearment/ui3"

export default function Platform() {
  return (
    <div className="bg-background rounded-lg p-4 space-y-4">
      <div>
        <h2 className="text-lg font-bold">Platform</h2>
        <p className="text-sm text-foreground/50">
          Platforms are used to group products together.
        </p>
      </div>
      <div className="flex flex-col gap-4">
        <Badge variant="outline">Tiktok shop</Badge>
      </div>
    </div>
  )
}
