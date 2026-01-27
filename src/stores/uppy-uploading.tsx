import { create } from "zustand"

interface Props {
  loading: Record<string, boolean>
  setLoading: (uppyId: string, loading: boolean) => void
}
export const useUppyLoading = create<Props>((set) => ({
  loading: {},
  setLoading: (uppyId, loading) =>
    set((state) => ({
      loading: {
        ...state.loading,
        [uppyId]: loading,
      },
    })),
}))
