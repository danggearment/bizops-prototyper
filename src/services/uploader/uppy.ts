import Uppy, { UppyEventMap, UppyFile, UppyOptions } from "@uppy/core"
import XHR from "@uppy/xhr-upload"
import ThumbnailGenerator, {
  ThumbnailGeneratorOptions,
} from "@uppy/thumbnail-generator"
import { publish } from "@/services/event/event.ts"

interface Constructor {
  debug?: boolean
}

type Meta = Record<string, string>
// The response from your server
type Body = Record<string, string>

export type MyUppyOptions = UppyOptions<Meta, Body>
export type MyUppyEventMap = UppyEventMap<Meta, Body>
export type MyUppy = Uppy<Meta, Body>
export type MyUppyFile = UppyFile<Meta, Body>

class Uploader {
  uploader: { [key: string]: MyUppy } = {}
  uploading: { [key: string]: boolean } = {}
  eventHandler: {
    [key: string]: {
      event: keyof MyUppyEventMap
      callback: MyUppyEventMap[keyof MyUppyEventMap]
    }[]
  } = {}
  debug: boolean = false

  constructor({ debug }: Constructor) {
    this.debug = debug || false
  }

  createUppy(
    id: string,
    options?: Omit<MyUppyOptions, "id">,
    thumbnailOption?: ThumbnailGeneratorOptions,
  ) {
    const uppy = new Uppy<Meta, Body>({
      id,
      ...options,
      debug: this.debug,
    })

    uppy.use(ThumbnailGenerator, thumbnailOption).use(XHR<Meta, Body>, {
      endpoint: "",
      method: "PUT",
    })
    this.uploader[id] = uppy
    this.eventHandler[id] = []
    this.uploading[id] = false

    this.on(id, "upload", () => {
      publish("uppy-uploading")
    })
    this.on(id, "complete", () => {
      publish("uppy-complete")
    })

    return uppy
  }

  on<K extends keyof MyUppyEventMap>(
    id: string,
    event: K,
    callback: MyUppyEventMap[K],
  ) {
    const uppy = this.uploader[id]
    if (uppy) {
      uppy.on(event, callback)
      if (event === "complete") {
        return
      }

      this.eventHandler[id].push({
        event: event,
        callback: callback,
      })
    }
  }
  off(id: string) {
    const uppy = this.uploader[id]
    const events = this.eventHandler[id]
    events.forEach((e) => uppy.off(e.event, e.callback))
  }

  getOrCreateUppy(
    id: string,
    options?: Omit<MyUppyOptions, "id">,
    thumbnailOption?: ThumbnailGeneratorOptions,
  ) {
    const uppy = this.uploader[id]
    if (uppy) {
      return uppy
    }
    return this.createUppy(id, options, thumbnailOption)
  }

  deleteInstance(id: string) {
    const uppy = this.uploader[id]
    if (uppy) {
      uppy.destroy()
    }
  }
}

export const uploader = new Uploader({})
