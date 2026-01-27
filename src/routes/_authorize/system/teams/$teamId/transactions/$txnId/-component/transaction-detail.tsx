import { useQueryFinance } from "@/services/connect-rpc/transport"
import { staffGetTeamTransaction } from "@gearment/nextapi/api/payment/v1/payment_admin-PaymentAdminAPI_connectquery"
import { Badge, LoadingCircle } from "@gearment/ui3"
import { useParams } from "@tanstack/react-router"

import { DateTime } from "@/components/common/date-time"
import {
  mappingColor,
  TeamTransactionTypeColorMapping,
} from "@/constants/map-color"
import { TeamTransactionType } from "@/services/connect-rpc/types"
import CellAmount from "../../-component/table-transaction/cell-amount"
import OrderTable from "./order-table"

function TransactionDetail() {
  const params = useParams({
    from: "/_authorize/system/teams/$teamId/transactions/$txnId/",
  })

  const { data, isLoading } = useQueryFinance(
    staffGetTeamTransaction,
    { txnId: params.txnId },
    { select: (data) => data.data },
  )

  const typeTransaction = data?.type || 0

  const tableData = (data?.orderIds || []).map((orderId) => ({ orderId }))

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <LoadingCircle />
      </div>
    )
  }

  return (
    <div className="max-w-[1600px] mx-auto">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Transaction Details Card */}
        <div className="bg-white rounded-xl shadow-sm lg:col-span-2">
          <div className="px-6 py-4 border-b border-gray-100">
            <h2 className="text-lg font-semibold text-gray-900">
              #{data?.txnId}
            </h2>
          </div>

          <div className="p-6 space-y-6">
            <div className="grid grid-cols-2 gap-6">
              <div>
                <div className="text-sm font-medium text-gray-500 mb-1">
                  Amount
                </div>
                <CellAmount amount={data?.amount} />
              </div>

              <div>
                <div className="text-sm font-medium text-gray-500 mb-1">
                  Type
                </div>
                <Badge
                  className="text-sm px-2.5 py-0.5"
                  variant={mappingColor(
                    TeamTransactionTypeColorMapping,
                    typeTransaction,
                  )}
                >
                  {TeamTransactionType[typeTransaction]}
                </Badge>
              </div>

              <div>
                <div className="text-sm font-medium text-gray-500 mb-1">
                  Created At
                </div>

                <DateTime
                  date={data?.createdAt?.toDate() || ""}
                  className="text-sm text-gray-900"
                />
              </div>

              <div>
                <div className="text-sm font-medium text-gray-500 mb-1">
                  Payment Method
                </div>
                {data?.methodIconUrls && (
                  <img
                    className="h-6 object-contain"
                    src={data?.methodIconUrls}
                    alt={data?.methodCode}
                  />
                )}
              </div>

              <div>
                <div className="text-sm font-medium text-gray-500 mb-1">
                  Initiated By
                </div>
                <div className="text-sm text-gray-900 break-all">
                  {data?.email}
                </div>
              </div>
            </div>

            <div className="pt-4 border-t border-gray-100">
              <div className="text-sm font-medium text-gray-500 mb-1">Note</div>
              <div className="text-sm text-gray-900 whitespace-pre-wrap">
                {data?.note || "No notes provided"}
              </div>
            </div>
          </div>
        </div>

        {/* Orders Card */}
        <div className="bg-white rounded-xl shadow-sm">
          <div className="overflow-hidden">
            {tableData.length === 0 ? (
              <div className="p-6 text-center text-gray-500 text-sm">
                No orders associated with this transaction
              </div>
            ) : (
              <OrderTable orderIds={data?.orderIds} />
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default TransactionDetail
