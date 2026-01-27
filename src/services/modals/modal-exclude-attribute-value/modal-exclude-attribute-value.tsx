import { useMutationPod } from "@/services/connect-rpc/transport"
import { queryClient } from "@/services/react-query"
import {
  staffCreateGMAttributeValue,
  staffGetGMAttributeGroupDetail,
  staffListGMAttributeValue,
} from "@gearment/nextapi/api/pod/v1/product_admin-ProductAdminAPI_connectquery"
import {
  Button,
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  InputField,
  toast,
} from "@gearment/ui3"
import { _debounce } from "@gearment/utils"
import { RowSelectionState } from "@tanstack/react-table"
import { PlusIcon, SearchIcon } from "lucide-react"
import { useCallback, useEffect, useState } from "react"
import { useModalAttributeValue } from "../modal-attribute-value"
import { ExcludeAttributeValueTable } from "./-components/table"
import { useModalExcludeAttributeValue } from "./modal-exclude-attribute-value-store"

export function ModalExcludeAttributeValue() {
  const { open, actions, groupId, onConfirm } = useModalExcludeAttributeValue()

  const [searchText, setSearchText] = useState("")
  const [debouncedSearch, setDebouncedSearch] = useState("")

  const [loading, setLoading] = useState(false)

  const [selectedValues, setSelectedValues] = useState<RowSelectionState>({})

  const debouncedHandleSearch = useCallback(
    _debounce((value: string) => {
      setDebouncedSearch(value)
    }, 300),
    [],
  )

  const handleSearch = (value: string) => {
    setSearchText(value)
    debouncedHandleSearch(value)
  }

  const { actions: actionsModalAttributeValue } = useModalAttributeValue()

  const mutationCreateAttributeValue = useMutationPod(
    staffCreateGMAttributeValue,
    {
      onSuccess: () => {
        toast({
          variant: "success",
          title: "Attribute value created",
          description: "Attribute value has been created successfully",
        })
        queryClient.invalidateQueries({
          queryKey: [
            staffListGMAttributeValue.service.typeName,
            staffListGMAttributeValue.name,
          ],
        })
        queryClient.invalidateQueries({
          queryKey: [
            staffGetGMAttributeGroupDetail.service.typeName,
            staffGetGMAttributeGroupDetail.name,
          ],
        })
        actionsModalAttributeValue.onClose()
      },
    },
  )

  const handleCreateNewAttributeValue = async () => {
    if (!groupId) return
    console.log("groupId", groupId)
    actions.onClose()
    actionsModalAttributeValue.onOpen({
      defaultValues: {
        value: "",
        attributeGroupKeys: groupId ? [groupId] : [],
        code: "",
        description: "",
      },
      title: "Add attribute library",
      submitText: "Add attribute",
      hasCreateNewAttributeGroup: true,
      onConfirm: async (values) => {
        await mutationCreateAttributeValue.mutateAsync({
          ...values,
          attributeGroupKeys: values.attributeGroupKeys?.length
            ? values.attributeGroupKeys
            : [groupId],
        })
      },
    })
  }

  const handleAddSelectedValues = async () => {
    setLoading(true)
    try {
      await onConfirm(Object.keys(selectedValues))
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (!open) {
      setSelectedValues({})
    }
  }, [open])

  return (
    <Dialog open={open} onOpenChange={actions.onClose}>
      <DialogContent className="sm:max-w-[768px]">
        <DialogHeader>
          <DialogTitle>Select Attributes</DialogTitle>
          <DialogDescription>
            Choose attributes from the list below or create a new one
          </DialogDescription>
        </DialogHeader>
        {groupId && (
          <>
            <div className="flex items-center gap-2 w-full">
              <div className="w-full">
                <InputField
                  leftIcon={<SearchIcon size={14} className="text-gray-500" />}
                  placeholder="Select by name or code..."
                  value={searchText}
                  onChange={(value) => handleSearch(value.target.value)}
                />
              </div>
              <Button
                type="button"
                variant="outline"
                onClick={handleCreateNewAttributeValue}
              >
                <PlusIcon className="size-4" />
                Create new
              </Button>
            </div>
            <div className="max-h-[600px] w-full overflow-auto">
              <ExcludeAttributeValueTable
                groupId={groupId}
                search={debouncedSearch}
                setSelectedValues={setSelectedValues}
                selectedValues={selectedValues}
              />
            </div>
            <DialogFooter className="flex justify-end gap-2">
              <Button type="button" variant="outline" onClick={actions.onClose}>
                Cancel
              </Button>
              <Button
                type="button"
                onClick={handleAddSelectedValues}
                loading={loading}
                disabled={!Object.keys(selectedValues).length}
              >
                Add selected ({Object.keys(selectedValues).length})
              </Button>
            </DialogFooter>
          </>
        )}
      </DialogContent>
    </Dialog>
  )
}
