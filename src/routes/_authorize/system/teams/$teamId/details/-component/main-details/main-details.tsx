import { AllGMTeamStatusLabel } from "@/constants/gm-team-status"
import { GMTeamStatusColorsMapping, mappingColor } from "@/constants/map-color"
import { TeamStatus, WalletAdmin } from "@/services/connect-rpc/types"
import { Badge } from "@gearment/ui3"
import { formatCurrency, getPrice } from "@gearment/utils"
import { BadgeCheckIcon, GemIcon, MailIcon, Wallet } from "lucide-react"

interface TextVerifyProps {
  title: string
  value?: React.ReactNode
  icon?: React.ReactNode
}

function TextVerify({ title, value, icon }: TextVerifyProps) {
  return (
    <div className="bg-background p-4 rounded-lg border">
      <p className="text-muted-foreground flex items-center gap-2">
        {icon}
        {title}
      </p>
      <div className="font-medium flex items-center gap-2 text-foreground">
        {value ? (
          <span>{value}</span>
        ) : (
          <span className="text-muted-foreground">N/A</span>
        )}
      </div>
    </div>
  )
}

interface MainDetailsProps {
  status?: TeamStatus
  email?: string
  tierLevel?: string
  wallet?: WalletAdmin
}

function MainDetails({ status, email, tierLevel, wallet }: MainDetailsProps) {
  const statusIcon = status ? (
    <Badge variant={mappingColor(GMTeamStatusColorsMapping, status)}>
      {AllGMTeamStatusLabel[status]}
    </Badge>
  ) : null
  return (
    <div className="grid grid-cols-1 md:grid-cols-1 lg:grid-cols-4 gap-4">
      <TextVerify
        title="Team Status"
        icon={<BadgeCheckIcon size={16} />}
        value={statusIcon}
      />
      <TextVerify
        title="Verified email"
        icon={<MailIcon size={16} />}
        value={email}
      />
      <TextVerify
        title="Tier level"
        icon={<GemIcon size={16} />}
        value={tierLevel}
      />
      <TextVerify
        title="GWallet"
        icon={<Wallet size={16} />}
        value={formatCurrency(
          getPrice({
            units: Number(wallet?.balance?.units ?? 0),
            nanos: wallet?.balance?.nanos ?? 0,
          }),
        )}
      />
    </div>
  )
}

export default MainDetails
