import { formatDateString } from "@/utils"
import { Timestamp } from "@bufbuild/protobuf"
import { Badge } from "@gearment/ui3"

interface Props {
  isApproved: boolean
  isAddressVerified: boolean
  isProductMatched: boolean
  approvedTime?: Timestamp
  createdAt?: Timestamp
  paidAt?: Timestamp
}

const defaultValue = "--"

export default function StatusInformation(props: Props) {
  const contents = [
    {
      name: "Product mapping",
      value: (
        <Badge variant={props.isProductMatched ? "success" : "default"}>
          {props.isProductMatched ? "Mapped" : "Unmapped"}
        </Badge>
      ),
    },
    {
      name: "Approval status",
      value: (
        <Badge variant={props.isApproved ? "success" : "default"}>
          {props.isApproved ? "Approved" : "Unapproved"}
        </Badge>
      ),
    },
    {
      name: "Address verification",
      value: (
        <Badge variant={props.isAddressVerified ? "success" : "default"}>
          {props.isAddressVerified ? "Verified" : "Unverified"}
        </Badge>
      ),
    },
    {
      name: "Created at",
      value: props.createdAt
        ? formatDateString(props.createdAt.toDate())
        : defaultValue,
    },
    {
      name: "Approved at",
      value:
        props.approvedTime && props.isApproved
          ? formatDateString(props.approvedTime.toDate())
          : defaultValue,
    },
    {
      name: "Paid at",
      value: props.paidAt
        ? formatDateString(props.paidAt.toDate())
        : defaultValue,
    },
  ]

  const half = Math.ceil(contents.length / 2)
  const leftColumn = contents.slice(0, half)
  const rightColumn = contents.slice(half)

  return (
    <div className="p-6 rounded-xl bg-background h-full">
      <h4 className="mb-4 body-large">Status Information</h4>

      <div className="grid grid-cols-2 gap-x-8 gap-y-4">
        {[leftColumn, rightColumn].map((col, colIdx) => (
          <div key={colIdx} className="space-y-4">
            {col.map((item, idx) => (
              <div key={idx}>
                <p className="text-gray-600">{item.name}</p>
                <p className="break-all">{item.value}</p>
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  )
}
