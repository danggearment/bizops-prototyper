import {
  AllCreationMethods,
  AllCreationMethodsLabel,
} from "@/constants/creation-methods.ts"

import {
  Order_FilterOption,
  OrderDraft_ListingFilter_Option,
} from "@/services/connect-rpc/types"

export const AllOptionsFilter = Object.freeze(OrderDraft_ListingFilter_Option)

export const AllOptionsFilterLabel = Object.freeze({
  [OrderDraft_ListingFilter_Option.ORDER_DRAFT_FILTER_OPTION_APPROVED]:
    "Approved",
  [OrderDraft_ListingFilter_Option.ORDER_DRAFT_FILTER_OPTION_UNAPPROVED]:
    "Unapproved",
  [OrderDraft_ListingFilter_Option.ORDER_DRAFT_FILTER_OPTION_ADDRESS_VERIFIED]:
    "Verified",
  [OrderDraft_ListingFilter_Option.ORDER_DRAFT_FILTER_OPTION_ADDRESS_UNVERIFIED]:
    "Unverified",
  [OrderDraft_ListingFilter_Option.ORDER_DRAFT_FILTER_OPTION_PRODUCT_MATCHED]:
    "Mapped",
  [OrderDraft_ListingFilter_Option.ORDER_DRAFT_FILTER_OPTION_PRODUCT_UNMATCHED]:
    "Unmapped",
  [OrderDraft_ListingFilter_Option.ORDER_DRAFT_FILTER_OPTION_HAS_GIFT_MESSAGE]:
    "Yes",
  [OrderDraft_ListingFilter_Option.ORDER_DRAFT_FILTER_OPTION_HAS_NO_GIFT_MESSAGE]:
    "No",
  [OrderDraft_ListingFilter_Option.ORDER_DRAFT_FILTER_OPTION_IS_DUPLICATED]:
    "Yes",
  [OrderDraft_ListingFilter_Option.ORDER_DRAFT_FILTER_OPTION_IS_NOT_DUPLICATED]:
    "No",
})

export const ApprovalOptions = [
  {
    text: AllOptionsFilterLabel[
      AllOptionsFilter.ORDER_DRAFT_FILTER_OPTION_APPROVED
    ],
    value: AllOptionsFilter.ORDER_DRAFT_FILTER_OPTION_APPROVED,
  },
  {
    text: AllOptionsFilterLabel[
      AllOptionsFilter.ORDER_DRAFT_FILTER_OPTION_UNAPPROVED
    ],
    value: AllOptionsFilter.ORDER_DRAFT_FILTER_OPTION_UNAPPROVED,
  },
]

export const AddressVerificationOptions = [
  {
    text: AllOptionsFilterLabel[
      AllOptionsFilter.ORDER_DRAFT_FILTER_OPTION_ADDRESS_VERIFIED
    ],
    value: AllOptionsFilter.ORDER_DRAFT_FILTER_OPTION_ADDRESS_VERIFIED,
  },
  {
    text: AllOptionsFilterLabel[
      AllOptionsFilter.ORDER_DRAFT_FILTER_OPTION_ADDRESS_UNVERIFIED
    ],
    value: AllOptionsFilter.ORDER_DRAFT_FILTER_OPTION_ADDRESS_UNVERIFIED,
  },
]

export const ProductMappingOptions = [
  {
    text: AllOptionsFilterLabel[
      AllOptionsFilter.ORDER_DRAFT_FILTER_OPTION_PRODUCT_MATCHED
    ],
    value: AllOptionsFilter.ORDER_DRAFT_FILTER_OPTION_PRODUCT_MATCHED,
  },
  {
    text: AllOptionsFilterLabel[
      AllOptionsFilter.ORDER_DRAFT_FILTER_OPTION_PRODUCT_UNMATCHED
    ],
    value: AllOptionsFilter.ORDER_DRAFT_FILTER_OPTION_PRODUCT_UNMATCHED,
  },
]

export const GiftMessageOptions = [
  {
    text: AllOptionsFilterLabel[
      AllOptionsFilter.ORDER_DRAFT_FILTER_OPTION_HAS_GIFT_MESSAGE
    ],
    value: AllOptionsFilter.ORDER_DRAFT_FILTER_OPTION_HAS_GIFT_MESSAGE,
  },
  {
    text: AllOptionsFilterLabel[
      AllOptionsFilter.ORDER_DRAFT_FILTER_OPTION_HAS_NO_GIFT_MESSAGE
    ],
    value: AllOptionsFilter.ORDER_DRAFT_FILTER_OPTION_HAS_NO_GIFT_MESSAGE,
  },
]

export const CreationMethodOptions = [
  {
    text: AllCreationMethodsLabel[AllCreationMethods.MANUAL],
    value: AllCreationMethods.MANUAL,
  },

  {
    text: AllCreationMethodsLabel[AllCreationMethods.IMPORT],
    value: AllCreationMethods.IMPORT,
  },

  {
    text: AllCreationMethodsLabel[AllCreationMethods.PULL],
    value: AllCreationMethods.PULL,
  },

  {
    text: AllCreationMethodsLabel[AllCreationMethods.API],
    value: AllCreationMethods.API,
  },
]

export const OrderDuplicatedOptionsSaleOrder = [
  {
    text: AllOptionsFilterLabel[Order_FilterOption.IS_DUPLICATED],
    value: Order_FilterOption.IS_DUPLICATED,
  },
  {
    text: AllOptionsFilterLabel[Order_FilterOption.IS_NOT_DUPLICATED],
    value: Order_FilterOption.IS_NOT_DUPLICATED,
  },
]
