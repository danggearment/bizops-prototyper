import Image from "@/components/common/image/image"
import { useQueryStore } from "@/services/connect-rpc/transport"
import { OrderAdmin_OrderDraftImportSession } from "@gearment/nextapi/api/pod/v1/admin_api_type_pb"
import { staffListMarketplace } from "@gearment/nextapi/api/store/v1/admin_api-StoreAdminAPI_connectquery"
import { CellContext } from "@tanstack/react-table"

interface Props extends CellContext<OrderAdmin_OrderDraftImportSession, any> {}

export default function CellPlatform({ row }: Props) {
  const { data: marketplaces } = useQueryStore(
    staffListMarketplace,
    undefined,
    {
      select: (data) => data.marketplace,
    },
  )

  const platform = row.original.platform
  const marketplace = marketplaces?.find(
    (marketplace) => marketplace.platform === platform,
  )

  return (
    <div>
      <Image
        url={marketplace?.logoUrl ?? ""}
        responsive="w"
        height={32}
        className="justify-start"
      />
    </div>
  )
}
