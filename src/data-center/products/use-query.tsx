import { useObserver } from "@/hooks/use-observer"
import { useInfiniteQueryPod } from "@/services/connect-rpc/transport"
import {
  CatalogOption_Group,
  CatalogOption_Option,
} from "@/services/connect-rpc/types"
import {
  staffListCatalogOption,
  staffListCatalogOptionGroup,
} from "@gearment/nextapi/api/pod/v1/product_admin-ProductAdminAPI_connectquery"
import { useMemo } from "react"

const LIMIT = 30

export function useInfiniteOptionGroups(search?: string) {
  const { data, fetchNextPage, hasNextPage, isFetching, isPending } =
    useInfiniteQueryPod(
      staffListCatalogOptionGroup,
      {
        paging: {
          page: 1,
          limit: LIMIT,
        },
        search: {
          search: {
            case: "name",
            value: search ? search : "",
          },
        },
      },
      {
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

  const optionGroupsObserver = useObserver<HTMLDivElement>({
    onIntersect: (entry) => {
      if (entry.isIntersecting && hasNextPage && !isFetching) {
        fetchNextPage()
      }
    },
  })

  const optionGroups = useMemo(() => {
    return data
      ? data?.pages.reduce((acc: CatalogOption_Group[], page) => {
          return [...acc, ...page.data]
        }, [])
      : []
  }, [data])

  return {
    optionGroupsObserver,
    optionGroups,
    loadingOptionGroups: isPending,
  }
}

export function useInfiniteCatalogOptions(groupId?: string, search?: string) {
  const { data, fetchNextPage, hasNextPage, isFetching, isPending } =
    useInfiniteQueryPod(
      staffListCatalogOption,
      {
        filter: {
          groupIds: groupId ? [groupId] : [],
        },
        search: {
          search: {
            case: "token",
            value: search ? search : "",
          },
        },
        paging: {
          page: 1,
          limit: LIMIT,
        },
      },
      {
        enabled: !!groupId,
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

  const catalogOptionsObserver = useObserver<HTMLDivElement>({
    onIntersect: (entry) => {
      if (entry.isIntersecting && hasNextPage && !isFetching) {
        fetchNextPage()
      }
    },
  })

  const catalogOptions = useMemo(() => {
    return data
      ? data?.pages.reduce((acc: CatalogOption_Option[], page) => {
          return [...acc, ...page.data]
        }, [])
      : undefined
  }, [data])

  return {
    catalogOptionsObserver,
    catalogOptions,
    loadingCatalogOptions: isPending,
  }
}
