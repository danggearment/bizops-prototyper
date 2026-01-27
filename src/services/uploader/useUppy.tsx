import { useEffect } from "react"
import { useUppyLoading } from "@/stores/uppy-uploading"
import { subscribe, unsubscribe } from "../event/event"

export default function useUppy(uppyId: string) {
  const [uploading, setLoading] = useUppyLoading((state) => [
    state.loading,
    state.setLoading,
  ])
  useEffect(() => {
    const subScribeFunction = () => {
      setLoading(uppyId, true)
    }
    const unsubScribeFunction = () => setLoading(uppyId, false)

    subscribe("uppy-uploading", subScribeFunction)
    subscribe("uppy-complete", unsubScribeFunction)

    return () => {
      unsubscribe("uppy-uploading", subScribeFunction)
      unsubscribe("uppy-complete", unsubScribeFunction)
    }
  }, [])

  return [uploading[uppyId]]
}
