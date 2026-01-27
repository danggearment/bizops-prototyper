import { MyUppyFile } from "@/services/uploader/uppy"
import { File as ProtoFile } from "@gearment/nextapi/common/type/v1/file_pb"
import Uppy from "@uppy/core"

export const getOriginalImageUrl = async (previewImage?: ProtoFile) => {
  let files: MyUppyFile[] = []

  try {
    const uppy = new Uppy()
    if (previewImage) {
      const file = await fetch(previewImage.fileUrl)
        .then((response) => response.blob())
        .then((blob) => {
          return new File([blob], previewImage.fileName, {
            type: blob.type,
          })
        })
      uppy.addFile({
        name: previewImage.fileName,
        data: file,
        meta: {
          fileId: previewImage.fileId,
          filePath: previewImage.filePath,
        },
      })
      files = uppy.getFiles() as MyUppyFile[]
    }
  } catch (error) {
    return undefined
  }

  return files
}
