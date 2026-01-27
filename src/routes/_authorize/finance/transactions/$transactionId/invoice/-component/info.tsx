import {
  StaffGetInvoice_GearmentInfo,
  StaffGetInvoice_InvoiceInfo,
} from "@gearment/nextapi/api/payment/v1/payment_admin_pb"
import { Link } from "@tanstack/react-router"
import RowItem from "./row-item"

type InfoProps = {
  gearmentInfo?: StaffGetInvoice_GearmentInfo
  invoiceInfo?: StaffGetInvoice_InvoiceInfo
}

export default function Info({ gearmentInfo, invoiceInfo }: InfoProps) {
  return (
    <div className="  p-4 h-full gap-4 grid grid-cols-2">
      <div>
        <h2 className="text-xl font-semibold mb-4">Gearment Inc</h2>
        <RowItem label="Address" value={gearmentInfo?.address} />
        <RowItem label="Phone" value={gearmentInfo?.phone} />
        <RowItem label="Email" value={gearmentInfo?.email} />
        <RowItem
          label="Website"
          value={
            <Link
              to={gearmentInfo?.website || ""}
              className="text-primary hover:underline"
            >
              {gearmentInfo?.website}
            </Link>
          }
        />
      </div>

      <div>
        <h2 className="text-xl font-semibold mb-4">{invoiceInfo?.to}</h2>
        <RowItem label="Address" value={invoiceInfo?.address} />
        <RowItem label="Phone" value={invoiceInfo?.phone} />
        <RowItem label="Email" value={invoiceInfo?.email} />

        <RowItem
          label="Full name"
          value={
            [invoiceInfo?.firstName, invoiceInfo?.lastName]
              .filter(Boolean)
              .join(" ") || ""
          }
        />
      </div>
    </div>
  )
}
