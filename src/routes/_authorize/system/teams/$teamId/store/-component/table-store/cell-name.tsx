import { CellContext } from "@tanstack/react-table"
import { Store } from "@gearment/nextapi/api/store/v1/data_store_pb.ts"
import { useNavigate } from "@tanstack/react-router"

interface Props extends CellContext<Store, any> {}

export default function CellStoreName(props: Props) {
  const teamId = props.row.original.teamId
  const storeId = props.row.original.storeId
  const storeName = props.row.original.name
  const navigate = useNavigate()

  const handleViewDetails = () => {
    navigate({
      to: "/system/teams/$teamId/store/$storeId",
      params: {
        teamId: teamId,
        storeId: storeId,
      },
    })
  }

  return (
    <div className={"body-medium  font-medium flex gap-1 items-center"}>
      <span
        id={storeId}
        className={"cursor-pointer whitespace-nowrap"}
        onClick={handleViewDetails}
      >
        {storeName}
      </span>
    </div>
  )
}
