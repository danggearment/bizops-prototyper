import { useMutationPod } from "@/services/connect-rpc/transport"
import {
  CatalogOption_Group,
  CatalogOption_Option_Status,
} from "@/services/connect-rpc/types"
import {
  CatalogOptionType,
  useModalCatalogOption,
} from "@/services/modals/modal-catalog-option"
import { queryClient } from "@/services/react-query"
import {
  staffCreateCatalogOption,
  staffListCatalogOption,
  staffListCatalogOptionGroup,
} from "@gearment/nextapi/api/pod/v1/product_admin-ProductAdminAPI_connectquery"
import { Button, Input, toast } from "@gearment/ui3"
import { _debounce } from "@gearment/utils"
import { PlusIcon } from "lucide-react"
import { useCallback, useRef, useState } from "react"
import { useOptionManagement } from "../../-option-management-context"

interface Props {
  group: CatalogOption_Group
}

export default function CatalogOptionFilter({ group }: Props) {
  const { name, description, type } = group
  const { setSearchCatalogOption, searchCatalogOption } = useOptionManagement()
  const [search, setSearch] = useState<string>(searchCatalogOption)
  const { actions } = useModalCatalogOption()
  const groupIdRef = useRef(group.groupId)

  if (group.groupId !== groupIdRef.current) {
    groupIdRef.current = group.groupId
    if (search !== "") setSearch("")
  }

  const debounceSearch = useCallback(
    _debounce((value: string) => {
      setSearchCatalogOption(value)
    }, 500),
    [setSearchCatalogOption],
  )
  const mutationCreateCatalogOption = useMutationPod(staffCreateCatalogOption, {
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [
          staffListCatalogOption.service.typeName,
          staffListCatalogOption.name,
        ],
      })
      queryClient.invalidateQueries({
        queryKey: [
          staffListCatalogOptionGroup.service.typeName,
          staffListCatalogOptionGroup.name,
        ],
      })
      actions.onClose()
      toast({
        title: "Option value created",
        variant: "success",
        description: "Option value created successfully.",
      })
    },
    onError: (error) => {
      toast({
        title: "Option value creation failed",
        variant: "error",
        description: error.rawMessage,
      })
    },
  })

  const handleOpen = () => {
    actions.onOpen({
      type,
      title: "Add option value",
      description: `Add a new value to ${name}`,
      confirmText: "Add value",
      groupId: group.groupId,
      defaultValues: {
        name: "",
        code: "",
        previewImage: [],
        hexColor: "#117BA9",
        status: CatalogOption_Option_Status.CATALOG_OPTION_STATUS_ACTIVE,
        previewImageId: "",
      },
      previewImageUrl: undefined,
      onConfirm: async (values: CatalogOptionType) => {
        await mutationCreateCatalogOption.mutateAsync({
          groupId: group.groupId,
          value: values.hexColor ?? values.code,
          name: values.name,
          code: values.code,
          status: values.status,
          previewImageId: values.previewImageId ?? undefined,
        })
      },
    })
  }

  return (
    <div className="space-y-2 mb-4">
      <div className="flex justify-between items-center">
        <div>
          <div className="text-lg font-medium">{name}</div>
          <p className="italic text-sm text-gray-500">{description}</p>
        </div>
        <Button size="sm" onClick={handleOpen}>
          <PlusIcon className="size-3" />
          Add value
        </Button>
      </div>
      <Input
        placeholder="Search values by name or code"
        value={search}
        onChange={(e) => {
          setSearch(e.target.value)
          debounceSearch(e.target.value)
        }}
      />
    </div>
  )
}
