import { useObserver } from "@/hooks/use-observer"
import { useInfiniteQueryPod } from "@/services/connect-rpc/transport"
import { GMAttribute_Admin_Value } from "@/services/connect-rpc/types"
import { staffListGMAttributeValue } from "@gearment/nextapi/api/pod/v1/product_admin-ProductAdminAPI_connectquery"
import { useMemo } from "react"

const LIMIT = 30

export function useInfiniteExcludeAttributeValues(
  excludeAttributeGroupId: string,
  search?: string,
) {
  const { data, fetchNextPage, hasNextPage, isFetching, isPending } =
    useInfiniteQueryPod(
      staffListGMAttributeValue,
      {
        paging: {
          page: 1,
          limit: LIMIT,
        },
        filter: {
          excludeAttributeGroupKeys: [excludeAttributeGroupId],
        },
        search: {
          search: {
            case: "token",
            value: search ? search : "",
          },
        },
      },
      {
        enabled: !!excludeAttributeGroupId,
        pageParamKey: "paging",
        getNextPageParam: (lastPage, allPages) => {
          const page = lastPage.paging?.page || 1
          const totalPage = Number(lastPage.paging?.total || 0)
          return LIMIT * page < totalPage
            ? {
                page: allPages.length + 1,
                limit: LIMIT,
              }
            : undefined
        },
      },
    )

  const excludeAttributeValuesObserver = useObserver<HTMLDivElement>({
    onIntersect: (entry) => {
      if (entry.isIntersecting && hasNextPage && !isFetching) {
        fetchNextPage()
      }
    },
  })

  const excludeAttributeValues = useMemo(() => {
    return data
      ? data?.pages.reduce((acc: GMAttribute_Admin_Value[], page) => {
          return [...acc, ...page.data]
        }, [])
      : []
  }, [data])

  return {
    excludeAttributeValuesObserver,
    excludeAttributeValues,
    loadingExcludeAttributeValues: isPending,
  }
}
