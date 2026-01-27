import {
  OrderDraft_CreatedMethod,
  OrderDraft_ListingFilter_CreatedMethod,
} from "@/services/connect-rpc/types"

export const AllCreationMethods = Object.freeze(OrderDraft_CreatedMethod)

export const AllCreationMethodsAdvanceFilter = Object.freeze(
  OrderDraft_ListingFilter_CreatedMethod,
)

export const AllCreationMethodsLabel = Object.freeze({
  [OrderDraft_CreatedMethod.PULL]: "Pull",
  [OrderDraft_CreatedMethod.MANUAL]: "Manual",
  [OrderDraft_CreatedMethod.API]: "Api",
  [OrderDraft_CreatedMethod.IMPORT]: "Import",
})

export const AllCreationMethodsAdvanceFilterLabel = Object.freeze({
  [AllCreationMethodsAdvanceFilter.ORDER_DRAFT_CREATED_METHOD_FILTER_PULL]:
    "Pull",
  [AllCreationMethodsAdvanceFilter.ORDER_DRAFT_CREATED_METHOD_FILTER_MANUAL]:
    "Manual",
  [AllCreationMethodsAdvanceFilter.ORDER_DRAFT_CREATED_METHOD_FILTER_API]:
    "Api",
  [AllCreationMethodsAdvanceFilter.ORDER_DRAFT_CREATED_METHOD_FILTER_IMPORT]:
    "Import",
  [AllCreationMethodsAdvanceFilter.ORDER_DRAFT_CREATED_METHOD_FILTER_LABEL]:
    "Platform label",
})
