import { useQueryPod } from "@/services/connect-rpc/transport"
import { StaffListReturnAddress } from "@/services/connect-rpc/types"
import { staffListReturnAddress } from "@gearment/nextapi/api/pod/v1/web_setting-SellerSettingAPI_connectquery"
import { BoxEmpty, LoadingCircle } from "@gearment/ui3"
import { formatAddress } from "@gearment/utils"
import { MapPin } from "lucide-react"

interface Props {
  teamID: string
}

interface ReturnAddressItemProps {
  returnAddress: StaffListReturnAddress
}

function ReturnAddressItem({ returnAddress }: ReturnAddressItemProps) {
  const {
    phone,
    zipcode,
    street1,
    city,
    state,
    country,
    email,
    firstName,
    lastName,
  } = returnAddress

  const fullName = `${firstName} ${lastName}`

  const fullAddress = formatAddress(street1, city, state, zipcode, country)

  return (
    <div className="flex items-start gap-6 py-3">
      <div className="flex min-w-[48px] min-h-[48px] justify-center items-center rounded-full bg-cyan-200">
        <MapPin className="w-4 h-4 text-primary" />
      </div>
      <div className="w-full body-small">
        <div className="space-y-1 mb-2">
          <p className="font-medium">{fullName}</p>
          <p>{email}</p>
          <p>{phone}</p>
        </div>
        <p>{fullAddress}</p>
      </div>
    </div>
  )
}

export default function ReturnAddress({ teamID }: Props) {
  const { data: listReturnAddress, isLoading } = useQueryPod(
    staffListReturnAddress,
    {
      filter: {
        teamIds: [teamID],
      },
    },
    {
      select: (data) => data.returnAddresses,
    },
  )
  return (
    <div className="p-6 rounded-xl bg-background w-full">
      <h2 className="text-xl font-semibold pb-2 mb-2 border-b">
        Return Address
      </h2>
      {isLoading && (
        <div className="flex py-4 justify-center">
          <LoadingCircle />
        </div>
      )}
      {!isLoading && listReturnAddress?.length === 0 && (
        <div>
          <BoxEmpty description="No data"></BoxEmpty>
        </div>
      )}
      {listReturnAddress && (
        <div className="overflow-y-auto max-h-[700px]">
          {listReturnAddress.map((item) => (
            <ReturnAddressItem
              key={item.returnAddressId}
              returnAddress={item}
            />
          ))}
        </div>
      )}
    </div>
  )
}
