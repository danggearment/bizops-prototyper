import useShippingMethod from "@/hooks/use-shipping-method"
import {
  Order_Address,
  Order_BillingOption,
  Order_ShippingOption,
  OrderDraft_Address,
  OrderDraft_BillingOption,
  OrderDraft_ShippingOption,
} from "@/services/connect-rpc/types"
import { useNotificationModal } from "@/services/modals/modal-notification"
import { formatPrice } from "@/utils/format-currency"
import {
  Badge,
  Button,
  cn,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@gearment/ui3"
import { formatAddress } from "@gearment/utils"
import { FileClock } from "lucide-react"
import { useMemo } from "react"

interface Props {
  address: Order_Address | OrderDraft_Address | undefined
  shippingOption: Order_ShippingOption | OrderDraft_ShippingOption | undefined
  billingOption: Order_BillingOption | OrderDraft_BillingOption | undefined
  addressUpdate: Order_Address | undefined
}

const defaultValue = "--"

export default function ManualOrder({
  address,
  shippingOption,
  billingOption,
  addressUpdate,
}: Props) {
  const addressInfoString = useMemo(() => {
    if (address) {
      return formatAddress(
        address.street1,
        address.city,
        address.state,
        address.zipCode,
        address.country,
      )
    }
    return ""
  }, [address])

  const addressUpdateInfoString = useMemo(() => {
    if (addressUpdate) {
      return formatAddress(
        addressUpdate.street1,
        addressUpdate.city,
        addressUpdate.state,
        addressUpdate.zipCode,
        addressUpdate.country,
      )
    }
    return ""
  }, [addressUpdate])

  const { getShippingMethodName } = useShippingMethod()

  const [setOpenNotification, onCloseNotification] = useNotificationModal(
    (state) => [state.setOpen, state.onClose],
  )

  const contents = [
    {
      name: "Shipping name",
      value: (
        <span className="font-medium break-all">
          {addressUpdate
            ? addressUpdate.fullName || defaultValue
            : `${address?.firstName} ${address?.lastName}`.trim() ||
              defaultValue}
        </span>
      ),
    },
    {
      name: "Shipping address",
      value: (
        <p>
          {addressUpdate
            ? addressUpdateInfoString || defaultValue
            : addressInfoString || defaultValue}
        </p>
      ),
    },
    {
      name: "Phone number",
      value: (
        <p className="text-secondary-text">
          {addressUpdate
            ? addressUpdate.phoneNo || defaultValue
            : address?.phoneNo || defaultValue}
        </p>
      ),
    },
    {
      name: "Email",
      value: (
        <p className="text-secondary-text">
          {addressUpdate
            ? addressUpdate.email || defaultValue
            : address?.email || defaultValue}
        </p>
      ),
    },
    {
      name: "Shipping method",
      value: shippingOption?.method
        ? getShippingMethodName(shippingOption?.method)
        : defaultValue,
    },
  ]

  const TaxColumn = [
    {
      name: "IOSS number",
      value: <span>{billingOption?.iossNumber || defaultValue}</span>,
    },
    {
      name: "Order value",
      value: (
        <span>{formatPrice(billingOption?.iossValue) || defaultValue}</span>
      ),
    },
    {
      name: "Tax number",
      value: <span>{billingOption?.taxNumber || defaultValue}</span>,
    },
    {
      name: "Tax value",
      value: (
        <span>{formatPrice(billingOption?.taxValue) || defaultValue}</span>
      ),
    },
  ]

  const viewOriginalAddress = () => {
    const originalName =
      `${address?.firstName ?? ""} ${address?.lastName ?? ""}`.trim() ||
      defaultValue
    const updatedName = addressUpdate?.fullName || defaultValue

    const rows = [
      {
        label: "Shipping name",
        original: originalName,
        updated: updatedName,
        isUpdated: originalName !== updatedName,
      },
      {
        label: "Shipping address",
        original: addressInfoString || defaultValue,
        updated: addressUpdateInfoString || defaultValue,
        isUpdated: addressInfoString !== addressUpdateInfoString,
      },
      {
        label: "Phone number",
        original: address?.phoneNo || defaultValue,
        updated: addressUpdate?.phoneNo || defaultValue,
        isUpdated: address?.phoneNo !== addressUpdate?.phoneNo,
      },
      {
        label: "Email",
        original: address?.email || defaultValue,
        updated: addressUpdate?.email || defaultValue,
        isUpdated: address?.email !== addressUpdate?.email,
      },
    ]

    setOpenNotification({
      title: "Address Comparison",
      description: (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead></TableHead>
              <TableHead>Original</TableHead>
              <TableHead>Updated</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {rows.map((r) => {
              return (
                <TableRow key={r.label}>
                  <TableCell className="font-medium">{r.label}</TableCell>
                  <TableCell
                    className={cn(r.isUpdated ? "text-error-foreground" : "")}
                  >
                    <div className="whitespace-normal">{r.original}</div>
                  </TableCell>
                  <TableCell
                    className={cn(r.isUpdated ? "text-success-foreground" : "")}
                  >
                    <div className="whitespace-normal">{r.updated}</div>
                  </TableCell>
                </TableRow>
              )
            })}
          </TableBody>
        </Table>
      ),
      OK: "Close",
      className: "sm:min-w-[1000px]",
      onConfirm: () => {
        onCloseNotification()
      },
    })
  }

  return (
    <>
      <h3 className="heading-3 mb-4 flex items-center gap-2">
        Shipping Information{" "}
        {addressUpdate && (
          <>
            <Badge variant="warning">Updated</Badge>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={viewOriginalAddress}
                >
                  <FileClock className="w-4 h-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>View address comparison</TooltipContent>
            </Tooltip>
          </>
        )}
      </h3>
      <div className="mb-2 space-y-2">
        {contents.map((content, index) => (
          <div key={index} className="grid grid-cols-2 gap-2">
            <p className="text-gray-600">{content.name}</p>
            <div className="break-all">{content.value}</div>
          </div>
        ))}
        <div className="border-t pt-2">
          <div className=" grid grid-cols-2 gap-2">
            {TaxColumn.map((item, index) => (
              <div key={index} className="space-y-2 grid grid-cols-2 gap-2">
                <p className="text-gray-600">{item.name}</p>
                <p>{item.value}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  )
}
