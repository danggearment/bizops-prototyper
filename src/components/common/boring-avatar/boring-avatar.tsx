import { cn } from "@gearment/ui3"
import Avatar, { AvatarProps } from "boring-avatars"

export default function BoringAvatar(props: AvatarProps) {
  return (
    <div
      className={cn(
        props.square && "rounded border border-border overflow-hidden",
      )}
    >
      <Avatar
        size={40}
        variant="beam"
        name="Default name"
        colors={["#169DD8", "#22AD5C", "#FFD3B5", "#FFAAA6", "#FF8C94"]}
        {...props}
      />
    </div>
  )
}
