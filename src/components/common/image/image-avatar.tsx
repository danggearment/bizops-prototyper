import DefaultAvatar from "@/assets/images/avatar/default-avatar.png"
import BoringAvatar from "@/components/common/boring-avatar/boring-avatar.tsx"
import { cn } from "@gearment/ui3"
import { AvatarProps } from "boring-avatars"

interface Props extends AvatarProps {
  className?: string
  url: string
  alt?: string
}

export default function ImageAvatar({ url, className, alt, ...props }: Props) {
  if (url) {
    return (
      <img
        className={cn("object-cover w-[240px] h-[240px]", className)}
        src={url}
        alt={alt}
        onError={({ currentTarget }) => {
          currentTarget.onerror = null // prevents looping
          currentTarget.src = DefaultAvatar
        }}
      />
    )
  }

  return (
    <BoringAvatar
      className={className}
      size="100%"
      square
      variant="bauhaus"
      name={alt}
      {...props}
    />
  )
}
