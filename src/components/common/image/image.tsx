import DefaultImage from "@/assets/images/my/default-img.svg"
import { Skeleton, cn } from "@gearment/ui3"
import { cva, type VariantProps } from "class-variance-authority"
import { ImageIcon } from "lucide-react"
import React, { useState } from "react"
import { DialogViewImage } from "./dialog-view-image/dialog-view-image"

const imageProductVariants = cva(
  "relative flex justify-center items-center m-auto",
  {
    variants: {},
    defaultVariants: {},
  },
)

export interface ImageProps
  extends React.HtmlHTMLAttributes<HTMLDivElement>,
    VariantProps<typeof imageProductVariants> {
  url: string
  width?: number
  height?: number
  imgClassName?: string
  responsive?: "w" | "h"
  avatarHoverUrl?: string
  enableViewImage?: boolean
  onOpen?: () => void
}

function ImageBox({
  url,
  className,
  height,
  width,
  imgClassName,
  avatarHoverUrl,
  responsive,
  enableViewImage,
  onOpen,
  ...props
}: ImageProps) {
  const [imageLoaded, setImageLoaded] = useState(true)
  const [imageDimensions, setImageDimensions] = useState<{
    width: number
    height: number
  } | null>(null)
  const handleImageLoad = (
    event: React.SyntheticEvent<HTMLImageElement, Event>,
  ) => {
    const { naturalWidth, naturalHeight } = event.currentTarget
    setImageDimensions({ width: naturalWidth, height: naturalHeight })
    setImageLoaded(false)
  }

  const dynamicStyle = imageDimensions
    ? responsive === "w"
      ? {
          width: "100%",
          height: "auto",
        }
      : responsive === "h"
        ? {
            width: "auto",
            height: "100%",
          }
        : imageDimensions.width > imageDimensions.height
          ? {
              width: "100%",
              height: `calc(100% * ${imageDimensions.height / imageDimensions.width})`,
            }
          : {
              width: `calc(100% * ${imageDimensions.width / imageDimensions.height})`,
              height: "100%",
            }
    : {}
  return (
    <>
      <div
        style={{
          width,
        }}
        className={cn("w-full group")}
      >
        <div
          style={{
            paddingBottom: height,
            width,
          }}
          className={cn("w-full relative pb-[100%]")}
        >
          {!!url && (
            <Skeleton
              className={cn(
                imageProductVariants({
                  className,
                }),
                imageLoaded ? "block" : "hidden",
                "absolute top-0 bottom-0 left-0 right-0",
              )}
            >
              <div className="flex items-center justify-center w-full h-full bg-gray-100 p-[4px] rounded dark:bg-gray-500">
                <ImageIcon className="max-w-12 max-h-12 w-full h-full text-gray-500 dark:text-gray-100" />
              </div>
            </Skeleton>
          )}
          <div
            className={cn(
              imageProductVariants({ className }),
              "absolute top-0 bottom-0 left-0 right-0 ",
            )}
            onClick={() => {
              if (enableViewImage) {
                onOpen && onOpen()
              }
            }}
          >
            <ImageTag
              {...props}
              onLoad={handleImageLoad}
              style={dynamicStyle}
              imageLoaded={imageLoaded}
              imgClassName={cn("", imgClassName)}
              setImageLoaded={setImageLoaded}
              url={!url ? DefaultImage : url}
            />
            {avatarHoverUrl && (
              <ImageTag
                {...props}
                style={dynamicStyle}
                imageLoaded={imageLoaded}
                imgClassName={cn(
                  "absolute top-0 left-0 right-0 bottom-0",
                  "group-hover:opacity-100 opacity-0",
                  imgClassName,
                )}
                setImageLoaded={setImageLoaded}
                url={avatarHoverUrl}
              />
            )}
          </div>
        </div>
      </div>
    </>
  )
}

export interface ImageTagProps extends ImageProps {
  imageLoaded: boolean
  setImageLoaded: React.Dispatch<React.SetStateAction<boolean>>
}

function ImageTag({
  imageLoaded,
  imgClassName,
  setImageLoaded,
  url,
  ...props
}: ImageTagProps) {
  return (
    <img
      {...props}
      className={cn(imageLoaded ? "opacity-0" : "opacity-100", imgClassName)}
      src={url}
      alt=""
      onError={({ currentTarget }) => {
        setImageLoaded(false)
        currentTarget.onerror = null // prevents looping
        currentTarget.src = DefaultImage
      }}
    />
  )
}
export interface ImageContainerProps extends ImageProps {
  enableViewImage?: boolean
  originUrl?: string // Use for original design url in order detail
  showOriginUrl?: boolean // Use for show original design in order detail
  mediaPath?: string
  teamId?: string
  enableViewOriginalDesign?: boolean
  downloadTitle?: string
}

const Image = ({ enableViewImage = false, ...props }: ImageContainerProps) => {
  if (enableViewImage) {
    return <DialogViewImage {...props} enableViewImage={enableViewImage} />
  }
  return <ImageBox {...props} />
}

export { ImageBox, ImageTag }
export default Image
