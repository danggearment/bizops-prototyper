import Image from "@/components/common/image/image"
import { AllPositionOfClothes } from "@/constants/position-of-clothes"
import {
  LineItem,
  Money,
  Order_LineItem,
  OrderDraft_LineItemAdmin,
  OrderDraft_PrintingOption,
  OrderPriceQuote,
} from "@/services/connect-rpc/types"
import {
  ModalLineItemList,
  useLineItemListModal,
} from "@/services/modals/modal-line-item-list"
import { formatPrice, sortPrintingOptions } from "@/utils"
import { BoxEmpty, Button, DataTable, useTable } from "@gearment/ui3"
import { ColumnDef, createColumnHelper } from "@tanstack/react-table"
import { ShirtIcon } from "lucide-react"
import { useMemo } from "react"
interface Props {
  loading: boolean
  priceQuote?:
    | OrderPriceQuote
    | {
        orderShippingFee: Money | undefined
        orderFee: Money | undefined
        orderTax: Money | undefined
        orderSubTotal: Money | undefined
        orderTotal: Money | undefined
        orderDiscount: Money | undefined
        lineItems: Order_LineItem[]
        fees: Money | undefined
        orderGiftMessageFee: Money | undefined
        orderHandleFee: Money | undefined
      }
  lineItems: LineItem[] | Order_LineItem[] | OrderDraft_LineItemAdmin[]
  teamId: string
}

const columnHelper = createColumnHelper<
  LineItem | Order_LineItem | OrderDraft_LineItemAdmin
>()

export default function TableProduct({
  loading,
  priceQuote,
  lineItems,
  teamId,
}: Props) {
  const columns: ColumnDef<
    LineItem | Order_LineItem | OrderDraft_LineItemAdmin,
    any
  >[] = useMemo(
    () => [
      columnHelper.accessor("variantSku", {
        header: () => "SKU",
        cell: ({ getValue }) => getValue(),
      }),
      columnHelper.accessor("variantName", {
        header: () => "Variant name",
        cell: ({ getValue }) => getValue(),
      }),

      columnHelper.accessor("variantId", {
        header: () => "Print location",
        cell: ({ row }) => <CellDesign record={row.original} teamId={teamId} />,
      }),
      columnHelper.accessor("lineShippingFee", {
        header: () => "Shipping fee",
        cell: ({ getValue }) => formatPrice(getValue()) || "--",
      }),
      columnHelper.accessor("quantity", {
        header: () => <p className="text-center">Quantity</p>,
        cell: ({ getValue }) => (
          <p className="text-center">{Number(getValue())}</p>
        ),
      }),
      columnHelper.accessor("itemPrice", {
        header: () => <p className="text-center">Base cost</p>,
        cell: ({ getValue }) => (
          <p className="text-center">{formatPrice(getValue())}</p>
        ),
      }),
      columnHelper.accessor("productId", {
        header: () => <p className="text-right">Line total</p>,
        cell: ({ row }) => (
          <CellTotal
            lineTotal={
              priceQuote?.lineItems.find((item) => item.id === row.original.id)
                ?.lineTotal
            }
          />
        ),
      }),
    ],
    [priceQuote],
  )

  const [setOpen, onClose] = useLineItemListModal((state) => [
    state.setOpen,
    state.onClose,
  ])

  const table = useTable({
    columns,
    data: lineItems,
    getRowId: (row) => row.id.toString(),
  })

  const subTable = useTable({
    columns,
    data: lineItems.slice(0, 2),
    getRowId: (row) => row.id.toString(),
  })

  const handleViewLineItemList = () => {
    setOpen({
      title: <p className="text-center text-lg font-bold">Line Item List</p>,
      dataTable: table,
      className: "min-w-5xl",
      onConfirm: () => {
        onClose()
      },
    })
  }

  const isMappedProduct = lineItems.some((lineItem) => lineItem.productId)

  if (!isMappedProduct) {
    return (
      <BoxEmpty description="The order does not map product, please map product and try again" />
    )
  }

  return (
    <div className="bg-background rounded p-4">
      <div className="flex flex-wrap items-baseline gap-3">
        <h3 className="heading-3 mb-4 flex items-center gap-2">Line Items</h3>
        <div className="flex items-center gap-1">
          (<p className="body-medium">{table.getRowModel().rows.length}</p>
          <ShirtIcon className="w-4 h-4" />)
        </div>
      </div>
      <DataTable loading={loading} table={subTable} />
      {table.getRowModel().rows.length > 2 && (
        <div className="flex items-center justify-center">
          <Button
            variant={"ghost"}
            className="cursor-pointer"
            onClick={handleViewLineItemList}
          >
            <span className="text-primary">
              Show {table.getRowModel().rows.length} line item &gt;
            </span>
          </Button>
        </div>
      )}
      <div className="text-right py-4 text-base">
        Subtotal: {formatPrice(priceQuote?.orderSubTotal)}
      </div>
      <ModalLineItemList />
    </div>
  )
}

function CellDesign({
  record,
  teamId,
}: {
  record: LineItem | Order_LineItem | OrderDraft_LineItemAdmin
  teamId: string
}) {
  if (!record.printingOptions.length) return "N/A"

  return (
    <div className="flex gap-3">
      {sortPrintingOptions(
        record.printingOptions as OrderDraft_PrintingOption[],
      ).map((printingOption) => {
        if (!printingOption.designFile?.fileUrl) return null
        return (
          <div
            className="flex gap-1 flex-col"
            key={`${printingOption.designFile.fileUrl}-${printingOption.printLocationCode}`}
          >
            <div className="flex">
              <Image
                width={80}
                url={printingOption.designFile?.fileUrl}
                enableViewImage
                mediaPath={printingOption.designFile?.filePath}
                teamId={teamId}
                enableViewOriginalDesign
                downloadTitle="Download thumbnail"
              />
            </div>
            <p className="text-center body-extra-small">
              {
                AllPositionOfClothes[
                  printingOption.printLocationCode as keyof typeof AllPositionOfClothes
                ]
              }
            </p>
          </div>
        )
      })}
    </div>
  )
}
function CellTotal({ lineTotal }: { lineTotal?: Money }) {
  return <div className="text-right font-medium">{formatPrice(lineTotal)}</div>
}
