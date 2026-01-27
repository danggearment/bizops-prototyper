import { AllPlatform, AllPlatformLabel } from "@/constants/platform"
import { Badge } from "@gearment/ui3"

export default function Platform() {
  return (
    <div className="col-span-2 space-y-4 bg-background p-4 rounded-lg">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-bold">Platform</h2>
          <p className="text-sm text-foreground/50">
            Select the platform you want to use for this product group.
          </p>
        </div>
      </div>
      <div>
        <Badge>{AllPlatformLabel[AllPlatform.TIKTOKSHOP]}</Badge>
      </div>
    </div>
  )
}
