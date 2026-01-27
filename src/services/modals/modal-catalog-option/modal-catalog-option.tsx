import FileUploader from "@/components/common/file-uploader/file-uploader"
import { ACCEPT_FILE } from "@/constants/accept-file"
import {
  useMutationPod,
  useMutationStudio,
} from "@/services/connect-rpc/transport"
import {
  CatalogOption_Option_Status,
  GMProductOption_OptionType,
} from "@/services/connect-rpc/types"
import { MyUppyFile, uploader } from "@/services/uploader/uppy"
import { slugify } from "@/utils/format-string"
import { staffPreCreateCatalogOption } from "@gearment/nextapi/api/pod/v1/product_admin-ProductAdminAPI_connectquery"
import { staffUploadCatalogOptionMedia } from "@gearment/nextapi/api/studio/v1/media_admin-MediaAdminManagement_connectquery"
import { StaffUploadCatalogOptionMediaRequest } from "@gearment/nextapi/api/studio/v1/media_admin_pb"
import { File as ProtoFile } from "@gearment/nextapi/common/type/v1/file_pb"
import {
  Button,
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  InputField,
  Skeleton,
  Switch,
  toast,
} from "@gearment/ui3"
import { zodResolver } from "@hookform/resolvers/zod"
import { ImageIcon } from "lucide-react"
import {
  useEffect,
  useId,
  useMemo,
  useRef,
  useState,
  type Dispatch,
  type SetStateAction,
} from "react"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { useConfirmModal } from "../modal-confirm"
import { useModalCatalogOption } from "./modal-catalog-option-store"

const MAX_IMAGE_SIZE = 1024 * 50
const FILE_SIZE_ERROR_MESSAGE = "File size must be ≤ 50KB."
const HEX_COLOR_REGEX = /^#([0-9a-fA-F]{2}){3}$/

const hexColorSchema = z
  .string({ required_error: "Color code is required" })
  .min(1, "Color code is required")
  .regex(HEX_COLOR_REGEX, {
    message: "Invalid color format. Please use HEX format (e.g. #117BA9)",
  })

const previewImageSchema = z
  .array(z.custom<MyUppyFile>())
  .optional()
  .refine(
    (val) =>
      !val?.length || (val[0]?.data && val[0].data.size <= MAX_IMAGE_SIZE),
    { message: FILE_SIZE_ERROR_MESSAGE },
  )

export function getCatalogOptionSchema(type: GMProductOption_OptionType) {
  const base = {
    name: z
      .string()
      .min(1, "Value name is required")
      .max(50, "Value name must be less than 50 characters")
      .regex(
        /^[^@\$%\^\*]+$/,
        "Value name must contain only letters and numbers",
      ),
    code: z.string().min(1, "Auto-generated code based on value name."),
    status: z.nativeEnum(CatalogOption_Option_Status),
  }

  const materialExtra = {
    previewImage: previewImageSchema,
    previewImageId: z.string().optional(),
  }

  const colorExtra = {
    previewImage: previewImageSchema,
    previewImageId: z.string().optional(),
    hexColor: hexColorSchema,
  }

  const extras =
    type === GMProductOption_OptionType.MATERIAL
      ? materialExtra
      : type === GMProductOption_OptionType.COLOR
        ? colorExtra
        : {}

  return z.object({ ...base, ...extras })
}

export type CatalogOptionType = {
  name: string
  code: string
  status: CatalogOption_Option_Status
  previewImage?: MyUppyFile[]
  previewImageId?: string
  hexColor?: string
}

export function ModalCatalogOption() {
  const {
    open,
    actions,
    title,
    description,
    confirmText,
    type,
    onConfirm,
    defaultValues,
    previewImageUrl,
    groupId,
    productCount,
    variantCount,
  } = useModalCatalogOption()
  const uppyId = useId()
  const schema = useMemo(() => getCatalogOptionSchema(type), [type])

  const [fileImages, setFileImages] = useState<MyUppyFile[] | undefined>()

  const mediaIds = useRef<string[]>([])
  const uppy = useMemo(() => uploader.getOrCreateUppy(uppyId), [uppyId])

  const [setOpenConfirm, onClose] = useConfirmModal((state) => [
    state.setOpen,
    state.onClose,
  ])

  const [loading, setLoading] = useState(false)

  const form = useForm<CatalogOptionType>({
    defaultValues,
    resolver: zodResolver(schema),
  })

  const syncFileImageWithForm: Dispatch<
    SetStateAction<MyUppyFile[] | undefined>
  > = (value) => {
    const files = typeof value === "function" ? value(fileImages) : value
    setFileImages(files && files.length > 0 ? files : undefined)
    if (type === GMProductOption_OptionType.MATERIAL) {
      form.setValue(
        "previewImage",
        files && files.length > 0 ? files : undefined,
        {
          shouldValidate: true,
        },
      )
    }
  }

  const handleDeleteFile = () => {
    setFileImages(undefined)
    if (type === GMProductOption_OptionType.MATERIAL) {
      form.setValue("previewImage", undefined, {
        shouldValidate: true,
      })
    }
  }

  const hasDisplayColor = [GMProductOption_OptionType.COLOR].includes(type)

  const hasPreviewImage = [
    GMProductOption_OptionType.MATERIAL,
    GMProductOption_OptionType.COLOR,
  ].includes(type)

  const mutationUploadImage = useMutationStudio(staffUploadCatalogOptionMedia, {
    onError: (error) => {
      toast({
        variant: "error",
        title: "Upload failed",
        description: error.rawMessage,
      })
    },
  })

  const mutationPreCheckCode = useMutationPod(staffPreCreateCatalogOption, {
    onError: (error) => {
      toast({
        variant: "error",
        title: "Pre check code failed",
        description: error.rawMessage,
      })
    },
  })

  const handleUploadFilesToCloud = async (
    catalogOptionCode: string,
  ): Promise<ProtoFile[]> => {
    const formFiles: ProtoFile[] = []
    mediaIds.current = []
    const uppyFiles = uppy.getFiles()

    if (!uppyFiles?.length) return formFiles

    const uploadPromises = uppyFiles.map(async (file) => {
      const uploadData = new StaffUploadCatalogOptionMediaRequest({
        fileName: file.name,
        fileSize: BigInt(file.size ?? 0),
        catalogOptionCode,
      })

      try {
        let protoFile: ProtoFile | null = null
        let mediaId: string | null = null
        let uploadUrl: string
        let method: string

        const response = await mutationUploadImage.mutateAsync(uploadData)
        uploadUrl = response.uploadUrl
        method = response.method || "POST"

        if (response.mediaFile) {
          protoFile = response.mediaFile
          mediaId = response.mediaId
        }

        if (protoFile && mediaId) {
          formFiles.push(protoFile)
          mediaIds.current.push(mediaId)
        }

        uppy.setFileState(file.id, {
          xhrUpload: {
            method,
            endpoint: uploadUrl,
            formData: false,
          },
        })

        return { success: true, file: file.name }
      } catch (error) {
        console.error(`Failed to prepare upload for file ${file.name}:`, error)
        throw new Error(`Failed to prepare upload for file ${file.name}`)
      }
    })

    try {
      await Promise.all(uploadPromises)
      return formFiles
    } catch (error) {
      console.error(`Failed to prepare file uploads:`, error)
      throw new Error("Failed to prepare file uploads")
    }
  }

  const handleConfirmSubmit = async (
    values: CatalogOptionType,
    uploadedFiles: ProtoFile[],
  ) => {
    setLoading(true)
    if (hasPreviewImage && fileImages?.length) {
      toast({
        title: "Uploading files...",
        description: "Please wait while we upload your files.",
      })

      try {
        uploadedFiles = await handleUploadFilesToCloud(values.code)
        await uppy.upload()
      } catch (error) {
        setLoading(false)
        toast({
          variant: "error",
          title: "Upload failed",
          description: `Failed to upload files. Please try again. ${error}`,
        })
        return
      }
    }

    const payload = { ...values }

    if (hasPreviewImage) {
      payload.previewImageId = uploadedFiles[0]?.fileId
    } else {
      delete payload.previewImage
      delete payload.previewImageId
    }

    await onConfirm({
      ...payload,
      hexColor: payload.hexColor?.replace("#", "") ?? undefined,
    })
    setLoading(false)
  }

  const handleSubmit = async (values: CatalogOptionType) => {
    const uploadedFiles: ProtoFile[] = []
    const showUpdateConfirm = () => {
      setOpenConfirm({
        title: "Update this value will affect related variants",
        description: (
          <div className="space-y-4">
            <p>
              This option value "<b>{values.name}</b>" is currently being used
              by {variantCount} variants across {productCount} products.
            </p>
            <p>Updating it may change product and variant information.</p>
            <p>Do you want to proceed?</p>
          </div>
        ),
        confirmText: "Yes, update",
        onConfirm: () => {
          onClose()
          handleConfirmSubmit(values, uploadedFiles)
        },
      })
    }

    if (!defaultValues?.code) {
      const res = await mutationPreCheckCode.mutateAsync({
        groupId,
        code: values.code,
      })

      if (res.codeExists) {
        form.setError("code", {
          message:
            "Value code already exists in this group. Please enter a unique name.",
        })
        toast({
          variant: "error",
          title: "Value code already exists",
          description:
            "Cannot create option value. This name is already associated with existing variants. Please use a different name.",
        })
        return
      }

      handleConfirmSubmit(values, uploadedFiles)
      return
    }

    if (!productCount && !variantCount) {
      handleConfirmSubmit(values, uploadedFiles)
    } else {
      showUpdateConfirm()
    }
  }

  useEffect(() => {
    if (open) {
      form.reset(defaultValues)
      setFileImages(undefined)
    }
  }, [open])

  return (
    <Dialog open={open} onOpenChange={actions.onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>{description}</DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(handleSubmit)}
            className="space-y-4"
          >
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel required>Value name</FormLabel>
                  <FormControl>
                    <InputField
                      readOnly={!!defaultValues?.code}
                      disabled={!!defaultValues?.code}
                      {...field}
                      placeholder="Enter value name"
                      onChange={(e) => {
                        const value = e.target.value
                        field.onChange(value)
                        if (defaultValues?.code) {
                          return
                        }
                        const slug = slugify(value)
                        form.setValue("code", slug, {
                          shouldDirty: true,
                        })
                      }}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="code"
              render={({ field, formState }) => (
                <FormItem>
                  <FormLabel required>Value code</FormLabel>
                  <FormControl>
                    <InputField
                      readOnly
                      disabled
                      {...field}
                      placeholder="Enter value code"
                      onChange={(e) => {
                        const value = e.target.value
                        const slug = slugify(value)
                        field.onChange(slug)
                      }}
                    />
                  </FormControl>
                  {!formState.errors.code && (
                    <p className="text-sm text-muted-foreground/80">
                      Unique identifier for the value (auto generated from name)
                    </p>
                  )}

                  <FormMessage />
                </FormItem>
              )}
            />
            {hasDisplayColor && (
              <FormField
                control={form.control}
                name="hexColor"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel required>Display color</FormLabel>
                    <FormControl>
                      <div className="flex items-center w-full gap-2">
                        <InputField
                          {...field}
                          className="h-10 w-20"
                          type="color"
                          placeholder="#000000"
                        />
                        <div className="flex-1">
                          <InputField
                            {...field}
                            onChange={(e) => field.onChange(e.target.value)}
                            className="bg-gray-100"
                            placeholder="#000000"
                          />
                        </div>
                      </div>
                    </FormControl>

                    <FormMessage />
                  </FormItem>
                )}
              />
            )}
            {hasPreviewImage && (
              <FormField
                control={form.control}
                name="previewImage"
                render={({ field }) => (
                  <FormItem className="relative">
                    <FormLabel>Image</FormLabel>
                    <FormControl>
                      <div className="flex gap-2 items-center">
                        <div className="h-[108px] w-full flex items-center">
                          <FileUploader
                            {...field}
                            uppyId={uppyId}
                            files={fileImages}
                            setFiles={syncFileImageWithForm}
                            allowedFileTypes={ACCEPT_FILE}
                            supportText="Image (PNG, JPG, JPEG) file size up to 50KB allowed."
                            uploadText={
                              previewImageUrl
                                ? "Replace image"
                                : "Upload or drag image file here"
                            }
                            isPrefixName={false}
                            truncateFileName
                            maxFileNameLength={22}
                            onDelete={() => handleDeleteFile()}
                            onCheckFile={(file) => {
                              if (file.size > MAX_IMAGE_SIZE) {
                                form.setError("previewImage", {
                                  message: FILE_SIZE_ERROR_MESSAGE,
                                })
                                return false
                              }
                            }}
                          />
                        </div>

                        <div className="pb-3">
                          <div className="w-[120px] flex items-center justify-center">
                            {fileImages && fileImages.length > 0 ? (
                              fileImages.map((file) => {
                                const objectUrl = URL.createObjectURL(file.data)
                                return (
                                  <img
                                    key={file.id}
                                    src={objectUrl}
                                    alt={file.name}
                                    className="h-auto max-h-[92px] object-contain"
                                  />
                                )
                              })
                            ) : previewImageUrl ? (
                              <img
                                src={previewImageUrl}
                                alt={previewImageUrl}
                                className="h-auto max-h-[92px] object-contain"
                              />
                            ) : (
                              <Skeleton className="w-[120px] h-[92px] flex items-center justify-center">
                                <ImageIcon className="size-8 text-gray-500 dark:text-gray-100" />
                              </Skeleton>
                            )}
                          </div>
                        </div>
                      </div>
                    </FormControl>
                    <div className="absolute bottom-0 left-0">
                      <FormMessage />
                    </div>
                  </FormItem>
                )}
              />
            )}
            <FormField
              control={form.control}
              name="status"
              render={({ field }) => (
                <FormItem>
                  <div className="flex items-center justify-between gap-2">
                    <FormLabel>
                      <div className="space-y-1">
                        <div>Status</div>
                        <span className="text-sm text-muted-foreground/80">
                          Active values are available for selection
                        </span>
                      </div>
                    </FormLabel>
                    <FormControl>
                      <Switch
                        {...field}
                        checked={
                          field.value ===
                          CatalogOption_Option_Status.CATALOG_OPTION_STATUS_ACTIVE
                        }
                        onCheckedChange={(value) => {
                          field.onChange(
                            value
                              ? CatalogOption_Option_Status.CATALOG_OPTION_STATUS_ACTIVE
                              : CatalogOption_Option_Status.CATALOG_OPTION_STATUS_INACTIVE,
                          )
                        }}
                      />
                    </FormControl>
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="flex justify-end gap-2">
              <Button type="button" variant="outline" onClick={actions.onClose}>
                Cancel
              </Button>
              <Button type="submit" loading={loading} disabled={loading}>
                {confirmText}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}
