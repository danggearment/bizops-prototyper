import { cn, Tooltip, TooltipContent, TooltipTrigger } from "@gearment/ui3"
import { Box, FileCheck, MapPin } from "lucide-react"

interface Props {
  productMapped: boolean
  verifyAddress: boolean
  approve: boolean
}

export default function CellOrderStatus({
  productMapped,
  verifyAddress,
  approve,
}: Props) {
  return (
    <div className="flex items-center gap-2">
      {/* <ProductMatchIndicator isMatched={productMapped} /> */}
      <StatusIndicator
        isVerified={productMapped}
        icon={
          <Box
            className={cn(
              "w-4 h-4",
              productMapped ? "text-success-foreground" : "text-gray-500",
            )}
          />
        }
        verifiedText="Product mapped"
        unverifiedText="Product unmapped"
      />
      <StatusIndicator
        isVerified={verifyAddress}
        icon={
          <MapPin
            className={cn(
              "w-4 h-4",
              verifyAddress ? "text-success-foreground" : "text-gray-500",
            )}
          />
        }
        verifiedText="Address verified"
        unverifiedText="Address unverified"
      />
      <StatusIndicator
        isVerified={approve}
        icon={
          <FileCheck
            className={cn(
              "w-4 h-4",
              approve ? "text-success-foreground" : "text-gray-500",
            )}
          />
        }
        verifiedText="Approved"
        unverifiedText="Unapproved"
      />
    </div>
  )
}

const StatusIndicator = ({
  isVerified,
  icon,
  verifiedText,
  unverifiedText,
  verifiedClassName = "bg-green-100 text-green-700",
}: {
  isVerified: boolean
  icon: React.ReactNode
  verifiedText: string
  unverifiedText: string
  verifiedClassName?: string
}) => (
  <Tooltip>
    <TooltipTrigger>
      <div
        className={cn(
          "flex items-center justify-center w-6 h-6 rounded-full",
          isVerified
            ? verifiedClassName
            : "bg-gray-200 text-gray-500 hover:bg-gray-300",
        )}
      >
        {icon}
      </div>
    </TooltipTrigger>
    <TooltipContent side="top" className="text-sm px-3 py-2 rounded-md">
      {isVerified ? verifiedText : unverifiedText}
    </TooltipContent>
  </Tooltip>
)
